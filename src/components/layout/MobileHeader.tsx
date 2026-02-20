'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { DecorativeBorderLogo } from '@/components/ui/DecorativeBorder';
import { User, Menu as MenuIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MobileHeaderProps {
    user: any;
    isDarkMode?: boolean;
    toggleTheme?: () => void;
    onLoginClick: () => void;
    onProfileClick?: () => void;
}

export default function MobileHeader({
    user,
    onLoginClick
}: MobileHeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleMenuClick = (path: string) => {
        setIsOpen(false);
        router.push(path);
    };

    return (
        <>
            <header className="md:hidden flex justify-between items-center px-4 py-3 bg-[#f8fbf7]/95 backdrop-blur-sm sticky top-0 z-[100] border-b border-[#3C2A21]/10">
                <Link
                    href="/"
                    className="relative z-[60] flex items-center cursor-pointer pointer-events-auto"
                >
                    <DecorativeBorderLogo size="sm">
                        {/* Increased Logo Size */}
                        <div className="relative w-52 h-14">
                            <Image
                                src="/Cropped_Updated_logo.png"
                                alt="Cafe South Central"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </DecorativeBorderLogo>
                </Link>

                <button
                    className="p-2 text-[#102214]"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X className="w-8 h-8" /> : <MenuIcon className="w-8 h-8" />}
                </button>
            </header>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-[65px] left-0 w-full bg-[#f8fbf7] z-40 border-b border-[#3C2A21]/10 shadow-xl md:hidden flex flex-col p-6 gap-4"
                    >
                        {user ? (
                            <div
                                onClick={() => handleMenuClick('/account')}
                                className="flex items-center gap-3 p-4 bg-[#e7f3eb] rounded-xl cursor-pointer"
                            >
                                <div className="w-10 h-10 bg-[#5C3A1A] rounded-full flex items-center justify-center text-[#F4D03F]">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-[#102214] text-lg">My Account</p>
                                    <p className="text-xs text-[#4a5d50]">View Profile</p>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => { setIsOpen(false); onLoginClick(); }}
                                className="w-full bg-[#005001] text-[#f7e231] py-3 rounded-xl font-bold text-lg mb-2"
                            >
                                Login / Sign Up
                            </button>
                        )}

                        <button
                            onClick={() => handleMenuClick('/?show_landing=true')}
                            className="text-lg font-bold text-[#102214] py-2 text-left"
                        >
                            Home
                        </button>

                        <button
                            onClick={() => handleMenuClick('/menu')}
                            className="text-lg font-bold text-[#102214] py-2 text-left"
                        >
                            Menu
                        </button>

                        <button
                            onClick={() => handleMenuClick('/subscription')}
                            className="text-lg font-bold text-[#102214] py-2 text-left"
                        >
                            Subscriptions
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
