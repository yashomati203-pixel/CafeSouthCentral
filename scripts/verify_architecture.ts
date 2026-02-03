import { prisma } from '../src/lib/prisma';
import { createNormalOrder, createSubscriptionOrder } from '../src/services/orderService';
import { getActiveSlots } from '../src/services/slotService';

async function main() {
    console.log("Starting Verification...");

    // 1. Setup Test Data
    console.log("Creating Test Slot & Item...");
    const slot = await prisma.slot.create({
        data: {
            name: "Test Slot",
            startTime: "10:00",
            endTime: "11:00",
            maxOrders: 1, // Strict limit for testing
            bookedOrders: 0
        }
    });

    const item = await prisma.menuItem.create({
        data: {
            name: "Test Burger",
            price: 100,
            type: "NORMAL",
            category: "Snacks",
            inventoryCount: 10
        }
    });

    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found");

    // 2. Test Normal Order (Should Success)
    console.log("Testing Normal Order...");
    const result1 = await createNormalOrder(
        user.id,
        [{ menuItemId: item.id, qty: 1 }],
        "Test Note",
        slot.id
    );
    console.log("Order 1 Created:", result1.status);

    // 3. Test Slot Capacity (Should Fail)
    console.log("Testing Slot Capacity (Should Fail)...");
    try {
        await createNormalOrder(
            user.id,
            [{ menuItemId: item.id, qty: 1 }],
            "Test Note 2",
            slot.id
        );
        console.error("❌ FAILED: Slot should be full!");
    } catch (e: any) {
        console.log("✅ SUCCESS: Slot is full caught error:", e.message);
    }

    // 4. Test Inventory Deduction
    const itemAfter = await prisma.menuItem.findUnique({ where: { id: item.id } });
    console.log("Inventory After Order 1:", itemAfter?.inventoryCount);
    if (itemAfter?.inventoryCount !== 9) console.error("❌ Inventory mismatch!");
    else console.log("✅ Inventory Correct.");

    // Cleanup
    await prisma.orderItem.deleteMany({ where: { menuItemId: item.id } });
    await prisma.order.deleteMany({ where: { userId: user.id } }); // Caution: deletes all user orders
    await prisma.menuItem.delete({ where: { id: item.id } });
    await prisma.slot.delete({ where: { id: slot.id } });
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
