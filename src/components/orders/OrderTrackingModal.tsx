'use client';

import React, { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    CheckCircle2,
    Info,
    Check,
    Utensils,
    ShoppingBag,
    Flag,
    Download,
    Headphones,
    X,
    FileText,
    Clock,
    Receipt
} from 'lucide-react';
import Image from 'next/image';

interface OrderTrackingModalProps {
    order: any;
    onClose: () => void;
}

const STEPS = [
    { key: 'RECEIVED', label: 'Order Received', icon: Check, color: 'bg-primary' },
    { key: 'PREPARING', label: 'Preparing', icon: Utensils, color: 'bg-accent-yellow' },
    { key: 'READY', label: 'Ready for Pickup', icon: ShoppingBag, color: 'bg-gray-400' },
    { key: 'COMPLETED', label: 'Completed', icon: Flag, color: 'bg-gray-400' }
];

const FOOD_MESSAGES: Record<string, string[]> = {
    'dosa': [
        "Your dosa is getting that perfect golden crisp.",
        "Spreading the batter for the thinnest, crispiest dosa.",
        "Adding a dollop of ghee for that authentic taste."
    ],
    'idli': [
        "Steaming the fluffiest idlis just for you.",
        "Preparing the chutneys to pair with your idlis."
    ],
    'coffee': [
        "Brewing the perfect cup of filter kaapi.",
        "Frothing the milk for that cloud-like foam."
    ],
    'biryani': [
        "Layering the spices for your biryani.",
        "Dum cooking to seal in the flavors."
    ],
    'default': [
        "Our chefs are working their magic.",
        "Prepping fresh ingredients for your meal.",
        "Almost there! The aroma is building up."
    ]
};

const STATUS_CONFIG: any = {
    'PENDING': { stepIndex: 0, color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock },
    'CONFIRMED': { stepIndex: 0, color: 'text-blue-600', bg: 'bg-blue-100', icon: CheckCircle2 },
    'PREPARING': { stepIndex: 1, color: 'text-orange-500', bg: 'bg-orange-100', icon: Utensils },
    'READY': { stepIndex: 2, color: 'text-green-600', bg: 'bg-green-100', icon: ShoppingBag },
    'COMPLETED': { stepIndex: 3, color: 'text-gray-500', bg: 'bg-gray-100', icon: Flag },
    'CANCELLED': { stepIndex: -1, color: 'text-red-500', bg: 'bg-red-100', icon: X },
    'SOLD': { stepIndex: 3, color: 'text-gray-500', bg: 'bg-gray-100', icon: Flag } // Treat like completed
};

export default function OrderTrackingModal({ order, onClose }: OrderTrackingModalProps) {
    if (!order) return null;

    // Determine current step index
    const currentStatus = order.status === 'DONE' ? 'READY' : order.status; // Map 'DONE' to 'READY' for UI
    const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['PENDING'];
    const currentStepIndex = config.stepIndex;

    // Get creative line
    const creativeLine = useMemo(() => {
        if (currentStatus === 'PREPARING') {
            // Find first item that matches a category
            const itemNames = order.items.map((i: any) => i.name.toLowerCase());
            for (const name of itemNames) {
                if (name.includes('dosa')) return FOOD_MESSAGES['dosa'][Math.floor(Math.random() * FOOD_MESSAGES['dosa'].length)];
                if (name.includes('idli')) return FOOD_MESSAGES['idli'][Math.floor(Math.random() * FOOD_MESSAGES['idli'].length)];
                if (name.includes('coffee') || name.includes('kaapi')) return FOOD_MESSAGES['coffee'][Math.floor(Math.random() * FOOD_MESSAGES['coffee'].length)];
                if (name.includes('biryani')) return FOOD_MESSAGES['biryani'][Math.floor(Math.random() * FOOD_MESSAGES['biryani'].length)];
            }
            return FOOD_MESSAGES['default'][Math.floor(Math.random() * FOOD_MESSAGES['default'].length)];
        }
        if (currentStatus === 'READY') return "Your order is packed and ready for pickup!";
        if (currentStatus === 'COMPLETED') return "Thanks for dining with us!";
        return "We represent the best of South Indian cuisine.";
    }, [order.items, currentStatus]);


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#f8fbf7] dark:bg-[#112116] w-full max-w-3xl rounded-3xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200">

                {/* Header / Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white dark:bg-white/10 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white z-10 transition-colors shadow-sm"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="overflow-y-auto flex-1 p-6 md:p-8">

                    {/* Status Header */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className={`size-20 ${config.bg} rounded-full flex items-center justify-center mb-4 ${config.color.replace('text-', 'text-opacity-100 text-')}`}>
                            <config.icon className="w-10 h-10" />
                        </div>
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#0e2a1a] dark:text-white mb-2">
                            {currentStatus === 'CANCELLED' ? 'Order Cancelled' : 'Order Status'}
                        </h1>
                        <p className="text-[#0e2a1a]/60 dark:text-gray-400 font-medium font-sans">
                            Order ID: {order.displayId || order.id.slice(0, 8).toUpperCase()}
                        </p>
                    </div>

                    {/* Pending Cancellation Notice */}
                    {currentStatus === 'PENDING' && (
                        <div className="w-full mb-8 flex justify-center">
                            <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-full border border-[#0e2a1a]/5 dark:border-white/10 shadow-sm">
                                <Info className="w-4 h-4 text-[#0e2a1a] dark:text-white" />
                                <p className="text-xs font-medium text-[#0e2a1a]/70 dark:text-gray-300">
                                    Reminder: You can only cancel this order within 2-3 minutes of placement.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Layout Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                        {/* Left: Tracker */}
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-[#14b84b]/10 p-6 md:p-8">
                            <div className="flex flex-col gap-0">
                                {STEPS.map((step, idx) => {
                                    const isActive = idx <= currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;
                                    const isLast = idx === STEPS.length - 1;

                                    // Dynamic styles based on active state
                                    // Using user's requested colors: primary=#14b84b, accent-yellow=#f59e0b
                                    let circleColor = "bg-gray-100 text-gray-400 dark:bg-gray-800";
                                    let lineColor = "bg-gray-200 dark:bg-gray-700";
                                    let textColor = "text-gray-400";

                                    if (isActive) {
                                        if (step.key === 'PREPARING') {
                                            circleColor = "bg-[#f59e0b] text-white ring-4 ring-[#f59e0b]/20";
                                            textColor = "text-[#0e2a1a] dark:text-white";
                                        } else if (step.key === 'RECEIVED' || step.key === 'READY' || step.key === 'COMPLETED') {
                                            circleColor = "bg-[#14b84b] text-white";
                                            textColor = "text-[#0e2a1a] dark:text-white";
                                        }
                                        lineColor = "bg-[#14b84b]";
                                    }

                                    // Special case: If preparing is active, line to next step is gray unless next is also active (which expects sequential, so line follows previous node)
                                    // Actually vertical stepper lines connect *down*.
                                    // Layout: Circle -> Line (height)
                                    // If current step is active, line *below* it should be colored if next step is active?
                                    // Actually, usually line represents completion of current phase?
                                    // Let's stick to: if next step is active, line is colored.

                                    const isNextActive = (idx + 1) <= currentStepIndex;
                                    const connectorColor = isNextActive ? "bg-[#14b84b]" : "bg-gray-200 dark:bg-gray-700";

                                    return (
                                        <div key={step.key} className="grid grid-cols-[40px_1fr] gap-x-6">
                                            <div className="flex flex-col items-center">
                                                <div className={`size-10 rounded-full flex items-center justify-center transition-colors duration-300 ${circleColor}`}>
                                                    <step.icon className="w-5 h-5" />
                                                </div>
                                                {!isLast && (
                                                    <div className={`w-[2px] h-12 md:h-16 transition-colors duration-300 ${connectorColor}`}></div>
                                                )}
                                            </div>
                                            <div className="pt-1 pb-8">
                                                <div className="flex items-center gap-2">
                                                    <h3 className={`font-bold text-lg ${textColor} font-sans`}>{step.label}</h3>
                                                    {isCurrent && step.key === 'PREPARING' && (
                                                        <span className="bg-[#f59e0b]/10 text-[#f59e0b] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">In Progress</span>
                                                    )}
                                                </div>

                                                {/* Timestamp or Info */}
                                                {isActive && (
                                                    <div className="mt-1">
                                                        {step.key === 'RECEIVED' && (
                                                            <p className="text-[#14b84b] text-sm font-medium">Confirmed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                        )}
                                                        {step.key === 'PREPARING' && isCurrent && (
                                                            <p className="text-[#0e2a1a]/70 dark:text-gray-300 text-sm italic mt-1 font-serif">
                                                                "{creativeLine}"
                                                            </p>
                                                        )}
                                                        {step.key === 'READY' && isCurrent && (
                                                            <p className="text-[#14b84b] text-sm font-medium">Ready for pickup!</p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Inactive Estimate */}
                                                {!isActive && step.key === 'READY' && currentStatus === 'PREPARING' && (
                                                    <p className="text-gray-400 text-sm">Estimated soon...</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Summary & QR */}
                        <div className="flex flex-col gap-6">

                            {/* QR Code Card */}
                            <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-[#14b84b]/10 flex flex-col items-center text-center shadow-sm">
                                <h2 className="font-serif text-xl font-bold mb-4 text-[#0e2a1a] dark:text-white">Pickup Verification</h2>
                                <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
                                    <QRCodeSVG value={order.id} size={140} level="H" />
                                </div>
                                <p className="text-sm text-[#0e2a1a]/60 dark:text-gray-400 font-medium">
                                    Scan this at the counter to collect your meal
                                </p>
                            </div>

                            {/* Order Summary Summary */}
                            <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl border border-[#14b84b]/5 shadow-sm flex-1">
                                <h2 className="font-serif text-xl font-bold mb-4 text-[#0e2a1a] dark:text-white">Order Summary</h2>
                                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                    {order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-gray-800 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <span className="size-6 flex items-center justify-center bg-[#14b84b]/10 text-[#14b84b] text-xs font-bold rounded">
                                                    {item.quantity}
                                                </span>
                                                <span className="font-medium text-[#0e2a1a] dark:text-gray-200 text-sm line-clamp-1">{item.name}</span>
                                            </div>
                                            <span className="font-semibold text-[#f59e0b] text-sm whitespace-nowrap">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center pt-4 mt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                    <span className="text-[#0e2a1a]/80 dark:text-gray-300 font-bold">Total Amount</span>
                                    <span className="text-xl font-bold text-[#14b84b]">₹{order.totalAmount}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <a
                            href={`/receipt/${order.id}`}
                            target="_blank"
                            className="flex-1 px-8 py-3 bg-[#14b84b] text-white font-bold rounded-xl shadow-lg shadow-[#14b84b]/20 hover:bg-[#14b84b]/90 transition-all flex items-center justify-center gap-2 group"
                        >
                            <Receipt className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Download Invoice
                        </a>
                        <a
                            href="mailto:help@cafesouthcentral.com"
                            className="flex-1 px-8 py-3 bg-white dark:bg-gray-800 text-[#0e2a1a] dark:text-white font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                        >
                            <Headphones className="w-5 h-5" />
                            Need Help?
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}
