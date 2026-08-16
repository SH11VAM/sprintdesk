import React from 'react';
import { cn } from '@/utils/cn';
import { Button, ButtonProps } from './Button';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps['variant'];
    icon?: React.ReactNode;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-surface-300 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-900/30',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-400 dark:text-surface-500 mb-3 shadow-inner">
        {icon || <Inbox className="w-6 h-6" aria-hidden="true" />}
      </div>
      <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-surface-500 dark:text-surface-400 max-w-xs mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <Button
          variant={action.variant || 'primary'}
          size="sm"
          onClick={action.onClick}
          leftIcon={action.icon}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
