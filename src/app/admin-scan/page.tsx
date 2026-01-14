'use client';

import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useRouter } from 'next/navigation';

export default function AdminScanPage() {
    const [data, setData] = useState('No result');
    const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleScan = async (result: any, error: any) => {
        if (!!result) {
            const scanData = result?.text;
            if (scanData && scanData !== data && status !== 'PROCESSING' && status !== 'SUCCESS') {
                setData(scanData);
                processOrder(scanData);
            }
        }
        if (!!error) {
            // console.info(error);
        }
    };

    const processOrder = async (orderId: string) => {
        setStatus('PROCESSING');
        setMessage(`Processing Order: ${orderId}...`);

        try {
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
            setMessage(`Order ${orderId} Marked as SOLD! ✅`);

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
            }, 3000);
        }
    };

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f5f5f5', minHeight: '100vh' }}>
            <h1 style={{ marginBottom: '1rem', color: '#5C3A1A' }}>Kitchen Scanner</h1>

            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: 'black',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: '4px solid #5C3A1A'
            }}>
                <QrReader
                    onResult={handleScan}
                    constraints={{ facingMode: 'environment' }}
                    containerStyle={{ width: '100%' }}
                />
            </div>

            <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'white',
                borderRadius: '0.5rem',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
                <p style={{ fontWeight: 'bold' }}>Status: {status}</p>
                <p>{message || 'Ready to scan...'}</p>
            </div>

            <button onClick={() => router.push('/')} style={{ marginTop: '2rem', textDecoration: 'underline' }}>
                Back to Home
            </button>
        </div>
    );
}
