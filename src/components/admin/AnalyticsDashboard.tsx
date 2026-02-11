'use client';

import React, { useState } from 'react';
import {
    IndianRupee,
    TrendingUp,
    ShoppingBasket,
    UserPlus,
    BarChart3,
    Star,
    Smile,
    Frown,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Mail,
    ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

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

const AnalyticsDashboard = ({ data, timeframe, onTimeframeChange }: {
    data?: AnalyticsData;
    timeframe: 'today' | 'week' | 'month';
    onTimeframeChange: (t: 'today' | 'week' | 'month') => void;
}) => {
    const [showCustomersModal, setShowCustomersModal] = useState(false);
    const [emailScheduled, setEmailScheduled] = useState(false);

    // Safe access to data or defaults
    const revenue = data?.kpi?.totalRevenue || 0;
    const avgValue = data?.kpi?.avgOrderValue || 0;
    const newCust = data?.kpi?.newCustomers || 0;

    // Chart Data Mock or Real
    const chartData = data?.salesChart?.data || [0, 0, 0, 0, 0, 0, 0];
    const maxVal = Math.max(...chartData, 1);

    // Simple SVG Path Generation
    const points = chartData.map((val, idx) => {
        const x = (idx / (chartData.length - 1)) * 100;
        const y = 100 - (val / maxVal) * 80; // Scale to fit 100x100 box
        return `${x},${y}`;
    }).join(' ');

    const svgPath = `M0,100 L${points} L100,100 Z`;
    const linePath = `M${points}`;

    const handleExport = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
            loading: 'Generating Report...',
            success: 'Report downloaded successfully!',
            error: 'Failed to download report'
        });
    };

    const handleScheduleEmail = () => {
        setEmailScheduled(!emailScheduled);
        toast.success(emailScheduled ? 'Weekly email report disabled' : 'Weekly email report scheduled!');
    };

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-[#0e2a1a] flex items-center gap-2">
                        Business Analytics
                        <span className="text-xs font-sans bg-[#14b84b]/10 text-[#14b84b] px-2 py-1 rounded-full font-bold">LIVE</span>
                    </h2>
                    <p className="text-sm text-[#0e2a1a]/60">Performance metrics and insights</p>
                </div>

                {/* Timeframe Toggle */}
                <div className="bg-white p-1 rounded-xl border border-[#14b84b]/10 flex shadow-sm">
                    {(['today', 'week', 'month'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => onTimeframeChange(t)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${timeframe === t
                                ? 'bg-[#0e2a1a] text-white shadow-md'
                                : 'text-gray-500 hover:text-[#0e2a1a] hover:bg-gray-50'
                                }`}
                        >
                            {t === 'today' ? 'Today' : t === 'week' ? 'Week' : 'Month'}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Revenue */}
                <div className="bg-white p-6 rounded-2xl border border-[#14b84b]/10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <IndianRupee className="w-24 h-24 text-[#14b84b]" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#14b84b]/10 rounded-lg text-[#14b84b]">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Revenue</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-[#0e2a1a]">₹{revenue.toLocaleString()}</h3>
                        <span className="text-xs font-bold text-[#14b84b] flex items-center">
                            <ArrowUpRight className="w-3 h-3" /> +12%
                        </span>
                    </div>
                </div>

                {/* Avg Order Value */}
                <div className="bg-white p-6 rounded-2xl border border-[#14b84b]/10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingBasket className="w-24 h-24 text-[#f59e0b]" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#f59e0b]/10 rounded-lg text-[#f59e0b]">
                            <ShoppingBasket className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Order Value</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-[#0e2a1a]">₹{avgValue.toLocaleString()}</h3>
                    </div>
                </div>

                {/* New Customers */}
                <button
                    onClick={() => setShowCustomersModal(true)}
                    className="bg-white p-6 rounded-2xl border border-[#14b84b]/10 shadow-sm relative overflow-hidden group text-left transition-transform hover:scale-[1.02]"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <UserPlus className="w-24 h-24 text-blue-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Customers</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-[#0e2a1a]">{newCust}</h3>
                        <span className="text-[10px] text-gray-400 font-medium ml-auto">Click for details →</span>
                    </div>
                </button>
            </div>

            {/* Filters & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Analytics Filters */}
                <div className="bg-white p-6 rounded-2xl border border-[#14b84b]/10 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-[#0e2a1a]">Analytics Filters</h4>
                        <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Start Date</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-[#0e2a1a]">Oct 01, 2023</span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">End Date</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-[#0e2a1a]">Oct 31, 2023</span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        onClick={handleExport}
                        className="w-full bg-[#14b84b] hover:bg-[#14b84b]/90 text-white p-4 rounded-2xl shadow-lg shadow-[#14b84b]/20 flex items-center justify-between group transition-all"
                    >
                        <span className="font-bold flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            Export Full Report
                        </span>
                    </button>

                    <button
                        onClick={handleScheduleEmail}
                        className={`w-full bg-white border p-4 rounded-2xl shadow-sm flex items-center justify-between transition-all ${emailScheduled ? 'border-[#14b84b] ring-1 ring-[#14b84b] bg-[#14b84b]/5' : 'border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        <div className="text-left">
                            <span className="font-bold text-[#0e2a1a] block text-sm flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Schedule Weekly Email
                            </span>
                        </div>
                        <div className={`w-10 h-6 rounded-full transition-colors relative ${emailScheduled ? 'bg-[#14b84b]' : 'bg-gray-200'}`}>
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${emailScheduled ? 'translate-x-4' : ''}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Charts & Lists Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Revenue Trends */}
                <div className="bg-white p-6 rounded-2xl border border-[#14b84b]/10 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h4 className="text-lg font-bold text-[#0e2a1a]">Revenue Trends</h4>
                            <p className="text-xs text-gray-500">Daily financial performance overview</p>
                        </div>
                        <div className="bg-gray-100 flex p-1 rounded-lg">
                            {(['Daily', 'Weekly', 'Monthly'] as const).map(t => (
                                <button key={t} className={`px-3 py-1 text-[10px] font-bold rounded-md ${t === 'Daily' ? 'bg-white shadow text-[#0e2a1a]' : 'text-gray-400'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="h-64 w-full relative group">
                        {/* Tooltip Mock */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#0e2a1a] text-white text-xs font-bold px-2 py-1 rounded shadow-lg transform -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            ₹2,140
                        </div>

                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#14b84b" stopOpacity="0.2"></stop>
                                    <stop offset="100%" stopColor="#14b84b" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            <path d={svgPath} fill="url(#chartGradient)" />
                            <path d={linePath} fill="none" stroke="#14b84b" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />

                            {/* Grid Lines */}
                            {[20, 40, 60, 80].map(y => (
                                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f0f0f0" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                            ))}
                        </svg>
                        {/* Labels - Simplified */}
                        <div className="flex justify-between mt-2 text-[10px] uppercase font-bold text-gray-400">
                            {data?.salesChart?.labels.map((l, i) => <span key={i}>{l.slice(0, 3)}</span>)}
                        </div>
                    </div>
                </div>

                {/* Menu Bestsellers */}
                <div className="bg-white p-6 rounded-2xl border border-[#14b84b]/10 shadow-sm">
                    <div className="mb-6 flex justify-between items-center">
                        <h4 className="text-lg font-bold text-[#0e2a1a]">Menu Bestsellers</h4>
                        <button className="text-xs font-bold text-[#14b84b] hover:underline">View All Items</button>
                    </div>
                    <div className="space-y-6">
                        {(data?.topSellingItems || []).slice(0, 5).map((item, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold text-[#0e2a1a]">
                                    <span>{item.name}</span>
                                    <span className="text-gray-400">{item.count} orders</span>
                                </div>
                                <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${idx === 0 ? 'bg-[#14b84b]' : idx === 1 ? 'bg-[#f59e0b]' : 'bg-[#14b84b]'}`}
                                        style={{ width: item.width }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* New Customers Modal */}
            {showCustomersModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowCustomersModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-[#0e2a1a] text-white p-6 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-xl font-bold font-serif">New Customers</h3>
                                <p className="text-xs text-white/70">Joined recently</p>
                            </div>
                            <button onClick={() => setShowCustomersModal(false)} className="text-white/70 hover:text-white">✕</button>
                        </div>
                        <div className="overflow-y-auto p-4 space-y-3">
                            {data?.newCustomersList?.map((c) => (
                                <div key={c.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 bg-[#0e2a1a] text-white rounded-full flex items-center justify-center font-bold text-lg">
                                        {c.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#0e2a1a]">{c.name}</p>
                                        <p className="text-xs text-gray-500">{c.phone}</p>
                                    </div>
                                    <div className="ml-auto text-xs font-bold text-gray-400">
                                        {new Date(c.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                            {(!data?.newCustomersList || data.newCustomersList.length === 0) && (
                                <p className="text-center text-gray-400 py-8">No new customers found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;
