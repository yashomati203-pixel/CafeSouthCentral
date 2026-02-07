const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    // Use custom service worker to include Firebase messaging
    sw: 'firebase-messaging-sw.js',
    buildExcludes: [/middleware-manifest\.json$/]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    images: {
        domains: [
            'lh3.googleusercontent.com', // Google Auth
            'res.cloudinary.com',        // If using Cloudinary
            'images.unsplash.com',       // Stock images
            'placehold.co'               // Placeholders
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://checkout.razorpay.com https://js.pusher.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://checkout.razorpay.com https://lumberjack.razorpay.com https://*.pusher.com wss://*.pusher.com; frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com;",
                    }
                ],
            },
        ];
    },
};

module.exports = withPWA(nextConfig);
