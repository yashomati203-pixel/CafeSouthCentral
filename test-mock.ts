const { prisma } = require('./src/lib/prisma.ts');

async function test() {
    try {
        console.log("Testing Mock Prisma...");
        const items = await prisma.menuItem.findMany({ orderBy: { name: 'asc' } });
        console.log("Found items:", items.length);
    } catch (e) {
        console.error("Test failed:", e);
    }
}
test();
