'use client';
import { useRouter } from 'next/navigation';

export default function SubscriptionView() {
    const router = useRouter();

    return (
        <main className="w-full">
            {/* BEGIN: PromotionalBanner */}
            <section className="px-4 md:px-12 py-6 max-w-7xl mx-auto">
                <div className="bg-[#DFFFD6] border border-[#B8E6B0] rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="bg-[#166534] text-white rounded-full p-2 h-10 w-10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">📢</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1e3a29] text-lg">FIRST-TIMER OFFER: 1-Week Trial just <span>₹</span>1299! + 1 day free snacks</h3>
                            <p className="text-gray-600 text-sm mt-1">Experience the heritage of South India with a week of complimentary lunch.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/checkout?plan=trial')}
                        className="bg-[#166534] hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md shadow-md transition-transform transform hover:-translate-y-0.5 whitespace-nowrap w-full md:w-auto"
                    >
                        Start Trial
                    </button>
                </div>
            </section>
            {/* END: PromotionalBanner */}

            {/* BEGIN: HeroSection */}
            <section className="text-center py-10 px-4 max-w-4xl mx-auto">
                <p className="text-[#166534] font-bold text-xs tracking-[0.2em] uppercase mb-2">CHOOSE YOUR PLAN</p>
                <h1 className="font-serif-heading text-5xl md:text-7xl font-extrabold text-[#0e1b12] mb-6 leading-tight">
                    Never Think About <br /> Lunch Again.
                </h1>
                <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                    Traditional recipes, modern convenience. Freshly prepared daily and delivered right to your doorstep using our heritage-inspired subscription model.
                </p>
            </section>
            {/* END: HeroSection */}

            {/* BEGIN: PricingGrid */}
            <section className="px-4 md:px-12 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {/* Card 1: Ultimate Plan (Featured) */}
                    <article className="relative bg-white border-4 border-[#FCD34D] rounded-2xl p-6 shadow-xl transform md:-translate-y-2 flex flex-col h-full overflow-hidden">
                        {/* Ribbon */}
                        <div className="absolute top-0 right-5 w-[70px] h-[85px] bg-[#FFC83D] flex flex-col items-center justify-center text-[#1A4D2E] font-bold text-xs leading-tight pb-4 shadow-md z-10" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%)' }}>
                            <span className="block text-sm">Save 50%</span>
                            <span className="text-[9px] font-normal opacity-90">(Was ₹18k)</span>
                        </div>

                        <h3 className="text-[#166534] font-bold text-sm tracking-wide uppercase mb-2">ULTIMATE PLAN</h3>
                        <div className="flex items-baseline mb-6">
                            <span className="text-4xl font-bold text-[#0e1b12] mr-1"><span>₹</span>9,999</span>
                            <span className="text-gray-500 text-sm">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-start">
                                <span className="mt-1 mr-3 flex-shrink-0 text-[#166534]">✅</span>
                                <span className="text-sm font-medium text-gray-700">Unlimited meals + Sips + snacks</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mt-1 mr-3 flex-shrink-0 text-[#166534]">✅</span>
                                <span className="text-sm font-medium text-gray-700">Priority Everything</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mt-1 mr-3 flex-shrink-0 text-[#166534]">✅</span>
                                <span className="text-sm font-medium text-gray-700">120 Coupons</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => router.push('/checkout?plan=ultimate')}
                            className="w-full bg-[#0e1b12] hover:bg-[#166534] text-white font-medium py-3 rounded-lg shadow-lg transition-colors mt-auto"
                        >
                            Subscribe Now
                        </button>
                    </article>

                    {/* Card 2: Feast & Fuel */}
                    <article className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow flex flex-col h-full">
                        <h3 className="text-[#0e1b12] font-bold text-lg mb-1">Feast & Fuel</h3>
                        <div className="flex flex-col mb-4">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-[#0e1b12] mr-2"><span>₹</span>4,499</span>
                                <span className="text-xs text-gray-400">(was <span>₹</span>6,000, save 25%)</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                🎟️ 60 Coupons
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <span className="mt-1 mr-2 flex-shrink-0 text-[#166534]">✓</span>
                                <span className="text-sm text-gray-600">Full Monthly Meal Plan</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mt-1 mr-2 flex-shrink-0 text-[#166534]">✓</span>
                                <span className="text-sm text-gray-600">No Delivery Fees</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mt-1 mr-2 flex-shrink-0 text-[#166534]">✓</span>
                                <span className="text-sm text-gray-600">Priority Pickup</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => router.push('/checkout?plan=feast')}
                            className="w-full bg-[#0e1b12] hover:bg-[#166534] text-white font-medium py-3 rounded-lg shadow-md transition-colors mt-auto"
                        >
                            Subscribe Now
                        </button>
                    </article>

                    {/* Card 3: Total Wellness */}
                    <article className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow flex flex-col h-full">
                        <h3 className="text-[#0e1b12] font-bold text-lg mb-1">Total Wellness</h3>
                        <div className="flex flex-col mb-4">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-[#0e1b12] mr-2"><span>₹</span>5,999</span>
                                <span className="text-xs text-gray-400">(was <span>₹</span>9,000, save 33%)</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                🎟️ 90 Coupons
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <span className="mt-1 mr-2 flex-shrink-0 text-[#166534]">✓</span>
                                <span className="text-sm text-gray-600">All Meals + Snacks</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mt-1 mr-2 flex-shrink-0 text-[#166534]">✓</span>
                                <span className="text-sm text-gray-600">Nutritionist Consultation</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mt-1 mr-2 flex-shrink-0 text-[#166534]">✓</span>
                                <span className="text-sm text-gray-600">Ultra-Fast Delivery</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => router.push('/checkout?plan=wellness')}
                            className="w-full bg-[#0e1b12] hover:bg-[#166534] text-white font-medium py-3 rounded-lg shadow-md transition-colors mt-auto"
                        >
                            Subscribe Now
                        </button>
                    </article>

                    {/* Card 4: Light Bite Pass */}
                    <article className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow flex flex-col h-full">
                        <h3 className="text-[#0e1b12] font-bold text-lg mb-1">Light Bite Pass</h3>
                        <div className="flex flex-col mb-4">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-[#0e1b12] mr-2"><span>₹</span>2,599</span>
                                <span className="text-xs text-gray-400">(was <span>₹</span>3,000, save 15%)</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                🎟️ 30 Coupons
                            </div>
                        </div>
                        <ul className="space-y-3 mb-8 flex-grow">
                            <li className="flex items-start">
                                <span className="mt-1 mr-2 flex-shrink-0 text-[#166534]">✓</span>
                                <span className="text-sm text-gray-600">15 Daily Meals per month</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mt-1 mr-2 flex-shrink-0 text-[#166534]">✓</span>
                                <span className="text-sm text-gray-600">Priority Pickup</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mt-1 mr-2 flex-shrink-0 text-[#166534]">✓</span>
                                <span className="text-sm text-gray-600">Standard Delivery</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => router.push('/checkout?plan=light')}
                            className="w-full bg-[#0e1b12] hover:bg-[#166534] text-white font-medium py-3 rounded-lg shadow-md transition-colors mt-auto"
                        >
                            Subscribe Now
                        </button>
                    </article>
                </div>
            </section>
            {/* END: PricingGrid */}

            {/* BEGIN: AddOnSection */}
            <section className="px-4 md:px-12 mb-20">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
                    <h3 className="text-[#0e1b12] font-bold text-lg uppercase tracking-wider w-24 text-right md:mr-4">ADD-ON</h3>
                    <div className="bg-white border border-gray-100 rounded-xl p-6 w-full shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex-grow">
                            <h4 className="font-bold text-[#0e1b12] text-xl">Hot Sips + SnacknMunch</h4>
                            <div className="flex items-baseline mt-1 gap-2">
                                <span className="text-3xl font-bold text-[#0e1b12]"><span>₹</span>1,299</span>
                                <span className="text-xs text-gray-500">(was <span>₹</span>1,999, save 35%)</span>
                                <span className="text-xs text-gray-500 ml-4 flex items-center">🎟️ 30 Coupons</span>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/checkout?plan=addon')}
                            className="bg-[#0e1b12] hover:bg-[#166534] text-white font-medium py-3 px-8 rounded-lg shadow-md transition-colors whitespace-nowrap w-full md:w-auto"
                        >
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </section>
            {/* END: AddOnSection */}

            {/* BEGIN: FeaturesSection */}
            <section className="px-4 md:px-12 pb-24 border-b border-[#e5e7eb]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto text-center">
                    {/* Feature 1 */}
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#DFFFD6] rounded-full flex items-center justify-center mb-6">
                            <span className="text-3xl">🚚</span>
                        </div>
                        <h4 className="font-bold text-[#0e1b12] text-lg mb-2">Always On Time</h4>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Guaranteed delivery before 1:00 PM every single day of your plan.
                        </p>
                    </div>
                    {/* Feature 2 */}
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#DFFFD6] rounded-full flex items-center justify-center mb-6">
                            <span className="text-3xl">🌿</span>
                        </div>
                        <h4 className="font-bold text-[#0e1b12] text-lg mb-2">Heritage Recipes</h4>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Authentic South Indian flavors using spices sourced directly from local farms.
                        </p>
                    </div>
                    {/* Feature 3 */}
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#DFFFD6] rounded-full flex items-center justify-center mb-6">
                            <span className="text-3xl">⏸️</span>
                        </div>
                        <h4 className="font-bold text-[#0e1b12] text-lg mb-2">Pause Anytime</h4>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Going on vacation? Pause your subscription with a single click in the app.
                        </p>
                    </div>
                </div>
            </section>
            {/* END: FeaturesSection */}
        </main>
    );
}
