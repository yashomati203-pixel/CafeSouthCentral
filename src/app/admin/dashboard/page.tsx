'use client';

import { useState, useEffect, useRef } from 'react';
import StockItem from '@/components/admin/StockItem';
import { printKOT } from '@/lib/printer';

const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    if (isNaN(h)) return timeStr;
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${suffix}`;
};

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
    note?: string;
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'stock' | 'members' | 'feedback' | 'analytics' | 'pos'>('active');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [users, setUsers] = useState<any[]>([]);

    // Inventory State
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [isInventoryLoading, setIsInventoryLoading] = useState(true);

    // Feedback State
    const [feedbacks, setFeedbacks] = useState<any[]>([]);

    // Analytics State
    const [analytics, setAnalytics] = useState<any>(null);

    // POS State
    const [posCart, setPosCart] = useState<{ item: any; qty: number }[]>([]);
    const [posPhone, setPosPhone] = useState('');
    const [posName, setPosName] = useState('');
    const [posSearch, setPosSearch] = useState('');
    const [posLoading, setPosLoading] = useState(false);

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
        fetchFeedback(); // Fetch feedback

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



    // ... (inside fetchInventory)
    const fetchInventory = async () => {
        try {
            const res = await fetch('/api/menu', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setMenuItems(data);
            }
        } catch (e) {
            console.error("Failed to fetch inventory", e);
        } finally {
            setIsInventoryLoading(false);
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

    const fetchFeedback = async () => {
        try {
            const res = await fetch('/api/admin/feedback');
            if (res.ok) {
                const data = await res.json();
                setFeedbacks(data);
            }
        } catch (e) {
            console.error("Failed to fetch feedback", e);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/admin/analytics');
            if (res.ok) {
                const data = await res.json();
                setAnalytics(data);
            }
        } catch (e) {
            console.error("Failed to fetch analytics", e);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        // Optimistic update
        const previousOrders = [...orders];
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));

        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) {
                throw new Error('Failed to update');
            }

            // Longer delay to ensure API update completes before refresh
            // This prevents polling from overwriting the update
            setTimeout(() => {
                fetchOrders();
            }, 500);
        } catch (e) {
            console.error("Failed to update status", e);
            // Revert to previous state on error
            setOrders(previousOrders);
        }
    };

    const markAsReady = (id: string) => {
        updateStatus(id, 'DONE'); // Or 'READY'? Using DONE as per current schema
        // "sends a notification to the user" - backend logic usually, or status polling on frontend
    };

    const STATUS_OPTIONS = ['RECEIVED', 'PREPARING', 'DONE', 'SOLD'];

    // Filter and Group Orders
    const activeOrders = orders.filter(o => o.status !== 'SOLD' && o.status !== 'CANCELLED');
    const soldOrders = orders.filter(o => o.status === 'SOLD' || o.status === 'CANCELLED');

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

    // POS Functions
    const addToPosCart = (item: any) => {
        setPosCart(prev => {
            const existing = prev.find(i => i.item.id === item.id);
            if (existing) {
                return prev.map(i => i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { item, qty: 1 }];
        });
    };

    const updatePosQty = (itemId: string, delta: number) => {
        setPosCart(prev => prev.map(i => {
            if (i.item.id === itemId) {
                const newQty = Math.max(1, i.qty + delta);
                return { ...i, qty: newQty };
            }
            return i;
        }));
    };

    const removeFromPosCart = (itemId: string) => {
        setPosCart(prev => prev.filter(i => i.item.id !== itemId));
    };

    const placePosOrder = async () => {
        if (!posPhone || posCart.length === 0) {
            alert('Phone and Items are required');
            return;
        }
        setPosLoading(true);
        try {
            const res = await fetch('/api/admin/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: posPhone,
                    name: posName,
                    items: posCart.map(i => ({ menuItemId: i.item.id, qty: i.qty })),
                    paymentMethod: 'CASH',
                    note: 'Counter Order'
                })
            });
            const data = await res.json();
            if (res.ok) {
                setPosCart([]);
                setPosPhone('');
                setPosName('');
                fetchOrders();

                // Construct pseudo-order for printing immediately
                // We need to fetch the fresh order or mock it. Mocking is faster for UI response.
                const printableOrder = {
                    id: data.orderId,
                    displayId: data.displayId,
                    user: { name: posName || 'Walk-in', phone: posPhone },
                    createdAt: new Date().toISOString(),
                    items: posCart.map(i => ({ quantity: i.qty, name: i.item.name })),
                    // totalAmount not returned by createNormalOrder unless we update it? 
                    // createNormalOrder returns { orderId, displayId, totalAmount, status }
                    // So data.totalAmount should be there.
                };
                printKOT(printableOrder);
                alert('Order Placed & Print Sent!');
                setActiveTab('active');
            } else {
                alert('Failed: ' + (data.error || 'Unknown error'));
            }
        } catch (e) {
            console.error(e);
            alert('Error placing order');
        } finally {
            setPosLoading(false);
        }
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
                        onClick={async () => {
                            if (confirm('Send "Lunch Time" notification to all users?')) {
                                try {
                                    const res = await fetch('/api/admin/broadcast', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            title: "It's Lunch Time! 🍛",
                                            body: "Avoid the queue! Pre-order your food now and pick it up fresh."
                                        })
                                    });
                                    const data = await res.json();
                                    if (data.success) alert(`Sent to ${data.sentCount} users!`);
                                    else alert(`Failed to send: ${data.details || data.error || JSON.stringify(data)}`);
                                } catch (e) {
                                    alert('Error broadcasting');
                                }
                            }
                        }}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#eab308', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        📢 Lunch Bell
                    </button>
                    <button
                        onClick={() => window.location.href = '/admin-scan'}
                        style={{ padding: '0.5rem 1rem', backgroundColor: '#5C3A1A', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        📸 Scan QR
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('cafe_user');
                            sessionStorage.removeItem('cafe_user');
                            window.location.href = '/';
                        }}
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
                <button onClick={() => { setActiveTab('pos'); fetchInventory(); }} style={{ padding: '1rem', borderBottom: activeTab === 'pos' ? '3px solid #5C3A1A' : '3px solid transparent', color: activeTab === 'pos' ? '#5C3A1A' : '#6b7280', fontWeight: 'bold', cursor: 'pointer', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontSize: '1rem' }}>
                    🍔 New Order (POS)
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
                <button onClick={() => { setActiveTab('feedback'); fetchFeedback(); }} style={{ padding: '1rem', borderBottom: activeTab === 'feedback' ? '3px solid #5C3A1A' : '3px solid transparent', color: activeTab === 'feedback' ? '#5C3A1A' : '#6b7280', fontWeight: 'bold', cursor: 'pointer', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontSize: '1rem' }}>
                    ⭐ Feedback
                </button>
                <button onClick={() => { setActiveTab('analytics'); fetchAnalytics(); }} style={{ padding: '1rem', borderBottom: activeTab === 'analytics' ? '3px solid #5C3A1A' : '3px solid transparent', color: activeTab === 'analytics' ? '#5C3A1A' : '#6b7280', fontWeight: 'bold', cursor: 'pointer', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', fontSize: '1rem' }}>
                    📊 Analytics
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
                                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            #{order.displayId || order.id.slice(0, 5)}
                                            <button
                                                onClick={() => printKOT(order)}
                                                title="Print Kitchen Ticket"
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: 0 }}
                                            >
                                                🖨️
                                            </button>
                                            <a href={`/receipt/${order.id}`} target="_blank" title="View Receipt" style={{ textDecoration: 'none', fontSize: '1rem', cursor: 'pointer' }}>📄</a>
                                        </div>
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

                                {order.timeSlot && (
                                    <div style={{
                                        backgroundColor: '#fffbeb',
                                        color: '#b45309',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #fcd34d',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                        fontSize: '1.1rem'
                                    }}>
                                        ⏰ Scheduled: {formatTime(order.timeSlot!)}
                                    </div>
                                )}

                                {order.note && (
                                    <div style={{ backgroundColor: '#fff7ed', color: '#c2410c', padding: '0.5rem', borderRadius: '0.25rem', fontSize: '0.9rem', border: '1px dashed #fdba74' }}>
                                        📝 <strong>Note:</strong> {order.note}
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ fontWeight: 'bold' }}>₹{order.totalAmount}</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: '140px' }}>
                                        {STATUS_OPTIONS.map((status, idx) => {
                                            const statusIndex = STATUS_OPTIONS.indexOf(order.status);
                                            const currentIndex = idx;
                                            const isCompleted = currentIndex <= statusIndex;
                                            const isClickable = currentIndex >= statusIndex;

                                            return (
                                                <div
                                                    key={status}
                                                    onClick={() => isClickable && updateStatus(order.id, status)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        cursor: isClickable ? 'pointer' : 'not-allowed',
                                                        opacity: isClickable ? 1 : 0.5,
                                                        padding: '0.3rem 0.5rem',
                                                        borderRadius: '0.25rem',
                                                        transition: 'background-color 0.2s',
                                                        backgroundColor: isCompleted ? '#f0fdf4' : 'transparent'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (isClickable) e.currentTarget.style.backgroundColor = '#f3f4f6';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (isClickable) e.currentTarget.style.backgroundColor = isCompleted ? '#f0fdf4' : 'transparent';
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '18px',
                                                        height: '18px',
                                                        borderRadius: '50%',
                                                        border: isCompleted ? '2px solid #10b981' : '2px solid #d1d5db',
                                                        backgroundColor: isCompleted ? '#10b981' : 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}>
                                                        {isCompleted && (
                                                            <span style={{ color: 'white', fontSize: '12px', lineHeight: '1' }}>✓</span>
                                                        )}
                                                    </div>
                                                    <span style={{
                                                        fontSize: '0.85rem',
                                                        fontWeight: isCompleted ? '600' : '400',
                                                        color: isCompleted ? '#059669' : '#6b7280',
                                                        textDecoration: isCompleted ? 'line-through' : 'none'
                                                    }}>
                                                        {status}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
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
                    {menuItems.length === 0 && isInventoryLoading && <div style={{ padding: '2rem', textAlign: 'center' }}>Loading inventory...</div>}
                    {menuItems.length === 0 && !isInventoryLoading && <div style={{ padding: '2rem', textAlign: 'center' }}>No items found in database (checked /api/menu).</div>}
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
                                            {order.timeSlot && (
                                                <div style={{ color: '#d97706', fontWeight: 'bold', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                                    ⏰ {formatTime(order.timeSlot)}
                                                </div>
                                            )}
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
                                            {order.note && (
                                                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#c2410c', backgroundColor: '#fff7ed', padding: '0.2rem 0.4rem', borderRadius: '4px', display: 'inline-block' }}>
                                                    📝 {order.note}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                                            ₹{order.totalAmount}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            {order.status === 'CANCELLED' ? (
                                                <span style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                    CANCELLED
                                                </span>
                                            ) : (
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
                                            )}
                                            <button
                                                onClick={() => printKOT(order)}
                                                title="Print Kitchen Ticket"
                                                style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', verticalAlign: 'middle', padding: 0 }}
                                            >
                                                🖨️
                                            </button>
                                            <a href={`/receipt/${order.id}`} target="_blank" title="View Receipt" style={{ marginLeft: '0.5rem', textDecoration: 'none', fontSize: '1.2rem', verticalAlign: 'middle' }}>📄</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )
            }

            {/* FEEDBACK TAB */}
            {
                activeTab === 'feedback' && (
                    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        {feedbacks.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>No feedback received yet</div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#f3f4f6' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Customer</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Rating</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Comment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbacks.map(item => (
                                        <tr key={item.id} style={{ borderTop: '1px solid #eee' }}>
                                            <td style={{ padding: '1rem', color: '#666' }}>
                                                {new Date(item.createdAt).toLocaleString()}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 'bold' }}>{item.user?.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.user?.phone}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} style={{ color: i < item.rating ? '#fbbf24' : '#e5e7eb', fontSize: '1.2rem' }}>★</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem', maxWidth: '400px', lineHeight: '1.5' }}>
                                                {item.comment || <span style={{ color: '#ccc', fontStyle: 'italic' }}>No comment</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )
            }

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    {!analytics ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>Loading analytics...</div>
                    ) : analytics.stats.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>No sales data yet</div>
                    ) : (
                        <>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#5C3A1A', marginBottom: '0.5rem' }}>📊 Item Analytics</h2>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>Total Orders Analyzed: {analytics.totalOrders}</p>

                                {/* Reports Section */}
                                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#5C3A1A', marginBottom: '0.75rem' }}>📄 Generate Reports</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {['day', 'week', 'month', 'year'].map(period => (
                                            <button
                                                key={period}
                                                onClick={async () => {
                                                    try {
                                                        const res = await fetch(`/api/admin/reports?period=${period}`);
                                                        const data = await res.json();

                                                        // Create CSV report
                                                        const csvRows = [
                                                            [`Sales Report - ${period.toUpperCase()}`],
                                                            [`Generated`, new Date().toLocaleDateString()],
                                                            [],
                                                            [`Period`, `Start Date`, `End Date`],
                                                            [`Summary`, new Date(data.startDate).toLocaleDateString(), new Date(data.endDate).toLocaleDateString()],
                                                            [],
                                                            [`Metric`, `Value`],
                                                            [`Total Revenue`, `₹${data.totalRevenue.toFixed(2)}`],
                                                            [`Total Orders`, data.totalOrders],
                                                            [`Average Order Value`, `₹${data.averageOrderValue.toFixed(2)}`],
                                                            [],
                                                            [`TOP 10 ITEMS`],
                                                            [`Rank`, `Item Name`, `Quantity Sold`, `Revenue`],
                                                            ...data.topItems.map((item: any, i: number) =>
                                                                [`${i + 1}`, item.name, item.quantity, `₹${item.revenue.toFixed(2)}`]
                                                            ),
                                                            [],
                                                            [`PAYMENT BREAKDOWN`],
                                                            [`Payment Method`, `Order Count`],
                                                            ...Object.entries(data.paymentBreakdown).map(([method, count]) =>
                                                                [method, count]
                                                            )
                                                        ];

                                                        // Convert to CSV string
                                                        const csvContent = csvRows.map(row => row.join(',')).join('\n');

                                                        // Download as CSV file
                                                        const blob = new Blob([csvContent], { type: 'text/csv' });
                                                        const url = URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = `sales-report-${period}-${Date.now()}.csv`;
                                                        a.click();
                                                        URL.revokeObjectURL(url);
                                                    } catch (e) {
                                                        alert('Failed to generate report');
                                                    }
                                                }}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#5C3A1A',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0.5rem',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3d2612'}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#5C3A1A'}
                                            >
                                                {period === 'day' && '📅'}
                                                {period === 'week' && '📆'}
                                                {period === 'month' && '🗓️'}
                                                {period === 'year' && '📊'}
                                                {' '}
                                                {period === 'day' ? 'Daily' : period === 'week' ? 'Weekly' : period === 'month' ? 'Monthly' : 'Yearly'} Report
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#f3f4f6' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Rank</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Item Name</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Qty Sold</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Orders</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Revenue</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.stats.map((item: any, idx: number) => (
                                        <tr key={item.id} style={{ borderTop: '1px solid #eee', backgroundColor: idx < 5 ? '#fffbeb' : 'white' }}>
                                            <td style={{ padding: '1rem', fontWeight: 'bold', fontSize: '1.2rem', color: idx < 3 ? '#d97706' : '#666' }}>
                                                {idx === 0 && '🥇'}
                                                {idx === 1 && '🥈'}
                                                {idx === 2 && '🥉'}
                                                {idx > 2 && `#${idx + 1}`}
                                            </td>
                                            <td style={{ padding: '1rem', fontWeight: '600' }}>{item.name}</td>
                                            <td style={{ padding: '1rem', color: '#666', fontSize: '0.9rem' }}>{item.category}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>{item.totalQuantity}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right', color: '#666' }}>{item.orderCount}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#059669' }}>₹{item.totalRevenue.toFixed(2)}</td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                {idx < 5 && (
                                                    <span style={{
                                                        backgroundColor: '#fef3c7',
                                                        color: '#d97706',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem'
                                                    }}>
                                                        🔥 POPULAR
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            )}
            {/* POS TAB */}
            {activeTab === 'pos' && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', height: 'calc(100vh - 200px)' }}>
                    {/* Left: Menu Items */}
                    <div style={{ overflowY: 'auto', paddingRight: '1rem' }}>
                        <div style={{ position: 'sticky', top: 0, backgroundColor: '#f9fafb', paddingBottom: '1rem', zIndex: 10 }}>
                            <input
                                type="text"
                                placeholder="🔍 Search items..."
                                value={posSearch}
                                onChange={(e) => setPosSearch(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #ddd', marginBottom: '1rem' }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                {['All', ...Array.from(new Set(menuItems.map(i => i.category || 'Uncategorized')))].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '999px',
                                            border: 'none',
                                            backgroundColor: selectedCategory === cat ? '#5C3A1A' : '#e5e7eb',
                                            color: selectedCategory === cat ? 'white' : '#666',
                                            fontWeight: 'bold',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                            {menuItems
                                .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
                                .filter(item => item.name.toLowerCase().includes(posSearch.toLowerCase()))
                                .map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => addToPosCart(item)}
                                        style={{
                                            backgroundColor: 'white',
                                            padding: '1rem',
                                            borderRadius: '0.5rem',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                            cursor: 'pointer',
                                            border: '2px solid transparent',
                                            transition: 'all 0.1s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.borderColor = '#5C3A1A'}
                                        onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                                    >
                                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.name}</div>
                                        <div style={{ color: '#666', fontSize: '0.9rem' }}>₹{item.price}</div>
                                        <div style={{ fontSize: '0.8rem', color: item.inventoryCount > 0 ? '#10b981' : '#ef4444', marginTop: '0.5rem' }}>
                                            {item.inventoryCount > 0 ? `${item.inventoryCount} in stock` : 'Out of Stock'}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Right: Cart */}
                    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', backgroundColor: '#5C3A1A', color: 'white', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>New Order</h2>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                            {posCart.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: '3rem' }}>Cart is empty</div>
                            ) : (
                                posCart.map((line, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold' }}>{line.item.name}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>₹{line.item.price * line.qty}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <button onClick={(e) => { e.stopPropagation(); updatePosQty(line.item.id, -1); }} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: 'white', cursor: 'pointer' }}>-</button>
                                            <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{line.qty}</span>
                                            <button onClick={(e) => { e.stopPropagation(); updatePosQty(line.item.id, 1); }} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: 'white', cursor: 'pointer' }}>+</button>
                                            <button onClick={() => removeFromPosCart(line.item.id)} style={{ marginLeft: '0.5rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ padding: '1.5rem', borderTop: '1px solid #eee', backgroundColor: '#f9fafb' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#374151' }}>Customer Phone *</label>
                                <input
                                    type="tel"
                                    value={posPhone}
                                    onChange={(e) => setPosPhone(e.target.value)}
                                    placeholder="Enter 10-digit number"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#374151' }}>Customer Name (Optional)</label>
                                <input
                                    type="text"
                                    value={posName}
                                    onChange={(e) => setPosName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111' }}>
                                <span>Total</span>
                                <span>₹{posCart.reduce((sum, i) => sum + (i.item.price * i.qty), 0)}</span>
                            </div>

                            <button
                                onClick={placePosOrder}
                                disabled={posLoading || posCart.length === 0 || !posPhone}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: posLoading ? '#9ca3af' : '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    cursor: posLoading ? 'not-allowed' : 'pointer',
                                    opacity: (posCart.length === 0 || !posPhone) ? 0.5 : 1
                                }}
                            >
                                {posLoading ? 'Processing...' : '✅ Place Counter Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
