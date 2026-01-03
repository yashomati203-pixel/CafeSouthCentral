'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body style={{ margin: 0 }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: '#111827',
                    color: 'white',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        color: '#f87171'
                    }}>
                        Critical System Error
                    </h2>
                    <p style={{
                        marginBottom: '2rem',
                        color: '#d1d5db',
                        maxWidth: '500px'
                    }}>
                        A critical error occurred that prevented the application from loading.
                        Please refresh the page or try again later.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'white',
                            color: '#111827',
                            borderRadius: '0.5rem',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Reload Application
                    </button>
                </div>
            </body>
        </html>
    );
}
