'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DesktopHeader from '@/components/layout/DesktopHeader';
import Image from 'next/image';
import { getPlanDisplayName, getSubscriptionStatus } from '@/lib/planNames';

export default function SubscriptionPage() {
    const router = useRouter();
    const [currentSub, setCurrentSub] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isExpired, setIsExpired] = useState(false);

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
                        // Check if expired
                        if (data.validUntil && new Date(data.validUntil) <= new Date()) {
                            setIsExpired(true);
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

    const daysRemaining = currentSub
        ? Math.ceil((new Date(currentSub.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FFF8F0', fontFamily: 'sans-serif' }}>
            <DesktopHeader
                user={user}
                onLoginClick={() => router.push('/?login=true')}
            />

            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

                {/* Active/Expired Member Status Banner */}
                {currentSub && (() => {
                    const planName = getPlanDisplayName(currentSub.planType || 'Plan');
                    const status = getSubscriptionStatus(
                        daysRemaining,
                        planName,
                        new Date(currentSub.validUntil),
                        currentSub.mealsConsumedThisMonth
                    );

                    return (
                        <div style={{
                            marginBottom: '2rem',
                            backgroundColor: 'white',
                            borderRadius: '1rem',
                            padding: '1.25rem 1.5rem',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: `2px solid ${status.borderColor}`
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: status.bgColor,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem'
                                }}>
                                    {status.icon}
                                </div>
                                <div>
                                    <h3 style={{
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        color: '#1f2937',
                                        margin: 0,
                                        marginBottom: '0.25rem'
                                    }}>
                                        {status.title}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: '#6b7280',
                                        margin: 0
                                    }}>
                                        {status.message}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push('/manage-subscription')}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    backgroundColor: 'white',
                                    color: '#5C3A1A',
                                    border: '2px solid #5C3A1A',
                                    borderRadius: '0.5rem',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap'
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
                                Manage Membership →
                            </button>
                        </div>
                    );
                })()}


                {!currentSub && (
                    <div style={{
                        marginBottom: '4rem',
                        backgroundColor: 'white',
                        borderRadius: '2rem',
                        padding: '2.5rem',
                        textAlign: 'center',
                        border: '2px dashed #d1d5db',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍽️</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                            No Active Plan
                        </h3>
                        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                            Choose a subscription plan below to start enjoying hassle-free meals
                        </p>
                        <button
                            onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
                            style={{
                                padding: '0.75rem 2rem',
                                backgroundColor: '#5C3A1A',
                                color: 'white',
                                fontWeight: 'bold',
                                border: 'none',
                                borderRadius: '999px',
                                cursor: 'pointer',
                                boxShadow: '0 10px 15px -3px rgba(92, 58, 26, 0.3)'
                            }}
                        >
                            View Plans
                        </button>
                    </div>
                )}

                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#5C3A1A', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        {currentSub ? 'Renew or Upgrade' : 'Choose Your Plan'}
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                        Enjoy delicious meals every day without the hassle of payments
                    </p>
                </div>

                {/* Why Subscribe Section */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '2rem',
                    padding: '3rem',
                    marginBottom: '4rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center'
                }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                        Why Subscribe?
                    </h2>
                    <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto 2rem' }}>
                        Enjoy delicious meals every day without the hassle of payments
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
                            <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                                Save Money
                            </h4>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                Up to 50% off on regular prices
                            </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
                            <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                                Hassle-Free
                            </h4>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                No daily payment worries
                            </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                            <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                                Priority Access
                            </h4>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                Skip queues and order faster
                            </p>
                        </div>
                    </div>
                </div>

                {/* Ultimate Plan (Hero) */}
                <div id="plans-section" style={{
                    marginBottom: '4rem',
                    background: 'linear-gradient(135deg, #5C3A1A 0%, #3d2611 100%)',
                    borderRadius: '2rem',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(92, 58, 26, 0.4)',
                    position: 'relative'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
                        {/* Left: Image */}
                        <div style={{ position: 'relative', height: '400px' }}>
                            <Image
                                src="/.gemini/antigravity/brain/a5c1231c-fb3e-4019-801b-79559fd080d4/subscription_meal_image_1769669624347.png"
                                alt="Ultimate Plan Meal"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>

                        {/* Right: Content */}
                        <div style={{ padding: '3rem', color: 'white' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                                ULTIMATE PLAN
                            </h2>
                            <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2rem' }}>
                                Maximum Value · Maximum Savings
                            </p>

                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '4rem', fontWeight: 'bold' }}>₹9,999</span>
                                    <span style={{ fontSize: '1.25rem', opacity: 0.8 }}>/month</span>
                                </div>
                                <div style={{ textDecoration: 'line-through', opacity: 0.6, fontSize: '1.125rem' }}>
                                    ₹18,000
                                </div>
                            </div>

                            <ul style={{ marginBottom: '2rem', opacity: 0.95, fontSize: '1rem' }}>
                                <li style={{ marginBottom: '0.5rem' }}>✅ 120 Coupons</li>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Valid for 30 Days (+ 5 Days Grace)</li>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Unlimited Menu Access</li>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Priority Support</li>
                            </ul>

                            <button
                                onClick={() => router.push('/checkout?plan=ultimate')}
                                style={{
                                    padding: '1rem 3rem',
                                    backgroundColor: 'white',
                                    color: '#5C3A1A',
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    borderRadius: '999px',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Get Ultimate Access
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Plans */}
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem', textAlign: 'center' }}>
                    📋 Meal Plans
                </h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    marginBottom: '4rem'
                }}>
                    {[
                        { id: 'light', name: 'Light Bite Pass', price: 2599, original: 3000, save: '15%', coupons: 30, color: '#10b981' },
                        { id: 'feast', name: 'Feast & Fuel', price: 4499, original: 6000, save: '25%', coupons: 60, popular: true, color: '#5C3A1A' },
                        { id: 'wellness', name: 'Total Wellness', price: 5999, original: 9000, save: '33%', coupons: 90, color: '#8b5cf6' }
                    ].map(plan => (
                        <div key={plan.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            boxShadow: plan.popular ? '0 20px 25px -5px rgba(0, 0, 0, 0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            border: plan.popular ? `3px solid ${plan.color}` : '1px solid #e5e7eb',
                            position: 'relative',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = plan.popular ? '0 20px 25px -5px rgba(0, 0, 0, 0.15)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            {plan.popular && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: plan.color,
                                    color: 'white',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}>
                                    🔥 MOST POPULAR
                                </div>
                            )}

                            <div style={{ marginBottom: '1.5rem', marginTop: plan.popular ? '0.5rem' : '0' }}>
                                <h4 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                                    {plan.name}
                                </h4>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '3rem', fontWeight: 'bold', color: plan.color }}>
                                        ₹{plan.price}
                                    </span>
                                    <span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>
                                        ₹{plan.original}
                                    </span>
                                </div>
                                <span style={{
                                    backgroundColor: '#dcfce7',
                                    color: '#166534',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}>
                                    Save {plan.save}
                                </span>
                            </div>

                            <ul style={{ marginBottom: '2rem', color: '#4b5563' }}>
                                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✅ <b>{plan.coupons}</b> Coupons
                                </li>
                                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✅ Valid for 30 Days (+ 5 Days Grace)
                                </li>
                                <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✅ Full Menu Access
                                </li>
                            </ul>

                            <button
                                onClick={() => router.push(`/checkout?plan=${plan.id}`)}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: plan.popular ? plan.color : 'white',
                                    color: plan.popular ? 'white' : plan.color,
                                    border: `2px solid ${plan.color}`,
                                    borderRadius: '0.75rem',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (!plan.popular) {
                                        e.currentTarget.style.backgroundColor = plan.color;
                                        e.currentTarget.style.color = 'white';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!plan.popular) {
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.color = plan.color;
                                    }
                                }}
                            >
                                Choose Plan →
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add-On & Trial Plans */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    {/* Add-On Bundle */}
                    <div style={{
                        backgroundColor: '#fffbeb',
                        borderRadius: '1.5rem',
                        padding: '2rem',
                        border: '2px solid #f59e0b',
                        position: 'relative',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            fontSize: '2rem'
                        }}>
                            ☕
                        </div>
                        <div style={{
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            display: 'inline-block',
                            marginBottom: '1rem'
                        }}>
                            ➕ ADD-ON
                        </div>
                        <h4 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#d97706',
                            marginBottom: '0.5rem'
                        }}>
                            Hot Sips + SnacknMunch
                        </h4>
                        <div style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#d97706' }}>
                                ₹1,299
                            </span>
                            <span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>
                                ₹1,999
                            </span>
                        </div>
                        <span style={{
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            marginBottom: '1rem',
                            display: 'inline-block'
                        }}>
                            Save 35%
                        </span>
                        <p style={{ color: '#78350f', marginBottom: '1.5rem' }}>
                            30 Coupons · Perfect for evening cravings
                        </p>
                        <button
                            onClick={() => router.push('/checkout?plan=addon')}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
                        >
                            Add Bundle →
                        </button>
                    </div>

                    {/* First-Timer Trial */}
                    <div style={{
                        backgroundColor: '#eff6ff',
                        borderRadius: '1.5rem',
                        padding: '2rem',
                        border: '2px solid #3b82f6',
                        position: 'relative',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-12px',
                            left: '1rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                        }}>
                            🎁 FIRST-TIMER OFFER
                        </div>
                        <h4 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#1e3a8a',
                            marginBottom: '0.5rem',
                            marginTop: '0.5rem'
                        }}>
                            1-Week Trial
                        </h4>
                        <div style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '0.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e3a8a' }}>
                                ₹1,299
                            </span>
                        </div>
                        <ul style={{ marginBottom: '1.5rem', color: '#1e40af', fontSize: '0.95rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>✨ 7 Days Access</li>
                            <li style={{ marginBottom: '0.5rem' }}>✨ <b>+ 1 Day FREE Snacks</b></li>
                            <li style={{ marginBottom: '0.5rem' }}>✨ Try before you commit</li>
                        </ul>
                        <button
                            onClick={() => router.push('/checkout?plan=trial')}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                        >
                            Start Trial →
                        </button>
                    </div>
                </div>

                {/* Statistics Footer Hidden (no data yet) */}
            </div>
        </div>
    );
}
