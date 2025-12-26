import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'UserId required' }, { status: 400 });
    }

    try {
        const today = new Date().toISOString().split('T')[0];

        // 1. Get Subscription
        const subscription = await prisma.userSubscription.findFirst({
            where: { userId, isActive: true }
        });

        if (!subscription) {
            return NextResponse.json({ error: 'No active subscription' }, { status: 404 });
        }

        // 2. Get Daily Usage
        const dailyUsage = await prisma.dailyUsage.findUnique({
            where: { userId_date: { userId, date: today } }
        });

        return NextResponse.json({
            itemsRedeemedToday: dailyUsage?.itemsRedeemedCount || 0,
            monthlyQuota: subscription.monthlyQuota,
            mealsConsumedThisMonth: subscription.mealsConsumedThisMonth,
            validUntil: subscription.endDate,
            dailyLimit: subscription.dailyLimit
        });

    } catch (error) {
        console.error("Failed to fetch subscription details:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
