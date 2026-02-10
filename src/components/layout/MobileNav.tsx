'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Coffee, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

// const NAV_ITEMS = [
//   { label: 'Home', href: '/', icon: Home },
//   { label: 'Menu', href: '/menu', icon: Coffee },
//   { label: 'Cart', href: '/cart', icon: ShoppingBag },
//   { label: 'Profile', href: '/profile', icon: User },
// ];

export const MobileNav = () => {
    const pathname = usePathname();

    const navItems = [
        { label: 'Home', href: '/', icon: Home },
        { label: 'Menu', href: '/menu', icon: Coffee },
        { label: 'Orders', href: '/orders', icon: ShoppingBag },
        { label: 'Cart', href: '/cart', icon: ShoppingBag },
        { label: 'Profile', href: '/profile', icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-pure-white/90 backdrop-blur-lg border-t border-gray-200 z-[40] pb-safe md:hidden">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                                isActive ? "text-palm-green-dark" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <div className={cn(
                                "p-1 rounded-full transition-colors",
                                isActive && "bg-palm-green-light/10"
                            )}>
                                <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
