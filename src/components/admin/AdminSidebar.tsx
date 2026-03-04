'use client';

import React from 'react';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Package,
    History,
    BarChart3,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface AdminSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    ordersCount?: number;
    isOpen: boolean; // For mobile toggle
    onClose: () => void;
    onLogout: () => void;
}

const NAV_ITEMS = [
    { id: 'active', label: 'Live Orders', icon: LayoutDashboard },
    { id: 'pos', label: 'New Order (POS)', icon: ShoppingBag },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Package }, // Renamed from Stock
    { id: 'sold', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminSidebar({ activeTab, onTabChange, ordersCount = 0, isOpen, onClose, onLogout }: AdminSidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-[#e8f5e9] border-r border-[#102214]/10 shadow-xl transition-transform duration-300 md:translate-x-0 md:static md:shadow-none flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Header */}
                <div className="p-3 md:p-4 flex items-center justify-between border-b border-[#102214]/10">
                    <Link href="/" className="flex items-center gap-3 mx-auto cursor-pointer">
                        <div className="relative w-36 h-14 rounded-lg overflow-hidden">
                            <Image
                                src="/logo without border.png"
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 text-gray-500 hover:text-gray-900 absolute right-4"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-[10px] font-bold text-[#102214]/50 uppercase tracking-widest mb-1 mt-0">
                        Management
                    </p>
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onTabChange(item.id);
                                    if (window.innerWidth < 768) onClose();
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-[#14b84b] text-white shadow-lg shadow-[#14b84b]/20'
                                        : 'text-[#102214]/70 hover:bg-[#102214]/5 hover:text-[#102214]'
                                    }
                                `}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-current opacity-70 group-hover:opacity-100'}`} />
                                <span>{item.label}</span>

                                {/* Badge for Live Orders */}
                                {item.id === 'active' && ordersCount > 0 && (
                                    <span className={`
                                        ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full
                                        ${isActive
                                            ? 'bg-white text-[#14b84b]'
                                            : 'bg-red-500 text-white shadow-sm shadow-red-500/30 animate-pulse'
                                        }
                                    `}>
                                        {ordersCount}
                                    </span>
                                )}

                                {/* Active Indicator Strip */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-white rounded-r-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className="p-3 pb-16 mt-auto border-t border-[#102214]/10">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 hover:shadow-sm transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
