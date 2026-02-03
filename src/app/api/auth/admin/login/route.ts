import { NextRequest, NextResponse } from 'next/server';
import { AdminAuthService } from '@/services/adminAuthService';

export async function POST(req: NextRequest) {
    try {
        const { identifier, password } = await req.json();

        if (!identifier || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        // Step 1: Verify Password
        const result = await AdminAuthService.loginStep1(identifier, password);

        // Return success to prompt 2FA UI
        return NextResponse.json({
            success: true,
            require2FA: true,
            userId: result.userId,
            role: result.role
        });

    } catch (error: any) {
        console.error('Admin Login Error:', error);
        return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 401 });
    }
}
