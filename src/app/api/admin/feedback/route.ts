import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Prevent caching
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const feedbacks = await prisma.feedback.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return NextResponse.json(
            { error: 'Failed to fetch feedback' },
            { status: 500 }
        );
    }
}
