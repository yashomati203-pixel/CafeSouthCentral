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

const AnalyticsDashboard = () => {
    const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('week');

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
                            <TrendingUp className="w-4 h-4" /> +12.5%
                        </span>
                    </div>
                    <p className="text-text-subtle font-medium text-sm">Total Revenue</p>
                    <h3 className="text-3xl font-black mt-1">₹12,450.00</h3>
                </div>

                {/* KPI Card 2 */}
                <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary-brown/5 rounded-xl group-hover:bg-primary-brown/10 transition-colors">
                            <ShoppingBasket className="text-primary-brown w-6 h-6" />
                        </div>
                        <span className="text-accent-gold flex items-center gap-1 font-bold text-sm bg-accent-gold/10 px-2 py-1 rounded-lg">
                            <TrendingUp className="w-4 h-4" /> +4.2%
                        </span>
                    </div>
                    <p className="text-text-subtle font-medium text-sm">Avg Order Value</p>
                    <h3 className="text-3xl font-black mt-1">₹185.00</h3>
                </div>

                {/* KPI Card 3 */}
                <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary-brown/5 rounded-xl group-hover:bg-primary-brown/10 transition-colors">
                            <UserPlus className="text-primary-brown w-6 h-6" />
                        </div>
                        <span className="text-accent-gold flex items-center gap-1 font-bold text-sm bg-accent-gold/10 px-2 py-1 rounded-lg">
                            <TrendingUp className="w-4 h-4" /> +8.1%
                        </span>
                    </div>
                    <p className="text-text-subtle font-medium text-sm">New Customers</p>
                    <h3 className="text-3xl font-black mt-1">142</h3>
                </div>
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sales Over Time Widget (Lrg) */}
                <div className="lg:col-span-8 bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-border-light dark:border-border-dark">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">Sales Over Time</h4>
                            <p className="text-text-subtle text-sm">Daily revenue performance for current period</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-border-light dark:border-border-dark rounded-xl text-sm font-bold hover:bg-bg-light transition-colors text-gray-700">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-gray-900 dark:text-white">₹48,200</span>
                            <span className="text-text-subtle font-medium">total sales</span>
                        </div>
                        <div className="h-[300px] w-full relative flex flex-col justify-end">
                            {/* Simple Line Chart Representation (SVG) */}
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#6f4520" stopOpacity="0.2"></stop>
                                        <stop offset="100%" stopColor="#6f4520" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0,150 C50,140 100,160 150,120 C200,80 250,100 300,70 C350,40 400,60 450,50 C500,40 550,80 600,60 C650,40 700,30 800,10 L800,200 L0,200 Z" fill="url(#chartGradient)"></path>
                                <path d="M0,150 C50,140 100,160 150,120 C200,80 250,100 300,70 C350,40 400,60 450,50 C500,40 550,80 600,60 C650,40 700,30 800,10" fill="none" stroke="#6f4520" strokeLinecap="round" strokeWidth="4"></path>
                                {/* Tooltip highlight circle */}
                                <circle cx="450" cy="50" fill="#6f4520" r="6"></circle>
                                <circle cx="450" cy="50" fill="none" opacity="0.4" r="10" stroke="#6f4520" strokeWidth="2"></circle>
                            </svg>
                            {/* X-Axis Labels */}
                            <div className="flex justify-between mt-4 px-2">
                                <span className="text-xs font-bold text-text-subtle">Mon</span>
                                <span className="text-xs font-bold text-text-subtle">Tue</span>
                                <span className="text-xs font-bold text-text-subtle">Wed</span>
                                <span className="text-xs font-bold text-text-subtle">Thu</span>
                                <span className="text-xs font-bold text-primary-brown">Fri</span>
                                <span className="text-xs font-bold text-text-subtle">Sat</span>
                                <span className="text-xs font-bold text-text-subtle">Sun</span>
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
                            <span className="text-4xl font-black text-gray-900 dark:text-white">1,240</span>
                            <span className="text-text-subtle font-medium">items sold</span>
                        </div>
                        {/* Bar Chart */}
                        <div className="space-y-5 mt-4">
                            {[
                                { name: 'Espresso', count: 482, width: '85%' },
                                { name: 'Latte', count: 320, width: '65%' },
                                { name: 'Croissant', count: 215, width: '45%' },
                                { name: 'Muffin', count: 158, width: '30%' },
                                { name: 'Artisan Tea', count: 65, width: '15%' }
                            ].map((item) => (
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
                        {[
                            { time: '8am', height: '40%', opacity: 'opacity-20' },
                            { time: '10am', height: '75%', opacity: 'opacity-60' },
                            { time: '12pm', height: '100%', opacity: 'opacity-100' },
                            { time: '2pm', height: '90%', opacity: 'opacity-80' },
                            { time: '4pm', height: '55%', opacity: 'opacity-40' },
                            { time: '6pm', height: '25%', opacity: 'opacity-10' },
                        ].map((bar) => (
                            <div key={bar.time} className={`bg-primary-brown rounded-t-lg flex items-center justify-center group relative ${bar.opacity}`} style={{ height: bar.height }}>
                                <span className="absolute -top-6 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-primary-brown">{bar.time}</span>
                            </div>
                        ))}
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
                        <p className="text-text-subtle text-sm">Feedback based on latest 500 orders</p>
                    </div>
                    <div className="flex items-center gap-10 mt-6">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle className="stroke-bg-light dark:stroke-bg-dark" cx="18" cy="18" fill="none" r="16" strokeWidth="4"></circle>
                                <circle cx="18" cy="18" fill="none" r="16" stroke="#6f4520" strokeDasharray="85, 100" strokeLinecap="round" strokeWidth="4"></circle>
                            </svg>
                            <span className="absolute text-2xl font-black text-gray-900 dark:text-white">4.8</span>
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                <Star className="text-accent-gold w-5 h-5" />
                                <div className="flex-1 h-1.5 bg-bg-light dark:bg-bg-dark rounded-full overflow-hidden">
                                    <div className="h-full bg-accent-gold w-[90%]"></div>
                                </div>
                                <span className="text-xs font-bold w-6 text-gray-700 dark:text-gray-300">90%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Smile className="text-accent-gold w-5 h-5" />
                                <div className="flex-1 h-1.5 bg-bg-light dark:bg-bg-dark rounded-full overflow-hidden">
                                    <div className="h-full bg-accent-gold w-[8%]"></div>
                                </div>
                                <span className="text-xs font-bold w-6 text-gray-700 dark:text-gray-300">8%</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Frown className="text-gray-300 w-5 h-5" />
                                <div className="flex-1 h-1.5 bg-bg-light dark:bg-bg-dark rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-300 w-[2%]"></div>
                                </div>
                                <span className="text-xs font-bold w-6 text-gray-700 dark:text-gray-300">2%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
