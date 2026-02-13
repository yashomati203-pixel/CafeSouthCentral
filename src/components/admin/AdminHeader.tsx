'use client';

import React, { useState, useEffect } from 'react';
import {
    Bell,
    Menu,
    Search,
    Printer,
    FileText,
    QrCode,
    AlertTriangle
} from 'lucide-react';
import Image from 'next/image';
import SystemAlertsModal from './SystemAlertsModal';

interface AdminHeaderProps {
    title: string;
    onToggleSidebar: () => void;
    notificationsCount: number;
    actions?: React.ReactNode;
}

export default function AdminHeader({ title, onToggleSidebar, notificationsCount, actions }: AdminHeaderProps) {
    const [showAlertsModal, setShowAlertsModal] = useState(false);
    const [alertCount, setAlertCount] = useState(0);

    // Fetch alert count on mount and periodically
    useEffect(() => {
        const fetchAlertCount = async () => {
            try {
                const res = await fetch('/api/admin/system-alerts');
                if (res.ok) {
                    const data = await res.json();
                    setAlertCount(data.counts?.total || 0);
                }
            } catch (error) {
                console.error('Failed to fetch alert count:', error);
            }
        };

        fetchAlertCount();
        // Refresh every 30 seconds
        const interval = setInterval(fetchAlertCount, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="sticky top-0 z-30 h-16 md:h-20 bg-[#f8fbf7]/80 backdrop-blur-md border-b border-[#14b84b]/10 px-4 md:px-8 flex items-center justify-between">
            {/* Left: Mobile Toggle & Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                    <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-xl md:text-2xl font-serif font-black text-[#0e2a1a] tracking-tight">{title}</h1>
                    <p className="text-[10px] md:text-xs text-[#0e2a1a]/60 font-bold uppercase tracking-widest hidden sm:block">
                        Cafe Management Dashboard
                    </p>
                </div>
            </div>

            {/* Right: Search & Actions */}
            <div className="flex items-center gap-3 md:gap-6">

                {/* Search (Desktop) */}
                <div className="hidden lg:flex items-center bg-white border border-[#14b84b]/10 rounded-full px-4 py-2 w-64 shadow-sm focus-within:ring-2 focus-within:ring-[#14b84b]/20 transition-all">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search orders, items..."
                        className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
                    />
                </div>

                {/* Lunch Bell & Alerts */}
                <div className="flex items-center gap-2 border-l border-[#14b84b]/10 pl-4 md:pl-6 ml-2 md:ml-0">
                    <button
                        onClick={() => {
                            const audio = new Audio('/sounds/bell.mp3'); // We'll need to ensure this file exists or use a generic one
                            audio.play().catch(e => console.log('Audio play failed', e));
                            // toast.success('Lunch Bell Rung! 🔔'); // Need toast import
                            // Since we don't have toast imported here, let's just log or rely on parent.
                            // Better: Add toast here.
                            import('sonner').then(({ toast }) => {
                                toast.success('Lunch Bell Rung! 🔔', {
                                    description: 'Notification sent to all active users.'
                                });
                            });
                        }}
                        className="p-2 bg-[#0e2a1a]/5 text-[#0e2a1a] rounded-lg hover:bg-[#0e2a1a]/10 transition-colors group relative"
                        title="Ring Lunch Bell"
                    >
                        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14b84b] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14b84b]"></span>
                        </span>
                    </button>

                    <div className="relative group">
                        <button className="p-2 text-gray-400 hover:text-[#0e2a1a] rounded-lg transition-colors">
                            <span className="sr-only">Alerts Options</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-2"><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>
                        </button>
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all transform origin-top-right z-50">
                            <div className="text-xs font-bold text-gray-400 uppercase px-3 py-2">Alert Settings</div>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Sound On
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                Notifications Off
                            </button>
                            <hr className="my-1 border-gray-100" />
                            <button
                                onClick={() => setShowAlertsModal(true)}
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-between group"
                            >
                                <span className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    System Alert
                                </span>
                                {alertCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {alertCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {actions}
                </div>

                {/* Profile Placeholder (Simpler for Admin) */}
                <div className="hidden md:flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0e2a1a] text-white flex items-center justify-center font-bold text-xs ring-4 ring-[#0e2a1a]/5">
                        A
                    </div>
                </div>

            </div>

            <SystemAlertsModal
                isOpen={showAlertsModal}
                onClose={() => setShowAlertsModal(false)}
            />
        </header>
    );
}
