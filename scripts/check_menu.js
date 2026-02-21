const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMenu() {
    try {
        const count = await prisma.menuItem.count();
        console.log(`Menu Items Count: ${count}`);

        if (count > 0) {
            const first = await prisma.menuItem.findFirst();
            console.log('First Item ID:', first.id);
        } else {
            console.log('Database has NO menu items.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkMenu();
