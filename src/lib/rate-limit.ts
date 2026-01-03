type RateLimitStore = Map<string, { count: number; resetTime: number }>;

const rateLimitStore: RateLimitStore = new Map();

interface RateLimitConfig {
    limit: number; // Max requests within window
    windowMs: number; // Window size in milliseconds
}

/**
 * Simple in-memory rate limiter.
 * Note: This state is reset if the server restarts (or likely on every request in Serverless functions).
 * Ideally, use Vercel KV or Redis for production.
 */
export function rateLimit(ip: string, config: RateLimitConfig = { limit: 10, windowMs: 60000 }) {
    const now = Date.now();
    const record = rateLimitStore.get(ip) || { count: 0, resetTime: now + config.windowMs };

    if (now > record.resetTime) {
        record.count = 0;
        record.resetTime = now + config.windowMs;
    }

    record.count++;
    rateLimitStore.set(ip, record);

    return record.count <= config.limit;
}
