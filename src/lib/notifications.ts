export async function requestNotificationPermission() {
    if (!('Notification' in window)) {

        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

export function sendLocalNotification(title: string, body: string) {
    if (Notification.permission === 'granted') {
        const options = {
            body: body,
            icon: '/icon-192x192.png',
            vibrate: [200, 100, 200],
            badge: '/badge-72x72.png', // Android badge
        };

        // Try to use Service Worker registration if available (better for mobile)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, options);
            });
        } else {
            // Fallback to standard Notification API
            new Notification(title, options);
        }
    }
}

export async function enableNotifications(user: { id: string }) {
    if (!('Notification' in window)) {
        alert('This browser does not support desktop notification');
        return false;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        try {
            // Wait for the PWA service worker to be ready (next-pwa auto-registers it)
            if ('serviceWorker' in navigator) {
                await navigator.serviceWorker.ready;
                console.log('Service Worker ready');
            }

            const { messaging } = await import('@/lib/firebase');

            if (!messaging) {
                alert('Messaging not supported on this browser');
                return false;
            }

            const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim();

            if (!vapidKey) {
                alert('VAPID key not configured. Please contact support.');
                return false;
            }

            const token = await messaging.getToken({
                vapidKey: vapidKey
            });

            if (token) {
                await fetch('/api/notifications/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, token })
                });
                alert('Notifications enabled! 🔔');
                return true;
            } else {
                alert('Could not generate token. Try checking browser settings.');
                return false;
            }
        } catch (e: any) {
            console.error("Token error", e);
            alert(`Error enabling notifications: ${e.message}`);
            return false;
        }
    } else {
        alert('Permission denied. Please enable notifications in browser settings.');
        return false;
    }
}
