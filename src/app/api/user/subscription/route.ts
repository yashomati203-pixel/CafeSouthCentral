import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { whatsappNotifications } from '@/services/whatsappService';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || ''); // Empty string will fail verification safely compared to a known default

async function getAuthenticatedUser() {
    if (!process.env.JWT_SECRET) return null; // Logic safely fails if secret missing
    const token = cookies().get('token')?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload as { userId: string; role: string };
    } catch {
        return null;
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'UserId required' }, { status: 400 });
    }

    // Security Check: Verify User
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // IDOR Check: Ensure user is requesting their own data or is Admin
    if (authUser.userId !== userId && authUser.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden: You can only view your own subscription' }, { status: 403 });
    }

    try {
        const today = new Date().toISOString().split('T')[0];

        // 1. Get Subscription
        const subscription = await prisma.userSubscription.findFirst({
            where: {
                userId: authUser.userId,
                status: 'ACTIVE'
            },
            include: {
                user: { select: { name: true, phone: true } }
            }
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
            creditsTotal: subscription.creditsTotal,
            creditsUsed: subscription.creditsUsed,
            validUntil: subscription.endDate,
            startDate: subscription.startDate,
            planType: subscription.planType
        });

    } catch (error) {
        console.error("Failed to fetch subscription details:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, planId } = body;

        if (!userId || !planId) {
            return NextResponse.json({ error: 'Missing userId or planId' }, { status: 400 });
        }

        // Security Check: Verify User
        const authUser = await getAuthenticatedUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // IDOR Check: Ensure user is subscribing for themselves or is Admin
        if (authUser.userId !== userId && authUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden: You can only subscribe for yourself' }, { status: 403 });
        }

        // Logic to determine plan details
        // In a real app, fetch from DB. For now, hardcode matches frontend.
        let durationDays = 30;
        let creditsTotal = 60; // Default
        let dailyLimit = 3;
        let price = 3000;
        let planType = 'FEAST_FUEL'; // Default to a valid enum

        if (planId === 'monthly') {
            durationDays = 30;
            creditsTotal = 60;
            dailyLimit = 3;
            price = 3000;
            planType = 'FEAST_FUEL';
        } else if (planId === 'student') {
            durationDays = 30;
            creditsTotal = 45;
            dailyLimit = 2;
            price = 2500;
            planType = 'LIGHT_BITE';
        } else if (planId === 'weekly') {
            durationDays = 7;
            creditsTotal = 14;
            dailyLimit = 2;
            price = 800;
            planType = 'TRIAL';
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + durationDays);

        // Deactivate old subscriptions?
        await prisma.userSubscription.updateMany({
            where: { userId, status: 'ACTIVE' },
            data: { status: 'EXPIRED' }
        });

        // Create new
        const newSub = await prisma.userSubscription.create({
            data: {
                userId,
                planType: planType as any, // Cast because we are deriving string
                creditsTotal,
                creditsUsed: 0,
                dailyLimit,
                dailyUsed: 0,
                startDate,
                endDate,
                status: 'ACTIVE'
            }
        });

        // Reset user role to indicate they might be special now? 
        // Or just rely on subscription table. API/Frontend relies on sub table.

        const userName = authUser.role === 'ADMIN' ? 'Customer' : (authUser as any)?.name || 'Valued Guest';
        // Note: we need to ensure we have the user name. 
        // In the current route, we only have userId. 
        // I will pull the name from the `newSub.user` if included, or use a default.

        // Actually, let's pull the user object to get the phone number.
        const userWithPhone = await prisma.user.findUnique({ where: { id: userId }, select: { phone: true, name: true } });
        if (userWithPhone) {
            whatsappNotifications.sendSubscriptionWelcome(
                userWithPhone.phone,
                userWithPhone.name || 'Member',
                planId === 'monthly' ? 'Monthly Mess' : planId
            ).catch(e => console.error('WhatsApp Error:', e));
        }

        return NextResponse.json(newSub);

    } catch (error) {
        console.error("Failed to create subscription:", error);
        return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
    }
}
