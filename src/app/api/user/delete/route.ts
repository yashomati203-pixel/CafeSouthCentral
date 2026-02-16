import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Soft Delete: Anonymize user data
        await prisma.user.update({
            where: { id: userId },
            data: {
                name: 'Deleted User',
                email: `deleted_${userId}@example.com`,
                phone: `0000000000_${userId.slice(0, 4)}`, // Maintain unique constraint format but randomize
                profilePicture: null,
                passwordHash: null,
                totpSecret: null,
                totpEnabled: false,
                fcmToken: null,
                walletBalance: 0,
                role: 'CUSTOMER' // Ensure no admin access remains
            }
        });

        // Optional: Delete sensitive related data if strictly required, 
        // but keeping orders for financial records is usually preferred.
        // Addresses and Payment Methods should likely be deleted.
        await prisma.address.deleteMany({ where: { userId } });
        await prisma.paymentMethod.deleteMany({ where: { userId } });
        await prisma.subscriptionDevice.deleteMany({ where: { userId } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete account error:", error);
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }
}
