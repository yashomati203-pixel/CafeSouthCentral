'use client';

import {
    Cross2Icon,
    ExitIcon,
    ReaderIcon,
    StarIcon,
    ChatBubbleIcon
} from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

interface MobileProfileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onLogout: () => void;
    onFeedback: () => void;
}

export default function MobileProfileMenu({
    isOpen,
    onClose,
    user,
    onLogout,
    onFeedback
}: MobileProfileMenuProps) {
    const router = useRouter();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-[75%] max-w-sm h-full bg-white dark:bg-[#1e1e1e] shadow-2xl p-6 animate-in slide-in-from-right duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    <Cross2Icon width={24} height={24} />
                </button>

                <div className="mt-8 mb-8">
                    <div className="w-16 h-16 rounded-full bg-[#5C3A1A] text-white flex items-center justify-center text-2xl font-bold mb-4">
                        {user?.name?.[0]?.toUpperCase() || 'G'}
                    </div>
                    <h2 className="text-xl font-bold text-[#5C3A1A] dark:text-white">
                        {user?.name || 'Guest'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.phone || ''}
                    </p>
                </div>

                <nav className="flex flex-col gap-4">
                    <button
                        onClick={() => { router.push('/orders'); onClose(); }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ReaderIcon className="w-5 h-5" />
                        <span className="font-medium">Order History</span>
                    </button>

                    <button
                        onClick={() => { router.push('/subscription'); onClose(); }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <StarIcon className="w-5 h-5" />
                        <span className="font-medium">Subscription Plans</span>
                    </button>

                    <button
                        onClick={() => { onFeedback(); onClose(); }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ChatBubbleIcon className="w-5 h-5" />
                        <span className="font-medium">Send Feedback</span>
                    </button>

                    <button
                        onClick={async () => {
                            const { requestNotificationPermission } = await import('@/lib/notifications');
                            const granted = await requestNotificationPermission();
                            if (granted) {
                                try {
                                    // Dynamically import to ensure client-side execution
                                    const { getMessaging, getToken } = await import('firebase/messaging');
                                    const { app } = await import('@/lib/firebase');

                                    const messaging = getMessaging(app);
                                    const token = await getToken(messaging, {
                                        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
                                    });

                                    if (token) {
                                        await fetch('/api/notifications/register', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ userId: user.id, token })
                                        });
                                        alert('Notifications enabled! 🔔');
                                    } else {
                                        alert('Could not generate token. Try checking browser settings.');
                                    }
                                } catch (e) {
                                    console.error("Token error", e);
                                    alert(`Error enabling notifications: ${e.message}`);
                                }
                            } else {
                                alert('Permission denied. Please enable notifications in browser settings.');
                            }
                            onClose();
                        }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="w-5 h-5 text-center">🔔</span>
                        <span className="font-medium">Enable Notifications</span>
                    </button>

                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

                    <button
                        onClick={() => { onLogout(); onClose(); }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <ExitIcon className="w-5 h-5" />
                        <span className="font-medium">Log Out</span>
                    </button>
                </nav>
            </div>
        </div>
    );
}
