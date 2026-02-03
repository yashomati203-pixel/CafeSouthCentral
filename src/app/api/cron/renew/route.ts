import { NextResponse } from 'next/server';
import { SubscriptionLifecycleService } from '@/services/subscriptionLifecycleService';

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET(req: Request) {
    try {
        // Optional: Add a secret header check to prevent unauthorized triggering
        const authHeader = req.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        await SubscriptionLifecycleService.processRenewals();

        return NextResponse.json({ success: true, message: 'Renewals processed' });
    } catch (error: any) {
        console.error('Cron Job Failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
