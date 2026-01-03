import React, { useEffect, useRef, useState } from 'react';
import styles from './OrderConfirmed.module.css';
import { QRCodeCanvas } from 'qrcode.react';

interface OrderConfirmedProps {
    onComplete: () => void;
    inline?: boolean;
    orderId?: string;
    displayId?: string;
}

export default function OrderConfirmed({ onComplete, inline = false, orderId, displayId }: OrderConfirmedProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || showQR) return;

        // Ensure video plays
        video.play().catch(e => console.error("Video play failed:", e));

        const handleEnded = () => {

            // Switch to QR view
            setShowQR(true);
        };

        video.addEventListener('ended', handleEnded);
        return () => video.removeEventListener('ended', handleEnded);
    }, [showQR]);

    return (
        <div className={inline ? styles.inlineContainer : styles.overlay}>
            {!showQR ? (
                <video
                    ref={videoRef}
                    className={styles.videoPlayer}
                    src="/Untitled file.webm"
                    playsInline
                    muted // Muted needed for auto-play often
                />
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    textAlign: 'center',
                    width: '100%',
                    // height: '100%', // Removed to allow natural height
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <style>{`
                        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                    `}</style>
                    <h2 style={{ fontSize: '1.5rem', color: '#5C3A1A', marginBottom: '0.5rem' }}>Order Placed! 🎉</h2>
                    <p style={{ color: '#666', marginBottom: '1.5rem' }}>Please show this code at the counter.</p>

                    <div style={{ padding: '1rem', border: '2px dashed #5C3A1A', borderRadius: '0.5rem', marginBottom: '1rem', background: 'white' }}>
                        <QRCodeCanvas value={orderId || 'ERROR-NO-ID'} size={180} />
                    </div>

                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333', marginBottom: '2rem' }}>
                        Order #{displayId || '---'}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                            onClick={() => {
                                onComplete();
                                window.location.href = '/orders'; // Use window.location for reliable navigation + drawer close
                            }}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'white',
                                color: '#5C3A1A',
                                border: '1px solid #5C3A1A',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                            }}
                        >
                            Track Order
                        </button>
                        <button
                            onClick={onComplete}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#5C3A1A',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                            }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
