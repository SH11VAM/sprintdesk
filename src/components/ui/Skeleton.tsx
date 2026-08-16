import React from 'react';
import { cn } from '@/utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular' | 'card' | 'chart' | 'table';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  count = 1,
  className,
  ...props
}) => {
  const baseClass = 'animate-pulse bg-surface-200 dark:bg-surface-800 rounded-md';

  if (variant === 'text') {
    return (
      <div className="space-y-2 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClass, 'h-4 w-full', i === count - 1 && count > 1 ? 'w-3/4' : '', className)}
            {...props}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circular') {
    return <div className={cn(baseClass, 'rounded-full w-10 h-10 shrink-0', className)} {...props} />;
  }

  if (variant === 'card') {
    return (
      <div className={cn('p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 space-y-3', className)}>
        <div className="flex items-center justify-between">
          <div className={cn(baseClass, 'h-5 w-20 rounded-full')} />
          <div className={cn(baseClass, 'h-4 w-12')} />
        </div>
        <div className={cn(baseClass, 'h-5 w-3/4')} />
        <div className={cn(baseClass, 'h-4 w-full')} />
        <div className="flex items-center justify-between pt-2">
          <div className={cn(baseClass, 'h-6 w-6 rounded-full')} />
          <div className={cn(baseClass, 'h-4 w-16')} />
        </div>
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={cn('p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 flex flex-col justify-between h-72', className)}>
        <div className="flex justify-between items-center mb-4">
          <div className={cn(baseClass, 'h-5 w-36')} />
          <div className={cn(baseClass, 'h-4 w-20')} />
        </div>
        <div className="flex items-end gap-3 h-44 px-4">
          <div className={cn(baseClass, 'h-24 flex-1 rounded-t-lg')} />
          <div className={cn(baseClass, 'h-36 flex-1 rounded-t-lg')} />
          <div className={cn(baseClass, 'h-16 flex-1 rounded-t-lg')} />
          <div className={cn(baseClass, 'h-40 flex-1 rounded-t-lg')} />
          <div className={cn(baseClass, 'h-28 flex-1 rounded-t-lg')} />
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('space-y-3 w-full', className)}>
        <div className={cn(baseClass, 'h-10 w-full rounded-lg')} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={cn(baseClass, 'h-12 w-full rounded-lg opacity-80')} />
        ))}
      </div>
    );
  }

  return <div className={cn(baseClass, 'h-6 w-full', className)} {...props} />;
};
