'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Search } from 'lucide-react';
import Image from 'next/image';
import { MenuItem } from '@/types/db';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface ReadyToEatModalProps {
    isOpen: boolean;
    onClose: () => void;
    menuItems: MenuItem[];
}

export default function ReadyToEatModal({ isOpen, onClose, menuItems }: ReadyToEatModalProps) {
    const { items: cartItems, addToCart, decreaseQty } = useCart();

    // Filter specifically for items that we want to promote as 'Ready to Eat'
    // such as Idli, Vada, and Rice items based on User Request.
    // For safety, falling back to all items if filtered list is empty.
    const readyItems = menuItems.filter(item =>
        item.name.toLowerCase().includes('idli') ||
        item.name.toLowerCase().includes('vada') ||
        item.name.toLowerCase().includes('rice') ||
        item.category === 'Rice'
    );

    const displayItems = readyItems.length > 0 ? readyItems : menuItems.slice(0, 10);

    const handleAdd = (item: MenuItem) => {
        addToCart(item, 'NORMAL');
        toast.success(`Added ${item.name} to cart`);
    };

    const handleUpdateQty = (item: MenuItem, currentQty: number, change: number) => {
        if (change > 0) {
            addToCart(item, 'NORMAL');
        } else {
            decreaseQty(item.id, 'NORMAL');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[75vh] sm:max-h-[85vh] overflow-hidden flex flex-col border border-[#14b84b]/20 mt-auto sm:mt-0"
                        >
                            {/* Header */}
                            <div className="bg-[#0e2a1a] p-6 text-white relative shrink-0">
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <h2 className="text-3xl font-serif font-bold text-[#14b84b] mb-1">In a Hurry?</h2>
                                <p className="text-sm text-gray-300 font-medium">Grab these Ready-to-Eat favorites right now.</p>
                            </div>

                            {/* Content / Items List */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#e8f5e9] space-y-4">
                                {displayItems.map(item => {
                                    const cartItem = cartItems.find(c => c.id === item.id);
                                    const qty = cartItem ? cartItem.qty : 0;

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white p-4 rounded-2xl flex gap-4 items-center shadow-sm border border-gray-100 hover:border-[#14b84b]/30 transition-colors group"
                                        >
                                            {/* Image placeholder or real image */}
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
                                                {item.imageUrl ? (
                                                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Search className="w-6 h-6 opacity-50" />
                                                    </div>
                                                )}
                                                {/* Veg Indicator */}
                                                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur p-1 rounded">
                                                    <div className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-1">
                                                <h3 className="font-bold text-[#0e2a1a] text-lg leading-tight mb-1">{item.name}</h3>
                                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">{item.description}</p>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <span className="font-black text-[#0e2a1a]">₹{item.price}</span>

                                                    {/* Add / Adjust Buttons */}
                                                    {qty === 0 ? (
                                                        <button
                                                            onClick={() => handleAdd(item)}
                                                            disabled={!item.isAvailable}
                                                            className="flex items-center gap-1 bg-[#14b84b]/10 hover:bg-[#14b84b]/20 text-[#14b84b] px-4 py-1.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                                                        >
                                                            <Plus className="w-4 h-4" /> Add
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                                                            <button
                                                                onClick={() => handleUpdateQty(item, qty, -1)}
                                                                className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-red-500 hover:bg-red-50 transition-colors"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="font-bold text-[#0e2a1a] w-4 text-center">{qty}</span>
                                                            <button
                                                                onClick={() => handleUpdateQty(item, qty, 1)}
                                                                disabled={qty >= item.stock}
                                                                className="w-7 h-7 flex items-center justify-center bg-[#14b84b] rounded-md shadow-sm text-white hover:bg-[#11a342] transition-colors disabled:opacity-50"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="bg-white border-t border-gray-100 p-4 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] text-center">
                                <button
                                    onClick={onClose}
                                    className="text-sm font-bold text-gray-400 hover:text-[#0e2a1a] transition-colors"
                                >
                                    Close and continue browsing
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
