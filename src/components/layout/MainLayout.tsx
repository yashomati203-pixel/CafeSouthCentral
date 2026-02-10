'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import DesktopHeader from '@/components/layout/DesktopHeader';
import MobileHeader from '@/components/layout/MobileHeader';
import Footer from '@/components/layout/Footer';
import LoginPage from '@/components/auth/LoginPage';
import { X } from 'lucide-react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<any>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Initial User Check & Theme
    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("User parse error", e);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();

        // Listen for storage updates (login/logout)
        window.addEventListener('storage-update', checkUser);

        // Theme Check
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }

        return () => window.removeEventListener('storage-update', checkUser);
    }, [pathname, searchParams]);

    // Handle Login Modal Trigger from URL
    useEffect(() => {
        if (searchParams.get('login') === 'true') {
            if (!user) {
                setShowLoginModal(true);
            } else {
                // Remove login param if already logged in
                const params = new URLSearchParams(searchParams.toString());
                params.delete('login');
                router.replace(`${pathname}?${params.toString()}`);
            }
        }
    }, [searchParams, user, pathname, router]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleLogin = async (userData: any, stayLoggedIn: boolean) => {
        try {
            // Re-using login logic or ensuring the page handles it?
            // Ideally MainLayout handles the modal close and user set.
            // The actual API call is likely done inside LoginPage component, but we need to update state here.
            // Wait, LoginPage prop is onLogin which usually receives the user object after successful API call.

            // Let's assume onLogin passes the user object
            const fullUser = { ...userData }; // We might need to ensure ID/Role etc are present.
            // Actually, looking at page.tsx, the onLogin there does the API call? 
            // Wait, looking at page.tsx: onLogin={handleLogin}.
            // And handleLogin in page.tsx DOES THE FETCH.
            // This is messy. Logic should be in the LoginPage form or a service.

            // Let's look at LoginPage to see what it returns.
            // If I move the logic here, I need to copy the fetch logic from page.tsx.
            // OR I can refactor LoginPage to do the fetch.

            // For now, to be safe and quick, I will replicate the fetch logic from page.tsx here 
            // OR pass a simple handler if LoginPage does the heavy lifting.
            // Let's assume I need to implement the fetch logic here as per page.tsx.

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

            const activeUser = { ...userData, id: data.user?.id || data.userId, role: data.user?.role || data.role };
            if (stayLoggedIn) localStorage.setItem('cafe_user', JSON.stringify(activeUser));
            else sessionStorage.setItem('cafe_user', JSON.stringify(activeUser));

            setUser(activeUser);
            setShowLoginModal(false);
            window.dispatchEvent(new Event('storage-update'));

            // Redirect if admin
            if (['SUPER_ADMIN', 'MANAGER', 'KITCHEN_STAFF'].includes(activeUser.role)) {
                router.push('/admin/dashboard');
            }

        } catch (error) {
            console.error('Login error', error);
            alert('Login failed');
        }
    };

    // Determine if we should hide headers/footers (e.g. admin pages, although req says GLOBAL)
    // Usually Admin has its own layout. If current path is /admin, maybe we shouldn't show this header?
    // But current layout.tsx wraps everything.
    // Let's check if user is on admin dashboard.
    const isAdminPage = pathname?.startsWith('/admin');

    // Also checkout usually has minimal header.
    const isCheckout = pathname?.startsWith('/checkout');

    if (isAdminPage) {
        return <>{children}</>;
    }

    return (
        <>
            {!isCheckout && (
                <>
                    <DesktopHeader
                        user={user}
                        onLoginClick={() => setShowLoginModal(true)}
                    />
                    <MobileHeader
                        user={user}
                        isDarkMode={isDarkMode}
                        toggleTheme={toggleTheme}
                        onLoginClick={() => setShowLoginModal(true)}
                        onProfileClick={() => router.push('/account')}
                    />
                </>
            )}

            {children}

            {!isCheckout && <Footer />}

            {showLoginModal && (
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
            )}
        </>
    );
};

export default MainLayout;
