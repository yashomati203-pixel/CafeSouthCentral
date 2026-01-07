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
};

module.exports = withPWA(nextConfig);
