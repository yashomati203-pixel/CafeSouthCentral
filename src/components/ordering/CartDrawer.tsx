'use client';

import React, { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { X, Clock, Plus, Minus, Trash2, ArrowRight, Info, ShoppingBag } from 'lucide-react';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onOrderSuccess?: () => void;
    variant?: 'drawer' | 'sidebar';
}

export default function CartDrawer({ isOpen, onClose, user, onOrderSuccess, variant = 'drawer' }: CartProps) {
    const {
        subscriptionItems,
        normalItems,
        subTotalCount,
        normalTotalAmount,
        removeFromCart,
        addToCart,
        decreaseQty,
    } = useCart();

    const router = useRouter();

    const hasSubscription = subscriptionItems.length > 0;
    const hasNormal = normalItems.length > 0;

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen && variant === 'drawer') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, variant]);

    if (!isOpen && variant === 'drawer') return null;

    const handleProceed = () => {
        onClose();
        router.push('/checkout');
    };

    const deliveryFee = normalTotalAmount > 0 ? normalTotalAmount * 0.05 : 0; // 5% tax/fee logic from prev code
    const totalAmount = normalTotalAmount + deliveryFee;

    // Helper for currency
    const formatPrice = (amount: number) => `₹${amount.toFixed(0)}`;

    return (
        <>
            {/* Overlay */}
            {variant === 'drawer' && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Drawer Container */}
            <aside
                className={`
                    fixed z-[60] bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
                    ${variant === 'sidebar' ? 'relative w-full h-full shadow-none border rounded-xl' : ''}
                    ${variant === 'drawer' ? `
                        bottom-0 left-0 right-0 w-full rounded-t-3xl border-t h-[90vh]
                        md:top-0 md:right-0 md:bg-white md:bottom-auto md:left-auto md:h-full md:w-[450px] md:rounded-none md:border-l
                        transform
                        ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}
                    ` : ''}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Drag Handle (Mobile Only) */}
                {variant === 'drawer' && (
                    <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
                        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                )}

                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Your Cart</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{subTotalCount} items from South Central</p>
                    </div>
                    {variant === 'drawer' && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">

                    {/* Empty State */}
                    {!hasSubscription && !hasNormal && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
                            <ShoppingBag className="w-16 h-16 text-gray-300" />
                            <p className="text-gray-500 font-medium">Your cart is empty</p>
                            <button
                                onClick={() => {
                                    onClose();
                                    router.push('/?menu=true');
                                }}
                                className="px-4 py-2 border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Browse Menu
                            </button>
                        </div>
                    )}

                    {/* Prep Time Banner (Only if not empty) */}
                    {(hasSubscription || hasNormal) && (
                        <div className="bg-[#fffae5] dark:bg-yellow-900/20 border border-[#f9e18b] dark:border-yellow-900/40 rounded-xl p-4 flex items-start gap-3">
                            <Clock className="w-5 h-5 text-yellow-700 dark:text-yellow-500 mt-0.5" />
                            <div>
                                <p className="text-sm md:text-base font-semibold text-yellow-900 dark:text-yellow-100 leading-tight">Estimated preparation time: 10-15 mins</p>
                                <p className="text-xs md:text-sm text-yellow-800 dark:text-yellow-200/70 mt-0.5 leading-relaxed">
                                    Orders are usually done quickly. Thank you for your patience!
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Subscription Items */}
                    {hasSubscription && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Subscription Items</h3>
                            {subscriptionItems.map((item: any) => (
                                <CartItemRow
                                    key={item.id}
                                    item={item}
                                    type="SUBSCRIPTION"
                                    onIncrease={() => addToCart(item, 'SUBSCRIPTION')}
                                    onDecrease={() => decreaseQty(item.id, 'SUBSCRIPTION')}
                                    onRemove={() => removeFromCart(item.id)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Normal Items */}
                    {hasNormal && (
                        <div className="space-y-4">
                            {hasSubscription && <div className="border-t border-dashed border-gray-200 my-4" />}
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Pay-Per-Order</h3>
                            {normalItems.map((item: any) => (
                                <CartItemRow
                                    key={item.id}
                                    item={item}
                                    type="NORMAL"
                                    onIncrease={() => addToCart(item, 'NORMAL')}
                                    onDecrease={() => decreaseQty(item.id, 'NORMAL')}
                                    onRemove={() => removeFromCart(item.id)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Upsell / Add More (Clickable text) */}
                    {(hasSubscription || hasNormal) && (
                        <div className="pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                            <button
                                onClick={onClose}
                                className="flex items-center gap-2 text-[#166534] font-bold text-sm hover:underline"
                            >
                                <Plus className="w-5 h-5" />
                                Add more items
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {(hasSubscription || hasNormal) && (
                    <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 safe-area-pb">
                        {/* Note */}


                        {/* Totals */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-mono">{formatPrice(normalTotalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Taxes & Fees (5%)</span>
                                <span className="font-mono">{formatPrice(deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between items-end pt-2 border-t border-gray-50">
                                <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="text-2xl font-bold font-mono text-[#0e1b12] dark:text-white">{formatPrice(totalAmount)}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handleProceed}
                            className="w-full bg-[#166534] hover:bg-[#0f913b] text-white py-4 rounded-xl font-bold text-lg tracking-wide transition-all shadow-lg shadow-[#166534]/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <span>Proceed to Review</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        {/* Continue Shopping */}
                        {variant === 'drawer' && (
                            <button
                                onClick={onClose}
                                className="w-full mt-3 text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors py-1"
                            >
                                Continue Shopping
                            </button>
                        )}
                    </div>
                )}
            </aside>
        </>
    );
}

function CartItemRow({ item, type, onIncrease, onDecrease, onRemove }: any) {
    // Fallback image logic if needed, or use what's in item
    // Assuming item has imageUrl or we use a placeholer
    const formatPrice = (p: number) => `₹${p}`;

    return (
        <div className="flex gap-4 group">
            <div
                className="h-20 w-20 flex-shrink-0 rounded-lg bg-center bg-cover border border-gray-100 bg-gray-100"
                style={{ backgroundImage: `url(${item.imageUrl || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=200&auto=format&fit=crop'})` }}
            />
            <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">{item.name}</h3>
                    <span className="font-mono font-bold text-gray-900 dark:text-white whitespace-nowrap ml-2">
                        {type === 'SUBSCRIPTION' ? '1 Cr' : formatPrice(item.price)}
                    </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                    {/* Qty Control */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700">
                        <button
                            onClick={onDecrease}
                            className="px-2.5 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-400 hover:text-[#166534] transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-2 text-sm font-bold font-mono border-x border-gray-100 dark:border-gray-700 min-w-[30px] text-center">
                            {item.qty}
                        </span>
                        <button
                            onClick={onIncrease}
                            className="px-2.5 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-400 hover:text-[#166534] transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={onRemove}
                        className="text-xs text-red-500 font-medium hover:text-red-600 flex items-center gap-1 transition-colors p-2"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
