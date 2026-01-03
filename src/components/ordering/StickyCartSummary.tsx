'use client';

import { useCart } from '@/context/CartContext';
import { ArrowRightIcon } from '@radix-ui/react-icons';

interface StickyCartSummaryProps {
    onViewCart: () => void;
}

export default function StickyCartSummary({ onViewCart }: StickyCartSummaryProps) {
    const { items, normalItems } = useCart();

    const count = items.reduce((acc, i) => acc + i.qty, 0);
    if (count === 0) return null;

    // Calculate total price for normal items only (Subscriptions don't add to price visible here usually, or we show mixed)
    const totalPrice = normalItems.reduce((acc, i) => acc + (i.price * i.qty), 0);

    return (
        <div className="fixed bottom-[70px] left-4 right-4 z-40 md:hidden animate-in slide-in-from-bottom-2 fade-in duration-300">
            <button
                onClick={onViewCart}
                className="w-full bg-[#2F4F2F] text-white p-4 rounded-xl shadow-lg flex items-center justify-between hover:bg-[#253f25] transition-colors"
                style={{ backdropFilter: 'blur(4px)' }}
            >
                <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-sm uppercase tracking-wider">{count} ITEM{count !== 1 ? 'S' : ''}</span>
                    <span className="font-mono text-lg font-bold">₹{totalPrice}</span>
                </div>

                <div className="flex items-center gap-2 font-bold">
                    View Cart <ArrowRightIcon className="w-5 h-5" />
                </div>
            </button>
        </div>
    );
}
