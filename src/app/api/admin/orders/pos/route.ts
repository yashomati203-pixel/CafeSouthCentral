import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { customAlphabet } from 'nanoid';
import { notificationService } from '@/services/notificationService';
import { printKOT, printBill } from '@/lib/printer';

const nanoid = customAlphabet('1234567890', 4);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, total, customer, paymentMethod, type } = body;

        // Generate ID
        const displayId = nanoid();

        // Find or Create User (Optional for POS but good for tracking)
        // For POS, we often don't want to enforce user creation unless phone is provided
        let userId: string | null = null;
        if (customer.phone && customer.phone !== '0000000000') {
            // Try to find user or create a guest/pos user
            let user = await prisma.user.findUnique({ where: { phone: customer.phone } });
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        phone: customer.phone,
                        name: customer.name || 'Guest',
                        role: 'CUSTOMER'
                    }
                });
            }
            userId = user.id;
        }

        // Create Order
        // If no user, we might need a dummy user or make user optional.
        // Prisma schema likely requires userId.
        // Let's check schema... but assuming we need a user, let's use a "Walk-in" user or link to the phone provided.
        // If userId is null, we might fail if schema enforcement is strict.
        // Let's create a generic Walk-in user if no phone provided?
        // Or handle it gracefully.

        if (!userId) {
            // Check if a generic walk-in user exists
            let walkIn = await prisma.user.findFirst({ where: { phone: '0000000000' } });
            if (!walkIn) {
                walkIn = await prisma.user.create({
                    data: {
                        phone: '0000000000',
                        name: 'Walk-in Customer',
                        role: 'CUSTOMER'
                    }
                });
            }
            userId = walkIn.id;
        }

        const order = await prisma.order.create({
            data: {
                displayId,
                userId,
                status: 'CONFIRMED', // Start as confirmed for POS
                totalAmount: total,
                paymentMethod: paymentMethod, // 'CASH' | 'UPI' matches enum if passed correctly
                mode: 'NORMAL',
                note: 'POS Order', // Use note to identify POS orders
                items: {
                    create: items.map((item: any) => ({
                        menuItemId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    }))
                }
            },
            include: {
                items: true,
                user: true
            }
        });

        // Notifications & Printing
        // For POS, we might auto-print KOT
        try {
            // Trigger KOT print (if local server capability exists)
            // printKOT(order); 
        } catch (e) {
            console.error('Auto-print failed', e);
        }

        return NextResponse.json(order);

    } catch (error) {
        console.error("POS Order error:", error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
