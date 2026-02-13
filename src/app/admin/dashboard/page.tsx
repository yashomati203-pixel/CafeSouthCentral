'use client';

import { useState, useEffect, useRef } from 'react';
import { printKOT, printBill } from '@/lib/printer';

// Components
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import LiveOrdersBoard from '@/components/admin/LiveOrdersBoard';
import InventoryManager from '@/components/admin/InventoryManager';
import UserManagement from '@/components/admin/UserManagement';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import PosTerminal from '@/components/admin/PosTerminal';

export default function AdminDashboard() {
    // -------------------------------------------------------------------------
    // STATE MANAGEMENT
    // -------------------------------------------------------------------------
    const [activeTab, setActiveTab] = useState('active');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Data State
    const [orders, setOrders] = useState<any[]>([]);
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'today' | 'week' | 'month'>('week');

    // Loading States
    const [loading, setLoading] = useState(true);

    // Audio Context Ref
    const audioContextRef = useRef<AudioContext | null>(null);
    const prevOrdersLength = useRef(0);

    // -------------------------------------------------------------------------
    // DATA FETCHING
    // -------------------------------------------------------------------------
    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            if (res.status === 401 || res.status === 403) {
                window.location.href = '/?login=true';
                return;
            }
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);

                // New Order Notification
                const activeCount = data.filter((o: any) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
                if (activeCount > prevOrdersLength.current) {
                    playNotificationSound();
                }
                prevOrdersLength.current = activeCount;
            }
        } catch (e) {
            console.error("Failed to fetch orders", e);
        }
    };

    const fetchInventory = async () => {
        try {
            const res = await fetch('/api/menu', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setMenuItems(data);
            }
        } catch (e) { console.error(e); }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) setUsers(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchAnalytics = async (timeframe: 'today' | 'week' | 'month' = analyticsTimeframe, startDate?: string, endDate?: string) => {
        try {
            let url = `/api/admin/analytics?timeframe=${timeframe}`;
            if (startDate && endDate) {
                url += `&startDate=${startDate}&endDate=${endDate}`;
            }
            const res = await fetch(url);
            if (res.ok) setAnalyticsData(await res.json());
        } catch (e) { console.error(e); }
    };

    const handleDateRangeChange = (startDate: string, endDate: string) => {
        fetchAnalytics(analyticsTimeframe, startDate, endDate);
    };

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------
    useEffect(() => {
        // Initial Load
        const init = async () => {
            await Promise.all([fetchOrders(), fetchInventory(), fetchUsers(), fetchAnalytics()]);
            setLoading(false);
        };
        init();

        // Polling
        const interval = setInterval(() => {
            fetchOrders();
            // Only poll inventory/analytics if on those tabs to save bandwidth
            if (activeTab === 'inventory') fetchInventory();
            if (activeTab === 'analytics') fetchAnalytics();
        }, 5000);

        return () => clearInterval(interval);
    }, [activeTab]);

    // -------------------------------------------------------------------------
    // ACTIONS
    // -------------------------------------------------------------------------
    const playNotificationSound = () => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            oscillator.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6 (Ding!)

            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.error("Audio play failed", e);
            // Non-blocking interaction often blocks audio context until 1st click.
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        // Optimistic Update
        const oldOrders = [...orders];
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));

        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update');

            // Refetch to sync perfect state
            setTimeout(fetchOrders, 500);
        } catch (e) {
            console.error("Status update failed", e);
            setOrders(oldOrders); // Revert
            alert("Failed to update status. Please try again.");
        }
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('cafe_user');
            sessionStorage.removeItem('cafe_user');
            window.location.href = '/';
        }
    };

    // -------------------------------------------------------------------------
    // PASS DATA TO CHILDREN
    // -------------------------------------------------------------------------
    const activeOrders = orders.filter(o =>
        o.status !== 'COMPLETED' &&
        o.status !== 'CANCELLED_USER' &&
        o.status !== 'CANCELLED_ADMIN'
    );

    const historyOrders = orders.filter(o =>
        o.status === 'COMPLETED' ||
        o.status === 'CANCELLED_USER' ||
        o.status === 'CANCELLED_ADMIN'
    );

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#f8fbf7] text-[#0e2a1a] font-serif animate-pulse">Loading Admin Dashboard...</div>;
    }

    return (
        <div className="flex h-screen bg-[#f8fbf7] overflow-hidden font-sans text-gray-900">
            {/* Sidebar */}
            <AdminSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                ordersCount={activeOrders.length}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">

                <AdminHeader
                    title={
                        activeTab === 'active' ? 'Live Orders' :
                            activeTab === 'pos' ? 'POS Terminal' :
                                activeTab === 'inventory' ? 'Inventory' :
                                    activeTab === 'members' ? 'Members' :
                                        activeTab === 'analytics' ? 'Analytics' :
                                            'Dashboard'
                    }
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    notificationsCount={activeOrders.length}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-gray-50/50">
                    <div className="max-w-7xl mx-auto">

                        {/* VIEW: LIVE ORDERS */}
                        {activeTab === 'active' && (
                            <LiveOrdersBoard
                                orders={activeOrders}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        )}

                        {/* VIEW: POS TERMINAL */}
                        {activeTab === 'pos' && (
                            <PosTerminal
                                items={menuItems}
                                onOrderPlaced={() => {
                                    fetchOrders();
                                    setActiveTab('active'); // Switch to live view to see new order
                                }}
                            />
                        )}

                        {/* VIEW: INVENTORY */}
                        {activeTab === 'inventory' && (
                            <InventoryManager
                                items={menuItems}
                                onRefresh={fetchInventory}
                            />
                        )}

                        {/* VIEW: MEMBERS */}
                        {activeTab === 'members' && (
                            <UserManagement users={users} />
                        )}

                        {/* VIEW: ANALYTICS */}
                        {activeTab === 'analytics' && (
                            <AnalyticsDashboard
                                data={analyticsData}
                                timeframe={analyticsTimeframe}
                                onTimeframeChange={(t) => {
                                    setAnalyticsTimeframe(t);
                                    fetchAnalytics(t);
                                }}
                                onDateRangeChange={handleDateRangeChange}
                            />
                        )}

                        {/* VIEW: HISTORY */}
                        {activeTab === 'sold' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif font-bold text-[#0e2a1a]">Order History</h2>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Order ID</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Customer</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Total</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {historyOrders.map((order: any) => (
                                                <tr key={order.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-bold text-[#0e2a1a]">#{order.displayId || order.id.slice(0, 5)}</td>
                                                    <td className="px-6 py-4 text-sm">{order.user.name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold">₹{order.totalAmount}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                            order.status.includes('CANCEL') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => printBill(order)}
                                                            className="text-indigo-600 hover:text-indigo-900 text-xs font-bold"
                                                        >
                                                            Reprint Bill
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}
