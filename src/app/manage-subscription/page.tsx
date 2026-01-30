'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DesktopHeader from '@/components/layout/DesktopHeader';
import { getPlanDisplayName } from '@/lib/planNames';

export default function ManageSubscriptionPage() {
    const router = useRouter();
    const [currentSub, setCurrentSub] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [showBillingHistory, setShowBillingHistory] = useState(false);
    const [billingHistory, setBillingHistory] = useState<any[]>([]);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const fetchSub = async () => {
            const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                try {
                    const res = await fetch(`/api/user/subscription?userId=${userData.id}`, { cache: 'no-store' });
                    if (res.ok) {
                        const data = await res.json();
                        setCurrentSub(data);
                    }
                } catch (e) {
                    console.error("Failed to fetch subscription", e);
                }
            }
            setLoading(false);
        };
        fetchSub();
    }, []);

    const daysRemaining = currentSub
        ? Math.ceil((new Date(currentSub.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#FFF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!currentSub) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#FFF8F0', fontFamily: 'sans-serif' }}>
                <DesktopHeader
                    user={user}
                    onLoginClick={() => router.push('/?login=true')}
                />
                <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingTop: '4rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                        No Active Subscription
                    </h1>
                    <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                        You don't have an active subscription to manage. Choose a plan to get started!
                    </p>
                    <button
                        onClick={() => router.push('/subscription')}
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: '#5C3A1A',
                            color: 'white',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '999px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            boxShadow: '0 10px 15px -3px rgba(92, 58, 26, 0.3)'
                        }}
                    >
                        View Plans
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FFF8F0', fontFamily: 'sans-serif' }}>
            <DesktopHeader
                user={user}
                onLoginClick={() => router.push('/?login=true')}
            />

            <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                {/* Page Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'transparent',
                            color: '#6b7280',
                            border: 'none',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}
                    >
                        ← Back
                    </button>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        📋 Manage Your Plan
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                        View details, renew, upgrade, or cancel your subscription
                    </p>
                </div>

                {/* Management Section */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb'
                }}>
                    {/* Current Plan Details */}
                    <div style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                            Current Plan Details
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.875rem' }}>
                            <div>
                                <span style={{ color: '#6b7280' }}>Plan: </span>
                                <span style={{ fontWeight: '600', color: '#1f2937' }}>
                                    {getPlanDisplayName(currentSub.planType || 'Plan')}
                                </span>
                            </div>
                            <div>
                                <span style={{ color: '#6b7280' }}>Started: </span>
                                <span style={{ fontWeight: '600', color: '#1f2937' }}>
                                    {new Date(currentSub.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <div>
                                <span style={{ color: '#6b7280' }}>Expires: </span>
                                <span style={{ fontWeight: '600', color: daysRemaining <= 0 ? '#ef4444' : daysRemaining <= 7 ? '#f59e0b' : '#10b981' }}>
                                    {new Date(currentSub.validUntil).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <div>
                                <span style={{ color: '#6b7280' }}>Coupons Used: </span>
                                <span style={{ fontWeight: '600', color: '#1f2937' }}>
                                    {currentSub.mealsConsumedThisMonth || 0} / {currentSub.totalCoupons || '∞'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                        {/* Extend Plan Button */}
                        <button
                            onClick={() => {
                                const planType = currentSub.planType?.toLowerCase();
                                router.push(`/checkout?plan=${planType}`);
                            }}
                            style={{
                                padding: '1rem',
                                backgroundColor: daysRemaining <= 7 ? '#10b981' : 'white',
                                color: daysRemaining <= 7 ? 'white' : '#10b981',
                                border: '2px solid #10b981',
                                borderRadius: '0.75rem',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                            onMouseEnter={(e) => {
                                if (daysRemaining > 7) {
                                    e.currentTarget.style.backgroundColor = '#10b981';
                                    e.currentTarget.style.color = 'white';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (daysRemaining > 7) {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.color = '#10b981';
                                }
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>🔄</span>
                            <span>Extend Plan</span>
                        </button>

                        {/* Upgrade Button */}
                        <button
                            onClick={() => router.push('/subscription#plans-section')}
                            style={{
                                padding: '1rem',
                                backgroundColor: 'white',
                                color: '#5C3A1A',
                                border: '2px solid #5C3A1A',
                                borderRadius: '0.75rem',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#5C3A1A';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.color = '#5C3A1A';
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>⬆️</span>
                            <span>Upgrade Plan</span>
                        </button>

                        {/* Billing History Button */}
                        <button
                            onClick={async () => {
                                if (!showBillingHistory && billingHistory.length === 0) {
                                    try {
                                        const res = await fetch(`/api/orders?userId=${user.id}&mode=SUBSCRIPTION`);
                                        if (res.ok) {
                                            const orders = await res.json();
                                            setBillingHistory(orders);
                                        }
                                    } catch (e) {
                                        console.error('Failed to fetch billing history', e);
                                    }
                                }
                                setShowBillingHistory(!showBillingHistory);
                            }}
                            style={{
                                padding: '1rem',
                                backgroundColor: 'white',
                                color: '#3b82f6',
                                border: '2px solid #3b82f6',
                                borderRadius: '0.75rem',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#3b82f6';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.color = '#3b82f6';
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>📄</span>
                            <span>{showBillingHistory ? 'Hide History' : 'View History'}</span>
                        </button>
                    </div>

                    {/* Billing History Table */}
                    {showBillingHistory && (
                        <div style={{
                            marginBottom: '1rem',
                            backgroundColor: '#f9fafb',
                            borderRadius: '0.75rem',
                            padding: '1rem',
                            border: '1px solid #e5e7eb'
                        }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                                Billing History
                            </h4>
                            {billingHistory.length > 0 ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <th style={{ padding: '0.5rem', textAlign: 'left', color: '#6b7280', fontWeight: '500' }}>Date</th>
                                                <th style={{ padding: '0.5rem', textAlign: 'left', color: '#6b7280', fontWeight: '500' }}>Plan</th>
                                                <th style={{ padding: '0.5rem', textAlign: 'left', color: '#6b7280', fontWeight: '500' }}>Amount</th>
                                                <th style={{ padding: '0.5rem', textAlign: 'left', color: '#6b7280', fontWeight: '500' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {billingHistory.map((order: any, idx: number) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                    <td style={{ padding: '0.5rem', color: '#1f2937' }}>
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                                    </td>
                                                    <td style={{ padding: '0.5rem', color: '#1f2937' }}>
                                                        {getPlanDisplayName(order.planType || 'Plan')}
                                                    </td>
                                                    <td style={{ padding: '0.5rem', color: '#1f2937', fontWeight: '600' }}>
                                                        ₹{order.totalPrice}
                                                    </td>
                                                    <td style={{ padding: '0.5rem' }}>
                                                        <span style={{
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '999px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            backgroundColor: order.status === 'COMPLETED' ? '#dcfce7' : '#fef3c7',
                                                            color: order.status === 'COMPLETED' ? '#166534' : '#854d0e'
                                                        }}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>
                                    No billing history found
                                </p>
                            )}
                        </div>
                    )}

                    {/* Cancel Subscription Button */}
                    <button
                        onClick={() => setShowCancelConfirm(true)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: 'white',
                            color: '#ef4444',
                            border: '2px solid #ef4444',
                            borderRadius: '0.75rem',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ef4444';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = '#ef4444';
                        }}
                    >
                        ❌ Cancel Subscription
                    </button>

                    {/* Cancel Confirmation Modal */}
                    {showCancelConfirm && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '1rem'
                        }}>
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '1rem',
                                padding: '2rem',
                                maxWidth: '500px',
                                width: '100%',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                            }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                                    Cancel Subscription?
                                </h3>
                                <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                                    Are you sure you want to cancel your {getPlanDisplayName(currentSub.planType || 'Plan')}?
                                    You'll lose access to your benefits at the end of the current billing period.
                                </p>
                                <div style={{
                                    backgroundColor: '#fef3c7',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    marginBottom: '1.5rem',
                                    border: '1px solid #fbbf24'
                                }}>
                                    <p style={{ fontSize: '0.875rem', color: '#78350f', margin: 0 }}>
                                        💡 <strong>Consider downgrading</strong> to a lower plan instead of cancelling completely!
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        onClick={() => setShowCancelConfirm(false)}
                                        disabled={cancelling}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            backgroundColor: '#5C3A1A',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            opacity: cancelling ? 0.5 : 1
                                        }}
                                    >
                                        Keep Plan
                                    </button>
                                    <button
                                        onClick={async () => {
                                            setCancelling(true);
                                            try {
                                                const res = await fetch('/api/subscription/cancel', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        userId: user.id,
                                                        subscriptionId: currentSub.id
                                                    })
                                                });
                                                if (res.ok) {
                                                    alert('Subscription cancelled. You can continue using your plan until ' + new Date(currentSub.validUntil).toLocaleDateString());
                                                    router.push('/subscription');
                                                } else {
                                                    alert('Failed to cancel subscription. Please try again.');
                                                }
                                            } catch (e) {
                                                alert('Failed to cancel subscription. Please try again.');
                                            }
                                            setCancelling(false);
                                            setShowCancelConfirm(false);
                                        }}
                                        disabled={cancelling}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            opacity: cancelling ? 0.5 : 1
                                        }}
                                    >
                                        {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
