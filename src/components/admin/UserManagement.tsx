'use client';

import React from 'react';
import {
    Users,
    Search,
    UserCheck,
    Calendar
} from 'lucide-react';

interface User {
    id: string;
    name: string;
    phone: string;
    isMember: boolean;
    orderCount: number;
    subscription?: {
        creditsTotal: number;
        creditsUsed: number;
        endDate: string;
    };
    createdAt: string;
}

interface UserManagementProps {
    users: User[];
}

export default function UserManagement({ users }: UserManagementProps) {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-[#0e2a1a]">Customers & Members</h2>
                    <p className="text-sm text-[#0e2a1a]/60">View user details and subscription status</p>
                </div>

                <div className="flex gap-3 items-center">
                    <div className="bg-white border border-[#14b84b]/10 rounded-full px-4 py-2 shadow-sm flex items-center">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm ml-2 w-48 text-gray-700 placeholder-gray-400"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#14b84b]/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#f8fbf7] border-b border-[#14b84b]/5">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-[#0e2a1a]/60 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#0e2a1a]/60 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#0e2a1a]/60 uppercase tracking-wider">Orders</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#0e2a1a]/60 uppercase tracking-wider">Subscription</th>
                                <th className="px-6 py-4 text-xs font-bold text-[#0e2a1a]/60 uppercase tracking-wider">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-[#0e2a1a] text-white flex items-center justify-center font-bold text-sm">
                                                    {user.name.slice(0, 1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-[#0e2a1a]">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.isMember ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#dcfce7] text-[#166534]">
                                                    <UserCheck className="w-3 h-3" />
                                                    MEMBER
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                                                    Guest
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{user.orderCount}</div>
                                            <div className="text-xs text-gray-400">lifetime orders</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.isMember && user.subscription ? (
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-xs font-bold text-[#0e2a1a]">
                                                        {user.subscription.creditsTotal - user.subscription.creditsUsed} / {user.subscription.creditsTotal} Credits
                                                    </div>
                                                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#14b84b]"
                                                            style={{ width: `${((user.subscription.creditsTotal - user.subscription.creditsUsed) / user.subscription.creditsTotal) * 100}%` }}
                                                        />
                                                    </div>
                                                    <div className="text-[10px] text-gray-400">
                                                        Expires {new Date(user.subscription.endDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
