'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DesktopHeader from '@/components/layout/DesktopHeader';
import MobileHeader from '@/components/layout/MobileHeader';
import MemberDashboard from '@/components/subscription/MemberDashboard';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';

export default function SubscriptionPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [currentSub, setCurrentSub] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Load user data & Check Dark Mode
        const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }

        // Fetch Subscription Status
        const fetchSub = async () => {
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                try {
                    const res = await fetch(`/api/user/subscription?userId=${userData.id}`, { cache: 'no-store' });
                    if (res.ok) {
                        const data = await res.json();
                        // Assuming the API returns null or empty object if no sub
                        if (data && data.status === 'ACTIVE') { // Add rigorous check based on your API response structure
                            setCurrentSub(data);
                        } else if (data && data.validUntil && new Date(data.validUntil) > new Date()) {
                            // Fallback check if 'status' field isn't explicitly 'ACTIVE' but date is valid
                            setCurrentSub(data);
                        } else {
                            // Mocking active sub for demo purposes if user is logged in (REMOVE IN PRODUCTION)
                            // setCurrentSub({ plan: 'FEAST_FUEL', validUntil: new Date(Date.now() + 86400000 * 15) });
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch subscription", e);
                }
            }
            setLoading(false);
        };
        fetchSub();
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="animate-pulse text-primary-green">Loading...</div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-background-light dark:bg-background-dark font-sans text-forest-green dark:text-white flex flex-col`}>
            {/* Main Content */}
            <main className="flex-grow">
                {currentSub ? (
                    <MemberDashboard user={user} toggleTheme={toggleTheme} />
                ) : (
                    <SubscriptionPlans />
                )}
            </main>
        </div>
    );
}
