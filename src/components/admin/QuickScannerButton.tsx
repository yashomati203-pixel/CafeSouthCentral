'use client';
import { Scan, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function QuickScannerButton() {
    return (
        <Link
            href="/admin-scan"
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] group"
        >
            <div className="absolute inset-0 bg-green-900 rounded-full animate-ping opacity-20 duration-1000 group-hover:animate-none"></div>
            <div className="relative flex items-center justify-center w-16 h-16 bg-[#166534] text-white rounded-full shadow-2xl hover:bg-[#14532d] hover:scale-110 transition-all cursor-pointer border-4 border-white/20 backdrop-blur-sm">
                <QrCode size={28} />
                <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-black/80 text-white text-xs py-1 px-3 rounded-full whitespace-nowrap pointer-events-none">
                    Open Scanner
                </span>
            </div>
        </Link>
    );
}
