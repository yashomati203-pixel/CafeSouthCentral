import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Set primary address
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, addressId } = body;

        if (!userId || !addressId) {
            return NextResponse.json({ error: 'User ID and Address ID required' }, { status: 400 });
        }

        // Unset all primary addresses for this user
        await prisma.address.updateMany({
            where: { userId, isPrimary: true },
            data: { isPrimary: false }
        });

        // Set the specified address as primary
        const address = await prisma.address.update({
            where: { id: addressId },
            data: { isPrimary: true }
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error('Error setting primary address:', error);
        return NextResponse.json({ error: 'Failed to set primary address' }, { status: 500 });
    }
}
