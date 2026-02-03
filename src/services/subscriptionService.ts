import { prisma } from '@/lib/prisma';
import { Prisma, PlanType } from '@prisma/client';

export const subscriptionService = {
    /**
     * Get User's Active Subscription
     */
    async getSubscription(userId: string) {
        return await prisma.userSubscription.findUnique({
            where: { userId },
            include: { user: { select: { name: true, phone: true } } }
        });
    },

    /**
     * Validate if user can order `quantity` items under their subscription
     * Checks: Active status, Expiry, Monthly Quota, Daily Limit
     */
    async validateQuota(userId: string, quantity: number): Promise<{ valid: boolean; reason?: string }> {
        const sub = await this.getSubscription(userId);

        if (!sub) {
            return { valid: false, reason: 'No active subscription found.' };
        }

        if (!sub.isActive || sub.status !== 'ACTIVE') {
            return { valid: false, reason: 'Subscription is inactive or paused.' };
        }

        if (new Date() > sub.endDate) {
            return { valid: false, reason: 'Subscription has expired.' };
        }

        // Check Monthly Quota
        if ((sub.creditsUsed + quantity) > sub.creditsTotal) {
            return { valid: false, reason: `Monthly quota exceeded. Remaining: ${sub.creditsTotal - sub.creditsUsed}` };
        }

        // Check Daily Limit
        if ((sub.dailyUsed + quantity) > sub.dailyLimit) {
            return { valid: false, reason: `Daily limit exceeded. Remaining today: ${sub.dailyLimit - sub.dailyUsed}` };
        }

        return { valid: true };
    },

    /**
     * Deduct credits from subscription
     * Must be part of the Order Transaction
     */
    async deductCredits(
        tx: Prisma.TransactionClient,
        userId: string,
        quantity: number
    ) {
        // Re-verify logic within transaction lock implicitly via update constraints if needed, 
        // or rely on validateQuota called just before in the same critical path.
        // Ideally, we replicate the checks in the update query for atomicity.

        // Logic simplified to explicit read-check-update pattern within transaction.
        // The previous updateMany block had invalid syntax (increment in where clause).

        // We can't easily validata updated.count here for updateMany without more complex logic.
        // Better approach for strict correctness:

        const sub = await tx.userSubscription.findUnique({ where: { userId } });
        if (!sub) throw new Error("Subscription not found");

        if (sub.creditsUsed + quantity > sub.creditsTotal || sub.dailyUsed + quantity > sub.dailyLimit) {
            throw new Error("Quota exceeded during transaction");
        }

        await tx.userSubscription.update({
            where: { userId },
            data: {
                creditsUsed: { increment: quantity },
                dailyUsed: { increment: quantity }
            }
        });
    },

    /**
     * Reset Daily Limits (Cron Job)
     */
    async resetDailyLimits() {
        await prisma.userSubscription.updateMany({
            where: { isActive: true },
            data: { dailyUsed: 0 }
        });
    }
};
