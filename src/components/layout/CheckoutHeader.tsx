'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User as UserIcon } from 'lucide-react';
import { DecorativeBorderLogo } from '@/components/ui/DecorativeBorder';

interface CheckoutHeaderProps {
    user?: any;
    onLoginClick?: () => void;
}

export default function CheckoutHeader({ user, onLoginClick }: CheckoutHeaderProps) {
    const router = useRouter();

    const handleLogoClick = () => {
        // Clear the explored flag to force the Landing Page to show
        sessionStorage.removeItem('cafe_has_explored');
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#3C2A21]/10 bg-[#e2e9e0]/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-12">
                {/* Left: Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={handleLogoClick}
                >
                    <DecorativeBorderLogo size="md">
                        <Image
                            src="/Cropped_Updated_logo.png"
                            alt="Cafe South Central"
                            width={240}
                            height={70}
                            className="h-16 w-auto object-contain"
                            priority
                        />
                    </DecorativeBorderLogo>
                </div>

                {/* Right: User Profile / Login */}
                <div className="flex items-center gap-5">
                    {user ? (
                        <button
                            onClick={() => router.push('/account')}
                            className="flex items-center gap-3 h-12 px-5 rounded-full bg-[#e7f3eb] text-[#0e1b12] hover:bg-[#0e1b12] hover:text-white transition-all shadow-sm"
                        >
                            <span className="text-sm font-bold">{user.name.split(' ')[0]}</span>
                            <UserIcon className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => onLoginClick?.()}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f3eb] text-[#0e1b12] hover:bg-[#0e1b12] hover:text-white transition-all shadow-sm"
                        >
                            <UserIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
