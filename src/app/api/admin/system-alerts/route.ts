import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Alert {
    id: string;
    type: 'stock' | 'order_delay' | 'system';
    severity: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
    actionUrl?: string;
    itemId?: string;
    createdAt: Date;
}

export async function GET(req: NextRequest) {
    try {
        // Auth Check
        const userHeader = req.headers.get('x-user-data');
        if (userHeader) {
            const user = JSON.parse(userHeader);
            if (user.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        const alerts: Alert[] = [];
        const now = new Date();

        // 1. Check for Low Stock Items
        const lowStockThreshold = 10;
        const lowStockItems = await prisma.menuItem.findMany({
            where: {
                stock: {
                    lte: lowStockThreshold
                },
                isAvailable: true
            },
            select: {
                id: true,
                name: true,
                stock: true
            }
        });

        lowStockItems.forEach(item => {
            alerts.push({
                id: `stock-${item.id}`,
                type: 'stock',
                severity: item.stock === 0 ? 'critical' : item.stock <= 5 ? 'warning' : 'info',
                title: item.stock === 0 ? 'Out of Stock' : 'Low Stock Alert',
                message: `${item.name} - ${item.stock} units remaining`,
                actionUrl: '/admin/dashboard?tab=inventory',
                itemId: item.id,
                createdAt: now
            });
        });

        // 2. Check for Delayed Orders
        const delayThresholdMinutes = 20;
        const criticalDelayMinutes = 30;
        const delayThreshold = new Date(now.getTime() - delayThresholdMinutes * 60000);
        const criticalDelayThreshold = new Date(now.getTime() - criticalDelayMinutes * 60000);

        const delayedOrders = await prisma.order.findMany({
            where: {
                status: {
                    in: ['CONFIRMED', 'PREPARING']
                },
                createdAt: {
                    lte: delayThreshold
                }
            },
            select: {
                id: true,
                displayId: true,
                status: true,
                createdAt: true,
                user: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        delayedOrders.forEach(order => {
            const delayMinutes = Math.floor((now.getTime() - new Date(order.createdAt).getTime()) / 60000);
            const isCritical = new Date(order.createdAt) <= criticalDelayThreshold;

            alerts.push({
                id: `order-${order.id}`,
                type: 'order_delay',
                severity: isCritical ? 'critical' : 'warning',
                title: isCritical ? 'Critical Order Delay' : 'Order Delayed',
                message: `Order #${order.displayId || order.id.slice(0, 8)} - ${delayMinutes} minutes (${order.user.name})`,
                actionUrl: '/admin/dashboard?tab=active',
                itemId: order.id,
                createdAt: order.createdAt
            });
        });

        // 3. Sort alerts by severity and time
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        alerts.sort((a, b) => {
            const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
            if (severityDiff !== 0) return severityDiff;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        // 4. Calculate counts
        const counts = {
            total: alerts.length,
            critical: alerts.filter(a => a.severity === 'critical').length,
            warning: alerts.filter(a => a.severity === 'warning').length,
            stock: alerts.filter(a => a.type === 'stock').length,
            orderDelay: alerts.filter(a => a.type === 'order_delay').length
        };

        return NextResponse.json({
            alerts,
            counts,
            timestamp: now
        });

    } catch (error: any) {
        console.error('System Alerts Failed:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}
