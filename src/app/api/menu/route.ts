import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const menuItems = await prisma.menuItem.findMany({
            orderBy: [
                { category: 'asc' },
                { name: 'asc' }
            ]
        });

        return NextResponse.json(menuItems);
    } catch (error) {
        console.error('Failed to fetch menu:', error);
        return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, isAvailable, inventoryCount } = body;

        if (!id) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        const updatedItem = await prisma.menuItem.update({
            where: { id },
            data: {
                isAvailable: isAvailable !== undefined ? isAvailable : undefined,
                inventoryCount: inventoryCount !== undefined ? inventoryCount : undefined
            }
        });

        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error('Failed to update menu item:', error);
        return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
    }
}
