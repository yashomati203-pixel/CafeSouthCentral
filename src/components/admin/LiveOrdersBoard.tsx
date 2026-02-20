'use client';

import React from 'react';
import { Utensils } from 'lucide-react';
import OrderCard from './OrderCard';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    displayId?: string;
    user: { name: string; phone: string };
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
    note?: string;
    header?: string;
}

interface LiveOrdersBoardProps {
    orders: Order[];
    onUpdateStatus: (id: string, status: string) => void;
}

export default function LiveOrdersBoard({ orders, onUpdateStatus }: LiveOrdersBoardProps) {

    // Sort logic: Urgent first (oldest), then new.
    const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return (
        <div className="space-y-6">
            {/* Grid Layout - Compact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {sortedOrders.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                        <Utensils className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-bold text-lg">No active orders</p>
                        <p className="text-sm">Kitchen is clear!</p>
                    </div>
                ) : (
                    sortedOrders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onUpdateStatus={onUpdateStatus}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
