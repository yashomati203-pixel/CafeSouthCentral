import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH - Update a payment method
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await req.json();
        const { cardType, lastFourDigits, expiryMonth, expiryYear, cardholderName, isPrimary, userId } = body;

        // If setting as primary, unset existing primary for this user
        if (isPrimary && userId) {
            await prisma.paymentMethod.updateMany({
                where: { userId, isPrimary: true, NOT: { id } },
                data: { isPrimary: false }
            });
        }

        const paymentMethod = await prisma.paymentMethod.update({
            where: { id },
            data: {
                ...(cardType && { cardType }),
                ...(lastFourDigits && { lastFourDigits }),
                ...(expiryMonth && { expiryMonth }),
                ...(expiryYear && { expiryYear }),
                ...(cardholderName !== undefined && { cardholderName }),
                ...(isPrimary !== undefined && { isPrimary })
            }
        });

        return NextResponse.json(paymentMethod);
    } catch (error) {
        console.error('Error updating payment method:', error);
        return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 });
    }
}

// DELETE - Remove a payment method
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        await prisma.paymentMethod.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Payment method deleted' });
    } catch (error) {
        console.error('Error deleting payment method:', error);
        return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 });
    }
}
