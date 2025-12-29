// Force rebuild
'use client';

import { useState, useEffect, Suspense } from 'react';
import ModeToggle from '@/components/ui/ModeToggle';
import SubscriptionSummary from '@/components/dashboard/SubscriptionSummary';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/ordering/CartDrawer';
import { MenuItem, MenuItemType } from '@/types/db';
import LoginPage from '@/components/auth/LoginPage';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import SubscriptionInvitation from '@/components/marketing/SubscriptionInvitation';
import LandingPage from '@/components/marketing/LandingPage';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock Data for Display
const MOCK_MENU: MenuItem[] = [
    // South Indian Tiffins
    { id: '1', name: 'Idli', description: 'Steamed rice cakes (2 pcs)', price: 49, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '2', name: 'Ghee Podi Idli', description: 'Idli tossed in spicy podi & ghee', price: 69, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '3', name: 'Thatte Idli', description: 'Large flat idli', price: 49, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '4', name: 'Idli Sambar', description: 'Idli dipped in sambar', price: 59, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '5', name: 'Sambar Vada', description: 'Lentil donuts in sambar', price: 59, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '6', name: 'Upma', description: 'Savory semolina porridge', price: 59, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 30, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '7', name: 'Mysore Bonda', description: 'Fried flour dumplings', price: 49, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },

    // Dosa
    { id: '8', name: 'Plain Dosa', description: 'Crispy savory crepe', price: 59, type: MenuItemType.BOTH, category: 'Dosa', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '9', name: 'Masala Dosa', description: 'Dosa with potato filling', price: 69, type: MenuItemType.BOTH, category: 'Dosa', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '10', name: 'Paneer Dosa', description: 'Dosa with spiced paneer', price: 109, type: MenuItemType.NORMAL, category: 'Dosa', isVeg: true, isAvailable: true, inventoryCount: 30, isDoubleAllowed: false, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '11', name: 'Set Dosa', description: 'Soft spongy dosas (set of 2)', price: 99, type: MenuItemType.BOTH, category: 'Dosa', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },

    // Rice
    { id: '12', name: 'Lemon Rice', description: 'Tangy lemon flavored rice', price: 69, type: MenuItemType.BOTH, category: 'Rice', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '13', name: 'Curd Rice', description: 'Rice with yogurt and tempering', price: 59, type: MenuItemType.BOTH, category: 'Rice', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '14', name: 'Veg Biryani', description: 'Served with Mirchi Ka Salan', price: 129, type: MenuItemType.NORMAL, category: 'Rice', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: false, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },

    // North Indian
    { id: '15', name: 'Aloo Paratha', description: 'Stuffed potato flatbread', price: 59, type: MenuItemType.BOTH, category: 'North Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '16', name: 'Chole Bhature', description: 'Fried bread with chickpea curry', price: 149, type: MenuItemType.NORMAL, category: 'North Indian', isVeg: true, isAvailable: true, inventoryCount: 30, isDoubleAllowed: false, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '17', name: 'Puri Bhaji', description: 'Fried bread with potato curry', price: 99, type: MenuItemType.BOTH, category: 'North Indian', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },

    // Snacks
    { id: '18', name: 'Mirchi Bajji', description: 'Stuffed chilli fritters', price: 49, type: MenuItemType.BOTH, category: 'Snacks', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '19', name: 'Punugulu', description: 'Deep fried rice batter balls', price: 49, type: MenuItemType.BOTH, category: 'Snacks', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },

    // Beverages
    { id: '20', name: 'Filter Coffee', description: 'Classic South Indian coffee', price: 29, type: MenuItemType.BOTH, category: 'Beverages', isVeg: true, isAvailable: true, inventoryCount: 100, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '21', name: 'Tea', description: 'Masala Chai', price: 19, type: MenuItemType.BOTH, category: 'Beverages', isVeg: true, isAvailable: true, inventoryCount: 100, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '22', name: 'Lassi', description: 'Sweet yogurt drink', price: 59, type: MenuItemType.BOTH, category: 'Beverages', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },

    // Chaat
    { id: '23', name: 'Pani Puri', description: 'Hollow balls with spicy water', price: 20, type: MenuItemType.BOTH, category: 'Chaat', isVeg: true, isAvailable: true, inventoryCount: 100, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '24', name: 'Dahi Puri', description: 'Puri filled with yogurt', price: 30, type: MenuItemType.BOTH, category: 'Chaat', isVeg: true, isAvailable: true, inventoryCount: 50, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },

    // Desserts
    { id: '25', name: 'Gulab Jamun', description: 'Sweet syrup dumplings', price: 59, type: MenuItemType.NORMAL, category: 'Dessert', isVeg: true, isAvailable: true, inventoryCount: 40, isDoubleAllowed: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '26', name: 'Waffles', description: 'Freshly baked waffles', price: 120, type: MenuItemType.NORMAL, category: 'Dessert', isVeg: true, isAvailable: true, inventoryCount: 20, isDoubleAllowed: false, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' }
];

const CATEGORY_ORDER = ['South Indian', 'Dosa', 'Rice', 'North Indian', 'Snacks', 'Beverages', 'Chaat', 'Dessert'];

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

    // Feature Loop: Smart Inventory
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isMenuLoading, setIsMenuLoading] = useState(true);

    const fetchMenu = async () => {
        try {
            const res = await fetch('/api/menu');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setMenuItems(data);
                    // Cache the fresh menu for offline use
                    localStorage.setItem('menu_cache', JSON.stringify(data));
                } else {
                    setMenuItems(MOCK_MENU);
                }
            }
        } catch (e) {
            console.error("Failed to fetch menu, checking cache...", e);
            // On failure (offline), try to load from cache
            const cached = localStorage.getItem('menu_cache');
            if (cached) {
                try {
                    setMenuItems(JSON.parse(cached));
                    console.log("Loaded menu from offline cache");
                } catch (parseError) {
                    setMenuItems(MOCK_MENU);
                }
            } else {
                setMenuItems(MOCK_MENU);
            }
        } finally {
            setIsMenuLoading(false);
        }
    };

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

    // Initial Data Fetch
    useEffect(() => {
        // Optimistic UI: Load from cache immediately if available
        const cached = localStorage.getItem('menu_cache');
        if (cached) {
            try {
                setMenuItems(JSON.parse(cached));
                // We don't set loading false here, we let the network request finish
                // so we can update stock levels if online.
            } catch (e) { /* Ignore cache errors */ }
        }

        fetchMenu();
    }, []);

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

                console.log(`Attempting to sync ${pending.length} offline orders...`);

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
                // Trigger Invitation if NOT Admin. Logic for "already member" handled by component or subsequent checks
                // but better to show it. The user can dismiss.
                setTimeout(() => setShowInvitation(true), 1000);
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
        setSubscriptionData(null);

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
        // Auto-open drawer on mobile/tablet (if sidebar is likely hidden)
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsCartOpen(true);
        }
    };

    // Define styles here to ensure they are available
    const layoutStyles = (
        <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            
            .layout-content {
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }
            
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

            {/* Header Section */}
            <header style={{
                display: 'flex',
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
                        <img
                            src="/logo.png"
                            alt="Cafe South Central"
                            style={{ width: '250px', height: '80px', marginBottom: '0.5rem', objectFit: 'contain', objectPosition: 'left' }}
                        />
                    </div>
                    <p style={{ color: '#2F4F2F', fontWeight: 600 }}>
                        {user ? `Welcome, ${user.name}` : 'Welcome, Guest'}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>

                    {!user && (
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
                    )}

                    {isMember && <ModeToggle mode={mode} setMode={setMode} />}

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
                {/* Main Menu Section */}<section style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '1rem',
                    padding: '2rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                            {mode === 'NORMAL' ? '🍔 Normal Menu' : '🥗 Subscription Plan'}
                        </h2>
                    </div>

                    <p style={{ color: '#666', marginBottom: '2rem' }}>
                        {mode === 'NORMAL'
                            ? 'Order anything from our wide range of delicacies. Pay per order.'
                            : 'Select items for your daily meal quota. No payment required at checkout.'}
                    </p>

                    {/* Category Filter Pills */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        overflowX: 'auto',
                        paddingBottom: '1rem',
                        marginBottom: '1rem',
                        scrollbarWidth: 'none'
                    }}>
                        {['All', ...CATEGORY_ORDER.filter(c => MOCK_MENU.some(i => i.category === c))].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '999px',
                                    border: 'none',
                                    backgroundColor: selectedCategory === cat ? '#5C3A1A' : '#EEE',
                                    color: selectedCategory === cat ? 'white' : '#666',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Grouped Menu Sections */}
                    {Object.entries(
                        (menuItems.length > 0 ? menuItems : MOCK_MENU).reduce((acc, item) => {
                            // Filter Logic
                            const isAvailableInSub = item.type === 'SUBSCRIPTION' || item.type === 'BOTH';
                            if (mode === 'SUBSCRIPTION' && !isAvailableInSub) return acc;

                            // Category Filter Logic
                            if (selectedCategory !== 'All' && item.category !== selectedCategory) return acc;

                            if (!acc[item.category]) acc[item.category] = [];
                            acc[item.category].push(item);
                            return acc;
                        }, {} as Record<string, MenuItem[]>)
                    ).sort((a, b) => {
                        const indexA = CATEGORY_ORDER.indexOf(a[0]);
                        const indexB = CATEGORY_ORDER.indexOf(b[0]);
                        const safeIndexA = indexA === -1 ? 999 : indexA;
                        const safeIndexB = indexB === -1 ? 999 : indexB;
                        return safeIndexA - safeIndexB;
                    })
                        .map(([category, categoryItems]) => (
                            <div key={category} style={{ marginBottom: '2rem' }}>
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    marginBottom: '1rem',
                                    color: '#5C3A1A',
                                    borderBottom: '2px solid #EEE',
                                    paddingBottom: '0.5rem'
                                }}>
                                    {category}
                                </h3>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                    gap: '1.5rem'
                                }}>
                                    {categoryItems.map((item) => (
                                        <div key={item.id} style={{
                                            border: '1px solid #eee',
                                            borderRadius: '0.5rem',
                                            padding: '1rem',
                                            backgroundColor: mode === 'SUBSCRIPTION' ? '#f0fdf4' : 'white',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            opacity: item.inventoryCount === 0 ? 0.6 : 1,
                                        }}>
                                            <div>
                                                <div style={{
                                                    height: '150px',
                                                    backgroundColor: '#eee',
                                                    borderRadius: '0.25rem',
                                                    marginBottom: '1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#aaa'
                                                }}>
                                                    [Image: {item.name}]
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                    <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.name}</h3>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                                        <span style={{
                                                            fontSize: '0.75rem',
                                                            padding: '2px 6px',
                                                            border: item.isVeg ? '1px solid green' : '1px solid red',
                                                            color: item.isVeg ? 'green' : 'red',
                                                            borderRadius: '4px'
                                                        }}>
                                                            {item.isVeg ? 'VEG' : 'NON-VEG'}
                                                        </span>
                                                        {item.inventoryCount === 0 ? (
                                                            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'red', border: '1px solid red', padding: '1px 4px', borderRadius: '4px' }}>
                                                                SOLD OUT
                                                            </span>
                                                        ) : item.inventoryCount <= 5 ? (
                                                            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'white', backgroundColor: '#ef4444', padding: '2px 6px', borderRadius: '99px' }}>
                                                                Running Out!
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                                                    {item.description}
                                                </p>
                                            </div>

                                            <div style={{ marginTop: '1rem' }}>
                                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#5C3A1A' }}>
                                                    {mode === 'NORMAL' ? `₹ ${item.price}` : 'Included in Plan'}
                                                </p>
                                                {(() => {
                                                    const cartItem = items.find(i =>
                                                        i.id === item.id &&
                                                        (mode === 'NORMAL' ? i.type === MenuItemType.NORMAL : i.type === MenuItemType.SUBSCRIPTION)
                                                    );

                                                    if (cartItem) {
                                                        return (
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                backgroundColor: '#f3f4f6',
                                                                borderRadius: '0.5rem',
                                                                padding: '0.25rem'
                                                            }}>
                                                                <button
                                                                    onClick={() => decreaseQty(item.id, mode)}
                                                                    style={{
                                                                        width: '32px',
                                                                        height: '32px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        border: 'none',
                                                                        backgroundColor: '#5C3A1A',
                                                                        color: 'white',
                                                                        borderRadius: '0.25rem',
                                                                        cursor: 'pointer',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                >
                                                                    -
                                                                </button>
                                                                <span style={{ fontWeight: 'bold' }}>{cartItem.qty}</span>
                                                                <button
                                                                    onClick={() => handleAddToCart(item)}
                                                                    style={{
                                                                        width: '32px',
                                                                        height: '32px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        border: 'none',
                                                                        backgroundColor: '#5C3A1A',
                                                                        color: 'white',
                                                                        borderRadius: '0.25rem',
                                                                        cursor: 'pointer',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <button
                                                            onClick={() => handleAddToCart(item)}
                                                            disabled={item.inventoryCount === 0}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.75rem',
                                                                backgroundColor: item.inventoryCount === 0 ? '#ccc' : '#5C3A1A',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '0.5rem',
                                                                cursor: item.inventoryCount === 0 ? 'not-allowed' : 'pointer',
                                                                fontWeight: 600,
                                                                transition: 'opacity 0.2s'
                                                            }}
                                                            onMouseOver={(e) => { if (item.inventoryCount > 0) e.currentTarget.style.opacity = '0.9'; }}
                                                            onMouseOut={(e) => { if (item.inventoryCount > 0) e.currentTarget.style.opacity = '1'; }}
                                                        >
                                                            {item.inventoryCount === 0 ? 'Sold Out' : (
                                                                // Change button text for Guest? Or keep "Add to Cart" and it prompts login.
                                                                // User requested "Add to Cart" prompts login.
                                                                'Add to Cart'
                                                            )}
                                                        </button>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                </section>

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

            {/* Cart Drawer Overlay (Mobile) */}
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
