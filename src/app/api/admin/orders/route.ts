import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {

        const orders = await prisma.order.findMany({
            select: {
                id: true,
                displayId: true,
                status: true,
                totalAmount: true,
                createdAt: true,
                timeSlot: true,
                mode: true,
                note: true,
                user: {
                    select: {
                        name: true,
                        phone: true,
                        subscriptions: {
                            where: { status: 'ACTIVE' },
                            select: { id: true },
                            take: 1
                        }
                    }
                },
                items: {
                    select: {
                        name: true,
                        quantity: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
