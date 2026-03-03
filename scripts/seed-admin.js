const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding default Admin...');

    const email = 'admin@cafesouthcentral.com';
    const phone = '9999999999';
    const password = 'admin'; // simple password for testing

    const existingAdmin = await prisma.user.findFirst({
        where: { OR: [{ email }, { phone }] }
    });

    if (existingAdmin) {
        if (!existingAdmin.passwordHash) {
            console.log('Admin user exists but lacks a password hash. Updating...');
            const passwordHash = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: existingAdmin.id },
                data: { passwordHash, role: 'SUPER_ADMIN' }
            });
            console.log('Admin password updated successfully. Can login with:', email, 'and password:', password);
        } else {
            console.log('Admin user already exists and has a password. Skipping...');
        }
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
        data: {
            name: 'Super Admin',
            email,
            phone,
            passwordHash,
            role: 'SUPER_ADMIN'
        }
    });

    console.log('Admin seeded successfully:', admin.email);
    console.log('You can now log in with Email: admin@cafesouthcentral.com, Password: admin');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
