// Force rebuild
'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
// import ModeToggle from '@/components/ui/ModeToggle';
// import SubscriptionSummary from '@/components/dashboard/SubscriptionSummary';
import { useCart } from '@/context/CartContext';
// import CartDrawer from '@/components/ordering/CartDrawer';
import { MenuItem, MenuItemType } from '@/types/db';
// import LoginPage from '@/components/auth/LoginPage';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
// import SubscriptionInvitation from '@/components/marketing/SubscriptionInvitation';
// import LandingPage from '@/components/marketing/LandingPage';
// import FeedbackModal from '@/components/feedback/FeedbackModal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMenu } from '@/hooks/useMenu';
// import MenuGrid from '@/components/dashboard/MenuGrid';
// import MobileHeader from '@/components/layout/MobileHeader';
// import MobileBottomNav from '@/components/layout/MobileBottomNav';
import StickyCartSummary from '@/components/ordering/StickyCartSummary';
// import MobileProfileMenu from '@/components/layout/MobileProfileMenu';
import StaggeredMenu from '@/components/ui/StaggeredMenu';
import DesktopHeader from '@/components/layout/DesktopHeader';
import dynamic from 'next/dynamic';

const LandingPage = dynamic(() => import('@/components/marketing/LandingPage'), { ssr: false });
const MenuGrid = dynamic(() => import('@/components/dashboard/MenuGrid'), { ssr: false });
const CartDrawer = dynamic(() => import('@/components/ordering/CartDrawer'), { ssr: false });
const MobileHeader = dynamic(() => import('@/components/layout/MobileHeader'), { ssr: false });
const MobileBottomNav = dynamic(() => import('@/components/layout/MobileBottomNav'), { ssr: false });
const MobileProfileMenu = dynamic(() => import('@/components/layout/MobileProfileMenu'), { ssr: false });
const FeedbackModal = dynamic(() => import('@/components/feedback/FeedbackModal'), { ssr: false });
const SubscriptionInvitation = dynamic(() => import('@/components/marketing/SubscriptionInvitation'), { ssr: false });
const LoginPage = dynamic(() => import('@/components/auth/LoginPage'), { ssr: false });
const ModeToggle = dynamic(() => import('@/components/ui/ModeToggle'), { ssr: false });

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
                    // Check if user has previously explored (don't auto-skip landing page)
                    const hasVisited = sessionStorage.getItem('cafe_has_explored');
                    if (hasVisited === 'true') {
                        setHasExplored(true);
                    }
                } else {
                    // No user, check URL params for guest mode
                    const mode = searchParams.get('mode');
                    const shouldLogin = searchParams.get('login');

                    if (mode === 'guest') {
                        setHasExplored(true);
                    } else {
                        setHasExplored(false);
                    }

                    // If login parameter is present, show login modal
                    if (shouldLogin === 'true') {
                        setHasExplored(true); // Show the main page
                        setTimeout(() => setShowLoginModal(true), 500);
                    }
                }

                // If feedback parameter is present, show feedback modal (works for both logged-in and guest users)
                const shouldShowFeedback = searchParams.get('feedback');
                if (shouldShowFeedback === 'true') {
                    setHasExplored(true); // Show the main page
                    setTimeout(() => setShowFeedbackModal(true), 500);
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

            const fullUser = { ...userData, id: data.user.id, role: data.user.role };

            if (stayLoggedIn) {
                localStorage.setItem('cafe_user', JSON.stringify(fullUser));
            } else {
                sessionStorage.setItem('cafe_user', JSON.stringify(fullUser));
            }

            if (data.user.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else {
                setUser(fullUser);
                setShowLoginModal(false);
                sessionStorage.setItem('cafe_has_explored', 'true');
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

    // LANDING PAGE VIEW - Show for all users until they explore
    if (!hasExplored) {
        return (
            <>

                {layoutStyles}
                <LandingPage
                    onExplore={() => {
                        // Mark as explored in session
                        sessionStorage.setItem('cafe_has_explored', 'true');
                        // Push query param for back button support
                        router.push('?mode=guest');
                        setHasExplored(true);
                    }}
                    onViewPlans={() => router.push('/subscription')}
                    onCategorySelect={(category) => {
                        setSelectedCategory(category);
                        sessionStorage.setItem('cafe_has_explored', 'true');
                        router.push('?mode=guest'); // Also sync URL here
                        setHasExplored(true);
                    }}
                    onLogin={() => setShowLoginModal(true)}
                    user={user}
                />
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
                display: 'grid',
                gridTemplateColumns: isMember ? '1fr auto auto' : '1fr auto',
                alignItems: 'center',
                padding: '1rem 2rem',
                borderBottom: '1px solid #e5e7eb',
                position: 'sticky',
                top: 0,
                backgroundColor: '#e2e9e0',
                zIndex: 50,
                gap: '2rem'
            }}>
                {/* Left: Logo */}
                <div>
                    <div
                        onClick={() => {
                            sessionStorage.removeItem('cafe_has_explored');
                            router.push('/');
                            setHasExplored(false);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Image
                            src="/Final web logo.png"
                            alt="Cafe South Central"
                            width={200}
                            height={60}
                            style={{ objectFit: 'contain', objectPosition: 'left' }}
                            priority
                        />
                    </div>
                </div>

                {/* Center: Mode Toggle (Only for Members) */}
                {isMember && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <ModeToggle mode={mode} setMode={setMode} />
                    </div>
                )}

                {/* Right: Navigation Links + Cart + Profile */}
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {/* Navigation Links */}
                    <button
                        onClick={() => {
                            // Scroll to menu or stay on current page
                            const menuSection = document.getElementById('menu-section');
                            if (menuSection) {
                                menuSection.scrollIntoView({ behavior: 'smooth' });
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
                        onClick={() => user ? setIsCartOpen(true) : setShowLoginModal(true)}
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
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button
                                onClick={() => router.push('/account')}
                                style={{
                                    height: '36px',
                                    padding: '0 1rem',
                                    borderRadius: '999px',
                                    backgroundColor: '#5C3A1A',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold'
                                }}
                                title="Profile"
                            >
                                {user.name || 'User'}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowLoginModal(true)}
                            style={{
                                backgroundColor: '#3C2A21',
                                color: '#FFF8F0',
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
