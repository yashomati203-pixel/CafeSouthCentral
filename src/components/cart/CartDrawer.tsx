'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: any[]; // Replace 'any' with CartItem type later
    subtotal: number;
    onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
    isOpen,
    onClose,
    items,
    subtotal,
    onCheckout,
}) => {
    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-pure-white shadow-2xl flex flex-col border-l border-gray-100"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-pure-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="bg-palm-green-light/10 p-2 rounded-lg text-palm-green-dark">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-serif-display font-semibold text-gray-800">Your Cart</h2>
                                    <p className="text-sm text-gray-500">{items.length} items</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
                                    <ShoppingBag className="w-16 h-16 text-gray-300" />
                                    <p className="text-gray-500 font-medium">Your cart is empty</p>
                                    <Button variant="outline" size="small" onClick={onClose}>
                                        Browse Menu
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Cart Items will go here */}
                                    {/* Placeholder for now */}
                                    <p className="text-gray-500 text-center italic">Cart items list component pending...</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50 safe-area-bottom">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Taxes (5%)</span>
                                        <span className="font-mono">₹{(subtotal * 0.05).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t border-gray-200">
                                        <span>Total</span>
                                        <span className="font-mono text-palm-green-dark">
                                            ₹{(subtotal * 1.05).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full justify-between group"
                                    size="large"
                                    onClick={onCheckout}
                                >
                                    <span>Checkout</span>
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
