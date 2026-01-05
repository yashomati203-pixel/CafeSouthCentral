importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
// REQUIRED: You must replace these with your actual values or inject them during build.
// Since we can't easily access process.env here without a build step, we use hardcoded placeholders
// or specific strings. PRO TIP: For a quick setup, hardcode your config here.

firebase.initializeApp({
  apiKey: "AIzaSyBUybK121JiSvTLk-FlCXAlbk6j_oUOcZw",
  authDomain: "cafe-app-57594.firebaseapp.com",
  projectId: "cafe-app-57594",
  storageBucket: "cafe-app-57594.firebasestorage.app",
  messagingSenderId: "438077825354",
  appId: "1:438077825354:web:4bf4b69cee5aff55b921b3",
  measurementId: "G-X0F55JX9T4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo.png' // Ensure this exists
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
