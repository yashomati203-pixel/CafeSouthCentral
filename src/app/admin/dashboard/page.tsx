'use client';

import { useState, useEffect, useRef } from 'react';
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
    user: { name: string; phone: string; subscriptions: any[] };
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
    timeSlot?: string;
    mode?: string;
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'stock' | 'members'>('active');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [users, setUsers] = useState<any[]>([]);

    // Inventory State
    const [menuItems, setMenuItems] = useState<any[]>([]);

    // Sound
    // const [play] = useSound('/notification.mp3'); // Requires file
    // Implementing a simple beep fallback if no file
    const playNotification = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            oscillator.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6 (Ding!)

            gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.error("Audio play failed", e);
        }
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
        fetchUsers(); // Fetch users

        const interval = setInterval(() => {
            fetchOrders();
            fetchInventory();
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
            const res = await fetch('/api/menu', { cache: 'no-store' }); // Force fresh data
            if (res.ok) {
                const data = await res.json();
                setMenuItems(data);
            }
        } catch (e) {
            console.error("Failed to fetch inventory", e);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (e) {
            console.error("Failed to fetch users", e);
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
        // Red - Urgent (>20 mins)
        if (diffMinutes > 20) return { borderLeft: '6px solid #ef4444', backgroundColor: '#fee2e2', animation: 'pulse 2s infinite' };
        // Yellow - Warning (>10 mins)
        if (diffMinutes > 10) return { borderLeft: '6px solid #f59e0b', backgroundColor: '#fef9c3' };
        // Green - Fresh (<10 mins)
        return { borderLeft: '6px solid #10b981', backgroundColor: '#dcfce7' };
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
                <button onClick={() => { setActiveTab('members'); fetchUsers(); }} style={{ padding: '1rem', borderBottom: activeTab === 'members' ? '3px solid #5C3A1A' : '3px solid transparent', color: activeTab === 'members' ? '#5C3A1A' : '#6b7280', fontWeight: 'bold', cursor: 'pointer', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontSize: '1rem' }}>
                    👥 Members
                </button>
                <button onClick={() => { setActiveTab('stock'); fetchInventory(); }} style={{ padding: '1rem', borderBottom: activeTab === 'stock' ? '3px solid #5C3A1A' : '3px solid transparent', color: activeTab === 'stock' ? '#5C3A1A' : '#6b7280', fontWeight: 'bold', cursor: 'pointer', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontSize: '1rem' }}>
                    📦 Stock
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

            {/* MEMBERS TAB */}
            {activeTab === 'members' && (
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f3f4f6' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Phone</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Orders</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Plan Expiry</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={{ borderTop: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{user.name}</td>
                                    <td style={{ padding: '1rem' }}>{user.phone}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '999px',
                                            fontSize: '0.8rem',
                                            backgroundColor: user.isMember ? '#dcfce7' : '#f3f4f6',
                                            color: user.isMember ? '#166534' : '#666',
                                            fontWeight: 'bold'
                                        }}>
                                            {user.isMember ? 'SUBSCRIBED' : 'CUSTOMER'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{user.orderCount}</td>
                                    <td style={{ padding: '1rem', color: '#666' }}>
                                        {user.subscription
                                            ? new Date(user.subscription.endDate).toLocaleDateString()
                                            : '-'
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && <div style={{ padding: '2rem', textAlign: 'center' }}>No users found</div>}
                </div>
            )}

            {/* STOCK MANAGEMENT TAB */}
            {activeTab === 'stock' && (
                <div style={{ paddingBottom: '4rem' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        {/* Category Filter Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            overflowX: 'auto',
                            scrollbarWidth: 'none'
                        }}>
                            {['All', ...Array.from(new Set(menuItems.map(i => i.category || 'Uncategorized')))].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: '999px',
                                        border: 'none',
                                        backgroundColor: selectedCategory === cat ? '#5C3A1A' : '#EEE',
                                        color: selectedCategory === cat ? 'white' : '#666',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Manual Refresh Button */}
                        <button
                            onClick={() => fetchInventory()}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                color: '#5C3A1A',
                                fontWeight: 'bold'
                            }}
                        >
                            🔄 Refresh
                        </button>
                    </div>

                    {Object.entries(
                        menuItems.reduce((acc, item) => {
                            const cat = item.category || 'Uncategorized';

                            // Filter Logic
                            if (selectedCategory !== 'All' && cat !== selectedCategory) return acc;

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
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    {soldOrders.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>No history available</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#6b7280' }}>Order ID</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#6b7280' }}>Date</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#6b7280' }}>Customer</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#6b7280' }}>Type</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#6b7280' }}>Items</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', color: '#6b7280' }}>Total</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', color: '#6b7280' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {soldOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{order.displayId || order.id.slice(0, 5)}</td>
                                        <td style={{ padding: '1rem', color: '#666' }}>
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: '500' }}>{order.user?.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{order.user?.phone}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem' }}>
                                                {order.user?.subscriptions?.length > 0 ? (
                                                    <span style={{
                                                        backgroundColor: '#dcfce7', color: '#166534',
                                                        fontSize: '0.65rem', padding: '0.1rem 0.4rem',
                                                        borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase'
                                                    }}>
                                                        Member
                                                    </span>
                                                ) : (
                                                    <span style={{
                                                        padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
                                                        backgroundColor: order.mode === 'SUBSCRIPTION' ? '#dbeafe' : '#f3f4f6',
                                                        color: order.mode === 'SUBSCRIPTION' ? '#1e40af' : '#374151'
                                                    }}>
                                                        {order.mode || 'NORMAL'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} style={{ marginBottom: '0.2rem' }}>
                                                    {item.quantity}x {item.name}
                                                </div>
                                            ))}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                                            ₹{order.totalAmount}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => updateStatus(order.id, 'DONE')}
                                                style={{
                                                    padding: '0.4rem 0.8rem',
                                                    backgroundColor: 'white',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '0.375rem',
                                                    color: '#374151',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem',
                                                    transition: 'all 0.2s',
                                                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                            >
                                                ↩ Undo
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
