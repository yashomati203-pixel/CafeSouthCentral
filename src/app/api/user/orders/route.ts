import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: userId
            },
            select: {
                id: true,
                displayId: true,
                createdAt: true,
                status: true,
                mode: true,
                paymentMethod: true,
                totalAmount: true,
                timeSlot: true,
                // Order items
                items: {
                    select: {
                        name: true,
                        quantity: true,
                        price: true,
                        menuItem: true // Fetch full menu item data for Reorder logic
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        return NextResponse.json({ error: 'Failed to fetch user orders' }, { status: 500 });
    }
}
