import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("API: Fetching orders...");
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    include: {
                        subscriptions: {
                            where: { isActive: true },
                            take: 1
                        }
                    }
                },
                items: {
                    include: {
                        menuItem: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log(`API: Fetched ${orders.length} orders`);
        return NextResponse.json(orders);
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
