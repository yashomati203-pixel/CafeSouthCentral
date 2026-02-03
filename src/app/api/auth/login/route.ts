import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/session';

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

        // WARNING: This is a legacy insecure check. Anyone named "Admin" becomes Super Admin.
        // TODO: Remove this in production. Use proper Admin Login flow.
        const role = name === 'Admin' ? 'SUPER_ADMIN' : 'CUSTOMER';

        const user = await prisma.user.upsert({
            where: { phone },
            update: { name, role },
            create: { name, phone, role },
        });

        // Create Secure HTTP-Only Session
        await createSession(user.id, user.role);

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error: any) {
        console.error('Login Failed:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
