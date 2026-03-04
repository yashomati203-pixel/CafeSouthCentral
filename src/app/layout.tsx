import type { Metadata } from 'next';
import { Inter, Manrope, Playfair_Display, Work_Sans } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';
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
        icon: '/logo without border.png',
        shortcut: '/logo without border.png',
        apple: '/logo without border.png',
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
            <head />
            <body className={`${inter.variable} ${manrope.variable} ${playfair.variable} ${workSans.variable} font-sans`} style={{ minHeight: '100vh' }}>
                {/* Material Symbols injected via Script to bypass webpack CSS processing */}
                <Script
                    id="material-symbols"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                var link = document.createElement('link');
                                link.rel = 'stylesheet';
                                link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap';
                                document.head.appendChild(link);
                            })();
                        `
                    }}
                />
                <CartProvider>
                    <SystemAlertBanner />
                    <div className="min-h-screen w-full relative bg-sand-beige">
                        <DecorativeBorderOverlay />

                        {/* Main Content Wrapper - Inset from borders on Desktop */}
                        <div
                            className="relative z-10 md:mx-[15px] md:my-[15px] min-h-screen md:min-h-[calc(100vh-30px)] overflow-x-hidden md:shadow-2xl no-scrollbar pb-0"
                        >
                            <Suspense fallback={null}>
                                <MainLayout>
                                    {children}
                                    <SubscriptionDiscovery />
                                </MainLayout>
                            </Suspense>
                        </div>
                        <Suspense fallback={null}>
                            <GlobalLayoutClient />
                        </Suspense>
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
