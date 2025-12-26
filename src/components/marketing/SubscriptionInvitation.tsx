'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubscriptionInvitationProps {
    isOpen: boolean;
    onClose: () => void;
    onJoin: () => void;
}

export default function SubscriptionInvitation({ isOpen, onClose, onJoin }: SubscriptionInvitationProps) {
    const [dailySpend, setDailySpend] = useState(150);
    const SUBSCRIPTION_PRICE = 3000; // Example monthly price
    // Assuming 22 working days or 30 days? Let's say 30 days for easy math or user perception.
    // If daily limit is 4 items, let's say average item is 50. Max value 200/day.
    const [monthlySavings, setMonthlySavings] = useState(0);

    useEffect(() => {
        // Simple logic: Spend * 30 days vs Subscription Price
        const normalCost = dailySpend * 30;
        const savings = normalCost - SUBSCRIPTION_PRICE;
        setMonthlySavings(Math.max(0, savings));
    }, [dailySpend]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'black',
                            zIndex: 1001,
                        }}
                    />

                    {/* Sliding Card */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'white',
                            borderTopLeftRadius: '1.5rem',
                            borderTopRightRadius: '1.5rem',
                            padding: '2rem',
                            zIndex: 1002,
                            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ width: '40px', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', margin: '0 auto 1.5rem' }} />

                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#5C3A1A', marginBottom: '0.5rem' }}>
                                Become a Member 🌟
                            </h2>
                            <p style={{ color: '#666', fontSize: '1rem' }}>
                                Unlock exclusive savings with our Monthly Mess Plan.
                            </p>
                        </div>

                        {/* Calculator Section */}
                        <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: '1rem', textAlign: 'center' }}>
                                How much do you spend daily?
                            </h3>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 'bold', color: '#5C3A1A' }}>
                                <span>₹50</span>
                                <span style={{ fontSize: '1.5rem' }}>₹{dailySpend}</span>
                                <span>₹300</span>
                            </div>

                            <input
                                type="range"
                                min="50"
                                max="300"
                                step="10"
                                value={dailySpend}
                                onChange={(e) => setDailySpend(parseInt(e.target.value))}
                                style={{
                                    width: '100%',
                                    height: '8px',
                                    borderRadius: '5px',
                                    backgroundColor: '#ddd',
                                    accentColor: '#5C3A1A',
                                    cursor: 'pointer',
                                    outline: 'none',
                                }}
                            />

                            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid #86efac' }}>
                                <p style={{ color: '#166534', fontSize: '0.9rem', marginBottom: '0.25rem' }}>You could save up to</p>
                                <p style={{ color: '#15803d', fontSize: '2rem', fontWeight: 800 }}>
                                    ₹{monthlySavings}
                                </p>
                                <p style={{ color: '#166534', fontSize: '0.8rem' }}>per month vs Normal Ordering</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button
                                onClick={onJoin}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: '#5C3A1A',
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px -1px rgba(92, 58, 26, 0.4)'
                                }}
                            >
                                Join Now (₹{SUBSCRIPTION_PRICE}/mo)
                            </button>
                            <button
                                onClick={onClose}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: 'transparent',
                                    color: '#6b7280',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Maybe Later
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
