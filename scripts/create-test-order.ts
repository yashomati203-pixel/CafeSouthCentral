import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestOrder() {
    console.log('📝 Creating Test Live Order...');

    // Ensure we have a user
    let user = await prisma.user.findFirst();
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: 'Test User',
                phone: '9999999999',
                role: 'CUSTOMER'
            }
        });
    }

    // Get a menu item
    const item = await prisma.menuItem.findFirst();
    if (!item) {
        console.error('No menu items found. Seed database first.');
        return;
    }

    const order = await prisma.order.create({
        data: {
            displayId: 'TEST-001',
            userId: user.id,
            status: 'CONFIRMED', // Vital for Live View
            totalAmount: item.price,
            paymentMethod: 'CASH',
            mode: 'NORMAL',
            note: 'Test POS Order',
            items: {
                create: {
                    menuItemId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: 1
                }
            }
        }
    });

    console.log(`✅ Created Order #${order.displayId} with status ${order.status}`);
}

createTestOrder()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
