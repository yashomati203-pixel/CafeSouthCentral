'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dropdown-menu'; // Using simple overlay instead of full Dialog to keep deps low/consistent

interface LoginPageProps {
    onLogin: (user: { name: string; phone: string }, stayLoggedIn: boolean) => Promise<void>;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [tempOtp, setTempOtp] = useState(''); // Store generated OTP for mock check

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
                await onLogin({ name: 'Admin', phone }, false); // Admin no persistence usually
            } catch (e) {
                // Error handling usually in onLogin alert, but we need to stop loading
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

        // Mock OTP Generation
        const mockOtp = '1234';
        setTempOtp(mockOtp);
        setStep('OTP');
        // alert(`Your OTP is ${mockOtp}`); // Optional: Simulate SMS
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp !== tempOtp && otp !== '1234') { // Allow 1234 as master otp
            setError('Invalid OTP. Please try again.');
            return;
        }

        setIsLoading(true);
        try {
            await onLogin({ name, phone }, stayLoggedIn);
        } catch (e) {
            // Check
        } finally {
            setIsLoading(false);
        }
    };

    const handleTermsClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowTermsModal(true);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e5e7eb',
            padding: '1rem',
            position: 'relative'
        }}>
            {/* Terms Modal Overlay */}
            {showTermsModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setShowTermsModal(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '1rem',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#5C3A1A' }}>Cafe South Central – User Agreement</h2>
                        <div style={{ fontSize: '0.9rem', color: '#444', lineHeight: '1.6', marginBottom: '1.5rem', textAlign: 'left' }}>
                            <p><strong>One User, One Plan:</strong> Your Mess Plan is linked to your Phone Number. Sharing your account to 'guest' others is not allowed and may result in plan suspension.</p>
                            <br />
                            <p><strong>Use It or Lose It:</strong> Subscription meals have a daily limit. These do not carry over. Your 'Daily Limit' resets every night at midnight.</p>
                            <br />
                            <p><strong>No Refunds:</strong> Subscription fees are non-refundable once the plan is activated.</p>
                            <br />
                            <p><strong>Inventory:</strong> All orders are subject to availability. If an item sells out before you pick it up, a 'Normal Mode' refund or substitute will be offered.</p>
                            <br />
                            <p><strong>Privacy:</strong> Your phone number is only used for secure login and to notify you when your food is ready. We never share your data.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowTermsModal(false)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: '#5C3A1A',
                                color: 'white',
                                borderRadius: '0.5rem',
                                fontWeight: 'bold',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                    {/* <img src="/logo.png" alt="Cafe South Central" style={{ height: '80px', objectFit: 'contain' }} /> */}
                    <h2 style={{ color: '#5C3A1A', fontWeight: 'bold' }}>Cafe South Central</h2>
                </div>

                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#5C3A1A',
                    marginBottom: '0.5rem'
                }}>
                    Welcome
                </h1>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                    {step === 'PHONE' ? 'Please login to continue ordering' : `Enter OTP sent to +91 ${phone}`}
                </p>

                {/* Admin Login Toggle - More Prominent */}
                {step === 'PHONE' && (
                    <div style={{
                        marginBottom: '2rem',
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.75rem',
                        border: '1px solid #e5e7eb'
                    }}>
                        <button
                            type="button"
                            onClick={() => {
                                setIsAdminLogin(!isAdminLogin);
                                setError('');
                                setStep('PHONE');
                            }}
                            style={{
                                width: '100%',
                                background: 'none',
                                border: 'none',
                                color: '#5C3A1A',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>
                                {isAdminLogin ? '← ' : '🔐 '}
                            </span>
                            {isAdminLogin ? 'Back to User Login' : 'Admin Login'}
                        </button>
                    </div>
                )}

                <form onSubmit={step === 'PHONE' ? handleGetOtp : handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {step === 'PHONE' && (
                        <>
                            {!isAdminLogin && (
                                <div style={{ textAlign: 'left' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#333' }}>
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #ddd',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                            )}

                            <div style={{ textAlign: 'left' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#333' }}>
                                    {isAdminLogin ? 'Admin ID' : 'Phone Number'}
                                </label>
                                <input
                                    type={isAdminLogin ? "text" : "tel"}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder={isAdminLogin ? "Enter Admin ID" : "Enter your number"}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #ddd',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            {!isAdminLogin && (
                                <>
                                    <label style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', textAlign: 'left', fontSize: '0.9rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={termsAccepted}
                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                            style={{ marginTop: '0.25rem' }}
                                        />
                                        <div style={{ color: '#555' }}>
                                            <span>I agree to the </span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setShowTermsModal(true);
                                                }}
                                                style={{ color: '#5C3A1A', textDecoration: 'underline', border: 'none', background: 'none', padding: 0, fontWeight: 'bold', cursor: 'pointer', display: 'inline' }}
                                            >
                                                Terms & Conditions
                                            </button>
                                        </div>
                                    </label>

                                    {/* Stay Logged In Checkbox */}
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left', fontSize: '0.9rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={stayLoggedIn}
                                            onChange={(e) => setStayLoggedIn(e.target.checked)}
                                        />
                                        <span style={{ color: '#555' }}>
                                            Stay logged in on this device
                                        </span>
                                    </label>
                                </>
                            )}
                        </>
                    )}

                    {step === 'OTP' && (
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#333' }}>
                                Enter 4-digit OTP (Use 1234)
                            </label>
                            <input
                                type="text"
                                maxLength={4}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="- - - -"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #ddd',
                                    fontSize: '1.5rem',
                                    textAlign: 'center',
                                    letterSpacing: '0.5rem'
                                }}
                                autoFocus
                            />
                        </div>
                    )}

                    {error && (
                        <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            {error}
                        </p>
                    )}

                    {(() => {
                        // Logic to calculate if button is disabled
                        const isPhoneStepValid = isAdminLogin
                            ? phone.trim().length > 0
                            : (name.trim().length > 0 && phone.trim().length >= 10 && termsAccepted);

                        const isDisabled = isLoading || (step === 'PHONE' && !isPhoneStepValid);

                        return (
                            <button
                                type="submit"
                                disabled={isDisabled}
                                style={{
                                    marginTop: '1rem',
                                    backgroundColor: isDisabled ? '#ccc' : '#5C3A1A',
                                    color: 'white',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                {isLoading ? 'Please wait...' : (isAdminLogin ? 'Login to Dashboard' : (step === 'PHONE' ? 'Get OTP ➔' : 'Verify & Login'))}
                            </button>
                        );
                    })()}

                    {step === 'OTP' && (
                        <button
                            type="button"
                            onClick={() => {
                                setStep('PHONE');
                                setOtp('');
                                setError('');
                            }}
                            style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Change Phone Number
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
