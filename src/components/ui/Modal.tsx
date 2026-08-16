import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        // Trap focus inside modal
        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
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

      // Focus first focusable element or modal container
      setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelector<HTMLElement>(
            'input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled])'
          );
          if (focusable) {
            focusable.focus();
          } else {
            modalRef.current.focus();
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-desc' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm transition-opacity duration-200"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative w-full rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-2xl transition-all transform animate-fade-in p-6',
          maxWidthMap[maxWidth]
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-100 dark:border-surface-800">
            <div>
              {title && (
                <h3
                  id="modal-title"
                  className="text-lg font-semibold text-surface-900 dark:text-surface-50 tracking-tight"
                >
                  {title}
                </h3>
              )}
              {description && (
                <p id="modal-desc" className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="rounded-lg p-1.5 text-surface-400 hover:text-surface-700 hover:bg-surface-100 dark:hover:text-surface-200 dark:hover:bg-surface-800 transition-colors focus-ring"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <div className="text-surface-700 dark:text-surface-300">{children}</div>
      </div>
    </div>,
    document.body
  );
};
