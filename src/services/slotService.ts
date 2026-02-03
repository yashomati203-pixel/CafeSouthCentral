import { prisma } from '@/lib/prisma';

export async function getActiveSlots() {
    // Return all active slots, ordered by time
    // In strict mode, we might filter by time > now
    return await prisma.slot.findMany({
        where: { isActive: true },
        orderBy: { startTime: 'asc' }
    });
}

export async function validateAndBookSlot(slotId: string, quantity: number, tx: any) {
    // Atomic check and update
    // We strive to prevent overbooking.
    // Logic: UPDATE Slot SET bookedOrders = bookedOrders + qty WHERE id=slotId AND bookedOrders + qty <= maxOrders

    // Prisma updateMany returns count.
    // Use raw query for atomicity:
    // UPDATE "Slot" SET "bookedOrders" = "bookedOrders" + $1 WHERE "id" = $2 AND "bookedOrders" + $1 <= "maxOrders"

    // The Issue: `lte: maxOrders` in where clause compares against a constant, not the column `maxOrders`. 
    // Since maxOrders varies per slot, we cannot use a static number in `where`.

    // Workaround: 
    // Use raw query for atomicity:
    // UPDATE "Slot" SET "bookedOrders" = "bookedOrders" + $1 WHERE "id" = $2 AND "bookedOrders" + $1 <= "maxOrders"

    const count = await tx.$executeRaw`
        UPDATE "Slot" 
        SET "bookedOrders" = "bookedOrders" + ${quantity} 
        WHERE "id" = ${slotId} 
          AND ("bookedOrders" + ${quantity}) <= "maxOrders"
    `;

    if (count === 0) {
        throw new Error('Selected time slot is full. Please choose another.');
    }

    return true;
}
