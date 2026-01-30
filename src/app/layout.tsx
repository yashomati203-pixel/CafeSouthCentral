import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import ClickSpark from '@/components/ui/ClickSpark';
import SmoothScroll from '@/components/ui/SmoothScroll';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Cafe South Central',
    description: 'Premium Food Ordering Experience',
    manifest: '/manifest.json',
    icons: {
        icon: '/logo-final.png',
        shortcut: '/logo-final.png',
        apple: '/logo-final.png',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className} style={{ background: '#fefaef', minHeight: '100vh' }}>
                <SmoothScroll />
                <CartProvider>
                    {children}
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
