import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messaging } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic'; // Ensure this route is not cached

export async function GET(req: Request) {
    try {
        // Calculate date range: From now to 2 days from now
        const now = new Date();
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(now.getDate() + 2);

        // Find subscriptions expiring soon (e.g., between now and 48 hours)
        // Adjust logic as needed (e.g., exactly 2 days out, or within the window)
        // Here we look for end dates strictly between now and 2 days out

        const expiredSubs = await prisma.userSubscription.updateMany({
            where: {
                endDate: { lt: new Date() },
                status: 'ACTIVE'
            },
            data: {
                status: 'EXPIRED'
            }
        });

        const expiringSubscriptions = await prisma.userSubscription.findMany({
            where: {
                status: 'ACTIVE',
                endDate: {
                    gte: now,
                    lte: twoDaysFromNow
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

        console.log(`[Cron] Found ${expiringSubscriptions.length} subscriptions expiring soon.`);

        const results = [];

        for (const sub of expiringSubscriptions) {
            if (!sub.user.fcmToken) continue;

            const daysLeft = Math.ceil((sub.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            try {
                await messaging.send({
                    token: sub.user.fcmToken,
                    notification: {
                        title: "Plan Expiring Soon! ⏳",
                        body: `Your meal plan expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Renew now to keep enjoying meals!`,
                    },
                    data: {
                        type: "SUBSCRIPTION_EXPIRY",
                        userId: sub.userId,
                        url: "/profile"
                    }
                });

                results.push({ userId: sub.userId, status: "sent", daysLeft });
            } catch (err) {
                console.error(`[Cron] Failed to send expiry notification to user ${sub.userId}`, err);
                results.push({ userId: sub.userId, status: "failed", error: (err as any).message });
            }
        }

        return NextResponse.json({ success: true, processed: results.length, details: results });

    } catch (error) {
        console.error("[Cron] Subscription expiry check error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
