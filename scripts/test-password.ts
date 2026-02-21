
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying Admin Password...');
    const admin = await prisma.user.findFirst({
        where: { phone: '9999999999' }
    });

    if (!admin || !admin.passwordHash) {
        console.log('Admin user not found or no hash');
        return;
    }

    const start = Date.now();
    try {
        const isValid = await argon2.verify(admin.passwordHash, 'AdminPassword123!');
        console.log(`Verification Result: ${isValid}`);
        console.log(`Time taken: ${Date.now() - start}ms`);
    } catch (e) {
        console.error('Verify error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
