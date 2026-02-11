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
                fixed inset-y-0 left-0 z-50 w-72 bg-[#f8fbf7] border-r border-[#14b84b]/10 shadow-xl transition-transform duration-300 md:translate-x-0 md:static md:shadow-none flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Header */}
                <div className="p-6 md:p-8 flex items-center justify-between border-b border-[#14b84b]/5">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md">
                            <Image
                                src="/coconut-logo.png.png"
                                alt="Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="font-serif text-xl font-bold text-[#0e2a1a] leading-tight">
                                Cafe South<br />Central
                            </h1>
                        </div>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 text-gray-500 hover:text-gray-900"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-[10px] font-bold text-[#0e2a1a]/40 uppercase tracking-widest mb-4 mt-2">
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
                                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-[#0e2a1a] text-white shadow-lg shadow-[#0e2a1a]/20'
                                        : 'text-[#0e2a1a]/60 hover:bg-[#0e2a1a]/5 hover:text-[#0e2a1a]'
                                    }
                                `}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#f59e0b]' : 'text-current opacity-70 group-hover:opacity-100'}`} />
                                <span>{item.label}</span>

                                {/* Badge for Live Orders */}
                                {item.id === 'active' && ordersCount > 0 && (
                                    <span className={`
                                        ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full
                                        ${isActive
                                            ? 'bg-[#f59e0b] text-[#0e2a1a]'
                                            : 'bg-red-500 text-white shadow-sm shadow-red-500/30 animate-pulse'
                                        }
                                    `}>
                                        {ordersCount}
                                    </span>
                                )}

                                {/* Active Indicator Strip */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#f59e0b] rounded-r-full" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-[#14b84b]/5 bg-[#f8fbf7]">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:shadow-sm transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
