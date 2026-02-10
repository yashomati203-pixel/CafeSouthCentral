import React from 'react';

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
    return (
        <section style={{
            backgroundColor: '#e2e9e0',
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {FAQS.map((faq, index) => (
                        <div
                            key={index}
                            style={{
                                position: 'sticky',
                                top: `calc(150px + ${index * 20}px)`, // Stacking effect with slight offset
                                backgroundColor: '#ffffff',
                                padding: '2.5rem',
                                borderRadius: '24px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                border: '1px solid rgba(60, 42, 33, 0.1)',
                                zIndex: index + 1,
                                marginBottom: index === FAQS.length - 1 ? '0' : '2rem' // Spacing for natural flow, but sticky takes over on scroll
                            }}
                        >
                            <h3 style={{
                                fontFamily: '"Playfair Display", serif',
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: '#102214',
                                marginBottom: '1rem'
                            }}>
                                {faq.question}
                            </h3>
                            <p style={{
                                fontFamily: 'sans-serif',
                                color: '#4a5d50',
                                lineHeight: 1.6,
                                fontSize: '1rem'
                            }}>
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
