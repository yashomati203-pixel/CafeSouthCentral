
import { PrismaClient, MenuItemType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const item = {
        id: '1',
        name: 'Idli',
        description: 'Steamed rice cakes (2 pcs)',
        price: 49,
        type: MenuItemType.BOTH,
        category: 'South Indian',
        isVeg: true,
        isAvailable: true,
        stock: 50,
        imageUrl: ''
    };

    try {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: item,
            create: item,
        });
        console.log("Success!");
    } catch (e) {
        console.error(e);
    }
}

main().finally(() => prisma.$disconnect());
