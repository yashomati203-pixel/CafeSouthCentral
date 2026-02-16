import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, autoRenew, paymentMethod } = body;

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        if (typeof autoRenew !== 'boolean') {
            return NextResponse.json({ error: 'autoRenew must be a boolean' }, { status: 400 });
        }

        // Find the user's active subscription
        const subscription = await prisma.userSubscription.findFirst({
            where: {
                userId,
                status: 'ACTIVE'
            }
        });

        if (!subscription) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
        }

        // Update auto-renew preference
        const updated = await prisma.userSubscription.update({
            where: { id: subscription.id },
            data: {
                autoRenew
            }
        });

        return NextResponse.json({
            success: true,
            autoRenew: updated.autoRenew,
            message: autoRenew
                ? 'Auto-renew enabled successfully'
                : 'Auto-renew disabled successfully'
        });

    } catch (error) {
        console.error('Failed to update payment settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
