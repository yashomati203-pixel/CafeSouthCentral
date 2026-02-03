import { Redis } from '@upstash/redis';

// Initialize Redis client
// We allow falling back to a dummy implementation for local dev if keys aren't present
// to prevent the app from crashing during initial setup.
const getRedis = () => {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        return new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }

    // Warn only once
    if (process.env.NODE_ENV !== 'production' && !global.redisWarned) {
        console.warn('⚠️  Redis credentials not found. Rate limiting and sessions will fallback to memory (NOT for production).');
        global.redisWarned = true;
    }

    // Mock for development (In-memory, non-persistent) - Optional, 
    // but better to force user to provide keys for "Production-Grade" request.
    // For now, returning null to force error or handle gracefully in caller.
    return null;
};

export const redis = getRedis();
