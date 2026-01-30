import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all payment methods for a user
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const paymentMethods = await prisma.paymentMethod.findMany({
            where: { userId },
            orderBy: [
                { isPrimary: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json(paymentMethods);
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
    }
}

// POST - Add a new payment method
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, cardType, lastFourDigits, expiryMonth, expiryYear, cardholderName, isPrimary } = body;

        if (!userId || !cardType || !lastFourDigits || !expiryMonth || !expiryYear) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate expiry
        if (expiryMonth < 1 || expiryMonth > 12 || expiryYear < new Date().getFullYear()) {
            return NextResponse.json({ error: 'Invalid expiry date' }, { status: 400 });
        }

        // If setting as primary, unset existing primary
        if (isPrimary) {
            await prisma.paymentMethod.updateMany({
                where: { userId, isPrimary: true },
                data: { isPrimary: false }
            });
        }

        const paymentMethod = await prisma.paymentMethod.create({
            data: {
                userId,
                cardType,
                lastFourDigits,
                expiryMonth,
                expiryYear,
                cardholderName,
                isPrimary: isPrimary || false
            }
        });

        return NextResponse.json(paymentMethod);
    } catch (error) {
        console.error('Error creating payment method:', error);
        return NextResponse.json({ error: 'Failed to create payment method' }, { status: 500 });
    }
}
