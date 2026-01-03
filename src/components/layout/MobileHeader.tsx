'use client';

import Image from 'next/image';
import { SunIcon, MoonIcon, PersonIcon } from '@radix-ui/react-icons';

interface MobileHeaderProps {
    user: any;
    isDarkMode: boolean;
    toggleTheme: () => void;
    onLoginClick: () => void;
    onProfileClick?: () => void; // Optional if we want header avatar to do something
}

export default function MobileHeader({
    user,
    isDarkMode,
    toggleTheme,
    onLoginClick,
    onProfileClick
}: MobileHeaderProps) {
    return (
        <header className="sticky top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 md:hidden flex justify-between items-center transition-colors dark:bg-[#121212]/80 dark:border-gray-800">
            {/* Logo Area */}
            <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        fill
                        className="object-cover"
                    />
                </div>
                <h1 className="text-lg font-bold text-[#5C3A1A] dark:text-white leading-none">
                    Cafe <span className="text-[#2F4F2F] dark:text-[#4B6F44]">SC</span>
                </h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                >
                    {isDarkMode ? <MoonIcon /> : <SunIcon />}
                </button>

                {/* User Avatar or Login */}
                {user ? (
                    <button
                        onClick={onProfileClick}
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-[#5C3A1A] text-white font-bold"
                    >
                        {user.name ? user.name[0].toUpperCase() : <PersonIcon />}
                    </button>
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="px-4 py-1.5 text-sm font-bold text-white bg-[#5C3A1A] rounded-full shadow-sm"
                    >
                        Login
                    </button>
                )}
            </div>
        </header>
    );
}
