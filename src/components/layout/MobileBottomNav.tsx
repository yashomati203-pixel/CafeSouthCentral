'use client';

import {
    HomeIcon,
    ReaderIcon,
    StarIcon,
    PersonIcon,
    BackpackIcon
} from '@radix-ui/react-icons';
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
        { label: 'Home', icon: HomeIcon, path: '/', action: () => router.push('/') },
        { label: 'Orders', icon: ReaderIcon, path: '/orders', action: () => router.push('/orders') },
        // Cart is a special action
        { label: 'Cart', icon: BackpackIcon, path: '#cart', action: onCartClick, badge: cartCount },
        { label: 'Plans', icon: StarIcon, path: '/subscription', action: () => router.push('/subscription') },
        { label: 'Profile', icon: PersonIcon, path: '/profile', action: onProfileClick }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = item.path === '/' ? pathname === '/' : pathname?.startsWith(item.path);
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.label}
                            onClick={item.action}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-[#5C3A1A]' : 'text-gray-400'
                                }`}
                        >
                            <div className="relative">
                                <Icon width={22} height={22} />
                                {item.badge ? (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white">
                                        {item.badge}
                                    </span>
                                ) : null}
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
