import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0e1b12] py-16 px-6 lg:px-12 text-white">
            <div className="mx-auto max-w-[1440px] grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <h2 className="font-serif-heading text-2xl font-black mb-4">Cafe South Central</h2>
                    <p className="text-[#4e9767] max-w-sm mb-6 leading-relaxed">Redefining the South Indian dining experience with authenticity and fresh, high-quality ingredients.</p>
                </div>
                <div>
                    <h4 className="font-bold text-[#DAA520] uppercase tracking-widest text-xs mb-8">Quick Links</h4>
                    <ul className="space-y-4 text-sm text-[#4e9767]">
                        <li><a href="#" className="hover:text-white transition-colors">Find a Location</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-[#DAA520] uppercase tracking-widest text-xs mb-8">Join Us</h4>
                    <div className="flex border-b border-[#e7f3eb]/20 pb-2">
                        <input type="email" placeholder="Your Email" className="bg-transparent border-none text-xs focus:ring-0 p-0 flex-1 placeholder:text-[#4e9767]/50 text-white" />
                        <button className="text-[#DAA520] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">Join</button>
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-[1440px] mt-16 pt-8 border-t border-[#e7f3eb]/10 flex flex-col md:flex-row justify-between items-center text-xs text-[#4e9767]">
                <p>&copy; 2024 Cafe South Central. All rights reserved.</p>
                <div className="flex gap-8 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
                </div>
            </div>
        </footer>
    );
}
