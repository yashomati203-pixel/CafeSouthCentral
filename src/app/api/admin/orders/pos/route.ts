import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderDisplayId } from '@/lib/order-utils';
import { notificationService } from '@/services/notificationService';
import { printKOT, printBill } from '@/lib/printer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, total, customer, paymentMethod, type } = body;

        // Use transaction to ensure atomic ID generation
        const order = await prisma.$transaction(async (tx) => {
            // Generate sequential display ID
            const displayId = await generateOrderDisplayId(tx);

            // Find or Create User (Optional for POS but good for tracking)
            let userId: string | null = null;
            if (customer.phone && customer.phone !== '0000000000') {
                let user = await tx.user.findUnique({ where: { phone: customer.phone } });
                if (!user) {
                    user = await tx.user.create({
                        data: {
                            phone: customer.phone,
                            name: customer.name || 'Guest',
                            role: 'CUSTOMER'
                        }
                    });
                }
                userId = user.id;
            }

            if (!userId) {
                // Check if a generic walk-in user exists
                let walkIn = await tx.user.findFirst({ where: { phone: '0000000000' } });
                if (!walkIn) {
                    walkIn = await tx.user.create({
                        data: {
                            phone: '0000000000',
                            name: 'Walk-in Customer',
                            role: 'CUSTOMER'
                        }
                    });
                }
                userId = walkIn.id;
            }

            return tx.order.create({
                data: {
                    displayId,
                    userId,
                    status: 'CONFIRMED',
                    totalAmount: total,
                    paymentMethod: paymentMethod,
                    mode: 'NORMAL',
                    note: 'POS Order',
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
