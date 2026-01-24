import { UtensilsCrossed, Zap, Leaf } from 'lucide-react';

export default function FeaturesSection() {
    return (
        <section className="w-full py-20 px-6 bg-[#3C2A21] border-t border-[#3C2A21] relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                {/* Feature 1 */}
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#F9F6F0] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-black/20">
                        <UtensilsCrossed className="w-8 h-8 text-[#3C2A21]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#E5DDD8] mb-4 font-display">
                        Traditional Recipes
                    </h3>
                    <p className="text-[#E5DDD8]/80 leading-relaxed max-w-sm">
                        Time-honored flavors from our kitchen to yours, using secret family recipes passed down for generations.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#F9F6F0] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-black/20">
                        <Zap className="w-8 h-8 text-[#3C2A21]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#E5DDD8] mb-4 font-display">
                        Rapid Service
                    </h3>
                    <p className="text-[#E5DDD8]/80 leading-relaxed max-w-sm">
                        Your favorites ready in minutes. We've optimized every second so you never have to compromise quality.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#F9F6F0] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-black/20">
                        <Leaf className="w-8 h-8 text-[#3C2A21]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#E5DDD8] mb-4 font-display">
                        Ethical Sourcing
                    </h3>
                    <p className="text-[#E5DDD8]/80 leading-relaxed max-w-sm">
                        Sustainably sourced beans and local organic ingredients. Good for the planet, better for your day.
                    </p>
                </div>
            </div>
        </section>
    );
}
