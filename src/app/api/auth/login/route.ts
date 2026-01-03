import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, phone } = body;

        if (!name || !phone) {
            return NextResponse.json(
                { error: 'Name and Phone are required' },
                { status: 400 }
            );
        }

        // Upsert user: Update name if exists, or create new
        // Logic to determine role (Simple check for Admin name)
        const role = name === 'Admin' ? 'ADMIN' : 'CUSTOMER';

        // Upsert user: Update name/role if exists, or create new
        const user = await prisma.user.upsert({
            where: { phone },
            update: {
                name,
                role: role // Update role if logging in as Admin
            },
            create: {
                name,
                phone,
                email: null,
                role: role
            },
            include: {
                _count: {
                    select: { orders: true }
                }
            }
        });

        // Generate JWT
        const secretStr = process.env.JWT_SECRET;
        if (!secretStr) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const secret = new TextEncoder().encode(secretStr);
        const token = await new SignJWT({ userId: user.id, role: user.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret);

        // Set Cookie
        cookies().set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Lax needed for top-level navigation often
            maxAge: 60 * 60 * 24, // 1 day
            path: '/'
        });

        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        console.error('Login Failed:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
