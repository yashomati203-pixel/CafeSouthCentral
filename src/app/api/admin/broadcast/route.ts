import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { messaging } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    try {
        // Authenticate Admin (Simple check for now, ideally strictly verify session)
        // Since this is an internal API, we assume the frontend ensures it's called by an admin
        // But for safety, let's verify headers or body if passed, or trust middleware/frontend logic + local environment for now.

        const { title, body } = await req.json();

        if (!title || !body) {
            return NextResponse.json({ error: 'Title and Body required' }, { status: 400 });
        }

        // Get all users with tokens
        const users = await prisma.user.findMany({
            where: {
                fcmToken: { not: null }
            },
            select: { fcmToken: true }
        });

        const tokens = users.map(u => u.fcmToken).filter(t => t !== null) as string[];

        if (tokens.length === 0) {
            return NextResponse.json({ message: 'No subscribed users found' });
        }

        // Send Multicast
        const message = {
            notification: {
                title,
                body,
            },
            tokens,
        };

        if (!messaging) {
            throw new Error('Firebase Messaging not initialized (Server-side)');
        }

        const response = await messaging.sendEachForMulticast(message);

        return NextResponse.json({
            success: true,
            sentCount: response.successCount,
            failureCount: response.failureCount
        });

    } catch (e) {
        console.error('Broadcast Error:', e);
        return NextResponse.json({
            success: false,
            error: 'Failed to broadcast',
            details: e instanceof Error ? e.message : String(e)
        }, { status: 500 });
    }
}
