'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '@/context/CartContext';
import { usePathname, useSearchParams } from 'next/navigation';

// Dynamic imports to avoid hydration mismatch and reduce bundle size
const MobileBottomNav = dynamic(() => import('@/components/layout/MobileBottomNav'), { ssr: false });
const CartDrawer = dynamic(() => import('@/components/ordering/CartDrawer'), { ssr: false });

export default function GlobalLayoutClient() {
    const { isCartOpen, openCart, closeCart } = useCart();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<any>(null);
    const [shouldShowNav, setShouldShowNav] = useState(false);

    useEffect(() => {
        const checkVisibility = () => {
            // Always hide on checkout/login
            if (pathname?.startsWith('/checkout') || pathname?.startsWith('/login')) {
                setShouldShowNav(false);
                return;
            }

            // If not on root, show (e.g. /orders, /account) - BUT only if we have a user or it's a public page that needs nav
            // Actually, requirements say hide if signed out on phone. 
            // If user is signed out, they shouldn't be on /orders or /account anyway (protected routes).
            // So if they are there, show nav.
            if (pathname !== '/') {
                setShouldShowNav(true);
                // Still update user state for MobileBottomNav
                const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
                if (storedUser) {
                    try { setUser(JSON.parse(storedUser)); } catch (e) { setUser(null); }
                } else {
                    setUser(null);
                }
                return;
            }

            // On root path ('/'):
            // Check user for the navbar props
            const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
            if (storedUser) {
                try { setUser(JSON.parse(storedUser)); } catch (e) { setUser(null); }
            } else {
                setUser(null);
            }

            // Landing Page Logic: only show nav if explored AND (user is logged in OR guest mode active)
            const hasExplored = sessionStorage.getItem('cafe_has_explored');
            const hasParams = searchParams.size > 0;

            // If we just logged out, safe_user is null and cafe_has_explored should be gone.
            // Strict check:
            if (hasExplored === 'true' || hasParams) {
                setShouldShowNav(true);
            } else {
                setShouldShowNav(false);
            }
        };

        checkVisibility();

        // Listen for internal state changes (login/explore)
        window.addEventListener('storage-update', checkVisibility);
        return () => window.removeEventListener('storage-update', checkVisibility);
    }, [pathname, searchParams]);

    return (
        <>
            {shouldShowNav && (
                <MobileBottomNav
                    user={user}
                    onCartClick={openCart}
                    onProfileClick={() => { }} // Handled internally by router.push
                />
            )}

            <CartDrawer
                isOpen={isCartOpen}
                onClose={closeCart}
                user={null} // Not used or handled by CartDrawer internally
                variant="drawer"
            />
        </>
    );
}
