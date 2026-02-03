import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redis } from './redis';

const SECRET_KEY = process.env.SESSION_SECRET || 'default-secret-change-me-in-prod';
const key = new TextEncoder().encode(SECRET_KEY);

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function createSession(userId: string, role: string) {
    const expires = new Date(Date.now() + SESSION_DURATION);
    const session = await encrypt({ userId, role, expires });

    // Store in cookie
    cookies().set('session', session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });

    // Optional: Store in Redis for white/blacklisting functionality
    if (redis) {
        // We can store active sessions per user to allow "Logout All"
        await redis.sadd(`user_sessions:${userId}`, session);
    }
}

export async function getSession() {
    const session = cookies().get('session')?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession() {
    const session = cookies().get('session')?.value;
    const payload = await decrypt(session || '');

    if (!session || !payload) return null;

    const expires = new Date(Date.now() + SESSION_DURATION);
    cookies().set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function logout() {
    // Determine userId from current session before destroying
    const s = await getSession();
    if (s && s.userId && redis) {
        const sessionToken = cookies().get('session')?.value;
        if (sessionToken) {
            await redis.srem(`user_sessions:${s.userId}`, sessionToken);
        }
    }

    // Destroy cookie
    cookies().set('session', '', { expires: new Date(0) });
}
