import { MenuItem, MenuItemType } from '@/types/db';
import { CATEGORY_ORDER } from '@/hooks/useMenu';
import { CartItem } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { AnimatedItem } from '@/components/ui/AnimatedList';
import { Search, ShoppingCart, Plus, Minus, Trash2, Sparkles } from 'lucide-react';
import SectionDivider from '@/components/ui/SectionDivider';

const FOOD_IMAGES: Record<string, string> = {
    'dosa': 'https://images.unsplash.com/photo-1668236543090-d2f896b0101d?q=80&w=800&auto=format&fit=crop',
    'idli': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
    'coffee': 'https://images.unsplash.com/photo-1596933580749-0d3381a8f602?q=80&w=800&auto=format&fit=crop',
    'tea': 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=800&auto=format&fit=crop',
    'rice': 'https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=800&auto=format&fit=crop',
    'meals': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800&auto=format&fit=crop',
    'vada': 'https://images.unsplash.com/photo-1630409351241-e90e7f5e4785?q=80&w=800&auto=format&fit=crop',
    'pongal': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800&auto=format&fit=crop', // Fallback to meals for now
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

interface MenuGridProps {
    menuItems: MenuItem[];
    mode: 'NORMAL' | 'SUBSCRIPTION';
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    onAddToCart: (item: MenuItem) => void;
    onDecreaseQty: (itemId: string) => void;
    cartItems: CartItem[];
    mockMenu: MenuItem[];
}

export default function MenuGrid({
    menuItems,
    mode,
    selectedCategory,
    setSelectedCategory,
    onAddToCart,
    onDecreaseQty,
    cartItems,
    mockMenu
}: MenuGridProps) {
    const [popularItemIds, setPopularItemIds] = useState<Set<string>>(new Set());
    const [topSellingItems, setTopSellingItems] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch popular items from analytics
    useEffect(() => {
        fetch('/api/admin/analytics?public=true')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.topSelling) {
                    const topIds = new Set<string>(data.topSelling.map((item: { id: string }) => item.id));
                    setPopularItemIds(topIds);
                    setTopSellingItems(data.topSelling.slice(0, 3));
                }
            })
            .catch(() => { });
    }, []);

    const activeMenu = menuItems.length > 0 ? menuItems : mockMenu;

    // Filter items based on search query
    const filteredItems = activeMenu.filter(item => {
        const matchesSearch = searchQuery === '' ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

        const isAvailableInSub = item.type === 'SUBSCRIPTION' || item.type === 'BOTH';
        const matchesMode = mode === 'NORMAL' || isAvailableInSub;

        // Only show items that are marked as available in admin
        const isActiveItem = item.isAvailable !== false;

        return matchesSearch && matchesCategory && matchesMode && isActiveItem;
    });

    return (
        <>
            <section className="p-0 md:p-0">
                {/* Header */}
                {/* New Centered Header */}
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-primary p-2.5 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            {mode === 'NORMAL' ? 'Our Menu' : 'Subscription Menu'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {mode === 'NORMAL'
                                ? 'Authentic South Indian delicacies made fresh daily'
                                : 'Select items for your daily meal quota'}
                        </p>
                    </div>
                </div>

                {/* Navigation Bar (Categories + Search) */}
                <div className="mb-8 flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#14b84b]/10 backdrop-blur-md border border-white/10 shadow-sm sticky top-[4.5rem] md:top-24 z-40">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide flex-1">
                        {['All', ...CATEGORY_ORDER.filter(c => mockMenu.some(i => i.category === c))].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap uppercase ${selectedCategory === cat
                                    ? 'bg-[#14b84b] text-black shadow-lg shadow-[#14b84b]/30 scale-105'
                                    : 'bg-white/10 text-black shadow-inner hover:border-[#14b84b] hover:text-black hover:scale-105 border border-white/20'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar next to categories */}
                    <div className="w-full md:w-72 shrink-0 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-[#14b84b]" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-white/80 dark:bg-[#102214]/80 border-2 border-[#14b84b]/40 rounded-full shadow-sm focus:border-[#14b84b] focus:ring-1 focus:ring-[#14b84b] transition-all text-sm text-[#0d4d22] dark:text-white font-medium placeholder-[#14b84b]/60 focus:outline-none backdrop-blur-sm"
                            placeholder="Find a dish..."
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <SectionDivider />
                </div>

                {/* Bestsellers Section */}
                {topSellingItems.length > 0 && selectedCategory === 'All' && searchQuery === '' && (
                    <div className="mb-10 p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl border-2 border-amber-400 dark:border-amber-600">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-6 h-6 text-amber-700 dark:text-amber-500" />
                            <h3 className="text-2xl font-extrabold text-amber-900 dark:text-amber-100">
                                Bestsellers
                            </h3>
                        </div>
                        <p className="text-amber-800 dark:text-amber-200 mb-6 text-sm">
                            Our most loved dishes - handpicked by your favorites!
                        </p>
                        <div className="menu-grid">
                            {topSellingItems.map((statsItem, idx) => {
                                const item = activeMenu.find(m => m.id === statsItem.id);
                                if (!item) return null;

                                const cartItem = cartItems.find(i =>
                                    i.id === item.id &&
                                    (mode === 'NORMAL' ? i.type === MenuItemType.NORMAL : i.type === MenuItemType.SUBSCRIPTION)
                                );

                                return (
                                    <AnimatedItem key={item.id} index={idx} delay={idx * 0.05}>
                                        <div className="group menu-card bg-amber-50/50 dark:bg-amber-900/10 border-2 border-amber-300 dark:border-amber-600 relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            {/* Rank Badge */}
                                            <div className="absolute top-3 left-3 z-10 bg-amber-900 dark:bg-amber-700 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-base shadow-lg">
                                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                                            </div>

                                            <MenuItemCard
                                                item={item}
                                                cartItem={cartItem}
                                                onAddToCart={onAddToCart}
                                                onDecreaseQty={onDecreaseQty}
                                                mode={mode}
                                                isBestseller={true}
                                            />
                                        </div>
                                    </AnimatedItem>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Grouped Menu Sections */}
                {Object.entries(
                    filteredItems.reduce((acc, item) => {
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
                }).map(([category, categoryItems]) => (
                    <div key={category} className="mb-8">
                        <h3 className="text-xl font-bold mb-6 text-primary dark:text-primary/90 border-b-2 border-slate-100 dark:border-slate-700 pb-3">
                            {category}
                        </h3>
                        <div className="menu-grid">
                            {categoryItems.map((item, idx) => {
                                const cartItem = cartItems.find(i =>
                                    i.id === item.id &&
                                    (mode === 'NORMAL' ? i.type === MenuItemType.NORMAL : i.type === MenuItemType.SUBSCRIPTION)
                                );

                                return (
                                    <AnimatedItem key={item.id} index={idx} delay={idx * 0.03}>
                                        <div className="group menu-card bg-[#e8f5e9] border border-[#14b84b]/20 hover:border-[#14b84b]/50 hover:shadow-2xl hover:shadow-[#14b84b]/10 hover:-translate-y-2 transition-all duration-300">
                                            <MenuItemCard
                                                item={item}
                                                cartItem={cartItem}
                                                onAddToCart={onAddToCart}
                                                onDecreaseQty={onDecreaseQty}
                                                mode={mode}
                                                isPopular={popularItemIds.has(item.id)}
                                            />
                                        </div>
                                    </AnimatedItem>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                            No items found
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </section>

            <style jsx>{`
                .menu-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }

                @media (min-width: 640px) {
                    .menu-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 1280px) {
                    .menu-grid {
                        grid-template-columns: repeat(5, 1fr);
                    }
                }

                .menu-card {
                    border-radius: 1rem;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }

                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </>
    );
}

// Separate MenuItemCard component for better organization
function MenuItemCard({
    item,
    cartItem,
    onAddToCart,
    onDecreaseQty,
    mode,
    isBestseller = false,
    isPopular = false
}: {
    item: MenuItem;
    cartItem?: CartItem;
    onAddToCart: (item: MenuItem) => void;
    onDecreaseQty: (itemId: string) => void;
    mode: 'NORMAL' | 'SUBSCRIPTION';
    isBestseller?: boolean;
    isPopular?: boolean;
}) {
    return (
        <div className={`flex flex-col h-full ${item.stock === 0 ? 'opacity-60' : ''}`}>
            {/* Image */}
            <div className="relative w-full overflow-hidden bg-gray-100" style={{ aspectRatio: '4/3' }}>
                {/* FSSAI Veg Indicator */}
                <div className="absolute top-2 left-2 z-10 w-5 h-5 border-2 border-green-600 bg-white/90 rounded-sm flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                </div>
                {!isBestseller && isPopular && (
                    <div className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-[#5C3A1A] shadow-sm">
                        Bestseller
                    </div>
                )}
                <img
                    src={getFoodImage(item.name)}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col bg-white">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-[#0e2a1a] flex-1">
                        {item.name}
                    </h3>
                    <div className="flex flex-col items-end gap-1 ml-2">
                        {item.stock === 0 ? (
                            <span className="text-xs font-bold text-red-600 border border-red-600 px-2 py-0.5 rounded">
                                SOLD OUT
                            </span>
                        ) : item.stock <= 5 ? (
                            <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
                                Running Out!
                            </span>
                        ) : null}
                    </div>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">
                    {item.description}
                </p>

                <div className="mt-auto">
                    <p className="text-lg font-extrabold mb-2 text-[#14b84b]">
                        {mode === 'NORMAL' ? `₹${item.price}` : 'Included in Plan'}
                    </p>

                    {cartItem ? (
                        <div className="flex items-center justify-between bg-[#f0f9f4] border border-[#14b84b]/30 rounded-xl p-1">
                            <button
                                onClick={(e) => { e.stopPropagation(); onDecreaseQty(item.id); }}
                                className="w-10 h-10 flex items-center justify-center bg-[#14b84b] hover:bg-[#11a342] text-white rounded-lg transition-colors shadow-sm"
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="font-bold text-[#0e2a1a] px-2">{cartItem.qty}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                                className="w-10 h-10 flex items-center justify-center bg-[#14b84b] hover:bg-[#11a342] text-white rounded-lg transition-colors shadow-sm"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onAddToCart(item)}
                            disabled={item.stock === 0}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#14b84b] hover:bg-[#11a342] text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                        >
                            <Plus className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            {item.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
