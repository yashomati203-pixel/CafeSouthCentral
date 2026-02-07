'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const leftEyeGroupRef = useRef<SVGGElement>(null);
    const rightEyeGroupRef = useRef<SVGGElement>(null);

    const [step, setStep] = useState<'PHONE' | 'OTP' | 'ADMIN_LOGIN' | 'ADMIN_2FA'>('PHONE');
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    // User States
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');

    // Admin States
    const [adminId, setAdminId] = useState(''); // Stores generic identifier (email/phone/username)
    const [adminPassword, setAdminPassword] = useState('');
    const [admin2FA, setAdmin2FA] = useState('');
    const [adminUserId, setAdminUserId] = useState(''); // Returned from Step 1 for Step 2
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const eyeGroups = [leftEyeGroupRef.current, rightEyeGroupRef.current];
            const limit = 15;

            eyeGroups.forEach((eyeGroup) => {
                if (!eyeGroup) return;

                const rect = eyeGroup.getBoundingClientRect();
                const eyeCenterX = rect.left + rect.width / 2;
                const eyeCenterY = rect.top + rect.height / 2;

                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);

                const moveX = Math.cos(angle) * limit;
                const moveY = Math.sin(angle) * limit;

                eyeGroup.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const handleGetOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (isAdminLogin) {
            handleAdminLoginStep1();
            return;
        }

        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

            setStep('OTP');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdminLoginStep1 = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: adminId, password: adminPassword })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            if (data.require2FA) {
                setAdminUserId(data.userId);
                setStep('ADMIN_2FA');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdminVerify2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/admin/verify-2fa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: adminUserId, totpCode: admin2FA })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // Success - Redirect to Admin Dashboard
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp, name })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Invalid OTP');

            // Success - Redirect based on role or to menu
            router.push('/menu');
            router.refresh(); // Refresh to update server components with new session
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Logo in top-left corner */}
            <div className={styles.logoHeader}>
                <div
                    onClick={() => router.push('/')}
                    style={{ cursor: 'pointer' }}
                >
                    <Image
                        src="/logo.png"
                        alt="Cafe South Central"
                        width={200}
                        height={60}
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>
            </div>

            {/* Main content area */}
            <div className={styles.contentWrapper}>
                <div className={styles.loginCard}>
                    {/* Welcome Text */}
                    <h1 className={styles.welcomeText}>Welcome</h1>
                    <p className={styles.subtitle}>
                        {step === 'PHONE'
                            ? 'Please login to continue ordering'
                            : `Enter OTP sent to +91 ${phone}`}
                    </p>

                    {/* Smiley Face */}
                    <svg className={styles.faceSvg} viewBox="0 0 300 220">
                        <g className={styles.eyeGroup} ref={leftEyeGroupRef}>
                            <path className={styles.faceStroke} d="M 50,60 Q 90,30 130,60" />
                            <circle cx="90" cy="120" r="32" fill="black" />
                            <circle cx="80" cy="110" r="8" fill="white" />
                        </g>

                        <g className={styles.eyeGroup} ref={rightEyeGroupRef}>
                            <path className={styles.faceStroke} d="M 170,60 Q 210,30 250,60" />
                            <circle cx="210" cy="120" r="32" fill="black" />
                            <circle cx="200" cy="110" r="8" fill="white" />
                        </g>

                        <path className={styles.faceStroke} d="M 100,160 Q 150,210 200,160" />
                    </svg>

                    {/* Error Message */}
                    {error && <div className={styles.error}>{error}</div>}

                    {/* Admin Login Toggle */}
                    {(step === 'PHONE' || step === 'ADMIN_LOGIN') && (
                        <div className={styles.adminToggle}>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdminLogin(!isAdminLogin);
                                    if (!isAdminLogin) setStep('ADMIN_LOGIN');
                                    else setStep('PHONE');

                                    // Reset states
                                    setName('');
                                    setPhone('');
                                    setAdminId('');
                                    setAdminPassword('');
                                    setError('');
                                }}
                                className={styles.adminButton}
                            >
                                {isAdminLogin ? '← Back to User Login' : '🔐 Admin Login'}
                            </button>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={
                        step === 'ADMIN_2FA' ? handleAdminVerify2FA :
                            (step === 'OTP' ? handleVerifyOtp : handleGetOtp)
                    }>
                        {step === 'PHONE' && (
                            <>
                                {!isAdminLogin && (
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className={styles.input}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                )}
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className={styles.input}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </>
                        )}

                        {step === 'ADMIN_LOGIN' && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Admin ID / Email"
                                    className={styles.input}
                                    value={adminId}
                                    onChange={(e) => setAdminId(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={styles.input}
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    required
                                />
                            </>
                        )}

                        {step === 'ADMIN_2FA' && (
                            <div>
                                <p className={styles.label}>Enter Authenticator Code</p>
                                <input
                                    type="text"
                                    placeholder="000 000"
                                    className={styles.input}
                                    value={admin2FA}
                                    onChange={(e) => setAdmin2FA(e.target.value)}
                                    maxLength={6}
                                    style={{
                                        fontSize: '1.5rem',
                                        textAlign: 'center',
                                        letterSpacing: '0.2rem'
                                    }}
                                    autoFocus
                                    required
                                />
                            </div>
                        )}

                        {step === 'OTP' && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter 4-digit OTP (Use 1234)"
                                    className={styles.input}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={4}
                                    style={{
                                        fontSize: '1.5rem',
                                        textAlign: 'center',
                                        letterSpacing: '0.5rem'
                                    }}
                                    autoFocus
                                    required
                                />
                            </div>
                        )}

                        <button className={styles.button} disabled={loading}>
                            {loading ? 'Processing...' : (
                                isAdminLogin
                                    ? (step === 'ADMIN_2FA' ? 'Verify & Login' : 'Continue ->')
                                    : (step === 'PHONE' ? 'Get OTP ➔' : 'Verify & Login')
                            )}
                        </button>

                        {step === 'OTP' && (
                            <button
                                type="button"
                                onClick={() => {
                                    setStep('PHONE');
                                    setOtp('');
                                }}
                                className={styles.backLink}
                            >
                                Change Phone Number
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
