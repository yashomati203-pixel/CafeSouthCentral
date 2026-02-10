
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phone } = body;

        if (!phone) {
            return NextResponse.json({ hasActiveSubscription: false });
        }

        const user = await prisma.user.findUnique({
            where: { phone },
            include: { subscriptions: true }
        });

        if (!user) {
            return NextResponse.json({ hasActiveSubscription: false });
        }

        const hasActiveSubscription = user.subscriptions.some(sub =>
            sub.isActive &&
            sub.status === 'ACTIVE' &&
            new Date(sub.endDate) > new Date()
        );

        return NextResponse.json({ hasActiveSubscription });

    } catch (error) {
        console.error('Error checking subscription status:', error);
        return NextResponse.json({ hasActiveSubscription: false }, { status: 500 });
    }
}
