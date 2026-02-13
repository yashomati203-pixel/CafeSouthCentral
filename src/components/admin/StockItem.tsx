'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Edit2, Trash2, Archive, CheckSquare, Square } from 'lucide-react';

// Custom Hook for Debouncing
function useDebounce<T extends (...args: any[]) => any>(callback: T, delay: number) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);
}

interface StockItemProps {
    item: any;
    onUpdate?: (id: string, updates: any) => void;
    onRefresh: () => void;
    onEdit: () => void;
}

export default function StockItem({ item, onUpdate, onRefresh, onEdit }: StockItemProps) {
    const [count, setCount] = useState(item.stock);
    const [isAvailable, setIsAvailable] = useState(item.isAvailable);

    // Sync local state if prop changes (external update)
    useEffect(() => {
        setCount(item.stock);
        setIsAvailable(item.isAvailable);
    }, [item.stock, item.isAvailable]);

    // API Update Function
    const updateApi = async (id: string, newCount: number, newAvail: boolean) => {
        try {
            await fetch('/api/admin/inventory', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, stock: newCount, isAvailable: newAvail })
            });
            if (onUpdate) onUpdate(id, { stock: newCount, isAvailable: newAvail });
            // onRefresh(); // Don't refresh whole list on simple updates to prevent jitter
        } catch (e) {
            console.error("Failed to update stock", e);
        }
    };

    // Debounced API Call for Quantity
    const debouncedUpdate = useDebounce(updateApi, 1000);

    const updateCount = (newVal: number) => {
        const safeVal = Math.max(0, newVal);
        setCount(safeVal);
        debouncedUpdate(item.id, safeVal, isAvailable);
    };

    const toggleAvailability = () => {
        const newVal = !isAvailable;
        setIsAvailable(newVal);
        updateApi(item.id, count, newVal);
    };

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete "${item.name}"? This cannot be undone.`)) {
            try {
                const res = await fetch(`/api/admin/inventory?id=${item.id}`, {
                    method: 'DELETE'
                });

                if (res.ok) {
                    onRefresh();
                    import('sonner').then(({ toast }) => {
                        toast.success('Item deleted successfully');
                    });
                } else {
                    const errorData = await res.json();
                    import('sonner').then(({ toast }) => {
                        toast.error(errorData.error || 'Delete failed');
                    });
                }
            } catch (e) {
                console.error("Delete failed", e);
                import('sonner').then(({ toast }) => {
                    toast.error('Network error: Unable to delete item');
                });
            }
        }
    };

    return (
        <tr className={`group transition-colors rounded-lg overflow-hidden ${isAvailable ? 'hover:bg-gray-50' : 'bg-gray-50 opacity-70'}`}>
            {/* Item Name & Image Placeholder */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-xs font-bold text-gray-400">{item.name.slice(0, 2).toUpperCase()}</span>
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900">{item.name}</div>
                        {!isAvailable && (
                            <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">UNAVAILABLE</span>
                        )}
                    </div>
                </div>
            </td>

            {/* Category */}
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                    {item.category || 'General'}
                </span>
            </td>

            {/* Price */}
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ₹{item.price}
            </td>

            {/* Stock Controls */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => updateCount(count - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all font-bold text-gray-500"
                        disabled={count <= 0}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        min="0"
                        value={count}
                        onChange={(e) => updateCount(parseInt(e.target.value) || 0)}
                        className="w-12 text-center text-sm font-bold bg-transparent border-none focus:ring-0 p-0"
                    />
                    <button
                        onClick={() => updateCount(count + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm transition-all font-bold text-gray-500"
                    >
                        +
                    </button>

                    {/* Status Toggle */}
                    <button
                        onClick={toggleAvailability}
                        className={`ml-4 p-1.5 rounded-lg transition-colors ${isAvailable ? 'text-[#14b84b] hover:bg-[#14b84b]/10' : 'text-gray-300 hover:text-gray-500 hover:bg-gray-100'}`}
                        title={isAvailable ? "Mark Unavailable" : "Mark Available"}
                    >
                        {isAvailable ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    </button>
                </div>
            </td>

            {/* Actions */}
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={onEdit}
                        className="p-2 text-gray-400 hover:text-[#0e2a1a] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Item"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Item"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
