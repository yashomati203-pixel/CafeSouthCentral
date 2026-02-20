import { prisma } from '../lib/prisma';
import { MenuItemType, OrderMode, OrderStatus, SubscriptionState, PaymentMethodType } from '@prisma/client';
import { validateAndBookSlot } from './slotService';
import { createRazorpayOrder } from './paymentService';
import { reserveStock, releaseStock } from './inventoryService';
import { generateOrderDisplayId } from '@/lib/order-utils';

interface CartItem {
    menuItemId: string;
    qty: number;
}

/**
 * Saga Pattern: Create Normal Order
 * 1. Optimistic Stock Check (Redis)
 * 2. Create Order in DB (PENDING_PAYMENT)
 * 3. Decrement Stock (Redis)
 * 4. Initiate Razorpay (Return to Client)
 * 
 * Compensation: If any step fails, we release stock.
 */
export async function createNormalOrder(
    userId: string,
    items: CartItem[],
    note?: string,
    timeSlotId?: string,
    paymentMethod: string = 'ONLINE'
) {
    // 1. Optimistic Stock Check & Price Calculation
    // We do this BEFORE any DB transaction to fail fast.
    let totalAmount = 0;
    const orderItemsPreview: any[] = [];

    // We need to fetch items to get prices
    const menuItems = await prisma.menuItem.findMany({
        where: { id: { in: items.map(i => i.menuItemId) } }
    });

    // 1a. Validate Time Slot (if provided)
    if (timeSlotId) {
        const now = new Date();
        const [hours, minutes] = timeSlotId.split(':').map(Number);
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);

        // Handle case where scheduled time is for tomorrow (e.g., ordering at 11 PM for 1 AM)
        // For simplicity in V1, we assume same-day or next-day if time < now
        if (scheduledTime < now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        const diffHours = (scheduledTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (diffHours < 0 || diffHours > 3) {
            throw new Error('Scheduled time must be within 3 hours from now.');
        }
    }

    for (const itemReq of items) {
        const item = menuItems.find(i => i.id === itemReq.menuItemId);
        if (!item) throw new Error(`Item not found (ID: ${itemReq.menuItemId}). Please clear cart.`);
        if (!item.isAvailable) throw new Error(`Item ${item.name} is inactive`);

        // Optimistic check (Peek Redis)
        // const currentStock = await getStock(item.id); 
        // if(currentStock < itemReq.qty) throw new Error(`Item ${item.name} out of stock`);

        totalAmount += item.price * itemReq.qty;
        orderItemsPreview.push({ ...item, qty: itemReq.qty });
    }

    // 2. Create Order in Pending State (Prisma Transaction for Order + Items)
    // We generate Display ID here.
    return prisma.$transaction(async (tx) => {
        const displayId = await generateOrderDisplayId(tx);

        // Determine initial status based on Payment Method
        // Cash orders are Auto-Confirmed
        const initialStatus = (totalAmount === 0 || paymentMethod === 'CASH')
            ? OrderStatus.CONFIRMED
            : OrderStatus.PENDING_PAYMENT;

        const newOrder = await tx.order.create({
            data: {
                userId,
                displayId,
                status: initialStatus,
                mode: OrderMode.NORMAL,
                totalAmount,
                // header: ... (Removed: field does not exist in schema)
                paymentMethod: paymentMethod === 'CASH' ? PaymentMethodType.CASH : undefined,
                note,
                timeSlot: timeSlotId,
                items: {
                    create: orderItemsPreview.map(i => ({
                        menuItemId: i.id,
                        price: i.price,
                        quantity: i.qty,
                        name: i.name
                    }))
                }
            }
        });

        // 3. Reserve Stock (Redis Atomic) - The "Hard" Reservation
        // If this fails, we must abort the transaction (throw error)
        for (const itemReq of items) {
            const reserved = await reserveStock(itemReq.menuItemId, itemReq.qty);
            if (!reserved) {
                // SAGA COMPENSATION: 
                // We failed to reserve this item. We must release any *previously* reserved items in this loop?
                // Current `reserveStock` implementation is atomic per item. 
                // Simpler approach: If one fails, throw Error. 
                // Prisma transaction will rollback the Order creation.
                // BUT we must also release stock for items *already* processed in this loop?
                // For Version 1, we assume clean failure. 
                // Note: Ideally `reserveStock` for ALL items should be a single Lua script.
                // Here, if item 2 fails, item 1 is already decremented in Redis.
                // We MUST release item 1.
                // Quick fix: Loop back and release.
                for (const prevItem of items) {
                    if (prevItem === itemReq) break; // Stop at current
                    await releaseStock(prevItem.menuItemId, prevItem.qty);
                }
                throw new Error(`Insufficient stock for ${menuItems.find(i => i.id === itemReq.menuItemId)?.name}`);
            }
        }

        // 4. Initiate Payment (ONLY IF ONLINE & > 0)
        let razorpayOrder: any = null;
        if (totalAmount > 0 && paymentMethod !== 'CASH') {
            try {
                razorpayOrder = await createRazorpayOrder(totalAmount, newOrder.displayId || newOrder.id);

                // Update Order with Payment ID
                await tx.order.update({
                    where: { id: newOrder.id },
                    data: { paymentId: razorpayOrder.id }
                });
            } catch (e) {
                // Compensation: Release Stock if Payment Init fails
                for (const i of items) await releaseStock(i.menuItemId, i.qty);
                throw new Error("Payment Gateway Initialization Failed");
            }
        }

        // For CASH orders, maybe trigger a notification or print job here if needed
        // Assuming strictly API response for now.

        return {
            orderId: newOrder.id,
            displayId: newOrder.displayId,
            totalAmount,
            status: newOrder.status,
            razorpayOrderId: razorpayOrder?.id,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID
        };
    });
}


/**
 * Subscription Order (Refactored for Consistency)
 */
export async function createSubscriptionOrder(userId: string, items: CartItem[], note?: string, timeSlotId?: string) {
    const today = new Date().toISOString().split('T')[0];

    return prisma.$transaction(async (tx) => {
        // 1. Quota & Sub Check (DB Side)
        const sub = await tx.userSubscription.findFirst({
            where: { userId, status: SubscriptionState.ACTIVE }
        });
        if (!sub) throw new Error('No active subscription');

        // 1a. Validate Time Slot (if provided)
        if (timeSlotId) {
            const now = new Date();
            const [hours, minutes] = timeSlotId.split(':').map(Number);
            const scheduledTime = new Date();
            scheduledTime.setHours(hours, minutes, 0, 0);

            if (scheduledTime < now) {
                scheduledTime.setDate(scheduledTime.getDate() + 1);
            }

            const diffHours = (scheduledTime.getTime() - now.getTime()) / (1000 * 60 * 60);
            if (diffHours < 0 || diffHours > 3) {
                throw new Error('Scheduled time must be within 3 hours from now.');
            }
        }

        const dailyUsage = await tx.dailyUsage.upsert({
            where: { userId_date: { userId, date: today } },
            create: { userId, date: today, itemsRedeemedCount: 0 },
            update: {}
        });

        const totalQty = items.reduce((Acc, i) => Acc + i.qty, 0);

        if (sub.creditsUsed + totalQty > sub.creditsTotal) throw new Error("Monthly Quota Exceeded");
        if (dailyUsage.itemsRedeemedCount + totalQty > sub.dailyLimit) throw new Error("Daily Limit Exceeded");

        // 2. Redis Reservation
        for (const itemReq of items) {
            const reserved = await reserveStock(itemReq.menuItemId, itemReq.qty);
            if (!reserved) {
                // Compensation loop
                for (const prevItem of items) {
                    if (prevItem === itemReq) break;
                    await releaseStock(prevItem.menuItemId, prevItem.qty);
                }
                throw new Error(`Insufficient stock`);
            }
        }

        // 3. Create Order
        const displayId = await generateOrderDisplayId(tx);
        const newOrder = await tx.order.create({
            data: {
                userId, displayId,
                status: OrderStatus.CONFIRMED,
                mode: OrderMode.SUBSCRIPTION,
                totalAmount: 0,
                note,
                timeSlot: timeSlotId,
                items: {
                    create: await Promise.all(items.map(async i => {
                        const m = await prisma.menuItem.findUnique({ where: { id: i.menuItemId } });
                        return { menuItemId: i.menuItemId, name: m!.name, price: 0, quantity: i.qty };
                    }))
                }
            }
        });

        // 4. Update Usage
        await tx.userSubscription.update({
            where: { id: sub.id },
            data: { creditsUsed: { increment: totalQty } }
        });
        await tx.dailyUsage.update({
            where: { id: dailyUsage.id },
            data: { itemsRedeemedCount: { increment: totalQty } }
        });

        return { orderId: newOrder.id, displayId: newOrder.displayId, status: newOrder.status };
    }).then(async (result) => {
        import('../lib/pusher').then(({ pusherServer }) => {
            pusherServer.trigger('orders', 'new-order', {
                id: result.orderId, displayId: result.displayId, status: result.status
            }).catch(e => console.error(e));
        });
        return result;
    });
}
