import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" showCloseButton={!isLoading}>
      <div className="flex flex-col items-center text-center space-y-4 pt-2">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isDestructive
              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
          }`}
        >
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">{title}</h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed max-w-xs">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-3 w-full pt-4 border-t border-surface-100 dark:border-surface-800">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
