import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-[#3C2A21] text-[#E5DDD8] pt-20 pb-10 px-6 relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 border-b border-[#E5DDD8]/10 pb-12">
                {/* Brand Column */}
                <div className="md:col-span-4">
                    <h2 className="text-3xl font-bold text-white mb-2 font-display">
                        Cafe<br />South<br />Central
                    </h2>
                    <p className="text-[10px] tracking-[0.2em] font-bold text-[#8d7a71] mb-6 uppercase">
                        INDIA
                    </p>
                    <p className="text-[#E5DDD8]/80 text-sm leading-relaxed mb-8 max-w-sm">
                        Crafting perfection in every dish since 1994. Authentic South Indian flavors, modern convenience.
                    </p>
                    <div className="flex gap-4">
                        <button className="w-10 h-10 rounded-full border border-[#E5DDD8]/20 flex items-center justify-center hover:bg-[#E5DDD8] hover:text-[#3C2A21] transition-all">
                            <Instagram className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-[#E5DDD8]/20 flex items-center justify-center hover:bg-[#E5DDD8] hover:text-[#3C2A21] transition-all">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Explore Links */}
                <div className="md:col-span-2">
                    <h4 className="text-xs font-bold tracking-widest text-[#8d7a71] uppercase mb-6">Explore</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><a href="#" className="hover:text-white transition-colors">Our Menu</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Subscriptions</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Locations</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
                    </ul>
                </div>

                {/* Support Links */}
                <div className="md:col-span-2">
                    <h4 className="text-xs font-bold tracking-widest text-[#8d7a71] uppercase mb-6">Support</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="md:col-span-4">
                    <h4 className="text-xs font-bold tracking-widest text-[#8d7a71] uppercase mb-6">Newsletter</h4>
                    <p className="text-[#E5DDD8]/80 text-sm mb-6">
                        Join our community for recipes and exclusive offers.
                    </p>
                    <div className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full bg-[#E5DDD8]/10 border border-[#E5DDD8]/10 rounded-full px-6 py-3 text-sm text-white placeholder-[#E5DDD8]/40 focus:outline-none focus:ring-1 focus:ring-[#E5DDD8]/30 transition-all"
                        />
                        <button className="w-full bg-[#D2B48C] text-[#3C2A21] font-bold rounded-full px-6 py-3 hover:bg-[#C1A27A] transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-[#E5DDD8]/40">
                <p>&copy; 2024 Cafe South Central. All rights reserved.</p>
                <div className="flex gap-8 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
