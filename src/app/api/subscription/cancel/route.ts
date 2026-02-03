import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, reason } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            );
        }

        // Find the active subscription
        const sub = await prisma.userSubscription.findFirst({
            where: {
                userId: userId,
                status: 'ACTIVE'
            },
            include: { user: true } // Optional: include user details if needed
        });

        if (!sub) {
            return NextResponse.json({ error: 'No active subscription found for this user' }, { status: 404 });
        }

        // Update the subscription status to 'CANCELLED'
        // User keeps benefits until endDate (logic handled in cron/expiry or middleware checks)
        const cancelledSubscription = await prisma.userSubscription.update({
            where: { id: sub.id },
            data: {
                status: 'CANCELLED',
                cancellationReason: reason || null,
                cancelledAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            subscription: cancelledSubscription,
            message: `Subscription cancelled. Access continues until ${new Date(sub.endDate).toLocaleDateString()}`
        });

    } catch (error: any) {
        console.error('Subscription cancellation error:', error);
        return NextResponse.json(
            { error: 'Failed to cancel subscription' },
            { status: 500 }
        );
    }
}
