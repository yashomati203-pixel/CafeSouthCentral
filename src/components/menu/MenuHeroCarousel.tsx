'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

// Promo Action Types
type ActionType = 'ADD_TO_CART' | 'SCROLL_TO_CATEGORY' | 'OPEN_RTE_MODAL';

interface PromoSlide {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    actionType: ActionType;
    targetId?: string; // e.g., Category name like 'Beverages' or item ID like 'item-123'
    buttonText: string;
}

const PROMOS: PromoSlide[] = [
    {
        id: 'promo-combo-1',
        image: '/images/promos/combo-dosa.png',
        title: 'Monsoon Special',
        subtitle: 'Masala Dosa + Filter Coffee Combo',
        actionType: 'ADD_TO_CART',
        targetId: 'combo-dosa-coffee', // Example ID, we might need to create this in mock data
        buttonText: 'Add to Cart - ₹149'
    },
    {
        id: 'promo-rte',
        image: '/images/promos/ready-to-eat.png',
        title: 'In a Hurry?',
        subtitle: 'Order our Ready To Eat Items Instantly',
        actionType: 'OPEN_RTE_MODAL',
        buttonText: 'View Hot Items'
    },
    {
        id: 'promo-beverages',
        image: '/images/promos/beverages.png',
        title: 'Beat the Heat',
        subtitle: 'Refreshing Cold Beverages & Frappes',
        actionType: 'SCROLL_TO_CATEGORY',
        targetId: 'Beverages',
        buttonText: 'Explore Beverages'
    }
];

interface MenuHeroCarouselProps {
    onAddToCart?: (itemId: string) => void;
    onScrollToCategory?: (categoryName: string) => void;
    onOpenRTEModal?: () => void;
}

export default function MenuHeroCarousel({ onAddToCart, onScrollToCategory, onOpenRTEModal }: MenuHeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-play timer
    useEffect(() => {
        if (isHovered) return;

        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % PROMOS.length);
        }, 5000); // 5 seconds per slide

        return () => clearInterval(timer);
    }, [isHovered]);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % PROMOS.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + PROMOS.length) % PROMOS.length);
    };

    const handleActionClick = (slide: PromoSlide) => {
        switch (slide.actionType) {
            case 'ADD_TO_CART':
                if (slide.targetId && onAddToCart) onAddToCart(slide.targetId);
                break;
            case 'SCROLL_TO_CATEGORY':
                if (slide.targetId && onScrollToCategory) onScrollToCategory(slide.targetId);
                break;
            case 'OPEN_RTE_MODAL':
                if (onOpenRTEModal) onOpenRTEModal();
                break;
        }
    };

    return (
        <div
            className="relative w-[calc(100%+3rem)] -mx-6 md:w-full md:mx-0 overflow-hidden bg-transparent pt-0 pb-6 md:pb-8"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* The Aspect Ratio Container for the slides */}
            <div className="relative w-full max-w-7xl mx-auto md:px-4 aspect-[16/9] sm:aspect-[21/9] md:aspect-[3/1] md:rounded-2xl overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        initial={{ opacity: 0.9, x: direction > 0 ? '100%' : '-100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0.9, x: direction > 0 ? '-100%' : '100%', zIndex: -1 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        dragMomentum={false}
                        onDragEnd={(e, { offset }) => {
                            if (offset.x < -60) {
                                handleNext();
                            } else if (offset.x > 60) {
                                handlePrev();
                            }
                        }}
                    >
                        {/* Slide Image Background */}
                        <div className="absolute inset-0 w-full h-full">
                            <Image
                                src={PROMOS[currentIndex].image}
                                alt={PROMOS[currentIndex].title}
                                fill
                                className="object-cover"
                                priority={currentIndex === 0}
                            />
                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                        </div>

                        {/* Slide Content */}
                        <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-12 md:p-16 w-full lg:w-2/3">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white font-serif mb-2 leading-tight"
                                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
                            >
                                {PROMOS[currentIndex].title}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-sm sm:text-lg md:text-xl text-gray-200 mb-6 max-w-md font-medium"
                                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                            >
                                {PROMOS[currentIndex].subtitle}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <button
                                    onClick={() => handleActionClick(PROMOS[currentIndex])}
                                    className="bg-[#14b84b] hover:bg-[#11a342] text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transform transition-transform hover:scale-105 active:scale-95"
                                >
                                    {PROMOS[currentIndex].buttonText}
                                    {PROMOS[currentIndex].actionType === 'ADD_TO_CART' && <ShoppingBag className="w-4 h-4" />}
                                    {PROMOS[currentIndex].actionType !== 'ADD_TO_CART' && <ChevronRight className="w-4 h-4" />}
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows (Hidden on mobile) */}
                <button
                    onClick={handlePrev}
                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full hidden md:flex items-center justify-center transition-colors backdrop-blur-sm border border-white/20"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full hidden md:flex items-center justify-center transition-colors backdrop-blur-sm border border-white/20"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Slide Indicators (Dots) */}
            <div className="flex justify-center gap-2 mt-4">
                {PROMOS.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${currentIndex === idx
                            ? 'w-8 h-2 bg-[#14b84b]'
                            : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
