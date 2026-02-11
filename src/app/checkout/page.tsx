'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PaymentSelector, { PaymentDetails } from '@/components/payment/PaymentSelector';
import CheckoutHeader from '@/components/layout/CheckoutHeader';
import { useCart } from '@/context/CartContext';
import { ChevronRight, FileText, Clock, Wallet, ArrowRight, HelpCircle, Receipt, Banknote, CreditCard, Calendar } from 'lucide-react';

// --- Plan Definitions (Keep Existing) ---
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

export const dynamic = 'force-dynamic';

// --- Helper Functions ---
const FOOD_IMAGES: Record<string, string> = {
    'dosa': 'https://images.unsplash.com/photo-1668236543090-d2f896b0101d?q=80&w=800&auto=format&fit=crop',
    'idli': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
    'coffee': 'https://images.unsplash.com/photo-1596933580749-0d3381a8f602?q=80&w=800&auto=format&fit=crop',
    'tea': 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=800&auto=format&fit=crop',
    'rice': 'https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=800&auto=format&fit=crop',
    'meals': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800&auto=format&fit=crop',
    'vada': 'https://images.unsplash.com/photo-1630409351241-e90e7f5e4785?q=80&w=800&auto=format&fit=crop',
    'pongal': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800&auto=format&fit=crop',
    'biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
    'sweet': 'https://images.unsplash.com/photo-1569584627042-49d8c3639d67?q=80&w=800&auto=format&fit=crop',
    'default': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop'
};

function getFoodImage(name: string): string {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('dosa') || lowerName.includes('roast')) return FOOD_IMAGES.dosa;
    if (lowerName.includes('idli')) return FOOD_IMAGES.idli;
    if (lowerName.includes('coffee')) return FOOD_IMAGES.coffee;
    if (lowerName.includes('tea') || lowerName.includes('chai')) return FOOD_IMAGES.tea;
    if (lowerName.includes('rice') || lowerName.includes('bath') || lowerName.includes('pulao')) return FOOD_IMAGES.rice;
    if (lowerName.includes('thali') || lowerName.includes('meal')) return FOOD_IMAGES.meals;
    if (lowerName.includes('vada') || lowerName.includes('vadai')) return FOOD_IMAGES.vada;
    if (lowerName.includes('pongal')) return FOOD_IMAGES.pongal;
    if (lowerName.includes('biryani')) return FOOD_IMAGES.biryani;
    if (lowerName.includes('mysore pak') || lowerName.includes('halwa')) return FOOD_IMAGES.sweet;
    return FOOD_IMAGES.default;
}


// --- Subscription Checkout Component (Renamed) ---
function SubscriptionCheckoutContent({ user, planId }: { user: any, planId: string }) {
    const router = useRouter();
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({ method: 'CASH' });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [email, setEmail] = useState(user.email || '');

    const selectedPlan = PLANS.find(p => p.id === planId);

    if (!selectedPlan) {
        return <div className="p-8 text-center text-red-600">Invalid Plan Selected</div>;
    }

    const handlePayment = async () => {
        if (!agreedToTerms) {
            alert('Please agree to the terms and conditions');
            return;
        }
        // ... (Keep existing validation logic) ...
        if (paymentDetails.method === 'UPI' && !paymentDetails.upiId) {
            alert('Please enter your UPI ID');
            return;
        }
        if (paymentDetails.method === 'CARD' && (!paymentDetails.cardNumber || !paymentDetails.cardExpiry || !paymentDetails.cardCVV || !paymentDetails.cardholderName)) {
            alert('Please fill in all card details');
            return;
        }
        if (paymentDetails.method === 'NET_BANKING' && !paymentDetails.bankName) {
            alert('Please select your bank');
            return;
        }


        try {
            setIsProcessing(true);
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

    return (
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
                    <div style={{ backgroundColor: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '2px solid #5C3A1A' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>
                            📋 Order Summary
                        </h2>
                        {/* Plan Card */}
                        <div style={{ backgroundColor: '#fdf8f6', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#5C3A1A', marginBottom: '0.25rem' }}>{selectedPlan.name}</h3>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{selectedPlan.validity}</p>
                                </div>
                                <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>Save {selectedPlan.save}</span>
                            </div>
                            <ul style={{ marginBottom: '1rem', paddingLeft: '1.25rem' }}>
                                {selectedPlan.features.map((feature, idx) => (
                                    <li key={idx} style={{ marginBottom: '0.5rem', color: '#4b5563', fontSize: '0.875rem' }}>{feature}</li>
                                ))}
                            </ul>
                            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#6b7280' }}>Original Price</span>
                                    <span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>₹{selectedPlan.original}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#6b7280' }}>Discount</span>
                                    <span style={{ color: '#16a34a', fontWeight: 600 }}>-₹{selectedPlan.original - selectedPlan.price}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '2px solid #5C3A1A', marginTop: '0.75rem' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>Total</span>
                                    <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#5C3A1A' }}>₹{selectedPlan.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Payment & User Details */}
                <div>
                    <div style={{ backgroundColor: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1f2937' }}>👤 Contact Information</h2>
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>Name</label>
                                <input type="text" value={user.name || ''} disabled style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: '#f9fafb', color: '#6b7280' }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>Phone</label>
                                <input type="text" value={user.phone || ''} disabled style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: '#f9fafb', color: '#6b7280' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>Email (Optional)</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
                            <PaymentSelector amount={selectedPlan.price} onPaymentChange={setPaymentDetails} variant="full" />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} style={{ marginTop: '0.25rem', accentColor: '#5C3A1A' }} />
                                <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>I agree to the <a href="/terms" style={{ color: '#5C3A1A', fontWeight: 600 }}>Terms & Conditions</a> and <a href="/privacy" style={{ color: '#5C3A1A', fontWeight: 600 }}>Privacy Policy</a></span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => router.push('/subscription')} disabled={isProcessing} style={{ flex: 1, padding: '1rem', border: '2px solid #5C3A1A', borderRadius: '0.75rem', backgroundColor: 'white', color: '#5C3A1A', fontWeight: 'bold', cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.5 : 1 }}>Cancel</button>
                            <button onClick={handlePayment} disabled={isProcessing || !agreedToTerms} style={{ flex: 2, padding: '1rem', border: 'none', borderRadius: '0.75rem', backgroundColor: '#5C3A1A', color: 'white', fontWeight: 'bold', fontSize: '1.125rem', cursor: (isProcessing || !agreedToTerms) ? 'not-allowed' : 'pointer', opacity: (isProcessing || !agreedToTerms) ? 0.5 : 1, boxShadow: '0 10px 15px -3px rgba(92, 58, 26, 0.3)' }}>{isProcessing ? 'Processing...' : `Pay ₹${selectedPlan.price}`}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Food Checkout Component (New Design) ---
// --- FoodCheckoutContent with Full Logic ---
function FoodCheckoutContent({ user }: { user: any }) {
    const router = useRouter();
    const { items, subscriptionItems, normalItems, normalTotalAmount, clearCart } = useCart();

    // Scheduling Logic (Ported from CartDrawer)
    const generateAvailableTimeSlots = () => {
        const now = new Date();
        const slots: { value: string; label: string }[] = [];

        // Start from next 30-minute interval
        let current = new Date(now);
        const currentMinutes = current.getMinutes();
        if (currentMinutes < 30) {
            current.setMinutes(30);
        } else {
            current.setHours(current.getHours() + 1);
            current.setMinutes(0);
        }
        current.setSeconds(0);
        current.setMilliseconds(0);

        // Generate slots for next 3 hours (6 slots of 30 min each)
        for (let i = 0; i < 6; i++) {
            const hours = current.getHours();
            const minutes = current.getMinutes();
            const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            const label = current.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            slots.push({ value: timeStr, label });
            current.setMinutes(current.getMinutes() + 30);
        }
        return slots;
    };

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const validateTime = (time: string) => {
        if (!time) return true;
        const now = new Date();
        const [hours, minutes] = time.split(':').map(Number);
        const selectedTime = new Date();
        selectedTime.setHours(hours, minutes, 0, 0);
        return selectedTime > now;
    };

    // State
    const [pickupType, setPickupType] = useState<'ASAP' | 'SCHEDULE'>('ASAP');
    const [scheduleSlot, setScheduleSlot] = useState('');
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({ method: 'UPI' }); // Default will be updated by PaymentSelector on mount

    const [specialInstructions, setSpecialInstructions] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        setAvailableSlots(generateAvailableTimeSlots());
    }, []);

    const deliveryFee = normalTotalAmount > 0 ? normalTotalAmount * 0.05 : 0;
    const totalAmount = normalTotalAmount + deliveryFee;

    const handlePlaceOrder = async () => {
        try {
            if (isProcessing) return;

            if (pickupType === 'SCHEDULE') {
                if (!scheduleSlot) {
                    alert('Please select a time slot.');
                    return;
                }
                if (!validateTime(scheduleSlot)) {
                    alert('Please select a future time.');
                    return;
                }
            }

            // Validation for Payment Details (Only if there are normal items to pay for)
            const hasNormal = normalItems.length > 0;
            if (hasNormal) {
                if (paymentDetails.method === 'UPI' && !paymentDetails.upiId) {
                    alert('Please enter your UPI ID');
                    return;
                }
                if (paymentDetails.method === 'CARD') {
                    if (!paymentDetails.cardNumber || !paymentDetails.cardExpiry || !paymentDetails.cardCVV) {
                        alert('Please fill in all card details');
                        return;
                    }
                }
                if (paymentDetails.method === 'NET_BANKING' && !paymentDetails.bankName) {
                    alert('Please select your bank');
                    return;
                }
                // No validation needed for CASH
            }

            setIsProcessing(true);

            // Function to save offline if needed (simplified from CartDrawer)
            const saveOfflineOrder = (payload: any, mode: 'SUBSCRIPTION' | 'NORMAL') => {
                const offlineId = `OFFLINE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                const pendingOrder = { payload, mode, tempId: offlineId, createdAt: Date.now(), status: 'PENDING_SYNC' };
                const existing = JSON.parse(localStorage.getItem('pending_orders') || '[]');
                existing.push(pendingOrder);
                localStorage.setItem('pending_orders', JSON.stringify(existing));
                return { orderId: offlineId };
            };

            const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

            const processOrder = async (payload: any, mode: 'SUBSCRIPTION' | 'NORMAL') => {
                if (isOffline) return saveOfflineOrder(payload, mode);
                try {
                    const response = await fetch('/api/orders/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (!response.ok) {
                        const text = await response.text();
                        let data;
                        try { data = JSON.parse(text); } catch (e) { throw new Error('Server error'); }
                        throw new Error(data.error || 'Request failed');
                    }
                    return await response.json();
                } catch (e: any) {
                    if (e.message === 'Failed to fetch' || e.message.includes('NetworkError')) {
                        return saveOfflineOrder(payload, mode);
                    }
                    throw e;
                }
            };

            // 1. Process Subscription Items
            if (subscriptionItems.length > 0) {
                const subPayload = {
                    userId: user.id,
                    items: subscriptionItems.map(i => ({ menuItemId: i.id, qty: i.qty })),
                    mode: 'SUBSCRIPTION',
                    note: specialInstructions,
                    timeSlot: pickupType === 'SCHEDULE' ? scheduleSlot : undefined
                };
                await processOrder(subPayload, 'SUBSCRIPTION');
            }

            // 2. Process Normal Items
            if (normalItems.length > 0) {
                const normalPayload = {
                    userId: user.id,
                    items: normalItems.map(i => ({ menuItemId: i.id, qty: i.qty })),
                    mode: 'NORMAL',
                    paymentMethod: paymentDetails.method, // Uses the state from PaymentSelector
                    upiId: paymentDetails.upiId,
                    paymentDetails: paymentDetails,
                    note: specialInstructions,
                    timeSlot: pickupType === 'SCHEDULE' ? scheduleSlot : undefined
                };
                await processOrder(normalPayload, 'NORMAL');
            }

            // Success
            setIsProcessing(false);
            alert('Order Placed Successfully!');
            clearCart();
            router.push('/orders?newOrder=true');

        } catch (err: any) {
            setIsProcessing(false);
            alert('Error: ' + err.message);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#f8fbf7] flex flex-col items-center justify-center p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#0e1b12] mb-4">Your Cart is Empty</h2>
                    <p className="text-[#14b84b] mb-8">Add some delicious items to get started!</p>
                    <button onClick={() => router.push('/')} className="bg-[#14b84b] text-white px-8 py-3 rounded-full font-bold hover:bg-[#119e41] transition-colors">
                        Browse Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f8fbf7] font-sans text-[#0e1b12] min-h-screen">
            <main className="max-w-7xl mx-auto w-full px-4 md:px-10 py-4">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-4">
                    <button
                        onClick={() => {
                            sessionStorage.removeItem('cafe_has_explored');
                            router.push('/');
                        }}
                        className="text-[#166534] text-sm font-medium hover:underline"
                    >
                        Home
                    </button>
                    <ChevronRight className="w-4 h-4 text-[#166534]/40" />
                    <button
                        onClick={() => router.push('/?menu=true')}
                        className="text-[#166534] text-sm font-medium hover:underline"
                    >
                        Menu
                    </button>
                    <ChevronRight className="w-4 h-4 text-[#166534]/40" />
                    <span className="text-[#0e1b12] text-2xl font-bold">Checkout</span>
                </div>

                <h1 className="text-[#0e1b12] text-3xl font-black leading-tight tracking-tight font-serif mb-1">Review & Place Order</h1>
                <p className="text-[#166534] font-medium mb-6 text-sm">Finalize your South Indian feast from our kitchen to yours.</p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Left Column */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        {/* Order Summary */}
                        <div className="bg-white p-4 rounded-xl border border-[#e7f3eb] shadow-sm">
                            <h2 className="text-lg font-bold font-serif mb-4 flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-[#166534]" />
                                Order Summary
                            </h2>

                            <div className="space-y-6">
                                {items.map((item) => {
                                    const isSub = item.type === 'SUBSCRIPTION';
                                    return (
                                        <div key={item.id} className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-16 h-16"
                                                    style={{ backgroundImage: `url("${item.imageUrl || getFoodImage(item.name)}")` }}
                                                ></div>
                                                <div className="flex flex-col">
                                                    <p className="text-[#0e1b12] text-base font-bold">{item.name}</p>
                                                    <p className="text-[#166534] text-sm">
                                                        {item.qty} x {isSub ? '1 Credit' : `₹${item.price}`}
                                                        {isSub && <span className="ml-2 bg-[#dcfce7] text-[#166534] text-[10px] px-2 py-0.5 rounded-full font-bold">SUBSCRIPTION</span>}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-[#0e1b12] font-bold">{isSub ? '₹0' : `₹${item.price * item.qty}`}</p>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-10 pt-8 border-t border-dashed border-[#e7f3eb]">
                                <label className="block text-sm font-bold text-[#0e1b12] mb-3">Special Instructions</label>
                                <textarea
                                    className="w-full bg-[#f8fbf7] border border-[#e7f3eb] rounded-lg p-4 text-sm focus:ring-[#166534] focus:border-[#166534] outline-none transition-all"
                                    placeholder="Add a note (e.g., extra spicy, no onion...)"
                                    rows={3}
                                    value={specialInstructions}
                                    onChange={(e) => setSpecialInstructions(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="mt-8 bg-[#e7f3eb]/30 rounded-xl p-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#0e1b12]/60">Subtotal</span>
                                    <span className="text-[#0e1b12] font-medium">₹{normalTotalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#0e1b12]/60">Delivery & Packaging (5%)</span>
                                    <span className="text-[#0e1b12] font-medium">₹{deliveryFee.toFixed(2)}</span>
                                </div>
                                {subscriptionItems.length > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#0e1b12]/60">Subscription Credits</span>
                                        <span className="text-[#166534] font-medium">-{subscriptionItems.reduce((a, b) => a + b.qty, 0)} Credits</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold border-t border-white pt-3 mt-3">
                                    <span className="text-[#0e1b12]">Total Amount</span>
                                    <span className="text-[#166534]">₹{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-5 flex flex-col gap-4">

                        {/* Pickup Time */}
                        <div className="bg-white p-4 rounded-xl border border-[#e7f3eb] shadow-sm">
                            <h2 className="text-lg font-bold font-serif mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[#166534]" />
                                Pickup Time
                            </h2>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <label className="cursor-pointer group relative">
                                    <input
                                        type="radio"
                                        name="time"
                                        className="peer hidden"
                                        checked={pickupType === 'ASAP'}
                                        onChange={() => setPickupType('ASAP')}
                                    />
                                    <div className="p-3 border-2 border-[#e7f3eb] rounded-xl peer-checked:border-[#166534] peer-checked:bg-[#166534]/5 transition-all text-center h-full">
                                        <p className="font-bold text-[#0e1b12] text-sm">ASAP</p>
                                        <p className="text-[10px] text-[#166534]/80">~15 mins</p>
                                    </div>
                                </label>
                                <label className="cursor-pointer group relative">
                                    <input
                                        type="radio"
                                        name="time"
                                        className="peer hidden"
                                        checked={pickupType === 'SCHEDULE'}
                                        onChange={() => setPickupType('SCHEDULE')}
                                    />
                                    <div className="p-3 border-2 border-[#e7f3eb] rounded-xl peer-checked:border-[#166534] peer-checked:bg-[#166534]/5 transition-all text-center h-full">
                                        <p className="font-bold text-[#0e1b12] text-sm">Schedule</p>
                                        <p className="text-[10px] text-[#0e1b12]/50">Pick a slot</p>
                                    </div>
                                </label>
                            </div>

                            {pickupType === 'SCHEDULE' && (
                                <select
                                    className="w-full bg-[#f8fbf7] border border-[#e7f3eb] rounded-lg p-3 text-sm focus:ring-[#166534] focus:border-[#166534] outline-none"
                                    value={scheduleSlot}
                                    onChange={(e) => setScheduleSlot(e.target.value)}
                                >
                                    <option value="" disabled>Select a time slot</option>
                                    {availableSlots.map(slot => (
                                        <option key={slot.value} value={slot.value}>{slot.label}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Payment Method - Only show if there is a payable amount */}
                        {normalTotalAmount > 0 ? (
                            <div className="bg-white p-4 rounded-xl border border-[#e7f3eb] shadow-sm">
                                <h2 className="text-lg font-bold font-serif mb-4 flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-[#166534]" />
                                    Payment Method
                                </h2>
                                <div className="space-y-3 mb-6">
                                    <PaymentSelector
                                        amount={totalAmount}
                                        onPaymentChange={setPaymentDetails}
                                        variant="dropdown"
                                        excludeCash={false}
                                    />
                                </div>
                                <CommonCheckoutFooter
                                    isProcessing={isProcessing}
                                    handlePlaceOrder={handlePlaceOrder}
                                    totalAmount={totalAmount}
                                />
                            </div>
                        ) : (
                            // Subscription Only - No Payment Needed
                            <div className="bg-white p-4 rounded-xl border border-[#e7f3eb] shadow-sm">
                                <h2 className="text-lg font-bold font-serif mb-4 flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-[#166534]" />
                                    Payment
                                </h2>
                                <p className="text-sm text-[#0e1b12] mb-4">No payment required for subscription items.</p>
                                <CommonCheckoutFooter
                                    isProcessing={isProcessing}
                                    handlePlaceOrder={handlePlaceOrder}
                                    totalAmount={0}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function CommonCheckoutFooter({ isProcessing, handlePlaceOrder, totalAmount }: any) {
    return (
        <>


            <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-[#166534] hover:bg-[#119e41] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-transform active:scale-[0.98] shadow-lg shadow-[#166534]/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isProcessing ? 'Processing...' : 'Place Order'}
                {!isProcessing && <ArrowRight className="w-5 h-5" />}
            </button>
            <p className="text-center text-xs text-[#0e1b12]/40 mt-4 px-4">
                By clicking "Place Order", you agree to our terms and conditions of service.
            </p>
        </>
    );
}

function Footer() {
    return (
        <footer className="mt-20 border-t border-[#e7f3eb] py-10">
            <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-[#0e1b12]/40 font-serif">© 2024 Cafe South Central</p>
                </div>
            </div>
        </footer>
    );
}

// --- Main Wrapper Component ---
function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planId = searchParams?.get('plan');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
        if (!storedUser) {
            router.push('/?login=true');
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [router]);

    if (!user) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-3xl mb-4">⏳</div>
                    <p className="text-gray-500">Loading checkout...</p>
                </div>
            </div>
        );
    }

    // Include Header ONLY if needed (user said keep current header)
    // Subscription flow had DesktopHeader. Food checkout flow usually has Main Header.
    // The Layout handles main header usually? 
    // In src/app/page.tsx, DesktopHeader is manually included.
    // In src/app/layout.tsx, there is NO header.
    // So we MUST include the header here for consistency.

    return (
        <div className="min-h-screen flex flex-col">
            <CheckoutHeader user={user} onLoginClick={() => router.push('/?login=true')} />

            {planId ? (
                <SubscriptionCheckoutContent user={user} planId={planId} />
            ) : (
                <FoodCheckoutContent user={user} />
            )}
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
