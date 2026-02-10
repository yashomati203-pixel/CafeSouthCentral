'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useRouter } from 'next/navigation';

export default function CartDrawerWrapper() {
    const { isCartOpen, closeCart, items, normalTotalAmount } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        closeCart();
        router.push('/checkout');
    };

    return (
        <CartDrawer
            isOpen={isCartOpen}
            onClose={closeCart}
            items={items}
            subTotalCount={items.length}
            onCheckout={handleCheckout}
        />
    );
}
