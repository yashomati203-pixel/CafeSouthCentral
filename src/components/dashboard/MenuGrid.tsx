import { MenuItem, MenuItemType } from '@/types/db';
import { CATEGORY_ORDER } from '@/hooks/useMenu';
import { CartItem } from '@/context/CartContext';

interface MenuGridProps {
    menuItems: MenuItem[];
    mode: 'NORMAL' | 'SUBSCRIPTION';
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    onAddToCart: (item: MenuItem) => void;
    onDecreaseQty: (itemId: string) => void;
    cartItems: CartItem[];
    mockMenu: MenuItem[];
}

export default function MenuGrid({
    menuItems,
    mode,
    selectedCategory,
    setSelectedCategory,
    onAddToCart,
    onDecreaseQty,
    cartItems,
    mockMenu
}: MenuGridProps) {
    return (
        <>
            <section style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                        {mode === 'NORMAL' ? '🍔 Normal Menu' : '🥗 Subscription Plan'}
                    </h2>
                </div>

                <p style={{ color: '#666', marginBottom: '2rem' }}>
                    {mode === 'NORMAL'
                        ? 'Order anything from our wide range of delicacies. Pay per order.'
                        : 'Select items for your daily meal quota. No payment required at checkout.'}
                </p>

                {/* Category Filter Pills */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    overflowX: 'auto',
                    paddingBottom: '1rem',
                    marginBottom: '1rem',
                    scrollbarWidth: 'none'
                }}>
                    {['All', ...CATEGORY_ORDER.filter(c => mockMenu.some(i => i.category === c))].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '999px',
                                border: 'none',
                                backgroundColor: selectedCategory === cat ? '#5C3A1A' : '#EEE',
                                color: selectedCategory === cat ? 'white' : '#666',
                                fontWeight: 600,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grouped Menu Sections */}
                {Object.entries(
                    (menuItems.length > 0 ? menuItems : mockMenu).reduce((acc, item) => {
                        // Filter Logic
                        const isAvailableInSub = item.type === 'SUBSCRIPTION' || item.type === 'BOTH';
                        if (mode === 'SUBSCRIPTION' && !isAvailableInSub) return acc;

                        // Category Filter Logic
                        if (selectedCategory !== 'All' && item.category !== selectedCategory) return acc;

                        if (!acc[item.category]) acc[item.category] = [];
                        acc[item.category].push(item);
                        return acc;
                    }, {} as Record<string, MenuItem[]>)
                ).sort((a, b) => {
                    const indexA = CATEGORY_ORDER.indexOf(a[0]);
                    const indexB = CATEGORY_ORDER.indexOf(b[0]);
                    const safeIndexA = indexA === -1 ? 999 : indexA;
                    const safeIndexB = indexB === -1 ? 999 : indexB;
                    return safeIndexA - safeIndexB;
                })
                    .map(([category, categoryItems]) => (
                        <div key={category} style={{ marginBottom: '2rem' }}>
                            <h3 style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                marginBottom: '1rem',
                                color: '#5C3A1A',
                                borderBottom: '2px solid #EEE',
                                paddingBottom: '0.5rem'
                            }}>
                                {category}
                            </h3>
                            <div className="menu-grid">
                                {categoryItems.map((item) => (
                                    <div key={item.id} className="menu-card" style={{
                                        backgroundColor: mode === 'SUBSCRIPTION' ? '#f0fdf4' : 'white',
                                        opacity: item.inventoryCount === 0 ? 0.6 : 1,
                                    }}>
                                        <div>
                                            <div className="menu-image">
                                                [Image: {item.name}]
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>

                                                <h3 className="menu-title">{item.name}</h3>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        padding: '2px 6px',
                                                        border: item.isVeg ? '1px solid green' : '1px solid red',
                                                        color: item.isVeg ? 'green' : 'red',
                                                        borderRadius: '4px'
                                                    }}>
                                                        {item.isVeg ? 'VEG' : 'NON-VEG'}
                                                    </span>
                                                    {item.inventoryCount === 0 ? (
                                                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'red', border: '1px solid red', padding: '1px 4px', borderRadius: '4px' }}>
                                                            SOLD OUT
                                                        </span>
                                                    ) : item.inventoryCount <= 5 ? (
                                                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'white', backgroundColor: '#ef4444', padding: '2px 6px', borderRadius: '99px' }}>
                                                            Running Out!
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <p className="menu-desc">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div style={{ marginTop: '1rem' }}>
                                            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#5C3A1A' }}>
                                                {mode === 'NORMAL' ? `₹ ${item.price}` : 'Included in Plan'}
                                            </p>

                                            {(() => {
                                                const cartItem = cartItems.find(i =>
                                                    i.id === item.id &&
                                                    (mode === 'NORMAL' ? i.type === MenuItemType.NORMAL : i.type === MenuItemType.SUBSCRIPTION)
                                                );

                                                if (cartItem) {
                                                    return (
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            backgroundColor: '#f3f4f6',
                                                            borderRadius: '0.5rem',
                                                            padding: '0.25rem'
                                                        }}>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onDecreaseQty(item.id); }}
                                                                style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', backgroundColor: '#5C3A1A', color: 'white', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}
                                                            >
                                                                -
                                                            </button>
                                                            <span style={{ fontWeight: 'bold' }}>{cartItem.qty}</span>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                                                                style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', backgroundColor: '#5C3A1A', color: 'white', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <button
                                                        onClick={() => onAddToCart(item)}
                                                        disabled={item.inventoryCount === 0}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.75rem',
                                                            backgroundColor: item.inventoryCount === 0 ? '#ccc' : '#5C3A1A',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '0.5rem',
                                                            cursor: item.inventoryCount === 0 ? 'not-allowed' : 'pointer',
                                                            fontWeight: 600,
                                                            transition: 'opacity 0.2s'
                                                        }}
                                                    >
                                                        {item.inventoryCount === 0 ? 'Sold Out' : 'Add to Cart'}
                                                    </button>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </section>
            <style>{`
            .menu-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr); /* Mobile: 2 items fixed */
                gap: 1rem;
            }

            .menu-card {
                border: 1px solid #eee;
                border-radius: 0.5rem;
                padding: 0.75rem; /* Reduced padding */
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }

            .menu-image {
                height: 120px; /* Smaller image on mobile */
                background-color: #eee;
                border-radius: 0.25rem;
                margin-bottom: 0.75rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #aaa;
                font-size: 0.8rem;
                text-align: center;
                overflow: hidden;
            }

            .menu-title {
                font-weight: bold;
                font-size: 0.95rem; /* Smaller title */
                line-height: 1.2;
            }

            .menu-desc {
                font-size: 0.8rem;
                color: #666;
                margin-top: 0.25rem;
                display: -webkit-box;
                -webkit-line-clamp: 2; /* Limit text lines */
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            /* Desktop Overrides */
            @media (min-width: 768px) {
                .menu-grid {
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1.5rem;
                }
                .menu-card {
                    padding: 1rem;
                }
                .menu-title {
                    font-size: 1.1rem;
                }
                .menu-image {
                    height: 150px;
                }
                .menu-desc {
                   -webkit-line-clamp: 3;
                }
            }
        `}</style>
        </>
    );
}
