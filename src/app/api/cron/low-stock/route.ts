import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messaging } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const LOW_STOCK_THRESHOLD = 10;

        // 1. Find items with low stock
        const lowStockItems = await prisma.menuItem.findMany({
            where: {
                stock: {
                    lt: LOW_STOCK_THRESHOLD
                },
                type: {
                    not: "SUBSCRIPTION" // Generally we track stock for normal items
                },
                isAvailable: true // Only care if it's currently marked available
            },
            select: {
                name: true,
                stock: true
            }
        });

        if (lowStockItems.length === 0) {
            return NextResponse.json({ success: true, message: "No items low on stock." });
        }

        // 2. Format the message
        // Example: "Low Stock: Milk (2), Eggs (5)..."
        const itemSummary = lowStockItems
            .map(item => `${item.name} (${item.stock})`)
            .join(", ");

        console.log(`[Cron] Low stock detected: ${itemSummary}`);

        // 3. Find Admins with FCM Tokens
        const admins = await prisma.user.findMany({
            where: {
                role: "SUPER_ADMIN",
                fcmToken: {
                    not: null
                }
            }
        });

        const results = [];

        // 4. Send Notification to all Admins
        for (const admin of admins) {
            if (!admin.fcmToken) continue;

            try {
                await messaging.send({
                    token: admin.fcmToken,
                    notification: {
                        title: "⚠️ Low Stock Alert",
                        body: `Running low on: ${itemSummary.substring(0, 100)}${itemSummary.length > 100 ? '...' : ''}`,
                    },
                    data: {
                        type: "LOW_STOCK_ALERT",
                        url: "/admin/stock"
                    }
                });
                results.push({ adminId: admin.id, status: "sent" });
            } catch (err) {
                console.error(`[Cron] Failed to send stock alert to admin ${admin.id}`, err);
                results.push({ adminId: admin.id, status: "failed", error: (err as any).message });
            }
        }

        return NextResponse.json({ success: true, processed: results.length, lowStockCount: lowStockItems.length, details: results });

    } catch (error) {
        console.error("[Cron] Low stock check error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
