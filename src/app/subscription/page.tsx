'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SubscriptionPage() {
    const router = useRouter();
    const [currentSub, setCurrentSub] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const PLANS = [
        {
            id: 'monthly',
            name: 'Monthly Mess Plan',
            price: 3000,
            duration: '30 Days',
            features: [
                'Daily Meal Limit: 4 Items',
                'Valid for 30 Days',
                'Breakfast, Lunch, Dinner',
                'Rollover not available'
            ],
            recommended: true
        },
        {
            id: 'student',
            name: 'Student Saver',
            price: 2500,
            duration: '30 Days',
            features: [
                'Daily Meal Limit: 3 Items',
                'Valid for 30 Days',
                'Perfect for light eaters',
                'Student ID Required'
            ],
            recommended: false
        },
        {
            id: 'weekly',
            name: 'Weekly Trial',
            price: 800,
            duration: '7 Days',
            features: [
                'Daily Meal Limit: 4 Items',
                'Valid for 7 Days',
                'Try before you commit',
                'Full Menu Access'
            ],
            recommended: false
        }
    ];

    useEffect(() => {
        const fetchSub = async () => {
            const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                try {
                    const res = await fetch(`/api/user/subscription?userId=${user.id}`, { cache: 'no-store' });
                    if (res.ok) {
                        const data = await res.json();
                        // Check if active
                        // Even if expired recently, we might want to show it?
                        // But requirement says "subscribed member... see their current plan".
                        // Usually implies active.
                        if (data.validUntil && new Date(data.validUntil) > new Date()) {
                            setCurrentSub(data);
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch subscription", e);
                }
            }
            setLoading(false);
        };
        fetchSub();
    }, []);

    const handleSelectPlan = async (planId: string) => {
        try {
            const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
            if (!storedUser) {
                // Redirect to home page where login modal can be triggered
                router.push('/?login=true');
                return;
            }
            const user = JSON.parse(storedUser);

            // If renewing, confirm differently?
            const planName = PLANS.find(p => p.id === planId)?.name || 'Basic Plan';
            const confirmed = window.confirm(
                currentSub
                    ? `You have an active plan. Do you want to renew/switch to ${planName}? This will EXTEND your validity if same plan, or replace it.`
                    : `Confirm subscription to ${planName}?`
            );
            if (!confirmed) return;

            const res = await fetch('/api/user/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, planId })
            });

            if (res.ok) {
                alert("Subscription activated successfully! Welcome to the club.");
                router.push('/');
            } else {
                alert("Failed to activate subscription.");
            }
        } catch (e) {
            console.error("Subscription Error", e);
            alert("Something went wrong");
        }
    };

    const daysRemaining = currentSub
        ? Math.ceil((new Date(currentSub.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;

    const showRenewalReminder = currentSub && daysRemaining <= 3;
    const isCritical = daysRemaining <= 1;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem', fontFamily: 'sans-serif' }}>
            {/* Header */}
            <header style={{ marginBottom: '3rem', cursor: 'pointer' }} onClick={() => router.push('/')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#5C3A1A', fontWeight: 'bold' }}>
                    <span>← Back to Menu</span>
                </div>
            </header>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Active Plan Section */}
                {currentSub && (
                    <div style={{
                        marginBottom: '4rem',
                        backgroundColor: '#ecfdf5',
                        border: '2px solid #10b981',
                        borderRadius: '1.5rem',
                        padding: '2rem',
                        textAlign: 'center',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute', top: '-1rem', left: '50%', transform: 'translateX(-50%)',
                            backgroundColor: '#10b981', color: 'white', padding: '0.25rem 1rem',
                            borderRadius: '999px', fontWeight: 'bold'
                        }}>
                            Active Member ✅
                        </div>

                        <h2 style={{ color: '#064e3b', fontSize: '2rem', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
                            {currentSub.planType === 'MONTHLY_MESS' ? 'Monthly Mess Plan' : currentSub.planType}
                        </h2>
                        <div style={{ fontSize: '1.2rem', color: '#065f46', marginBottom: '1.5rem' }}>
                            Valid until <b>{new Date(currentSub.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</b>
                        </div>

                        {/* Status Stats */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Meals Used</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                                    {currentSub.mealsConsumedThisMonth} / {currentSub.monthlyQuota}
                                </div>
                            </div>
                            <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Days Left</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: isCritical ? '#ef4444' : '#1f2937' }}>
                                    {daysRemaining}
                                </div>
                            </div>
                        </div>

                        {showRenewalReminder && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                backgroundColor: isCritical ? '#fef2f2' : '#fff7ed',
                                border: `1px solid ${isCritical ? '#ef4444' : '#f97316'}`,
                                borderRadius: '1rem',
                                color: isCritical ? '#b91c1c' : '#c2410c',
                                fontWeight: 'bold'
                            }}>
                                ⚠️ Your plan expires in {daysRemaining} days. Renew now to continue enjoying your meals!
                            </div>
                        )}
                    </div>
                )}


                <div style={{ textAlign: 'center', marginBottom: currentSub ? '3rem' : '4rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#5C3A1A', marginBottom: '1rem' }}>
                        {currentSub ? 'Renew or Upgrade Plan' : 'Choose Your Plan'}
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Enjoy delicious meals every day without the hassle of payments.
                    </p>
                </div>

                {/* ULTIMATE PLAN (HERO) */}
                <div style={{
                    marginBottom: '4rem',
                    background: 'linear-gradient(135deg, #5C3A1A 0%, #3d2611 100%)',
                    borderRadius: '2rem',
                    padding: '3rem',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    boxShadow: '0 20px 25px -5px rgba(92, 58, 26, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        fontWeight: 'bold',
                        transform: 'rotate(10deg)'
                    }}>
                        Save 50%
                    </div>

                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        ULTIMATE PLAN
                    </h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem' }}>
                        Unlimited Meals + Sips + Snacks
                    </p>

                    <div style={{ marginBottom: '2rem' }}>
                        <span style={{ fontSize: '4rem', fontWeight: 800 }}>₹9,999</span>
                        <span style={{ fontSize: '1.5rem', opacity: 0.8 }}>/month</span>
                        <div style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '1.2rem', marginTop: '-0.5rem' }}>
                            ₹18,000
                        </div>
                    </div>

                    <button
                        onClick={() => handleSelectPlan('ultimate')}
                        style={{
                            padding: '1rem 4rem',
                            backgroundColor: 'white',
                            color: '#5C3A1A',
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '999px',
                            cursor: 'pointer',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                            transition: 'transform 0.1s'
                        }}
                    >
                        Get Ultimate Access
                    </button>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>*Validity 30 Days + 5 Days Grace</p>
                </div>

                {/* MEAL PLANS GRID */}
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#374151', marginBottom: '2rem', textAlign: 'center' }}>
                    📜 MEAL PLANS (30 Days)
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    marginBottom: '4rem'
                }}>
                    {[
                        { id: 'light', name: 'Light Bite Pass', price: 2599, original: 3000, save: '15%', coupons: 30 },
                        { id: 'feast', name: 'Feast & Fuel', price: 4499, original: 6000, save: '25%', coupons: 60, recommended: true },
                        { id: 'wellness', name: 'Total Wellness', price: 5999, original: 9000, save: '33%', coupons: 90 }
                    ].map(plan => (
                        <div key={plan.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            boxShadow: plan.recommended ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            border: plan.recommended ? '2px solid #5C3A1A' : '1px solid #e5e7eb',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {plan.recommended && (
                                <div style={{
                                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                                    backgroundColor: '#5C3A1A', color: 'white', padding: '0.25rem 1rem',
                                    borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold'
                                }}>
                                    Most Popular
                                </div>
                            )}
                            <div style={{ marginBottom: '1rem' }}>
                                <span style={{
                                    backgroundColor: '#dcfce7', color: '#166534', fontWeight: 'bold',
                                    fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '999px'
                                }}>
                                    Save {plan.save}
                                </span>
                            </div>
                            <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>
                                {plan.name}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#5C3A1A' }}>₹{plan.price}</span>
                                <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginLeft: '0.5rem' }}>₹{plan.original}</span>
                            </div>
                            <ul style={{ marginBottom: '2rem', flex: 1, color: '#4b5563' }}>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✅ <b>{plan.coupons}</b> Coupons
                                </li>
                                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✅ Valid for 30 Days (+ 5 Days Grace)
                                </li>
                            </ul>
                            <button
                                onClick={() => handleSelectPlan(plan.id)}
                                style={{
                                    width: '100%', padding: '1rem',
                                    backgroundColor: plan.recommended ? '#5C3A1A' : 'white',
                                    color: plan.recommended ? 'white' : '#5C3A1A',
                                    border: '2px solid #5C3A1A', borderRadius: '0.75rem',
                                    fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                Choose Plan
                            </button>
                        </div>
                    ))}
                </div>

                {/* ADD-ONS & TRIALS GRID (Keep existing content) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Add-On */}
                    <div style={{
                        backgroundColor: '#fffbeb', borderRadius: '1.5rem', padding: '2rem',
                        border: '2px dashed #f59e0b', position: 'relative'
                    }}>
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '2rem' }}>☕</div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706', marginBottom: '0.5rem' }}>
                            ADD-ON BUNDLE
                        </h4>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            Hot Sips + Snacks
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706' }}>₹1,299</span>
                            <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginLeft: '0.5rem' }}>₹1,999</span>
                        </div>
                        <p style={{ color: '#78350f', marginBottom: '1.5rem' }}>
                            30 Coupons. Save 35%. Perfect for evening cravings.
                        </p>
                        <button
                            onClick={() => handleSelectPlan('addon')}
                            style={{
                                width: '100%', padding: '0.75rem', backgroundColor: '#f59e0b',
                                color: 'white', border: 'none', borderRadius: '0.75rem',
                                fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            Add Bundle
                        </button>
                    </div>

                    {/* Trial */}
                    <div style={{
                        backgroundColor: '#eff6ff', borderRadius: '1.5rem', padding: '2rem',
                        border: '2px solid #3b82f6', position: 'relative'
                    }}>
                        <div style={{ position: 'absolute', top: '-12px', left: '1rem', backgroundColor: '#3b82f6', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            🎁 FIRST-TIMER OFFER
                        </div>
                        <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
                            1-Week Trial
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#1e3a8a' }}>₹1,299</span>
                        </div>
                        <ul style={{ marginBottom: '1.5rem', color: '#1e40af' }}>
                            <li>✨ 7 Days Access</li>
                            <li>✨ <b>+ 1 Day FREE Snacks</b></li>
                        </ul>
                        <button
                            onClick={() => handleSelectPlan('trial')}
                            style={{
                                width: '100%', padding: '0.75rem', backgroundColor: '#3b82f6',
                                color: 'white', border: 'none', borderRadius: '0.75rem',
                                fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            Start Trial
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
