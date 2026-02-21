
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.menuItem.count();
    console.log(`Total Menu Items: ${count}`);
    const items = await prisma.menuItem.findMany({ select: { id: true, name: true } });
    console.log(JSON.stringify(items, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
