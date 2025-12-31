export async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log("This browser does not support desktop notification");
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
