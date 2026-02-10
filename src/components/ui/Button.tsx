import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    loading = false,
    className,
    disabled,
    icon,
    children,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-palm-green-dark text-tropical-yellow hover:bg-[#014302] hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl focus:ring-palm-green-dark rounded-full',
        secondary: 'bg-tropical-yellow text-palm-green-dark hover:bg-[#E5B607] hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl focus:ring-tropical-yellow rounded-full',
        outline: 'bg-transparent border-2 border-palm-green-dark text-palm-green-dark hover:bg-palm-green-dark hover:text-white rounded-full',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 rounded-lg',
        danger: 'bg-error text-white hover:bg-red-600 shadow-md rounded-full',
    };

    const sizes = {
        small: 'px-6 py-2 text-sm min-h-[44px]',
        medium: 'px-10 py-4 text-base min-h-[56px]',
        large: 'px-14 py-5 text-lg min-h-[64px]',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : icon ? (
                <span className="mr-2">{icon}</span>
            ) : null}
            {children}
        </button>
    );
};
