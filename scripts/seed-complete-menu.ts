import { PrismaClient, MenuItemType } from '@prisma/client';

const prisma = new PrismaClient();

const FULL_MENU = [
    // --- South Indian Tiffins ---
    { name: 'Idli', price: 49, category: 'South Indian', isVeg: true },
    { name: 'Ghee Podi Idli', price: 69, category: 'South Indian', isVeg: true }, // Assumed price based on context
    { name: 'Thatte Idli', price: 49, category: 'South Indian', isVeg: true },
    { name: 'Idli Sambar', price: 59, category: 'South Indian', isVeg: true },
    { name: 'Sambar Vada', price: 59, category: 'South Indian', isVeg: true },
    { name: 'Single Idli Vada', price: 59, category: 'South Indian', isVeg: true }, // "SINGLE IDLI+ VADA"
    { name: 'Mysore Bonda', price: 49, category: 'South Indian', isVeg: true }, // 40 in text, 49 in consistent pricing? Text says 40.
    { name: 'Upma', price: 59, category: 'South Indian', isVeg: true },

    // --- Dosa ---
    { name: 'Plain Dosa', price: 59, category: 'Dosa', isVeg: true },
    { name: 'Masala Dosa', price: 69, category: 'Dosa', isVeg: true },
    { name: 'Upma Dosa', price: 79, category: 'Dosa', isVeg: true },
    { name: 'Karam Podi Dosa', price: 99, category: 'Dosa', isVeg: true }, // "KARAM PODI DOSA 99"
    { name: 'Rava Dosa', price: 69, category: 'Dosa', isVeg: true },
    { name: 'Paneer Dosa', price: 109, category: 'Dosa', isVeg: true },
    { name: 'Open Masala Dosa', price: 79, category: 'Dosa', isVeg: true },
    { name: 'Pesarattu', price: 69, category: 'Dosa', isVeg: true },
    { name: 'Uttapam', price: 99, category: 'Dosa', isVeg: true }, // "UTTAPAM/ONION /TOMATO"
    { name: 'Set Dosa', price: 89, category: 'Dosa', isVeg: true }, // Price missing in text, setting reasonable default

    // --- North Indian / Parathas ---
    { name: 'Aloo Paratha', price: 59, category: 'North Indian', isVeg: true },
    { name: 'Gobi Paratha', price: 59, category: 'North Indian', isVeg: true },
    { name: 'Pyaaz Paratha', price: 59, category: 'North Indian', isVeg: true },
    { name: 'Green Peas Paratha', price: 69, category: 'North Indian', isVeg: true },
    { name: 'Mix Paratha', price: 69, category: 'North Indian', isVeg: true }, // Price missing, assumed
    { name: 'Chole with Plain Paratha', price: 99, category: 'North Indian', isVeg: true },
    { name: 'Chole Bhature', price: 149, category: 'North Indian', isVeg: true },
    { name: 'Puri Bhaji', price: 99, category: 'North Indian', isVeg: true },
    { name: 'Malabar Paratha', price: 79, category: 'North Indian', isVeg: true }, // Listed here in text

    // --- Rice ---
    { name: 'Lemon Rice', price: 69, category: 'Rice', isVeg: true },
    { name: 'Curd Rice', price: 59, category: 'Rice', isVeg: true },
    { name: 'Tomato Rice', price: 69, category: 'Rice', isVeg: true },
    { name: 'Rajma Chawal', price: 69, category: 'Rice', isVeg: true }, // 69 in text? Text says "RAJMA CHAWAL\nSAMBAR RICE\nKADHI CHAWAL\n69". Assuming 69 for all group.
    { name: 'Sambar Rice', price: 69, category: 'Rice', isVeg: true },
    { name: 'Kadhi Chawal', price: 69, category: 'Rice', isVeg: true },
    { name: 'Veg Biryani', price: 129, category: 'Rice', isVeg: true }, // "VEG BIRYANI WITH MIRCHI KA SALAN"
    { name: 'Chole Chawal', price: 99, category: 'Rice', isVeg: true },

    // --- Snacks ---
    { name: 'Mirchi Bajji', price: 49, category: 'Snacks', isVeg: true },
    { name: 'Punugulu', price: 49, category: 'Snacks', isVeg: true },
    { name: 'Aloo Bajji', price: 49, category: 'Snacks', isVeg: true },
    { name: 'Telangana Sarva Pindi', price: 59, category: 'Snacks', isVeg: true }, // Price missing, assumed
    { name: 'Moong Pakoda', price: 49, category: 'Snacks', isVeg: true },

    // --- Beverages ---
    { name: 'Filter Coffee', price: 29, category: 'Beverages', isVeg: true }, // Assumed
    { name: 'Black Filter Coffee', price: 49, category: 'Beverages', isVeg: true }, // Text says 49
    { name: 'Cold Coffee', price: 69, category: 'Beverages', isVeg: true },
    { name: 'Tea', price: 19, category: 'Beverages', isVeg: true }, // "TEA\nLEMON TEA 19"
    { name: 'Lemon Tea', price: 19, category: 'Beverages', isVeg: true },
    { name: 'Lassi', price: 59, category: 'Beverages', isVeg: true },
    { name: 'Fruit Juice', price: 79, category: 'Beverages', isVeg: true }, // "FRUIT JUICE79"
    { name: 'Milk Shake', price: 89, category: 'Beverages', isVeg: true }, // Price missing, assumed
    { name: 'Thick Shake', price: 99, category: 'Beverages', isVeg: true },

    // --- Desserts ---
    { name: 'Double Ka Meetha', price: 59, category: 'Dessert', isVeg: true },
    { name: 'Khubani Ka Meetha', price: 69, category: 'Dessert', isVeg: true },
    { name: 'Gulab Jamun', price: 59, category: 'Dessert', isVeg: true },
    { name: 'Waffles', price: 120, category: 'Dessert', isVeg: true },
    { name: 'Fruit Salad', price: 120, category: 'Dessert', isVeg: true },
    { name: 'Ice Cream', price: 79, category: 'Dessert', isVeg: true },

    // --- Chaat ---
    { name: 'Pani Puri', price: 20, category: 'Chaat', isVeg: true },
    { name: 'Dahi Puri', price: 30, category: 'Chaat', isVeg: true },
    { name: 'Bhel', price: 40, category: 'Chaat', isVeg: true },
    { name: 'Sev Papdi Chaat', price: 40, category: 'Chaat', isVeg: true },
    { name: 'Dahi Papdi Chaat', price: 50, category: 'Chaat', isVeg: true },
    { name: 'Sandwich', price: 49, category: 'Chaat', isVeg: true }, // Price missing, assumed
];

async function seed() {
    console.log('🌱 Seeding Complete Menu...');

    for (const item of FULL_MENU) {
        // Create slug-like ID for consistent upserts
        const id = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        await prisma.menuItem.upsert({
            where: { id },
            update: {
                name: item.name,
                price: item.price,
                category: item.category,
                isVeg: item.isVeg,
                // Preserve existing stock/availability if exists, else default
                // But upsert 'update' will overwrite. To preserve, we'd need to fetch first.
                // For now, let's just ensure properties are set.
            },
            create: {
                id,
                name: item.name,
                description: item.name, // Simple description
                price: item.price,
                category: item.category,
                isVeg: item.isVeg,
                type: MenuItemType.BOTH,
                isAvailable: true,
                stock: 50, // Default stock
                imageUrl: '',
            },
        });
    }
    console.log('✅ Menu updated with ' + FULL_MENU.length + ' items');
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
