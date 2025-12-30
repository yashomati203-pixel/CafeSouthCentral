'use client';

import { TrashIcon } from '@radix-ui/react-icons';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';
import { useState, useEffect } from 'react';
import OrderConfirmed from '@/components/ui/OrderConfirmed';
import { QRCodeSVG } from 'qrcode.react';


interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onOrderSuccess?: () => void;
    variant?: 'drawer' | 'sidebar';
}

export default function CartDrawer({ isOpen, onClose, user, onOrderSuccess, variant = 'drawer' }: CartProps) {
    const {
        subscriptionItems,
        normalItems,
        subTotalCount,
        normalTotalAmount,
        removeFromCart,
        addToCart,
        decreaseQty,
        clearCart
    } = useCart();

    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'SCAN'>('CASH');
    const [upiId, setUpiId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [lastOrderId, setLastOrderId] = useState<string | undefined>(undefined);
    const [lastDisplayId, setLastDisplayId] = useState<string | undefined>(undefined);

    // Auto-close Effect REMOVED by user request
    // useEffect(() => { ... }, []);

    // If drawer is closed, don't render anything (unless we want to keep it mounted for transitions, but simple is better)
    if (!isOpen && variant === 'drawer') return null;
    if (!isOpen && variant === 'sidebar') return null; // Logic for sidebar rendering is controlled by parent, but safer to check.

    const hasSubscription = subscriptionItems.length > 0;
    const hasNormal = normalItems.length > 0;
    const isMixed = hasSubscription && hasNormal;

    const handleAnimationComplete = () => {
        setShowSuccessAnimation(false);
        clearCart();
        onClose();
        if (onOrderSuccess) onOrderSuccess();
    };

    const saveOfflineOrder = (payload: any, mode: 'SUBSCRIPTION' | 'NORMAL') => {
        const offlineId = `OFFLINE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const pendingOrder = {
            payload,
            mode,
            tempId: offlineId,
            createdAt: Date.now(),
            status: 'PENDING_SYNC'
        };

        const existing = JSON.parse(localStorage.getItem('pending_orders') || '[]');
        existing.push(pendingOrder);
        localStorage.setItem('pending_orders', JSON.stringify(existing));

        return { orderId: offlineId, displayId: 'WAITING-NET' };
    };

    const handleCheckout = async () => {
        try {
            if (isProcessing) return;

            if (!user?.id) {
                alert('Please log in first');
                return;
            }

            // CHECK ONLINE STATUS FIRST
            const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

            const processOrder = async (payload: any, mode: 'SUBSCRIPTION' | 'NORMAL') => {
                if (isOffline) {
                    return saveOfflineOrder(payload, mode);
                }

                try {
                    const response = await fetch('/api/orders/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        const text = await response.text();
                        let data;
                        try { data = JSON.parse(text); } catch (e) { throw new Error('Server error'); }
                        throw new Error(data.error || 'Request failed');
                    }
                    return await response.json();
                } catch (e: any) {
                    // If network error (fetch failed completely), treat as offline if likely network issue
                    // Note: 'TypeError: Failed to fetch' is the standard network error message
                    if (e.message === 'Failed to fetch' || e.message.includes('NetworkError')) {
                        console.log("Network request failed, saving offline.");
                        return saveOfflineOrder(payload, mode);
                    }
                    throw e;
                }
            };

            // 1. Process Subscription Part
            if (hasSubscription) {
                const subPayload = {
                    userId: user.id,
                    items: subscriptionItems.map(i => ({ menuItemId: i.id, qty: i.qty })),
                    mode: 'SUBSCRIPTION',
                };

                const result = await processOrder(subPayload, 'SUBSCRIPTION');
                if (result.orderId) setLastOrderId(result.orderId);
                if (result.displayId) setLastDisplayId(result.displayId);
            }

            // 2. Process Normal Part (Payment + Order Creation)
            if (hasNormal) {
                if (paymentMethod === 'UPI' && !upiId.trim()) {
                    alert('Please enter your UPI ID');
                    return;
                }

                if (!isOffline && (paymentMethod === 'UPI' || paymentMethod === 'SCAN')) {
                    setIsProcessing(true);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }

                const normalPayload = {
                    userId: user.id,
                    items: normalItems.map(i => ({ menuItemId: i.id, qty: i.qty })),
                    mode: 'NORMAL',
                    paymentMethod: paymentMethod,
                    upiId: paymentMethod === 'UPI' ? upiId : undefined,
                };

                const result = await processOrder(normalPayload, 'NORMAL');
                if (result.orderId) setLastOrderId(result.orderId);
                if (result.displayId) setLastDisplayId(result.displayId);
            }

            // Success
            setIsProcessing(false);
            setShowSuccessAnimation(true);

        } catch (err: any) {
            setIsProcessing(false);
            alert('Error: ' + err.message);
        }
    };

    // Helper for Button Text
    const getButtonText = () => {
        if (isProcessing) return 'Processing Payment...';
        if (!hasNormal) return 'Redeem Now';
        if (paymentMethod === 'CASH') return `Confirm Order (₹${normalTotalAmount})`;
        return `Proceed to Pay (₹${normalTotalAmount})`;
    };

    return (
        <>

            {variant === 'drawer' ? (
                <div className={`${styles.overlay} ${!isOpen ? styles.hidden : ''}`}>
                    <div className={styles.drawer}>
                        <header className={styles.header}>
                            <h2>Your Order</h2>
                            <button onClick={showSuccessAnimation ? handleAnimationComplete : onClose} className={styles.closeBtn}>×</button>
                        </header>

                        <CartContent
                            styles={styles}
                            hasSubscription={hasSubscription}
                            hasNormal={hasNormal}
                            isMixed={isMixed}
                            subTotalCount={subTotalCount}
                            normalTotalAmount={normalTotalAmount}
                            subscriptionItems={subscriptionItems}
                            normalItems={normalItems}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            upiId={upiId}
                            setUpiId={setUpiId}
                            decreaseQty={decreaseQty}
                            addToCart={addToCart}
                            removeFromCart={removeFromCart}
                            isProcessing={isProcessing}
                            handleCheckout={handleCheckout}
                            getButtonText={getButtonText}
                            showSuccessAnimation={showSuccessAnimation}
                            onAnimationComplete={handleAnimationComplete}
                            lastOrderId={lastOrderId}
                            displayId={lastDisplayId}
                        />
                    </div>
                </div>
            ) : (
                <div className={styles.sidebarWrapper}>
                    <div className={styles.sidebar}>
                        <header className={styles.header}>
                            <h2>Your Order</h2>
                            {/* No close button for sidebar */}
                        </header>

                        <CartContent
                            styles={styles}
                            hasSubscription={hasSubscription}
                            hasNormal={hasNormal}
                            isMixed={isMixed}
                            subTotalCount={subTotalCount}
                            normalTotalAmount={normalTotalAmount}
                            subscriptionItems={subscriptionItems}
                            normalItems={normalItems}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            upiId={upiId}
                            setUpiId={setUpiId}
                            decreaseQty={decreaseQty}
                            addToCart={addToCart}
                            removeFromCart={removeFromCart}
                            isProcessing={isProcessing}
                            handleCheckout={handleCheckout}
                            getButtonText={getButtonText}
                            showSuccessAnimation={showSuccessAnimation}
                            onAnimationComplete={handleAnimationComplete}
                            lastOrderId={lastOrderId}
                            displayId={lastDisplayId}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

// Extracted Content Component to reuse between Drawer and Sidebar
function CartContent({
    styles,
    hasSubscription,
    hasNormal,
    isMixed,
    subTotalCount,
    normalTotalAmount,
    subscriptionItems,
    normalItems,
    paymentMethod,
    setPaymentMethod,
    upiId,
    setUpiId,
    decreaseQty,
    addToCart,
    removeFromCart,
    isProcessing,
    handleCheckout,
    getButtonText,
    showSuccessAnimation,
    onAnimationComplete,
    lastOrderId,
    displayId
}: any) {
    if (showSuccessAnimation) {
        return (
            <div className={styles.content} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <OrderConfirmed
                    inline={true}
                    onComplete={onAnimationComplete}
                    orderId={lastOrderId}
                    displayId={displayId}
                />
            </div>
        );
    }

    return (
        <>
            <div className={styles.content}>
                {/* Section 1: Subscription Items */}
                {hasSubscription && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            🥗 Subscription Plan
                            <span className={styles.badge}>{subTotalCount} Items</span>
                        </h3>
                        <p className={styles.infoText}>Will be deducted from your daily quota.</p>

                        {subscriptionItems.map((item: any) => (
                            <div key={item.id} className={styles.itemRow} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ flex: 1 }}>
                                    <span>{item.name}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                                        <button
                                            onClick={() => decreaseQty(item.id, 'SUBSCRIPTION')}
                                            style={{ padding: '0 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', lineHeight: '1' }}
                                        >-</button>
                                        <span style={{ padding: '0 4px', fontSize: '0.9rem', fontWeight: '600' }}>{item.qty}</span>
                                        <button
                                            onClick={() => addToCart(item, 'SUBSCRIPTION')}
                                            style={{ padding: '0 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem', lineHeight: '1' }}
                                        >+</button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4444' }}
                                        aria-label="Remove item"
                                    >
                                        <TrashIcon width={18} height={18} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {subTotalCount > 4 && (
                            <div className={styles.errorBanner}>
                                ⚠️ You have exceeded the daily limit of 4 items.
                            </div>
                        )}
                    </div>
                )}

                {/* Divider if Mixed */}
                {isMixed && <div className={styles.divider} />}

                {/* Section 2: Normal Items */}
                {hasNormal && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            🍔 Pay-Per-Order
                            <span className={styles.badge}>₹ {normalTotalAmount}</span>
                        </h3>
                        <p className={styles.infoText}>Requires payment at checkout.</p>

                        {normalItems.map((item: any) => (
                            <div key={item.id} className={styles.itemRow} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ flex: 1 }}>
                                    <span>{item.name}</span>
                                </div>
                                <div className={styles.priceGroup} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                                        <button
                                            onClick={() => decreaseQty(item.id, 'NORMAL')}
                                            style={{ padding: '0 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', lineHeight: '1' }}
                                        >-</button>
                                        <span style={{ padding: '0 4px', fontSize: '0.9rem', fontWeight: '600' }}>{item.qty}</span>
                                        <button
                                            onClick={() => addToCart(item, 'NORMAL')}
                                            style={{ padding: '0 8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem', lineHeight: '1' }}
                                        >+</button>
                                    </div>
                                    <span className={styles.price}>₹ {item.price * item.qty}</span>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4444' }}
                                        aria-label="Remove item"
                                    >
                                        <TrashIcon width={18} height={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Payment Options (Only for Normal Orders) */}
                {hasNormal && (
                    <div className={styles.section} style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                        <h3 className={styles.sectionTitle} style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                            💳 Payment Method
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', border: paymentMethod === 'CASH' ? '1px solid #5C3A1A' : '1px solid #ddd', borderRadius: '0.5rem', backgroundColor: paymentMethod === 'CASH' ? '#fdf8f6' : 'white' }}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="CASH"
                                    checked={paymentMethod === 'CASH'}
                                    onChange={() => setPaymentMethod('CASH')}
                                    style={{ accentColor: '#5C3A1A' }}
                                />
                                <span style={{ fontWeight: 500 }}>💵 Cash / Counter</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', border: paymentMethod === 'UPI' ? '1px solid #5C3A1A' : '1px solid #ddd', borderRadius: '0.5rem', backgroundColor: paymentMethod === 'UPI' ? '#fdf8f6' : 'white' }}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="UPI"
                                    checked={paymentMethod === 'UPI'}
                                    onChange={() => setPaymentMethod('UPI')}
                                    style={{ accentColor: '#5C3A1A' }}
                                />
                                <span style={{ fontWeight: 500 }}>📱 UPI ID</span>
                            </label>

                            {paymentMethod === 'UPI' && (
                                <div style={{ paddingLeft: '2rem', marginTop: '-0.25rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Enter UPI ID (e.g. 9876543210@upi)"
                                        value={upiId}
                                        onChange={(e: any) => setUpiId(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            borderRadius: '0.3rem',
                                            border: '1px solid #ccc',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </div>
                            )}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', border: paymentMethod === 'SCAN' ? '1px solid #5C3A1A' : '1px solid #ddd', borderRadius: '0.5rem', backgroundColor: paymentMethod === 'SCAN' ? '#fdf8f6' : 'white' }}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="SCAN"
                                    checked={paymentMethod === 'SCAN'}
                                    onChange={() => setPaymentMethod('SCAN')}
                                    style={{ accentColor: '#5C3A1A' }}
                                />
                                <span style={{ fontWeight: 500 }}>📷 Scan & Pay</span>
                            </label>
                        </div>

                        {paymentMethod === 'SCAN' && (
                            <div style={{ marginTop: '1rem', textAlign: 'center', border: '1px dashed #ccc', padding: '1rem', borderRadius: '0.5rem' }}>
                                <div style={{ width: '150px', height: '150px', backgroundColor: '#eee', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '0.8rem' }}>
                                    [QR Code Placeholder]
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>Scan this QR to pay ₹{normalTotalAmount}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Prep Time Notice (Replaces Time Slot) */}
                <div className={styles.section} style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <div style={{
                        backgroundColor: '#fff3cd',
                        color: '#856404',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.9rem',
                        border: '1px solid #ffeeba',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ fontSize: '1.2rem' }}>⏳</span>
                        <div>
                            <strong>Preparation Time:</strong>
                            <p style={{ margin: 0 }}>Orders are usually done within 10 minutes after preparation starts.</p>
                        </div>
                    </div>
                </div>

                {!hasSubscription && !hasNormal && (
                    <div className={styles.emptyState}>Your cart is empty.</div>
                )}
            </div>

            <footer className={styles.footer}>
                {isMixed && (
                    <div className={styles.mixedWarning}>
                        <strong>Note:</strong> You are placing a mixed order.
                        Subscription items will be redeemed, and you will pay
                        ₹{normalTotalAmount} for the rest.
                    </div>
                )}

                <button
                    className={styles.checkoutBtn}
                    disabled={subTotalCount > 4 || (!hasSubscription && !hasNormal) || isProcessing}
                    onClick={handleCheckout}
                    style={{ opacity: isProcessing ? 0.7 : 1 }}
                >
                    {getButtonText()}
                </button>
            </footer>
        </>
    );
}

