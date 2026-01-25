import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, name, phone, profilePicture } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Validate phone if provided (basic check)
        if (phone && phone.length < 10) {
            return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
        }

        // Check availability if phone is being changed
        if (phone) {
            const existing = await prisma.user.findUnique({
                where: { phone }
            });
            if (existing && existing.id !== userId) {
                return NextResponse.json({ error: 'Phone number already in use' }, { status: 400 });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(phone && { phone }),
                ...(profilePicture && { profilePicture })
            }
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error("Update User Error:", error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
