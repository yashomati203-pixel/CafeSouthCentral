import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        // Optional auth check - only enforce for admin dashboard
        const userHeader = req.headers.get('x-user-data');
        const isPublicAccess = req.nextUrl.searchParams.get('public') === 'true';

        if (!isPublicAccess && userHeader) {
            const user = JSON.parse(userHeader);
            if (user.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        // Get all completed/sold orders
        const orders = await prisma.order.findMany({
            where: {
                status: {
                    in: ['SOLD', 'DONE', 'COMPLETED']
                }
            },
            include: {
                items: {
                    include: {
                        menuItem: true
                    }
                }
            }
        });

        // Aggregate statistics
        const itemStats = new Map<string, {
            id: string;
            name: string;
            totalQuantity: number;
            orderCount: number;
            totalRevenue: number;
            category: string;
        }>();

        orders.forEach(order => {
            order.items.forEach(item => {
                const existing = itemStats.get(item.menuItemId) || {
                    id: item.menuItemId,
                    name: item.name,
                    totalQuantity: 0,
                    orderCount: 0,
                    totalRevenue: 0,
                    category: item.menuItem?.category || 'Unknown'
                };

                existing.totalQuantity += item.quantity;
                existing.orderCount += 1;
                existing.totalRevenue += item.price * item.quantity;

                itemStats.set(item.menuItemId, existing);
            });
        });

        // Convert to array and sort by total quantity
        const stats = Array.from(itemStats.values()).sort(
            (a, b) => b.totalQuantity - a.totalQuantity
        );

        return NextResponse.json({
            stats,
            totalOrders: orders.length,
            topSelling: stats.slice(0, 5)
        });

    } catch (error: any) {
        console.error('Analytics Failed:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}
