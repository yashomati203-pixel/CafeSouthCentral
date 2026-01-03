'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ReceiptPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetch(`/api/orders/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        // alert(data.error);
                    } else {
                        setOrder(data);
                    }
                })
                .catch(err => console.error("Failed to fetch order", err))
                .finally(() => setLoading(false));
        }
    }, [params.id]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Loading Receipt...</div>;
    if (!order) return <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Order not found.</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem' }}>
            <style jsx global>{`
                @media print {
                    body { background-color: white; }
                    .no-print { display: none !important; }
                    .print-container { box-shadow: none !important; border: none !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
                }
            `}</style>

            <div className="print-container" style={{
                backgroundColor: 'white',
                width: '100%',
                maxWidth: '400px', // Receipt width
                padding: '2rem',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                display: 'flex', flexDirection: 'column', gap: '1rem',
                color: '#1f2937',
                fontFamily: 'Courier New, Courier, monospace' // Receipt font
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', borderBottom: '2px dashed #ddd', paddingBottom: '1rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>Cafe South Central</h1>
                    <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}>VIT-AP University</p>
                    <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}>+91 98765 43210</p>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <div>
                        <div><strong>Order:</strong> #{order.displayId || order.id.slice(0, 5).toUpperCase()}</div>
                        <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
                        <div><strong>Time:</strong> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        {/* Optional Customer Info */}
                        <div>{order.user?.name}</div>
                    </div>
                </div>

                {/* Items */}
                <table style={{ width: '100%', fontSize: '0.9rem', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                            <th style={{ textAlign: 'left', padding: '0.2rem 0' }}>Qty</th>
                            <th style={{ textAlign: 'left', padding: '0.2rem 0' }}>Item</th>
                            <th style={{ textAlign: 'right', padding: '0.2rem 0' }}>Amt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item: any, idx: number) => (
                            <tr key={idx} style={{ borderBottom: '1px dotted #ccc' }}>
                                <td style={{ padding: '0.4rem 0' }}>{item.quantity}</td>
                                <td style={{ padding: '0.4rem 0' }}>{item.name}</td>
                                <td style={{ padding: '0.4rem 0', textAlign: 'right' }}>
                                    {order.mode === 'SUBSCRIPTION' ? '-' : `₹${item.price * item.quantity}`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Items Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    <span>TOTAL</span>
                    <span>₹{order.totalAmount}</span>
                </div>

                {/* Payment Info */}
                <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.5rem', borderTop: '1px solid #ddd', paddingTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Mode:</span>
                        <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{order.mode}</span>
                    </div>
                    {order.paymentMethod && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Payment:</span>
                            <span>{order.paymentMethod}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Status:</span>
                        <span>{order.status}</span>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
                    <p>Thank you for visiting!</p>
                    <p>********************************</p>
                </div>

                {/* Actions */}
                <div className="no-print" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        onClick={() => window.print()}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            backgroundColor: '#1f2937',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                        }}
                    >
                        🖨️ Print Receipt
                    </button>
                    <button
                        onClick={() => router.back()}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            backgroundColor: 'white',
                            color: '#1f2937',
                            border: '1px solid #ccc',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
