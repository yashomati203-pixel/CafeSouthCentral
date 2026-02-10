'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { MenuItem, MenuItemType, OrderMode } from '@/types/db';

export type CartItem = MenuItem & {
    qty: number;
    // We treat 'type' in CartItem as the *Selected Mode* (NORMAL | SUBSCRIPTION)
    // to distinguish items in the cart. 
    type: MenuItemType;
};

interface CartContextType {
    items: CartItem[];
    addToCart: (item: MenuItem, mode: 'NORMAL' | 'SUBSCRIPTION') => void;

    removeFromCart: (itemId: string) => void;
    decreaseQty: (itemId: string, mode: 'NORMAL' | 'SUBSCRIPTION') => void;
    subscriptionItems: CartItem[];
    normalItems: CartItem[];
    subTotalCount: number;
    totalItemsCount: number;
    normalTotalAmount: number;
    clearCart: () => void;

    // Drawer State
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('cafe_cart');
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        localStorage.setItem('cafe_cart', JSON.stringify(items));
    }, [items]);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);
    const toggleCart = () => setIsCartOpen((prev) => !prev);

    const addToCart = (item: MenuItem, mode: 'NORMAL' | 'SUBSCRIPTION') => {
        // Map string mode to Enum
        const targetType = mode === 'NORMAL' ? MenuItemType.NORMAL : MenuItemType.SUBSCRIPTION;

        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id && i.type === targetType);
            if (existing) {
                // Validation: Double Allowed Helper
                // Defaulting to 2 as 'isDoubleAllowed' is not currently in schema
                const limit = 2;
                if (mode === 'SUBSCRIPTION' && existing.qty >= limit) {
                    alert(`Cannot add more of ${item.name}. Limit reached.`);
                    return prev;
                }

                return prev.map((i) =>
                    (i.id === item.id && i.type === targetType) ? { ...i, qty: i.qty + 1 } : i
                );
            }
            // Force type override based on mode selected at add-time
            return [...prev, { ...item, qty: 1, type: targetType }];
        });
    };

    const decreaseQty = (itemId: string, mode: 'NORMAL' | 'SUBSCRIPTION') => {
        const targetType = mode === 'NORMAL' ? MenuItemType.NORMAL : MenuItemType.SUBSCRIPTION;
        setItems((prev) => {
            const existing = prev.find((i) => i.id === itemId && i.type === targetType);
            if (!existing) return prev;

            if (existing.qty === 1) {
                // Remove if qty becomes 0
                return prev.filter((i) => !(i.id === itemId && i.type === targetType));
            }

            return prev.map((i) =>
                (i.id === itemId && i.type === targetType) ? { ...i, qty: i.qty - 1 } : i
            );
        });
    };

    const removeFromCart = (itemId: string) => {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
    };

    const clearCart = () => setItems([]);

    // Derived State
    const subscriptionItems = useMemo(() => items.filter(i => i.type === MenuItemType.SUBSCRIPTION), [items]);
    const normalItems = useMemo(() => items.filter(i => i.type === MenuItemType.NORMAL), [items]);

    const subTotalCount = useMemo(() => subscriptionItems.reduce((acc, i) => acc + i.qty, 0), [subscriptionItems]);
    const normalTotalAmount = useMemo(() => normalItems.reduce((acc, i) => acc + (i.price * i.qty), 0), [normalItems]);
    const totalItemsCount = useMemo(() => items.reduce((acc, i) => acc + i.qty, 0), [items]);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            decreaseQty,
            subscriptionItems,
            normalItems,
            subTotalCount,
            totalItemsCount,
            normalTotalAmount,
            clearCart,
            isCartOpen,
            openCart,
            closeCart,
            toggleCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
