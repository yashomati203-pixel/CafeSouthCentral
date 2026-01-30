'use client';

import React, { useState } from 'react';
import {
    IndianRupee,
    TrendingUp,
    ShoppingBasket,
    UserPlus,
    Download,
    Bell,
    Star,
    Smile,
    Frown,
    Search
} from 'lucide-react';

interface NewCustomer {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    createdAt: string;
}

interface AnalyticsData {
    kpi: {
        totalRevenue: number;
        avgOrderValue: number;
        newCustomers: number;
        totalOrders: number;
    };
    salesChart: {
        labels: string[];
        data: number[];
    };
    topSellingItems: {
        name: string;
        count: number;
        width: string;
    }[];
    peakHours: {
        time: string;
        height: string;
        opacity: string;
    }[];
    sentiment: {
        average: string;
        positivePct: number;
        neutralPct: number;
        negativePct: number;
    };
    newCustomersList?: NewCustomer[];
}

const AnalyticsDashboard = ({ data }: { data?: AnalyticsData }) => {
    const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('week');
    const [showCustomersModal, setShowCustomersModal] = useState(false);

    // Safe access to data or defaults
    const revenue = data?.kpi?.totalRevenue || 0;
    const avgValue = data?.kpi?.avgOrderValue || 0;
    const newCust = data?.kpi?.newCustomers || 0;

    // Generate SVG path for chart dynamically
    const chartData = data?.salesChart?.data || [10, 50, 20, 80, 40, 90, 30];
    const maxVal = Math.max(...chartData, 1);
    const points = chartData.map((val, idx) => {
        const x = (idx / (chartData.length - 1)) * 800;
        const y = 200 - (val / maxVal) * 180; // 180 height to leave margin
        return `${x},${y}`;
    }).join(' ');

    const svgPath = `M0,200 L${points} L800,200 Z`;
    const strokePath = `M${points}`; // Just the line

    return (
        <div className="bg-bg-light dark:bg-bg-dark text-text-main dark:text-gray-100 min-h-screen font-display p-6 lg:p-10 space-y-8 rounded-xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-text-subtle font-semibold tracking-widest uppercase text-xs">Admin Dashboard</p>
                    <h2 className="text-4xl font-black tracking-tight dark:text-white">Analytics & Insights</h2>
                    <p className="text-text-subtle text-lg">Real-time business intelligence for your cafe performance.</p>
                </div>
                {/* Segmented Buttons Filter */}
                <div className="bg-surface-light dark:bg-surface-dark p-1 rounded-xl border border-border-light dark:border-border-dark flex w-fit self-start">
                    {(['today', 'week', 'month'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all capitalize ${timeframe === t
                                ? 'bg-primary-brown text-white'
                                : 'text-text-subtle hover:text-primary-brown'
                                }`}
                        >
                            {t === 'today' ? 'Today' : t === 'week' ? 'This Week' : 'This Month'}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* KPI Card 1 */}
                <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary-brown/5 rounded-xl group-hover:bg-primary-brown/10 transition-colors">
                            <IndianRupee className="text-primary-brown w-6 h-6" />
                        </div>
                        <span className="text-accent-gold flex items-center gap-1 font-bold text-sm bg-accent-gold/10 px-2 py-1 rounded-lg">
                            <TrendingUp className="w-4 h-4" /> Live
                        </span>
                    </div>
                    <p className="text-text-subtle font-medium text-sm">Total Revenue</p>
                    <h3 className="text-3xl font-black mt-1">₹{revenue.toLocaleString()}</h3>
                </div>

                {/* KPI Card 2 */}
                <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary-brown/5 rounded-xl group-hover:bg-primary-brown/10 transition-colors">
                            <ShoppingBasket className="text-primary-brown w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-text-subtle font-medium text-sm">Avg Order Value</p>
                    <h3 className="text-3xl font-black mt-1">₹{avgValue.toLocaleString()}</h3>
                </div>

                {/* KPI Card 3 - Clickable New Customers */}
                <button
                    onClick={() => setShowCustomersModal(true)}
                    className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-all group cursor-pointer text-left w-full hover:scale-[1.02]"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary-brown/5 rounded-xl group-hover:bg-primary-brown/10 transition-colors">
                            <UserPlus className="text-primary-brown w-6 h-6" />
                        </div>
                        <span className="text-accent-gold flex items-center gap-1 font-bold text-sm bg-accent-gold/10 px-2 py-1 rounded-lg">
                            <TrendingUp className="w-4 h-4" /> 30 Days
                        </span>
                    </div>
                    <p className="text-text-subtle font-medium text-sm">New Customers</p>
                    <h3 className="text-3xl font-black mt-1">{newCust}</h3>
                    <p className="text-xs text-primary-brown font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">👆 Click to view details</p>
                </button>
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sales Over Time Widget (Lrg) */}
                <div className="lg:col-span-8 bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-border-light dark:border-border-dark">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">Sales Over Time {data?.salesChart ? '(Last 7 Days)' : '(Demo Data)'}</h4>
                            <p className="text-text-subtle text-sm">Daily revenue performance</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-gray-900 dark:text-white">₹{revenue.toLocaleString()}</span>
                            <span className="text-text-subtle font-medium">total sales</span>
                        </div>
                        <div className="h-[300px] w-full relative flex flex-col justify-end">
                            {/* Dynamic Svg Chart */}
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#6f4520" stopOpacity="0.2"></stop>
                                        <stop offset="100%" stopColor="#6f4520" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d={svgPath} fill="url(#chartGradient)"></path>
                                <path d={strokePath} fill="none" stroke="#6f4520" strokeLinecap="round" strokeWidth="4"></path>
                            </svg>
                            {/* X-Axis Labels */}
                            <div className="flex justify-between mt-4 px-2">
                                {data?.salesChart?.labels.map((label, i) => (
                                    <span key={i} className="text-xs font-bold text-text-subtle">{label}</span>
                                )) || (
                                        <>
                                            <span className="text-xs font-bold text-text-subtle">Mon</span>
                                            <span className="text-xs font-bold text-text-subtle">Tue</span>
                                            <span className="text-xs font-bold text-text-subtle">Wed</span>
                                            <span className="text-xs font-bold text-text-subtle">Thu</span>
                                            <span className="text-xs font-bold text-primary-brown">Fri</span>
                                            <span className="text-xs font-bold text-text-subtle">Sat</span>
                                            <span className="text-xs font-bold text-text-subtle">Sun</span>
                                        </>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Selling Items (Med) */}
                <div className="lg:col-span-4 bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-border-light dark:border-border-dark">
                    <div className="mb-8">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">Top Selling Items</h4>
                        <p className="text-text-subtle text-sm">Most popular menu items by volume</p>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-gray-900 dark:text-white">{data?.kpi?.totalOrders || 0}</span>
                            <span className="text-text-subtle font-medium">total orders</span>
                        </div>
                        {/* Bar Chart */}
                        <div className="space-y-5 mt-4">
                            {(data?.topSellingItems || []).map((item) => (
                                <div key={item.name} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold text-gray-800 dark:text-gray-200">
                                        <span>{item.name}</span>
                                        <span>{item.count}</span>
                                    </div>
                                    <div className="w-full h-3 bg-bg-light dark:bg-bg-dark rounded-full overflow-hidden">
                                        <div className="h-full bg-primary-brown rounded-full" style={{ width: item.width }}></div>
                                    </div>
                                </div>
                            ))}
                            {(!data?.topSellingItems || data.topSellingItems.length === 0) && (
                                <div className="text-center text-sm text-text-subtle">No sales data yet</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secondary Bento Layer (Recent Transactions) */}
                <div className="lg:col-span-6 bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-border-light dark:border-border-dark">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">Peak Performance Hours</h4>
                        <span className="text-primary-brown text-xs font-bold px-2 py-1 bg-primary-brown/10 rounded-lg">High Activity</span>
                    </div>
                    <div className="grid grid-cols-6 gap-2 items-end h-40">
                        {/* Bars */}
                        {(data?.peakHours || []).map((bar) => (
                            <div key={bar.time} className={`bg-primary-brown rounded-t-lg flex items-center justify-center group relative ${bar.opacity}`} style={{ height: bar.height }}>
                                <span className="absolute -top-6 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-primary-brown">{bar.time}</span>
                            </div>
                        ))}
                        {(!data?.peakHours || data.peakHours.length === 0) && (
                            <div className="col-span-6 text-center text-sm text-text-subtle flex items-center justify-center h-full">No activity data yet</div>
                        )}
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] font-bold text-text-subtle px-1 uppercase tracking-wider">
                        <span>Breakfast</span>
                        <span>Lunch</span>
                        <span>Closing</span>
                    </div>
                </div>

                {/* Customer Sentiment Widget */}
                <div className="lg:col-span-6 bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-border-light dark:border-border-dark flex flex-col justify-between">
                    <div>
                        <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Customer Satisfaction</h4>
                        <p className="text-text-subtle text-sm">Feedback based on all orders</p>
                    </div>
                    <div className="flex items-center gap-10 mt-6">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle className="stroke-bg-light dark:stroke-bg-dark" cx="18" cy="18" fill="none" r="16" strokeWidth="4"></circle>
                                <circle cx="18" cy="18" fill="none" r="16" stroke="#6f4520" strokeDasharray={`${(parseFloat(data?.sentiment?.average || '0') / 5) * 100}, 100`} strokeLinecap="round" strokeWidth="4"></circle>
                            </svg>
                            <span className="absolute text-2xl font-black text-gray-900 dark:text-white">{data?.sentiment?.average || '0.0'}</span>
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                <Star className="text-accent-gold w-5 h-5" />
                                <div className="flex-1 h-1.5 bg-bg-light dark:bg-bg-dark rounded-full overflow-hidden">
                                    <div className="h-full bg-accent-gold" style={{ width: `${data?.sentiment?.positivePct || 0}%` }}></div>
                                </div>
                                <span className="text-xs font-bold w-6 text-gray-700 dark:text-gray-300">{data?.sentiment?.positivePct || 0}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Smile className="text-accent-gold w-5 h-5" />
                                <div className="flex-1 h-1.5 bg-bg-light dark:bg-bg-dark rounded-full overflow-hidden">
                                    <div className="h-full bg-accent-gold" style={{ width: `${data?.sentiment?.neutralPct || 0}%` }}></div>
                                </div>
                                <span className="text-xs font-bold w-6 text-gray-700 dark:text-gray-300">{data?.sentiment?.neutralPct || 0}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Frown className="text-gray-300 w-5 h-5" />
                                <div className="flex-1 h-1.5 bg-bg-light dark:bg-bg-dark rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-300" style={{ width: `${data?.sentiment?.negativePct || 0}%` }}></div>
                                </div>
                                <span className="text-xs font-bold w-6 text-gray-700 dark:text-gray-300">{data?.sentiment?.negativePct || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Customers Modal */}
            {showCustomersModal && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowCustomersModal(false)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-primary-brown text-white p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black">New Customers (Last 30 Days)</h3>
                                <p className="text-sm text-white/80 mt-1">{data?.newCustomersList?.length || 0} customers joined recently</p>
                            </div>
                            <button
                                onClick={() => setShowCustomersModal(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto max-h-[60vh] p-6">
                            {!data?.newCustomersList || data.newCustomersList.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <UserPlus className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p className="text-lg font-bold">No new customers yet</p>
                                    <p className="text-sm">Check back later!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {data.newCustomersList.map((customer, idx) => (
                                        <div
                                            key={customer.id}
                                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-all border-l-4 border-primary-brown"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-10 h-10 bg-primary-brown text-white rounded-full flex items-center justify-center font-black text-lg">
                                                            {customer.name?.[0]?.toUpperCase() || '?'}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-lg text-gray-900 dark:text-white">{customer.name || 'Unknown'}</h4>
                                                            <p className="text-sm text-gray-500">#{idx + 1} newest customer</p>
                                                        </div>
                                                    </div>
                                                    <div className="ml-13 space-y-1">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="font-bold text-gray-600 dark:text-gray-400">📞 Phone:</span>
                                                            <span className="text-gray-900 dark:text-white font-medium">{customer.phone}</span>
                                                        </div>
                                                        {customer.email && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <span className="font-bold text-gray-600 dark:text-gray-400">📧 Email:</span>
                                                                <span className="text-gray-900 dark:text-white font-medium">{customer.email}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="font-bold text-gray-600 dark:text-gray-400">📅 Joined:</span>
                                                            <span className="text-gray-900 dark:text-white font-medium">
                                                                {new Date(customer.createdAt).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;
