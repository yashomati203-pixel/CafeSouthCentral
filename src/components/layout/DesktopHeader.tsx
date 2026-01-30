'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface DesktopHeaderProps {
    user?: any;
    cartItemCount?: number;
    onCartClick?: () => void;
    onLoginClick?: () => void;
}

export default function DesktopHeader({
    user,
    cartItemCount = 0,
    onCartClick,
    onLoginClick
}: DesktopHeaderProps) {
    const router = useRouter();

    return (
        <header className="hidden md:flex" style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            padding: '1rem 2rem',
            borderBottom: '1px solid #e5e7eb',
            position: 'sticky',
            top: 0,
            backgroundColor: '#FFF8F0',
            zIndex: 50
        }}>
            {/* Left: Logo */}
            <div>
                <div
                    onClick={() => router.push('/')}
                    style={{ cursor: 'pointer' }}
                >
                    <Image
                        src="/logo.png"
                        alt="Cafe South Central"
                        width={200}
                        height={60}
                        style={{ objectFit: 'contain', objectPosition: 'left' }}
                        priority
                    />
                </div>
            </div>

            {/* Right: Navigation Links + Cart + Profile */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                {/* Navigation Links */}
                <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#5C3A1A',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            padding: '0.5rem 0',
                            transition: 'color 0.2s',
                            fontFamily: 'inherit'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#2F4F2F'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#5C3A1A'}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => {
                            // Scroll to menu or navigate
                            if (window.location.pathname !== '/') {
                                router.push('/?section=menu');
                            } else {
                                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#5C3A1A',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            padding: '0.5rem 0',
                            transition: 'color 0.2s',
                            fontFamily: 'inherit'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#2F4F2F'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#5C3A1A'}
                    >
                        Menu
                    </button>
                    <button
                        onClick={() => router.push('/subscription')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#5C3A1A',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            padding: '0.5rem 0',
                            transition: 'color 0.2s',
                            fontFamily: 'inherit'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#2F4F2F'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#5C3A1A'}
                    >
                        Subscriptions
                    </button>
                    {user && (
                        <button
                            onClick={() => router.push('/orders')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#5C3A1A',
                                fontSize: '1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                padding: '0.5rem 0',
                                transition: 'color 0.2s',
                                fontFamily: 'inherit'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#2F4F2F'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#5C3A1A'}
                        >
                            Orders
                        </button>
                    )}
                </div>

                {/* Right Actions: Cart & Profile/Login */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {/* Cart Icon (only if logged in or always? Screenshot didn't show it but good to keep if compatible) */}
                    {/* Temporarily hiding Cart for Guest to match screenshot exactly? No, usually Cart is essential. Keeping it but maybe lighter. */}

                    {/* Login Button - Pill Shape */}
                    {user ? (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button
                                onClick={() => {
                                    if (user && onCartClick) onCartClick();
                                }}
                                style={{
                                    position: 'relative',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    padding: '0.5rem',
                                    color: '#5C3A1A'
                                }}
                                title="Cart"
                            >
                                🛒
                                {cartItemCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '0',
                                        right: '0',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '18px',
                                        height: '18px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => router.push('/account')}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    backgroundColor: '#5C3A1A',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1rem',
                                    fontWeight: 'bold'
                                }}
                                title={user.name || 'Profile'}
                            >
                                {user.name?.[0]?.toUpperCase() || '👤'}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onLoginClick?.()}
                            style={{
                                backgroundColor: '#3C2A21',
                                color: '#FFF8F0', /* or white */
                                border: 'none',
                                padding: '0.6rem 2rem',
                                borderRadius: '999px',
                                fontSize: '1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontFamily: 'inherit',
                                boxShadow: '0 2px 5px rgba(60, 42, 33, 0.2)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(60, 42, 33, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 2px 5px rgba(60, 42, 33, 0.2)';
                            }}
                        >
                            Login / Sign Up
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
