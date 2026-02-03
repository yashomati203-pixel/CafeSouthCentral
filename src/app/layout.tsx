import type { Metadata } from 'next';
import { Inter, Manrope, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import ClickSpark from '@/components/ui/ClickSpark';
import SmoothScroll from '@/components/ui/SmoothScroll';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

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
            <body className={`${inter.variable} ${manrope.variable} ${playfair.variable} font-sans`} style={{ background: '#e2e9e0', minHeight: '100vh' }}>
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
