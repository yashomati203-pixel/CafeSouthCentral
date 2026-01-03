import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    try {
        // Find the most recent order that is completed but has no feedback
        const lastOrder = await prisma.order.findFirst({
            where: {
                userId: userId,
                status: { in: ['DONE', 'SOLD', 'COMPLETED', 'RECEIVED'] }, // Broad check for finished orders
                feedback: { is: null }, // No feedback yet
                createdAt: {
                    // Check if order was created MORE than 30 minutes ago
                    lt: new Date(Date.now() - 30 * 60 * 1000)
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (lastOrder) {
            return NextResponse.json({
                orderId: lastOrder.id,
                displayId: lastOrder.displayId || lastOrder.id.slice(0, 5),
                found: true
            });
        }

        return NextResponse.json({ found: false });
    } catch (error) {
        console.error("Error checking pending feedback:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
