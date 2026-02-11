'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    ShoppingCart,
    Plus,
    Minus,
    User,
    Phone,
    CreditCard,
    Banknote,
    QrCode,
    Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
    id: string;
    name: string;
    price: number;
    category: string;
    isAvailable: boolean;
}

interface PosTerminalProps {
    items: MenuItem[];
    onOrderPlaced: () => void;
}

export default function PosTerminal({ items, onOrderPlaced }: PosTerminalProps) {
    const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI'>('CASH');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter Items
    const categories = ['All', ...Array.from(new Set(items.map(i => i.category || 'General')))];
    const filteredItems = items.filter(i =>
        (selectedCategory === 'All' || i.category === selectedCategory) &&
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        i.isAvailable
    );

    // Cart Logic
    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(p => p.item.id === item.id);
            if (existing) {
                return prev.map(p => p.item.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(p => p.item.id !== itemId));
    };

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(prev => prev.map(p => {
            if (p.item.id === itemId) {
                const newQ = Math.max(1, p.quantity + delta);
                return { ...p, quantity: newQ };
            }
            return p;
        }));
    };

    const totalAmount = cart.reduce((sum, p) => sum + (p.item.price * p.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return toast.error("Cart is empty");
        // if (!customerName) return toast.error("Customer name is required"); // Optional? Let's make it optional for efficiency

        setIsSubmitting(true);
        try {
            const orderPayload = {
                items: cart.map(p => ({
                    id: p.item.id,
                    name: p.item.name,
                    price: p.item.price,
                    quantity: p.quantity
                })),
                total: totalAmount,
                customer: {
                    name: customerName || 'Walk-in Customer',
                    phone: customerPhone || '0000000000'
                },
                paymentMethod,
                type: 'POS'
            };

            const res = await fetch('/api/admin/orders/pos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });

            if (res.ok) {
                toast.success("Order Placed Successfully!");
                setCart([]);
                setCustomerName('');
                setCustomerPhone('');
                onOrderPlaced();
            } else {
                toast.error("Failed to place order");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error submitting order");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6">

            {/* Left: Menu Selection */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-[#14b84b]/10 overflow-hidden">
                {/* Search & Filter Header */}
                <div className="p-4 border-b border-gray-100 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search menu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#14b84b]/20"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`
                                    whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                                    ${selectedCategory === cat
                                        ? 'bg-[#0e2a1a] text-white'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }
                                `}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid of Items */}
                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 content-start">
                    {filteredItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => addToCart(item)}
                            className="flex flex-col items-start p-3 bg-gray-50 hover:bg-[#14b84b]/5 hover:border-[#14b84b]/20 border border-transparent rounded-xl text-left transition-all group"
                        >
                            <span className="font-bold text-sm text-[#0e2a1a] line-clamp-1">{item.name}</span>
                            <span className="text-xs text-gray-500 font-medium">₹{item.price}</span>
                            <div className="mt-2 w-full flex justify-end">
                                <span className="bg-white p-1 rounded-full shadow-sm text-[#0e2a1a] group-hover:bg-[#14b84b] group-hover:text-white transition-colors">
                                    <Plus className="w-3 h-3" />
                                </span>
                            </div>
                        </button>
                    ))}
                    {filteredItems.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-400">
                            No items found.
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Cart & Checkout */}
            <div className="w-full lg:w-96 bg-white rounded-2xl shadow-xl border border-[#14b84b]/10 flex flex-col overflow-hidden">
                <div className="p-4 bg-[#0e2a1a] text-white flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" /> Current Order
                    </h3>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-xs">#{cart.length} Items</span>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-2">
                            <ShoppingCart className="w-12 h-12 opacity-20" />
                            <p className="font-medium text-sm">Cart is empty</p>
                            <p className="text-xs">Add items from the menu</p>
                        </div>
                    ) : (
                        cart.map((line, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-dashed border-gray-100 pb-3 last:border-0">
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-[#0e2a1a]">{line.item.name}</p>
                                    <p className="text-xs text-gray-500">₹{line.item.price} x {line.quantity}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                    <button onClick={() => line.quantity > 1 ? updateQuantity(line.item.id, -1) : removeFromCart(line.item.id)} className="p-1 hover:bg-white rounded text-gray-600">
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-xs font-bold w-4 text-center">{line.quantity}</span>
                                    <button onClick={() => updateQuantity(line.item.id, 1)} className="p-1 hover:bg-white rounded text-gray-600">
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Checkout Form */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 space-y-3">
                    {/* Customer Details */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                            <User className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Name (Opt)"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full pl-7 pr-2 py-2 text-xs rounded-lg border-none bg-white focus:ring-1 focus:ring-[#14b84b]"
                            />
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Phone (Opt)"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                className="w-full pl-7 pr-2 py-2 text-xs rounded-lg border-none bg-white focus:ring-1 focus:ring-[#14b84b]"
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                        <button
                            onClick={() => setPaymentMethod('CASH')}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-bold transition-all ${paymentMethod === 'CASH' ? 'bg-[#0e2a1a] text-white' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <Banknote className="w-3 h-3" /> CASH
                        </button>
                        <button
                            onClick={() => setPaymentMethod('UPI')}
                            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-bold transition-all ${paymentMethod === 'UPI' ? 'bg-[#0e2a1a] text-white' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <QrCode className="w-3 h-3" /> UPI
                        </button>
                    </div>

                    {/* Total & Pay */}
                    <div className="flex justify-between items-center pt-2">
                        <div>
                            <p className="text-xs text-gray-500">Total Payable</p>
                            <p className="text-2xl font-black text-[#0e2a1a]">₹{totalAmount}</p>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={isSubmitting || cart.length === 0}
                            className="bg-[#14b84b] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#14b84b]/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#14b84b]/20 flex items-center gap-2"
                        >
                            {isSubmitting ? 'Processing...' : 'Charge'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
