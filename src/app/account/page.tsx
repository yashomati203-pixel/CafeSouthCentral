'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Pencil1Icon,
    CheckIcon,
    CameraIcon,
    ExitIcon,
    ReaderIcon,
    StarIcon,
    ChevronRightIcon
} from '@radix-ui/react-icons';

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '', profilePicture: '' });
    const [saving, setSaving] = useState(false);

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

        // Refresh User Data (Silent)
        fetch(`/api/user/subscription?userId=${parsedUser.id}`); // Just to keep session alive or warm up
        setLoading(false);
    }, [router]);

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
                setIsEditing(false);
                alert('Profile updated!');
            } else {
                alert(data.error || 'Failed to update');
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

    const AVATAR_PRESETS = [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Mittens",
        "https://api.dicebear.com/7.x/notionists/svg?seed=Pumpkin",
        "https://api.dicebear.com/7.x/bottts/svg?seed=Tech"
    ];

    if (loading && !user) return <div className="p-8 text-center">Loading Account...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
            {/* Header / Nav */}
            <div className="bg-white px-6 py-4 border-b flex items-center justify-between sticky top-0 z-10">
                <button
                    onClick={() => router.push('/')}
                    className="text-gray-600 font-medium flex items-center gap-2"
                >
                    ← Back
                </button>
                <h1 className="text-lg font-bold text-[#5C3A1A]">My Account</h1>
                <button
                    onClick={handleLogout}
                    className="text-red-500 p-2 rounded-full hover:bg-red-50"
                    title="Logout"
                >
                    <ExitIcon width={20} height={20} />
                </button>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-6">

                {/* PROFILE CARD */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Profile</h2>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-[#5C3A1A] text-sm font-medium flex items-center gap-1 hover:underline"
                            >
                                <Pencil1Icon /> Edit
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-1 px-3 text-sm text-gray-500 bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="p-1 px-3 text-sm text-white bg-[#5C3A1A] rounded-lg flex items-center gap-1"
                                >
                                    {saving ? 'Saving...' : <><CheckIcon /> Save</>}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md">
                                <img
                                    src={isEditing && editForm.profilePicture ? editForm.profilePicture : (user?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`)}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <CameraIcon width={24} height={24} />
                                </div>
                            )}
                        </div>

                        {/* Details OR Edit Form */}
                        <div className="w-full text-center">
                            {!isEditing ? (
                                <>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h3>
                                    <p className="text-gray-500 mb-2">{user?.phone}</p>
                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                        {user?.role === 'ADMIN' ? 'Admin' : 'Verified Customer'}
                                    </span>
                                </>
                            ) : (
                                <div className="space-y-4 text-left">
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5C3A1A]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={editForm.phone}
                                            onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5C3A1A]"
                                        />
                                    </div>

                                    {/* Avatar Selection */}
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase font-bold mb-2">Choose Avatar</label>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {AVATAR_PRESETS.map((url, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setEditForm({ ...editForm, profilePicture: url })}
                                                    className={`w-10 h-10 rounded-full border-2 overflow-hidden flex-shrink-0 ${editForm.profilePicture === url ? 'border-[#5C3A1A] scale-110' : 'border-transparent'}`}
                                                >
                                                    <img src={url} className="w-full h-full" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MENU OPTIONS (Replacements for removed dropdown items) */}
                <div className="space-y-4">
                    <button
                        onClick={() => router.push('/orders')}
                        className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                <ReaderIcon width={20} height={20} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-gray-900">Order History</h3>
                                <p className="text-xs text-gray-500">View past orders and receipts</p>
                            </div>
                        </div>
                        <ChevronRightIcon className="text-gray-400" width={20} height={20} />
                    </button>

                    <button
                        onClick={() => router.push('/subscription')}
                        className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 active:scale-[0.98] transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                <StarIcon width={20} height={20} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-gray-900">Subscription Plans</h3>
                                <p className="text-xs text-gray-500">Manage your meal plans</p>
                            </div>
                        </div>
                        <ChevronRightIcon className="text-gray-400" width={20} height={20} />
                    </button>
                </div>

            </div>
        </div>
    );
}
