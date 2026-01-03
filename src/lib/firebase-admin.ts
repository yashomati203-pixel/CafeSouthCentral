import admin from 'firebase-admin';

// Initialize lazily or safely
let messaging: admin.messaging.Messaging;

try {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Replace escaped newlines if present
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    }
    messaging = admin.messaging();
} catch (error) {
    console.error('Firebase Admin initialization error', error);
    // @ts-ignore - Exporting null/undefined to avoid crash on import, but caller must handle
    messaging = null;
}

export { messaging };
