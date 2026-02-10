'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Integrate actual auth logic here
        console.log("Login submitted");
        onClose();
        // router.refresh(); // Optional: Refresh to update auth state
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Welcome Back"
            className="max-w-md"
        >
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="text-center space-y-2 mb-8">
                    <h3 className="text-2xl font-serif-display font-bold text-gray-800">
                        Cafe South Central
                    </h3>
                    <p className="text-gray-500">
                        Sign in to access your orders and rewards
                    </p>
                </div>

                <div className="space-y-4">
                    <Input
                        label="Email"
                        placeholder="you@example.com"
                        type="email"
                        leftIcon={<Mail className="w-5 h-5" />}
                        required
                    />
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        type="password"
                        leftIcon={<Lock className="w-5 h-5" />}
                        required
                    />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                        <input type="checkbox" className="rounded border-gray-300 text-palm-green-dark focus:ring-palm-green-light" />
                        Remember me
                    </label>
                    <button type="button" className="text-palm-green-dark hover:underline font-medium">
                        Forgot password?
                    </button>
                </div>

                <Button type="submit" className="w-full" size="large">
                    Sign In
                </Button>

                <div className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <Link
                        href="/register"
                        className="text-palm-green-dark font-semibold hover:underline"
                        onClick={onClose}
                    >
                        Create Account
                    </Link>
                </div>
            </form>
        </Modal>
    );
};
