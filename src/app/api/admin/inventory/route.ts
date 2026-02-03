import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, stock, isAvailable } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const data: any = {};
        if (typeof stock === 'number') data.stock = stock;
        if (typeof isAvailable === 'boolean') {
            data.isAvailable = isAvailable;
            // If explicit "Availability" toggle is off, maybe set count to 0? 
            // Or just use isAvailable flag. Frontend uses inventoryCount mainly.
            // Let's stick to inventoryCount being the source of truth for "Sold Out".
            // But if user sets isAvailable=false, we can set inventoryCount=0?
            // Or keep them separate. The prompt says "Toggle Availability switch and a Quantity counter".
            // Let's support both.
        }

        const item = await prisma.menuItem.update({
            where: { id },
            data
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error('Inventory Update Failed:', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
