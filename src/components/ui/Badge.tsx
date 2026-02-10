import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'success' | 'warning' | 'error' | 'info' | 'fresh' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'neutral',
    className,
    children,
    ...props
}) => {
    const variants = {
        success: 'bg-success-light text-success border-success',
        warning: 'bg-warning-light text-warning border-warning',
        error: 'bg-error-light text-error border-error',
        info: 'bg-info-light text-info border-info',
        neutral: 'bg-gray-100 text-gray-600 border-gray-300',
        fresh: 'bg-white/95 backdrop-blur-md text-palm-green-dark border-palm-green-light shadow-sm font-semibold tracking-wide',
    };

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold leading-none border',
                variants[variant],
                className
            )}
            {...props}
        >
            {variant === 'fresh' && (
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            )}
            {children}
        </div>
    );
};
