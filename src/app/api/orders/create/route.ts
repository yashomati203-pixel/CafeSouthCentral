import { createSubscriptionOrder, createNormalOrder } from '@/services/orderService';
import { NextRequest, NextResponse } from 'next/server';

import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    // Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip, { limit: 10, windowMs: 60000 })) { // 10 orders per minute
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    try {
        const body = await req.json();
        const { userId, items, mode, paymentMethod, upiId, note, timeSlot } = body;

        if (!userId || !items || !Array.isArray(items)) {
            return NextResponse.json(
                { error: 'Invalid request body. Required: userId, items[]' },
                { status: 400 }
            );
        }

        let result;
        if (mode === 'NORMAL') {
            result = await createNormalOrder(userId, items, paymentMethod, upiId, note, timeSlot);
        } else {
            // Default to Subscription or explicit 'SUBSCRIPTION'
            result = await createSubscriptionOrder(userId, items, note, timeSlot);
        }

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error('Order Creation Failed:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
