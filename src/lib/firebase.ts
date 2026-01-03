import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, Messaging, isSupported } from "firebase/messaging";

// TODO: Replace with your actual Firebase Configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let messaging: Messaging | null = null;

if (typeof window !== "undefined") {
    // Client-side initialization
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

    // Check if messaging is supported (e.g., specific browsers, not usually in standard PWA on iOS unless configured carefully)
    isSupported().then(supported => {
        if (supported) {
            messaging = getMessaging(app);
        }
    });
}

export { app, messaging };
