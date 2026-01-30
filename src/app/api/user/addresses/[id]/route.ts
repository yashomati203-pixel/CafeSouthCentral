import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH - Update an address
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await req.json();
        const { label, street, city, state, zipCode, isPrimary, userId } = body;

        // If setting as primary, unset existing primary for this user
        if (isPrimary && userId) {
            await prisma.address.updateMany({
                where: { userId, isPrimary: true, NOT: { id } },
                data: { isPrimary: false }
            });
        }

        const address = await prisma.address.update({
            where: { id },
            data: {
                ...(label && { label }),
                ...(street && { street }),
                ...(city && { city }),
                ...(state && { state }),
                ...(zipCode && { zipCode }),
                ...(isPrimary !== undefined && { isPrimary })
            }
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error('Error updating address:', error);
        return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
    }
}

// DELETE - Remove an address
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        await prisma.address.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Address deleted' });
    } catch (error) {
        console.error('Error deleting address:', error);
        return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
    }
}
