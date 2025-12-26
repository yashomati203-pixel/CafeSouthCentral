
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Deleting OrderItems...");
        await prisma.orderItem.deleteMany({});

        console.log("Deleting Orders...");
        await prisma.order.deleteMany({});

        console.log("All orders cleared successfully.");
    } catch (e) {
        console.error("Error clearing orders:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
