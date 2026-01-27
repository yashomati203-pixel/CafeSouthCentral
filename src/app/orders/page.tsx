'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { requestNotificationPermission, sendLocalNotification } from '@/lib/notifications';
import DesktopHeader from '@/components/layout/DesktopHeader';

export default function OrderHistoryPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [activeQrOrder, setActiveQrOrder] = useState<any>(null);
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
    const [selectedDate, setSelectedDate] = useState<string>(''); // For date filtering

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
                                if (JSON.stringify(data) === JSON.stringify(prevOrders)) {
                                    return prevOrders;
                                }

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

            poll();
            const interval = setInterval(poll, 5000);
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

    const toggleOrderExpansion = (orderId: string) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'SOLD':
                return { bg: '#f3f4f6', color: '#374151', label: 'COMPLETED' };
            case 'CANCELLED':
                return { bg: '#fee2e2', color: '#b91c1c', label: 'CANCELLED' };
            case 'DONE':
            case 'READY':
                return { bg: '#d1fae5', color: '#065f46', label: 'READY' };
            case 'PREPARING':
            case 'CONFIRMED':
            case 'RECEIVED':
            case 'PENDING':
                return { bg: '#fef3c7', color: '#92400e', label: 'PREPARING' };
            default:
                return { bg: '#e5e7eb', color: '#4b5563', label: status };
        }
    };

    const getQRStatus = (order: any) => {
        if (order.status === 'SOLD') return { text: 'Scanned ✓', color: '#10b981' };
        if (['DONE', 'READY', 'PREPARING', 'CONFIRMED', 'RECEIVED', 'PENDING'].includes(order.status)) {
            return { text: 'Not Scanned', color: '#6b7280' };
        }
        return null;
    };

    // Filter orders by selected date
    const filteredOrders = selectedDate
        ? orders.filter(order => {
            const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
            return orderDate === selectedDate;
        })
        : orders;

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading history...</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FFF8F0' }}>
            <DesktopHeader
                user={user}
                onLoginClick={() => router.push('/?login=true')}
            />
            <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#5C3A1A', margin: 0 }}>Order History</h1>

                    {/* Date Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <label htmlFor="orderDate" style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>
                            Filter by Date:
                        </label>
                        <input
                            type="date"
                            id="orderDate"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{
                                padding: '0.5rem 0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                color: '#374151',
                                backgroundColor: 'white',
                                cursor: 'pointer'
                            }}
                        />
                        {selectedDate && (
                            <button
                                onClick={() => setSelectedDate('')}
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    backgroundColor: '#f3f4f6',
                                    color: '#6b7280',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '700px', margin: '0 auto' }}>
                        {filteredOrders.map(order => {
                            const isExpanded = expandedOrders.has(order.id);
                            const statusStyle = getStatusStyle(order.status);
                            const qrStatus = getQRStatus(order);

                            return (
                                <div
                                    key={order.id}
                                    style={{
                                        backgroundColor: '#fdf9ee',
                                        borderRadius: '1rem',
                                        padding: '1.5rem',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        border: '1px solid #e5e7eb'
                                    }}
                                >
                                    {/* Card Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                                            #{order.displayId || order.id.slice(0, 10).toUpperCase()}
                                        </h3>
                                        <span style={{
                                            padding: '0.375rem 0.75rem',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            backgroundColor: statusStyle.bg,
                                            color: statusStyle.color
                                        }}>
                                            {statusStyle.label}
                                        </span>
                                    </div>

                                    {/* Date & Time */}
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })} | {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>

                                    {/* Scheduled Time Tag */}
                                    {order.timeSlot && (
                                        <div style={{
                                            display: 'inline-block',
                                            backgroundColor: '#fef3c7',
                                            color: '#92400e',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            marginBottom: '1rem'
                                        }}>
                                            ⏰ Scheduled: {order.timeSlot}
                                        </div>
                                    )}

                                    {/* Expandable Details */}
                                    {isExpanded && (
                                        <div style={{
                                            marginTop: '1rem',
                                            paddingTop: '1rem',
                                            borderTop: '1px solid #e5e7eb',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1rem'
                                        }}>
                                            {/* Items */}
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                                    Items:
                                                </div>
                                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                    {order.items.map((item: any, idx: number) => (
                                                        <div key={idx} style={{ marginBottom: '0.25rem' }}>
                                                            🍽️ {item.quantity}x {item.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Payment Method */}
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                                                    Payment:
                                                </div>
                                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                    💳 {order.mode === 'SUBSCRIPTION' ? 'Subscription' : (order.paymentMethod === 'CASH' ? 'Cash/Counter' : order.paymentMethod)}
                                                </div>
                                            </div>

                                            {/* Total Amount */}
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                                                    Total:
                                                </div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                                                    ₹{order.totalAmount}
                                                </div>
                                            </div>

                                            {/* QR Code Status */}
                                            {qrStatus && (
                                                <div>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                                                        QR Code Status:
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontSize: '1.25rem' }}>📱</span>
                                                        <span style={{ fontSize: '0.875rem', color: qrStatus.color, fontWeight: '600' }}>
                                                            {qrStatus.text}
                                                        </span>
                                                    </div>
                                                    {/* Show QR Code button for active orders */}
                                                    {qrStatus.text === 'Not Scanned' && (
                                                        <button
                                                            onClick={() => setActiveQrOrder(order)}
                                                            style={{
                                                                marginTop: '0.5rem',
                                                                padding: '0.5rem 1rem',
                                                                backgroundColor: '#5C3A1A',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '0.5rem',
                                                                fontSize: '0.875rem',
                                                                fontWeight: '600',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            View QR Code
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                                {isCancellable(order) && (
                                                    <button
                                                        onClick={() => handleCancel(order.id)}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            fontSize: '0.875rem',
                                                            color: '#ef4444',
                                                            backgroundColor: '#fee2e2',
                                                            border: '1px solid #fecaca',
                                                            borderRadius: '0.5rem',
                                                            cursor: 'pointer',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        Cancel Order
                                                    </button>
                                                )}
                                                <a
                                                    href={`/receipt/${order.id}`}
                                                    target="_blank"
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        padding: '0.5rem 1rem',
                                                        backgroundColor: '#f3f4f6',
                                                        color: '#374151',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '0.5rem',
                                                        textDecoration: 'none',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    📄 View Receipt
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Collapse/Expand Button */}
                                    <button
                                        onClick={() => toggleOrderExpansion(order.id)}
                                        style={{
                                            width: '100%',
                                            marginTop: '1rem',
                                            padding: '0.75rem',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            color: '#5C3A1A',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <span>View Order Details</span>
                                        <span style={{ fontSize: '1.25rem' }}>
                                            {isExpanded ? '▲' : '▼'}
                                        </span>
                                    </button>

                                    {/* Total Amount (visible when collapsed) */}
                                    {!isExpanded && (
                                        <div style={{
                                            fontSize: '1.125rem',
                                            fontWeight: 'bold',
                                            color: '#1f2937',
                                            textAlign: 'right',
                                            marginTop: '0.5rem'
                                        }}>
                                            ₹{order.totalAmount}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
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
        </div>
    );
}
