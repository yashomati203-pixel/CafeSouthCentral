import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { status } = await req.json();

        const updatedOrder = await prisma.order.update({
            where: { id: params.id },
            data: { status: status as OrderStatus }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Failed to update order:", error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
