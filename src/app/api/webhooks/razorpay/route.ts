import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { releaseStock } from '@/services/inventoryService';

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();
        const signature = req.headers.get('x-razorpay-signature');

        if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
            console.error("WEBHOOK_SECRET missing");
            return NextResponse.json({ error: 'Config Error' }, { status: 500 });
        }

        if (!signature) {
            return NextResponse.json({ error: 'No Signature' }, { status: 400 });
        }

        // Verify Signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(bodyText)
            .digest('hex');

        if (expectedSignature !== signature) {
            console.error("Invalid Webhook Signature");
            return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 });
        }

        const event = JSON.parse(bodyText);
        const { payload } = event;

        if (event.event === 'payment.captured' || event.event === 'order.paid') {
            const razorpayOrderId = payload.payment.entity.order_id;
            const paymentId = payload.payment.entity.id;

            // Saga Step: Complete Order
            const order = await prisma.order.findFirst({
                where: { paymentId: razorpayOrderId } // We search by RP Order ID (stored in paymentId field temporarily or create new field?)
                // NOTE: In createOrder, we stored RP Order ID in 'paymentId'. 
                // That's acceptable for mapping.
            });

            if (order && order.status === OrderStatus.PENDING_PAYMENT) {
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        status: OrderStatus.CONFIRMED,
                        paymentId: paymentId // Update with actual Payment ID? Or keep Order ID?
                        // Let's store "RP_ORDER_ID|RP_PAYMENT_ID" or just keep the successful Payment ID
                    }
                });

                // Trigger Real-time update
                import('@/lib/pusher').then(({ pusherServer }) => {
                    pusherServer.trigger('orders', 'order-update', {
                        id: order.id, status: OrderStatus.CONFIRMED
                    });
                });

                // Trigger WhatsApp Notification
                import('@/services/whatsappService').then(({ whatsappNotifications }) => {
                    prisma.user.findUnique({ where: { id: order.userId } }).then(u => {
                        if (u) {
                            whatsappNotifications.sendOrderConfirmation(
                                u.phone,
                                u.name || 'Valued Guest',
                                order.displayId || order.id,
                                order.totalAmount
                            ).catch(e => console.error('WA Error:', e));
                        }
                    });
                });
            }
        } else if (event.event === 'payment.failed') {
            const razorpayOrderId = payload.payment.entity.order_id;

            // Saga Compensation: Release Stock
            const order = await prisma.order.findFirst({
                where: { paymentId: razorpayOrderId }
            });

            if (order && order.status === OrderStatus.PENDING_PAYMENT) {
                // 1. Release Inventory
                const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
                for (const item of items) {
                    await releaseStock(item.menuItemId, item.quantity);
                }

                // 2. Mark Payment Failed
                await prisma.order.update({
                    where: { id: order.id },
                    data: { status: 'PAYMENT_FAILED' as OrderStatus } // Ensure Schema has this
                });
            }
        }

        return NextResponse.json({ received: true });
    } catch (e) {
        console.error("Webhook Error", e);
        return NextResponse.json({ error: 'Webhook Handler Failed' }, { status: 500 });
    }
}
