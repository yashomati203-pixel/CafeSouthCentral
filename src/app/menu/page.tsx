'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { MenuItem, MenuItemType } from '@/types/db';
import { useRouter } from 'next/navigation';
import { useMenu, CATEGORY_ORDER } from '@/hooks/useMenu';
import { Plus, Minus, Search, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import MenuHeroCarousel from '@/components/menu/MenuHeroCarousel';
import ReadyToEatModal from '@/components/menu/ReadyToEatModal';
const LoginPage = dynamic(() => import('@/components/auth/LoginPage'), { ssr: false });

export default function MenuPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ id?: string; name: string; phone: string; role?: string } | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCategorySelector, setShowCategorySelector] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isRTEModalOpen, setIsRTEModalOpen] = useState(false);
    const [mode] = useState<'NORMAL' | 'SUBSCRIPTION'>('NORMAL');

    const { menuItems, isMenuLoading, MOCK_MENU } = useMenu();
    const { addToCart, decreaseQty, items } = useCart();

    useEffect(() => {
        const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse user', e);
            }
        }
    }, []);

    const handleLogin = async (userData: any, stayLoggedIn: boolean) => {
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
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
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to login.');
        }
    };

    const handleAddToCart = (item: MenuItem | string) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        // If passing a string ID (from the carousel combo for instance)
        if (typeof item === 'string') {
            // Let's find the combo or handle combo logic.
            // For now, if combo-dosa-coffee isn't found, find a Dosa instead, or alert
            const found = activeMenu.find(m => m.id === item || m.name.toLowerCase().includes('dosa'));
            if (found) addToCart(found, mode);
            else console.warn("Combo item not found in mock/db data", item);
        } else {
            // Normal Item flow
            addToCart(item, mode);
        }
    };

    const handleScrollToCategory = (cat: string) => {
        setSelectedCategory(cat);
        const elementId = cat.toLowerCase().replace(/\s+/g, '-');
        const element = document.getElementById(elementId);
        if (element) {
            // Use scrollIntoView which respects scroll-margin-top
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Filter Items
    const activeMenu = menuItems.length > 0 ? menuItems : MOCK_MENU;
    const itemsByCategory = activeMenu.reduce((acc, item) => {
        const matchesSearch = searchQuery === '' ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const isActiveItem = item.isAvailable !== false;

        if (matchesSearch && isActiveItem) {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item);
        }
        return acc;
    }, {} as Record<string, MenuItem[]>);

    const getCartItem = (itemId: string) => items.find(i => i.id === itemId && i.type === MenuItemType.NORMAL);

    // Food Images Mapping
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

    const availableCategories = CATEGORY_ORDER.filter(c => itemsByCategory[c]?.length > 0);

    // Get specific "Ready to Eat" items for the Modal
    const readyToEatKeywords = ['idli', 'vada', 'rice', 'bonda'];
    const readyToEatItems = activeMenu.filter(item =>
        readyToEatKeywords.some(keyword => item.name.toLowerCase().includes(keyword)) && item.isAvailable !== false
    ).slice(0, 10); // Limit items for the modal

    if (showLoginModal && !user) {
        return (
            <div className="fixed inset-0 z-[250] bg-black/40 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-300">
                <button
                    onClick={() => setShowLoginModal(false)}
                    className="absolute top-6 right-6 z-[260] p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all text-white backdrop-blur-md border border-white/20 shadow-lg cursor-pointer pointer-events-auto"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="w-full max-w-sm relative z-[255] pointer-events-auto">
                    <LoginPage onLogin={handleLogin} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans text-white">
            <style jsx global>{`
                .font-serif-heading { font-family: "Playfair Display", serif; }
                .font-sans { font-family: "Work Sans", sans-serif; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* MAIN CONTENT */}
            <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 pt-4 lg:pt-8 pb-8 lg:px-12 bg-transparent text-white">
                {/* Mobile Search Bar (Above Banner) */}
                <div className="md:hidden w-full mb-4 px-2">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Find a dish..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-full border border-[#14b84b]/30 bg-[#e8f5e9]/80 backdrop-blur-md py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-[#14b84b] focus:border-[#14b84b] outline-none shadow-sm text-[#0e2a1a] placeholder-gray-500 font-medium"
                        />
                    </div>
                </div>

                {/* HERO CAROUSEL */}
                <MenuHeroCarousel
                    onAddToCart={handleAddToCart}
                    onScrollToCategory={handleScrollToCategory}
                    onOpenRTEModal={() => setIsRTEModalOpen(true)}
                />

                {/* CATEGORY NAV */}
                <div className="sticky top-[75px] md:top-[86px] z-40 mb-12 -mx-6 px-6 py-2 bg-[#14b84b]/10 border-b border-white/10 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                        {/* Categories Scrollable Container */}
                        <div className="flex items-center gap-2 md:gap-4 overflow-x-auto scroll-smooth no-scrollbar flex-1 w-full md:w-auto pb-2 md:pb-0">
                            <button
                                onClick={() => { setSelectedCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-sm
                                    ${selectedCategory === 'All' ? 'bg-[#14b84b] text-black shadow-md transform scale-105' : 'bg-white/10 text-black border border-white/20 hover:border-[#14b84b] hover:text-black'}`}
                            >
                                All
                            </button>
                            {availableCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleScrollToCategory(cat)}
                                    className={`flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-sm
                                        ${selectedCategory === cat ? 'bg-[#14b84b] text-black shadow-md transform scale-105' : 'bg-white/10 text-black border border-white/20 hover:border-[#14b84b] hover:text-black'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search Bar (Right Aligned on Desktop) */}
                        <div className="relative w-full md:w-64 flex-shrink-0 hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#14b84b] w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Find a dish..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-full border-2 border-[#14b84b]/30 bg-white/80 backdrop-blur-md py-2.5 pl-9 pr-4 text-sm focus:ring-1 focus:ring-[#14b84b] focus:border-[#14b84b] outline-none shadow-sm text-[#0e2a1a] placeholder-gray-500 font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* MENU GRID */}
                <div className="space-y-24 pb-40">
                    {availableCategories.map(category => (
                        <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-[180px]">
                            <div className="flex items-center gap-6 mb-12">
                                <h2 className="font-serif-heading text-3xl md:text-4xl font-black text-[#0e2a1a] tracking-tight">{category}</h2>
                                <div className="h-[1px] flex-1 bg-[#14b84b]/20"></div>
                                <span className="material-symbols-outlined text-[#14b84b] text-3xl">🌱</span>
                            </div>

                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {itemsByCategory[category].map(item => {
                                    const cartItem = getCartItem(item.id);
                                    const imgUrl = item.imageUrl || getFoodImage(item.name);

                                    return (
                                        <div key={item.id} className="group transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-2 bg-[#e8f5e9]/90 backdrop-blur-md border border-[#14b84b]/20 overflow-hidden rounded-3xl p-4 flex flex-col h-full">
                                            <div className="relative mb-5 flex-shrink-0">
                                                {/* FSSAI Veg Indicator */}
                                                <div className="absolute top-2 left-2 z-10 w-5 h-5 border-2 border-green-600 bg-white/90 rounded-sm flex items-center justify-center shadow-sm">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                                                </div>
                                                <div className="w-full h-48 rounded-2xl overflow-hidden bg-gray-100">
                                                    <img src={imgUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                </div>
                                                {item.stock === 0 && <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">SOLD OUT</div>}
                                            </div>

                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-serif-heading font-bold text-[#0e2a1a] text-xl leading-tight pr-2">{item.name}</h4>
                                                <p className="font-black text-[#14b84b] text-lg whitespace-nowrap">₹{item.price}</p>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-2 flex-grow">{item.description}</p>

                                            <div className="mt-auto">
                                                {cartItem ? (
                                                    <div className="flex items-center justify-between bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
                                                        <button onClick={() => decreaseQty(item.id, mode)} className="w-10 h-10 flex items-center justify-center bg-gray-100 text-[#0e2a1a] rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"><Minus className="w-4 h-4" /></button>
                                                        <span className="font-bold text-[#0e2a1a] px-4">{cartItem.qty}</span>
                                                        <button onClick={() => addToCart(item, mode)} className="w-10 h-10 flex items-center justify-center bg-[#14b84b] text-white rounded-lg hover:bg-[#11a342] transition-colors"><Plus className="w-4 h-4" /></button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAddToCart(item)}
                                                        disabled={item.stock === 0}
                                                        className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm group
                                                            ${item.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#14b84b] text-white hover:bg-[#11a342] hover:shadow-lg hover:shadow-green-900/40'}`}
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
                <>
                    {/* Floating Button */}
                    <button
                        onClick={() => setShowCategorySelector(true)}
                        className="md:hidden fixed bottom-20 right-4 z-30 bg-[#14b84b] text-white px-4 py-3 rounded-full shadow-lg shadow-black/50 flex items-center gap-2 font-bold text-sm"
                    >
                        <span>📂</span>
                        <span>{selectedCategory === 'All' ? 'All Items' : selectedCategory}</span>
                    </button>

                    {/* Category Selector Modal */}
                    {showCategorySelector && (
                        <div
                            className="md:hidden fixed inset-0 bg-black/60 z-[200] flex items-end backdrop-blur-sm"
                            onClick={() => setShowCategorySelector(false)}
                        >
                            <div
                                className="bg-white border-t border-gray-100 w-full rounded-t-3xl p-6 pb-24 animate-in slide-in-from-bottom duration-300 shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-[#0e2a1a]">Select Category</h3>
                                    <button
                                        onClick={() => setShowCategorySelector(false)}
                                        className="p-2 hover:bg-gray-100 text-gray-500 rounded-full transition-colors"
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
                                        className={`p-4 rounded-xl text-sm font-bold transition-all shadow-sm ${selectedCategory === 'All'
                                            ? 'bg-[#14b84b] text-white ring-2 ring-[#14b84b]/30'
                                            : 'bg-white text-gray-600 border border-gray-100 hover:border-[#14b84b]/50 hover:bg-[#f0fdf4]'
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
                                            className={`p-4 rounded-xl text-sm font-bold transition-all shadow-sm ${selectedCategory === cat
                                                ? 'bg-[#14b84b] text-white ring-2 ring-[#14b84b]/30'
                                                : 'bg-white text-gray-600 border border-gray-100 hover:border-[#14b84b]/50 hover:bg-[#f0fdf4]'
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

                {/* MODALS */}
                <ReadyToEatModal
                    isOpen={isRTEModalOpen}
                    onClose={() => setIsRTEModalOpen(false)}
                    menuItems={readyToEatItems}
                />
            </main>
        </div>
    );
}
