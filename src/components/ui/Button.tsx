import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm border border-transparent dark:bg-brand-500 dark:hover:bg-brand-600',
  secondary:
    'bg-surface-100 text-surface-900 hover:bg-surface-200 active:bg-surface-300 border border-surface-200 dark:bg-surface-800 dark:text-surface-100 dark:hover:bg-surface-700 dark:border-surface-700',
  outline:
    'bg-transparent text-surface-700 border border-surface-300 hover:bg-surface-50 hover:text-surface-900 active:bg-surface-100 dark:text-surface-300 dark:border-surface-700 dark:hover:bg-surface-800 dark:hover:text-surface-100',
  ghost:
    'bg-transparent text-surface-600 hover:bg-surface-100 hover:text-surface-900 active:bg-surface-200 border border-transparent dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm border border-transparent dark:bg-rose-600 dark:hover:bg-rose-700',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs rounded-md gap-1.5 font-medium',
  sm: 'h-8 px-3 text-xs sm:text-sm rounded-md gap-1.5 font-medium',
  md: 'h-9 px-4 text-sm rounded-lg gap-2 font-medium',
  lg: 'h-11 px-5 text-base rounded-lg gap-2.5 font-semibold',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-150 select-none cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-900',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
