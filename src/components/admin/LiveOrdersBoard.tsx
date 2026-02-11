'use client';

import React from 'react';
import {
    Clock,
    CheckCircle2,
    Utensils,
    ShoppingBag,
    Printer,
    MoreVertical,
    AlertCircle
} from 'lucide-react';
import { printKOT, printBill } from '@/lib/printer';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    displayId?: string;
    user: { name: string; phone: string };
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
    note?: string;
    header?: string;
}

interface LiveOrdersBoardProps {
    orders: Order[];
    onUpdateStatus: (id: string, status: string) => void;
}

export default function LiveOrdersBoard({ orders, onUpdateStatus }: LiveOrdersBoardProps) {

    // Sort logic: Urgent first (oldest), then new.
    const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const getUrgencyColor = (createdAt: string) => {
        const diffMinutes = (new Date().getTime() - new Date(createdAt).getTime()) / 60000;
        if (diffMinutes > 20) return 'border-red-500 bg-red-50';
        if (diffMinutes > 10) return 'border-orange-400 bg-orange-50';
        return 'border-[#14b84b] bg-white';
    };

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'PENDING': return 0;
            case 'CONFIRMED': return 1;
            case 'PREPARING': return 2;
            case 'READY': return 3;
            case 'COMPLETED': return 4;
            default: return 0;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-[#0e2a1a]">Live Kitchen View</h2>
                    <p className="text-sm text-[#0e2a1a]/60">Manage active orders efficiently</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-[#14b84b] bg-[#14b84b]/10 px-2 py-1 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-[#14b84b] animate-pulse" />
                        Live Updates
                    </span>
                </div>
            </div>

            {/* Grid Layout - Compact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {sortedOrders.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                        <Utensils className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-bold text-lg">No active orders</p>
                        <p className="text-sm">Kitchen is clear!</p>
                    </div>
                ) : (
                    sortedOrders.map(order => {
                        const step = getStatusStep(order.status);
                        const urgencyClass = getUrgencyColor(order.createdAt);
                        const timeAgo = Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 60000);

                        return (
                            <div
                                key={order.id}
                                className={`
                                    relative flex flex-col justify-between 
                                    rounded-xl shadow-sm border-l-4 p-4 transition-all duration-200 hover:shadow-md
                                    ${urgencyClass} border-t border-r border-b border-gray-100
                                `}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-xl text-[#0e2a1a]">
                                                #{order.displayId || order.id.slice(0, 4)}
                                            </span>
                                            {order.header === 'POS/Counter' && (
                                                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded">POS</span>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 truncate max-w-[120px]">
                                            {order.user.name}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xs font-bold flex items-center gap-1 ${timeAgo > 20 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                                            <Clock className="w-3 h-3" />
                                            {timeAgo}m
                                        </p>
                                        <p className="text-[10px] text-gray-400">
                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Items List (Compact) */}
                                <div className="flex-1 space-y-1 mb-4 overflow-y-auto max-h-[140px] custom-scrollbar pr-1">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-2 text-sm leading-tight border-b border-dashed border-gray-100 pb-1 last:border-0">
                                            <span className="font-black text-[#0e2a1a] w-5 shrink-0 text-right">{item.quantity}x</span>
                                            <span className="text-gray-700 font-medium">{item.name}</span>
                                        </div>
                                    ))}
                                    {order.note && (
                                        <div className="bg-orange-50 text-orange-700 text-xs p-2 rounded-lg mt-2 font-medium border border-orange-100">
                                            Note: {order.note}
                                        </div>
                                    )}
                                </div>

                                {/* Actions Footer */}
                                <div className="space-y-3 pt-3 border-t border-gray-100">

                                    {/* Print Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => printKOT(order)}
                                            className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 rounded-lg flex items-center justify-center gap-1 transition-colors"
                                        >
                                            <Printer className="w-3 h-3" /> KOT
                                        </button>
                                        <button
                                            onClick={() => printBill(order as any)}
                                            className="flex-1 py-1.5 bg-[#dcfce7] hover:bg-[#bbf7d0] text-xs font-bold text-[#15803d] rounded-lg flex items-center justify-center gap-1 transition-colors"
                                        >
                                            <Printer className="w-3 h-3" /> Bill
                                        </button>
                                    </div>

                                    {/* Status Stepper Buttons */}
                                    <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100/50 rounded-lg">
                                        {['CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'].map((s, i) => {
                                            const isActive = order.status === s;
                                            const isPast = step > i;

                                            // Colors
                                            let activeColor = 'bg-blue-500 text-white shadow-md';
                                            if (s === 'PREPARING') activeColor = 'bg-orange-500 text-white shadow-md';
                                            if (s === 'READY') activeColor = 'bg-[#14b84b] text-white shadow-md';
                                            if (s === 'COMPLETED') activeColor = 'bg-gray-600 text-white shadow-md';

                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => onUpdateStatus(order.id, s)}
                                                    className={`
                                                        h-8 rounded flex items-center justify-center transition-all duration-200
                                                        ${isActive ? activeColor : isPast ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-300 hover:bg-gray-50 border border-gray-100'}
                                                    `}
                                                    title={s}
                                                >
                                                    {s === 'CONFIRMED' && <CheckCircle2 className="w-4 h-4" />}
                                                    {s === 'PREPARING' && <Utensils className="w-4 h-4" />}
                                                    {s === 'READY' && <ShoppingBag className="w-4 h-4" />}
                                                    {s === 'COMPLETED' && <CheckCircle2 className="w-4 h-4" />}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Status Label (Floating) */}
                                <div className="absolute -top-3 left-4 px-2 py-0.5 bg-white border border-gray-100 shadow-sm rounded-md">
                                    <span className="text-[10px] font-black uppercase text-[#0e2a1a] tracking-wider">
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
