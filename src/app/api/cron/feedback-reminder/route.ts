import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messaging } from "@/lib/firebase-admin";

// This endpoint matches orders picked up > 30 minutes ago
// And sends a Push Notification asking for feedback.
// It is meant to be called by a Cron Service every 10-15 minutes.

export async function GET(req: Request) {
    try {
        // Calculate time 30 minutes ago
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        // Find orders:
        // 1. Status is DONE
        // 2. Updated (Picked up) more than 30 mins ago
        // 3. Notification NOT sent yet
        // 4. No Feedback given yet
        const pendingOrders = await prisma.order.findMany({
            where: {
                status: "DONE",
                updatedAt: {
                    lt: thirtyMinutesAgo
                },
                feedbackNotificationSent: false,
                feedback: {
                    is: null
                },
                user: {
                    fcmToken: {
                        not: null
                    }
                }
            },
            include: {
                user: true
            }
        });

        console.log(`[Cron] Found ${pendingOrders.length} orders pending feedback notification.`);

        const results = [];

        for (const order of pendingOrders as any[]) {
            if (!order.user.fcmToken) continue;

            try {
                // Send FCM Notification
                await messaging.send({
                    token: order.user.fcmToken,
                    notification: {
                        title: "How was your food? 🍔",
                        body: "We'd love to hear your thoughts! Rate your recent order now.",
                    },
                    data: {
                        type: "FEEDBACK_REMINDER",
                        orderId: order.id,
                        url: "/orders" // Deep link to orders page
                    }
                });

                // Update Order flag
                await prisma.order.update({
                    where: { id: order.id },
                    data: { feedbackNotificationSent: true }
                });

                results.push({ orderId: order.id, status: "sent" });
            } catch (err) {
                console.error(`[Cron] Create notification failed for order ${order.id}`, err);
                results.push({ orderId: order.id, status: "failed", error: (err as any).message });
            }
        }

        return NextResponse.json({ success: true, processed: results.length, details: results });

    } catch (error) {
        console.error("[Cron] Feedback reminder error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
