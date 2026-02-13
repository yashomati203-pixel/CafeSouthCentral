/**
 * Shared Order Utilities
 * Ensures consistent order ID generation across Web and POS systems
 */

/**
 * Generate sequential display ID in format: MMM24-0001
 * Uses transaction context to ensure atomicity
 */
export async function generateOrderDisplayId(tx: any) {
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
            const nextVal = parseInt(parts[1], 10);
            if (!isNaN(nextVal)) nextNum = nextVal + 1;
        }
    }

    return `${prefix}-${nextNum.toString().padStart(4, '0')}`;
}
