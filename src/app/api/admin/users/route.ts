import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming this is where prisma client is exported

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    not: 'ADMIN'
                }
            },
            select: {
                id: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true,
                subscriptions: {
                    where: { isActive: true },
                    orderBy: { endDate: 'desc' },
                    take: 1,
                    select: { endDate: true, planType: true }
                },
                _count: {
                    select: { orders: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Transform for easier frontend consumption
        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.name || 'Unknown',
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
            orderCount: user._count.orders,
            isMember: user.subscriptions.length > 0,
            subscription: user.subscriptions[0] || null
        }));

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
