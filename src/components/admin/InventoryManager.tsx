'use client';

import React, { useState } from 'react';
import {
    Search,
    Plus,
    Filter,
    AlertCircle,
    Edit2,
    Trash2,
    Package
} from 'lucide-react';
import AddDishModal from '@/components/admin/AddDishModal';
import StockItem from '@/components/admin/StockItem'; // Reusing existing or refactoring? Let's refactor inline for better style control

interface MenuItem {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    image?: string;
    isAvailable: boolean;
}

interface InventoryManagerProps {
    items: MenuItem[];
    onRefresh: () => void;
}

export default function InventoryManager({ items, onRefresh }: InventoryManagerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    // Filter Logic
    const categories = ['All', ...Array.from(new Set(items.map(i => i.category || 'Uncategorized')))];

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const lowStockItems = items.filter(i => i.stock < 10);

    return (
        <div className="space-y-6">

            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-[#0e2a1a] flex items-center gap-2">
                        Inventory Management
                        {lowStockItems.length > 0 && (
                            <span className="text-xs font-sans bg-red-100 text-red-600 px-2 py-1 rounded-full flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {lowStockItems.length} Low Stock
                            </span>
                        )}
                    </h2>
                    <p className="text-sm text-[#0e2a1a]/60">Manage menu items, prices, and availability</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setShowAddModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0e2a1a] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#0e2a1a]/20 hover:bg-[#0e2a1a]/90 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Item
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#14b84b]/10">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#14b84b]/20 outline-none"
                    />
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`
                                whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all
                                ${selectedCategory === cat
                                    ? 'bg-[#14b84b] text-white shadow-md shadow-[#14b84b]/20'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inventory List */}
            <div className="bg-white rounded-xl shadow-sm border border-[#14b84b]/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Item Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        No items found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map(item => (
                                    <StockItem
                                        key={item.id}
                                        item={item}
                                        onRefresh={onRefresh}
                                        onEdit={() => {
                                            setEditingItem(item);
                                            setShowAddModal(true);
                                        }}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <AddDishModal
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingItem(null);
                    }}
                    onSuccess={() => {
                        setShowAddModal(false);
                        setEditingItem(null);
                        onRefresh();
                    }}
                    editItem={editingItem} // Pass edit item if available
                />
            )}
        </div>
    );
}
