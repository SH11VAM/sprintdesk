import React, { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider"
          >
            {label}
            {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'block w-full appearance-none rounded-lg border text-sm transition-all duration-150 bg-white dark:bg-surface-900',
              'text-surface-900 dark:text-surface-100 placeholder:text-surface-400',
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
              'disabled:bg-surface-100 dark:disabled:bg-surface-800 disabled:text-surface-500 disabled:cursor-not-allowed',
              'pl-3.5 pr-10 py-2 cursor-pointer',
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                : 'border-surface-300 dark:border-surface-700',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-surface-400">
            {error ? (
              <AlertCircle className="w-4 h-4 text-rose-500" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </div>
        </div>
        {error && (
          <p id={errorId} className="text-xs text-rose-600 dark:text-rose-400 font-medium">
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

Select.displayName = 'Select';
