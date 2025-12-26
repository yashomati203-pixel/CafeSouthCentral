import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing DB connection...');
    try {
        const count = await prisma.user.count();
        console.log(`Connection successful! User count: ${count}`);
        const users = await prisma.user.findMany({ take: 1 });
        console.log('Fetched one user:', users);
    } catch (error) {
        console.error('DB Connection Failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
