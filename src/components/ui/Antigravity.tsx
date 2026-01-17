'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AntigravityProps {
    count?: number;
    magnetRadius?: number;
    ringRadius?: number;
    waveSpeed?: number;
    waveAmplitude?: number;
    particleSize?: number;
    lerpSpeed?: number;
    color?: string;
    autoAnimate?: boolean;
    particleVariance?: number;
    rotationSpeed?: number;
    depthFactor?: number;
    pulseSpeed?: number;
    particleShape?: 'circle' | 'square' | 'capsule';
    fieldStrength?: number;
}

export default function Antigravity({
    count = 50,
    magnetRadius = 6,
    ringRadius = 10,
    waveSpeed = 0.4,
    waveAmplitude = 1,
    particleSize = 2,
    lerpSpeed = 0.1,
    color = '#37483c',
    autoAnimate = false,
    particleVariance = 1,
    rotationSpeed = 0,
    depthFactor = 1,
    pulseSpeed = 3,
    particleShape = 'capsule',
    fieldStrength = 10,
}: AntigravityProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<any[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });
    const timeRef = useRef(0);
    const lastMoveTimeRef = useRef(0);
    const [isMouseActive, setIsMouseActive] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            initParticles();
        };

        const initParticles = () => {
            particlesRef.current = [];
            // Particles start at mouse position when they spawn
            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    x: mouseRef.current.x,
                    y: mouseRef.current.y,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    phase: Math.random() * Math.PI * 2,
                    size: particleSize + (Math.random() - 0.5) * particleVariance,
                    opacity: 0,
                });
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                active: true,
            };
            lastMoveTimeRef.current = Date.now();
            setIsMouseActive(true);
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
            setIsMouseActive(false);
        };

        const animate = () => {
            // Clear with background color
            ctx.fillStyle = '#fefaef';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            timeRef.current += waveSpeed;

            // Check if mouse has been inactive for 500ms
            const timeSinceLastMove = Date.now() - lastMoveTimeRef.current;
            const shouldFade = timeSinceLastMove > 500;

            particlesRef.current.forEach((particle) => {
                // Update opacity based on mouse activity
                if (mouseRef.current.active && !shouldFade) {
                    particle.opacity = Math.min(particle.opacity + 0.05, 1);
                } else {
                    particle.opacity = Math.max(particle.opacity - 0.05, 0);
                }

                if (particle.opacity > 0) {
                    // Strong attraction to mouse position
                    const dx = mouseRef.current.x - particle.x;
                    const dy = mouseRef.current.y - particle.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Particles follow cursor closely
                    const followStrength = 0.1;
                    particle.vx += dx * followStrength;
                    particle.vy += dy * followStrength;

                    // Apply velocity
                    particle.x += particle.vx;
                    particle.y += particle.vy;

                    // Damping
                    particle.vx *= 0.9;
                    particle.vy *= 0.9;

                    // Small random drift
                    particle.vx += (Math.random() - 0.5) * 0.5;
                    particle.vy += (Math.random() - 0.5) * 0.5;

                    // Pulse effect
                    const pulse = 1 + Math.sin(timeRef.current * pulseSpeed + particle.phase) * 0.2;
                    const currentSize = particle.size * pulse;

                    // Draw particle with opacity
                    ctx.globalAlpha = particle.opacity;
                    ctx.fillStyle = color;

                    if (particleShape === 'circle') {
                        ctx.beginPath();
                        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (particleShape === 'square') {
                        ctx.fillRect(particle.x - currentSize, particle.y - currentSize, currentSize * 2, currentSize * 2);
                    } else if (particleShape === 'capsule') {
                        ctx.beginPath();
                        ctx.ellipse(particle.x, particle.y, currentSize * 1.5, currentSize, 0, 0, Math.PI * 2);
                        ctx.fill();
                    }
                } else {
                    // Reset particle to mouse position when invisible
                    particle.x = mouseRef.current.x;
                    particle.y = mouseRef.current.y;
                    particle.vx = (Math.random() - 0.5) * 2;
                    particle.vy = (Math.random() - 0.5) * 2;
                }
            });

            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [count, magnetRadius, waveSpeed, waveAmplitude, particleSize, lerpSpeed, color, particleVariance, pulseSpeed, particleShape, fieldStrength, ringRadius, autoAnimate, rotationSpeed, depthFactor]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
        />
    );
}