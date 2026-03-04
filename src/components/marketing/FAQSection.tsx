'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
    {
        question: "How does the ordering system work?",
        answer: "Simply browse our menu, add items to your cart, and checkout. You'll receive a QR code that you scan at our counter to pick up your order. No waiting in line!"
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept UPI, credit/debit cards, and cash on delivery (up to ₹500). Subscription members don't pay for individual orders - meals are deducted from their quota."
    },

    {
        question: "How long does it take to prepare an order?",
        answer: "Most orders are ready in 15-20 minutes. You can also schedule orders up to 3 hours in advance. We'll notify you when your food is ready for pickup."
    },
    {
        question: "What if an item is sold out?",
        answer: "Our menu updates in real-time. If an item sells out while it's in your cart, we'll notify you immediately and offer alternatives. You'll never pay for something we can't deliver."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section style={{
            padding: '6rem 2rem 8rem 2rem',
            position: 'relative'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <h2 className="font-serif-heading" style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        fontWeight: 400,
                        color: '#0e1b12',
                        marginBottom: '1rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Frequently Asked Questions
                    </h2>
                    <div style={{
                        width: '60px',
                        height: '4px',
                        background: '#3C2A21',
                        margin: '0 auto',
                        opacity: 0.2
                    }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {FAQS.map((faq, index) => (
                        <div
                            key={index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            style={{
                                backgroundColor: '#ffffff',
                                padding: '1.5rem 2rem',
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                border: '1px solid rgba(60, 42, 33, 0.08)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{
                                    fontFamily: '"Playfair Display", serif',
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    color: '#102214',
                                    margin: 0
                                }}>
                                    {faq.question}
                                </h3>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown size={24} color="#3C2A21" />
                                </motion.div>
                            </div>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <p style={{
                                            fontFamily: 'sans-serif',
                                            color: '#4a5d50',
                                            lineHeight: 1.6,
                                            fontSize: '1rem',
                                            paddingTop: '1rem',
                                            margin: 0
                                        }}>
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
