import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';

// Firebase Configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: firebase.app.App | null = null;
let messaging: firebase.messaging.Messaging | null = null;

if (typeof window !== "undefined") {
    // Client-side initialization
    if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }

    // Get messaging instance
    try {
        messaging = firebase.messaging();
    } catch (e) {
        console.error("Messaging not supported:", e);
        messaging = null;
    }
}

export { app, messaging };
