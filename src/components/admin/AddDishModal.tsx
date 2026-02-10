'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface AddDishModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddDishModal({ onClose, onSuccess }: AddDishModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [stock, setStock] = useState('0');
    const [type, setType] = useState('NORMAL');
    const [isVeg, setIsVeg] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    price: parseFloat(price),
                    category,
                    description,
                    imageUrl,
                    stock: parseInt(stock),
                    type,
                    isVeg
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create item');
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Add New Dish</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Name *</label>
                            <input
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-brown focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Masala Dosa"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Price (₹) *</label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-brown outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Category *</label>
                            <input
                                required
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                list="categories"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-brown outline-none transition-all"
                                placeholder="e.g. Breakfast"
                            />
                            <datalist id="categories">
                                <option value="Breakfast" />
                                <option value="Lunch" />
                                <option value="Snacks" />
                                <option value="Beverages" />
                            </datalist>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Initial Stock</label>
                            <input
                                type="number"
                                min="0"
                                value={stock}
                                onChange={e => setStock(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-brown outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-brown outline-none transition-all resize-none h-20"
                            placeholder="Brief description of the dish..."
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">Dish Image</label>
                        <div className="flex items-center gap-4">
                            {/* Upload Button/Input */}
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        // Upload logic
                                        const formData = new FormData();
                                        formData.append('file', file);

                                        try {
                                            const res = await fetch('/api/upload', {
                                                method: 'POST',
                                                body: formData
                                            });
                                            if (res.ok) {
                                                const data = await res.json();
                                                setImageUrl(data.url);
                                            } else {
                                                alert('Upload failed');
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert('Upload error');
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200"
                                >
                                    Choose File
                                </button>
                            </div>

                            {/* Preview */}
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-lg object-cover border border-gray-300 shadow-sm"
                                />
                            ) : (
                                <span className="text-xs text-gray-400">No image selected</span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-6 pt-2">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isVeg}
                                onChange={e => setIsVeg(e.target.checked)}
                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Vegetarian?</span>
                        </div>

                        <div className="flex items-center gap-2 cursor-pointer">
                            <span className="text-sm font-medium text-gray-700">Type:</span>
                            <select
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-primary-brown outline-none"
                            >
                                <option value="NORMAL">Normal</option>
                                <option value="SUBSCRIPTION">Subscription</option>
                                <option value="BOTH">Both</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-primary-brown text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Save Dish
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
