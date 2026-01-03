'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { requestNotificationPermission, sendLocalNotification } from '@/lib/notifications';

export default function OrderHistoryPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [activeQrOrder, setActiveQrOrder] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
        if (!storedUser) {
            router.push('/');
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [router]);

    useEffect(() => {
        if (user?.id) {
            requestNotificationPermission();

            const poll = () => {
                fetch(`/api/user/orders?userId=${user.id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (Array.isArray(data)) {
                            setOrders(prevOrders => {
                                // Optimization: Only update if data actually changed
                                // This prevents re-rendering the entire list (and re-generating QR codes) every 5 seconds
                                if (JSON.stringify(data) === JSON.stringify(prevOrders)) {
                                    return prevOrders;
                                }

                                // Check for status updates
                                data.forEach(newOrder => {
                                    const oldOrder = prevOrders.find(o => o.id === newOrder.id);
                                    if (oldOrder && oldOrder.status !== 'DONE' && newOrder.status === 'DONE') {
                                        sendLocalNotification(
                                            "Order Ready! 🍽️",
                                            `Order #${newOrder.displayId || newOrder.id.slice(0, 5)} is ready for pickup.`
                                        );
                                    }
                                });
                                return data;
                            });
                        }
                        setLoading(false);
                    })
                    .catch(e => console.error(e));
            };

            poll(); // Initial fetch
            const interval = setInterval(poll, 5000); // Poll every 5s
            return () => clearInterval(interval);
        }
    }, [user?.id]);

    const handleCancel = async (orderId: string) => {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        try {
            const res = await fetch('/api/user/orders/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, userId: user.id })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Order cancelled successfully');
                // Refresh immediatelly
                fetch(`/api/user/orders?userId=${user.id}`).then(r => r.json()).then(setOrders);
            } else {
                alert(data.error);
            }
        } catch (e) {
            alert('Failed to cancel');
        }
    };

    const isCancellable = (order: any) => {
        if (order.status === 'CANCELLED' || order.status === 'SOLD' || order.status === 'DONE') return false;
        const diff = Date.now() - new Date(order.createdAt).getTime();
        return diff < 2 * 60 * 1000; // 2 minutes
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading history...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#5C3A1A' }}>Order History</h1>
                <button
                    onClick={() => router.push('/')}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f3f4f6',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    ← Back to Menu
                </button>
            </div>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666', border: '1px dashed #ccc', borderRadius: '0.5rem' }}>
                    <p>No past orders found.</p>
                    <button
                        onClick={() => router.push('/')}
                        style={{ marginTop: '1rem', color: '#5C3A1A', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Browse Menu
                    </button>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#6b7280' }}>Order ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#6b7280' }}>Date & Time</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#6b7280' }}>Items</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#6b7280' }}>QR Code</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#6b7280' }}>Payment</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', color: '#6b7280' }}>Total</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', color: '#6b7280' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#6b7280' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                        #{order.displayId || order.id.slice(0, 5)}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                                        <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} style={{ marginBottom: '0.2rem' }}>
                                                {item.quantity}x {item.name}
                                            </div>
                                        ))}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        {/* Show QR for active orders INCLUDING DONE (Ready for Pickup) */}
                                        {(order.status === 'RECEIVED' || order.status === 'PENDING' || order.status === 'CONFIRMED' || order.status === 'PREPARING' || order.status === 'READY' || order.status === 'DONE') && (
                                            <div
                                                onClick={() => setActiveQrOrder(order)}
                                                style={{ display: 'inline-block', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #eee', cursor: 'pointer', transition: 'transform 0.2s' }}
                                                className="qr-thumbnail"
                                            >
                                                <QRCodeSVG value={order.id} size={64} />
                                                <div style={{ fontSize: '0.6rem', color: '#999', marginTop: '0.2rem' }}>Click to Expand</div>
                                            </div>
                                        )}
                                        {/* SOLD = Completed */}
                                        {order.status === 'SOLD' && (
                                            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Completed</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                        <div style={{ fontWeight: 500 }}>
                                            {order.mode === 'SUBSCRIPTION' ? 'Subscription' : (order.paymentMethod === 'CASH' ? 'Cash/Counter' : order.paymentMethod)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                                        ₹{order.totalAmount}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <span style={{
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            backgroundColor: order.status === 'DONE' ? '#dcfce7' : (order.status === 'SOLD' ? '#f3f4f6' : (order.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7')),
                                            color: order.status === 'DONE' ? '#166534' : (order.status === 'SOLD' ? '#374151' : (order.status === 'CANCELLED' ? '#b91c1c' : '#92400e'))
                                        }}>
                                            {order.status === 'DONE' ? 'Ready' : (order.status === 'SOLD' ? 'Completed' : order.status)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        {isCancellable(order) && (
                                            <button
                                                onClick={() => handleCancel(order.id)}
                                                style={{
                                                    padding: '0.4rem 0.8rem',
                                                    fontSize: '0.8rem',
                                                    color: '#ef4444',
                                                    backgroundColor: '#fee2e2',
                                                    border: '1px solid #fecaca',
                                                    borderRadius: '0.3rem',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <a href={`/receipt/${order.id}`} target="_blank" style={{ display: 'inline-block', marginLeft: '0.5rem', textDecoration: 'none', fontSize: '1.2rem', verticalAlign: 'middle' }} title="View Receipt">
                                            📄
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {activeQrOrder && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setActiveQrOrder(null)}>
                    <div style={{
                        backgroundColor: 'white', padding: '2rem', borderRadius: '1rem',
                        maxWidth: '90%', width: '350px', textAlign: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Order QR Code</h3>
                            <button onClick={() => setActiveQrOrder(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem', display: 'inline-block' }}>
                            <QRCodeSVG value={activeQrOrder.id} size={200} />
                        </div>
                        <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
                            Show this to the counter staff to pick up your order.
                        </p>
                        <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>#{activeQrOrder.displayId || activeQrOrder.id.slice(0, 5)}</p>
                        <button
                            onClick={() => setActiveQrOrder(null)}
                            style={{
                                marginTop: '1.5rem', width: '100%', padding: '0.75rem',
                                backgroundColor: '#5C3A1A', color: 'white', border: 'none',
                                borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
