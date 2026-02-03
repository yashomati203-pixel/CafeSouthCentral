
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface HeroSectionProps {
    onExplore?: () => void;
    onLoginClick?: () => void;
    user?: any;
}

export default function HeroSection({ onExplore, onLoginClick, user }: HeroSectionProps) {
    return (
        <section style={{
            position: 'relative',
            minHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: '1rem 4rem 1rem 6rem',
            maxWidth: '100%',
            width: '100%',
            margin: '0 auto',
            backgroundColor: '#e2e9e0'
        }}>

            {/* Header / Nav Area */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0',
                zIndex: 10,
                paddingTop: '0.5rem',
                maxWidth: '1600px',
                width: '100%',
                margin: '0 auto'
            }}>
                {/* Logo */}
                <div style={{ flex: '0 0 auto' }}>
                    <Image
                        src="/Final web logo.png"
                        alt="Cafe South Central"
                        width={550}
                        height={260}
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>

                {/* Right Side Nav */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '2.5rem',
                }}>
                    <nav style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5rem',
                        marginRight: '5rem',
                    }}>
                        <button
                            onClick={onExplore}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontFamily: 'var(--font-manrope)',
                                fontWeight: 800,
                                color: '#4a3b32',
                                cursor: 'pointer',
                                fontSize: '1rem' // Explicit font size to match
                            }}>
                            Menu
                        </button>
                        <Link href="/subscription" style={{
                            fontFamily: 'var(--font-manrope)',
                            fontWeight: 800,
                            color: '#4a3b32',
                            textDecoration: 'none',
                            fontSize: '1rem'
                        }}>
                            Subscriptions
                        </Link>
                        {user ? (
                            <Link href="/account">
                                <button
                                    style={{
                                        backgroundColor: '#5C3A1A',
                                        color: 'white',
                                        padding: '0.8rem 1.5rem',
                                        borderRadius: '999px',
                                        border: 'none',
                                        fontFamily: 'var(--font-manrope)',
                                        fontWeight: 800,
                                        fontSize: '0.95rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                    <span>{user.name || 'User'}</span>
                                </button>
                            </Link>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                style={{
                                    backgroundColor: '#005001',
                                    color: '#f7e231',
                                    padding: '1.5rem 2.5rem',
                                    borderRadius: '999px',
                                    border: 'none',
                                    fontFamily: 'var(--font-manrope)',
                                    fontWeight: 800,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer'
                                }}>
                                Login / Sign Up
                            </button>
                        )}
                    </nav>

                    <span style={{
                        fontFamily: 'var(--font-playfair)',
                        fontStyle: 'italic',
                        color: '#8c7662',
                        fontSize: '1.2rem',
                        marginRight: '0.5rem',
                        marginTop: '-1.5rem',
                        opacity: 0.8
                    }}>
                        "You become what you eat"
                    </span>
                </div>
            </header>

            {/* Main Content Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
                gap: '2rem',
                flex: 1,
                alignItems: 'center',
                position: 'relative',
                paddingBottom: '2rem',
                maxWidth: '1600px',
                width: '100%',
                margin: '0 auto'
            }}>

                {/* Left Content */}
                <div style={{ paddingRight: '1rem', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {/* Main Headline - Dark Green */}
                    <h1 style={{
                        fontFamily: 'var(--font-playfair)',
                        fontWeight: 450,
                        fontSize: 'clamp(1.5rem, 5vw, 3.5rem)', // Slightly larger again to match visual weight
                        color: '#005001', // Dark Green
                        lineHeight: 1,
                        marginBottom: '0rem',
                        marginTop: '-4rem'
                    }}>
                        Hearty breakfast.<br />
                        Quick bites.<br />
                        Clean lunch.
                    </h1>

                    {/* Subheadline - Brown, Sans Serif */}
                    <h2 style={{
                        fontFamily: 'var(--font-manrope)',
                        fontWeight: 600,
                        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                        color: '#5c3a1a',
                        marginTop: '0.5rem',
                        marginBottom: '0.5rem', // More space before button
                        lineHeight: 1.2
                    }}>
                        We’ve got a plate<br />
                        ready for you.
                    </h2>

                    {/* CTA Button */}
                    <button
                        onClick={onExplore}
                        style={{
                            backgroundColor: '#005001',
                            color: '#f7e231',
                            fontSize: '2rem',//larger text
                            fontWeight: 700,
                            fontFamily: 'var(--font-manrope)',
                            padding: '1rem 8rem',
                            borderRadius: '999px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(0, 80, 1, 0.3)',
                            marginBottom: '0.5rem'
                        }}>
                        Explore Menu
                    </button>

                    {/* Tagline - Greenish Grey */}
                    <p style={{
                        fontFamily: 'var(--font-manrope)',
                        color: '#4a5d50', // Greenish Grey
                        fontSize: '1.2rem',
                        fontWeight: 500,
                        marginTop: '0',
                        marginLeft: '11rem',//ightly right
                    }}>
                        Deadlines can wait. Good food can’t.
                    </p>
                </div>

                {/* Right Content - Abstract Collage */}
                <div style={{
                    position: 'relative',
                    height: '100%',
                    minHeight: '600px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {/* Dosa Plate - Top Right Large */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        maxWidth: '400px',
                        zIndex: 2,
                        right: '5%', // Moved left
                        top: '-1%'
                    }}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            paddingBottom: '100%',
                            borderRadius: '40px 40px 40px 40px',
                            overflow: 'hidden'
                        }}>
                            <Image
                                src="/images/hero/dosa.png"
                                alt="Dosa Plate"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                    </div>

                    {/* Idli Plate - Center Left */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        style={{
                            position: 'absolute',
                            width: '70%',
                            maxWidth: '300px',
                            left: '-5%',
                            top: '35%',// Centered vertically relative
                            zIndex: 3
                        }}
                    >
                        <Image
                            src="/images/hero/idli.png"
                            alt="Idli"
                            width={300}
                            height={300}
                            style={{ width: '100%', height: 'auto', borderRadius: '30%', }}
                        />
                    </motion.div>

                    {/* Fresh Badge - Below Idli */}
                    <div style={{
                        position: 'absolute',
                        left: '5%',
                        bottom: '8%',
                        zIndex: 3,
                        backgroundColor: '#e6f0e6',
                        border: '1px solid #1a2e1a',
                        borderRadius: '999px',
                        padding: '0.5rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                        <span style={{
                            fontFamily: 'var(--font-playfair)',
                            fontWeight: 700,
                            color: '#002200',
                            fontSize: '1rem'
                        }}>
                            100% Fresh • Made Today
                        </span>
                    </div>

                    {/* Coffee - Bottom Right */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                        style={{
                            position: 'absolute',
                            width: '35%',
                            maxWidth: '260px',
                            right: '0%',
                            bottom: '10%',
                            zIndex: 4
                        }}
                    >
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            paddingBottom: '100%',
                            borderRadius: '40px',
                            overflow: 'hidden'
                        }}>
                            <Image
                                src="/images/hero/filter-coffee.png"
                                alt="Filter Coffee"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                    </motion.div>

                </div>

            </div>
        </section>
    );
}
