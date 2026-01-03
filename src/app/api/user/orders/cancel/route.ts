import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus, MenuItemType } from '@prisma/client';

export async function POST(req: Request) {
    try {
        const { orderId, userId } = await req.json();

        if (!orderId || !userId) {
            return NextResponse.json({ error: 'Order ID and User ID required' }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.userId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Check Status
        if (order.status === OrderStatus.CANCELLED) {
            return NextResponse.json({ error: 'Order already cancelled' }, { status: 400 });
        }
        if (order.status === OrderStatus.SOLD || order.status === OrderStatus.DONE) {
            return NextResponse.json({ error: 'Cannot cancel completed order' }, { status: 400 });
        }

        // Check Time (2 minutes)
        const createdAt = new Date(order.createdAt).getTime();
        const now = Date.now();
        const diffMinutes = (now - createdAt) / 60000;

        if (diffMinutes > 2) {
            return NextResponse.json({ error: 'Cancellation window (2 mins) expired' }, { status: 400 });
        }

        // Execute Cancellation Transaction
        await prisma.$transaction(async (tx) => {
            // 1. Update Order Status
            await tx.order.update({
                where: { id: orderId },
                data: { status: OrderStatus.CANCELLED }
            });

            // 2. Restore Inventory
            for (const item of order.items) {
                await tx.menuItem.update({
                    where: { id: item.menuItemId },
                    data: { inventoryCount: { increment: item.quantity } }
                });
            }

            // 3. Restore Quota (If Subscription)
            if (order.mode === 'SUBSCRIPTION') {
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                const today = new Date(order.createdAt).toISOString().split('T')[0];

                // Restore Daily Usage
                // We find the usage record for that user/date
                // Ideally this should exist if they ordered
                const dailyUsage = await tx.dailyUsage.findUnique({
                    where: { userId_date: { userId, date: today } }
                });

                if (dailyUsage) {
                    await tx.dailyUsage.update({
                        where: { id: dailyUsage.id },
                        data: { itemsRedeemedCount: { decrement: totalItems } }
                    });
                }

                // Restore Monthly Subscription Quota
                // We need to find the active subscription that was used.
                // Simplified: Find current active subscription. (Edge case: sub expired exactly between order and cancel? Unlikely in 2 mins)
                const subscription = await tx.userSubscription.findFirst({
                    where: { userId, isActive: true }
                });

                if (subscription) {
                    await tx.userSubscription.update({
                        where: { id: subscription.id },
                        data: { mealsConsumedThisMonth: { decrement: totalItems } }
                    });
                }
            }
        });

        return NextResponse.json({ success: true, message: 'Order cancelled successfully' });

    } catch (error) {
        console.error('Cancellation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
