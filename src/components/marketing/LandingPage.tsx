import React from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
    onExplore: () => void;
}

const CATEGORIES = [
    { name: 'South Indian', icon: '🥘', color: '#ffedd5', image: '/images/cat-south.jpg' },
    { name: 'Dosa Special', icon: '🥞', color: '#fee2e2', image: '/images/cat-dosa.jpg' },
    { name: 'Rice Bowls', icon: '🍚', color: '#dcfce7', image: '/images/cat-rice.jpg' },
    { name: 'North Indian', icon: '🍛', color: '#e0e7ff', image: '/images/cat-north.jpg' },
    { name: 'Snacks', icon: '🍟', color: '#fef9c3', image: '/images/cat-snacks.jpg' },
    { name: 'Beverages', icon: '☕', color: '#fae8ff', image: '/images/cat-bev.jpg' },
    { name: 'Chaat', icon: '🥟', color: '#f3f4f6', image: '/images/cat-chaat.jpg' },
    { name: 'Desserts', icon: '🍦', color: '#ffe4e6', image: '/images/cat-sweet.jpg' },
];

export default function LandingPage({ onExplore }: LandingPageProps) {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#fff',
            fontFamily: 'sans-serif',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Hero Section */}
            <header style={{
                backgroundColor: '#5C3A1A',
                color: 'white',
                padding: '4rem 2rem',
                textAlign: 'center',
                borderBottomLeftRadius: '2rem',
                borderBottomRightRadius: '2rem',
                boxShadow: '0 10px 30px rgba(92, 58, 26, 0.2)'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        Cafe South Central
                    </h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Experience the authentic taste of tradition. Freshly prepared, served with love at IIM Nagpur.
                    </p>
                    <button
                        onClick={onExplore}
                        style={{
                            padding: '1rem 3rem',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: '#5C3A1A',
                            backgroundColor: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                        }}
                    >
                        Explore Full Menu 🍽️
                    </button>
                </motion.div>
            </header>

            {/* Visual Category Grid */}
            <main style={{ flex: 1, padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: '#333',
                    marginBottom: '2rem',
                    borderLeft: '5px solid #5C3A1A',
                    paddingLeft: '1rem'
                }}>
                    OUR MENU
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {CATEGORIES.map((cat, index) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            style={{
                                backgroundColor: cat.color,
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                cursor: 'default', // Visual only
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{
                                fontSize: '3rem',
                                marginBottom: '1rem',
                                filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.1))'
                            }}>
                                {cat.icon}
                            </div>
                            <span style={{
                                fontWeight: '700',
                                color: '#4b5563',
                                fontSize: '1rem'
                            }}>
                                {cat.name}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Info / Footer tease */}
                <div style={{ marginTop: '4rem', textAlign: 'center', color: '#666', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                    <p>Open daily from 8:00 AM to 10:00 PM</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>📍 Located at Food Court, IIM Nagpur</p>
                </div>
            </main>
        </div>
    );
}
