'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PaymentSelector, { PaymentDetails } from '@/components/payment/PaymentSelector';
import DesktopHeader from '@/components/layout/DesktopHeader';

// Plan definitions (matching subscription page)
const PLANS = [
    {
        id: 'light',
        name: 'Light Bite Pass',
        price: 2599,
        original: 3000,
        save: '15%',
        coupons: 30,
        validity: '30 Days',
        features: [
            '30 Coupons',
            'Valid for 30 Days (+ 5 Days Grace)',
            'Perfect for light eaters',
            'Full menu access'
        ]
    },
    {
        id: 'feast',
        name: 'Feast & Fuel',
        price: 4499,
        original: 6000,
        save: '25%',
        coupons: 60,
        validity: '30 Days',
        features: [
            '60 Coupons',
            'Valid for 30 Days (+ 5 Days Grace)',
            'Most popular choice',
            'Best value for money'
        ]
    },
    {
        id: 'wellness',
        name: 'Total Wellness',
        price: 5999,
        original: 9000,
        save: '33%',
        coupons: 90,
        validity: '30 Days',
        features: [
            '90 Coupons',
            'Valid for 30 Days (+ 5 Days Grace)',
            'Maximum savings',
            'Premium experience'
        ]
    },
    {
        id: 'ultimate',
        name: 'Ultimate Plan',
        price: 9999,
        original: 18000,
        save: '50%',
        coupons: 120,
        validity: '30 Days',
        features: [
            '120 Coupons',
            'Valid for 30 Days (+ 5 Days Grace)',
            'Unlimited benefits',
            'Priority support'
        ]
    },
    {
        id: 'addon',
        name: 'Hot Sips + SnacknMunch',
        price: 1299,
        original: 1999,
        save: '35%',
        coupons: 30,
        validity: '30 Days',
        features: [
            '30 Coupons',
            'Perfect for evening cravings',
            'Hot beverages & snacks',
            'Valid for 30 Days'
        ]
    },
    {
        id: 'trial',
        name: '1-Week Trial',
        price: 1299,
        original: 1299,
        save: '0%',
        coupons: 7,
        validity: '7 Days',
        features: [
            '7 Days Access',
            '+ 1 Day FREE Snacks',
            'Try before you commit',
            'Full menu access'
        ]
    }
];

// Force dynamic rendering because this page relies on SearchParams
// which breaks static generation if not wrapped in Suspense (or marked dynamic)
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planId = searchParams?.get('plan');

    const [user, setUser] = useState<any>(null);
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({ method: 'CASH' });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [email, setEmail] = useState('');

    const selectedPlan = PLANS.find(p => p.id === planId);

    useEffect(() => {
        const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
        if (!storedUser) {
            router.push('/?login=true');
            return;
        }
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setEmail(userData.email || '');
    }, [router]);

    const handlePayment = async () => {
        if (!selectedPlan) {
            alert('Invalid plan selected');
            return;
        }

        if (!agreedToTerms) {
            alert('Please agree to the terms and conditions');
            return;
        }

        // Validate payment details based on method
        if (paymentDetails.method === 'UPI' && !paymentDetails.upiId) {
            alert('Please enter your UPI ID');
            return;
        }

        if (paymentDetails.method === 'CARD') {
            if (!paymentDetails.cardNumber || !paymentDetails.cardExpiry || !paymentDetails.cardCVV || !paymentDetails.cardholderName) {
                alert('Please fill in all card details');
                return;
            }
        }

        if (paymentDetails.method === 'NET_BANKING' && !paymentDetails.bankName) {
            alert('Please select your bank');
            return;
        }

        try {
            setIsProcessing(true);

            // Call subscription API
            const res = await fetch('/api/user/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    planId: selectedPlan.id,
                    paymentMethod: paymentDetails.method,
                    paymentDetails: paymentDetails
                })
            });

            if (res.ok) {
                alert(`🎉 Subscription activated successfully!\n\nPlan: ${selectedPlan.name}\nAmount Paid: ₹${selectedPlan.price}\n\nWelcome to the club!`);
                router.push('/subscription');
            } else {
                const error = await res.json();
                alert(`Payment failed: ${error.error || 'Unknown error'}`);
            }
        } catch (e) {
            console.error('Payment Error', e);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!user || !selectedPlan) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#FFF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                    <p style={{ color: '#666' }}>Loading checkout...</p>
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

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#5C3A1A', marginBottom: '0.5rem' }}>
                    Complete Your Purchase
                </h1>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                    Review your order and complete payment
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Left: Order Summary */}
                    <div>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            border: '2px solid #5C3A1A'
                        }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>
                                📋 Order Summary
                            </h2>

                            {/* Plan Card */}
                            <div style={{
                                backgroundColor: '#fdf8f6',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#5C3A1A', marginBottom: '0.25rem' }}>
                                            {selectedPlan.name}
                                        </h3>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            {selectedPlan.validity}
                                        </p>
                                    </div>
                                    <span style={{
                                        backgroundColor: '#dcfce7',
                                        color: '#166534',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold'
                                    }}>
                                        Save {selectedPlan.save}
                                    </span>
                                </div>

                                {/* Features */}
                                <ul style={{ marginBottom: '1rem', paddingLeft: '1.25rem' }}>
                                    {selectedPlan.features.map((feature, idx) => (
                                        <li key={idx} style={{ marginBottom: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* Pricing */}
                                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: '#6b7280' }}>Original Price</span>
                                        <span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>₹{selectedPlan.original}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: '#6b7280' }}>Discount</span>
                                        <span style={{ color: '#16a34a', fontWeight: 600 }}>
                                            -₹{selectedPlan.original - selectedPlan.price}
                                        </span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        paddingTop: '0.75rem',
                                        borderTop: '2px solid #5C3A1A',
                                        marginTop: '0.75rem'
                                    }}>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>Total</span>
                                        <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#5C3A1A' }}>
                                            ₹{selectedPlan.price}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div style={{
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: '0.5rem',
                                padding: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>🔒</span>
                                <div>
                                    <p style={{ fontWeight: 600, color: '#166534', marginBottom: '0.125rem' }}>Secure Payment</p>
                                    <p style={{ fontSize: '0.75rem', color: '#15803d' }}>Your payment information is encrypted and secure</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment & User Details */}
                    <div>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}>
                            {/* User Details */}
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>
                                👤 Contact Information
                            </h2>
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={user.name || ''}
                                        disabled
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            backgroundColor: '#f9fafb',
                                            color: '#6b7280'
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={user.phone || ''}
                                        disabled
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            backgroundColor: '#f9fafb',
                                            color: '#6b7280'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
                                        Email (Optional)
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Payment Selector */}
                            <div style={{ marginBottom: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
                                <PaymentSelector
                                    amount={selectedPlan.price}
                                    onPaymentChange={setPaymentDetails}
                                    variant="full"
                                />
                            </div>

                            {/* Terms & Conditions */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        style={{ marginTop: '0.25rem', accentColor: '#5C3A1A' }}
                                    />
                                    <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                                        I agree to the <a href="/terms" style={{ color: '#5C3A1A', fontWeight: 600 }}>Terms & Conditions</a> and <a href="/privacy" style={{ color: '#5C3A1A', fontWeight: 600 }}>Privacy Policy</a>
                                    </span>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => router.push('/subscription')}
                                    disabled={isProcessing}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        border: '2px solid #5C3A1A',
                                        borderRadius: '0.75rem',
                                        backgroundColor: 'white',
                                        color: '#5C3A1A',
                                        fontWeight: 'bold',
                                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                                        opacity: isProcessing ? 0.5 : 1
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessing || !agreedToTerms}
                                    style={{
                                        flex: 2,
                                        padding: '1rem',
                                        border: 'none',
                                        borderRadius: '0.75rem',
                                        backgroundColor: '#5C3A1A',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1.125rem',
                                        cursor: (isProcessing || !agreedToTerms) ? 'not-allowed' : 'pointer',
                                        opacity: (isProcessing || !agreedToTerms) ? 0.5 : 1,
                                        boxShadow: '0 10px 15px -3px rgba(92, 58, 26, 0.3)'
                                    }}
                                >
                                    {isProcessing ? 'Processing...' : `Pay ₹${selectedPlan.price}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
