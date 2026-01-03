import { prisma } from '../lib/prisma';
import { MenuItemType, OrderMode, OrderStatus, MenuItem } from '@prisma/client';

interface CartItem {
    menuItemId: string;
    qty: number;
}

async function generateOrderDisplayId(tx: any) {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = now.getFullYear().toString().slice(-2);
    const prefix = `${month}${year}`;

    const lastOrder = await tx.order.findFirst({
        where: { displayId: { startsWith: prefix } },
        orderBy: { createdAt: 'desc' }
    });

    let nextNum = 1;
    if (lastOrder?.displayId) {
        const parts = lastOrder.displayId.split('-');
        if (parts[1]) {
            const lastNum = parseInt(parts[1]);
            if (!isNaN(lastNum)) nextNum = lastNum + 1;
        }
    }

    return `${prefix}-${nextNum.toString().padStart(4, '0')}`;
}

export async function createSubscriptionOrder(userId: string, items: CartItem[], note?: string, timeSlot?: string) {
    // Date string for today: YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // We transactionally:
    // 1. Get Subscription (ensure Active)
    // 2. Get/Create DailyUsage (lock?)
    // 3. Check Limits
    // 4. Check Items & Update Inventory
    // 5. Create Order & OrderItems
    // 6. Update Usage & Subscription

    return prisma.$transaction(async (tx) => {
        // 1. Fetch Subscription
        const subscription = await tx.userSubscription.findFirst({
            where: { userId, isActive: true }
        });

        if (!subscription) {
            throw new Error('No active subscription found.');
        }

        // 2. Fetch or Create Daily Usage
        let dailyUsage = await tx.dailyUsage.findUnique({
            where: { userId_date: { userId, date: today } }
        });

        // If not exists, create it now (so we can lock or update it)
        if (!dailyUsage) {
            dailyUsage = await tx.dailyUsage.create({
                data: {
                    userId,
                    date: today,
                    itemsRedeemedCount: 0
                }
            });
        }

        // Count orders for today? We need to query Order table
        const ordersTodayCount = await tx.order.count({
            where: {
                userId,
                createdAt: {
                    gte: new Date(today) // simplified, strictly should use Start of Day in TZ
                },
                mode: OrderMode.SUBSCRIPTION
            }
        });

        // 3. Validation: Total Items Count
        const totalNewItems = items.reduce((sum, item) => sum + item.qty, 0);
        // Removed Daily Limit Checks as per request

        if (subscription.mealsConsumedThisMonth + totalNewItems > subscription.monthlyQuota) {
            throw new Error('Monthly quota exceeded.');
        }

        if (subscription.mealsConsumedThisMonth + totalNewItems > subscription.monthlyQuota) {
            throw new Error('Monthly quota exceeded.');
        }

        // 4. Validate Individual Items & Inventory
        const orderItemsData = [];

        for (const itemReq of items) {
            const menuItem = await tx.menuItem.findUnique({
                where: { id: itemReq.menuItemId }
            });

            if (!menuItem) throw new Error(`Menu item ${itemReq.menuItemId} not found.`);

            // Rule: Subscription Only
            if (menuItem.type !== MenuItemType.SUBSCRIPTION && menuItem.type !== MenuItemType.BOTH) {
                throw new Error(`Item ${menuItem.name} is not available for Subscription.`);
            }

            // Rule: Double Allowed
            if (!menuItem.isDoubleAllowed && itemReq.qty > 1) {
                throw new Error(`You can only take 1 quantity of ${menuItem.name} per order/day in subscription.`);
            }
            // For strict daily check of double allowed, we'd need to query previous orders today.
            // Implemented simple per-order check here as per original code.

            if (menuItem.isDoubleAllowed && itemReq.qty > 2) {
                throw new Error(`Max 2 units allowed for ${menuItem.name}.`);
            }

            // Rule: Inventory
            if (menuItem.inventoryCount < itemReq.qty) {
                throw new Error(`Insufficient inventory for ${menuItem.name}.`);
            }

            // Deduct Inventory
            await tx.menuItem.update({
                where: { id: menuItem.id },
                data: { inventoryCount: { decrement: itemReq.qty } }
            });

            orderItemsData.push({
                menuItemId: menuItem.id,
                name: menuItem.name,
                price: 0, // Subscription items are free
                quantity: itemReq.qty
            });
        }

        // 5. Update Usage & Subscription
        await tx.dailyUsage.update({
            where: { id: dailyUsage.id },
            data: { itemsRedeemedCount: { increment: totalNewItems } }
        });

        const result = await tx.userSubscription.updateMany({
            where: {
                id: subscription.id,
                mealsConsumedThisMonth: { lte: subscription.monthlyQuota - totalNewItems }
            },
            data: { mealsConsumedThisMonth: { increment: totalNewItems } }
        });

        if (result.count === 0) {
            throw new Error('Transaction Failed: Monthly quota limit reached (Concurrency Protection).');
        }

        // 6. Create Order
        const displayId = await generateOrderDisplayId(tx);
        const newOrder = await tx.order.create({
            data: {
                userId,
                displayId,
                status: OrderStatus.RECEIVED,
                mode: OrderMode.SUBSCRIPTION,
                note: note || undefined,
                timeSlot: timeSlot || undefined,
                totalAmount: 0,
                items: {
                    create: orderItemsData
                }
            }
        });

        return { orderId: newOrder.id, displayId: newOrder.displayId, status: 'SUCCESS' };
    });
}

export async function createNormalOrder(
    userId: string,
    items: CartItem[],
    paymentMethod?: string,
    upiId?: string,
    note?: string,
    timeSlot?: string
) {
    // Transactional Order Creation
    return prisma.$transaction(async (tx) => {
        let totalAmount = 0;
        const orderItemsData = [];

        for (const itemReq of items) {
            const menuItem = await tx.menuItem.findUnique({
                where: { id: itemReq.menuItemId }
            });

            if (!menuItem) throw new Error(`Menu item ${itemReq.menuItemId} not found.`);

            // Inventory Check
            if (menuItem.inventoryCount < itemReq.qty) {
                throw new Error(`Insufficient inventory for ${menuItem.name}.`);
            }

            // Deduct Inventory
            await tx.menuItem.update({
                where: { id: menuItem.id },
                data: { inventoryCount: { decrement: itemReq.qty } }
            });

            const itemTotal = menuItem.price * itemReq.qty;
            totalAmount += itemTotal;

            orderItemsData.push({
                menuItemId: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: itemReq.qty
            });
        }

        // Create Order
        const displayId = await generateOrderDisplayId(tx);

        const newOrder = await tx.order.create({
            data: {
                userId,
                displayId,
                status: OrderStatus.RECEIVED, // Assume paid/confirmed for now
                mode: OrderMode.NORMAL,
                totalAmount,
                paymentMethod,
                paymentDetails: upiId, // Map upiId to paymentDetails
                note: note || undefined,
                timeSlot: timeSlot || undefined,
                items: {
                    create: orderItemsData
                }
            }
        });

        return { orderId: newOrder.id, displayId: newOrder.displayId, totalAmount, status: 'SUCCESS' };
    });
}
