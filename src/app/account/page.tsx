'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Pencil1Icon,
    ChevronRightIcon,
} from '@radix-ui/react-icons';
import {
    ChevronLeft,
    Home as HomeIcon,
    Briefcase as BackpackIcon,
    Star as StarIcon,
    Trash2 as TrashIcon,
    Plus as PlusIcon,
    Mail
} from 'lucide-react';
import ProfileSidebar from '@/components/profile/ProfileSidebar';


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

// LoyaltyPoints interface removed

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
        sessionStorage.removeItem('cafe_has_explored'); // Clear explored state
        window.dispatchEvent(new Event('storage-update')); // Notify layout
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

    // Loyalty Helper Removed

    // Logic for "Save All Changes" bottom bar:
    // It will save the profile info.

    if (loading && !user) return <div className="min-h-screen flex items-center justify-center bg-[#f8fbf7] dark:bg-[#121212] pt-20">Loading Account...</div>;

    return (
        <div className="min-h-screen bg-[#f8fbf7] dark:bg-[#121212] pb-32 md:pb-0">


            <div className="flex max-w-[1400px] mx-auto md:px-6 md:py-8 gap-8">
                {/* Desktop Sidebar */}
                <ProfileSidebar user={user} onLogout={handleLogout} />

                {/* Main Content */}
                <main className="flex-1 w-full max-w-5xl mx-auto">

                    {/* Mobile Sub-Header: Customer Settings */}
                    <div className="md:hidden px-6 pt-4 pb-4 sticky top-0 bg-[#f8fbf7]/80 dark:bg-[#121212]/80 backdrop-blur-md z-30 flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 flex items-center justify-start text-[#0d1c11] dark:text-white"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-xl font-serif text-[#0d1c11] dark:text-white text-center">Customer Settings</h1>
                        </div>
                        <div className="w-10"></div>
                    </div>

                    {/* Desktop Title */}
                    <div className="hidden md:flex flex-col gap-2 mb-8">
                        <h1 className="text-3xl font-serif font-bold text-[#0d1c11] dark:text-white">Settings</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage your profile and preferences</p>
                    </div>

                    <div className="flex flex-col gap-8 px-6 md:px-0">
                        {/* Profile Section */}
                        <section>
                            <div className="hidden md:flex items-center justify-between mb-4">
                                <h3 className="text-xl font-serif text-[#0d1c11] dark:text-white">Personal Information</h3>
                            </div>

                            {/* Mobile Avatar Layout */}
                            <div className="md:hidden flex flex-col items-center mb-6">
                                <div className="relative group mt-2">
                                    <div
                                        className="w-28 h-28 rounded-full bg-center bg-no-repeat bg-cover border-4 border-white dark:border-gray-800 shadow-md"
                                        style={{ backgroundImage: `url(${editForm.profilePicture || user?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`})` }}
                                    />
                                    <button
                                        onClick={() => {
                                            const url = prompt("Enter new avatar URL:", editForm.profilePicture);
                                            if (url) setEditForm({ ...editForm, profilePicture: url });
                                        }}
                                        className="absolute bottom-1 right-1 bg-[#0ac238] text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-gray-800"
                                    >
                                        <Pencil1Icon className="w-4 h-4" />
                                    </button>
                                </div>
                                <h2 className="mt-4 text-xl font-bold text-[#0d1c11] dark:text-white">{user?.name}</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
                            </div>

                            {/* Desktop/Mobile Form Card */}
                            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative">
                                {/* Desktop Avatar (in card) */}
                                <div className="hidden md:flex items-center gap-10 mb-8">
                                    <div className="relative group">
                                        <div
                                            className="w-24 h-24 rounded-full bg-center bg-no-repeat bg-cover border-4 border-[#f8fbf7] dark:border-gray-800 shadow-sm"
                                            style={{ backgroundImage: `url(${editForm.profilePicture || user?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`})` }}
                                        />
                                        <button
                                            onClick={() => {
                                                const url = prompt("Enter new avatar URL:", editForm.profilePicture);
                                                if (url) setEditForm({ ...editForm, profilePicture: url });
                                            }}
                                            className="absolute bottom-0 right-0 bg-[#0ac238] text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                                        >
                                            <Pencil1Icon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Desktop Inputs */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                                            <input
                                                className="w-full bg-[#f8fbf7] dark:bg-gray-800 border-none rounded-lg px-3 py-2 text-sm font-semibold focus:ring-1 focus:ring-[#0ac238] text-[#0d1c11] dark:text-white"
                                                type="text"
                                                value={editForm.name}
                                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    className="w-full bg-[#f8fbf7] dark:bg-gray-800 border-none rounded-lg px-3 py-2 text-sm font-semibold focus:ring-1 focus:ring-[#0ac238] text-[#0d1c11] dark:text-white"
                                                    type="text"
                                                    value={editForm.phone}
                                                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            {/* Email Removed */}
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Fields (Only Phone is shown in template card, Name/Email are above) */}
                                <div className="md:hidden space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                                        <div className="relative">
                                            <input
                                                className="w-full bg-[#f8fbf7] dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#0ac238]/20 text-[#0d1c11] dark:text-white"
                                                type="text"
                                                value={editForm.name}
                                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                                        <div className="relative">
                                            <input
                                                className="w-full bg-[#f8fbf7] dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#0ac238]/20 text-[#0d1c11] dark:text-white"
                                                type="text"
                                                value={editForm.phone}
                                                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0ac238]">
                                                <Pencil1Icon className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Saved Addresses Section */}
                        <section>
                            <div className="flex items-center justify-between mb-4 px-1 md:px-0">
                                <h3 className="text-lg md:text-xl font-serif text-[#0d1c11] dark:text-white">Saved Addresses</h3>
                                <button
                                    onClick={() => {
                                        setEditingAddress(null);
                                        setAddressForm({ label: '', street: '', city: '', state: '', zipCode: '' });
                                        setShowAddressModal(true);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0ac238]/10 text-[#0ac238] font-bold text-xs md:text-sm hover:bg-[#0ac238]/20 transition-colors"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    Add New
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                {addresses.map(addr => (
                                    <div key={addr.id} className="group bg-white dark:bg-[#1e1e1e] rounded-xl p-4 border-2 border-gray-100 dark:border-gray-800 hover:border-[#0ac238]/50 dark:hover:border-[#0ac238]/50 transition-all flex items-start gap-4 shadow-sm hover:shadow-md">
                                        <div className="bg-[#0ac238]/10 p-2.5 rounded-lg text-[#0ac238] shrink-0">
                                            {addr.label.toLowerCase() === 'home' && <HomeIcon className="w-5 h-5" />}
                                            {['work', 'office'].includes(addr.label.toLowerCase()) && <BackpackIcon className="w-5 h-5" />}
                                            {!['home', 'work', 'office'].includes(addr.label.toLowerCase()) && <StarIcon className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-[#0d1c11] dark:text-white text-base capitalize">{addr.label}</h4>
                                                {addr.isPrimary && <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-md">PRIMARY</span>}
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                {addr.street}, {addr.city}
                                                {addr.zipCode && <span className="block text-xs text-gray-400 mt-0.5">{addr.state} - {addr.zipCode}</span>}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => {
                                                    setEditingAddress(addr);
                                                    setAddressForm(addr);
                                                    setShowAddressModal(true);
                                                }}
                                                className="p-2 text-gray-400 hover:text-[#0ac238] hover:bg-[#0ac238]/10 rounded-lg transition-colors"
                                                title="Edit Address"
                                            >
                                                <Pencil1Icon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(addr.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete Address"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {addresses.length === 0 && (
                                    <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/20">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">No saved addresses yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Payment Methods Section */}
                        <section>
                            <div className="flex items-center justify-between mb-4 px-1 md:px-0">
                                <h3 className="text-lg md:text-xl font-serif text-[#0d1c11] dark:text-white">Payment Methods</h3>
                                <button
                                    onClick={() => {
                                        setEditingPayment(null);
                                        setPaymentForm({ cardType: 'Visa', lastFourDigits: '', expiryMonth: new Date().getMonth() + 1, expiryYear: new Date().getFullYear(), cardholderName: '' });
                                        setShowPaymentModal(true);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0ac238]/10 text-[#0ac238] font-bold text-xs md:text-sm hover:bg-[#0ac238]/20 transition-colors"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    Add New
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                {paymentMethods.map(pm => (
                                    <div key={pm.id} className="group bg-white dark:bg-[#1e1e1e] rounded-xl p-4 border-2 border-gray-100 dark:border-gray-800 hover:border-[#0ac238]/50 dark:hover:border-[#0ac238]/50 transition-all flex items-center justify-between gap-4 shadow-sm hover:shadow-md">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shrink-0">
                                                <div className="w-6 h-6 flex items-center justify-center text-[#0d1c11] dark:text-white text-xl">💳</div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#0d1c11] dark:text-white text-base mb-0.5">{pm.cardType} •••• {pm.lastFourDigits}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium font-mono">
                                                    EXP: {String(pm.expiryMonth).padStart(2, '0')}/{String(pm.expiryYear).slice(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {pm.isPrimary && (
                                                <span className="bg-[#0ac238]/10 text-[#0ac238] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#0ac238]/20">Primary</span>
                                            )}
                                            <button
                                                onClick={() => handleDeletePayment(pm.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete Payment Method"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {paymentMethods.length === 0 && (
                                    <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/20">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">No saved payment methods yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Mobile Feedback & Logout */}
                    <div className="md:hidden mt-8 space-y-3">
                        <a
                            href="mailto:hello@cafesouthcentral.com"
                            className="block w-full"
                        >
                            <div className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-[#0d1c11] dark:text-white bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 shadow-sm font-bold">
                                <Mail className="w-5 h-5" />
                                Share Feedback
                            </div>
                        </a>

                        <div className="p-6 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-red-500 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 transition-colors font-bold"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Fixed Bottom Save Button (Mobile) & Inline (Desktop) */}
                    <div className="fixed bottom-16 md:bottom-auto left-1/2 -translate-x-1/2 md:translate-x-0 w-full max-w-[430px] md:max-w-none md:static bg-white dark:bg-[#121212] md:bg-transparent border-t md:border-t-0 border-gray-100 dark:border-gray-800 z-20 px-6 pt-4 pb-2 md:p-0 md:mt-12 md:mb-12">
                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="w-full md:w-auto md:px-8 bg-[#0d1c11] dark:bg-[#0ac238] text-white py-4 md:py-3 rounded-2xl md:rounded-xl font-bold text-base hover:opacity-90 transition-all shadow-lg"
                        >
                            {saving ? 'Saving...' : 'Save All Changes'}
                        </button>
                    </div>

                </main>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowAddressModal(false)}>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-gray-100 dark:border-gray-800 scale-100 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-serif font-bold text-[#0d1c11] dark:text-white">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <button onClick={() => setShowAddressModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <PlusIcon className="w-6 h-6 rotate-45 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Label</label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-base font-medium focus:ring-2 focus:ring-[#0ac238]/20 focus:border-[#0ac238] outline-none transition-all text-[#0d1c11] dark:text-white"
                                    placeholder="e.g. Home, Work, Mom's House"
                                    value={addressForm.label}
                                    onChange={e => setAddressForm({ ...addressForm, label: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Street Address</label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-base font-medium focus:ring-2 focus:ring-[#0ac238]/20 focus:border-[#0ac238] outline-none transition-all text-[#0d1c11] dark:text-white"
                                    placeholder="Flat / House No / Street"
                                    value={addressForm.street}
                                    onChange={e => setAddressForm({ ...addressForm, street: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">City</label>
                                    <input
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-base font-medium focus:ring-2 focus:ring-[#0ac238]/20 focus:border-[#0ac238] outline-none transition-all text-[#0d1c11] dark:text-white"
                                        placeholder="City"
                                        value={addressForm.city}
                                        onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">State</label>
                                    <input
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-base font-medium focus:ring-2 focus:ring-[#0ac238]/20 focus:border-[#0ac238] outline-none transition-all text-[#0d1c11] dark:text-white"
                                        placeholder="State"
                                        value={addressForm.state}
                                        onChange={e => setAddressForm({ ...addressForm, state: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Zip Code</label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-base font-medium focus:ring-2 focus:ring-[#0ac238]/20 focus:border-[#0ac238] outline-none transition-all text-[#0d1c11] dark:text-white"
                                    placeholder="Area Code"
                                    value={addressForm.zipCode}
                                    onChange={e => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                                />
                            </div>

                            <button
                                onClick={handleSaveAddress}
                                className="w-full bg-[#0ac238] hover:bg-[#08a530] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-4"
                            >
                                {editingAddress ? 'Update Address' : 'Save Address'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowPaymentModal(false)}>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-gray-100 dark:border-gray-800 scale-100 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-serif font-bold text-[#0d1c11] dark:text-white">
                                {editingPayment ? 'Edit Method' : 'Add Payment Method'}
                            </h3>
                            <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <PlusIcon className="w-6 h-6 rotate-45 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Card Type</label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-base font-medium focus:ring-2 focus:ring-[#0ac238]/20 focus:border-[#0ac238] outline-none transition-all text-[#0d1c11] dark:text-white"
                                    placeholder="e.g. Visa, Mastercard"
                                    value={paymentForm.cardType}
                                    onChange={e => setPaymentForm({ ...paymentForm, cardType: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Last 4 Digits</label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-base font-medium focus:ring-2 focus:ring-[#0ac238]/20 focus:border-[#0ac238] outline-none transition-all text-[#0d1c11] dark:text-white font-mono"
                                    placeholder="XXXX"
                                    value={paymentForm.lastFourDigits}
                                    onChange={e => setPaymentForm({ ...paymentForm, lastFourDigits: e.target.value })}
                                    maxLength={4}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Expiry Month</label>
                                    <input
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-base font-medium focus:ring-2 focus:ring-[#0ac238]/20 focus:border-[#0ac238] outline-none transition-all text-[#0d1c11] dark:text-white text-center"
                                        type="number"
                                        placeholder="MM"
                                        min={1} max={12}
                                        value={paymentForm.expiryMonth}
                                        onChange={e => setPaymentForm({ ...paymentForm, expiryMonth: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Expiry Year</label>
                                    <input
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-base font-medium focus:ring-2 focus:ring-[#0ac238]/20 focus:border-[#0ac238] outline-none transition-all text-[#0d1c11] dark:text-white text-center"
                                        type="number"
                                        placeholder="YYYY"
                                        value={paymentForm.expiryYear}
                                        onChange={e => setPaymentForm({ ...paymentForm, expiryYear: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSavePayment}
                                className="w-full bg-[#0ac238] hover:bg-[#08a530] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-4"
                            >
                                {editingPayment ? 'Update Method' : 'Save Payment Method'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
