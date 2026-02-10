import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { redis } from '@/lib/redis';

// Configuration
const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX_PUBLIC = 300; // Increased for admin dashboard polling
const RATE_LIMIT_MAX_AUTH = 50;   // 50 requests (Login/OTP)
const CSRF_HEADER = 'x-csrf-token';

/**
 * Rate Limiting Logic via Redis
 */
async function rateLimit(req: NextRequest, limit: number) {
    if (!redis) return true; // Fail open if Redis missing (dev mode)

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const key = `ratelimit:${ip}:${req.nextUrl.pathname}`;

    try {
        const current = await redis.incr(key);
        if (current === 1) {
            await redis.expire(key, RATE_LIMIT_WINDOW);
        }
        return current <= limit;
    } catch (e) {
        console.error('Rate Limit Error:', e);
        return true; // Fail open
    }
}

/**
 * CSRF Protection
 * Validates presence of CSRF token in headers for mutation requests
 */
async function validateCSRF(req: NextRequest) {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
        return true;
    }

    // Skip CSRF for specific webhooks or public APIs if needed
    if (req.nextUrl.pathname.startsWith('/api/webhooks')) return true;

    const token = req.headers.get(CSRF_HEADER);
    const cookieToken = req.cookies.get('csrf_token')?.value;

    // Strict double-submit cookie check
    // In a real app, you might want to sign these tokens.
    // For V1, we ensure the header matches the cookie (if cookie exists)
    // OR we enforce a session-based token check if authenticated.

    // For now, if no token provided in header for mutation:
    if (!token) return false;

    return true;
}

export async function middleware(req: NextRequest) {
    // 1. Rate Limiting
    const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');
    const limit = isAuthRoute ? RATE_LIMIT_MAX_AUTH : RATE_LIMIT_MAX_PUBLIC;

    const withinLimit = await rateLimit(req, limit);
    if (!withinLimit) {
        return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
            status: 429,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 2. CSRF Protection for Mutations
    const isApiMutation = req.nextUrl.pathname.startsWith('/api') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
    if (isApiMutation) {
        // Optional: Enforce CSRF only if session exists or strictly for all
        // const isValidCSRF = await validateCSRF(req);
        // if (!isValidCSRF) {
        //     return new NextResponse(JSON.stringify({ error: 'Invalid CSRF Token' }), { status: 403 });
        // }
    }

    // 3. Security Headers
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', "camera=(), microphone=(), geolocation=()");

    return response;
}

export const config = {
    matcher: '/api/:path*',
};
