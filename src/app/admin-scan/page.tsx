'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import { RefreshCw } from 'lucide-react';

export default function AdminScanPage() {
    const [data, setData] = useState('No result');
    const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [message, setMessage] = useState('');
    const [authorized, setAuthorized] = useState(false);
    const [hasCameraError, setHasCameraError] = useState(false);

    const router = useRouter();
    const scannerRef = useRef<Html5Qrcode | null>(null);

    // Auth guard
    useEffect(() => {
        const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (['SUPER_ADMIN', 'MANAGER', 'KITCHEN_STAFF'].includes(parsed.role)) {
                    setAuthorized(true);
                    return;
                }
            } catch (e) { /* ignore */ }
        }
        router.push('/');
    }, [router]);

    // Wait for manual start to bypass browser auto-block policies
    useEffect(() => {
        if (!authorized) return;
        setStatus('IDLE');
        setMessage('Click the button below to start the scanner.');
    }, [authorized]);

    const startScanner = async () => {
        try {
            setStatus('PROCESSING');
            setMessage('Requesting camera permissions...');
            // Slightly delay to ensure DOM element 'reader' is ready
            await new Promise(resolve => setTimeout(resolve, 300));

            if (!document.getElementById('reader')) return;

            // Optional: specifically ask browser for permission first
            try {
                await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            } catch (mediaErr) {
                console.warn("Direct media access failed, falling back to html5-qrcode request", mediaErr);
            }

            const html5QrCode = new Html5Qrcode("reader");
            scannerRef.current = html5QrCode;

            const config = { fps: 10, qrbox: { width: 250, height: 250 } };

            await html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    handleScan(decodedText);
                },
                (errorMessage) => {
                    // ignore background noise/scan errors until a code is found
                }
            );
            setHasCameraError(false);
            setStatus('IDLE');
            setMessage('Ready to scan...');
        } catch (err: any) {
            console.error("Error starting scanner", err);
            setHasCameraError(true);
            setMessage(`Could not access camera. Ensure your browser has camera permissions allowed for this site.\n\nError: ${err?.message || 'Unknown Error'}`);
            setStatus('ERROR');
        }
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(console.error);
                scannerRef.current.clear();
            }
        };
    }, []);

    if (!authorized) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Checking authorization...</p>
            </div>
        );
    }

    const handleScan = async (scanResult: string) => {
        if (scanResult && scanResult !== data && status !== 'PROCESSING' && status !== 'SUCCESS') {
            setData(scanResult);
            // Temporarily pause scanner to prevent double scans
            if (scannerRef.current) {
                try {
                    await scannerRef.current.pause(true);
                } catch (e) { }
            }
            processOrder(scanResult);
        }
    };

    const processOrder = async (orderId: string) => {
        setStatus('PROCESSING');
        setMessage(`Checking Order: ${orderId}...`);

        try {
            // First, fetch the order to check its status
            const orderRes = await fetch(`/api/admin/orders?orderId=${orderId}`);
            if (!orderRes.ok) {
                throw new Error('Order not found');
            }

            const orderData = await orderRes.json();
            const order = Array.isArray(orderData) ? orderData[0] : orderData;

            // Check if order is ready for pickup
            if (order.status !== 'DONE' && order.status !== 'READY') {
                setStatus('ERROR');
                setMessage(`⚠️ Order ${order.displayId || orderId.slice(0, 8)} is still being prepared.\n\nCurrent Status: ${order.status}\n\nPlease wait until the order is marked as READY before scanning for pickup.`);

                // Reset after 5 seconds
                setTimeout(() => {
                    setStatus('IDLE');
                    setMessage('Scan customer QR code to mark order as picked up');
                    resumeScanner();
                }, 5000);
                return;
            }

            // Proceed with marking as SOLD
            const res = await fetch('/api/orders/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: 'SOLD' })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to update');
            }

            setStatus('SUCCESS');
            setMessage(`Order ${order.displayId || orderId.slice(0, 8)} Marked as SOLD! ✅`);

            // Redirect to admin dashboard after 2 seconds
            setTimeout(() => {
                router.push('/admin/dashboard');
            }, 2000);

        } catch (e: any) {
            setStatus('ERROR');
            setMessage(`Error: ${e.message}`);
            // Allow retry
            setTimeout(() => {
                setStatus('IDLE');
                setMessage('Ready to scan...');
                resumeScanner();
            }, 3000);
        }
    };

    const resumeScanner = () => {
        if (scannerRef.current) {
            try {
                scannerRef.current.resume();
            } catch (e) { }
        }
    }

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f5f5f5', minHeight: '100vh', paddingBottom: '100px' }}>
            <h1 style={{ marginBottom: '1rem', color: '#5C3A1A', fontWeight: 'bold' }}>Kitchen Scanner</h1>

            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: 'black',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: '4px solid #5C3A1A',
                aspectRatio: '1',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Scanner Target Output */}
                <div id="reader" style={{ width: '100%', height: '100%' }}></div>

                {!scannerRef.current && !hasCameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-4 text-center z-10">
                        <button
                            onClick={startScanner}
                            className="bg-[#166534] px-6 py-3 rounded-xl font-bold flex items-center gap-2 transform transition-transform hover:scale-105 shadow-lg"
                        >
                            Open Camera
                        </button>
                    </div>
                )}

                {hasCameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4 text-center z-10">
                        <p className="mb-4 text-sm px-2">Camera access denied.</p>
                        <p className="mb-6 text-xs text-gray-300">If on mobile, ensure you are accessing via <strong>HTTPS</strong> or click the site settings icon (lock/tune) in your browser URL bar to allow camera access.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#166534] px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" /> Reload Page
                        </button>
                    </div>
                )}
            </div>

            <div style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                background: 'white',
                borderRadius: '0.5rem',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                border: '1px solid #e7f3eb'
            }}>
                <p style={{ fontWeight: 'bold', color: status === 'ERROR' ? 'red' : status === 'SUCCESS' ? 'green' : '#0e1b12', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    {status === 'IDLE' ? 'Waiting for QR...' : status}
                </p>
                <p style={{ color: '#4e9767', whiteSpace: 'pre-line' }}>{message}</p>
            </div>

            <button onClick={() => router.push('/admin/dashboard')} style={{ marginTop: '2rem', padding: '0.75rem 2rem', background: '#e7f3eb', color: '#166534', borderRadius: '2rem', fontWeight: 'bold' }}>
                Back to Dashboard
            </button>
        </div>
    );
}
