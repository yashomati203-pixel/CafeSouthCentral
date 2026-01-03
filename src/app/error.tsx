'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#f9fafb',
            color: '#1f2937',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#dc2626'
            }}>
                Something went wrong!
            </h2>
            <p style={{
                marginBottom: '2rem',
                color: '#4b5563',
                maxWidth: '600px'
            }}>
                We apologize for the inconvenience. An unexpected error has occurred.
                Our team has been notified.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#5C3A1A',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'opacity 0.2s'
                }}
            >
                Try again
            </button>
        </div>
    );
}
