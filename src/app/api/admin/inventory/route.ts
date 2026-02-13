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

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        // Attempt to delete the menu item
        await prisma.menuItem.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Item deleted successfully' });
    } catch (error: any) {
        console.error('Inventory Delete Failed:', error);

        // Check if the error is due to foreign key constraint
        if (error.code === 'P2003' || error.message?.includes('foreign key constraint')) {
            return NextResponse.json({
                error: 'Cannot delete item used in past orders. Mark as unavailable instead.'
            }, { status: 400 });
        }

        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
