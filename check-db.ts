
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.menuItem.count();
    console.log(`Total Menu Items: ${count}`);
    const items = await prisma.menuItem.findMany({ take: 5 });
    console.log('First 5 items:', items);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
