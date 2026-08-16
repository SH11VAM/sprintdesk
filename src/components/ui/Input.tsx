import React, { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider"
          >
            {label}
            {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-surface-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'block w-full rounded-lg border text-sm transition-all duration-150 bg-white dark:bg-surface-900',
              'text-surface-900 dark:text-surface-100 placeholder:text-surface-400 dark:placeholder:text-surface-500',
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
              'disabled:bg-surface-100 dark:disabled:bg-surface-800 disabled:text-surface-500 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightIcon || error ? 'pr-10' : 'pr-3.5',
              'py-2',
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 text-rose-900 dark:text-rose-200'
                : 'border-surface-300 dark:border-surface-700',
              className
            )}
            {...props}
          />
          {error ? (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-rose-500">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
            </div>
          ) : (
            rightIcon && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-surface-400">
                {rightIcon}
              </div>
            )
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1 font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-xs text-surface-500 dark:text-surface-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
