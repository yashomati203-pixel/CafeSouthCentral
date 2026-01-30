import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all addresses for a user
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: [
                { isPrimary: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json(addresses);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
    }
}

// POST - Add a new address
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, label, street, city, state, zipCode, isPrimary } = body;

        if (!userId || !label || !street || !city || !state || !zipCode) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // If setting as primary, unset existing primary
        if (isPrimary) {
            await prisma.address.updateMany({
                where: { userId, isPrimary: true },
                data: { isPrimary: false }
            });
        }

        const address = await prisma.address.create({
            data: {
                userId,
                label,
                street,
                city,
                state,
                zipCode,
                isPrimary: isPrimary || false
            }
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error('Error creating address:', error);
        return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
    }
}
