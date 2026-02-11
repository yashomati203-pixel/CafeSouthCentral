'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { MenuItem, MenuItemType } from '@/types/db';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMenu, CATEGORY_ORDER } from '@/hooks/useMenu';
import StickyCartSummary from '@/components/ordering/StickyCartSummary';
import DesktopHeader from '@/components/layout/DesktopHeader';
import dynamic from 'next/dynamic';
import { Plus, Minus, Search, ShoppingBag, User as UserIcon, Menu as MenuIcon, X, Check } from 'lucide-react';
import { DecorativeBorderLogo } from '@/components/ui/DecorativeBorder';

const LandingPage = dynamic(() => import('@/components/marketing/LandingPage'));
const CartDrawer = dynamic(() => import('@/components/ordering/CartDrawer'), { ssr: false });
const MobileHeader = dynamic(() => import('@/components/layout/MobileHeader'), { ssr: false });
const MobileBottomNav = dynamic(() => import('@/components/layout/MobileBottomNav'), { ssr: false });
const MobileProfileMenu = dynamic(() => import('@/components/layout/MobileProfileMenu'), { ssr: false });

const SubscriptionView = dynamic(() => import('@/components/subscription/SubscriptionView'), { ssr: false });
// Footer removed as it is not used in this file

const LoginPage = dynamic(() => import('@/components/auth/LoginPage'), { ssr: false });
const ModeToggle = dynamic(() => import('@/components/ui/ModeToggle'), { ssr: false });

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<{ id?: string; name: string; phone: string; role?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [subscriptionData, setSubscriptionData] = useState<any>(null);
    const [isMember, setIsMember] = useState(false);
    const [hasExplored, setHasExplored] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [mode, setMode] = useState<'NORMAL' | 'SUBSCRIPTION'>('NORMAL');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [showInvitation, setShowInvitation] = useState(false);

    // Feedback state removed
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'MENU' | 'SUBSCRIPTION'>('MENU');
    const [showCategorySelector, setShowCategorySelector] = useState(false);

    const { menuItems, isMenuLoading, fetchMenu, MOCK_MENU } = useMenu();
    const { addToCart, decreaseQty, items, openCart, subTotalCount, totalItemsCount } = useCart();

    // Fetch Sub Data
    const fetchSubscriptionData = async () => {
        if (!user?.id) return;
        try {
            const res = await fetch(`/api/user/subscription?userId=${user.id}`);
            if (res.ok) setSubscriptionData(await res.json());
        } catch (e) {
            console.error("Failed to fetch sub data", e);
        }
    };

    // Handle initial view mode from query param
    useEffect(() => {
        const view = searchParams.get('view');
        if (view === 'subscription') {
            setViewMode('SUBSCRIPTION');
            setHasExplored(true);
        }
    }, [searchParams]);



    // User Check
    useEffect(() => {
        const checkUser = () => {
            try {
                const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    if (['SUPER_ADMIN', 'MANAGER', 'KITCHEN_STAFF'].includes(parsedUser.role)) {
                        router.push('/admin/dashboard');
                        return;
                    }
                    setUser(parsedUser);
                    const hasVisited = sessionStorage.getItem('cafe_has_explored');
                    if (hasVisited === 'true') setHasExplored(true);
                } else {
                    // Only set explored if explicitly requested or guest mode
                    const mode = searchParams.get('mode');
                    const shouldLogin = searchParams.get('login');

                    if (mode === 'guest') {
                        setHasExplored(true);
                        sessionStorage.setItem('cafe_has_explored', 'true');
                    } else if (shouldLogin === 'true') {
                        // Don't set explored true immediately for login, let them login first? 
                        // Actually if they want to login, we show login modal. Background can be landing or dashboard? 
                        // Let's keep landing for login unless they've explored.
                        // But if they clicked "Login" from landing, they stay on landing with modal.
                        // If they came from somewhere else?
                        setHasExplored(false); // Force landing page background for login if not explored
                        setTimeout(() => setShowLoginModal(true), 500);
                    } else {
                        // Default: User not logged in, no specific mode -> Landing Page
                        const hasVisited = sessionStorage.getItem('cafe_has_explored');
                        if (hasVisited === 'true') {
                            setHasExplored(true);
                        } else {
                            setHasExplored(false);
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to parse user", e);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(checkUser, 100);
        return () => clearTimeout(timer);
    }, [router, searchParams]);

    // Subscription Check
    useEffect(() => {
        if (user && mode === 'SUBSCRIPTION') fetchSubscriptionData();
    }, [user, mode]);

    useEffect(() => {
        if (user?.id) {
            fetch(`/api/user/subscription?userId=${user.id}`, { cache: 'no-store' })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data?.validUntil && new Date(data.validUntil) > new Date()) setIsMember(true);
                    else { setIsMember(false); setMode('NORMAL'); }
                })
                .catch(() => { setIsMember(false); setMode('NORMAL'); });
        } else {
            setIsMember(false); setMode('NORMAL');
        }
    }, [user]);

    // Login Handler
    const handleLogin = async (userData: any, stayLoggedIn: boolean) => {
        try {
            let url = '/api/auth/verify-otp';
            let body = { ...userData };
            if (userData.password) {
                url = '/api/auth/admin/login';
                body = { identifier: userData.phone, password: userData.password };
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Login failed');
                return;
            }

            const fullUser = { ...userData, id: data.user?.id || data.userId, role: data.user?.role || data.role };
            if (stayLoggedIn) localStorage.setItem('cafe_user', JSON.stringify(fullUser));
            else sessionStorage.setItem('cafe_user', JSON.stringify(fullUser));

            if (['SUPER_ADMIN', 'MANAGER', 'KITCHEN_STAFF'].includes(fullUser.role)) {
                router.push('/admin/dashboard');
            } else {
                setUser(fullUser);
                setShowLoginModal(false);
                sessionStorage.setItem('cafe_has_explored', 'true');
                window.dispatchEvent(new Event('storage-update'));
                setHasExplored(true);
                // Sub check
                try {
                    const subRes = await fetch(`/api/user/subscription?userId=${fullUser.id}`);
                    if (subRes.ok) {
                        const subData = await subRes.json();
                        if (subData?.validUntil && new Date(subData.validUntil) > new Date()) setIsMember(true);
                        else { setIsMember(false); setMode('NORMAL'); }
                    } else { setIsMember(false); setMode('NORMAL'); }
                } catch (e) { /* ignore */ }
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to login.');
        }
    };

    const handleAddToCart = (item: MenuItem) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        addToCart(item, mode);
    };

    const handleScrollToCategory = (cat: string) => {
        setSelectedCategory(cat);
        setViewMode('MENU');

        // Scroll with retry logic
        const attemptScroll = (retries = 0) => {
            const elementId = cat.toLowerCase().replace(/\s+/g, '-');
            const element = document.getElementById(elementId);

            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (retries < 8) {
                setTimeout(() => attemptScroll(retries + 1), 200);
            }
        };

        setTimeout(() => attemptScroll(), 300);
    };

    // Auto-scroll when category changes from URL param
    useEffect(() => {
        if (hasExplored && selectedCategory && selectedCategory !== 'All' && viewMode === 'MENU') {
            const attemptScroll = (retries = 0) => {
                const elementId = selectedCategory.toLowerCase().replace(/\s+/g, '-');
                const element = document.getElementById(elementId);

                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (retries < 8) {
                    setTimeout(() => attemptScroll(retries + 1), 200);
                }
            };

            setTimeout(() => attemptScroll(), 500);
        }
    }, [hasExplored, selectedCategory, viewMode]);

    // Filter Items
    const activeMenu = menuItems.length > 0 ? menuItems : MOCK_MENU;
    const itemsByCategory = activeMenu.reduce((acc, item) => {
        const matchesSearch = searchQuery === '' ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const isAvailableInSub = item.type === 'SUBSCRIPTION' || item.type === 'BOTH';
        const matchesMode = mode === 'NORMAL' || isAvailableInSub;
        const isActiveItem = item.isAvailable !== false;

        if (matchesSearch && matchesMode && isActiveItem) {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
        }
        return acc;
    }, {} as Record<string, MenuItem[]>);

    const getCartItem = (itemId: string) => items.find(i => i.id === itemId && (mode === 'NORMAL' ? i.type === MenuItemType.NORMAL : i.type === MenuItemType.SUBSCRIPTION));

    // FOOD IMAGES MAPPING (Fallback)
    const FOOD_IMAGES: Record<string, string> = {
        'dosa': 'https://images.unsplash.com/photo-1668236543090-d2f896b0101d?q=80&w=800&auto=format&fit=crop',
        'idli': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
        'coffee': 'https://images.unsplash.com/photo-1596933580749-0d3381a8f602?q=80&w=800&auto=format&fit=crop',
        'tea': 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=800&auto=format&fit=crop',
        'rice': 'https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=800&auto=format&fit=crop',
        'meals': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800&auto=format&fit=crop',
        'vada': 'https://images.unsplash.com/photo-1630409351241-e90e7f5e4785?q=80&w=800&auto=format&fit=crop',
        'pongal': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800&auto=format&fit=crop',
        'biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
        'sweet': 'https://images.unsplash.com/photo-1569584627042-49d8c3639d67?q=80&w=800&auto=format&fit=crop',
        'default': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop'
    };

    function getFoodImage(name: string): string {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('dosa') || lowerName.includes('roast')) return FOOD_IMAGES.dosa;
        if (lowerName.includes('idli')) return FOOD_IMAGES.idli;
        if (lowerName.includes('coffee')) return FOOD_IMAGES.coffee;
        if (lowerName.includes('tea') || lowerName.includes('chai')) return FOOD_IMAGES.tea;
        if (lowerName.includes('rice') || lowerName.includes('bath') || lowerName.includes('pulao')) return FOOD_IMAGES.rice;
        if (lowerName.includes('thali') || lowerName.includes('meal')) return FOOD_IMAGES.meals;
        if (lowerName.includes('vada') || lowerName.includes('vadai')) return FOOD_IMAGES.vada;
        if (lowerName.includes('pongal')) return FOOD_IMAGES.pongal;
        if (lowerName.includes('biryani')) return FOOD_IMAGES.biryani;
        if (lowerName.includes('mysore pak') || lowerName.includes('halwa')) return FOOD_IMAGES.sweet;
        return FOOD_IMAGES.default;
    }

    if (showLoginModal && !user) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-300">
                <button
                    onClick={() => setShowLoginModal(false)}
                    className="absolute top-6 right-6 z-[110] p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all text-white backdrop-blur-md border border-white/20 shadow-lg"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="w-full max-w-sm relative z-10">
                    <LoginPage onLogin={handleLogin} />
                </div>
            </div>
        );
    }

    if (!hasExplored) {
        return (
            <LandingPage
                onExplore={() => {
                    setHasExplored(true);
                    sessionStorage.setItem('cafe_has_explored', 'true');
                    window.dispatchEvent(new Event('storage-update'));
                    router.push('?mode=guest');
                }}
                onViewPlans={() => router.push('/subscription')}
                onCategorySelect={(c) => {
                    setHasExplored(true);
                    sessionStorage.setItem('cafe_has_explored', 'true');
                    window.dispatchEvent(new Event('storage-update'));
                    // Include category in URL for reliable navigation
                    router.push(`?mode=guest&category=${encodeURIComponent(c)}`);
                }}
                onLogin={() => setShowLoginModal(true)}
                user={user}
            />
        );
    }

    const availableCategories = CATEGORY_ORDER.filter(c => itemsByCategory[c]?.length > 0);

    return (
        <div className="bg-[#e2e9e0] text-[#0e1b12] min-h-screen font-sans">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');
                .font-serif-heading { font-family: "Playfair Display", serif; }
                .font-sans { font-family: "Work Sans", sans-serif; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>





            {/* MAIN CONTENT */}
            <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-8 lg:px-12 bg-[#e2e9e0]">
                {viewMode === 'SUBSCRIPTION' ? (
                    <SubscriptionView />
                ) : (
                    <>


                        <div className="mb-12 flex flex-col items-center text-center">
                            <h1 className="font-serif-heading text-4xl font-black text-[#0e1b12] lg:text-6xl mb-4">Our Full Menu</h1>
                            <p className="max-w-xl text-[#4e9767] text-lg">Experience the finest South Indian flavors, prepared fresh with traditional techniques and local ingredients.</p>

                            <div className="mt-6 flex gap-4 text-xs font-bold uppercase tracking-wider text-[#0e1b12]">
                                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#166534]"></span> 100% Fresh</span>
                                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#DAA520]"></span> Authentic Recipes</span>
                                {isMember && <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-purple-500"></span> Member Pricing</span>}
                            </div>

                            <div className="relative mt-8 lg:hidden w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4e9767] w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Find a dish..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-full border border-[#e7f3eb] bg-white py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-[#166534] outline-none"
                                />
                            </div>
                        </div>

                        {/* CATEGORY NAV */}
                        <div className="sticky top-[86px] z-40 mb-12 -mx-6 px-6 py-2 bg-[#e2e9e0]/95 border-b border-[#3C2A21]/10 backdrop-blur-sm">
                            <div className="flex items-center gap-2 md:gap-4 overflow-x-auto py-4 no-scrollbar scroll-smooth">
                                <button
                                    onClick={() => { setSelectedCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className={`flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-sm
                                        ${selectedCategory === 'All' ? 'bg-[#0e1b12] text-white shadow-md transform scale-105' : 'bg-white text-[#4e9767] border border-[#e7f3eb] hover:border-[#166534] hover:text-[#166534]'}`}
                                >
                                    All
                                </button>
                                {availableCategories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => handleScrollToCategory(cat)}
                                        className={`flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-sm
                                            ${selectedCategory === cat ? 'bg-[#0e1b12] text-white shadow-md transform scale-105' : 'bg-white text-[#4e9767] border border-[#e7f3eb] hover:border-[#166534] hover:text-[#166534]'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* MENU GRID */}
                        <div className="space-y-24 pb-40">
                            {availableCategories.map(category => (
                                <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-32">
                                    <div className="flex items-center gap-6 mb-12">
                                        <h2 className="font-serif-heading text-3xl md:text-4xl font-black text-[#0e1b12] tracking-tight">{category}</h2>
                                        <div className="h-[1px] flex-1 bg-[#3C2A21]/10"></div>
                                        <span className="material-symbols-outlined text-[#166534] text-3xl">🌱</span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                        {itemsByCategory[category].map(item => {
                                            const cartItem = getCartItem(item.id);
                                            const imgUrl = item.imageUrl || getFoodImage(item.name);

                                            return (
                                                <div key={item.id} className="group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white border border-[#e7f3eb] overflow-hidden rounded-3xl p-4 flex flex-col h-full">
                                                    <div className="relative mb-5 flex-shrink-0">
                                                        <div className="w-full h-48 rounded-2xl overflow-hidden bg-[#f0f5f1]">
                                                            <img src={imgUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                        </div>
                                                        {item.stock === 0 && <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">SOLD OUT</div>}
                                                    </div>

                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-serif-heading font-bold text-[#0e1b12] text-xl leading-tight pr-2">{item.name}</h4>
                                                        <p className="font-black text-[#166534] text-lg whitespace-nowrap">₹{item.price}</p>
                                                    </div>

                                                    <p className="text-sm text-[#4e9767] mb-6 leading-relaxed line-clamp-2 flex-grow">{item.description}</p>

                                                    <div className="mt-auto">
                                                        {cartItem ? (
                                                            <div className="flex items-center justify-between bg-[#f8fbf7] rounded-xl p-1 border border-[#e7f3eb]">
                                                                <button onClick={() => decreaseQty(item.id, mode)} className="w-10 h-10 flex items-center justify-center bg-[#0e1b12] text-white rounded-lg hover:bg-[#166534] transition-colors"><Minus className="w-4 h-4" /></button>
                                                                <span className="font-bold text-[#0e1b12] px-4">{cartItem.qty}</span>
                                                                <button onClick={() => addToCart(item, mode)} className="w-10 h-10 flex items-center justify-center bg-[#0e1b12] text-white rounded-lg hover:bg-[#166534] transition-colors"><Plus className="w-4 h-4" /></button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleAddToCart(item)}
                                                                disabled={item.stock === 0}
                                                                className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm group
                                                                    ${item.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#0e1b12] text-white hover:bg-[#166534] hover:shadow-lg'}`}
                                                            >
                                                                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> {item.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            ))}
                        </div>

                        {/* Floating Category Selector - Mobile Only */}
                        {viewMode === 'MENU' && (
                            <>
                                {/* Floating Button */}
                                <button
                                    onClick={() => setShowCategorySelector(true)}
                                    className="md:hidden fixed bottom-20 right-4 z-30 bg-[#0e1b12] text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm"
                                >
                                    <span>📂</span>
                                    <span>{selectedCategory === 'All' ? 'All Items' : selectedCategory}</span>
                                </button>

                                {/* Category Selector Modal */}
                                {showCategorySelector && (
                                    <div
                                        className="md:hidden fixed inset-0 bg-black/50 z-50 flex items-end"
                                        onClick={() => setShowCategorySelector(false)}
                                    >
                                        <div
                                            className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-xl font-bold text-[#0e1b12]">Select Category</h3>
                                                <button
                                                    onClick={() => setShowCategorySelector(false)}
                                                    className="p-2 hover:bg-gray-100 rounded-full"
                                                >
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCategory('All');
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        setShowCategorySelector(false);
                                                    }}
                                                    className={`p-4 rounded-xl text-sm font-bold transition-all ${selectedCategory === 'All'
                                                        ? 'bg-[#0e1b12] text-white'
                                                        : 'bg-[#f0f5f1] text-[#4e9767] hover:bg-[#e7f3eb]'
                                                        }`}
                                                >
                                                    All Items
                                                </button>
                                                {availableCategories.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => {
                                                            handleScrollToCategory(cat);
                                                            setShowCategorySelector(false);
                                                        }}
                                                        className={`p-4 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat
                                                            ? 'bg-[#0e1b12] text-white'
                                                            : 'bg-[#f0f5f1] text-[#4e9767] hover:bg-[#e7f3eb]'
                                                            }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </main>



            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} user={user} onOrderSuccess={() => { fetchSubscriptionData(); fetchMenu(); }} variant="drawer" />

        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
