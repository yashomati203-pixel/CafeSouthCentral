'use client';

import { useState, useEffect } from 'react';

export type PaymentMethodType = 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH';

export interface PaymentDetails {
    method: PaymentMethodType;
    upiId?: string;
    upiProvider?: 'GPAY' | 'PHONEPE' | 'PAYTM' | 'OTHER';
    cardNumber?: string;
    cardType?: 'VISA' | 'MASTERCARD' | 'RUPAY';
    cardExpiry?: string;
    cardCVV?: string;
    cardholderName?: string;
    bankName?: string;
    accountHolderName?: string;
}

interface PaymentSelectorProps {
    amount: number;
    onPaymentChange: (details: PaymentDetails) => void;
    variant?: 'full' | 'compact' | 'dropdown';
    excludeCash?: boolean;
}

const INDIAN_BANKS = [
    'State Bank of India (SBI)',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank (PNB)',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'Bank of India',
    'Indian Bank'
];

export default function PaymentSelector({ amount, onPaymentChange, variant = 'full', excludeCash = false }: PaymentSelectorProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(excludeCash ? 'UPI' : 'CASH');
    const [upiProvider, setUpiProvider] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'OTHER'>('GPAY');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [bankName, setBankName] = useState('');

    const [accountHolderName, setAccountHolderName] = useState('');

    // Sync initial state on mount
    useEffect(() => {
        // Immediately notify parent of initial state
        const initialMethod = excludeCash ? 'UPI' : 'CASH';
        onPaymentChange({
            method: initialMethod,
            upiId: initialMethod === 'UPI' ? upiId : undefined,
            upiProvider: initialMethod === 'UPI' ? upiProvider : undefined,
            cardNumber: undefined,
            cardExpiry: undefined,
            cardCVV: undefined,
            cardholderName: undefined,
            bankName: undefined,
            accountHolderName: undefined,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    const handleMethodChange = (method: PaymentMethodType) => {
        setSelectedMethod(method);
        // Reset details when method changes? Maybe better to keep them in state but not send them?
        // For now, re-trigger onPaymentChange with new method and existing (or empty) relevant details
        // The effect below or direct call will handle it.

        // We need to propagate the change immediately
        notifyChange(method);
    };

    const notifyChange = (method: PaymentMethodType, specificDetails: Partial<PaymentDetails> = {}) => {
        onPaymentChange({
            method,
            upiId: method === 'UPI' ? (specificDetails.upiId ?? upiId) : undefined,
            upiProvider: method === 'UPI' ? (specificDetails.upiProvider ?? upiProvider) : undefined,
            cardNumber: method === 'CARD' ? (specificDetails.cardNumber ?? cardNumber) : undefined,
            cardExpiry: method === 'CARD' ? (specificDetails.cardExpiry ?? cardExpiry) : undefined,
            cardCVV: method === 'CARD' ? (specificDetails.cardCVV ?? cardCVV) : undefined,
            cardholderName: method === 'CARD' ? (specificDetails.cardholderName ?? cardholderName) : undefined,
            bankName: method === 'NET_BANKING' ? (specificDetails.bankName ?? bankName) : undefined,
            accountHolderName: method === 'NET_BANKING' ? (specificDetails.accountHolderName ?? accountHolderName) : undefined,
        });
    };

    // Helper to update state and notify
    const update = (setter: any, val: any, key: keyof PaymentDetails) => {
        setter(val);
        notifyChange(selectedMethod, { [key]: val });
    };


    const detectCardType = (number: string): 'VISA' | 'MASTERCARD' | 'RUPAY' | undefined => {
        if (number.startsWith('4')) return 'VISA';
        if (number.startsWith('5')) return 'MASTERCARD';
        if (number.startsWith('6')) return 'RUPAY';
        return undefined;
    };

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted;
    };

    const formatExpiry = (value: string) => {
        const cleaned = value.replace(/\//g, '');
        if (cleaned.length >= 2) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        }
        return cleaned;
    };

    const cardType = detectCardType(cardNumber.replace(/\s/g, ''));

    // --- RENDER HELPERS ---

    const renderUpiDetails = () => (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* UPI Provider Selection */}
            <div className="flex flex-wrap gap-2 mb-3">
                {(['GPAY', 'PHONEPE', 'PAYTM', 'OTHER'] as const).map((provider) => (
                    <button
                        key={provider}
                        onClick={() => {
                            setUpiProvider(provider);
                            notifyChange('UPI', { upiProvider: provider });
                        }}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-bold border transition-all
                            ${upiProvider === provider
                                ? 'bg-[#5C3A1A] text-white border-[#5C3A1A] shadow-md transform scale-105'
                                : 'bg-white dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                            }
                        `}
                    >
                        {provider === 'GPAY' && '🔵 GPay'}
                        {provider === 'PHONEPE' && '🟣 PhonePe'}
                        {provider === 'PAYTM' && '🔵 Paytm'}
                        {provider === 'OTHER' && 'Other'}
                    </button>
                ))}
            </div>
            <input
                type="text"
                placeholder="Enter UPI ID (e.g., 9876543210@upi)"
                value={upiId}
                onChange={(e) => update(setUpiId, e.target.value, 'upiId')}
                className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#5C3A1A]/20 focus:border-[#5C3A1A] outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-all"
            />
        </div>
    );

    const renderCardDetails = () => (
        <div className="mt-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
                <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    maxLength={19}
                    onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        setCardNumber(formatted);
                        notifyChange('CARD', {
                            cardNumber: formatted,
                            cardType: detectCardType(formatted.replace(/\s/g, ''))
                        });
                    }}
                    className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#5C3A1A]/20 focus:border-[#5C3A1A] outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-all font-mono"
                />
                {cardType && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1 flex items-center gap-1">
                        {cardType === 'VISA' && '💳 Visa'}
                        {cardType === 'MASTERCARD' && '💳 Mastercard'}
                        {cardType === 'RUPAY' && '💳 RuPay'}
                    </p>
                )}
            </div>
            <div className="grid grid-cols-2 gap-3">
                <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    maxLength={5}
                    onChange={(e) => {
                        const formatted = formatExpiry(e.target.value);
                        setCardExpiry(formatted);
                        notifyChange('CARD', { cardExpiry: formatted });
                    }}
                    className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#5C3A1A]/20 focus:border-[#5C3A1A] outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-all text-center"
                />
                <input
                    type="text"
                    placeholder="CVV"
                    value={cardCVV}
                    maxLength={3}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setCardCVV(val);
                        notifyChange('CARD', { cardCVV: val });
                    }}
                    className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#5C3A1A]/20 focus:border-[#5C3A1A] outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-all text-center"
                />
            </div>
            <input
                type="text"
                placeholder="Cardholder Name"
                value={cardholderName}
                onChange={(e) => update(setCardholderName, e.target.value, 'cardholderName')}
                className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#5C3A1A]/20 focus:border-[#5C3A1A] outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-all"
            />
        </div>
    );

    const renderNetBankingDetails = () => (
        <div className="mt-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="relative">
                <select
                    value={bankName}
                    onChange={(e) => update(setBankName, e.target.value, 'bankName')}
                    className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#5C3A1A]/20 focus:border-[#5C3A1A] outline-none text-gray-900 dark:text-white transition-all appearance-none cursor-pointer"
                >
                    <option value="">Select Your Bank</option>
                    {INDIAN_BANKS.map((bank) => (
                        <option key={bank} value={bank}>{bank}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    ▼
                </div>
            </div>
            <input
                type="text"
                placeholder="Account Holder Name"
                value={accountHolderName}
                onChange={(e) => update(setAccountHolderName, e.target.value, 'accountHolderName')}
                className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#5C3A1A]/20 focus:border-[#5C3A1A] outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-all"
            />
        </div>
    );

    const renderCashDetails = () => (
        <div className="mt-4 p-4 bg-[#fdf8f6] dark:bg-[#5C3A1A]/10 rounded-lg border border-dashed border-[#5C3A1A]/30 flex flex-col items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-2xl">💵</span>
            <p className="text-sm text-[#5C3A1A] dark:text-[#d4b08c] text-center">
                Please pay <strong className="text-lg">₹{amount.toLocaleString()}</strong> at the counter when you pick up your order.
            </p>
        </div>
    );


    if (variant === 'dropdown') {
        return (
            <div className="w-full">
                <div className="relative">
                    <select
                        value={selectedMethod}
                        onChange={(e) => handleMethodChange(e.target.value as PaymentMethodType)}
                        className="w-full bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#5C3A1A]/20 focus:border-[#5C3A1A] outline-none text-gray-900 dark:text-white transition-all appearance-none cursor-pointer"
                    >
                        <option value="UPI">📱 UPI Payment</option>
                        <option value="CARD">💳 Credit/Debit Card</option>
                        <option value="NET_BANKING">🏦 Net Banking</option>
                        {!excludeCash && <option value="CASH">💵 Cash / Pay at Counter</option>}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        ▼
                    </div>
                </div>

                {/* Render Details based on selection */}
                {selectedMethod === 'UPI' && renderUpiDetails()}
                {selectedMethod === 'CARD' && renderCardDetails()}
                {selectedMethod === 'NET_BANKING' && renderNetBankingDetails()}
                {selectedMethod === 'CASH' && renderCashDetails()}

                {/* Summary */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <span className="font-semibold text-gray-500 dark:text-gray-400 text-sm">Total Payable</span>
                    <span className="text-xl font-bold text-[#5C3A1A] dark:text-[#d4b08c]">₹{amount.toLocaleString()}</span>
                </div>
            </div>
        );
    }

    // --- FULL VARIANT ---
    return (
        <div className="w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                💳 Payment Method
            </h3>

            {/* Payment Method Selection */}
            <div className="flex flex-col gap-3">

                {/* UPI */}
                <button
                    onClick={() => handleMethodChange('UPI')}
                    className={`
                        w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left group
                        ${selectedMethod === 'UPI'
                            ? 'border-[#5C3A1A] bg-[#fdf8f6] dark:bg-[#5C3A1A]/10'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] hover:border-gray-300 dark:hover:border-gray-600'
                        }
                    `}
                >
                    <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                        ${selectedMethod === 'UPI' ? 'border-[#5C3A1A]' : 'border-gray-300 dark:border-gray-600'}
                    `}>
                        {selectedMethod === 'UPI' && <div className="w-3 h-3 rounded-full bg-[#5C3A1A]" />}
                    </div>
                    <span className="font-bold text-gray-800 dark:text-white group-hover:text-[#5C3A1A] dark:group-hover:text-[#d4b08c] transition-colors">📱 UPI Payment</span>
                </button>
                {selectedMethod === 'UPI' && <div className="pl-4 ml-5 border-l-2 border-dashed border-[#5C3A1A]/20">{renderUpiDetails()}</div>}

                {/* Card */}
                <button
                    onClick={() => handleMethodChange('CARD')}
                    className={`
                        w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left group
                        ${selectedMethod === 'CARD'
                            ? 'border-[#5C3A1A] bg-[#fdf8f6] dark:bg-[#5C3A1A]/10'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] hover:border-gray-300 dark:hover:border-gray-600'
                        }
                    `}
                >
                    <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                        ${selectedMethod === 'CARD' ? 'border-[#5C3A1A]' : 'border-gray-300 dark:border-gray-600'}
                    `}>
                        {selectedMethod === 'CARD' && <div className="w-3 h-3 rounded-full bg-[#5C3A1A]" />}
                    </div>
                    <span className="font-bold text-gray-800 dark:text-white group-hover:text-[#5C3A1A] dark:group-hover:text-[#d4b08c] transition-colors">💳 Credit/Debit Card</span>
                </button>
                {selectedMethod === 'CARD' && <div className="pl-4 ml-5 border-l-2 border-dashed border-[#5C3A1A]/20">{renderCardDetails()}</div>}

                {/* Net Banking */}
                <button
                    onClick={() => handleMethodChange('NET_BANKING')}
                    className={`
                        w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left group
                        ${selectedMethod === 'NET_BANKING'
                            ? 'border-[#5C3A1A] bg-[#fdf8f6] dark:bg-[#5C3A1A]/10'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] hover:border-gray-300 dark:hover:border-gray-600'
                        }
                    `}
                >
                    <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                        ${selectedMethod === 'NET_BANKING' ? 'border-[#5C3A1A]' : 'border-gray-300 dark:border-gray-600'}
                    `}>
                        {selectedMethod === 'NET_BANKING' && <div className="w-3 h-3 rounded-full bg-[#5C3A1A]" />}
                    </div>
                    <span className="font-bold text-gray-800 dark:text-white group-hover:text-[#5C3A1A] dark:group-hover:text-[#d4b08c] transition-colors">🏦 Net Banking</span>
                </button>
                {selectedMethod === 'NET_BANKING' && <div className="pl-4 ml-5 border-l-2 border-dashed border-[#5C3A1A]/20">{renderNetBankingDetails()}</div>}

                {/* Cash */}
                {!excludeCash && (
                    <button
                        onClick={() => handleMethodChange('CASH')}
                        className={`
                            w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left group
                            ${selectedMethod === 'CASH'
                                ? 'border-[#5C3A1A] bg-[#fdf8f6] dark:bg-[#5C3A1A]/10'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] hover:border-gray-300 dark:hover:border-gray-600'
                            }
                        `}
                    >
                        <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                            ${selectedMethod === 'CASH' ? 'border-[#5C3A1A]' : 'border-gray-300 dark:border-gray-600'}
                        `}>
                            {selectedMethod === 'CASH' && <div className="w-3 h-3 rounded-full bg-[#5C3A1A]" />}
                        </div>
                        <span className="font-bold text-gray-800 dark:text-white group-hover:text-[#5C3A1A] dark:group-hover:text-[#d4b08c] transition-colors">💵 Cash / Pay at Counter</span>
                    </button>
                )}
                {selectedMethod === 'CASH' && !excludeCash && <div className="pl-4 ml-5 border-l-2 border-dashed border-[#5C3A1A]/20">{renderCashDetails()}</div>}

            </div>

            {/* Amount Summary */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="font-semibold text-gray-500 dark:text-gray-400">Total Payable</span>
                <span className="text-2xl font-bold text-[#5C3A1A] dark:text-[#d4b08c]">₹{amount.toLocaleString()}</span>
            </div>
        </div>
    );
}
