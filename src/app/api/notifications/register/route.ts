import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming this exists, I should check. Usually in src/lib/prisma.ts

export async function POST(req: NextRequest) {
    try {
        const { userId, token } = await req.json();

        if (!userId || !token) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { fcmToken: token },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving FCM token:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
