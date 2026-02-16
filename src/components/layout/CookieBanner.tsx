'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consented = localStorage.getItem('cookie_consent');
        if (!consented) {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                    <p>
                        We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                        {' '}
                        <span className="underline decoration-gray-400 decoration-1 underline-offset-2">
                            Privacy Policy
                        </span>.
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-[#0e2a1a] text-white text-sm font-bold rounded-lg hover:bg-[#1a4a2e] transition-colors shadow-sm active:scale-95"
                    >
                        Accept All
                    </button>
                    <button
                        onClick={handleAccept} // For now same behavior
                        className="flex-1 md:flex-none px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors active:scale-95"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
}
