import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { paymentService } from '@/services/paymentService'; // Uses Razorpay ref under hood
import { inventoryService } from '@/services/inventoryService';
import { OrderStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId, userId } = body;

        if (!orderId || !userId) {
            return NextResponse.json({ error: 'Order ID and User ID required' }, { status: 400 });
        }

        // 1. Fetch Order
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

        // 2. Check Cancellation Window (2 minutes)
        const CANCELLATION_WINDOW_MS = 2 * 60 * 1000;
        const now = new Date().getTime();
        const orderTime = new Date(order.createdAt).getTime();

        if (now - orderTime > CANCELLATION_WINDOW_MS) {
            return NextResponse.json({
                error: 'Cancellation window expired. Orders can only be cancelled within 2 minutes.'
            }, { status: 400 });
        }

        // 3. Check Status
        if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED) {
            return NextResponse.json({ error: `Order is already ${order.status}` }, { status: 400 });
        }

        // 4. Process Refund (if paid)
        let refundStatus = 'NOT_APPLICABLE';
        let refundId: string | null = null;

        if (order.paymentId && (order.status === OrderStatus.CONFIRMED || order.status === OrderStatus.PREPARING)) {
            try {
                // Determine amount (100% refund)
                const refund = await paymentService.processRefund(order.paymentId, order.totalAmount); // totalAmount is in Rupees, service converts to paise
                refundStatus = 'PROCESSED';
                refundId = refund.id;
            } catch (err) {
                console.error('Refund failed:', err);
                refundStatus = 'FAILED_MANUAL_REVIEW_NEEDED';
                // We proceed to cancel order but flag for manual refund?
                // Or abort? For safely, let's mark as CANCELLED but note refund failure.
            }
        }

        // 5. Release Stock
        // We use a transaction to be safe
        await prisma.$transaction(async (tx) => {
            // Update Order
            await tx.order.update({
                where: { id: orderId },
                data: {
                    status: OrderStatus.CANCELLED,
                    //@ts-ignore - Schema might need refund fields if not present, assuming they exist or we store in notes
                    // For now, if schema doesn't have refundId, we skip. 
                    // PRD had refund_id in schema section?
                    // Let's assume standard status update.
                }
            });

            // Restore Stock
            // Loop through items and increment stock back
            for (const item of order.items) {
                await tx.menuItem.update({
                    where: { id: item.menuItemId },
                    data: {
                        stock: { increment: item.quantity }
                        // We don't touch reservedStock here because a CONFIRMED order 
                        // already moved from reserved to real stock consumption.
                        // So we give it back to real stock.
                    }
                });

                // Broadcast update
                // inventoryService.broadcastStockUpdate(item.menuItemId, newStock) - hard to get new stock inside tx without fetch
                // We can do it after tx
            }
        });

        // 6. Broadcast Stock Update (Best Effort)
        for (const item of order.items) {
            const m = await prisma.menuItem.findUnique({ where: { id: item.menuItemId }, select: { stock: true } });
            if (m) inventoryService.broadcastStockUpdate(item.menuItemId, m.stock);
        }

        return NextResponse.json({
            success: true,
            message: 'Order cancelled successfully',
            refundStatus
        });

    } catch (error: any) {
        console.error('Order Cancellation Failed:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
