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
// ... (GET method remains)

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, planId } = body;

        if (!userId || !planId) {
            return NextResponse.json({ error: 'Missing userId or planId' }, { status: 400 });
        }

        // Logic to determine plan details
        // In a real app, fetch from DB. For now, hardcode matches frontend.
        let durationDays = 30;
        let monthlyQuota = 60; // Default
        let dailyLimit = 4;
        let price = 3000;

        if (planId === 'monthly') {
            durationDays = 30;
            monthlyQuota = 60;
            dailyLimit = 4;
            price = 3000;
        } else if (planId === 'student') {
            durationDays = 30;
            monthlyQuota = 45; // 3 items * 15 days? or just diff limit
            dailyLimit = 3;
            price = 2500;
        } else if (planId === 'weekly') {
            durationDays = 7;
            monthlyQuota = 14;
            dailyLimit = 4;
            price = 800;
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + durationDays);

        // Deactivate old subscriptions?
        await prisma.userSubscription.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false }
        });

        // Create new
        const newSub = await prisma.userSubscription.create({
            data: {
                userId,
                planType: 'MONTHLY_MESS', // Enum restriction, mapping everything to this for now or need to update Enum
                dailyLimit,
                monthlyQuota,
                mealsConsumedThisMonth: 0,
                startDate,
                endDate,
                isActive: true
            }
        });

        // Reset user role to indicate they might be special now? 
        // Or just rely on subscription table. API/Frontend relies on sub table.

        return NextResponse.json(newSub);

    } catch (error) {
        console.error("Failed to create subscription:", error);
        return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
    }
}
