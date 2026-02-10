import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: string;
    leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, helperText, error, leftIcon, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2 w-full">
                {label && (
                    <label className="text-sm font-semibold text-gray-700">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        className={cn(
                            "w-full bg-pure-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-700 transition-all duration-200",
                            "placeholder:text-gray-400 placeholder:font-normal",
                            "focus:outline-none focus:border-palm-green-light focus:ring-4 focus:ring-palm-green-dark/10",
                            "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
                            error && "border-error focus:border-error focus:ring-error/10",
                            leftIcon && "pl-12",
                            className
                        )}
                        {...props}
                    />
                </div>

                {helperText && !error && (
                    <span className="text-sm text-gray-500">{helperText}</span>
                )}

                {error && (
                    <span className="text-sm text-error font-medium">{error}</span>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
