'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Wifi, Zap, ArrowRight } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function SubscriptionDiscovery() {
    const [isVisible, setIsVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Slider Logic
    const [dailySpend, setDailySpend] = useState(150);
    const SUBSCRIPTION_PRICE = 3000;
    const [monthlySavings, setMonthlySavings] = useState(0);

    useEffect(() => {
        const normalCost = dailySpend * 30;
        const savings = normalCost - SUBSCRIPTION_PRICE;
        setMonthlySavings(Math.max(0, savings));
    }, [dailySpend]);

    useEffect(() => {
        // Don't show on admin pages
        if (pathname?.startsWith('/admin')) return;

        const checkStatus = async () => {
            const storedUser = localStorage.getItem('cafe_user');

            if (!storedUser) {
                // Determine if we should show for guests. 
                // Strategy: Show after a delay or scroll? Let's show after 3s delay for now.
                const timer = setTimeout(() => setIsVisible(true), 3000);
                return () => clearTimeout(timer);
            }

            try {
                const user = JSON.parse(storedUser);
                if (user.phone) {
                    const res = await fetch('/api/user/subscription-status', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: user.phone })
                    });
                    const data = await res.json();
                    if (!data.hasActiveSubscription) {
                        setIsVisible(true);
                    }
                }
            } catch (e) {
                console.error("Failed to check subscription status", e);
            }
        };

        checkStatus();
    }, []);

    const handlePlanSelect = (plan: string) => {
        console.log(`Selected plan: ${plan}`);

        const storedUser = localStorage.getItem('cafe_user');
        if (!storedUser) {
            router.push('/login?redirect=/checkout?plan=' + plan);
        } else {
            router.push(`/checkout?plan=${plan}`);
        }
        setShowModal(false);
    };

    if (!isVisible) return null;

    return (
        <>
            {/* 1. Floating Entry Point */}
            <AnimatePresence>
                {!showModal && (
                    <motion.button
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        whileHover={{ y: -4 }}
                        onClick={() => setShowModal(true)}
                        className="fixed bottom-6 right-6 z-40 bg-[#D9F99D] border-2 border-black px-6 py-3 rounded-full shadow-lg flex items-center gap-2 group transition-all"
                    >
                        <span className="font-bold font-mono text-black text-sm tracking-wider">JOIN THE CLUB ☕</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 2. Subscription Selection Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />

                        {/* Card */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="relative w-full max-w-md bg-[#FAF9F6] border-[3px] border-black p-5 md:p-8 rounded-2xl shadow-2xl flex flex-col gap-4 md:gap-6 max-h-[85vh] overflow-y-auto"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-3 right-3 md:top-4 md:right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header */}
                            <div className="text-center">
                                <h2 className="font-serif-display text-2xl md:text-3xl font-bold mb-1 md:mb-2">Pick Your Daily Meal.</h2>
                                <p className="text-gray-600 font-medium text-xs md:text-sm leading-relaxed mb-2 md:mb-4">
                                    Join the club to reduce your prices by unlocking exclusive savings.
                                </p>
                            </div>

                            {/* Savings Slider */}
                            <div className="bg-gray-50 p-3 md:p-4 rounded-xl border border-gray-200">
                                <div className="flex justify-between text-xs md:text-sm font-bold text-[#5C3A1A] mb-2">
                                    <span>Daily Spend: ₹{dailySpend}</span>
                                    <span className="text-green-600">Save ₹{monthlySavings}/mo</span>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="300"
                                    step="10"
                                    value={dailySpend}
                                    onChange={(e) => setDailySpend(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5C3A1A]"
                                />
                                <div className="flex justify-between text-[10px] md:text-xs text-gray-400 mt-1">
                                    <span>₹50</span>
                                    <span>₹300</span>
                                </div>
                            </div>

                            {/* Plan Stack */}
                            <div className="space-y-2 md:space-y-3">
                                <button
                                    onClick={() => handlePlanSelect('LIGHT_BITE')}
                                    className="w-full bg-white border-2 border-black p-3 md:p-4 rounded-xl flex items-center justify-between group hover:bg-black transition-all"
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-sm md:text-base group-hover:text-white flex items-center gap-2">
                                            Light Bite
                                            <span className="bg-[#D9F99D] text-[10px] px-2 py-0.5 rounded-full border border-black text-black group-hover:border-white">Basic</span>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:text-white transition-opacity" />
                                </button>

                                <button
                                    onClick={() => handlePlanSelect('FEAST_FUEL')}
                                    className="w-full bg-white border-2 border-black p-3 md:p-4 rounded-xl flex items-center justify-between group hover:bg-black transition-all"
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-sm md:text-base group-hover:text-white flex items-center gap-2">
                                            Feast & Fuel
                                            <Wifi className="w-3 h-3 text-blue-500" />
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:text-white transition-opacity" />
                                </button>

                                <button
                                    onClick={() => handlePlanSelect('ULTIMATE')}
                                    className="w-full bg-white border-2 border-black p-3 md:p-4 rounded-xl flex items-center justify-between group hover:bg-black transition-all"
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-sm md:text-base group-hover:text-white flex items-center gap-2">
                                            Ultimate
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:text-white transition-opacity" />
                                </button>

                                <button
                                    onClick={() => {
                                        console.log('Selected: Explore All');
                                        router.push('/subscription');
                                        setShowModal(false);
                                    }}
                                    className="w-full py-2 md:py-3 text-center text-xs md:text-sm font-bold underline decoration-2 underline-offset-4 hover:text-gray-600"
                                >
                                    Explore All Benefits
                                </button>
                            </div>

                            {/* Exit Intent */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-center text-[10px] md:text-xs text-gray-400 font-medium hover:text-gray-600 transition-colors"
                            >
                                Not right now
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
