import { prisma } from '@/lib/prisma';
import { addDays, addMonths, isBefore } from 'date-fns';

export class SubscriptionLifecycleService {
    /**
     * Process Renewals (Cron Job Logic)
     * Should run daily at 00:00
     */
    static async processRenewals() {
        const today = new Date();
        const threeDaysFromNow = addDays(today, 3);

        // 1. Find subscriptions expiring soon (for notification)
        const expiringSoon = await prisma.userSubscription.findMany({
            where: {
                isActive: true,
                autoRenew: true,
                endDate: {
                    lte: threeDaysFromNow,
                    gte: today
                }
            },
            include: { user: true }
        });

        for (const sub of expiringSoon) {
            console.log(`[Lifecycle] Subscription expiring for ${sub.user.phone} on ${sub.endDate}`);
            // Send Reminder SMS/Email here
        }

        // 2. Find subscriptions expiring TODAY (for renewal)
        const expiringToday = await prisma.userSubscription.findMany({
            where: {
                isActive: true,
                autoRenew: true,
                endDate: {
                    lte: today
                }
            }
        });

        for (const sub of expiringToday) {
            try {
                // Attempt Payment (Mocked for now)
                // const paymentSuccess = await PaymentService.chargeSavedCard(sub.userId, sub.planType);
                const paymentSuccess = true; // Assume success for V1

                if (paymentSuccess) {
                    await prisma.userSubscription.update({
                        where: { id: sub.id },
                        data: {
                            creditsUsed: 0,
                            dailyUsed: 0,
                            startDate: today,
                            endDate: addMonths(today, 1),
                            status: 'ACTIVE'
                        }
                    });
                    console.log(`[Lifecycle] Renewed subscription for ${sub.userId}`);
                } else {
                    // Grace Period Logic
                    await prisma.userSubscription.update({
                        where: { id: sub.id },
                        data: { status: 'EXPIRED' } // Simplified from Grace Period for now
                    });
                }
            } catch (error) {
                console.error(`[Lifecycle] Renewal failed for ${sub.id}`, error);
            }
        }
    }

    /**
     * Check Quota Reset (Monthly)
     * Logic: If today is anniversary day, reset credits
     */
    static async checkMonthlyQuotaReset() {
        // This is implicitly handled by renewal loop for V1, 
        // but strict "anniversary" logic (without payment) needs this.
        // For paid plans, renewal == payment == reset.
        // For free/trial plans or manually managed, we might need this.
    }
}
