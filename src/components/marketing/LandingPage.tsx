import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedText } from "@/components/ui/animated-underline-text-one";
import { useScroll, useTransform } from 'motion/react';
import Antigravity from '@/components/ui/Antigravity';
import FeaturesSection from './FeaturesSection';
import Footer from '../layout/Footer';
import ScrollParallax from './ScrollParallax';

interface LandingPageProps {
    onExplore: () => void;
    onViewPlans?: () => void;
    onCategorySelect?: (category: string) => void;
    onLogin?: () => void;
    user?: { id?: string; name: string; phone: string; role?: string } | null;
}

const CATEGORIES = [
    { name: 'South Indian', dataCategory: 'South Indian', iconImage: '/images/categories/south-indian.png', color: '#ffedd5', image: '/images/cat-south.jpg' },
    { name: 'Dosa Special', dataCategory: 'Dosa', iconImage: '/images/categories/dosa.png', color: '#fee2e2', image: '/images/cat-dosa.jpg' },
    { name: 'Rice Bowls', dataCategory: 'Rice', iconImage: '/images/categories/rice.png', color: '#dcfce7', image: '/images/cat-rice.jpg' },
    { name: 'North Indian', dataCategory: 'North Indian', iconImage: '/images/categories/north-indian.png', color: '#e0e7ff', image: '/images/cat-north.jpg' },
    { name: 'Snacks', dataCategory: 'Snacks', iconImage: '/images/categories/snacks.png', color: '#fef9c3', image: '/images/cat-snacks.jpg' },
    { name: 'Beverages', dataCategory: 'Beverages', iconImage: '/images/categories/beverages.png', color: '#fae8ff', image: '/images/cat-bev.jpg' },
    { name: 'Chaat', dataCategory: 'Chaat', iconImage: '/images/categories/chaat.png', color: '#f3f4f6', image: '/images/cat-chaat.jpg' },
    { name: 'Desserts', dataCategory: 'Dessert', iconImage: '/images/categories/desserts.png', color: '#ffe4e6', image: '/images/cat-sweet.jpg' },
];

export default function LandingPage({ onExplore, onCategorySelect, onViewPlans, onLogin, user }: LandingPageProps) {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    // Scroll-based carousel movement
    const carouselX = useTransform(scrollY, [0, 500], [0, -600]);

    // Parallax transforms for floating coffee cup elements
    const floatingY1 = useTransform(scrollY, [0, 800], [0, -150]);
    const floatingY2 = useTransform(scrollY, [0, 800], [0, 150]);
    const floatingY3 = useTransform(scrollY, [0, 800], [0, -120]);
    const floatingX1 = useTransform(scrollY, [0, 800], [0, -80]);
    const floatingX2 = useTransform(scrollY, [0, 800], [0, 80]);
    const rotate1 = useTransform(scrollY, [0, 800], [0, -20]);
    const rotate2 = useTransform(scrollY, [0, 800], [0, 20]);

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
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.3, pointerEvents: 'none' }}>
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
                backgroundColor: '#fefaef',
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

                    {/* Right: Login Button or User Profile */}
                    <button
                        onClick={(e) => {
                            if (user) {
                                // If logged in, navigate to account page or show profile
                                window.location.href = '/account';
                            } else {
                                console.log('Login button clicked');
                                if (onLogin) onLogin();
                                else console.error('onLogin prop is missing');
                            }
                        }}
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
                        {user ? user.name : 'Login / Sign Up'}
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
                {/* Floating Coffee Cup Elements with Parallax */}
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '5%',
                        left: '10%',
                        y: floatingY1,
                        x: floatingX1,
                        rotate: rotate1,
                        zIndex: 0
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                        background: '#fff'
                    }}>
                        <img
                            src="/images/hero/filter-coffee.png"
                            alt="Filter Coffee"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                </motion.div>

                <motion.div
                    style={{
                        position: 'absolute',
                        top: '20%',
                        right: '8%',
                        y: floatingY2,
                        x: floatingX2,
                        rotate: rotate2,
                        zIndex: 0
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <div style={{
                        width: '130px',
                        height: '130px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                        background: '#fff'
                    }}>
                        <img
                            src="/images/hero/latte.png"
                            alt="Latte"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                </motion.div>

                <motion.div
                    style={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '12%',
                        y: floatingY3,
                        rotate: rotate1,
                        zIndex: 0
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.7, scale: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                >
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                        background: '#fff'
                    }}>
                        <img
                            src="/images/hero/dosa.png"
                            alt="Dosa"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                </motion.div>

                {/* Center Content */}
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
                                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                        animate={{ opacity: 1, scale: 1, rotate: -48.66, y: 0 }}
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
                                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 48.66, y: 0 }}
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
                                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                        animate={{ opacity: 1, scale: 1, rotate: -48.66, y: 0 }}
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
                                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 48.66, y: 0 }}
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

            {/* Category Tabs Section */}
            <section style={{
                position: 'relative',
                width: '100%',
                background: 'linear-gradient(180deg, #fefaef 0%, #f5ede2 100%)',
                padding: '12rem 2rem 4rem 2rem',
                marginTop: '4rem',
                overflow: 'hidden'
            }}>
                {/* Title for Category Section */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '4rem',
                    position: 'relative',
                    zIndex: 20
                }}>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: 800,
                        color: '#3C2A21',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.02em'
                    }}>
                        We Serve You With
                    </h2>
                </div>

                {/* Category Tabs Container */}
                <ScrollParallax
                    categories={CATEGORIES}
                    onCategorySelect={(category) => {
                        onCategorySelect?.(category);
                        onExplore();
                    }}
                />
            </section>

            {/* New Features and Footer Sections */}
            <FeaturesSection />
            <Footer />
        </div>
    );
}
