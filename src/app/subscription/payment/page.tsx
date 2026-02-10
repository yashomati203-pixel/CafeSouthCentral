'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, RefreshCw, Save, Check } from 'lucide-react';
import PaymentSelector, { PaymentDetails } from '@/components/payment/PaymentSelector';

export default function PaymentSettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [autoRenew, setAutoRenew] = useState(true);
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({ method: 'UPI' });
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
        if (!storedUser) {
            router.push('/?login=true');
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [router]);

    const handleSaveSettings = async () => {
        setIsSaving(true);

        // Simulate API call to save payment settings
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Here you would make an API call to save the settings
        // await fetch('/api/user/subscription/payment', { ... })

        setSaveSuccess(true);
        setIsSaving(false);

        setTimeout(() => {
            setSaveSuccess(false);
        }, 3000);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#f8fbf7] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-3xl mb-4">⏳</div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fbf7]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#166534]" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-[#0d1c11]">Payment Settings</h1>
                            <p className="text-sm text-gray-600">Manage auto-renew and payment methods</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-6">
                    {/* Auto-Renew Toggle */}
                    <div className="bg-white rounded-2xl border border-[#e7f3eb] shadow-sm p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <RefreshCw className="w-5 h-5 text-[#166534]" />
                                    <h2 className="text-xl font-serif font-bold text-[#0d1c11]">Auto-Renew</h2>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Automatically renew your subscription before it expires. You'll be charged using your saved payment method.
                                </p>
                            </div>
                            <button
                                onClick={() => setAutoRenew(!autoRenew)}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${autoRenew ? 'bg-[#166534]' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${autoRenew ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {autoRenew && (
                            <div className="mt-4 p-4 bg-[#dcfce7] border border-[#166534]/20 rounded-xl">
                                <div className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-[#166534] mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-[#166534]">Auto-Renew is Active</p>
                                        <p className="text-xs text-[#166534]/80 mt-1">
                                            Your subscription will automatically renew on the expiry date using the payment method below.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Method Section */}
                    {autoRenew && (
                        <div className="bg-white rounded-2xl border border-[#e7f3eb] shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <CreditCard className="w-5 h-5 text-[#166534]" />
                                <h2 className="text-xl font-serif font-bold text-[#0d1c11]">Payment Method for Auto-Renew</h2>
                            </div>

                            <p className="text-sm text-gray-600 mb-6">
                                Choose how you'd like to pay for automatic renewals. This payment method will be securely saved.
                            </p>

                            <PaymentSelector
                                amount={0}
                                onPaymentChange={setPaymentDetails}
                                variant="full"
                                excludeCash={true}
                            />
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.back()}
                            className="flex-1 py-3 px-6 border-2 border-[#166534] text-[#166534] rounded-xl font-bold hover:bg-[#166534]/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveSettings}
                            disabled={isSaving || (autoRenew && !paymentDetails.method)}
                            className="flex-1 py-3 px-6 bg-[#166534] text-white rounded-xl font-bold hover:bg-[#119e41] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : saveSuccess ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Settings
                                </>
                            )}
                        </button>
                    </div>

                    {/* Info Box */}
                    <div className="bg-[#fffae5] border border-[#f9e18b] rounded-xl p-4">
                        <p className="text-sm text-[#8b7500]">
                            <strong>Note:</strong> You can change or cancel auto-renew at any time. We'll send you a reminder 3 days before each renewal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
