import { useState, useEffect } from 'react';
import { MenuItem, MenuItemType } from '@/types/db';

const MOCK_MENU: MenuItem[] = [
    // South Indian Tiffins
    { id: '1', name: 'Idli', description: 'Steamed rice cakes (2 pcs)', price: 49, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, stock: 50, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '2', name: 'Ghee Podi Idli', description: 'Idli tossed in spicy podi & ghee', price: 69, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, stock: 50, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '3', name: 'Thatte Idli', description: 'Large flat idli', price: 49, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, stock: 40, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '4', name: 'Idli Sambar', description: 'Idli dipped in sambar', price: 59, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, stock: 50, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '5', name: 'Sambar Vada', description: 'Lentil donuts in sambar', price: 59, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, stock: 40, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '6', name: 'Upma', description: 'Savory semolina porridge', price: 59, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, stock: 30, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '7', name: 'Mysore Bonda', description: 'Fried flour dumplings', price: 49, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, stock: 40, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    // Dosa
    { id: '8', name: 'Plain Dosa', description: 'Crispy savory crepe', price: 59, type: MenuItemType.BOTH, category: 'Dosa', isVeg: true, isAvailable: true, stock: 50, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '9', name: 'Masala Dosa', description: 'Dosa with potato filling', price: 69, type: MenuItemType.BOTH, category: 'Dosa', isVeg: true, isAvailable: true, stock: 50, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '10', name: 'Paneer Dosa', description: 'Dosa with spiced paneer', price: 109, type: MenuItemType.NORMAL, category: 'Dosa', isVeg: true, isAvailable: true, stock: 30, reservedStock: 0, isSubscriptionEligible: false, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '11', name: 'Set Dosa', description: 'Soft spongy dosas (set of 2)', price: 99, type: MenuItemType.BOTH, category: 'Dosa', isVeg: true, isAvailable: true, stock: 40, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    // Rice
    { id: '12', name: 'Lemon Rice', description: 'Tangy lemon flavored rice', price: 69, type: MenuItemType.BOTH, category: 'Rice', isVeg: true, isAvailable: true, stock: 40, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '13', name: 'Curd Rice', description: 'Rice with yogurt and tempering', price: 59, type: MenuItemType.BOTH, category: 'Rice', isVeg: true, isAvailable: true, stock: 40, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '14', name: 'Veg Biryani', description: 'Served with Mirchi Ka Salan', price: 129, type: MenuItemType.NORMAL, category: 'Rice', isVeg: true, isAvailable: true, stock: 50, reservedStock: 0, isSubscriptionEligible: false, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    // North Indian
    { id: '15', name: 'Aloo Paratha', description: 'Stuffed potato flatbread', price: 59, type: MenuItemType.BOTH, category: 'North Indian', isVeg: true, isAvailable: true, stock: 40, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '16', name: 'Chole Bhature', description: 'Fried bread with chickpea curry', price: 149, type: MenuItemType.NORMAL, category: 'North Indian', isVeg: true, isAvailable: true, stock: 30, reservedStock: 0, isSubscriptionEligible: false, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '17', name: 'Puri Bhaji', description: 'Fried bread with potato curry', price: 99, type: MenuItemType.BOTH, category: 'North Indian', isVeg: true, isAvailable: true, stock: 40, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    // Snacks
    { id: '18', name: 'Mirchi Bajji', description: 'Stuffed chilli fritters', price: 49, type: MenuItemType.BOTH, category: 'Snacks', isVeg: true, isAvailable: true, stock: 50, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '19', name: 'Punugulu', description: 'Deep fried rice batter balls', price: 49, type: MenuItemType.BOTH, category: 'Snacks', isVeg: true, isAvailable: true, stock: 50, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    // Beverages
    { id: '20', name: 'Filter Coffee', description: 'Classic South Indian coffee', price: 29, type: MenuItemType.BOTH, category: 'Beverages', isVeg: true, isAvailable: true, stock: 100, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '21', name: 'Tea', description: 'Masala Chai', price: 19, type: MenuItemType.BOTH, category: 'Beverages', isVeg: true, isAvailable: true, stock: 100, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '22', name: 'Lassi', description: 'Sweet yogurt drink', price: 59, type: MenuItemType.BOTH, category: 'Beverages', isVeg: true, isAvailable: true, stock: 50, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    // Chaat
    { id: '23', name: 'Pani Puri', description: 'Hollow balls with spicy water', price: 20, type: MenuItemType.BOTH, category: 'Chaat', isVeg: true, isAvailable: true, stock: 100, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '24', name: 'Dahi Puri', description: 'Puri filled with yogurt', price: 30, type: MenuItemType.BOTH, category: 'Chaat', isVeg: true, isAvailable: true, stock: 50, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    // Desserts
    { id: '25', name: 'Gulab Jamun', description: 'Sweet syrup dumplings', price: 59, type: MenuItemType.NORMAL, category: 'Dessert', isVeg: true, isAvailable: true, stock: 40, reservedStock: 0, isSubscriptionEligible: false, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '26', name: 'Waffles', description: 'Freshly baked waffles', price: 120, type: MenuItemType.NORMAL, category: 'Dessert', isVeg: true, isAvailable: true, stock: 20, reservedStock: 0, isSubscriptionEligible: false, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' }
];

export const CATEGORY_ORDER = ['South Indian', 'Dosa', 'Rice', 'North Indian', 'Snacks', 'Beverages', 'Chaat', 'Dessert'];

export function useMenu() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isMenuLoading, setIsMenuLoading] = useState(true);

    const fetchMenu = async () => {
        try {
            const res = await fetch('/api/menu');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setMenuItems(data);
                    // Cache the fresh menu for offline use
                    localStorage.setItem('menu_cache', JSON.stringify(data));
                } else {
                    setMenuItems(MOCK_MENU);
                }
            }
        } catch (e) {
            console.error("Failed to fetch menu, checking cache...", e);
            // On failure (offline), try to load from cache
            const cached = localStorage.getItem('menu_cache');
            if (cached) {
                try {
                    setMenuItems(JSON.parse(cached));

                } catch (parseError) {
                    setMenuItems(MOCK_MENU);
                }
            } else {
                setMenuItems(MOCK_MENU);
            }
        } finally {
            setIsMenuLoading(false);
        }
    };

    useEffect(() => {
        // Optimistic UI: Load from cache immediately if available
        const cached = localStorage.getItem('menu_cache');
        if (cached) {
            try {
                setMenuItems(JSON.parse(cached));
                // We don't set loading false here, we let the network request finish
                // so we can update stock levels if online.
            } catch (e) { /* Ignore cache errors */ }
        }

        fetchMenu();
    }, []);

    return { menuItems, isMenuLoading, fetchMenu, MOCK_MENU };
}
