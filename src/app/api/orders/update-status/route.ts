import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const { orderId, status } = await req.json();

        if (!orderId || !status) {
            return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: status as OrderStatus }
        });

        return NextResponse.json({ success: true, order: updatedOrder });
    } catch (error: any) {
        console.error('Update Status Failed:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}
