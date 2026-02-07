import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { notificationService } from '@/services/notificationService';
import crypto from 'crypto';
import * as argon2 from 'argon2';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phone } = body;

        // 1. Validate Phone
        if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
            return NextResponse.json(
                { error: 'Invalid phone number. Must be a valid 10-digit Indian number.' },
                { status: 400 }
            );
        }

        if (!redis) {
            return NextResponse.json(
                { error: 'Server misconfiguration: Redis not connected' },
                { status: 500 }
            );
        }

        // 2. Rate Limiting (3 requests per 5 minutes)
        const rateLimitKey = `ratelimit:otp:${phone}`;
        const requestCount = await redis.incr(rateLimitKey);

        if (requestCount === 1) {
            await redis.expire(rateLimitKey, 300); // 5 minutes window
        }

        if (requestCount > 3) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again in 5 minutes.' },
                { status: 429 }
            );
        }

        // 3. Check for Existing Valid/Locked OTP
        const otpKey = `otp:${phone}`;
        const existing: string | null = await redis.get(otpKey);

        if (existing) {
            const record = JSON.parse(existing);

            // Check Lock
            if (record.lockedUntil && new Date(record.lockedUntil) > new Date()) {
                const remainingMinutes = Math.ceil((new Date(record.lockedUntil).getTime() - Date.now()) / 60000);
                return NextResponse.json(
                    { error: `Account temporarily locked. Try again in ${remainingMinutes} minutes.` },
                    { status: 423 } // Locked
                );
            }
        }

        // 4. Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // 5. Hash OTP (Security best practice: never store plaintext OTPs)
        const hashedOTP = await argon2.hash(otp);

        // 6. Store in Redis (TTL: 5 minutes)
        const otpRecord = {
            hashedOTP,
            attempts: 0,
            createdAt: new Date().toISOString()
        };

        await redis.setex(otpKey, 300, JSON.stringify(otpRecord));

        // 7. Send WhatsApp OTP
        // In Dev: This will log to console if credentials missing
        const sent = await notificationService.sendOTP(phone, otp);

        if (!sent) {
            // Fallback to console for dev / Handle failure
            if (process.env.NODE_ENV === 'development') {
                console.log('[DEV] WhatsApp Failed. MOCK OTP:', otp);
            } else {
                // Rollback Redis if send fails
                await redis.del(otpKey);
                return NextResponse.json(
                    { error: 'Failed to send OTP via WhatsApp. Please try again.' },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully',
            params: { devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined }
        });

    } catch (error: any) {
        console.error('Send OTP Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
