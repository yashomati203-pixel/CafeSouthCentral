'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { MenuItem, MenuItemType } from '@/types/db';
import { useRouter } from 'next/navigation';
import { useMenu, CATEGORY_ORDER } from '@/hooks/useMenu';
import { Plus, Minus, Search, X } from 'lucide-react';

export default function MenuPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ id?: string; name: string; phone: string; role?: string } | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCategorySelector, setShowCategorySelector] = useState(false);
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

    const handleAddToCart = (item: MenuItem) => {
        if (!user) {
            router.push('/?login=true');
            return;
        }
        addToCart(item, mode);
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
                <div className="mb-12 flex flex-col items-center text-center">
                    <h1 className="font-serif-heading text-4xl font-black text-[#0e1b12] lg:text-6xl mb-4">Our Full Menu</h1>
                    <p className="max-w-xl text-[#4e9767] text-lg">Experience the finest South Indian flavors, prepared fresh with traditional techniques and local ingredients.</p>

                    <div className="mt-6 flex gap-4 text-xs font-bold uppercase tracking-wider text-[#0e1b12]">
                        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#166534]"></span> 100% Fresh</span>
                        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#DAA520]"></span> Authentic Recipes</span>
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
                    <div className="flex items-center gap-2 md:gap-4 overflow-x-auto py-4 scroll-smooth">
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
                        <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-[180px]">
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
            </main>
        </div>
    );
}
