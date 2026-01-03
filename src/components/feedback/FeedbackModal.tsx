"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarFilledIcon, Cross1Icon } from "@radix-ui/react-icons";
import { StarIcon as StarOutlineIcon } from "@radix-ui/react-icons"; // Radix doesn't have outline star easily, using dim color or unicode

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => Promise<void>;
    isLoading?: boolean;
}

export default function FeedbackModal({ isOpen, onClose, onSubmit, isLoading = false }: FeedbackModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = async () => {
        if (rating === 0) return;
        await onSubmit(rating, comment);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <Cross1Icon className="w-6 h-6" />
                        </button>

                        <div className="p-8 text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Rate Your Experience
                            </h2>
                            <p className="text-gray-500 mb-8">
                                How was your food and service today?
                            </p>

                            {/* Stars */}
                            <div className="flex justify-center gap-2 mb-8">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                    >
                                        {star <= (hoverRating || rating) ? (
                                            <StarFilledIcon className="w-10 h-10 text-yellow-400" />
                                        ) : (
                                            <StarFilledIcon className="w-10 h-10 text-gray-300" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Comment Box */}
                            <div className="mb-6 relative">
                                <textarea
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all outline-none resize-none text-gray-700 placeholder-gray-400"
                                    placeholder="Any suggestions or comments? (Optional)"
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <div className="absolute bottom-3 right-3">
                                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={rating === 0 || isLoading}
                                className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all transform active:scale-[0.98] ${rating > 0 && !isLoading
                                        ? "bg-slate-500 hover:bg-slate-600 shadow-lg shadow-slate-200"
                                        : "bg-gray-300 cursor-not-allowed"
                                    }`}
                            >
                                {isLoading ? "Submitting..." : "Submit Feedback"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
