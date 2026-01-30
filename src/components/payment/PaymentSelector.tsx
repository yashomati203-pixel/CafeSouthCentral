'use client';

import { useState } from 'react';

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
    variant?: 'full' | 'compact';
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

export default function PaymentSelector({ amount, onPaymentChange, variant = 'full' }: PaymentSelectorProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('CASH');
    const [upiProvider, setUpiProvider] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'OTHER'>('GPAY');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');

    const handleMethodChange = (method: PaymentMethodType) => {
        setSelectedMethod(method);
        onPaymentChange({
            method,
            upiId: method === 'UPI' ? upiId : undefined,
            upiProvider: method === 'UPI' ? upiProvider : undefined,
            cardNumber: method === 'CARD' ? cardNumber : undefined,
            cardExpiry: method === 'CARD' ? cardExpiry : undefined,
            cardCVV: method === 'CARD' ? cardCVV : undefined,
            cardholderName: method === 'CARD' ? cardholderName : undefined,
            bankName: method === 'NET_BANKING' ? bankName : undefined,
            accountHolderName: method === 'NET_BANKING' ? accountHolderName : undefined,
        });
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

    return (
        <div style={{ width: '100%' }}>
            <h3 style={{
                fontSize: variant === 'full' ? '1.25rem' : '1.1rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#1f2937'
            }}>
                💳 Payment Method
            </h3>

            {/* Payment Method Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                {/* UPI */}
                <button
                    onClick={() => handleMethodChange('UPI')}
                    style={{
                        padding: '1rem',
                        border: selectedMethod === 'UPI' ? '2px solid #5C3A1A' : '1px solid #d1d5db',
                        borderRadius: '0.75rem',
                        backgroundColor: selectedMethod === 'UPI' ? '#fdf8f6' : 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: `2px solid ${selectedMethod === 'UPI' ? '#5C3A1A' : '#d1d5db'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {selectedMethod === 'UPI' && (
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#5C3A1A' }} />
                            )}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '1rem' }}>📱 UPI Payment</span>
                    </div>
                </button>

                {selectedMethod === 'UPI' && (
                    <div style={{ marginLeft: '2.5rem', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                        {/* UPI Provider Selection */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                            {(['GPAY', 'PHONEPE', 'PAYTM', 'OTHER'] as const).map((provider) => (
                                <button
                                    key={provider}
                                    onClick={() => setUpiProvider(provider)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        border: upiProvider === provider ? '2px solid #5C3A1A' : '1px solid #d1d5db',
                                        borderRadius: '0.5rem',
                                        backgroundColor: upiProvider === provider ? '#5C3A1A' : 'white',
                                        color: upiProvider === provider ? 'white' : '#374151',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        cursor: 'pointer'
                                    }}
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
                            onChange={(e) => {
                                setUpiId(e.target.value);
                                onPaymentChange({
                                    method: 'UPI',
                                    upiId: e.target.value,
                                    upiProvider
                                });
                            }}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>
                )}

                {/* Card Payment */}
                <button
                    onClick={() => handleMethodChange('CARD')}
                    style={{
                        padding: '1rem',
                        border: selectedMethod === 'CARD' ? '2px solid #5C3A1A' : '1px solid #d1d5db',
                        borderRadius: '0.75rem',
                        backgroundColor: selectedMethod === 'CARD' ? '#fdf8f6' : 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: `2px solid ${selectedMethod === 'CARD' ? '#5C3A1A' : '#d1d5db'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {selectedMethod === 'CARD' && (
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#5C3A1A' }} />
                            )}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '1rem' }}>💳 Credit/Debit Card</span>
                    </div>
                </button>

                {selectedMethod === 'CARD' && (
                    <div style={{ marginLeft: '2.5rem', marginTop: '-0.5rem', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div>
                            <input
                                type="text"
                                placeholder="Card Number"
                                value={cardNumber}
                                maxLength={19}
                                onChange={(e) => {
                                    const formatted = formatCardNumber(e.target.value);
                                    setCardNumber(formatted);
                                    onPaymentChange({
                                        method: 'CARD',
                                        cardNumber: formatted,
                                        cardType: detectCardType(formatted.replace(/\s/g, '')),
                                        cardExpiry,
                                        cardCVV,
                                        cardholderName
                                    });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem'
                                }}
                            />
                            {cardType && (
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                    {cardType === 'VISA' && '💳 Visa'}
                                    {cardType === 'MASTERCARD' && '💳 Mastercard'}
                                    {cardType === 'RUPAY' && '💳 RuPay'}
                                </p>
                            )}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={cardExpiry}
                                maxLength={5}
                                onChange={(e) => {
                                    const formatted = formatExpiry(e.target.value);
                                    setCardExpiry(formatted);
                                }}
                                style={{
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem'
                                }}
                            />
                            <input
                                type="text"
                                placeholder="CVV"
                                value={cardCVV}
                                maxLength={3}
                                onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                                style={{
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem'
                                }}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Cardholder Name"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>
                )}

                {/* Net Banking */}
                <button
                    onClick={() => handleMethodChange('NET_BANKING')}
                    style={{
                        padding: '1rem',
                        border: selectedMethod === 'NET_BANKING' ? '2px solid #5C3A1A' : '1px solid #d1d5db',
                        borderRadius: '0.75rem',
                        backgroundColor: selectedMethod === 'NET_BANKING' ? '#fdf8f6' : 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: `2px solid ${selectedMethod === 'NET_BANKING' ? '#5C3A1A' : '#d1d5db'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {selectedMethod === 'NET_BANKING' && (
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#5C3A1A' }} />
                            )}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '1rem' }}>🏦 Net Banking</span>
                    </div>
                </button>

                {selectedMethod === 'NET_BANKING' && (
                    <div style={{ marginLeft: '2.5rem', marginTop: '-0.5rem', marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <select
                            value={bankName}
                            onChange={(e) => {
                                setBankName(e.target.value);
                                onPaymentChange({
                                    method: 'NET_BANKING',
                                    bankName: e.target.value,
                                    accountHolderName
                                });
                            }}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                        >
                            <option value="">Select Your Bank</option>
                            {INDIAN_BANKS.map((bank) => (
                                <option key={bank} value={bank}>{bank}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Account Holder Name"
                            value={accountHolderName}
                            onChange={(e) => setAccountHolderName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>
                )}

                {/* Cash/Counter */}
                <button
                    onClick={() => handleMethodChange('CASH')}
                    style={{
                        padding: '1rem',
                        border: selectedMethod === 'CASH' ? '2px solid #5C3A1A' : '1px solid #d1d5db',
                        borderRadius: '0.75rem',
                        backgroundColor: selectedMethod === 'CASH' ? '#fdf8f6' : 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: `2px solid ${selectedMethod === 'CASH' ? '#5C3A1A' : '#d1d5db'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {selectedMethod === 'CASH' && (
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#5C3A1A' }} />
                            )}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '1rem' }}>💵 Cash / Pay at Counter</span>
                    </div>
                </button>
            </div>

            {/* Amount Summary */}
            <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#6b7280' }}>Total Amount</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#5C3A1A' }}>₹{amount.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
