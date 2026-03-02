'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { X } from 'lucide-react';

const LandingPage = dynamic(() => import('@/components/marketing/LandingPage'));
const LoginPage = dynamic(() => import('@/components/auth/LoginPage'), { ssr: false });

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<{ id?: string; name: string; phone: string; role?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        const checkUser = () => {
            try {
                const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    if (['SUPER_ADMIN', 'MANAGER', 'KITCHEN_STAFF'].includes(parsedUser.role)) {
                        router.push('/admin/dashboard');
                        return;
                    }
                    setUser(parsedUser);
                } else {
                    const shouldLogin = searchParams.get('login');
                    if (shouldLogin === 'true') {
                        setTimeout(() => setShowLoginModal(true), 500);
                    }
                }
            } catch (e) {
                console.error("Failed to parse user", e);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(checkUser, 100);
        return () => clearTimeout(timer);
    }, [router, searchParams]);

    const handleLogin = async (userData: any, stayLoggedIn: boolean) => {
        try {
            let url = '/api/auth/verify-otp';
            let body = { ...userData };
            if (userData.password) {
                url = '/api/auth/admin/login';
                body = { identifier: userData.phone, password: userData.password };
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Login failed');
                return;
            }

            const fullUser = { ...userData, id: data.user?.id || data.userId, role: data.user?.role || data.role };
            if (stayLoggedIn) localStorage.setItem('cafe_user', JSON.stringify(fullUser));
            else sessionStorage.setItem('cafe_user', JSON.stringify(fullUser));

            if (['SUPER_ADMIN', 'MANAGER', 'KITCHEN_STAFF'].includes(fullUser.role)) {
                router.push('/admin/dashboard');
            } else {
                setUser(fullUser);
                setShowLoginModal(false);
                window.dispatchEvent(new Event('storage-update'));
                router.push('/menu');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to login.');
        }
    };

    if (showLoginModal && !user) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-300">
                <button
                    onClick={() => setShowLoginModal(false)}
                    className="absolute top-6 right-6 z-[110] p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all text-white backdrop-blur-md border border-white/20 shadow-lg"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="w-full max-w-sm relative z-10">
                    <LoginPage onLogin={handleLogin} />
                </div>
            </div>
        );
    }

    return (
        <LandingPage
            onExplore={() => router.push('/menu')}
            onViewPlans={() => router.push('/subscription')}
            onCategorySelect={(c) => router.push(`/menu?category=${encodeURIComponent(c)}`)}
            onLogin={() => setShowLoginModal(true)}
            user={user}
        />
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#e8f5e9] flex items-center justify-center">Loading...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
