'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubscriptionPage() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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

    const handleSelectPlan = async (planId: string) => {
        // Get user from local storage
        try {
            const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
            if (!storedUser) {
                alert("Please login first");
                router.push('/');
                return;
            }
            const user = JSON.parse(storedUser);

            // Mock Payment Processing
            const confirmed = window.confirm(`Confirm subscription to ${PLANS.find(p => p.id === planId)?.name}?`);
            if (!confirmed) return;

            // Call API
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

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem', fontFamily: 'sans-serif' }}>
            {/* Header */}
            <header style={{ marginBottom: '3rem', cursor: 'pointer' }} onClick={() => router.push('/')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#5C3A1A', fontWeight: 'bold' }}>
                    <span>← Back to Menu</span>
                </div>
            </header>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#5C3A1A', marginBottom: '1rem' }}>
                        Choose Your Plan
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Enjoy delicious meals every day without the hassle of payments.
                        Subscribe and save up to 30%.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    alignItems: 'start'
                }}>
                    {PLANS.map(plan => (
                        <div
                            key={plan.id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '1.5rem',
                                padding: '2rem',
                                boxShadow: plan.recommended ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                border: plan.recommended ? '2px solid #5C3A1A' : '1px solid #e5e7eb',
                                position: 'relative',
                                transform: plan.recommended ? 'scale(1.05)' : 'scale(1)',
                                transition: 'transform 0.2s',
                                zIndex: plan.recommended ? 10 : 1
                            }}
                        >
                            {plan.recommended && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: '#5C3A1A',
                                    color: 'white',
                                    padding: '0.25rem 1rem',
                                    borderRadius: '999px',
                                    fontSize: '0.875rem',
                                    fontWeight: 'bold'
                                }}>
                                    Most Popular
                                </div>
                            )}

                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>
                                {plan.name}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '2rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#5C3A1A' }}>₹{plan.price}</span>
                                <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>/ {plan.duration}</span>
                            </div>

                            <ul style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4b5563' }}>
                                        <svg style={{ width: '20px', height: '20px', color: '#16a34a', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelectPlan(plan.id)}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: plan.recommended ? '#5C3A1A' : 'white',
                                    color: plan.recommended ? 'white' : '#5C3A1A',
                                    border: `2px solid #5C3A1A`,
                                    borderRadius: '0.75rem',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    if (!plan.recommended) {
                                        e.currentTarget.style.backgroundColor = '#fdf8f6';
                                    }
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseOut={(e) => {
                                    if (!plan.recommended) {
                                        e.currentTarget.style.backgroundColor = 'white';
                                    }
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Choose {plan.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
