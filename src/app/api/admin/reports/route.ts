import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const period = req.nextUrl.searchParams.get('period') || 'day';

        // Calculate date range based on period
        const now = new Date();
        let startDate = new Date();

        switch (period) {
            case 'day':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }

        // Fetch orders in date range
        const orders = await prisma.order.findMany({
            where: {
                status: {
                    in: ['SOLD', 'DONE', 'COMPLETED']
                },
                createdAt: {
                    gte: startDate
                }
            },
            include: {
                items: {
                    include: {
                        menuItem: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        phone: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Calculate statistics
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = orders.length;

        // Item-wise breakdown
        const itemStats = new Map<string, {
            name: string;
            quantity: number;
            revenue: number;
        }>();

        orders.forEach(order => {
            order.items.forEach(item => {
                const existing = itemStats.get(item.menuItemId) || {
                    name: item.name,
                    quantity: 0,
                    revenue: 0
                };
                existing.quantity += item.quantity;
                existing.revenue += item.price * item.quantity;
                itemStats.set(item.menuItemId, existing);
            });
        });

        const topItems = Array.from(itemStats.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        // Payment method breakdown
        const paymentBreakdown = orders.reduce((acc, order) => {
            const method = order.paymentMethod || 'CASH';
            acc[method] = (acc[method] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return NextResponse.json({
            period,
            startDate,
            endDate: now,
            totalRevenue,
            totalOrders,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            topItems,
            paymentBreakdown,
            orders: orders.map(o => ({
                id: o.displayId || o.id,
                date: o.createdAt,
                amount: o.totalAmount,
                items: o.items.length,
                customer: o.user.name
            }))
        });

    } catch (error: any) {
        console.error('Reports Failed:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}
