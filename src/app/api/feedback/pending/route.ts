import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID missing" }, { status: 400 });
        }

        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        // Find One pending order to rate
        const pendingOrder = await prisma.order.findFirst({
            where: {
                userId: userId,
                status: "COMPLETED", // Replaced DONE with COMPLETED
                updatedAt: {
                    lt: thirtyMinutesAgo
                },
                feedback: {
                    is: null
                }
            },
            orderBy: {
                updatedAt: 'desc' // Most recent eligible order first
            }
        });

        return NextResponse.json({ pendingOrder });

    } catch (error) {
        console.error("Error checking pending feedback:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
