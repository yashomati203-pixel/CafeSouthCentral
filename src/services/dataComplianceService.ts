import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import * as crypto from 'crypto';

export class DataComplianceService {
    /**
     * Export User Data (Right to Access)
     */
    static async exportUserData(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                phone: true,
                name: true,
                email: true,
                createdAt: true,
                role: true
            }
        });

        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });

        const subscription = await prisma.userSubscription.findUnique({
            where: { userId }
        });

        return {
            user,
            orders,
            subscription,
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Delete User Account (Right to Erasure)
     * Anonymizes data for financial retention compliance.
     */
    static async deleteUserAccount(userId: string) {
        return await prisma.$transaction(async (tx) => {
            // 1. Anonymize User
            const anonId = `DELETED_${crypto.randomUUID().split('-')[0]}`;
            await tx.user.update({
                where: { id: userId },
                data: {
                    name: 'DELETED_USER',
                    phone: `${anonId}`, // Unique placeholder
                    email: `${anonId}@deleted.local`,
                    fcmToken: null,
                    profilePicture: null,
                    role: 'CUSTOMER'
                }
            });

            // 2. Cancel Subscription
            await tx.userSubscription.updateMany({
                where: { userId },
                data: { isActive: false, status: 'CANCELLED', cancellationReason: 'User Deleted' }
            });

            // 3. Clear Session
            if (redis) {
                await redis.del(`session:${userId}`);
            }

            // 4. Note: Orders are kept linked to the now-anonymized user record
            // This preserves financial stats without exposing PII.

            return true;
        });
    }
}
