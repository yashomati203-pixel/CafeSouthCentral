import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    console.log('🔍 Checking Orders...');
    const count = await prisma.order.count();
    console.log(`Total Orders: ${count}`);

    const orders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true, items: true }
    });

    console.log('Recent Orders:');
    orders.forEach(o => {
        console.log(`- ID: ${o.id}, Status: ${o.status}, User: ${o.user?.name}, Items: ${o.items.length}`);
    });
}

check()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
