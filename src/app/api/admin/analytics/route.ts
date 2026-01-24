import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        // Auth Check
        const userHeader = req.headers.get('x-user-data');
        const isPublicAccess = req.nextUrl.searchParams.get('public') === 'true';

        if (!isPublicAccess && userHeader) {
            const user = JSON.parse(userHeader);
            if (user.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        // 1. Fetch Key Data
        // Orders (Completed/Sold)
        const orders = await prisma.order.findMany({
            where: {
                status: { in: ['SOLD', 'DONE', 'COMPLETED'] }
            },
            include: {
                items: { include: { menuItem: true } }
            }
        });

        // Users
        const totalUsers = await prisma.user.count();
        const newUsers = await prisma.user.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
                }
            }
        });

        // Feedbacks
        const feedbacks = await prisma.feedback.findMany();

        // 2. Calculate KPIs
        const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

        // 3. Sales Over Time (Last 7 Days)
        const salesOverTimeMap = new Map<string, number>();
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            salesOverTimeMap.set(d.toLocaleDateString('en-US', { weekday: 'short' }), 0);
        }

        orders.forEach(o => {
            const dayName = new Date(o.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
            if (salesOverTimeMap.has(dayName)) {
                salesOverTimeMap.set(dayName, (salesOverTimeMap.get(dayName) || 0) + o.totalAmount);
            }
        });

        // Convert map to arrays for chart
        const salesChart = {
            labels: Array.from(salesOverTimeMap.keys()),
            data: Array.from(salesOverTimeMap.values())
        };

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

        // Calculate percentages for bar width
        const maxQty = topItems.length > 0 ? topItems[0].totalQuantity : 1;
        const topSellingItems = topItems.map(i => ({
            name: i.name,
            count: i.totalQuantity,
            width: `${Math.round((i.totalQuantity / maxQty) * 100)}%`
        }));

        // 5. Peak Performance Hours
        const hourCounts = new Array(24).fill(0);
        orders.forEach(o => {
            const h = new Date(o.createdAt).getHours();
            hourCounts[h]++;
        });

        // We want specific buckets: 8am, 10am, 12pm, 2pm, 4pm, 6pm (roughly 2 hour windows)
        const peakHoursData = [
            { time: '8am', count: hourCounts[8] + hourCounts[9] },
            { time: '10am', count: hourCounts[10] + hourCounts[11] },
            { time: '12pm', count: hourCounts[12] + hourCounts[13] },
            { time: '2pm', count: hourCounts[14] + hourCounts[15] },
            { time: '4pm', count: hourCounts[16] + hourCounts[17] },
            { time: '6pm', count: hourCounts[18] + hourCounts[19] + hourCounts[20] }, // Evening rush
        ];

        const maxPeak = Math.max(...peakHoursData.map(p => p.count), 1);
        const peakHours = peakHoursData.map(p => ({
            time: p.time,
            height: `${Math.round((p.count / maxPeak) * 100)}%`,
            opacity: `opacity-${Math.max(20, Math.round((p.count / maxPeak) * 100))}` // dynamic opacity
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
                newCustomers: newUsers,
                totalOrders: orders.length
            },
            salesChart, // { labels: [], data: [] }
            topSellingItems, // [{name, count, width}]
            peakHours, // [{time, height, opacity}]
            sentiment
        });

    } catch (error: any) {
        console.error('Analytics Failed:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}
