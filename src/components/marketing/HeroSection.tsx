
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import FoodCarousel from './FoodCarousel';
import RotatingBadge from './RotatingBadge';
import { User } from 'lucide-react';
import { DecorativeBorderLogo } from '@/components/ui/DecorativeBorder';

interface HeroSectionProps {
    onExplore?: () => void;
    onLoginClick?: () => void;
    user?: any;
}

export default function HeroSection({ onExplore, onLoginClick, user }: HeroSectionProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <section className="relative min-h-[90vh] flex flex-col overflow-hidden px-4 md:px-16 lg:px-24 py-4 max-w-full w-full mx-auto">



            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col px-6 pt-6">
                {/* Center Quote - Mobile */}
                <div className="w-full text-center pb-4">
                    <p className="font-serif italic text-lg opacity-80 text-[#102214]">
                        &quot;You become what you eat&quot;
                    </p>
                </div>

                {/* Main Headline - Mobile */}
                <h1 className="font-serif text-4xl font-extrabold leading-tight mb-6 text-center text-[#2f4f2f]">
                    Healthy breakfast.<br />
                    Quick bites.<br />
                    Clean lunch.
                </h1>

                {/* Subheadline - Mobile */}
                <p className="text-lg font-medium mb-8 text-center opacity-90 text-[#4a5d50] font-serif">
                    We've got a plate ready for you.
                </p>

                {/* CTA Button - Mobile */}
                <Link
                    href="/menu"
                    className="w-full bg-[#102214] text-[#f7e231] py-5 px-8 rounded-full font-bold text-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all mb-4 font-serif block text-center"
                >
                    Explore Menu
                </Link>

                {/* Tagline - Mobile */}
                <p className="mt-2 mb-8 text-sm font-medium italic opacity-60 text-center text-[#4a5d50]">
                    Deadlines can wait. Good food can't.
                </p>

                {/* Static Collage - Mobile (Replaces Grid) */}
                <div className="relative h-[380px] w-full mb-8 overflow-visible">
                    {/* Fresh Badge - Moving further below Idli and to the right */}
                    <div className="absolute top-[33%] right-[-10%] z-30 transform rotate-12">
                        <RotatingBadge />
                    </div>

                    {/* Idli Plate - Top Right (Moved with Badge) */}
                    <div className="absolute w-[45%] max-w-[160px] z-10 right-[0%] top-[0%]">
                        <div className="relative w-full pb-[100%] overflow-hidden bg-white shadow-xl"
                            style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}>
                            <Image
                                src="/images/hero/Idli vada.png"
                                alt="Idli"
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Dosa Plate - Center/Left (Large) */}
                    <div className="absolute w-[80%] max-w-[300px] z-20 left-[-5%] top-[25%]">
                        <div className="relative w-full pb-[100%] overflow-hidden bg-white shadow-2xl"
                            style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}>
                            <Image
                                src="/images/hero/Dosa.png"
                                alt="Dosa Plate"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{ objectFit: 'cover', scale: '1.1' }}
                            />
                        </div>
                    </div>

                    {/* Coffee - Bottom Right (Visible) */}
                    <div className="absolute w-[35%] max-w-[130px] z-30 right-[2%] bottom-[10%]">
                        <div className="relative w-full pb-[100%] overflow-hidden bg-white shadow-xl"
                            style={{ borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%' }}>
                            <Image
                                src="/images/hero/Filter coffee.png"
                                alt="Filter Coffee"
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Action Cards - Mobile */}
                <div className="hidden grid grid-cols-2 gap-4 pb-8">
                    <Link
                        href="/menu"
                        className="bg-white p-4 rounded-xl border border-[#102214]/5 flex flex-col items-center gap-2 text-center hover:shadow-md transition-shadow"
                    >
                        <div className="w-12 h-12 bg-[#f7e231] rounded-full flex items-center justify-center">
                            <span className="text-2xl">🍽️</span>
                        </div>
                        <span className="font-bold text-sm text-[#102214]">Explore Menu</span>
                    </Link>
                    <Link href="/subscription" className="bg-white p-4 rounded-xl border border-[#102214]/5 flex flex-col items-center gap-2 text-center hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-[#f7e231] rounded-full flex items-center justify-center">
                            <span className="text-2xl">⭐</span>
                        </div>
                        <span className="font-bold text-sm text-[#102214]">Subscriptions</span>
                    </Link>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
                {/* Center Quote - Desktop */}
                <div className="w-full text-center pt-2 pb-2 relative z-20">
                    <p className="font-serif italic text-2xl md:text-3xl opacity-90 text-[#102214]">
                        &quot;You become what you eat&quot;
                    </p>
                </div>

                {/* Main Content Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '1rem',
                    flex: 1,
                    alignItems: 'center',
                    position: 'relative',
                    paddingBottom: '1rem',
                    maxWidth: '1600px',
                    width: '100%',
                    margin: '0 auto',
                    zIndex: 10
                }}>

                    {/* Left Content */}
                    <div style={{ paddingRight: '1rem', paddingLeft: '3rem', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                        {/* Main Headline */}
                        <h1 className="font-serif text-5xl md:text-7xl font-black leading-tight mb-4 max-w-4xl text-[#2f4f2f]">
                            Healthy breakfast.<br />
                            Quick bites.<br />
                            Clean lunch.
                        </h1>

                        <div className="flex flex-col items-center text-center w-fit self-start">
                            {/* Subheadline */}
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#5c3a1a] font-serif">
                                We've got a plate ready for you.
                            </h2>

                            {/* CTA Button */}
                            <div className="flex flex-col sm:flex-row gap-6 mb-4 justify-center">
                                <Link
                                    href="/menu"
                                    className="bg-[#102214] text-[#f7e231] px-14 py-5 rounded-full text-2xl font-bold shadow-xl hover:scale-105 transition-transform font-serif"
                                >
                                    Explore Menu
                                </Link>
                            </div>

                            {/* Tagline */}
                            <p className="mt-2 text-[#4a5d50] text-xl font-medium font-serif italic">
                                Deadlines can wait. Good food can't.
                            </p>
                        </div>
                    </div>

                    {/* Right Content - Abstract Collage */}
                    <div className="relative h-full min-h-[500px] flex items-center justify-center -translate-x-12">

                        {/* Dosa Plate - Center Large Blob - Moved UP */}
                        <div className="absolute w-[70%] max-w-[450px] z-10 left-[5%] top-[10%] animate-float-slow">
                            <div className="relative w-full pb-[100%] overflow-hidden bg-white shadow-2xl"
                                style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}>
                                <Image
                                    src="/images/hero/Dosa.png"
                                    alt="Dosa Plate"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{ objectFit: 'cover', transform: 'scale(1.1)' }}
                                />
                            </div>
                        </div>

                        {/* Idli Plate - Top Right Small Blob - Moved UP */}
                        <div className="absolute w-[35%] max-w-[220px] z-0 right-[5%] top-[5%] animate-float-medium">
                            <div className="relative w-full pb-[100%] overflow-hidden bg-white shadow-xl"
                                style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}>
                                <Image
                                    src="/images/hero/Idli vada.png"
                                    alt="Idli"
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>

                            {/* Fresh Badge - Attached to Idli */}
                            <div className="absolute -top-4 -right-4 z-20 bg-[#f0fdf4] border-2 border-[#102214] text-[#102214] rounded-full w-24 h-24 flex items-center justify-center text-center shadow-lg rotate-12">
                                <span className="font-serif font-bold text-xs leading-tight">
                                    100% Fresh<br />•<br />100%<br />Made Today
                                </span>
                            </div>
                        </div>

                        {/* Coffee - Bottom Right Small Blob - Moved UP slightly if needed, but relative to others */}
                        <div className="absolute w-[30%] max-w-[180px] z-20 right-[10%] bottom-[10%] animate-float-fast">
                            <div className="relative w-full pb-[100%] overflow-hidden bg-white shadow-xl"
                                style={{ borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%' }}>
                                <Image
                                    src="/images/hero/Filter coffee.png"
                                    alt="Filter Coffee"
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
