import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tier thresholds
const TIER_THRESHOLDS = {
    Bronze: 0,
    Silver: 500,
    Gold: 1000,
    Platinum: 2000
};

function calculateTier(points: number): { tier: string; pointsToNext: number } {
    if (points >= TIER_THRESHOLDS.Platinum) {
        return { tier: 'Platinum', pointsToNext: 0 };
    } else if (points >= TIER_THRESHOLDS.Gold) {
        return { tier: 'Gold', pointsToNext: TIER_THRESHOLDS.Platinum - points };
    } else if (points >= TIER_THRESHOLDS.Silver) {
        return { tier: 'Silver', pointsToNext: TIER_THRESHOLDS.Gold - points };
    } else {
        return { tier: 'Bronze', pointsToNext: TIER_THRESHOLDS.Silver - points };
    }
}

// GET - Fetch loyalty points for a user
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        let loyaltyPoints = await prisma.loyaltyPoints.findUnique({
            where: { userId }
        });

        // Create loyalty account if it doesn't exist
        if (!loyaltyPoints) {
            loyaltyPoints = await prisma.loyaltyPoints.create({
                data: {
                    userId,
                    totalPoints: 0,
                    tier: 'Bronze',
                    pointsToNextTier: TIER_THRESHOLDS.Silver
                }
            });
        }

        return NextResponse.json(loyaltyPoints);
    } catch (error) {
        console.error('Error fetching loyalty points:', error);
        return NextResponse.json({ error: 'Failed to fetch loyalty points' }, { status: 500 });
    }
}

// POST - Add points or update loyalty account
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, pointsToAdd } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        let loyaltyPoints = await prisma.loyaltyPoints.findUnique({
            where: { userId }
        });

        let newTotalPoints = (loyaltyPoints?.totalPoints || 0) + (pointsToAdd || 0);
        const { tier, pointsToNext } = calculateTier(newTotalPoints);

        if (loyaltyPoints) {
            // Update existing
            loyaltyPoints = await prisma.loyaltyPoints.update({
                where: { userId },
                data: {
                    totalPoints: newTotalPoints,
                    tier,
                    pointsToNextTier: pointsToNext
                }
            });
        } else {
            // Create new
            loyaltyPoints = await prisma.loyaltyPoints.create({
                data: {
                    userId,
                    totalPoints: newTotalPoints,
                    tier,
                    pointsToNextTier: pointsToNext
                }
            });
        }

        return NextResponse.json(loyaltyPoints);
    } catch (error) {
        console.error('Error updating loyalty points:', error);
        return NextResponse.json({ error: 'Failed to update loyalty points' }, { status: 500 });
    }
}
