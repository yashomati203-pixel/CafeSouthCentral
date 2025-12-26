
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Attempting to run route.ts query...");
        const orders = await prisma.order.findMany({
            include: {
                user: true,
                items: {
                    include: {
                        menuItem: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });
        console.log(`Success! Retrieved ${orders.length} orders.`);
        if (orders.length > 0) {
            console.log("First order sample:", JSON.stringify(orders[0], null, 2));
        }
    } catch (error) {
        console.error("Query Failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
