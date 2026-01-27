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
                        transition: 'color 0.2s'
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
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#2F4F2F'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#5C3A1A'}
                >
                    Subscriptions
                </button>
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
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#2F4F2F'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#5C3A1A'}
                >
                    Orders
                </button>

                {/* Cart Icon */}
                <button
                    onClick={() => {
                        if (user && onCartClick) {
                            onCartClick();
                        } else if (!user && onLoginClick) {
                            onLoginClick();
                        }
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

                {/* Profile Icon or Login */}
                {user ? (
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
                ) : (
                    <button
                        onClick={() => onLoginClick?.()}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#5C3A1A',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            padding: '0.5rem 0',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#2F4F2F'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#5C3A1A'}
                    >
                        Login
                    </button>
                )}
            </div>
        </header>
    );
}
