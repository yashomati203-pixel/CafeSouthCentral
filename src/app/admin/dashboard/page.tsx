'use client';

import { useState, useEffect, useRef } from 'react';
import useSound from 'use-sound';
import StockItem from '@/components/admin/StockItem';

// Ensure the sound file path is correct. If doesn't exist, it might silent fail or error.
// Assuming a sound exists or ignoring error for now. 
// Standard strategy: Use a public URL or ensure file existence.
// For now, let's comment out or try a standard path. 
// const NOTIFICATION_SOUND = '/sounds/notification.mp3'; 

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    displayId?: string;
    user: { name: string; phone: string };
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
    timeSlot?: string;
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'stock'>('active');

    // Inventory State
    const [menuItems, setMenuItems] = useState<any[]>([]);

    // Sound
    // const [play] = useSound('/notification.mp3'); // Requires file
    // Implementing a simple beep fallback if no file
    const playNotification = () => {
        try {
            const audio = new Audio('/notification.mp3'); // Try public folder
            audio.play().catch(e => console.log("Audio play failed (interaction needed or file missing)", e));
        } catch (e) { }
    };

    const prevOrdersLength = useRef(0);

    useEffect(() => {
        // Auth Check
        const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
        if (!storedUser) {
            window.location.href = '/';
            return;
        }
        try {
            const parsed = JSON.parse(storedUser);
            if (parsed.role !== 'ADMIN') {
                window.location.href = '/';
                return;
            }
        } catch (e) {
            window.location.href = '/';
            return;
        }

        fetchOrders(); // Initial fetch
        fetchInventory(); // Inventory fetch

        const interval = setInterval(() => {
            fetchOrders();
            // sync inventory occasionally too?
        }, 5000); // Poll every 5s for "Live" feel (user requested live)

        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            if (res.status === 401 || res.status === 403) {
                window.location.href = '/';
                return;
            }
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);

                // Sound Alert Logic
                const newActiveCount = data.filter((o: Order) => o.status !== 'SOLD').length;
                if (newActiveCount > prevOrdersLength.current) {
                    playNotification();
                }
                prevOrdersLength.current = newActiveCount;
            }
        } catch (e) {
            console.error("Failed to fetch orders", e);
        }
    };

    const fetchInventory = async () => {
        try {
            const res = await fetch('/api/menu');
            if (res.ok) {
                const data = await res.json();
                setMenuItems(data);
            }
        } catch (e) {
            console.error("Failed to fetch inventory", e);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        // Optimistic update
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));

        try {
            await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (e) {
            console.error("Failed to update status", e);
            fetchOrders(); // Revert on error
        }
    };

    const markAsReady = (id: string) => {
        updateStatus(id, 'DONE'); // Or 'READY'? Using DONE as per current schema
        // "sends a notification to the user" - backend logic usually, or status polling on frontend
    };

    const STATUS_OPTIONS = ['RECEIVED', 'PREPARING', 'DONE', 'SOLD'];

    // Filter and Group Orders
    const activeOrders = orders.filter(o => o.status !== 'SOLD');
    const soldOrders = orders.filter(o => o.status === 'SOLD');

    // Group sold orders by date
    const soldOrdersByDate = soldOrders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(order);
        return acc;
    }, {} as Record<string, Order[]>);

    // Color Logic for Urgency
    const getUrgencyStyle = (createdAt: string) => {
        const diffMinutes = (new Date().getTime() - new Date(createdAt).getTime()) / 60000;
        if (diffMinutes > 20) return { borderLeft: '6px solid #ef4444', animation: 'pulse 2s infinite' }; // Red Pulse
        if (diffMinutes > 10) return { borderLeft: '6px solid #f59e0b' }; // Yellow
        return { borderLeft: '6px solid #10b981' }; // Green
    };

    return (
        <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <style>{`
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#5C3A1A' }}>Admin Control Tower</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => window.location.href = '/admin-scan'}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#5C3A1A', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        📸 Scan QR
                    </button>
                    <button
                        onClick={() => { localStorage.removeItem('cafe_user'); window.location.href = '/'; }}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem', cursor: 'pointer', color: '#d9534f', fontWeight: 'bold' }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* TABS */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                <button onClick={() => setActiveTab('active')} style={{ padding: '1rem', borderBottom: activeTab === 'active' ? '3px solid #5C3A1A' : '3px solid transparent', color: activeTab === 'active' ? '#5C3A1A' : '#6b7280', fontWeight: 'bold', cursor: 'pointer', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ⚡ Live Orders <span style={{ backgroundColor: '#f3f4f6', padding: '0.1rem 0.5rem', borderRadius: '99px', fontSize: '0.8rem' }}>{activeOrders.length}</span>
                </button>
                <button onClick={() => { setActiveTab('stock'); fetchInventory(); }} style={{ padding: '1rem', borderBottom: activeTab === 'stock' ? '3px solid #5C3A1A' : '3px solid transparent', color: activeTab === 'stock' ? '#5C3A1A' : '#6b7280', fontWeight: 'bold', cursor: 'pointer', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontSize: '1rem' }}>
                    📦 Stock Management
                </button>
                <button onClick={() => setActiveTab('sold')} style={{ padding: '1rem', borderBottom: activeTab === 'sold' ? '3px solid #5C3A1A' : '3px solid transparent', color: activeTab === 'sold' ? '#5C3A1A' : '#6b7280', fontWeight: 'bold', cursor: 'pointer', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontSize: '1rem' }}>
                    📜 History
                </button>
            </div>

            {/* LIVE ORDERS TAB */}
            {activeTab === 'active' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {activeOrders.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#666' }}>No active orders</div>
                    ) : (
                        activeOrders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(order => (
                            <div key={order.id} style={{
                                backgroundColor: 'white',
                                borderRadius: '0.5rem',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                padding: '1.5rem',
                                display: 'flex', flexDirection: 'column', gap: '1rem',
                                ...getUrgencyStyle(order.createdAt)
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>#{order.displayId || order.id.slice(0, 5)}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>{order.user?.name}</div>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'right' }}>
                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        <div>{Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 60000)}m ago</div>
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                            <span><span style={{ fontWeight: 'bold' }}>{item.quantity}x</span> {item.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontWeight: 'bold' }}>₹{order.totalAmount}</div>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        style={{ padding: '0.3rem', borderRadius: '0.3rem', borderColor: '#ddd' }}
                                    >
                                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                {order.status !== 'DONE' && (
                                    <button
                                        onClick={() => markAsReady(order.id)}
                                        style={{
                                            width: '100%', padding: '0.75rem',
                                            backgroundColor: '#10b981', color: 'white',
                                            border: 'none', borderRadius: '0.5rem',
                                            fontWeight: 'bold', cursor: 'pointer'
                                        }}
                                    >
                                        ✅ Mark as Ready
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* STOCK MANAGEMENT TAB */}
            {activeTab === 'stock' && (
                <div style={{ paddingBottom: '4rem' }}>
                    {Object.entries(
                        menuItems.reduce((acc, item) => {
                            const cat = item.category || 'Uncategorized';
                            if (!acc[cat]) acc[cat] = [];
                            acc[cat].push(item);
                            return acc;
                        }, {} as Record<string, any[]>)
                    ).map(([category, items]) => (
                        <div key={category} style={{ marginBottom: '2rem' }}>
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                marginBottom: '1rem',
                                color: '#5C3A1A',
                                borderBottom: '2px solid #EEE',
                                paddingBottom: '0.5rem'
                            }}>
                                {category}
                            </h3>
                            <div style={{ backgroundColor: 'white', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                {(items as any[]).map((item: any) => (
                                    <StockItem
                                        key={item.id}
                                        item={item}
                                        onUpdate={(id: string, updates: any) => {
                                            setMenuItems(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                    {menuItems.length === 0 && <div style={{ padding: '2rem', textAlign: 'center' }}>Loading inventory...</div>}
                </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'sold' && (
                <div>
                    {/* Reuse existing history table logic or simplify */}
                    {Object.entries(soldOrdersByDate).map(([date, dayOrders]) => (
                        <div key={date} style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', color: '#666' }}>{date} ({dayOrders.length})</h3>
                            {dayOrders.map(order => (
                                <div key={order.id} style={{ backgroundColor: 'white', padding: '1rem', marginBottom: '0.5rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>#{order.displayId} - {order.user?.name}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontWeight: 'bold' }}>₹{order.totalAmount}</span>
                                        <button
                                            onClick={() => updateStatus(order.id, 'DONE')}
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                fontSize: '0.8rem',
                                                backgroundColor: '#fff',
                                                border: '1px solid #ddd',
                                                borderRadius: '0.25rem',
                                                cursor: 'pointer',
                                                color: '#666'
                                            }}
                                        >
                                            Undo
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
