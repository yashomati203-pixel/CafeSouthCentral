import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, subscriptionId, reason } = body;

        if (!userId || !subscriptionId) {
            return NextResponse.json(
                { error: 'userId and subscriptionId are required' },
                { status: 400 }
            );
        }

        // Find the subscription
        const subscription = await prisma.userSubscription.findFirst({
            where: {
                id: subscriptionId,
                userId: userId
            }
        });

        if (!subscription) {
            return NextResponse.json(
                { error: 'Subscription not found' },
                { status: 404 }
            );
        }

        // Mark subscription as cancelled but keep it active until endDate
        const cancelledSubscription = await prisma.userSubscription.update({
            where: { id: subscriptionId },
            data: {
                isCancelled: true,
                cancelledAt: new Date(),
                cancellationReason: reason || null
                // We DO NOT set isActive to false here, as the user keeps benefits until endDate
            }
        });

        return NextResponse.json({
            success: true,
            subscription: cancelledSubscription,
            message: `Subscription cancelled. Access continues until ${new Date(subscription.endDate).toLocaleDateString()}`
        });

    } catch (error) {
        console.error('Subscription cancellation error:', error);
        return NextResponse.json(
            { error: 'Failed to cancel subscription' },
            { status: 500 }
        );
    }
}
