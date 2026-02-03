import { prisma } from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';
import { Prisma } from '@prisma/client';

/**
 * Inventory Service
 * Implements 3-Layer Protection against Race Conditions:
 * 1. Cart Reservation (DB reserved_stock)
 * 2. Optimistic Locking (DB Transaction)
 * 3. Real-time Sync (Pusher)
 */

export const inventoryService = {
    /**
     * Layer 1: Reserve stock when user adds to cart
     * Increments `reservedStock` only if `available - reserved >= qty`
     */
    async reserveStock(itemId: string, quantity: number): Promise<{ success: boolean; currentStock: number }> {
        try {
            // Raw query for atomic update with condition
            // "stock" used to be "inventoryCount"
            const count = await prisma.$executeRaw`
        UPDATE "MenuItem"
        SET "reservedStock" = "reservedStock" + ${quantity}
        WHERE "id" = ${itemId} 
          AND ("stock" - "reservedStock") >= ${quantity}
      `;

            if (count > 0) {
                // Fetch updated stock for UI
                const item = await prisma.menuItem.findUnique({
                    where: { id: itemId },
                    select: { stock: true, reservedStock: true }
                });

                return {
                    success: true,
                    currentStock: (item?.stock || 0) - (item?.reservedStock || 0)
                };
            }

            return { success: false, currentStock: 0 };
        } catch (error) {
            console.error('[Inventory] Reservation failed:', error);
            return { success: false, currentStock: 0 };
        }
    },

    /**
     * Release reservation (on cart expiry/removal)
     */
    async releaseReservation(itemId: string, quantity: number): Promise<void> {
        try {
            await prisma.menuItem.update({
                where: { id: itemId },
                data: {
                    reservedStock: { decrement: quantity }
                }
            });
        } catch (error) {
            console.error('[Inventory] Release failed:', error);
        }
    },

    /**
     * Layer 2: Optimistic Locking during Checkout
     * Must be called within a Prisma Transaction
     */
    async validateAndDeductStock(
        tx: Prisma.TransactionClient,
        itemId: string,
        quantity: number
    ): Promise<void> {
        // 1. Check current stock with row lock (implicit in update or explicit select)
        // We strictly check if we can fulfill this order.
        // NOTE: We decrement BOTH stock and reservedStock because the reservation is "consumed"
        // into a real order. If user didn't have a reservation (direct buy), we assume reservedStock
        // wasn't incremented for them specifically, but we still need to ensure safety.
        // 
        // Logic: If user HAD a reservation, reservedStock was +1. Purchasing means we remove that reservation -1
        // and remove actual stock -1.
        // If user DID NOT have reservation, we assume they are "filling" a spot. 
        // BUT to keep it simple: We decrement stock. We decrement reservedStock ONLY if this was a reserved flow.
        // For V1, let's assume ALL checkout items came from Cart Reservation flow, so we decrement both.

        // Safety check first
        const item = await tx.menuItem.findUnique({
            where: { id: itemId },
            select: { stock: true }
        });

        if (!item || item.stock < quantity) {
            throw new Error(`Insufficient stock for item ${itemId}`);
        }

        // Atomic Update with condition (Prisma where clause acts as optimistic lock check)
        const updated = await tx.menuItem.update({
            where: {
                id: itemId,
                stock: { gte: quantity }
            },
            data: {
                stock: { decrement: quantity },
                reservedStock: { decrement: quantity } // Releasing the reservation as we consume stock
            }
        });

        // Trigger Layer 3: Real-time update
        // We don't await this to keep transaction fast
        this.broadcastStockUpdate(itemId, updated.stock);
    },

    /**
     * Layer 3: Real-time Sync via Pusher
     */
    async broadcastStockUpdate(itemId: string, newStock: number) {
        try {
            await pusherServer.trigger('inventory-channel', 'stock-update', {
                itemId,
                stock: newStock,
                isAvailable: newStock > 0
            });
        } catch (error) {
            console.error('[Inventory] Broadcast failed:', error);
        }
    },

    /**
     * Cleanup Job: Release expired reservations
     * Call this from a Cron Job (e.g. /api/cron/cleanup)
     */
    async cleanupExpiredReservations() {
        // Logic dependent on how we track reservation time. 
        // For V1, we might just reset reservedStock if it gets stuck, 
        // or we need a specific Reservation table for precise time tracking.
        // PRD "Layer 1" says "Reserve stock for 5 minutes". 
        // Providing a basic safety reset here for now: 
        // In a real app, we'd query a "CartItem" table with proper timestamps.
        // For strict schema compliance only to MenuItem, we assume 'reservedStock' is transient.
        // This function is a placeholder for the worker logic.
    }
};
// Alias for compatibility
export const releaseStock = inventoryService.releaseReservation;
export const reserveStock = inventoryService.reserveStock;
