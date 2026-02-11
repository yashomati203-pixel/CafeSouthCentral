import React, { useState } from 'react';
import HeroSection from './HeroSection';

import Link from 'next/link';
import FAQSection from './FAQSection';
import CategoriesSection from './CategoriesSection';
import Footer from '../layout/Footer';
import { UtensilsCrossed, CreditCard, ShoppingBag } from 'lucide-react';

interface LandingPageProps {
    onExplore: () => void;
    onViewPlans?: () => void;
    onCategorySelect?: (category: string) => void;
    onLogin?: () => void;
    user?: any;
}

export default function LandingPage({ onExplore, onCategorySelect, onViewPlans, onLogin, user }: LandingPageProps) {

    return (
        <div style={{
            minHeight: '100vh',
            background: '#e2e9e0', // Green theme
            fontFamily: 'sans-serif',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>

            {/* New Hero Section (Includes Navbar) */}
            <HeroSection onExplore={onExplore} onLoginClick={onLogin} user={user} />

            {/* Categories Section */}
            <CategoriesSection
                onCategorySelect={onCategorySelect}
                onViewAll={onExplore}
            />

            {/* How It Works Section */}
            <section style={{
                position: 'relative',
                width: '100%',
                background: '#f8fbf7', // Lighter background for contrast
                padding: '6rem 2rem 8rem 2rem',
                overflow: 'hidden',
                textAlign: 'center',
                zIndex: 10
            }}>
                {/* Title */}
                <div style={{ marginBottom: '4rem', position: 'relative', zIndex: 10 }}>
                    <h2 className="font-serif-heading" style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        fontWeight: 400,
                        color: '#0e1b12',
                        marginBottom: '1rem',
                        letterSpacing: '-0.02em'
                    }}>
                        How It Works
                    </h2>
                    <div style={{
                        width: '60px',
                        height: '4px',
                        background: '#e2e9e0',
                        margin: '0 auto'
                    }}></div>
                </div>

                {/* Steps Container */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '2rem',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 10
                }}>
                    {/* Step 1 */}
                    <div style={{
                        flex: '1 1 300px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem',
                        background: '#ffffff',
                        padding: '3rem 2rem',
                        borderRadius: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid #e7f3eb'
                    }}>
                        <div style={{
                            color: '#0e1b12',
                            marginBottom: '0.5rem'
                        }}>
                            <UtensilsCrossed size={32} strokeWidth={2} />
                        </div>
                        <h3 className="font-serif-heading" style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', fontWeight: 500, color: '#0e1b12', margin: 0 }}>1. Browse Menu</h3>
                        <p style={{ fontFamily: '"Playfair Display", serif', color: '#4e9767', lineHeight: 1.6, fontSize: '0.95rem' }}>Explore our rotating daily menu of authentic home-cooked meals.</p>
                    </div>

                    {/* Step 2 */}
                    <div style={{
                        flex: '1 1 300px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem',
                        background: '#ffffff',
                        padding: '3rem 2rem',
                        borderRadius: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid #e7f3eb'
                    }}>
                        <div style={{
                            color: '#0e1b12',
                            marginBottom: '0.5rem'
                        }}>
                            <CreditCard size={32} strokeWidth={2} />
                        </div>
                        <h3 className="font-serif-heading" style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', fontWeight: 500, color: '#0e1b12', margin: 0 }}>2. Order & Pay</h3>
                        <p style={{ fontFamily: '"Playfair Display", serif', color: '#4e9767', lineHeight: 1.6, fontSize: '0.95rem' }}>Select your meal type and secure your spot with easy online payment.</p>
                    </div>

                    {/* Step 3 */}
                    <div style={{
                        flex: '1 1 300px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem',
                        background: '#ffffff',
                        padding: '3rem 2rem',
                        borderRadius: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        border: '1px solid #e7f3eb'
                    }}>
                        <div style={{
                            color: '#0e1b12',
                            marginBottom: '0.5rem'
                        }}>
                            <ShoppingBag size={32} strokeWidth={2} />
                        </div>
                        <h3 className="font-serif-heading" style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', fontWeight: 500, color: '#0e1b12', margin: 0 }}>3. Quick Pickup</h3>
                        <p style={{ fontFamily: '"Playfair Display", serif', color: '#4e9767', lineHeight: 1.6, fontSize: '0.95rem' }}>Skip the queue. Your fresh meal will be hot and ready for your arrival.</p>
                    </div>
                </div>
            </section>

            {/* New Features and Footer Sections */}
            <FAQSection />
            <br />
        </div>
    );
}
