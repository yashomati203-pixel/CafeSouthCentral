'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useCart } from '@/context/CartContext';
import { requestNotificationPermission, sendLocalNotification } from '@/lib/notifications';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import OrderTrackingModal from '@/components/orders/OrderTrackingModal';
import {
    BarChart3,
    ShieldCheck,
    RotateCcw,
    Ban,
    QrCode,
    Calendar,
    ChevronDown,
    Printer,
    CreditCard
} from 'lucide-react';

type StatusFilter = 'ALL' | 'COMPLETED' | 'SCHEDULED';

export default function OrderHistoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToCart } = useCart();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [activeQrOrder, setActiveQrOrder] = useState<any>(null);
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [visibleCount, setVisibleCount] = useState(5);

    // Load User
    useEffect(() => {
        const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
        if (!storedUser) {
            router.push('/?login=true');
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [router]);

    // Poll Orders
    useEffect(() => {
        if (user?.id) {
            requestNotificationPermission();

            const poll = () => {
                fetch(`/api/user/orders?userId=${user.id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (Array.isArray(data)) {
                            setOrders(prevOrders => {
                                // Notification logic for status change
                                data.forEach(newOrder => {
                                    const oldOrder = prevOrders.find(o => o.id === newOrder.id);
                                    if (oldOrder && oldOrder.status !== 'DONE' && newOrder.status === 'DONE') {
                                        sendLocalNotification(
                                            "Order Ready! 🍽️",
                                            `Order #${newOrder.displayId || newOrder.id.slice(0, 5)} is ready for pickup.`
                                        );
                                    }
                                });
                                // Sort by date desc
                                return data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                            });
                        }
                        setLoading(false);
                    })
                    .catch(e => {
                        console.error(e);
                        setLoading(false);
                    });
            };

            poll();
            const interval = setInterval(poll, 5000);
            return () => clearInterval(interval);
        }
    }, [user?.id]);

    // Auto-open QR for new order
    useEffect(() => {
        if (orders.length > 0 && searchParams.get('newOrder') === 'true') {
            setActiveQrOrder(orders[0]); // Latest order is first due to sort
            // Remove query param without refresh
            const url = new URL(window.location.href);
            url.searchParams.delete('newOrder');
            window.history.replaceState({}, '', url);
        }
    }, [orders, searchParams]);

    const handleLogout = () => {
        if (!confirm('Are you sure you want to log out?')) return;
        localStorage.removeItem('cafe_user');
        sessionStorage.removeItem('cafe_user');
        sessionStorage.removeItem('cafe_has_explored');
        window.dispatchEvent(new Event('storage-update'));
        router.push('/');
    };

    const toggleOrderExpansion = (orderId: string) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'SOLD':
            case 'COMPLETED':
                return { bg: 'bg-[#0ac238]/10', color: 'text-[#0ac238]', label: 'Completed' };
            case 'CANCELLED':
            case 'CANCELLED_USER':
                return { bg: 'bg-red-50 dark:bg-red-900/10', color: 'text-red-500', label: 'Cancelled' };
            case 'DONE':
            case 'READY':
                return { bg: 'bg-[#0ac238]/10', color: 'text-[#0ac238]', label: 'Ready for Pickup' };
            case 'PREPARING':
            case 'CONFIRMED':
            case 'RECEIVED':
            case 'PENDING':
                return { bg: 'bg-yellow-50 dark:bg-yellow-900/10', color: 'text-yellow-600', label: 'In Progress' };
            default:
                return { bg: 'bg-gray-100 dark:bg-gray-800', color: 'text-gray-500', label: status.replace('_', ' ') };
        }
    };

    const filteredOrders = orders.filter(order => {
        // Filter: Exclude cancelled orders, show everything else (including active/pending)
        if (order.status === 'CANCELLED' || order.status === 'CANCELLED_USER') return false;

        // Date filter
        if (selectedDate) {
            const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
            if (orderDate !== selectedDate) return false;
        }

        return true;
    });

    // Formatting currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Calculate Member Since (Oldest order date or current date if no orders)
    const memberSince = orders.length > 0
        ? new Date(orders[orders.length - 1].createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f8fbf7] dark:bg-[#102214]">Loading...</div>;

    return (
        <div className="flex min-h-screen bg-[#f8fbf7] dark:bg-[#102214]">
            {/* Sidebar */}
            <ProfileSidebar user={user} onLogout={handleLogout} />

            {/* Main Content */}
            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 md:px-10 md:py-12">
                <header className="mb-10">
                    <h2 className="text-4xl font-serif text-[#0d1c11] dark:text-white mb-2 font-bold">Past Orders</h2>
                    <p className="text-[#499c5e] text-base">Manage and track your recent cafe orders.</p>
                </header>

                {/* Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="flex flex-col gap-2 rounded-xl p-8 bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-2 text-[#499c5e] mb-1">
                            <BarChart3 className="w-5 h-5" />
                            <p className="text-sm font-semibold uppercase tracking-wider">Total Orders</p>
                        </div>
                        <p className="text-[#0d1c11] dark:text-white text-4xl font-black leading-tight">{orders.length}</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-8 bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-2 text-[#499c5e] mb-1">
                            <ShieldCheck className="w-5 h-5" />
                            <p className="text-sm font-semibold uppercase tracking-wider">Member Since</p>
                        </div>
                        <p className="text-[#0d1c11] dark:text-white text-4xl font-black leading-tight">{memberSince}</p>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row justify-end items-center gap-4 mb-8">
                    {/* Date Picker */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Calendar className="w-4 h-4" />
                            <span>{selectedDate ? new Date(selectedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Filter by Date'}</span>
                        </button>

                        {showDatePicker && (
                            <div className="absolute top-full right-0 mt-2 p-4 bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        setShowDatePicker(false);
                                    }}
                                    className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-transparent text-gray-900 dark:text-white mb-2 w-full"
                                />
                                {selectedDate && (
                                    <button
                                        onClick={() => {
                                            setSelectedDate('');
                                            setShowDatePicker(false);
                                        }}
                                        className="w-full py-2 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20"
                                    >
                                        Clear Filter
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Orders List */}
                <div className="flex flex-col gap-6">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-[#1e1e1e] rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                            <p className="text-gray-500 mb-4">No orders found.</p>
                            <button onClick={() => router.push('/menu')} className="text-[#0ac238] font-bold hover:underline">Browse Menu</button>
                        </div>
                    ) : (
                        filteredOrders.slice(0, visibleCount).map(order => {
                            const isExpanded = expandedOrders.has(order.id);
                            const statusStyle = getStatusStyle(order.status);
                            const mainItem = order.items[0];
                            const imageUrl = mainItem?.image || mainItem?.menuItem?.image || '/images/placeholder-food.png';
                            const title = order.items.length > 1
                                ? `${mainItem?.name} + ${order.items.length - 1} more`
                                : mainItem?.name || 'Order #' + order.id.slice(0, 5);

                            const isCancelled = order.status === 'CANCELLED' || order.status === 'CANCELLED_USER';

                            return (
                                <div
                                    key={order.id}
                                    className={`
                                        bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300
                                        ${isExpanded ? 'ring-1 ring-[#0ac238]/20 shadow-md' : 'hover:shadow-md'}
                                        ${isCancelled ? 'opacity-75' : ''}
                                    `}
                                >
                                    {/* Main Card Content - Clickable Header */}
                                    <div
                                        className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer"
                                        onClick={() => toggleOrderExpansion(order.id)}
                                    >
                                        <div className="flex items-center gap-6 flex-1 w-full">
                                            <div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                <div
                                                    className="w-full h-full bg-center bg-no-repeat bg-cover"
                                                    style={{ backgroundImage: `url(${imageUrl})` }}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-3">
                                                    <span className={`${statusStyle.bg} ${statusStyle.color} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>
                                                        {statusStyle.label}
                                                    </span>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Order #{order.displayId || order.id.slice(0, 5).toUpperCase()}</p>
                                                </div>
                                                <h3 className="text-lg font-bold text-[#0d1c11] dark:text-white mt-1">{title}</h3>
                                                <p className="text-[#499c5e] text-sm">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto justify-between md:justify-end" onClick={(e) => e.stopPropagation()}>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mb-1">Total</p>
                                                <p className="text-xl font-bold text-[#0d1c11] dark:text-white">{formatCurrency(order.totalAmount)}</p>
                                            </div>

                                            <div className="flex gap-2">
                                                {/* Reorder Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm(`Add ${order.items.length} items from this order to cart?`)) {
                                                            let added = 0;
                                                            order.items.forEach((item: any) => {
                                                                if (item.menuItem) {
                                                                    addToCart(item.menuItem, 'NORMAL');
                                                                    added++;
                                                                }
                                                            });
                                                            if (added > 0) {
                                                                alert(`${added} items added to cart!`);
                                                                router.push('/?section=cart');
                                                            }
                                                        }
                                                    }}
                                                    disabled={isCancelled}
                                                    className={`
                                                        px-3 py-1.5 rounded-lg text-sm font-bold transition-colors
                                                        ${isCancelled
                                                            ? 'text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                                                            : 'text-[#0ac238] bg-[#0ac238]/10 hover:bg-[#0ac238]/20'
                                                        }
                                                    `}
                                                    title="Reorder"
                                                >
                                                    {isCancelled ? 'Closed' : 'Reorder'}
                                                </button>

                                                {/* Show QR Button for Active Orders */}
                                                {!isCancelled && order.status !== 'COMPLETED' && order.status !== 'SOLD' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveQrOrder(order);
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg text-sm font-bold transition-colors text-[#0d1c11] bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 flex items-center gap-2"
                                                        title="Track Order"
                                                    >
                                                        <QrCode className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Track</span>
                                                    </button>
                                                )}

                                                {/* Details Toggle Button (Chevron) */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleOrderExpansion(order.id);
                                                    }}
                                                    className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}
                                                >
                                                    <ChevronDown className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details Section */}
                                    {
                                        isExpanded && (
                                            <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-200">
                                                <div className="h-px w-full bg-gray-100 dark:bg-gray-800 mb-6"></div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    {/* Left Column: Items */}
                                                    <div>
                                                        <h4 className="text-sm font-bold text-[#0d1c11] dark:text-white mb-4 uppercase tracking-wider">Items Ordered</h4>
                                                        <div className="space-y-3">
                                                            {order.items.map((item: any, idx: number) => (
                                                                <div key={idx} className="flex justify-between items-start text-sm">
                                                                    <span className="text-gray-600 dark:text-gray-300">
                                                                        <span className="font-bold text-[#0ac238] mr-2">{item.quantity}x</span>
                                                                        {item.name}
                                                                    </span>
                                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                        {formatCurrency(item.price * item.quantity)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                                            <span className="font-bold text-[#0d1c11] dark:text-white">Subtotal</span>
                                                            <span className="font-bold text-[#0d1c11] dark:text-white">{formatCurrency(order.totalAmount)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Right Column: Info & Actions */}
                                                    <div className="flex flex-col gap-6">
                                                        <div>
                                                            <h4 className="text-sm font-bold text-[#0d1c11] dark:text-white mb-2 uppercase tracking-wider">Payment Details</h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                                <CreditCard className="w-4 h-4" />
                                                                {order.paymentMethod === 'Upi' ? 'UPI Payment' : order.paymentMethod === 'Cash' ? 'Cash at Counter' : 'Online Payment'}
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-3 mt-auto">
                                                            {/* Print Bill Button - Full Width now */}
                                                            <a
                                                                href={`/receipt/${order.id}`}
                                                                target="_blank"
                                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm bg-gray-100 dark:bg-gray-800 text-[#0d1c11] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                            >
                                                                <Printer className="w-4 h-4" />
                                                                Print Bill
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            );
                        })
                    )}
                </div>

                {
                    visibleCount < filteredOrders.length && (
                        <div className="mt-12 text-center">
                            <button
                                onClick={() => setVisibleCount(prev => prev + 5)}
                                className="text-[#499c5e] font-bold text-sm hover:underline decoration-2 underline-offset-4"
                            >
                                View Older Transactions
                            </button>
                        </div>
                    )
                }
            </main >


            {/* Order Tracking Modal */}
            {
                activeQrOrder && (
                    <OrderTrackingModal
                        order={activeQrOrder}
                        onClose={() => setActiveQrOrder(null)}
                    />
                )
            }
        </div >
    );
}
