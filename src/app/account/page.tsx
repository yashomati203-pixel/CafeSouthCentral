'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Pencil1Icon,
    CheckIcon,
    Cross2Icon,
    ExitIcon,
    ReaderIcon,
    StarIcon,
    ChevronRightIcon,
    ChatBubbleIcon,
    PlusIcon,
    TrashIcon
} from '@radix-ui/react-icons';
import DesktopHeader from '@/components/layout/DesktopHeader';

interface Address {
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isPrimary: boolean;
}

interface PaymentMethod {
    id: string;
    cardType: string;
    lastFourDigits: string;
    expiryMonth: number;
    expiryYear: number;
    cardholderName?: string;
    isPrimary: boolean;
}

interface LoyaltyPoints {
    totalPoints: number;
    tier: string;
    pointsToNextTier: number;
}

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Profile Edit State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '', profilePicture: '' });
    const [saving, setSaving] = useState(false);

    // Addresses State
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addressForm, setAddressForm] = useState({
        label: '',
        street: '',
        city: '',
        state: '',
        zipCode: ''
    });

    // Payment Methods State
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
    const [paymentForm, setPaymentForm] = useState<{
        cardType: string;
        lastFourDigits: string;
        expiryMonth: number;
        expiryYear: number;
        cardholderName?: string;
    }>({
        cardType: 'Visa',
        lastFourDigits: '',
        expiryMonth: new Date().getMonth() + 1,
        expiryYear: new Date().getFullYear(),
        cardholderName: ''
    });

    // Loyalty State
    const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints | null>(null);

    // Subscription State
    const [subscription, setSubscription] = useState<any>(null);

    const AVATAR_PRESETS = [
        `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`,
        `https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka`,
        `https://api.dicebear.com/7.x/avataaars/svg?seed=Bob`,
        `https://api.dicebear.com/7.x/notionists/svg?seed=Pumpkin`,
        `https://api.dicebear.com/7.x/bottts/svg?seed=Tech`
    ];

    // Initial Load
    useEffect(() => {
        const storedUser = localStorage.getItem('cafe_user') || sessionStorage.getItem('cafe_user');
        if (!storedUser) {
            router.push('/?login=true');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setEditForm({
            name: parsedUser.name || '',
            phone: parsedUser.phone || '',
            profilePicture: parsedUser.profilePicture || ''
        });

        loadUserData(parsedUser.id);
        setLoading(false);
    }, [router]);

    const loadUserData = async (userId: string) => {
        // Load addresses (will fail until migration runs - graceful handling)
        try {
            const addrRes = await fetch(`/api/user/addresses?userId=${userId}`);
            if (addrRes.ok) setAddresses(await addrRes.json());
        } catch (e) { console.log('Addresses not available yet'); }

        // Load payment methods
        try {
            const pmRes = await fetch(`/api/user/payment-methods?userId=${userId}`);
            if (pmRes.ok) setPaymentMethods(await pmRes.json());
        } catch (e) { console.log('Payment methods not available yet'); }

        // Load loyalty points
        try {
            const loyaltyRes = await fetch(`/api/user/loyalty?userId=${userId}`);
            if (loyaltyRes.ok) setLoyaltyPoints(await loyaltyRes.json());
        } catch (e) { console.log('Loyalty not available yet'); }

        // Load subscription
        try {
            const subRes = await fetch(`/api/user/subscription?userId=${userId}`);
            if (subRes.ok) {
                const data = await subRes.json();
                setSubscription(data.subscription || null);
            }
        } catch (e) { console.log('Subscription check failed'); }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    name: editForm.name,
                    phone: editForm.phone,
                    profilePicture: editForm.profilePicture
                })
            });

            const data = await res.json();
            if (res.ok) {
                setUser(data);
                if (localStorage.getItem('cafe_user')) {
                    localStorage.setItem('cafe_user', JSON.stringify(data));
                } else {
                    sessionStorage.setItem('cafe_user', JSON.stringify(data));
                }
                setIsEditingProfile(false);
            }
        } catch (e) {
            alert('Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        if (!confirm('Are you sure you want to log out?')) return;
        localStorage.removeItem('cafe_user');
        sessionStorage.removeItem('cafe_user');
        router.push('/');
    };

    // Address Handlers
    const handleSaveAddress = async () => {
        try {
            const url = editingAddress
                ? `/api/user/addresses/${editingAddress.id}`
                : '/api/user/addresses';
            const method = editingAddress ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...addressForm, userId: user.id })
            });

            if (res.ok) {
                await loadUserData(user.id);
                setShowAddressModal(false);
                setEditingAddress(null);
                setAddressForm({ label: '', street: '', city: '', state: '', zipCode: '' });
            }
        } catch (e) {
            alert('Error saving address');
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm('Delete this address?')) return;
        try {
            await fetch(`/api/user/addresses/${id}`, { method: 'DELETE' });
            await loadUserData(user.id);
        } catch (e) {
            alert('Error deleting address');
        }
    };

    const handleSetPrimaryAddress = async (addressId: string) => {
        try {
            await fetch('/api/user/addresses/primary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, addressId })
            });
            await loadUserData(user.id);
        } catch (e) {
            alert('Error setting primary address');
        }
    };

    // Payment Method Handlers
    const handleSavePayment = async () => {
        try {
            const url = editingPayment
                ? `/api/user/payment-methods/${editingPayment.id}`
                : '/api/user/payment-methods';
            const method = editingPayment ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...paymentForm, userId: user.id })
            });

            if (res.ok) {
                await loadUserData(user.id);
                setShowPaymentModal(false);
                setEditingPayment(null);
                setPaymentForm({ cardType: 'Visa', lastFourDigits: '', expiryMonth: new Date().getMonth() + 1, expiryYear: new Date().getFullYear(), cardholderName: '' });
            }
        } catch (e) {
            alert('Error saving payment method');
        }
    };

    const handleDeletePayment = async (id: string) => {
        if (!confirm('Delete this payment method?')) return;
        try {
            await fetch(`/api/user/payment-methods/${id}`, { method: 'DELETE' });
            await loadUserData(user.id);
        } catch (e) {
            alert('Error deleting payment method');
        }
    };

    const handleSetPrimaryPayment = async (paymentMethodId: string) => {
        try {
            await fetch('/api/user/payment-methods/primary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, paymentMethodId })
            });
            await loadUserData(user.id);
        } catch (e) {
            alert('Error setting primary payment method');
        }
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Platinum': return { bg: '#e0e7ff', color: '#4338ca' };
            case 'Gold': return { bg: '#fef3c7', color: '#92400e' };
            case 'Silver': return { bg: '#f3f4f6', color: '#374151' };
            default: return { bg: '#fed7aa', color: '#92400e' };
        }
    };

    if (loading && !user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Account...</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FBFAF9' }}>
            <DesktopHeader
                user={user}
                onLoginClick={() => router.push('/?login=true')}
            />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                {/* Header with Logout */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>My Profile</h1>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.625rem 1.25rem',
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            border: '1px solid #fecaca',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        <ExitIcon />
                        Logout
                    </button>
                </div>

                {/* Two Column Layout - Desktop only */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 350px',
                    gap: '2rem'
                }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Profile Card */}
                        <div style={{
                            backgroundColor: '#fdf9ee',
                            borderRadius: '1rem',
                            padding: '2rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: 1 }}>
                                    {/* Avatar */}
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                                        <img
                                            src={isEditingProfile && editForm.profilePicture ? editForm.profilePicture : (user?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`)}
                                            alt="Profile"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>

                                    {/* Info */}
                                    {!isEditingProfile ? (
                                        <div>
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 0.25rem 0' }}>{user?.name}</h2>
                                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>📞 {user?.phone}</p>
                                            {user?.email && <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>✉️ {user?.email}</p>}
                                        </div>
                                    ) : (
                                        <div style={{ flex: 1 }}>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                placeholder="Full Name"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.625rem',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.875rem',
                                                    marginBottom: '0.5rem'
                                                }}
                                            />
                                            <input
                                                type="tel"
                                                value={editForm.phone}
                                                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                                placeholder="Phone Number"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.625rem',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.875rem'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Edit/Save Button */}
                                {!isEditingProfile ? (
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            backgroundColor: '#f3f4f6',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: '#374151',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.375rem'
                                        }}
                                    >
                                        <Pencil1Icon />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => setIsEditingProfile(false)}
                                            style={{
                                                padding: '0.5rem 0.75rem',
                                                backgroundColor: '#f3f4f6',
                                                border: 'none',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            style={{
                                                padding: '0.5rem 0.75rem',
                                                backgroundColor: '#5C3A1A',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                cursor: saving ? 'not-allowed' : 'pointer',
                                                opacity: saving ? 0.7 : 1
                                            }}
                                        >
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Avatar Selection (when editing) */}
                            {isEditingProfile && (
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        Choose Avatar
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                                        {AVATAR_PRESETS.map((url, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setEditForm({ ...editForm, profilePicture: url })}
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '50%',
                                                    border: editForm.profilePicture === url ? '3px solid #5C3A1A' : '2px solid transparent',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <img src={url} style={{ width: '100%', height: '100%' }} alt="" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Saved Addresses */}
                        <div style={{
                            backgroundColor: '#fdf9ee',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Saved Addresses</h3>

                            {addresses.length === 0 ? (
                                <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>No saved addresses yet</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                                    {addresses.map(addr => (
                                        <div key={addr.id} style={{
                                            padding: '1rem',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '0.5rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'start'
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                    <span style={{ fontWeight: '600', color: '#1f2937' }}>{addr.label}</span>
                                                    {addr.isPrimary && (
                                                        <span style={{
                                                            fontSize: '0.75rem',
                                                            padding: '0.125rem 0.5rem',
                                                            backgroundColor: '#fef3c7',
                                                            color: '#92400e',
                                                            borderRadius: '0.25rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            Primary
                                                        </span>
                                                    )}
                                                </div>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                                                    {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                                                {!addr.isPrimary && (
                                                    <button
                                                        onClick={() => handleSetPrimaryAddress(addr.id)}
                                                        style={{
                                                            padding: '0.375rem 0.625rem',
                                                            backgroundColor: '#fdf9ee',
                                                            color: '#5C3A1A',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        Set Primary
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setEditingAddress(addr);
                                                        setAddressForm(addr);
                                                        setShowAddressModal(true);
                                                    }}
                                                    style={{
                                                        padding: '0.375rem 0.625rem',
                                                        backgroundColor: '#fdf9ee',
                                                        color: '#5C3A1A',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                    style={{
                                                        padding: '0.375rem 0.625rem',
                                                        backgroundColor: '#fdf9ee',
                                                        color: '#ef4444',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    setEditingAddress(null);
                                    setAddressForm({ label: '', street: '', city: '', state: '', zipCode: '' });
                                    setShowAddressModal(true);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: '#fdf9ee',
                                    border: '1px dashed #d1d5db',
                                    borderRadius: '0.5rem',
                                    color: '#5C3A1A',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <PlusIcon />
                                Add New Address
                            </button>
                        </div>

                        {/* Payment Methods */}
                        <div style={{
                            backgroundColor: '#fdf9ee',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Payment Methods</h3>

                            {paymentMethods.length === 0 ? (
                                <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>No saved payment methods yet</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                                    {paymentMethods.map(pm => (
                                        <div key={pm.id} style={{
                                            padding: '1rem',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '0.5rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: '#f3f4f6',
                                                    borderRadius: '0.5rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.25rem'
                                                }}>
                                                    💳
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.125rem' }}>
                                                        <span style={{ fontWeight: '600', color: '#1f2937' }}>{pm.cardType} ending in {pm.lastFourDigits}</span>
                                                        {pm.isPrimary && (
                                                            <span style={{
                                                                fontSize: '0.75rem',
                                                                padding: '0.125rem 0.5rem',
                                                                backgroundColor: '#fef3c7',
                                                                color: '#92400e',
                                                                borderRadius: '0.25rem',
                                                                fontWeight: '600'
                                                            }}>
                                                                Primary
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                                                        Expires {String(pm.expiryMonth).padStart(2, '0')}/{pm.expiryYear}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                                                {!pm.isPrimary && (
                                                    <button
                                                        onClick={() => handleSetPrimaryPayment(pm.id)}
                                                        style={{
                                                            padding: '0.375rem 0.625rem',
                                                            backgroundColor: '#fdf9ee',
                                                            color: '#5C3A1A',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        Set Primary
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setEditingPayment(pm);

                                                        setPaymentForm(pm);
                                                        setShowPaymentModal(true);
                                                    }}
                                                    style={{
                                                        padding: '0.375rem 0.625rem',
                                                        backgroundColor: '#fdf9ee',
                                                        color: '#5C3A1A',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePayment(pm.id)}
                                                    style={{
                                                        padding: '0.375rem 0.625rem',
                                                        backgroundColor: '#fdf9ee',
                                                        color: '#ef4444',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    setEditingPayment(null);
                                    setPaymentForm({ cardType: 'Visa', lastFourDigits: '', expiryMonth: new Date().getMonth() + 1, expiryYear: new Date().getFullYear(), cardholderName: '' });
                                    setShowPaymentModal(true);
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: '#fdf9ee',
                                    border: '1px dashed #d1d5db',
                                    borderRadius: '0.5rem',
                                    color: '#5C3A1A',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <PlusIcon />
                                Add New Card
                            </button>
                        </div>

                        {/* Quick Links */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button
                                onClick={() => router.push('/orders')}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#fdf9ee',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fed7aa', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ReaderIcon width={20} height={20} />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <h3 style={{ fontWeight: 'bold', color: '#1f2937', margin: 0, fontSize: '0.9375rem' }}>Order History</h3>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>View past orders and receipts</p>
                                    </div>
                                </div>
                                <ChevronRightIcon style={{ color: '#9ca3af' }} width={20} height={20} />
                            </button>

                            <button
                                onClick={() => router.push('/subscription')}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#fdf9ee',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <StarIcon width={20} height={20} />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <h3 style={{ fontWeight: 'bold', color: '#1f2937', margin: 0, fontSize: '0.9375rem' }}>Subscription Plans</h3>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Manage your meal plans</p>
                                    </div>
                                </div>
                                <ChevronRightIcon style={{ color: '#9ca3af' }} width={20} height={20} />
                            </button>

                            <button
                                onClick={() => router.push('/?feedback=true')}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#fdf9ee',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ChatBubbleIcon width={20} height={20} />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <h3 style={{ fontWeight: 'bold', color: '#1f2937', margin: 0, fontSize: '0.9375rem' }}>Send Feedback</h3>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Share your experience with us</p>
                                    </div>
                                </div>
                                <ChevronRightIcon style={{ color: '#9ca3af' }} width={20} height={20} />
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Loyalty & Rewards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Loyalty & Rewards Card */}
                        <div style={{
                            backgroundColor: '#fdf9ee',
                            borderRadius: '1rem',
                            padding: '2rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>Loyalty & Rewards</h3>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#5C3A1A', marginBottom: '0.5rem' }}>
                                {loyaltyPoints?.totalPoints || 0}
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '1rem' }}>Points</p>

                            <div style={{
                                display: 'inline-block',
                                padding: '0.5rem 1.25rem',
                                backgroundColor: getTierColor(loyaltyPoints?.tier || 'Bronze').bg,
                                color: getTierColor(loyaltyPoints?.tier || 'Bronze').color,
                                borderRadius: '1.5rem',
                                fontSize: '0.875rem',
                                fontWeight: 'bold',
                                marginBottom: '1.5rem'
                            }}>
                                {loyaltyPoints?.tier || 'Bronze'} Member
                            </div>

                            {loyaltyPoints && loyaltyPoints.pointsToNextTier > 0 && (
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>
                                    You're just {loyaltyPoints.pointsToNextTier} points away from a free pastry!
                                </p>
                            )}

                            <button
                                onClick={() => router.push('/subscription')}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: '#5C3A1A',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                View Rewards Program
                            </button>
                        </div>

                        {/* Current Plan Card (if subscription exists) */}
                        {subscription && (
                            <div style={{
                                backgroundColor: '#fdf9ee',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Current Plan</h3>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: '#d1fae5',
                                        color: '#065f46',
                                        borderRadius: '1rem',
                                        fontWeight: '600'
                                    }}>
                                        Active
                                    </span>
                                </div>
                                <p style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                                    {subscription.planType === 'MONTHLY_MESS' ? 'Premium Plan' : 'Trial Plan'}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                                    Next billing on {new Date(subscription.endDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => router.push('/subscription')}
                                        style={{
                                            flex: 1,
                                            padding: '0.625rem',
                                            backgroundColor: '#5C3A1A',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Manage Plan
                                    </button>
                                    <button
                                        onClick={() => alert('Cancel subscription feature coming soon')}
                                        style={{
                                            padding: '0.625rem 1rem',
                                            backgroundColor: '#fee2e2',
                                            color: '#b91c1c',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div >

            {/* Address Modal */}
            {
                showAddressModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }} onClick={() => setShowAddressModal(false)}>
                        <div style={{
                            backgroundColor: '#fdf9ee',
                            borderRadius: '1rem',
                            padding: '2rem',
                            maxWidth: '500px',
                            width: '90%'
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                                </h3>
                                <button onClick={() => setShowAddressModal(false)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                                    <Cross2Icon width={20} height={20} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Label</label>
                                    <select
                                        value={addressForm.label}
                                        onChange={e => setAddressForm({ ...addressForm, label: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <option value="">Select label</option>
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Street Address</label>
                                    <input
                                        type="text"
                                        value={addressForm.street}
                                        onChange={e => setAddressForm({ ...addressForm, street: e.target.value })}
                                        placeholder="456 Oak Avenue, Springfield"
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>City</label>
                                        <input
                                            type="text"
                                            value={addressForm.city}
                                            onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                                            placeholder="IL"
                                            style={{
                                                width: '100%',
                                                padding: '0.625rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>State</label>
                                        <input
                                            type="text"
                                            value={addressForm.state}
                                            onChange={e => setAddressForm({ ...addressForm, state: e.target.value })}
                                            placeholder="IL"
                                            style={{
                                                width: '100%',
                                                padding: '0.625rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>ZIP Code</label>
                                    <input
                                        type="text"
                                        value={addressForm.zipCode}
                                        onChange={e => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                                        placeholder="62704"
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                    <button
                                        onClick={() => setShowAddressModal(false)}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            backgroundColor: '#f3f4f6',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveAddress}
                                        disabled={!addressForm.label || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipCode}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            backgroundColor: '#5C3A1A',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            opacity: (!addressForm.label || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipCode) ? 0.5 : 1
                                        }}
                                    >
                                        Save Address
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Payment Modal */}
            {
                showPaymentModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }} onClick={() => setShowPaymentModal(false)}>
                        <div style={{
                            backgroundColor: '#fdf9ee',
                            borderRadius: '1rem',
                            padding: '2rem',
                            maxWidth: '500px',
                            width: '90%'
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                                    {editingPayment ? 'Edit Payment Method' : 'Add New Card'}
                                </h3>
                                <button onClick={() => setShowPaymentModal(false)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                                    <Cross2Icon width={20} height={20} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Card Type</label>
                                    <select
                                        value={paymentForm.cardType}
                                        onChange={e => setPaymentForm({ ...paymentForm, cardType: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <option value="Visa">Visa</option>
                                        <option value="MasterCard">MasterCard</option>
                                        <option value="Rupay">Rupay</option>
                                        <option value="American Express">American Express</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Last 4 Digits</label>
                                    <input
                                        type="text"
                                        maxLength={4}
                                        value={paymentForm.lastFourDigits}
                                        onChange={e => setPaymentForm({ ...paymentForm, lastFourDigits: e.target.value.replace(/\D/g, '') })}
                                        placeholder="1234"
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Expiry Month</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="12"
                                            value={paymentForm.expiryMonth}
                                            onChange={e => setPaymentForm({ ...paymentForm, expiryMonth: parseInt(e.target.value) || 1 })}
                                            style={{
                                                width: '100%',
                                                padding: '0.625rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Expiry Year</label>
                                        <input
                                            type="number"
                                            min={new Date().getFullYear()}
                                            value={paymentForm.expiryYear}
                                            onChange={e => setPaymentForm({ ...paymentForm, expiryYear: parseInt(e.target.value) || new Date().getFullYear() })}
                                            style={{
                                                width: '100%',
                                                padding: '0.625rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Cardholder Name (Optional)</label>
                                    <input
                                        type="text"
                                        value={paymentForm.cardholderName}
                                        onChange={e => setPaymentForm({ ...paymentForm, cardholderName: e.target.value })}
                                        placeholder="John Doe"
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                    <button
                                        onClick={() => setShowPaymentModal(false)}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            backgroundColor: '#f3f4f6',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSavePayment}
                                        disabled={!paymentForm.lastFourDigits || paymentForm.lastFourDigits.length !== 4}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            backgroundColor: '#5C3A1A',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            opacity: (!paymentForm.lastFourDigits || paymentForm.lastFourDigits.length !== 4) ? 0.5 : 1
                                        }}
                                    >
                                        Save Card
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
