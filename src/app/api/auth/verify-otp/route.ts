import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/session';
import * as argon2 from 'argon2';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phone, otp, name } = body; // Name is optional for recurring users, required for new

        if (!phone || !otp) {
            return NextResponse.json(
                { error: 'Phone and OTP are required' },
                { status: 400 }
            );
        }

        if (!redis) {
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const otpKey = `otp:${phone}`;
        const storedData = await redis.get(otpKey);

        // 1. Check if OTP exists / is expired
        if (!storedData) {
            return NextResponse.json(
                { error: 'OTP expired or invalid. Please request a new one.' },
                { status: 400 }
            );
        }

        const record = JSON.parse(storedData as string);

        // 2. Check if account is locked
        if (record.lockedUntil && new Date(record.lockedUntil) > new Date()) {
            return NextResponse.json(
                { error: 'Account is locked due to too many failed attempts.' },
                { status: 423 }
            );
        }

        // 3. Verify OTP
        const isValid = await argon2.verify(record.hashedOTP, otp);

        if (!isValid) {
            // Increment attempts
            record.attempts += 1;

            // Lock if attempts >= 3
            if (record.attempts >= 3) {
                const lockTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
                record.lockedUntil = lockTime.toISOString();

                // Update Redis with lock (Keep key alive for lock duration)
                await redis.setex(otpKey, 15 * 60, JSON.stringify(record));

                return NextResponse.json(
                    { error: 'Too many invalid attempts. Account locked for 15 minutes.' },
                    { status: 423 }
                );
            } else {
                // Update Redis with new attempt count (Keep original TTL)
                // We use ttl to avoid extending the validity of the OTP code itself endlessly
                const ttl = await redis.ttl(otpKey);
                if (ttl > 0) {
                    await redis.setex(otpKey, ttl, JSON.stringify(record));
                }
            }

            return NextResponse.json(
                { error: `Invalid OTP. ${3 - record.attempts} attempts remaining.` },
                { status: 401 }
            );
        }

        // 4. OTP Valid - Proceed to Login/Register

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { phone }
        });

        if (!user) {
            // Registration Flow
            if (!name) {
                // If we don't have a name yet (should have been collected in UI),
                // we technically can't create the user. 
                // However, our UI collects name + phone together for new logins.
                // Or we can create with a default Name.
                return NextResponse.json(
                    { error: 'Name is required for new registration.' },
                    { status: 400 }
                );
            }

            user = await prisma.user.create({
                data: {
                    phone,
                    name,
                    role: 'CUSTOMER'
                }
            });
        }

        // 5. Create Session
        await createSession(user.id, user.role);

        // 6. Cleanup Redis
        await redis.del(otpKey);
        await redis.del(`ratelimit:otp:${phone}`); // Clear rate limit so they can request again later if needed

        return NextResponse.json({ success: true, user });

    } catch (error: any) {
        console.error('Verify OTP Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
