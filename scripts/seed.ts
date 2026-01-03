/**
 * Database Seed Script (Prisma)
 * Usage: npx ts-node --project tsconfig.seed.json scripts/seed.ts
 */

import { PrismaClient, MenuItemType, UserRole, PlanType } from '@prisma/client';

const prisma = new PrismaClient();

const MENU_ITEMS = [
    // South Indian Tiffins
    { id: '1', name: 'Idli', description: 'Steamed rice cakes (2 pcs)', price: 49, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },
    { id: '2', name: 'Ghee Podi Idli', description: 'Idli tossed in spicy podi & ghee', price: 69, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },
    { id: '3', name: 'Thatte Idli', description: 'Large flat idli', price: 49, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },
    { id: '4', name: 'Idli Sambar', description: 'Idli dipped in sambar', price: 59, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },
    { id: '5', name: 'Sambar Vada', description: 'Lentil donuts in sambar', price: 59, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },
    { id: '6', name: 'Upma', description: 'Savory semolina porridge', price: 59, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 30, isDoubleAllowed: true, imageUrl: '' },
    { id: '7', name: 'Mysore Bonda', description: 'Fried flour dumplings', price: 49, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },

    // Dosa
    { id: '8', name: 'Plain Dosa', description: 'Crispy savory crepe', price: 59, type: MenuItemType.BOTH, category: 'Dosa', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },
    { id: '9', name: 'Masala Dosa', description: 'Dosa with potato filling', price: 69, type: MenuItemType.BOTH, category: 'Dosa', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },
    { id: '10', name: 'Paneer Dosa', description: 'Dosa with spiced paneer', price: 109, type: MenuItemType.NORMAL_ONLY, category: 'Dosa', isVeg: true, isAvailable: true, inventoryCount: 30, isDoubleAllowed: false, imageUrl: '' },
    { id: '11', name: 'Set Dosa', description: 'Soft spongy dosas (set of 2)', price: 99, type: MenuItemType.BOTH, category: 'Dosa', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },

    // Rice
    { id: '12', name: 'Lemon Rice', description: 'Tangy lemon flavored rice', price: 69, type: MenuItemType.BOTH, category: 'Rice', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },
    { id: '13', name: 'Curd Rice', description: 'Rice with yogurt and tempering', price: 59, type: MenuItemType.BOTH, category: 'Rice', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },
    { id: '14', name: 'Veg Biryani', description: 'Served with Mirchi Ka Salan', price: 129, type: MenuItemType.NORMAL_ONLY, category: 'Rice', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: false, imageUrl: '' },

    // North Indian
    { id: '15', name: 'Aloo Paratha', description: 'Stuffed potato flatbread', price: 59, type: MenuItemType.BOTH, category: 'North Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },
    { id: '16', name: 'Chole Bhature', description: 'Fried bread with chickpea curry', price: 149, type: MenuItemType.NORMAL_ONLY, category: 'North Indian', isVeg: true, isAvailable: true, inventoryCount: 30, isDoubleAllowed: false, imageUrl: '' },
    { id: '17', name: 'Puri Bhaji', description: 'Fried bread with potato curry', price: 99, type: MenuItemType.BOTH, category: 'North Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },

    // Snacks
    { id: '18', name: 'Mirchi Bajji', description: 'Stuffed chilli fritters', price: 49, type: MenuItemType.BOTH, category: 'Snacks', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },
    { id: '19', name: 'Punugulu', description: 'Deep fried rice batter balls', price: 49, type: MenuItemType.BOTH, category: 'Snacks', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },

    // Beverages
    { id: '20', name: 'Filter Coffee', description: 'Classic South Indian coffee', price: 29, type: MenuItemType.BOTH, category: 'Beverages', isVeg: true, isAvailable: true, inventoryCount: 100, isDoubleAllowed: true, imageUrl: '' },
    { id: '21', name: 'Tea', description: 'Masala Chai', price: 19, type: MenuItemType.BOTH, category: 'Beverages', isVeg: true, isAvailable: true, inventoryCount: 100, isDoubleAllowed: true, imageUrl: '' },
    { id: '22', name: 'Lassi', description: 'Sweet yogurt drink', price: 59, type: MenuItemType.BOTH, category: 'Beverages', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },

    // Chaat
    { id: '23', name: 'Pani Puri', description: 'Hollow balls with spicy water', price: 20, type: MenuItemType.BOTH, category: 'Chaat', isVeg: true, isAvailable: true, inventoryCount: 100, isDoubleAllowed: true, imageUrl: '' },
    { id: '24', name: 'Dahi Puri', description: 'Puri filled with yogurt', price: 30, type: MenuItemType.BOTH, category: 'Chaat', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },

    // Desserts
    { id: '25', name: 'Gulab Jamun', description: 'Sweet syrup dumplings', price: 59, type: MenuItemType.NORMAL_ONLY, category: 'Dessert', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },
    { id: '26', name: 'Waffles', description: 'Freshly baked waffles', price: 120, type: MenuItemType.NORMAL_ONLY, category: 'Dessert', isVeg: true, isAvailable: true, inventoryCount: 20, isDoubleAllowed: false, imageUrl: '' }
];

async function seed() {
    console.log('🌱 Starting Database Seed (Prisma)...');

    // 1. Seed Menu Items
    for (const item of MENU_ITEMS) {
        await prisma.menuItem.upsert({
            where: { id: item.id },
            update: item,
            create: item,
        });
    }
    console.log('✅ Menu Items seeded');

    // 2. Seed Test User
    const testUserId = 'test-user-123';
    const user = await prisma.user.upsert({
        where: { id: testUserId },
        update: {},
        create: {
            id: testUserId,
            name: 'Test Student',
            phone: '1234567890',
            email: 'student@iimnagpur.edu.in',
            role: UserRole.CUSTOMER,
            walletBalance: 500,
        },
    });
    console.log('✅ Test User seeded');

    // 3. Seed Subscription
    const existingSub = await prisma.userSubscription.findFirst({
        where: { userId: testUserId, isActive: true }
    });

    if (!existingSub) {
        await prisma.userSubscription.create({
            data: {
                userId: testUserId,
                planType: PlanType.MONTHLY_MESS,
                monthlyQuota: 60,
                mealsConsumedThisMonth: 0,
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                isActive: true
            }
        });
        console.log('✅ User Subscription seeded');
    } else {
        console.log('ℹ️ Subscription already exists');
    }

    // 4. Seed Admin User
    const adminPhone = '9999999999';
    await prisma.user.upsert({
        where: { phone: adminPhone },
        update: { role: UserRole.ADMIN }, // Ensure role is ADMIN if exists
        create: {
            name: 'Admin',
            phone: adminPhone,
            role: UserRole.ADMIN,
            email: 'admin@cafe.com',
        },
    });
    console.log('✅ Admin User seeded (Phone: 9999999999)');

    console.log('🚀 Database setup complete!');
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
