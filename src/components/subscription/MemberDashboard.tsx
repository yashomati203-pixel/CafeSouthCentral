'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Settings, FileText, Calendar, ArrowRight, CheckCircle, Lock, Utensils, RefreshCw, Star } from 'lucide-react';

interface MemberDashboardProps {
    user: any;
    toggleTheme?: () => void;
}

export default function MemberDashboard({ user }: MemberDashboardProps) {
    const router = useRouter();
    const [subscriptionData, setSubscriptionData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetch(`/api/user/subscription?userId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setSubscriptionData(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch subscription:', err);
                    setIsLoading(false);
                });
        }
    }, [user?.id]);

    // Calculate display values
    const creditsRemaining = subscriptionData?.creditsTotal - subscriptionData?.creditsUsed || 0;
    const creditsTotal = subscriptionData?.creditsTotal || 30;
    const dailyLimit = 3; // Can be fetched from subscriptionData if available
    const dailyUsed = subscriptionData?.itemsRedeemedToday || 0;
    const dailyRemaining = dailyLimit - dailyUsed;
    const planName = subscriptionData?.planType?.replace(/_/g, ' ') || '1-Week Trial';
    const validUntil = subscriptionData?.validUntil ? new Date(subscriptionData.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not available';
    const startDate = subscriptionData?.startDate ? new Date(subscriptionData.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024';
    const daysLeft = subscriptionData?.validUntil ? Math.ceil((new Date(subscriptionData.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 16;
    const cycleProgress = subscriptionData?.creditsTotal ? ((subscriptionData.creditsUsed / subscriptionData.creditsTotal) * 100) : 46;

    return (
        <main className="max-w-[1200px] mx-auto w-full px-6 py-8">
            {/* Member Profile Header */}
            <div className="flex flex-wrap justify-between items-end gap-6 mb-10">
                <div className="flex gap-6 items-center">
                    <div className="relative">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl size-24 border-4 border-white shadow-sm"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBEXzZiSdV69Vu3Ju7ZBLxNavb9Uw-FYBnhtmju-8DiBi8TvmAs5Dcjcgh4Q6lgz4Y6c_9ouL-qHxvrKhqUdPYSokw-itJBn7VjzB1Ht99kwUA0OKmLE19fNlyQ1AB99p2dc5-pVSnh7CVgSGHRm8jsugH9CqdDbQ6wl790Cji8k_Z-PH5ebKlbt1WtkNfShL6jBclkvQUWmP50m2i0qtn0D6S061KDaW0C2ftHFzihJxnc4BuEHJqAPMjsAUbZMcDddpwZZKdMhCw")' }}
                            aria-label="Profile picture"
                        ></div>
                        <div className="absolute -bottom-2 -right-2 bg-primary-green text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">Active</div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-dark-green dark:text-white text-4xl font-serif font-black tracking-tight">
                            Vanakkam, {user?.name ? user.name.split(' ')[0] : 'Member'}!
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="bg-primary-green/20 text-dark-green dark:text-primary-green px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <Star className="w-3 h-3" /> {planName}
                            </span>
                            <span className="text-leaf-green text-sm">Member since {startDate}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/subscription')}
                    className="flex items-center justify-center gap-2 rounded-xl h-11 px-6 bg-primary-green text-white text-sm font-bold shadow-md hover:bg-primary-green/90 transition-all"
                >
                    <Settings className="w-4 h-4" />
                    <span>Change My Plan</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Quota & Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Meal Quota Tracker */}
                        <div className="bg-white dark:bg-background-dark/50 p-8 rounded-2xl shadow-sm border border-leaf-green/5 flex flex-col items-center text-center">
                            <h3 className="text-leaf-green text-sm font-bold uppercase tracking-widest mb-6">Meal Quota Remaining</h3>
                            <div className="relative size-48">
                                <svg className="size-full" viewBox="0 0 36 36">
                                    <path className="text-primary-green/10 stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                                    <path className="text-primary-green stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="46, 100" strokeLinecap="round" strokeWidth="3"></path>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-dark-green dark:text-white">{creditsRemaining}/{creditsTotal}</span>
                                    <span className="text-xs text-leaf-green font-medium">Credits Left</span>
                                </div>
                            </div>
                            <p className="mt-6 text-leaf-green text-sm leading-relaxed italic font-serif">"Fuel your journey, one meal at a time."</p>
                        </div>

                        {/* Daily Status */}
                        <div className="bg-white dark:bg-background-dark/50 p-8 rounded-2xl shadow-sm border border-leaf-green/5 flex flex-col">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-leaf-green text-sm font-bold uppercase tracking-widest">Daily Status</h3>
                                    <p className="text-dark-green dark:text-white text-2xl font-serif font-bold">{dailyRemaining}/{dailyLimit} meals available</p>
                                </div>
                                <div className="bg-primary-green/10 p-2 rounded-lg">
                                    <Calendar className="w-6 h-6 text-primary-green" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="size-3 rounded-full bg-primary-green"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-dark-green dark:text-white">Breakfast</p>
                                        <p className="text-xs text-leaf-green">Consumed at 8:30 AM</p>
                                    </div>
                                    <CheckCircle className="w-5 h-5 text-primary-green" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="size-3 rounded-full bg-primary-green/20"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-dark-green dark:text-white">Lunch</p>
                                        <p className="text-xs text-leaf-green">Available until 3:00 PM</p>
                                    </div>
                                    <button
                                        onClick={() => router.push('/menu?subscription=true')}
                                        className="text-primary-green text-xs font-bold border border-primary-green px-3 py-1 rounded-lg hover:bg-primary-green hover:text-white transition-colors"
                                    >
                                        Redeem
                                    </button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="size-3 rounded-full bg-primary-green/20"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-dark-green dark:text-white">Dinner</p>
                                        <p className="text-xs text-leaf-green">Opens at 7:00 PM</p>
                                    </div>
                                    <Lock className="w-5 h-5 text-leaf-green/30" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meal Consumption Graph */}
                    <div className="bg-white dark:bg-background-dark/50 p-6 md:p-8 rounded-2xl shadow-sm border border-leaf-green/5">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-leaf-green text-sm font-bold uppercase tracking-widest mb-1">Consumption Tracker</h3>
                                <p className="text-sm text-dark-green/60 dark:text-white/60">Your meal usage over the last 30 days</p>
                            </div>
                            <select className="bg-background-light dark:bg-forest-green/30 border border-leaf-green/20 rounded-lg text-xs p-2 text-dark-green dark:text-white">
                                <option>Last 30 Days</option>
                                <option>This Week</option>
                            </select>
                        </div>

                        {/* CSS Bar Chart */}
                        <div className="flex items-end justify-between h-48 w-full gap-1 pt-4 pb-2 border-b border-leaf-green/10">
                            {[2, 3, 2, 1, 3, 3, 2, 2, 1, 3, 2, 3, 3, 2, 1, 2, 2, 3, 3, 2, 1, 2, 3, 2, 3, 1, 2, 2, 3, 2].map((value, i) => (
                                <div key={i} className="flex flex-col items-center gap-1 group w-full">
                                    <div
                                        className="w-full max-w-[8px] md:max-w-[12px] rounded-t-sm bg-primary-green/20 hover:bg-primary-green transition-all relative group-hover:scale-y-110 origin-bottom"
                                        style={{ height: `${(value / 3) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-forest-green text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {value} Meals
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between pt-2 text-[10px] text-leaf-green uppercase tracking-wider">
                            <span>30 Days Ago</span>
                            <span>Today</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div>
                        <h2 className="text-xl font-serif font-bold text-dark-green dark:text-white mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => router.push('/orders')}
                                className="group p-6 bg-white dark:bg-background-dark/50 rounded-2xl border border-leaf-green/5 hover:border-primary-green/30 transition-all cursor-pointer text-left"
                            >
                                <FileText className="w-6 h-6 text-primary-green mb-3" />
                                <h4 className="font-bold text-dark-green dark:text-white mb-1 group-hover:text-primary-green transition-colors">View Orders & History</h4>
                                <p className="text-xs text-leaf-green">Track all your orders</p>
                            </button>
                            <button
                                onClick={() => router.push('/menu?subscription=true')}
                                className="group p-6 bg-white dark:bg-background-dark/50 rounded-2xl border border-leaf-green/5 hover:border-primary-green/30 transition-all cursor-pointer text-left"
                            >
                                <Utensils className="w-6 h-6 text-primary-green mb-3" />
                                <h4 className="font-bold text-dark-green dark:text-white mb-1 group-hover:text-primary-green transition-colors">Redeem on Any Meal</h4>
                                <p className="text-xs text-leaf-green">Choose from menu</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Upcoming Reservations/Recommendations */}
                <div className="space-y-6">
                    <div className="bg-forest-green text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-primary-green text-sm font-bold uppercase tracking-widest mb-4">Current Cycle</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-black">{daysLeft}</span>
                                <span className="text-leaf-green text-lg font-medium">days left</span>
                            </div>
                            <p className="text-leaf-green text-sm mb-6">Next renewal: {validUntil}</p>
                            <div className="h-1.5 w-full bg-white/10 rounded-full mb-6 overflow-hidden">
                                <div className="h-full bg-primary-green" style={{ width: `${cycleProgress}%` }}></div>
                            </div>
                            <button
                                onClick={() => router.push('/subscription/payment')}
                                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" /> Auto-renew ON
                            </button>
                        </div>
                        <div className="absolute -right-10 -bottom-10 size-40 bg-primary-green/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="bg-white dark:bg-background-dark/50 p-6 rounded-2xl border border-leaf-green/5">
                        <h3 className="text-dark-green dark:text-white font-serif font-bold text-lg mb-4">Recommended Today</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4 group cursor-pointer" onClick={() => router.push('/menu')}>
                                <div
                                    className="size-16 rounded-xl bg-center bg-cover flex-shrink-0"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQrLDr4BL70ZPHL2vf22weXXWKRvYgcOPU_y2-UBG_kkBQZ_uUsYsH2WqmXQtJk4-V6mTJb9To3EzAGZhqumqOaMs8NEQlu_tj0TdgRH5CyWmg61-x0NMrmoTLuSMhR-ImeSpNiLiXUE6dpT1J-t4lXOECLzPZssLFGezEy3YGuXeuw1r7ENvVqObvOW9oKXODPbKEzWM2XLlZ8XSTEY6j_WLDSGL8fVm34IiTT3ayWKYB8orrv2FKpveii_54R1L06cVbv3sXISs")' }}
                                ></div>
                                <div>
                                    <p className="font-bold text-sm text-dark-green dark:text-white group-hover:text-primary-green transition-colors">Ghee Roast Dosa</p>
                                    <p className="text-xs text-leaf-green">Crispy &amp; golden, served with coconut chutney</p>
                                </div>
                            </div>
                            <div className="flex gap-4 group cursor-pointer" onClick={() => router.push('/menu')}>
                                <div
                                    className="size-16 rounded-xl bg-center bg-cover flex-shrink-0"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAzXEpvKGDNazrziSv53RX-rbokCgSICS4Je-HeGGHTHGPE4DrM35rs3_MK4aooepf8Mn0R4bAJDd-LhodqdIpB507bBwOcH4ENSHYdV_gHYxjwuUFUl4W8g7gHPLoz1QjoWvXURiscG9XAzzFTNyD53pYxXtoR9m3mFiqJbGKZex_JYgSULePYVZprKHV3npqDOb7LePGh-Gsn8nbhCDZ3JIKqqSKmkfnoDWQ_lH0tw2nMACV1f_7RMg-Cp02iduz7e2x74xkdcW0")' }}
                                ></div>
                                <div>
                                    <p className="font-bold text-sm text-dark-green dark:text-white group-hover:text-primary-green transition-colors">Traditional Filter Kaapi</p>
                                    <p className="text-xs text-leaf-green">Slow-brewed and frothed to perfection</p>
                                </div>
                            </div>
                        </div>
                        <button
                            className="w-full mt-6 py-2 text-primary-green text-sm font-bold border-t border-leaf-green/5 pt-4 flex items-center justify-center gap-1 hover:bg-primary-green/5 rounded-b-xl transition-colors"
                            onClick={() => router.push('/menu')}
                        >
                            Explore Full Menu <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
