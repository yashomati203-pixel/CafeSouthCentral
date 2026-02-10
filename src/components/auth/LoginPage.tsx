'use client';

import { useState } from 'react';
import SmileyFace from './SmileyFace';
import { Lock, ArrowRight, Phone, User, X } from 'lucide-react';

interface LoginPageProps {
    onLogin: (user: { name: string; phone: string; password?: string; otp?: string }, stayLoggedIn: boolean) => Promise<void>;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [tempOtp, setTempOtp] = useState('');

    // Focus state for Smiley
    const [focusedField, setFocusedField] = useState<'name' | 'phone' | 'password' | 'otp' | undefined>(undefined);

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
            if (!password.trim()) {
                setError('Please enter Password');
                return;
            }
            setIsLoading(true);
            try {
                await onLogin({ name: 'Admin', phone, password }, false);
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

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to send OTP');
            } else {
                setStep('OTP');

                // Auto-fill for dev convenience
                if (data.params?.devOtp) {
                    setOtp(data.params.devOtp);
                    alert(`[DEV] OTP is: ${data.params.devOtp}`);
                }
            }
        } catch (e) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 4 && otp.length !== 6) {
            setError('Please enter a valid OTP');
            return;
        }

        setIsLoading(true);
        try {
            await onLogin({ name, phone, otp }, stayLoggedIn);
        } catch (e) {
            // error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full font-display relative">

            {/* Terms Modal Overlay */}
            {showTermsModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-[80vh] overflow-y-auto p-5 relative">
                        <button
                            onClick={() => setShowTermsModal(false)}
                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={18} className="text-gray-500" />
                        </button>

                        <h2 className="font-serif-display text-lg font-bold text-coconut-brown mb-3">User Agreement</h2>
                        <div className="prose prose-sm text-gray-600 space-y-2 text-xs">
                            <p><strong>One User, One Plan:</strong> Your Mess Plan is linked to your Phone Number.</p>
                            <p><strong>Use It or Lose It:</strong> Daily limits reset every midnight.</p>
                            <p><strong>No Refunds:</strong> Fees are non-refundable once activated.</p>
                            <p><strong>Privacy:</strong> Data used only for login and notifications.</p>
                        </div>
                        <button
                            onClick={() => setShowTermsModal(false)}
                            className="w-full mt-4 bg-coconut-brown text-white font-bold py-2 rounded-lg hover:bg-opacity-90 transition-all active:scale-95 text-sm"
                        >
                            I Understand
                        </button>
                    </div>
                </div>
            )}

            {/* Main Login Card - Solid White */}
            <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 relative z-10">
                <div className="p-5 pt-6">

                    {/* Brand */}
                    <div className="text-center mb-3">
                        <h2 className="text-coconut-brown font-serif-display font-bold text-lg tracking-wide">Cafe South Central</h2>
                    </div>

                    {/* Smiley Animation - Compact */}
                    <div className="mb-3 transform scale-90 origin-center">
                        <SmileyFace focusState={focusedField || (step === 'OTP' ? 'otp' : undefined)} />
                    </div>

                    <div className="text-center mb-4">
                        <h1 className="font-serif-display text-xl font-bold text-palm-green-dark mb-0.5">
                            {step === 'PHONE' ? 'Welcome Back!' : 'Verify OTP'}
                        </h1>
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">
                            {step === 'PHONE'
                                ? 'Detailed flavors, simplified ordering.'
                                : `Enter the code sent to ${phone}`}
                        </p>
                    </div>

                    {/* Admin Toggle */}
                    {step === 'PHONE' && (
                        <div className="mb-3 flex justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdminLogin(!isAdminLogin);
                                    setError('');
                                    setStep('PHONE');
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                {isAdminLogin ? <ArrowRight size={12} /> : <Lock size={12} />}
                                {isAdminLogin ? 'Customer Login' : 'Admin Login'}
                            </button>
                        </div>
                    )}

                    <form onSubmit={step === 'PHONE' ? handleGetOtp : handleVerifyOtp} className="space-y-3">
                        {step === 'PHONE' && (
                            <>
                                {!isAdminLogin && (
                                    <div>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <User size={14} />
                                            </div>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(undefined)}
                                                placeholder="Your Name (e.g. Ananya)"
                                                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-palm-green-light focus:ring-0 transition-all outline-none font-medium text-gray-800 placeholder-gray-400 text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            {isAdminLogin ? <Lock size={14} /> : <Phone size={14} />}
                                        </div>
                                        <input
                                            type={isAdminLogin ? "text" : "tel"}
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            onFocus={() => setFocusedField('phone')}
                                            onBlur={() => setFocusedField(undefined)}
                                            placeholder={isAdminLogin ? "Admin ID" : "Phone Number (98765 43210)"}
                                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-palm-green-light focus:ring-0 transition-all outline-none font-medium text-gray-800 placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                </div>

                                {isAdminLogin && (
                                    <div>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                <Lock size={14} />
                                            </div>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                onFocus={() => setFocusedField('password')}
                                                onBlur={() => setFocusedField(undefined)}
                                                placeholder="Password"
                                                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-palm-green-light focus:ring-0 transition-all outline-none font-medium text-gray-800 placeholder-gray-400 text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                {!isAdminLogin && (
                                    <div className="space-y-1.5 pt-1">
                                        <label className="flex items-start gap-2 cursor-pointer group">
                                            <div className="relative flex items-center mt-0.5">
                                                <input
                                                    type="checkbox"
                                                    checked={termsAccepted}
                                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                                    className="peer h-3.5 w-3.5 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-palm-green-dark checked:bg-palm-green-dark"
                                                />
                                                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                                                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </div>
                                            </div>
                                            <div className="text-[11px] text-gray-500 leading-tight">
                                                I agree to <button onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="text-palm-green-dark font-bold hover:underline">Terms</button>
                                            </div>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={stayLoggedIn}
                                                    onChange={(e) => setStayLoggedIn(e.target.checked)}
                                                    className="peer h-3.5 w-3.5 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-palm-green-dark checked:bg-palm-green-dark"
                                                />
                                                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                                                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </div>
                                            </div>
                                            <span className="text-[11px] text-gray-500">Keep me logged in</span>
                                        </label>
                                    </div>
                                )}
                            </>
                        )}

                        {step === 'OTP' && (
                            <div className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        onFocus={() => setFocusedField('otp')}
                                        onBlur={() => setFocusedField(undefined)}
                                        placeholder="• • • •"
                                        className="w-full py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-palm-green-light focus:ring-0 transition-all outline-none text-center text-2xl tracking-[0.5em] font-bold text-gray-800 placeholder-gray-300"
                                        autoFocus
                                    />
                                    <p className="text-center text-[10px] text-gray-400 mt-1.5">Use code 1234 for testing</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-2 bg-red-50 border border-red-100 rounded text-red-600 text-xs font-medium text-center animate-in fade-in">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                w-full py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all
                                flex items-center justify-center gap-2
                                ${isLoading || (step === 'PHONE' && !isAdminLogin && (!termsAccepted || !name || !phone))
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-palm-green-dark text-tropical-yellow hover:bg-opacity-90'}
                            `}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                isAdminLogin ? 'Enter Dashboard' : (step === 'PHONE' ? 'Get OTP' : 'Verify & Login')
                            )}
                        </button>
                    </form>

                    {step === 'OTP' && (
                        <div className="text-center mt-4">
                            <button
                                onClick={() => {
                                    setStep('PHONE');
                                    setOtp('');
                                    setError('');
                                }}
                                className="text-xs text-gray-500 hover:text-palm-green-dark font-medium transition-colors"
                            >
                                Change Phone Number
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
