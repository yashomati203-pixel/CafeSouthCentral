import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Set primary payment method
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, paymentMethodId } = body;

        if (!userId || !paymentMethodId) {
            return NextResponse.json({ error: 'User ID and Payment Method ID required' }, { status: 400 });
        }

        // Unset all primary payment methods for this user
        await prisma.paymentMethod.updateMany({
            where: { userId, isPrimary: true },
            data: { isPrimary: false }
        });

        // Set the specified payment method as primary
        const paymentMethod = await prisma.paymentMethod.update({
            where: { id: paymentMethodId },
            data: { isPrimary: true }
        });

        return NextResponse.json(paymentMethod);
    } catch (error) {
        console.error('Error setting primary payment method:', error);
        return NextResponse.json({ error: 'Failed to set primary payment method' }, { status: 500 });
    }
}
