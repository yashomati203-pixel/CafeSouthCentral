'use client';

import { MenuItem } from '@/types/db';
import { Plus, Minus, Clock } from 'lucide-react';

interface ReadyToEatBannerProps {
    items: MenuItem[];
    cartItems: any[];
    onAddToCart: (item: MenuItem) => void;
    onDecreaseQty: (itemId: string) => void;
}

export default function ReadyToEatBanner({ items, cartItems, onAddToCart, onDecreaseQty }: ReadyToEatBannerProps) {
    if (!items || items.length === 0) return null;

    const getCartItemQty = (itemId: string) => {
        const item = cartItems.find(i => i.id === itemId);
        return item ? item.qty : 0;
    };

    return (
        <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="font-serif-heading text-2xl md:text-3xl font-black text-[#0e1b12] tracking-tight">
                        Ready To Eat
                    </h2>
                    <span className="bg-[#e7f3eb] text-[#166534] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Quick Prep
                    </span>
                </div>
            </div>

            {/* Horizontal Scroll Layout for the Banner */}
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 px-2 -mx-2 hide-scrollbar scroll-smooth" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                {items.map(item => {
                    const qty = getCartItemQty(item.id);

                    // Re-use logic for default images if missing
                    const imgUrl = item.imageUrl || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop';

                    return (
                        <div key={item.id} className="flex-shrink-0 w-[280px] md:w-[320px] bg-white border border-[#e7f3eb] shadow-sm hover:shadow-lg transition-all rounded-3xl overflow-hidden flex flex-col group">
                            <div className="relative h-32 md:h-40 w-full bg-[#f0f5f1] overflow-hidden">
                                <img src={imgUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                {item.stock === 0 && <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">SOLD OUT</div>}
                            </div>

                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-serif-heading font-bold text-[#0e1b12] text-lg leading-tight pr-2">{item.name}</h4>
                                    <p className="font-black text-[#166534] text-md whitespace-nowrap">₹{item.price}</p>
                                </div>
                                <p className="text-xs text-[#4e9767] mb-4 line-clamp-2">{item.description}</p>

                                <div className="mt-auto">
                                    {qty > 0 ? (
                                        <div className="flex items-center justify-between bg-[#e8f5e9] rounded-xl p-1 border border-[#e7f3eb]">
                                            <button onClick={() => onDecreaseQty(item.id)} className="w-8 h-8 flex items-center justify-center bg-[#0e1b12] text-white rounded-lg hover:bg-[#166534] transition-colors"><Minus className="w-3 h-3" /></button>
                                            <span className="font-bold text-[#0e1b12] text-sm px-4">{qty}</span>
                                            <button onClick={() => onAddToCart(item)} className="w-8 h-8 flex items-center justify-center bg-[#0e1b12] text-white rounded-lg hover:bg-[#166534] transition-colors"><Plus className="w-3 h-3" /></button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => onAddToCart(item)}
                                            disabled={item.stock === 0}
                                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm
                                                ${item.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#0e1b12] text-white hover:bg-[#166534] hover:shadow-md'}`}
                                        >
                                            <Plus className="w-3 h-3" /> {item.stock === 0 ? 'Sold Out' : 'Add'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Injected style to hide horizontal scrollbar specifically for this container */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}} />
        </section>
    );
}
