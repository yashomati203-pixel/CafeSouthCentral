// Force rebuild
'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import ModeToggle from '@/components/ui/ModeToggle';
import SubscriptionSummary from '@/components/dashboard/SubscriptionSummary';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/ordering/CartDrawer';
import { MenuItem, MenuItemType } from '@/types/db';
import LoginPage from '@/components/auth/LoginPage';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import SubscriptionInvitation from '@/components/marketing/SubscriptionInvitation';
import LandingPage from '@/components/marketing/LandingPage';
import FeedbackModal from '@/components/feedback/FeedbackModal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMenu } from '@/hooks/useMenu';
import MenuGrid from '@/components/dashboard/MenuGrid';
import MobileHeader from '@/components/layout/MobileHeader';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import StickyCartSummary from '@/components/ordering/StickyCartSummary';
import MobileProfileMenu from '@/components/layout/MobileProfileMenu';

function DashboardContent() {
    const router = useRouter();
    const [user, setUser] = useState<{ id?: string; name: string; phone: string; role?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [subscriptionData, setSubscriptionData] = useState<any>(null);
    const [isMember, setIsMember] = useState(false);

    // View State: Guest vs Member
    const [hasExplored, setHasExplored] = useState(false);

    // Login Handling
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [mode, setMode] = useState<'NORMAL' | 'SUBSCRIPTION'>('NORMAL');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Feature Loop: Subscription Hook
    const [showInvitation, setShowInvitation] = useState(false);

    // Feature Loop: Feedback
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Dark Mode
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Feature Loop: Smart Inventory
    const { menuItems, isMenuLoading, fetchMenu, MOCK_MENU } = useMenu();

    const fetchSubscriptionData = async () => {
        if (!user?.id) return;
        try {
            const res = await fetch(`/api/user/subscription?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setSubscriptionData(data);
            }
        } catch (e) {
            console.error("Failed to fetch sub data", e);
        }
    };

    const searchParams = useSearchParams();

    // Check for pending feedback on load
    useEffect(() => {
        if (user?.id) {
            fetch(`/api/feedback/pending?userId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    // Check if pendingOrder exists
                    if (data.pendingOrder) {
                        setFeedbackOrderId(data.pendingOrder.id);
                        setTimeout(() => setShowFeedbackModal(true), 2000);
                    }
                })
                .catch(e => console.error("Feedback check failed", e));
        }
    }, [user]);

    // Handle Feedback Submit
    const handleFeedbackSubmit = async (rating: number, comment: string) => {
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    orderId: feedbackOrderId,
                    rating,
                    comment
                })
            });

            if (res.ok) {
                setShowFeedbackModal(false);
                setFeedbackOrderId(null);
                // Optional: Show success toast
            }
        } catch (e) {
            console.error("Feedback submit error", e);
        }
    };

    // Load user from storage with safety timeout
    useEffect(() => {
        const checkUser = () => {
            try {
                // Check localStorage first (Persistent), then sessionStorage (Temporary)
                const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');

                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    if (parsedUser.role === 'ADMIN') {
                        router.push('/admin/dashboard');
                        return;
                    }
                    setUser(parsedUser);
                    setHasExplored(true); // If logged in, skip landing page
                } else {
                    // No user, check URL params for guest mode
                    const mode = searchParams.get('mode');
                    if (mode === 'guest') {
                        setHasExplored(true);
                    } else {
                        setHasExplored(false);
                    }
                }
            } catch (e) {
                console.error("Failed to parse user", e);
            } finally {
                setLoading(false);
            }
        };

        // Run check immediately or after short delay to allow hydration
        const timer = setTimeout(checkUser, 100);
        return () => clearTimeout(timer);
    }, [router, searchParams]); // Added searchParams dependency

    // Fetch subscription data when user/mode changes
    useEffect(() => {
        if (user && mode === 'SUBSCRIPTION') {
            fetchSubscriptionData();
        }
    }, [user, mode]);

    // Check membership status
    useEffect(() => {
        if (user?.id) {
            fetch(`/api/user/subscription?userId=${user.id}`, { cache: 'no-store' })
                .then(res => {
                    if (res.ok) return res.json();
                    return null;
                })
                .then(data => {
                    if (data && data.validUntil && new Date(data.validUntil) > new Date()) {
                        setIsMember(true);
                    } else {
                        setIsMember(false);
                        setMode('NORMAL'); // Reset mode if not member
                    }
                })
                .catch((e) => {
                    console.error("Subscription check failed", e);
                    setIsMember(false);
                    setMode('NORMAL');
                });
        } else {
            setIsMember(false);
            setMode('NORMAL');
        }
    }, [user]);

    // Offline Sync Logic
    useEffect(() => {
        const syncOfflineOrders = async () => {
            if (typeof window === 'undefined') return;

            const pendingStr = localStorage.getItem('pending_orders');
            if (!pendingStr) return;

            try {
                const pending = JSON.parse(pendingStr);
                if (!Array.isArray(pending) || pending.length === 0) return;



                const remaining = [];
                let syncedCount = 0;

                for (const order of pending) {
                    try {
                        const res = await fetch('/api/orders/create', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(order.payload)
                        });

                        if (res.ok) {
                            syncedCount++;
                        } else {
                            // If it failed (e.g. out of stock), we currently keep it locally
                            // In a real app, maybe flag it as 'Failed' for user to review
                            console.error("Failed to sync order", await res.text());
                            remaining.push(order);
                        }
                    } catch (e) {
                        remaining.push(order); // Network fail again
                    }
                }

                if (remaining.length !== pending.length) {
                    localStorage.setItem('pending_orders', JSON.stringify(remaining));
                    if (syncedCount > 0) {
                        alert(`Back Online: Synced ${syncedCount} orders successfully!`);

                        // Valid to use these because they are in scope
                        if (user && mode === 'SUBSCRIPTION') fetchSubscriptionData();
                        fetchMenu();
                    }
                }
            } catch (e) {
                console.error("Sync error", e);
            }
        };

        window.addEventListener('online', syncOfflineOrders);

        // Try once on mount if we think we are online
        if (typeof navigator !== 'undefined' && navigator.onLine) {
            syncOfflineOrders();
        }

        return () => window.removeEventListener('online', syncOfflineOrders);
    }, [user, mode]); // Add dependencies needed for fetch hooks if called

    const handleLogin = async (userData: { name: string; phone: string }, stayLoggedIn: boolean) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Login failed');
                return;
            }

            const fullUser = { ...userData, id: data.id, role: data.role };

            if (stayLoggedIn) {
                localStorage.setItem('cafe_user', JSON.stringify(fullUser));
            } else {
                sessionStorage.setItem('cafe_user', JSON.stringify(fullUser));
            }

            if (data.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else {
                setUser(fullUser);
                setShowLoginModal(false);
                setHasExplored(true);

                // Check subscription status immediately to decide on invitation
                try {
                    const subRes = await fetch(`/api/user/subscription?userId=${fullUser.id}`, { cache: 'no-store' });
                    // If 404, not a member. If 200, check validity.
                    let isSubscribed = false;
                    if (subRes.ok) {
                        const subData = await subRes.json();
                        if (subData && subData.validUntil && new Date(subData.validUntil) > new Date()) {
                            isSubscribed = true;
                        }
                    }

                    if (isSubscribed) {
                        setIsMember(true);
                        // Do NOT show invitation
                    } else {
                        setIsMember(false);
                        setMode('NORMAL');
                        // Show invitation only if NOT a member
                        setTimeout(() => setShowInvitation(true), 1000);
                    }
                } catch (e) {
                    // Fallback
                    setIsMember(false);
                    setTimeout(() => setShowInvitation(true), 1000);
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to login. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('cafe_user');
        sessionStorage.removeItem('cafe_user');
        setUser(null);
        setIsMember(false);
        setMode('NORMAL');
        setSubscriptionData(null);
        setFeedbackOrderId(null);

        // Return to landing page cleanly
        router.push('/');
        setHasExplored(false);
    };

    // Connect to Cart Context
    const { addToCart, decreaseQty, items } = useCart();

    // Calculate total items for badge
    const cartItemCount = items.reduce((sum, item) => sum + item.qty, 0);

    const handleAddToCart = (item: MenuItem) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        addToCart(item, mode);
        // User requested to NOT auto-open cart on mobile (Step Id: 83)
        // Only open if sidebar is visible (desktop) or let user explicitly open it
        // if (window.innerWidth < 768) setIsCartOpen(true); 

    };

    // Define styles here to ensure they are available
    const layoutStyles = (
        <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            
            .layout-content {
                display: flex;
                flex-direction: column;
                gap: 2rem;
                padding-bottom: 100px; /* Space for Bottom Nav */
            }
            
            @media (min-width: 768px) {
                .layout-content {
                    padding-bottom: 0;
                }
            }
            
            /* Sidebar Layout for Desktop */
            @media (min-width: 768px) {
                .layout-content.with-sidebar {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 400px;
                }
            }
        `}</style>
    );

    // LANDING PAGE VIEW
    if (!user && !hasExplored) {
        return (
            <>

                {layoutStyles}
                <LandingPage
                    onExplore={() => {
                        // Push query param for back button support
                        router.push('?mode=guest');
                        setHasExplored(true);
                    }}
                    onViewPlans={() => router.push('/subscription')}
                    onCategorySelect={(category) => {
                        setSelectedCategory(category);
                        router.push('?mode=guest'); // Also sync URL here
                        setHasExplored(true);
                    }}
                />
            </>
        );
    }

    // LOGIN MODAL (Rendered on top if open)
    if (showLoginModal && !user) {
        return (
            <>
                {layoutStyles}
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'white' }}>
                    <button
                        onClick={() => setShowLoginModal(false)}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10000, padding: '0.5rem', cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.5rem' }}
                    >
                        ×
                    </button>
                    <LoginPage onLogin={handleLogin} />
                </div>
            </>
        );
    }

    // MAIN DASHBOARD (GUEST OR AUTH)
    return (
        <main style={{ minHeight: '100vh', padding: '2rem', position: 'relative' }}>
            {layoutStyles}

            <SubscriptionInvitation
                isOpen={showInvitation}
                onClose={() => setShowInvitation(false)}
            />

            {user && (
                <FeedbackModal
                    isOpen={showFeedbackModal}
                    onClose={() => {
                        setShowFeedbackModal(false);
                    }}
                    onSubmit={handleFeedbackSubmit}
                />
            )}

            {/* Mobile Components */}
            <MobileHeader
                user={user}
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                onLoginClick={() => setShowLoginModal(true)}
                onProfileClick={() => user ? setShowProfileMenu(true) : setShowLoginModal(true)}
            />

            <MobileProfileMenu
                isOpen={showProfileMenu}
                onClose={() => setShowProfileMenu(false)}
                user={user}
                onLogout={handleLogout}
                onFeedback={() => setShowFeedbackModal(true)}
            />

            {/* Desktop Header Section (Hidden on Mobile) */}
            <header className="hidden md:flex" style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <div
                        onClick={() => {
                            router.push('/');
                            // Also manually reset state if needed, though useEffect should handle it
                            // but for faster feedback:
                            if (!user) setHasExplored(false);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Image
                            src="/logo.png"
                            alt="Cafe South Central"
                            width={250}
                            height={80}
                            style={{ marginBottom: '0.5rem', objectFit: 'contain', objectPosition: 'left' }}
                            priority
                        />
                    </div>
                    <p style={{ color: '#2F4F2F', fontWeight: 600 }}>
                        {user ? `Welcome, ${user.name}` : 'Welcome, Guest'}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div
                        onClick={toggleTheme}
                        style={{
                            width: '50px',
                            height: '24px',
                            backgroundColor: isDarkMode ? '#333' : '#e5e7eb',
                            borderRadius: '99px',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: '1px solid #ccc',
                            display: 'flex', alignItems: 'center'
                        }}
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            position: 'absolute',
                            left: isDarkMode ? '26px' : '2px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem'
                        }}>
                            {isDarkMode ? '🌙' : '☀️'}
                        </div>
                    </div>

                    {!user && (
                        <>
                            <button
                                onClick={() => router.push('/subscription')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    color: '#5C3A1A',
                                    fontWeight: 'bold',
                                    background: 'none',
                                    border: '1px solid #5C3A1A',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Membership Plans
                            </button>

                            <button
                                onClick={() => setShowLoginModal(true)}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    backgroundColor: '#5C3A1A',
                                    color: 'white',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Login
                            </button>
                        </>
                    )}

                    {user && isMember && <ModeToggle mode={mode} setMode={setMode} />}

                    {/* Cart Button (Only show if user is logged in OR allow showing 0 items) */}
                    {/* Strategy: Show it, but it will be empty for guest. Handled by cartItemCount=0 */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        style={{
                            position: 'relative',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#5C3A1A',
                            color: 'white',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 'bold',
                            opacity: user ? 1 : 0.5 // Dim if not user
                        }}
                    >
                        🛒 Cart
                        {cartItemCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                backgroundColor: 'red',
                                color: 'white',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '0.75rem'
                            }}>
                                {cartItemCount}
                            </span>
                        )}
                    </button>

                    {/* Options Dropdown - Only if User */}
                    {user && (
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button
                                    style={{
                                        padding: '0.5rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '0.5rem',
                                        background: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="1" />
                                        <circle cx="19" cy="12" r="1" />
                                        <circle cx="5" cy="12" r="1" />
                                    </svg>
                                </button>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    style={{
                                        backgroundColor: 'white',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                        minWidth: '160px',
                                        zIndex: 1000,
                                        marginRight: '1rem'
                                    }}
                                    sideOffset={5}
                                >
                                    <DropdownMenu.Item
                                        className="DropdownMenuItem"
                                        onSelect={() => router.push('/orders')}
                                        style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', outline: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
                                    >
                                        <span>📜</span> Order History
                                    </DropdownMenu.Item>

                                    <DropdownMenu.Item
                                        className="DropdownMenuItem"
                                        onSelect={() => router.push('/subscription')}
                                        style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', outline: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
                                    >
                                        <span>✨</span> Subscription Plans
                                    </DropdownMenu.Item>

                                    <div style={{ height: 1, backgroundColor: '#eee', margin: '0.5rem 0' }} />

                                    <DropdownMenu.Item
                                        className="DropdownMenuItem"
                                        onSelect={() => setShowFeedbackModal(true)}
                                        style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', outline: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
                                    >
                                        <span>⭐</span> Feedback
                                    </DropdownMenu.Item>

                                    <div style={{ height: 1, backgroundColor: '#eee', margin: '0.5rem 0' }} />

                                    <DropdownMenu.Item
                                        className="DropdownMenuItem"
                                        onSelect={handleLogout}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0.5rem',
                                            color: '#dc2626',
                                            cursor: 'pointer',
                                            borderRadius: '0.25rem',
                                            outline: 'none',
                                            gap: '0.5rem',
                                            fontWeight: 500
                                        }}
                                    >
                                        <span>🚪</span> Log out
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    )}
                </div>
            </header>

            {/* Dynamic Content Area Wrapper */}
            <div className={`layout-content ${cartItemCount > 0 ? 'with-sidebar' : ''}`}>
                <MenuGrid
                    menuItems={menuItems}
                    mode={mode}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    onAddToCart={handleAddToCart}
                    onDecreaseQty={(itemId) => decreaseQty(itemId, mode)}
                    cartItems={items}
                    mockMenu={MOCK_MENU}
                />

                {/* Sidebar Cart for Desktop (Visible when items exist) */}
                {cartItemCount > 0 && user && ( // Hide sidebar if guest (cart empty anyway)
                    <div className="desktop-sidebar">
                        <CartDrawer
                            isOpen={true}
                            onClose={() => { }}
                            user={user}
                            onOrderSuccess={() => {
                                fetchSubscriptionData();
                                fetchMenu();
                            }}
                            variant="sidebar"
                        />
                    </div>
                )}
            </div>

            {/* Cart Drawer Overlay (Mobile - now accessed via Bottom Nav or Sticky Bar) */}
            <div className="mobile-drawer-wrapper">
                <CartDrawer
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    user={user}
                    onOrderSuccess={() => {
                        fetchSubscriptionData();
                        fetchMenu();
                    }}
                    variant="drawer"
                />
            </div>

            <StickyCartSummary onViewCart={() => setIsCartOpen(true)} />

            <MobileBottomNav
                user={user}
                onCartClick={() => setIsCartOpen(true)}
                onProfileClick={() => user ? setShowProfileMenu(true) : setShowLoginModal(true)}
            />
            <style>{`
                /* Desktop Sidebar: Hidden by default (Mobile), Block on Desktop */
                .desktop-sidebar {
                    display: none;
                }

                /* Mobile Drawer Wrapper: Visible by default */
                .mobile-drawer-wrapper {
                    display: block;
                }

                @media (min-width: 768px) {
                    .desktop-sidebar {
                        display: block;
                    }
                }
            `}</style>
        </main >
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
