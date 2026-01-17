import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedText } from "@/components/ui/animated-underline-text-one";
import { useScroll, useTransform } from 'motion/react';
import Antigravity from '@/components/ui/Antigravity';

interface LandingPageProps {
    onExplore: () => void;
    onViewPlans?: () => void;
    onCategorySelect?: (category: string) => void;
    onLogin?: () => void;
}

const CATEGORIES = [
    { name: 'South Indian', dataCategory: 'South Indian', icon: '🥘', color: '#ffedd5', image: '/images/cat-south.jpg' },
    { name: 'Dosa Special', dataCategory: 'Dosa', icon: '🥞', color: '#fee2e2', image: '/images/cat-dosa.jpg' },
    { name: 'Rice Bowls', dataCategory: 'Rice', icon: '🍚', color: '#dcfce7', image: '/images/cat-rice.jpg' },
    { name: 'North Indian', dataCategory: 'North Indian', icon: '🍛', color: '#e0e7ff', image: '/images/cat-north.jpg' },
    { name: 'Snacks', dataCategory: 'Snacks', icon: '🍟', color: '#fef9c3', image: '/images/cat-snacks.jpg' },
    { name: 'Beverages', dataCategory: 'Beverages', icon: '☕', color: '#fae8ff', image: '/images/cat-bev.jpg' },
    { name: 'Chaat', dataCategory: 'Chaat', icon: '🥟', color: '#f3f4f6', image: '/images/cat-chaat.jpg' },
    { name: 'Desserts', dataCategory: 'Dessert', icon: '🍦', color: '#ffe4e6', image: '/images/cat-sweet.jpg' },
];

export default function LandingPage({ onExplore, onCategorySelect, onViewPlans, onLogin }: LandingPageProps) {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    // Scroll-based carousel movement
    const carouselX = useTransform(scrollY, [0, 500], [0, -600]);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#fefaef',
            fontFamily: 'sans-serif',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            {/* Antigravity Particle Background */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.3 }}>
                <Antigravity
                    count={50}
                    magnetRadius={6}
                    ringRadius={10}
                    waveSpeed={0.4}
                    waveAmplitude={1}
                    particleSize={2}
                    lerpSpeed={0.1}
                    color="#37483c"
                    autoAnimate={false}
                    particleVariance={1}
                    rotationSpeed={0}
                    depthFactor={1}
                    pulseSpeed={3}
                    particleShape="capsule"
                    fieldStrength={10}
                />
            </div>
            {/* Sticky Navigation Bar */}
            <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backgroundColor: scrolled ? '#fefaef' : 'transparent',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                transition: 'all 0.3s ease',
                padding: '1rem 2rem',
                borderBottom: scrolled ? '1px solid rgba(92, 58, 26, 0.1)' : 'none',
                boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.05)' : 'none'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {/* Left: Logo */}
                    <div style={{ display: 'flex', alignItems: 'left', mixBlendMode: 'multiply' }}>
                        <img
                            src="/logo-final.png"
                            alt="Cafe South Central"
                            style={{
                                height: '100px',
                                width: 'auto',
                                border: 'none',
                                outline: 'none',
                                filter: 'contrast(1.2) brightness(1.2) '
                            }}
                        />
                    </div>

                    {/* Center-Right: Navigation Links */}
                    <div style={{
                        display: 'flex',
                        gap: '3.5rem',
                        alignItems: 'center',
                        marginLeft: 'auto',
                        marginRight: '3rem'
                    }}>
                        <a href="#home" style={{
                            color: '#3C2A21',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                            transition: 'color 0.2s'
                        }}>Home</a>
                        <a href="#menu" onClick={(e) => {
                            e.preventDefault();
                            onExplore();
                        }} style={{
                            color: '#3C2A21',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                            transition: 'color 0.2s'
                        }}>Menu</a>
                        <a href="/subscription" onClick={(e) => {
                            e.preventDefault();
                            onViewPlans?.();
                        }} style={{
                            color: '#3C2A21',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                            transition: 'color 0.2s'
                        }}>Subscriptions</a>
                    </div>

                    {/* Right: Login Button */}
                    <button
                        onClick={onLogin}
                        style={{
                            padding: '0.75rem 2rem',
                            backgroundColor: '#3C2A21',
                            color: 'white',
                            border: 'none',
                            borderRadius: '999px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 2px 8px rgba(60, 42, 33, 0.2)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(60, 42, 33, 0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(60, 42, 33, 0.2)';
                        }}
                    >
                        Login / Sign Up
                    </button>
                </div>
            </nav>

            {/* Hero Section with Parallax Images */}
            <header style={{
                position: 'relative',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 2rem',
                overflow: 'visible',
                background: 'transparent',
                zIndex: 1
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        textAlign: 'center',
                        maxWidth: '800px',
                        zIndex: 2,
                        marginTop: '-4rem'
                    }}
                >
                    <div style={{ marginBottom: '1.5rem' }}>
                        <AnimatedText
                            text="Fresh Food, Made Daily"
                            textClassName="text-[clamp(3rem,8vw,6rem)] font-black leading-[1.1] text-[#3C2A21] tracking-tighter"
                            underlineClassName="text-[#3C2A21]"
                        />
                    </div>
                    <p style={{
                        fontSize: '1.5rem',
                        color: '#6B5B52',
                        marginBottom: '3rem',
                        fontWeight: 400
                    }}>
                        Experience authentic South Indian cuisine
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={onExplore}
                            style={{
                                padding: '1.25rem 3rem',
                                fontSize: '1.2rem',
                                fontWeight: 700,
                                color: '#3C2A21',
                                backgroundColor: 'transparent',
                                border: '2px solid #3C2A21',
                                borderRadius: '999px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(60, 42, 33, 0.3)',
                                transition: 'background-color 0.2s, color 0.2s, box-shadow 0.2s',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#3C2A21';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#3C2A21';
                            }}
                        >
                            Explore Menu 🍽️
                        </button>
                        <button
                            onClick={onViewPlans}
                            style={{
                                padding: '1.25rem 3rem',
                                fontSize: '1.2rem',
                                fontWeight: 700,
                                color: '#3C2A21',
                                backgroundColor: 'transparent',
                                border: '2px solid #3C2A21',
                                borderRadius: '999px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s, color 0.2s',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#3C2A21';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#3C2A21';
                            }}
                        >
                            View Plans 🌟
                        </button>
                    </div>
                </motion.div>

                {/* Scroll-Based Rotating Carousel - Bottom of Hero */}
                <div style={{
                    position: 'absolute',
                    bottom: '-270px',
                    left: 0,
                    right: 0,
                    height: '350px',
                    overflow: 'hidden',
                    pointerEvents: 'none'
                }}>
                    <motion.div
                        style={{ x: carouselX }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 30
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            gap: '6rem',
                            paddingLeft: '10%'
                        }}>
                            {/* Duplicate images 3 times for seamless infinite scroll */}
                            {[...Array(3)].map((_, setIndex) => (
                                <React.Fragment key={setIndex}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1, rotate: -48.66 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        style={{
                                            minWidth: '280px',
                                            height: '280px',
                                            willChange: 'transform',
                                            flexShrink: 0
                                        }}
                                    >
                                        <img
                                            src="/images/hero/filter-coffee.png"
                                            alt="Filter Coffee"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '50%',
                                                boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
                                            }}
                                        />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 48.66 }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                        style={{
                                            minWidth: '280px',
                                            height: '280px',
                                            willChange: 'transform',
                                            flexShrink: 0
                                        }}
                                    >
                                        <img
                                            src="/images/hero/dosa.png"
                                            alt="Masala Dosa"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '50%',
                                                boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
                                            }}
                                        />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1, rotate: -48.66 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                        style={{
                                            minWidth: '280px',
                                            height: '280px',
                                            willChange: 'transform',
                                            flexShrink: 0
                                        }}
                                    >
                                        <img
                                            src="/images/hero/idli.png"
                                            alt="Soft Idli"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '50%',
                                                boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
                                            }}
                                        />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 48.66 }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                        style={{
                                            minWidth: '280px',
                                            height: '280px',
                                            willChange: 'transform',
                                            flexShrink: 0
                                        }}
                                    >
                                        <img
                                            src="/images/hero/latte.png"
                                            alt="Latte"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '50%',
                                                boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
                                            }}
                                        />
                                    </motion.div>
                                </React.Fragment>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Visual Category Grid */}
            <main style={{ flex: 1, padding: '12rem 2rem 3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    color: '#3C2A21',
                    marginBottom: '3rem',
                    textAlign: 'center'
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
                            onClick={() => onCategorySelect && onCategorySelect(cat.dataCategory)}
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
                                cursor: 'pointer',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                transition: 'box-shadow 0.2s'
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
                <div style={{ marginTop: '4rem', textAlign: 'center', color: '#6B5B52', borderTop: '1px solid #E5DDD8', paddingTop: '2rem' }}>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Open daily from 8:00 AM to 10:00 PM</p>
                    <p style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>📍 Located at Food Court, IIM Nagpur</p>
                </div>
            </main>
        </div>
    );
}
