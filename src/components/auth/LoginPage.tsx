'use client';

import { useState } from 'react';
import SmileyFace from './SmileyFace';
import { Lock, ArrowRight, Phone, User, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog'; // Assuming radix-ui is available or we use simple div if not installed. Let's stick to simple divs if unsure, but user had imports.
// Actually user code had import * as Dialog from '@radix-ui/react-dropdown-menu'; which was weird.
// keeping it simple with conditional rendering for modals as before to avoid dependency issues.

interface LoginPageProps {
    onLogin: (user: { name: string; phone: string }, stayLoggedIn: boolean) => Promise<void>;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [tempOtp, setTempOtp] = useState('');

    // Focus state for Smiley
    const [focusedField, setFocusedField] = useState<'name' | 'phone' | 'otp' | undefined>(undefined);

    const [error, setError] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [stayLoggedIn, setStayLoggedIn] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);

    const handleGetOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isAdminLogin) {
            if (!phone.trim()) {
                setError('Please enter Admin ID');
                return;
            }
            setIsLoading(true);
            try {
                await onLogin({ name: 'Admin', phone }, false);
            } catch (e) {
                // error
            } finally {
                setIsLoading(false);
            }
            return;
        }

        if (!name.trim() || !phone.trim()) {
            setError('Please fill in your name and phone number');
            return;
        }

        if (phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }

        if (!termsAccepted) {
            setError('Please agree to the Terms & Conditions');
            return;
        }

        const mockOtp = '1234';
        setTempOtp(mockOtp);
        setStep('OTP');
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp !== tempOtp && otp !== '1234') {
            setError('Invalid OTP. Please try again.');
            return;
        }

        setIsLoading(true);
        try {
            await onLogin({ name, phone }, stayLoggedIn);
        } catch (e) {
            // error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-sand-beige p-4 font-display relative overflow-hidden">

            {/* Background Decorations (Optional) */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-palm-green-light opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-tropical-yellow opacity-5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

            {/* Terms Modal Overlay */}
            {showTermsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto p-8 relative">
                        <button
                            onClick={() => setShowTermsModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>

                        <h2 className="font-serif-display text-2xl font-bold text-coconut-brown mb-4">User Agreement</h2>
                        <div className="prose prose-sm text-gray-600 space-y-4">
                            <p><strong>One User, One Plan:</strong> Your Mess Plan is linked to your Phone Number.</p>
                            <p><strong>Use It or Lose It:</strong> Daily limits reset every midnight.</p>
                            <p><strong>No Refunds:</strong> Fees are non-refundable once activated.</p>
                            <p><strong>Inventory:</strong> Subject to availability.</p>
                            <p><strong>Privacy:</strong> Data used only for login and notifications.</p>
                        </div>
                        <button
                            onClick={() => setShowTermsModal(false)}
                            className="w-full mt-6 bg-coconut-brown text-white font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all active:scale-95"
                        >
                            I Understand
                        </button>
                    </div>
                </div>
            )}

            {/* Main Login Card */}
            <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/50 relative z-10">
                <div className="p-6 pt-8">

                    {/* Brand */}
                    <div className="text-center mb-6">
                        <h2 className="text-coconut-brown font-serif-display font-bold text-xl tracking-wide">Cafe South Central</h2>
                    </div>

                    {/* Smiley Animation */}
                    <div className="mb-6">
                        <SmileyFace focusState={focusedField || (step === 'OTP' ? 'otp' : undefined)} />
                    </div>

                    <div className="text-center mb-5">
                        <h1 className="font-serif-display text-2xl font-bold text-palm-green-dark mb-1">
                            {step === 'PHONE' ? 'Welcome Back!' : 'Verify OTP'}
                        </h1>
                        <p className="text-gray-500 text-xs">
                            {step === 'PHONE'
                                ? 'Detailed flavors, simplified ordering.'
                                : `Enter the code sent to ${phone}`}
                        </p>
                    </div>

                    {/* Admin Toggle */}
                    {step === 'PHONE' && (
                        <div className="mb-4 flex justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdminLogin(!isAdminLogin);
                                    setError('');
                                    setStep('PHONE');
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                {isAdminLogin ? <ArrowRight size={14} /> : <Lock size={14} />}
                                {isAdminLogin ? 'Back to Customer Login' : 'Admin Login'}
                            </button>
                        </div>
                    )}

                    <form onSubmit={step === 'PHONE' ? handleGetOtp : handleVerifyOtp} className="space-y-4">
                        {step === 'PHONE' && (
                            <>
                                {!isAdminLogin && (
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1 ml-1">Your Name</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <User size={16} />
                                            </div>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(undefined)}
                                                placeholder="e.g. Ananya"
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-palm-green-light focus:ring-0 transition-all outline-none font-medium text-gray-800 placeholder-gray-400 text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1 ml-1">
                                        {isAdminLogin ? 'Admin ID' : 'Phone Number'}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            {isAdminLogin ? <Lock size={16} /> : <Phone size={16} />}
                                        </div>
                                        <input
                                            type={isAdminLogin ? "text" : "tel"}
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            onFocus={() => setFocusedField('phone')}
                                            onBlur={() => setFocusedField(undefined)}
                                            placeholder={isAdminLogin ? "Enter Admin ID" : "98765 43210"}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-palm-green-light focus:ring-0 transition-all outline-none font-medium text-gray-800 placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                </div>

                                {!isAdminLogin && (
                                    <div className="space-y-2 pt-1">
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={termsAccepted}
                                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-gray-300 transition-all checked:border-palm-green-dark checked:bg-palm-green-dark"
                                                />
                                                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                                                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 leading-snug">
                                                I agree to the <button onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="text-palm-green-dark font-bold hover:underline">Terms & Conditions</button>
                                            </div>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={stayLoggedIn}
                                                    onChange={(e) => setStayLoggedIn(e.target.checked)}
                                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-gray-300 transition-all checked:border-palm-green-dark checked:bg-palm-green-dark"
                                                />
                                                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                                                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500">Keep me logged in</span>
                                        </label>
                                    </div>
                                )}
                            </>
                        )}

                        {step === 'OTP' && (
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        maxLength={4}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        onFocus={() => setFocusedField('otp')}
                                        onBlur={() => setFocusedField(undefined)}
                                        placeholder="• • • •"
                                        className="w-full py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-palm-green-light focus:ring-0 transition-all outline-none text-center text-3xl tracking-[1em] font-bold text-gray-800 placeholder-gray-300"
                                        autoFocus
                                    />
                                    <p className="text-center text-xs text-gray-400 mt-2">Use code 1234 for testing</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium text-center animate-in fade-in">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                w-full py-3 rounded-full font-bold text-base shadow-lg hover:shadow-xl active:scale-95 transition-all
                                flex items-center justify-center gap-2
                                ${isLoading || (step === 'PHONE' && !isAdminLogin && (!termsAccepted || !name || !phone))
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-palm-green-dark text-tropical-yellow hover:bg-opacity-90'}
                            `}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                isAdminLogin ? 'Enter Dashboard' : (step === 'PHONE' ? 'Get OTP' : 'Verify & Login')
                            )}
                        </button>
                    </form>

                    {step === 'OTP' && (
                        <div className="text-center mt-6">
                            <button
                                onClick={() => {
                                    setStep('PHONE');
                                    setOtp('');
                                    setError('');
                                }}
                                className="text-sm text-gray-500 hover:text-palm-green-dark font-medium transition-colors"
                            >
                                Change Phone Number
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute bottom-4 text-xs text-gray-400 font-medium">
                © 2026 Cafe South Central
            </div>
        </div>
    );
}
