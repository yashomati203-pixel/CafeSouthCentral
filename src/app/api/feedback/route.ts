import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming this is where prisma is exported

import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
    // Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip, { limit: 5, windowMs: 60000 })) { // 5 feedbacks per minute per IP
        return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    try {
        const body = await req.json();
        const { userId, rating, comment } = body;

        if (!userId || !rating) {
            return NextResponse.json(
                { error: 'User ID and rating are required' },
                { status: 400 }
            );
        }

        const feedback = await prisma.feedback.create({
            data: {
                userId,
                rating,
                comment,
            },
        });

        return NextResponse.json(feedback, { status: 201 });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return NextResponse.json(
            { error: 'Failed to submit feedback' },
            { status: 500 }
        );
    }
}
