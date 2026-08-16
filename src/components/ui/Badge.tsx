import React from 'react';
import { cn } from '@/utils/cn';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  default: {
    bg: 'bg-surface-100 dark:bg-surface-800 border-surface-300 dark:border-surface-700',
    text: 'text-surface-800 dark:text-surface-200',
    dot: 'bg-surface-500',
  },
  primary: {
    bg: 'bg-brand-50 dark:bg-brand-950/70 border-brand-300 dark:border-brand-800',
    text: 'text-brand-800 dark:text-brand-200',
    dot: 'bg-brand-600',
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800',
    text: 'text-emerald-800 dark:text-emerald-200',
    dot: 'bg-emerald-600',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800',
    text: 'text-amber-900 dark:text-amber-200',
    dot: 'bg-amber-600',
  },
  danger: {
    bg: 'bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800',
    text: 'text-rose-800 dark:text-rose-200',
    dot: 'bg-rose-600',
  },
  info: {
    bg: 'bg-sky-50 dark:bg-sky-950/70 border-sky-300 dark:border-sky-800',
    text: 'text-sky-800 dark:text-sky-200',
    dot: 'bg-sky-600',
  },
  neutral: {
    bg: 'bg-surface-200 dark:bg-surface-800 border-surface-300 dark:border-surface-700',
    text: 'text-surface-900 dark:text-surface-100',
    dot: 'bg-surface-600',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
  ...props
}) => {
  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold border rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1' : 'px-2.5 py-0.5 text-xs gap-1.5',
        styles.bg,
        styles.text,
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', styles.dot)} aria-hidden="true" />}
      {children}
    </span>
  );
};
