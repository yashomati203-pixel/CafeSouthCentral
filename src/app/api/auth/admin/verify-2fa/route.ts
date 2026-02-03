import { NextRequest, NextResponse } from 'next/server';
import { AdminAuthService } from '@/services/adminAuthService';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
    try {
        const { userId, totpCode } = await req.json();

        if (!userId || !totpCode) {
            return NextResponse.json({ error: 'Missing 2FA code' }, { status: 400 });
        }

        // Step 2: Verify TOTP
        const { sessionToken, user } = await AdminAuthService.verify2FA(userId, totpCode);

        // Create session cookie
        const cookie = serialize('session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 8, // 8 hours
            path: '/',
            sameSite: 'strict'
        });

        const response = NextResponse.json({
            success: true,
            user: { id: user.id, name: user.name, role: user.role }
        });

        response.headers.append('Set-Cookie', cookie);

        return response;

    } catch (error: any) {
        console.error('Admin 2FA Error:', error);
        return NextResponse.json({ error: error.message || 'Invalid 2FA Code' }, { status: 401 });
    }
}
