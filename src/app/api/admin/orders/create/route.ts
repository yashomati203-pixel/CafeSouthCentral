import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNormalOrder } from '@/services/orderService';
import { UserRole } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phone, name, items, paymentMethod, note } = body;

        if (!phone || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: 'Invalid request. Phone and items are required.' },
                { status: 400 }
            );
        }

        // 1. Find or Create User
        let user = await prisma.user.findUnique({
            where: { phone }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    phone,
                    name: name || 'Walk-in Customer',
                    role: UserRole.CUSTOMER
                }
            });
        }

        // 2. Create Order
        // We reuse the existing service for consistency
        const result = await createNormalOrder(
            user.id,
            items,
            note, // note passed directly
            undefined // timeSlot
        );

        return NextResponse.json(result, { status: 201 });

    } catch (error: any) {
        console.error('Admin Order Creation Failed:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
