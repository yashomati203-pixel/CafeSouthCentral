'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ShoppingBag,
    CreditCard,
    Settings,
    HelpCircle,
    LogOut,
    Menu,
    ChevronLeft,
    ChevronRight,
    User
} from 'lucide-react';

interface ProfileSidebarProps {
    user: any;
    onLogout: () => void;
}

export default function ProfileSidebar({ user, onLogout }: ProfileSidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    // Nav items
    // Using Lucide icons to match requested template's function
    // Shopping Bag -> My Orders
    // Payments (CreditCard) -> Subscription (as per template text, though icon was Payments)
    // Settings -> Settings (Profile)
    // Support -> Help

    // Note: Template used Material Symbols. We use Lucide.
    // shopping_bag -> ShoppingBag
    // payments -> CreditCard
    // settings -> Settings
    // help -> HelpCircle
    // logout -> LogOut

    const navItems = [
        { label: 'My Orders', icon: ShoppingBag, href: '/orders' },
        { label: 'Subscription', icon: CreditCard, href: '/?view=subscription' },
        { label: 'Settings', icon: Settings, href: '/account' }, // Active on profile page
        { label: 'Share Feedback', icon: HelpCircle, href: 'mailto:hello@cafesouthcentral.com' },
    ];

    return (
        <aside
            className={`
                sticky top-0 h-screen bg-white dark:bg-[#1e1e1e]/50 border-r border-gray-200 dark:border-gray-800 
                flex flex-col transition-all duration-300 ease-in-out hidden md:flex
                ${isCollapsed ? 'w-20' : 'w-80'}
            `}
        >
            {/* Header / User Info */}
            <div className={`p-6 flex items-center gap-3 mb-4 ${isCollapsed ? 'justify-center p-4' : ''}`}>
                {!isCollapsed && (
                    <div
                        className="w-12 h-12 rounded-full bg-center bg-cover bg-no-repeat shrink-0 border border-gray-200"
                        style={{
                            backgroundImage: `url(${user?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`})`
                        }}
                    />
                )}
                {isCollapsed && (
                    <div
                        className="w-10 h-10 rounded-full bg-center bg-cover bg-no-repeat shrink-0 border border-gray-200"
                        style={{
                            backgroundImage: `url(${user?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`})`
                        }}
                    />
                )}

                {!isCollapsed && (
                    <div className="flex flex-col overflow-hidden">
                        <h1 className="text-lg font-bold font-serif text-[#0d1c11] dark:text-white leading-tight truncate">
                            Cafe South Central
                        </h1>
                        <p className="text-sm font-medium text-[#499c5e] truncate">Customer Profile</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 px-3 flex-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group relative
                                ${isActive
                                    ? 'bg-[#0ac238]/10 text-[#0ac238]'
                                    : 'text-[#0d1c11] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }
                                ${isCollapsed ? 'justify-center px-2' : ''}
                            `}
                            title={isCollapsed ? item.label : ''}
                        >
                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'fill-current' : ''}`} />

                            {!isCollapsed && (
                                <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className={`px-3 py-2 flex ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>

            {/* Logout */}
            <div className="p-6 mt-auto border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={onLogout}
                    className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors
                        ${isCollapsed ? 'justify-center px-2' : ''}
                    `}
                    title={isCollapsed ? "Sign Out" : ''}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
}
