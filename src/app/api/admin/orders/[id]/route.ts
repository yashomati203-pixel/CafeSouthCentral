import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { status } = await req.json();

        let updateData: any = { status };

        // Handle Rescheduling specifically
        if (status.startsWith('RESCHEDULED:')) {
            const time = status.split('RESCHEDULED: ')[1];
            updateData = {
                status: 'CONFIRMED', // Keep as confirmed but update note
                note: `Rescheduled for pickup in ${time}`
            };
        } else {
            updateData = { status: status as OrderStatus };
        }

        const updatedOrder = await prisma.order.update({
            where: { id: params.id },
            data: updateData,
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

        // WhatsApp Notification if Ready
        if (status === 'READY') {
            import('@/services/whatsappService').then(({ whatsappNotifications }) => {
                whatsappNotifications.sendOrderReady(
                    updatedOrder.user.phone,
                    updatedOrder.user.name || 'Customer',
                    updatedOrder.displayId || updatedOrder.id
                ).catch(e => console.error('WhatsApp Error:', e));
            });
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Failed to update order:", error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
