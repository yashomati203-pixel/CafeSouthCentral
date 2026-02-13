import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        // Auth Check
        const userHeader = req.headers.get('x-user-data');
        const isPublicAccess = req.nextUrl.searchParams.get('public') === 'true';
        const timeframe = req.nextUrl.searchParams.get('timeframe') || 'week'; // 'today' | 'week' | 'month'
        const customStartDate = req.nextUrl.searchParams.get('startDate');
        const customEndDate = req.nextUrl.searchParams.get('endDate');

        if (!isPublicAccess && userHeader) {
            const user = JSON.parse(userHeader);
            if (user.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        // Determine Date Range
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date();

        // Use custom dates if provided
        if (customStartDate && customEndDate) {
            startDate = new Date(customStartDate);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(customEndDate);
            endDate.setHours(23, 59, 59, 999);
        } else {
            // Use timeframe logic
            if (timeframe === 'today') {
                startDate.setHours(0, 0, 0, 0);
            } else if (timeframe === 'month') {
                startDate.setDate(now.getDate() - 30);
            } else {
                // Default 'week'
                startDate.setDate(now.getDate() - 7);
            }
        }

        // 1. Fetch Key Data (Filtered by Date)
        // Orders (Completed/Sold)
        const orders = await prisma.order.findMany({
            where: {
                status: {
                    in: ['CONFIRMED', 'PREPARING', 'READY', 'COMPLETED']
                },
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                items: { include: { menuItem: true } }
            }
        });

        // Users
        const totalUsers = await prisma.user.count();
        const newUsers = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        createdAt: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                    {
                        role: 'CUSTOMER'
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Feedbacks (All time for now, or filtered? Usually sentiment is ongoing, but let's filter relevant to recent exp)
        // For sentiment, often better to show all-time or larger window, but let's stick to the requested filter for consistency if meaningful.
        // Actually, sentiment on "Today" might be empty. Let's keep sentiment potentially broader or matching. 
        // Let's filter sentiment by date too to see "How are we doing TODAY vs LAST WEEK".
        const feedbacks = await prisma.feedback.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        // 2. Calculate KPIs
        const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

        // 3. Sales Over Time Chart
        let salesChart = { labels: [] as string[], data: [] as number[] };

        if (timeframe === 'today') {
            // Hourly breakdown
            const hourlyMap = new Array(24).fill(0);
            orders.forEach(o => {
                const h = new Date(o.createdAt).getHours();
                hourlyMap[h] += o.totalAmount;
            });
            // Generate labels for hours 8 AM to 10 PM (operating hours approx, or just non-zero?)
            // Let's show all for simplicity or a range.
            salesChart.labels = Array.from({ length: 24 }, (_, i) => i + ':00'); // 0:00 to 23:00
            salesChart.data = hourlyMap;
        } else {
            // Daily breakdown (Last 7 or 30 days)
            const salesOverTimeMap = new Map<string, number>();
            const daysToLookBack = timeframe === 'month' ? 30 : 7;

            for (let i = daysToLookBack - 1; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                salesOverTimeMap.set(d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }), 0);
            }

            orders.forEach(o => {
                const dayName = new Date(o.createdAt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
                // Note: If distinct days have same "Short Weekday", checking date is safer. 
                // Using localeDateString with day numeric helps uniqueness in month view.
                if (salesOverTimeMap.has(dayName)) {
                    salesOverTimeMap.set(dayName, (salesOverTimeMap.get(dayName) || 0) + o.totalAmount);
                }
            });
            salesChart.labels = Array.from(salesOverTimeMap.keys());
            salesChart.data = Array.from(salesOverTimeMap.values());
        }

        // 4. Top Selling Items
        const itemStats = new Map<string, {
            id: string;
            name: string;
            totalQuantity: number;
        }>();

        orders.forEach(order => {
            order.items.forEach(item => {
                const existing = itemStats.get(item.menuItemId) || {
                    id: item.menuItemId,
                    name: item.name,
                    totalQuantity: 0,
                };
                existing.totalQuantity += item.quantity;
                itemStats.set(item.menuItemId, existing);
            });
        });

        const topItems = Array.from(itemStats.values())
            .sort((a, b) => b.totalQuantity - a.totalQuantity)
            .slice(0, 5);

        const maxQty = topItems.length > 0 ? topItems[0].totalQuantity : 1;
        const topSellingItems = topItems.map(i => ({
            name: i.name,
            count: i.totalQuantity,
            width: `${Math.round((i.totalQuantity / maxQty) * 100)}%`
        }));

        // 5. Peak Performance Hours (Filtered by timeframe orders)
        const hourCounts = new Array(24).fill(0);
        orders.forEach(o => {
            const h = new Date(o.createdAt).getHours();
            hourCounts[h]++;
        });

        const peakHoursData = [
            { time: '8am', count: hourCounts[8] + hourCounts[9] },
            { time: '10am', count: hourCounts[10] + hourCounts[11] },
            { time: '12pm', count: hourCounts[12] + hourCounts[13] },
            { time: '2pm', count: hourCounts[14] + hourCounts[15] },
            { time: '4pm', count: hourCounts[16] + hourCounts[17] },
            { time: '6pm', count: hourCounts[18] + hourCounts[19] + hourCounts[20] },
        ];

        const maxPeak = Math.max(...peakHoursData.map(p => p.count), 1);
        const peakHours = peakHoursData.map(p => ({
            time: p.time,
            height: `${Math.round((p.count / maxPeak) * 100)}%`,
            opacity: `opacity-${Math.max(20, Math.round((p.count / maxPeak) * 100))}`
        }));

        // 6. Customer Sentiment
        const avgRating = feedbacks.length > 0
            ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
            : "0.0";

        const positive = feedbacks.filter(f => f.rating >= 4).length;
        const neutral = feedbacks.filter(f => f.rating === 3).length;
        const negative = feedbacks.filter(f => f.rating <= 2).length;
        const totalFeedbacks = feedbacks.length || 1;

        const sentiment = {
            average: avgRating,
            positivePct: Math.round((positive / totalFeedbacks) * 100),
            neutralPct: Math.round((neutral / totalFeedbacks) * 100),
            negativePct: Math.round((negative / totalFeedbacks) * 100),
        };

        return NextResponse.json({
            kpi: {
                totalRevenue,
                avgOrderValue: Math.round(avgOrderValue),
                newCustomers: newUsers.length,
                totalOrders: orders.length
            },
            salesChart,
            topSellingItems,
            peakHours,
            sentiment,
            newCustomersList: newUsers
        });

    } catch (error: any) {
        console.error('Analytics Failed:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}
