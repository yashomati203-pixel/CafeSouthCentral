const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const MOCK_MENU = [
    // South Indian Tiffins
    { id: '1', name: 'Idli', description: 'Steamed rice cakes (2 pcs)', price: 49, type: 'BOTH', category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },
    { id: '2', name: 'Ghee Podi Idli', description: 'Idli tossed in spicy podi & ghee', price: 69, type: 'BOTH', category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },
    { id: '3', name: 'Thatte Idli', description: 'Large flat idli', price: 49, type: 'BOTH', category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },
    { id: '4', name: 'Idli Sambar', description: 'Idli dipped in sambar', price: 59, type: 'BOTH', category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },
    { id: '5', name: 'Sambar Vada', description: 'Lentil donuts in sambar', price: 59, type: 'BOTH', category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },
    { id: '6', name: 'Upma', description: 'Savory semolina porridge', price: 59, type: 'BOTH', category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 30, isDoubleAllowed: true, imageUrl: '' },
    { id: '7', name: 'Mysore Bonda', description: 'Fried flour dumplings', price: 49, type: 'BOTH', category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },

    // Dosa
    { id: '8', name: 'Plain Dosa', description: 'Crispy savory crepe', price: 59, type: 'BOTH', category: 'Dosa', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },
    { id: '9', name: 'Masala Dosa', description: 'Dosa with potato filling', price: 69, type: 'BOTH', category: 'Dosa', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },
    { id: '10', name: 'Paneer Dosa', description: 'Dosa with spiced paneer', price: 109, type: 'NORMAL', category: 'Dosa', isVeg: true, isAvailable: true, inventoryCount: 30, isDoubleAllowed: false, imageUrl: '' },
    { id: '11', name: 'Set Dosa', description: 'Soft spongy dosas (set of 2)', price: 99, type: 'BOTH', category: 'Dosa', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },

    // Rice
    { id: '12', name: 'Lemon Rice', description: 'Tangy lemon flavored rice', price: 69, type: 'BOTH', category: 'Rice', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },
    { id: '13', name: 'Curd Rice', description: 'Rice with yogurt and tempering', price: 59, type: 'BOTH', category: 'Rice', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },
    { id: '14', name: 'Veg Biryani', description: 'Served with Mirchi Ka Salan', price: 129, type: 'NORMAL', category: 'Rice', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: false, imageUrl: '' },

    // North Indian
    { id: '15', name: 'Aloo Paratha', description: 'Stuffed potato flatbread', price: 59, type: 'BOTH', category: 'North Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },
    { id: '16', name: 'Chole Bhature', description: 'Fried bread with chickpea curry', price: 149, type: 'NORMAL', category: 'North Indian', isVeg: true, isAvailable: true, inventoryCount: 30, isDoubleAllowed: false, imageUrl: '' },
    { id: '17', name: 'Puri Bhaji', description: 'Fried bread with potato curry', price: 99, type: 'BOTH', category: 'North Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },

    // Snacks
    { id: '18', name: 'Mirchi Bajji', description: 'Stuffed chilli fritters', price: 49, type: 'BOTH', category: 'Snacks', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },
    { id: '19', name: 'Punugulu', description: 'Deep fried rice batter balls', price: 49, type: 'BOTH', category: 'Snacks', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },

    // Beverages
    { id: '20', name: 'Filter Coffee', description: 'Classic South Indian coffee', price: 29, type: 'BOTH', category: 'Beverages', isVeg: true, isAvailable: true, inventoryCount: 100, isDoubleAllowed: true, imageUrl: '' },
    { id: '21', name: 'Tea', description: 'Masala Chai', price: 19, type: 'BOTH', category: 'Beverages', isVeg: true, isAvailable: true, inventoryCount: 100, isDoubleAllowed: true, imageUrl: '' },
    { id: '22', name: 'Lassi', description: 'Sweet yogurt drink', price: 59, type: 'BOTH', category: 'Beverages', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },

    // Chaat
    { id: '23', name: 'Pani Puri', description: 'Hollow balls with spicy water', price: 20, type: 'BOTH', category: 'Chaat', isVeg: true, isAvailable: true, inventoryCount: 100, isDoubleAllowed: true, imageUrl: '' },
    { id: '24', name: 'Dahi Puri', description: 'Puri filled with yogurt', price: 30, type: 'BOTH', category: 'Chaat', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, imageUrl: '' },

    // Desserts
    { id: '25', name: 'Gulab Jamun', description: 'Sweet syrup dumplings', price: 59, type: 'NORMAL', category: 'Dessert', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, imageUrl: '' },
    { id: '26', name: 'Waffles', description: 'Freshly baked waffles', price: 120, type: 'NORMAL', category: 'Dessert', isVeg: true, isAvailable: true, inventoryCount: 20, isDoubleAllowed: false, imageUrl: '' }
];

async function seed() {
    console.log('🌱 Seeding Menu Items...');

    // Clear existing to avoid ID conflicts if any partials exist
    await prisma.menuItem.deleteMany();

    for (const item of MOCK_MENU) {
        await prisma.menuItem.create({
            data: item
        });
    }

    console.log(`✅ Seeded ${MOCK_MENU.length} items`);
    await prisma.$disconnect();
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
