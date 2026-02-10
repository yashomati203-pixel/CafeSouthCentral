import { useState, useCallback, useEffect, useRef } from 'react';

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
    onUpdate: (id: string, updates: any) => void;
}

export default function StockItem({ item, onUpdate }: StockItemProps) {
    const [count, setCount] = useState(item.stock);
    const [isAvailable, setIsAvailable] = useState(item.isAvailable);
    const [clickCount, setClickCount] = useState(0);
    const [previousCount, setPreviousCount] = useState<number | null>(null);

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
            onUpdate(id, { stock: newCount, isAvailable: newAvail });
        } catch (e) {
            console.error("Failed to update stock", e);
        }
    };

    // Debounced API Call for Quantity
    const debouncedUpdate = useDebounce(updateApi, 1000);

    const updateCount = (newVal: number) => {
        const safeVal = Math.max(0, newVal);
        setCount(safeVal);
        // Optimistic UI update handled by local state 'count'
        // API call is debounced
        debouncedUpdate(item.id, safeVal, isAvailable);
    };

    // Toggle is immediate, not debounced (usually better for UX on switches)
    const toggleAvailability = () => {
        const newVal = !isAvailable;
        setIsAvailable(newVal);
        updateApi(item.id, count, newVal);
    };

    const handleSoldOut = () => {
        if (clickCount === 0) {
            setClickCount(1);
            setTimeout(() => setClickCount(0), 1000); // Reset after 1s
        } else {
            // Double tap confirmed
            setPreviousCount(count); // Save current count before zeroing
            setCount(0);
            updateApi(item.id, 0, isAvailable); // Immediate update for Sold Out
            setClickCount(0);
        }
    };

    const handleUndo = () => {
        if (previousCount !== null) {
            setCount(previousCount);
            updateApi(item.id, previousCount, isAvailable);
            setPreviousCount(null);
        }
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: 'white'
        }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.category}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                {/* Toggle Availability */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>Active</label>
                    <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={toggleAvailability}
                        style={{ width: '20px', height: '20px', accentColor: '#5C3A1A' }}
                    />
                </div>

                {/* Quantity Control */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                        onClick={() => updateCount(count - 1)}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                    >-</button>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={count.toString()}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                                // Allow clearing the input temporarily
                                setCount(0); // Keeping it simple: 0 if empty, or handle as string locally. 
                                // Actually, managing a separate string state is better for "empty".
                                // But to stick to minimal changes: 
                                // if count is state number, set to 0. 
                                // User: "I should be able to type". 
                                // If I type 1 -> 0 -> 10, that works. 
                                // If I want to clear, I get 0. 
                                // Let's try to interpret "manually type".
                                // If I use type="number", it prevents non-digits. 
                            }
                            const parsed = parseInt(val);
                            if (!isNaN(parsed)) {
                                updateCount(parsed);
                            } else if (val === '') {
                                updateCount(0);
                            }
                        }}
                        style={{
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            width: '60px',
                            textAlign: 'center',
                            border: '1px solid #ddd',
                            borderRadius: '0.25rem',
                            padding: '0.25rem'
                        }}
                    />
                    <button
                        onClick={() => updateCount(count + 1)}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
                    >+</button>
                </div>

                {/* Sold Out (Double Tap) or Undo */}
                {count === 0 && previousCount !== null ? (
                    <button
                        onClick={handleUndo}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            width: '100px'
                        }}
                    >
                        Undo
                    </button>
                ) : (
                    <button
                        onClick={handleSoldOut}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: clickCount === 1 ? '#d9534f' : '#fff',
                            color: clickCount === 1 ? 'white' : '#d9534f',
                            border: '1px solid #d9534f',
                            borderRadius: '0.5rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            width: '100px'
                        }}
                    >
                        {clickCount === 1 ? 'Confirm?' : 'Sold Out'}
                    </button>
                )}
            </div>
        </div>
    );
}
