'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SmileyFace({ focusState }: { focusState?: 'name' | 'phone' | 'otp' | 'password' }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate percentage across screen (-1 to 1)
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            setMousePosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Eye movement logic
    const eyeVariants = {
        idle: { x: mousePosition.x * 5, y: mousePosition.y * 5 }, // Follow mouse
        name: { x: -5, y: 2 }, // Look at name input (approx)
        phone: { x: 5, y: 2 }, // Look at phone input
        otp: { scaleY: 0.1, transition: { duration: 0.2 } } // Eyes closed for OTP
    };

    const currentVariant = focusState === 'otp' ? 'otp' : (focusState ? focusState : 'idle');

    return (
        <div className="w-28 h-28 mx-auto relative">
            <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl">
                {/* Face Background */}
                <circle cx="60" cy="60" r="50" fill="#F7E231" stroke="#5C3A1A" strokeWidth="3" />

                {/* Eyes Container */}
                <g className="eyes">
                    {/* Left Eye */}
                    <motion.g
                        initial="idle"
                        animate={currentVariant as any}
                        variants={eyeVariants as any}
                    >
                        <circle cx="40" cy="45" r="6" fill="#1F1F1F" />
                    </motion.g>

                    {/* Right Eye */}
                    <motion.g
                        initial="idle"
                        animate={currentVariant as any}
                        variants={eyeVariants as any}
                    >
                        <circle cx="80" cy="45" r="6" fill="#1F1F1F" />
                    </motion.g>
                </g>

                {/* Mouth */}
                <motion.path
                    d="M 35 75 Q 60 95 85 75"
                    fill="none"
                    stroke="#5C3A1A"
                    strokeWidth="4"
                    strokeLinecap="round"
                    animate={{
                        d: focusState === 'otp'
                            ? "M 45 80 Q 60 80 75 80" // Serious mouth for OTP
                            : "M 35 75 Q 60 95 85 75" // Happy smile
                    }}
                />
            </svg>
        </div>
    );
}
