'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { DecorativeBorderLogo } from '@/components/ui/DecorativeBorder';

import { User as UserIcon, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface DesktopHeaderProps {
    user?: any;
    onLoginClick?: () => void;
}

export default function DesktopHeader({
    user,
    onLoginClick
}: DesktopHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { openCart, subTotalCount, totalItemsCount } = useCart();

    return (
        <header className="sticky top-0 z-[100] w-full bg-[#e8f5e9] hidden lg:block border-b border-[#3C2A21]/10">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-0 lg:px-12">
                {/* Logo Section */}
                <Link href="/" className="relative z-[60] flex items-center gap-3 cursor-pointer pointer-events-auto -ml-4 xl:-ml-6">
                    <DecorativeBorderLogo size="md">
                        <Image src="/logo without border.png" alt="Cafe South Central" width={525} height={158} className="h-24 w-auto object-contain" priority />
                    </DecorativeBorderLogo>
                </Link>

                {/* Centered Desktop Tabs - Only show on large screens */}
                <div className="hidden lg:flex items-center gap-6 xl:gap-8 absolute left-1/2 -translate-x-1/2">
                    <Link
                        href="/?show_landing=true"
                        className={`text-lg xl:text-xl font-serif font-bold transition-colors pb-1 border-b-2 ${pathname === '/' ? 'border-[#166534] text-[#0d1c11]' : 'border-transparent text-[#166534] hover:text-[#0d1c11] hover:border-[#166534]'}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/menu"
                        className={`text-lg xl:text-xl font-serif font-bold transition-colors pb-1 border-b-2 ${pathname === '/menu' ? 'border-[#166534] text-[#0d1c11]' : 'border-transparent text-[#166534] hover:text-[#0d1c11] hover:border-[#166534]'}`}
                    >
                        Menu
                    </Link>
                    <Link
                        href="/subscription"
                        className={`text-lg xl:text-xl font-serif font-bold transition-colors pb-1 border-b-2 ${pathname === '/subscription' ? 'border-[#166534] text-[#0d1c11]' : 'border-transparent text-[#166534] hover:text-[#0d1c11] hover:border-[#166534]'}`}
                    >
                        Subscriptions
                    </Link>
                </div>

                {/* Right Actions Section - Always show alongside logo */}
                <div className="flex items-center gap-4 lg:gap-8">
                    {/* Cart Button */}
                    <button
                        onClick={openCart}
                        className="relative p-2 text-[#166534] hover:bg-[#e7f3eb] rounded-full transition-colors"
                        aria-label="Open Cart"
                    >
                        <ShoppingBag className="w-6 h-6" />
                        {totalItemsCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#d32f2f] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
                                {totalItemsCount}
                            </span>
                        )}
                    </button>

                    {user ? (
                        <div className={`flex items-center gap-4 lg:gap-6 pb-1 border-b-2 ${pathname === '/account' ? 'border-[#DAA520]' : 'border-transparent'}`}>
                            <span className="hidden lg:block font-bold text-[#166534]">Welcome, {user.name?.split(' ')[0] || 'User'}</span>
                            <button
                                onClick={() => router.push('/account')}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3eb] text-[#166534] transition-colors hover:bg-[#d1fae5]"
                            >
                                <UserIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onLoginClick?.()}
                            className="rounded-full bg-[#0e1b12] px-6 py-2 lg:px-8 lg:py-3 text-sm font-bold text-white transition-transform hover:scale-105 hover:shadow-lg"
                        >
                            Login / Sign Up
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
