import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { status } = await req.json();

        const updatedOrder = await prisma.order.update({
            where: { id: params.id },
            data: { status: status as OrderStatus },
            include: { user: true }
        });

        // Send Push Notification if Ready
        if ((status === 'DONE' || status === 'READY') && updatedOrder.user?.fcmToken) {
            try {
                // Dynamically import to avoid build errors if lib is missing during dev
                const { messaging } = await import('@/lib/firebase-admin');
                await messaging.send({
                    token: updatedOrder.user.fcmToken,
                    notification: {
                        title: 'Order Ready! 🍽️',
                        body: `Order #${updatedOrder.displayId || updatedOrder.id.slice(0, 5)} is ready for pickup.`
                    }
                });
            } catch (e) {
                console.error("Failed to send push notification", e);
            }
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Failed to update order:", error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
