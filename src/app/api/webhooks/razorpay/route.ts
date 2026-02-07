import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();
        const signature = req.headers.get('x-razorpay-signature');
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        // 1. Security Check
        if (!secret || !signature) {
            console.error('[Razorpay Webhook] Missing secret or signature');
            return NextResponse.json({ error: 'Config missing' }, { status: 500 });
        }

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(bodyText)
            .digest('hex');

        if (expectedSignature !== signature) {
            console.error('[Razorpay Webhook] Invalid Signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // 2. Parse Event
        const event = JSON.parse(bodyText);
        const { event: eventName, payload } = event;

        // 3. Handle Events
        if (eventName === 'order.paid') {
            const razorpayOrderId = payload.order.entity.id;
            const razorpayPaymentId = payload.payment.entity.id; // The actual payment transaction ID

            // Find our order
            // Note: We stored access to our DB Order via the Razorpay Order ID in the 'paymentId' field?
            // Wait, createNormalOrder stores: data: { paymentId: razorpayOrder.id }
            // So yes, Order.paymentId = "order_..."

            const order = await prisma.order.findFirst({
                where: { paymentId: razorpayOrderId }
            });

            if (order) {
                // Idempotency check
                if (order.status === OrderStatus.PENDING_PAYMENT) {
                    await prisma.order.update({
                        where: { id: order.id },
                        data: {
                            // Auto-advance to PREPARING as it means "Paid and ready for kitchen".
                            status: OrderStatus.PREPARING
                        }
                    });

                    // Trigger Real-time Event for Kitchen
                    await pusherServer.trigger('orders', 'status-update', {
                        id: order.id,
                        displayId: order.displayId,
                        status: OrderStatus.PREPARING
                    });
                }
            } else {
                console.warn(`[Razorpay Webhook] Order not found for Razorpay Order ID: ${razorpayOrderId}`);
            }
        } else if (eventName === 'payment.failed') {
            // Handle payment failure logic if needed (e.g., notify user)
            // Usually handled by frontend catching the error, but this is a backup.
            const razorpayOrderId = payload.payment.entity.order_id;
            // Might want to log this.
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error) {
        console.error('[Razorpay Webhook] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
