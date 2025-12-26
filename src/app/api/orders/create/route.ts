import { createSubscriptionOrder, createNormalOrder } from '@/services/orderService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, items, mode, paymentMethod, upiId } = body;

        if (!userId || !items || !Array.isArray(items)) {
            return NextResponse.json(
                { error: 'Invalid request body. Required: userId, items[]' },
                { status: 400 }
            );
        }

        let result;
        if (mode === 'NORMAL') {
            result = await createNormalOrder(userId, items, paymentMethod, upiId);
        } else {
            // Default to Subscription or explicit 'SUBSCRIPTION'
            result = await createSubscriptionOrder(userId, items);
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
