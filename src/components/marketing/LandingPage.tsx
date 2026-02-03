import React, { useState } from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import CategoriesSection from './CategoriesSection';
import Footer from '../layout/Footer';
import { UtensilsCrossed, CreditCard, Bike } from 'lucide-react';

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
                background: '#e2e9e0', // Green theme
                padding: '6rem 2rem 8rem 2rem',
                overflow: 'hidden',
                textAlign: 'center',
                zIndex: 10
            }}>
                {/* Title */}
                <div style={{ marginBottom: '4rem', position: 'relative', zIndex: 10 }}>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: 800,
                        color: '#3C2A21',
                        marginBottom: '1rem',
                        letterSpacing: '-0.02em'
                    }}>
                        How It Works
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: '#6B5B52', maxWidth: '600px', margin: '0 auto' }}>
                        Your favorite food, ready in 3 simple steps.
                    </p>
                </div>

                {/* Steps Container */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '4rem',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 10
                }}>
                    {/* Step 1 */}
                    <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            width: '100px', height: '100px',
                            borderRadius: '50%',
                            backgroundColor: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(60,42,33,0.1)',
                            color: '#3C2A21'
                        }}>
                            <UtensilsCrossed size={48} strokeWidth={1.5} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3C2A21', margin: 0 }}>1. Select Your Meal</h3>
                        <p style={{ color: '#6B5B52', lineHeight: 1.6 }}>Browse our authentic South Indian menu and choose your favorites.</p>
                    </div>

                    {/* Step 2 */}
                    <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            width: '100px', height: '100px',
                            borderRadius: '50%',
                            backgroundColor: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(60,42,33,0.1)',
                            color: '#3C2A21'
                        }}>
                            <CreditCard size={48} strokeWidth={1.5} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3C2A21', margin: 0 }}>2. Order & Pay</h3>
                        <p style={{ color: '#6B5B52', lineHeight: 1.6 }}>Quick secure checkout or Cash on Delivery options.</p>
                    </div>

                    {/* Step 3 */}
                    <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            width: '100px', height: '100px',
                            borderRadius: '50%',
                            backgroundColor: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(60,42,33,0.1)',
                            color: '#3C2A21'
                        }}>
                            <Bike size={48} strokeWidth={1.5} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3C2A21', margin: 0 }}>3. Enjoy!</h3>
                        <p style={{ color: '#6B5B52', lineHeight: 1.6 }}>Pick up hot from the counter or get it delivered to your doorstep.</p>
                    </div>
                </div>
            </section>

            {/* New Features and Footer Sections */}
            <FeaturesSection />
            <Footer />
        </div>
    );
}
