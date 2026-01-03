import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

export default function FeedbackModal({ isOpen, onClose, userId }: FeedbackModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, rating, comment }),
            });

            if (res.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    onClose();
                    setSubmitted(false);
                    setRating(0);
                    setComment('');
                }, 2000);
            } else {
                alert('Failed to submit feedback. Please try again.');
            }
        } catch (error) {
            console.error('Feedback error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 10000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem' // Add padding to ensure not touching edges on small screens
                }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)'
                        }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{
                            position: 'relative',
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '1rem',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            width: '100%',
                            maxWidth: '400px',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: '#666'
                            }}
                        >
                            ×
                        </button>

                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#5C3A1A' }}>Thank You!</h3>
                                <p style={{ color: '#666' }}>Your feedback helps us improve.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#5C3A1A' }}>
                                    Rate Your Experience
                                </h2>
                                <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                    How was your food and service today?
                                </p>

                                {/* Star Rating */}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                fontSize: '2rem',
                                                cursor: 'pointer',
                                                color: star <= rating ? '#fbbf24' : '#e5e7eb',
                                                transition: 'transform 0.1s',
                                                transform: star <= rating ? 'scale(1.1)' : 'scale(1)'
                                            }}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Any suggestions or comments? (Optional)"
                                    style={{
                                        width: '100%',
                                        minHeight: '100px',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #ddd',
                                        marginBottom: '1.5rem',
                                        fontFamily: 'inherit',
                                        resize: 'vertical'
                                    }}
                                />

                                <button
                                    type="submit"
                                    disabled={rating === 0 || isSubmitting}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        backgroundColor: rating === 0 ? '#9ca3af' : '#5C3A1A',
                                        color: 'white',
                                        borderRadius: '0.5rem',
                                        border: 'none',
                                        fontWeight: 'bold',
                                        cursor: rating === 0 ? 'not-allowed' : 'pointer',
                                        opacity: isSubmitting ? 0.7 : 1
                                    }}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
