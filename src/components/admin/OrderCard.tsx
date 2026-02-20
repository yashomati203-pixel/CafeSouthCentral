'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Clock,
    CheckCircle2,
    Utensils,
    ShoppingBag,
    Printer,
    Phone,
    Trash2,
    RotateCcw,
    MoreVertical
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

interface OrderCardProps {
    order: Order;
    onUpdateStatus: (id: string, status: string) => void;
}

export default function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    // Timer Logic
    const timeAgo = Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 60000);
    const getUrgencyColor = () => {
        if (timeAgo > 20) return 'text-red-500'; // Pure red
        if (timeAgo > 10) return 'text-orange-500'; // Pure orange
        return 'text-gray-400';
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
    const currentStep = getStatusStep(order.status);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col gap-2 hover:shadow-md transition-shadow relative overflow-visible mt-4">

            {/* Header: Status Badge (Floating on Border) */}
            <div className="absolute -top-3 left-4 px-3 py-1 bg-white border border-gray-200 shadow-sm rounded-lg z-10">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-800">
                    {order.status}
                </span>
            </div>

            {/* Timer - Top Right */}
            <div className="flex justify-end items-start -mt-1 mb-1">
                <div className="flex flex-col items-end">
                    <div className={`flex items-center gap-1 text-xs font-bold ${getUrgencyColor()}`}>
                        <Clock className="w-3 h-3" />
                        <span>{timeAgo}m</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium leading-none">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            {/* Main Info: ID & Customer */}
            <div className="-mt-1">
                <h3 className="font-black text-xl text-gray-900 tracking-tight leading-none">
                    #{order.displayId || order.id.slice(0, 4)}
                </h3>
                <div className="text-xs font-bold text-gray-500 mt-1 truncate uppercase tracking-wide">
                    {order.user.name}
                </div>
            </div>

            {/* Order Items */}
            <div className="space-y-1.5 py-1">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 text-sm items-start">
                        <span className="font-black text-gray-900 w-4 text-right shrink-0 leading-tight">{item.quantity}x</span>
                        <span className="font-medium text-gray-700 leading-tight">{item.name}</span>
                    </div>
                ))}
                {order.note && (
                    <div className="mt-1 text-[10px] bg-orange-50 text-orange-800 px-2 py-1 rounded border border-orange-100 font-bold">
                        Note: {order.note}
                    </div>
                )}
            </div>

            {/* ---------------- ACTIONS SECTION ---------------- */}
            <div className="mt-auto space-y-2 pt-1 border-t border-dashed border-gray-100">

                {/* Row 1: Print Actions + Menu */}
                <div className="flex gap-2 h-9">
                    <button
                        onClick={() => printKOT(order)}
                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[10px] font-black rounded-lg flex items-center justify-center gap-1.5 border border-gray-200"
                    >
                        <Printer className="w-3.5 h-3.5" /> KOT
                    </button>

                    <button
                        onClick={() => printBill(order as any)}
                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 text-[10px] font-black rounded-lg flex items-center justify-center gap-1.5 border border-green-200"
                    >
                        <Printer className="w-3.5 h-3.5" /> Bill
                    </button>

                    {/* More Menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 transition-colors"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-bottom-right">
                                <button
                                    onClick={() => {
                                        window.open(`tel:${order.user.phone}`);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-3"
                                >
                                    <Phone className="w-3.5 h-3.5" /> Call Customer
                                </button>

                                <button
                                    onClick={() => {
                                        const time = prompt("Enter delay duration (e.g. 15 mins):");
                                        if (time) onUpdateStatus(order.id, `RESCHEDULED: ${time}`);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-yellow-600 hover:bg-yellow-50 flex items-center gap-3"
                                >
                                    <Clock className="w-3.5 h-3.5" /> Delay Order
                                </button>

                                <button
                                    onClick={() => {
                                        if (confirm("Refund this order?")) onUpdateStatus(order.id, 'REFUNDED');
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-purple-600 hover:bg-purple-50 flex items-center gap-3"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" /> Refund
                                </button>

                                <div className="h-px bg-gray-100 my-1" />

                                <button
                                    onClick={() => {
                                        if (confirm("Trash/Bin this order?")) onUpdateStatus(order.id, 'DISPOSED');
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-3"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Cancel & Bin
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Row 2: Status Stepper - Square Style */}
                <div className="grid grid-cols-4 gap-2 h-10">
                    {['CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'].map((s, i) => {
                        const isActive = order.status === s;
                        const isPast = currentStep > i;

                        let activeClass = 'bg-blue-500 text-white shadow-sm shadow-blue-200 ring-2 ring-blue-50';
                        if (s === 'PREPARING') activeClass = 'bg-orange-500 text-white shadow-sm shadow-orange-200 ring-2 ring-orange-50';
                        if (s === 'READY') activeClass = 'bg-green-500 text-white shadow-sm shadow-green-200 ring-2 ring-green-50';
                        if (s === 'COMPLETED') activeClass = 'bg-gray-800 text-white shadow-sm shadow-gray-200 ring-2 ring-gray-50';

                        return (
                            <button
                                key={s}
                                onClick={() => onUpdateStatus(order.id, s)}
                                className={`
                                    rounded-lg flex items-center justify-center transition-all duration-200
                                    ${isActive
                                        ? activeClass
                                        : isPast
                                            ? 'bg-gray-50 text-gray-300'
                                            : 'bg-white border border-gray-100 text-gray-200 hover:border-gray-200'
                                    }
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
        </div>
    );
}
