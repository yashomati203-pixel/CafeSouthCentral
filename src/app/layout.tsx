import type { Metadata } from 'next';
import { Inter, Manrope, Playfair_Display, Work_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import ClickSpark from '@/components/ui/ClickSpark';
import SubscriptionDiscovery from '@/components/SubscriptionDiscovery';
import { DecorativeBorderOverlay } from '@/components/ui/DecorativeBorder';
import GlobalLayoutClient from '@/components/layout/GlobalLayoutClient';
import MainLayout from '@/components/layout/MainLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const workSans = Work_Sans({ subsets: ['latin'], variable: '--font-work-sans' });

export const metadata: Metadata = {
    title: 'Cafe South Central',
    description: 'Premium Food Ordering Experience',
    manifest: '/manifest.json',
    icons: {
        icon: '/Final-logo.png',
        shortcut: '/Final-logo.png',
        apple: '/Final-logo.png',
    },
};

import { Toaster } from 'sonner';

import SystemAlertBanner from '@/components/layout/SystemAlertBanner';

// ...

import CookieBanner from '@/components/layout/CookieBanner';

// ...

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" rel="stylesheet" />
            </head>
            <body className={`${inter.variable} ${manrope.variable} ${playfair.variable} ${workSans.variable} font-sans`} style={{ minHeight: '100vh', overflow: 'hidden' }}>
                <CartProvider>
                    <SystemAlertBanner />
                    <div className="min-h-screen w-full relative">
                        <DecorativeBorderOverlay />

                        {/* Main Content Wrapper - Inset from borders */}
                        <div
                            className="relative z-10 mx-[5px] md:mx-[15px] mt-[15px] mb-[15px] md:mb-[15px] h-[calc(100dvh-30px)] md:h-[calc(100vh-30px)] overflow-y-auto overflow-x-hidden shadow-2xl no-scrollbar pb-0 bg-sand-beige"
                        >
                            <MainLayout>
                                {children}
                                <SubscriptionDiscovery />
                            </MainLayout>
                        </div>
                        <GlobalLayoutClient />
                        <Toaster richColors position="top-center" />
                        <CookieBanner />
                    </div>
                </CartProvider>
                <ClickSpark
                    sparkColor="#D4AF37"
                    sparkSize={8}
                    sparkRadius={20}
                    sparkCount={8}
                    duration={500}
                    easing="ease-out"
                    extraScale={1.2}
                />
            </body>
        </html>
    );
}
