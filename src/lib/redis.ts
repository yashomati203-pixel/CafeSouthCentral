import { Redis } from '@upstash/redis';

// Initialize Redis client
// We allow falling back to a dummy implementation for local dev if keys aren't present
// to prevent the app from crashing during initial setup.

// In-memory store for development
class MockRedis {
    private store = new Map<string, string>();
    private expiries = new Map<string, number>();

    async get(key: string) {
        // Check expiry
        const expiry = this.expiries.get(key);
        if (expiry && Date.now() > expiry) {
            this.del(key);
            return null;
        }
        return this.store.get(key) || null;
    }

    async setex(key: string, seconds: number, value: string) {
        this.store.set(key, value);
        this.expiries.set(key, Date.now() + seconds * 1000);
        return 'OK';
    }

    async set(key: string, value: string) {
        this.store.set(key, value);
        this.expiries.delete(key); // Remove existing expiry if any
        return 'OK';
    }

    async del(key: string) {
        this.store.delete(key);
        this.expiries.delete(key);
        return 1;
    }

    async incr(key: string) {
        const val = parseInt(this.store.get(key) || '0', 10);
        const newVal = val + 1;
        this.store.set(key, newVal.toString());
        return newVal;
    }

    async expire(key: string, seconds: number) {
        if (this.store.has(key)) {
            this.expiries.set(key, Date.now() + seconds * 1000);
            return 1;
        }
        return 0;
    }

    async ttl(key: string) {
        const expiry = this.expiries.get(key);
        if (!expiry) return -1;
        const remaining = Math.ceil((expiry - Date.now()) / 1000);
        return remaining > 0 ? remaining : -2;
    }

    // Set operations for session management
    private sets = new Map<string, Set<string>>();

    async sadd(key: string, member: string) {
        if (!this.sets.has(key)) {
            this.sets.set(key, new Set());
        }
        const s = this.sets.get(key);
        const added = s!.has(member) ? 0 : 1;
        s!.add(member);
        return added;
    }

    async srem(key: string, member: string) {
        const s = this.sets.get(key);
        if (s && s.has(member)) {
            s.delete(member);
            return 1;
        }
        return 0;
    }
}

const getRedis = () => {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        return new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }

    // Fallback to Mock for development
    if (process.env.NODE_ENV !== 'production') {
        if (!global.redisWarned) {
            console.warn('⚠️  Redis credentials not found. Using In-Memory Mock Redis (Data will be lost on restart).');
            global.redisWarned = true;
        }
        // Use a global singleton for the mock to persist across hot reloads in dev if possible,
        // though in Next.js serverless functions, state might reset. 
        // For 'npm run dev', global this works.
        if (!global.mockRedis) {
            global.mockRedis = new MockRedis();
        }
        return global.mockRedis;
    }

    return null;
};

// Add types for global
declare global {
    var redisWarned: boolean;
    var mockRedis: any;
}

export const redis = getRedis();

