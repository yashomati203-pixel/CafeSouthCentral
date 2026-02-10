'use client';

import {
    Utensils,
    ScrollText,
    ShoppingCart,
    User
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface MobileBottomNavProps {
    user: any;
    onCartClick: () => void;
    onProfileClick: () => void;
}

export default function MobileBottomNav({ user, onCartClick, onProfileClick }: MobileBottomNavProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { items } = useCart();

    // Calculate total items
    const cartCount = items.reduce((acc, item) => acc + item.qty, 0);

    const navItems = [
        {
            label: 'Menu',
            icon: Utensils,
            path: '/',
            action: () => router.push('/')
        },
        {
            label: 'Orders',
            icon: ScrollText,
            path: '/orders',
            action: () => router.push('/orders')
        },
        {
            label: 'Cart',
            icon: ShoppingCart,
            path: '#cart',
            action: onCartClick,
            badge: cartCount
        },
        {
            label: 'Profile',
            icon: User,
            path: '/account',
            action: () => router.push('/account')
        }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-800 z-[60] md:hidden pb-safe">
            <div className="flex justify-between items-center px-6 py-2">
                {navItems.map((item) => {
                    // Active state logic
                    const isActive = item.path === '/'
                        ? pathname === '/'
                        : pathname?.startsWith(item.path);

                    const Icon = item.icon;

                    return (
                        <button
                            key={item.label}
                            onClick={item.action}
                            className={`flex flex-col items-center gap-1 transition-colors ${isActive
                                ? 'text-[#5C3A1A] dark:text-white'
                                : 'text-gray-400 hover:text-[#5C3A1A] dark:hover:text-gray-200'
                                }`}
                        >
                            <div className="relative">
                                <Icon
                                    className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                {item.badge ? (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full border-2 border-white dark:border-[#1e1e1e]">
                                        {item.badge}
                                    </span>
                                ) : null}
                            </div>
                            <span className={`text-[10px] font-medium uppercase tracking-tighter ${isActive ? 'font-bold' : ''}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
            {/* Home Bar Indicator (iOS style) */}
            <div className="w-32 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mt-1 mb-2"></div>
        </nav>
    );
}
