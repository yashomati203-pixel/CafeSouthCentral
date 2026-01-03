import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { userId, rating, comment, orderId } = await req.json();

        if (!userId || !rating) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const data: any = {
            userId,
            rating,
            comment,
        };

        if (orderId) {
            data.orderId = orderId;
        }

        const feedback = await prisma.feedback.create({
            data
        });

        return NextResponse.json(feedback);
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
