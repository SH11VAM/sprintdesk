import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl';
}

const maxWidthMap = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'xl',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        // Trap focus inside drawer
        if (e.key === 'Tab' && drawerRef.current) {
          const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        if (drawerRef.current) {
          const focusable = drawerRef.current.querySelector<HTMLElement>(
            'input:not([disabled]), button:not([disabled]), textarea:not([disabled])'
          );
          if (focusable) {
            focusable.focus();
          } else {
            drawerRef.current.focus();
          }
        }
      }, 50);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'drawer-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        aria-hidden="true"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 pointer-events-none">
        <div
          ref={drawerRef}
          tabIndex={-1}
          className={cn(
            'pointer-events-auto w-screen bg-white dark:bg-surface-900 shadow-2xl border-l border-surface-200 dark:border-surface-800 flex flex-col h-full animate-slide-in-right',
            maxWidthMap[maxWidth]
          )}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-surface-200 dark:border-surface-800 flex items-start justify-between bg-surface-50/50 dark:bg-surface-950/40 shrink-0">
            <div className="space-y-1 pr-4 flex-1">
              {title && (
                <h2
                  id="drawer-title"
                  className="text-lg font-bold text-surface-900 dark:text-surface-100 tracking-tight"
                >
                  {title}
                </h2>
              )}
              {subtitle && <div className="text-xs text-surface-500 dark:text-surface-400">{subtitle}</div>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="rounded-lg p-1.5 text-surface-400 hover:text-surface-700 hover:bg-surface-100 dark:hover:text-surface-200 dark:hover:bg-surface-800 transition-colors focus-ring shrink-0"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">{children}</div>

          {/* Optional Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-surface-200 dark:border-surface-800 bg-surface-50/70 dark:bg-surface-950/50 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
