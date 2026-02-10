'use client';

import { useRouter } from 'next/navigation';

export default function SubscriptionPlans() {
    const router = useRouter();

    return (
        <div className="bg-[#F5F9F5] text-[#1A4D2E] font-sans antialiased">
            {/* Promotional Banner */}
            <section className="px-4 md:px-12 py-6">
                <div className="bg-[#DFFFD6] border border-[#B8E6B0] rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="bg-[#2E8B57] text-white rounded-full p-2 h-10 w-10 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined">campaign</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1A4D2E] text-lg">FIRST-TIMER OFFER: 1-Week Trial just <span className="font-sans">₹</span>1299! + 1 day free snacks</h3>
                            <p className="text-gray-600 text-sm mt-1">Experience the heritage of South India with a week of complimentary lunch.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/checkout?plan=trial')}
                        className="bg-[#2E8B57] hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md shadow-md transition-transform transform hover:-translate-y-0.5 whitespace-nowrap w-full md:w-auto"
                    >
                        Start Trial
                    </button>
                </div>
            </section>

            {/* Hero Section */}
            <section className="text-center py-10 px-4 max-w-4xl mx-auto">
                <p className="text-[#2E8B57] font-bold text-xs tracking-[0.2em] uppercase mb-2">CHOOSE YOUR PLAN</p>
                <h1 className="font-serif text-5xl md:text-7xl font-extrabold text-[#1A4D2E] mb-6 leading-tight">
                    Never Think About <br /> Lunch Again.
                </h1>
                <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                    Traditional recipes, modern convenience. Freshly prepared daily and delivered right to your doorstep using our heritage-inspired subscription model.
                </p>
            </section>

            {/* Pricing Grid */}
            <section className="px-4 md:px-12 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {/* Card 1: Ultimate Plan (Featured) */}
                    <article className="relative bg-white border-4 border-[#FCD34D] rounded-2xl p-6 shadow-[0_0_15px_rgba(46,139,87,0.3)] transform md:-translate-y-2 flex flex-col h-full">
                        {/* Ribbon */}
                        <div className="absolute -top-[10px] -right-[-20px] w-[70px] h-[85px] bg-[#FFC83D] flex flex-col items-center justify-center text-[#1A4D2E] font-bold text-xs leading-tight pb-4 shadow-md z-10" style={{ right: '20px' }}>
                            <span className="block">Save 50%</span>
                            <span className="text-[9px] font-normal leading-tight opacity-90">(Was ₹18,006)</span>
                            <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[15px] border-b-white"></div>
                        </div>

                        <h3 className="text-[#2E8B57] font-bold text-sm tracking-wide uppercase mb-2">ULTIMATE PLAN</h3>
                        <div className="flex items-baseline mb-6">
                            <span className="text-4xl font-bold text-[#1A4D2E] mr-1"><span className="font-sans">₹</span>9,999</span>
                            <span className="text-gray-500 text-sm">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-start">
                                <div className="mt-1 mr-3 flex-shrink-0 text-[#2E8B57]"><span className="material-symbols-outlined text-lg">check_circle</span></div>
                                <span className="text-sm font-medium text-gray-700">Unlimited meals + Sips + snacks</span>
                            </li>
                            <li className="flex items-start">
                                <div className="mt-1 mr-3 flex-shrink-0 text-[#2E8B57]"><span className="material-symbols-outlined text-lg">check_circle</span></div>
                                <span className="text-sm font-medium text-gray-700">Priority Everything</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => router.push('/checkout?plan=ultimate')}
                            className="w-full bg-[#1E4033] hover:bg-green-900 text-white font-medium py-3 rounded-lg shadow-lg transition-colors mt-auto"
                        >
                            Subscribe Now
                        </button>
                    </article>

                    {/* Card 2: Feast & Fuel */}
                    <article className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-xl transition-shadow flex flex-col h-full">
                        <h3 className="text-[#1A4D2E] font-bold text-lg mb-1">Feast &amp; Fuel</h3>
                        <div className="flex flex-col mb-4">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-[#1A4D2E] mr-2"><span className="font-sans">₹</span>4,499</span>
                                <span className="text-xs text-gray-400">(was <span className="font-sans">₹</span>6,000, save 25%)</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                <span className="material-symbols-outlined text-sm mr-1">confirmation_number</span> 60 Coupons
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <div className="mt-1 mr-2 flex-shrink-0 text-[#2E8B57]"><span className="material-symbols-outlined text-sm">check_circle</span></div>
                                <span className="text-sm text-gray-600">Full Monthly Meal Plan</span>
                            </li>
                            <li className="flex items-start">
                                <div className="mt-1 mr-2 flex-shrink-0 text-[#2E8B57]"><span className="material-symbols-outlined text-sm">check_circle</span></div>
                                <span className="text-sm text-gray-600">No Delivery Fees</span>
                            </li>
                            <li className="flex items-start">
                                <div className="mt-1 mr-2 flex-shrink-0 text-[#2E8B57]"><span className="material-symbols-outlined text-sm">check_circle</span></div>
                                <span className="text-sm text-gray-600">Priority Pickup</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => router.push('/checkout?plan=feast')}
                            className="w-full bg-[#1E4033] hover:bg-green-900 text-white font-medium py-3 rounded-lg shadow-md transition-colors mt-auto"
                        >
                            Subscribe Now
                        </button>
                    </article>

                    {/* Card 3: Total Wellness */}
                    <article className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-xl transition-shadow flex flex-col h-full">
                        <h3 className="text-[#1A4D2E] font-bold text-lg mb-1">Total Wellness</h3>
                        <div className="flex flex-col mb-4">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-[#1A4D2E] mr-2"><span className="font-sans">₹</span>5,999</span>
                                <span className="text-xs text-gray-400">(was <span className="font-sans">₹</span>9,000, save 33%)</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                <span className="material-symbols-outlined text-sm mr-1">confirmation_number</span> 90 Coupons
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <div className="mt-1 mr-2 flex-shrink-0 text-[#2E8B57]"><span className="material-symbols-outlined text-sm">check_circle</span></div>
                                <span className="text-sm text-gray-600">All Meals + Snacks</span>
                            </li>
                            <li className="flex items-start">
                                <div className="mt-1 mr-2 flex-shrink-0 text-[#2E8B57]"><span className="material-symbols-outlined text-sm">check_circle</span></div>
                                <span className="text-sm text-gray-600">Nutritionist Consultation</span>
                            </li>
                            <li className="flex items-start">
                                <div className="mt-1 mr-2 flex-shrink-0 text-[#2E8B57]"><span className="material-symbols-outlined text-sm">check_circle</span></div>
                                <span className="text-sm text-gray-600">Ultra-Fast Delivery</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => router.push('/checkout?plan=wellness')}
                            className="w-full bg-[#1E4033] hover:bg-green-900 text-white font-medium py-3 rounded-lg shadow-md transition-colors mt-auto"
                        >
                            Subscribe Now
                        </button>
                    </article>

                    {/* Card 4: Light Bite Pass */}
                    <article className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-xl transition-shadow flex flex-col h-full">
                        <h3 className="text-[#1A4D2E] font-bold text-lg mb-1">Light Bite Pass</h3>
                        <div className="flex flex-col mb-4">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-[#1A4D2E] mr-2"><span className="font-sans">₹</span>2,599</span>
                                <span className="text-xs text-gray-400">(was <span className="font-sans">₹</span>3,000, save 15%)</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                <span className="material-symbols-outlined text-sm mr-1">confirmation_number</span> 30 Coupons
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <div className="mt-1 mr-2 flex-shrink-0 text-[#2E8B57]"><span className="material-symbols-outlined text-sm">check_circle</span></div>
                                <span className="text-sm text-gray-600">15 Daily Meals per month</span>
                            </li>
                            <li className="flex items-start">
                                <div className="mt-1 mr-2 flex-shrink-0 text-[#2E8B57]"><span className="material-symbols-outlined text-sm">check_circle</span></div>
                                <span className="text-sm text-gray-600">Priority Pickup</span>
                            </li>
                            <li className="flex items-start">
                                <div className="mt-1 mr-2 flex-shrink-0 text-[#2E8B57]"><span className="material-symbols-outlined text-sm">check_circle</span></div>
                                <span className="text-sm text-gray-600">Standard Delivery</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => router.push('/checkout?plan=light')}
                            className="w-full bg-[#1E4033] hover:bg-green-900 text-white font-medium py-3 rounded-lg shadow-md transition-colors mt-auto"
                        >
                            Subscribe Now
                        </button>
                    </article>
                </div>
            </section>

            {/* Add-On Section */}
            <section className="px-4 md:px-12 mb-20">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
                    <h3 className="text-[#1A4D2E] font-bold text-lg uppercase tracking-wider w-24 text-right md:mr-4">ADD-ON</h3>
                    <div className="bg-white border border-gray-100 rounded-xl p-6 w-full shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex-grow">
                            <h4 className="font-bold text-[#1A4D2E] text-xl">Hot Sips + SnacknMunch</h4>
                            <div className="flex items-baseline mt-1 gap-2">
                                <span className="text-3xl font-bold text-[#1A4D2E]"><span className="font-sans">₹</span>1,299</span>
                                <span className="text-xs text-gray-500">(was <span className="font-sans">₹</span>1,999, save 35%)</span>
                                <span className="text-xs text-gray-500 ml-4 flex items-center"><span className="material-symbols-outlined text-sm mr-1">confirmation_number</span> 30 Coupons</span>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/checkout?plan=addon')}
                            className="bg-[#1E4033] hover:bg-green-900 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-colors whitespace-nowrap w-full md:w-auto"
                        >
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </section>


        </div>
    );
}
