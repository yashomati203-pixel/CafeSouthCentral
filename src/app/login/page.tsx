'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const leftEyeGroupRef = useRef<SVGGElement>(null);
    const rightEyeGroupRef = useRef<SVGGElement>(null);

    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');

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

    const handleGetOtp = (e: React.FormEvent) => {
        e.preventDefault();

        if (isAdminLogin) {
            console.log('Admin login with ID:', phone);
            return;
        }

        console.log('Sending OTP to:', phone);
        setStep('OTP');
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Verifying OTP:', otp);
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

                    {/* Admin Login Toggle */}
                    {step === 'PHONE' && (
                        <div className={styles.adminToggle}>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdminLogin(!isAdminLogin);
                                    setName('');
                                    setPhone('');
                                }}
                                className={styles.adminButton}
                            >
                                {isAdminLogin ? '← Back to User Login' : '🔐 Admin Login'}
                            </button>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={step === 'PHONE' ? handleGetOtp : handleVerifyOtp}>
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
                                    type={isAdminLogin ? "text" : "tel"}
                                    placeholder={isAdminLogin ? "Admin ID" : "Phone Number"}
                                    className={styles.input}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </>
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

                        <button className={styles.button}>
                            {isAdminLogin
                                ? 'Login to Dashboard'
                                : (step === 'PHONE' ? 'Get OTP ➔' : 'Verify & Login')}
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
