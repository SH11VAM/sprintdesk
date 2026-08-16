import React from 'react';
import { useToastStore, ToastType } from '@/hooks/useToast';
import { cn } from '@/utils/cn';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden="true" />,
  error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" aria-hidden="true" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />,
  info: <Info className="w-5 h-5 text-brand-500 shrink-0" aria-hidden="true" />,
};

const toastBorderColors: Record<ToastType, string> = {
  success: 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40',
  error: 'border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40',
  warning: 'border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40',
  info: 'border-brand-200 dark:border-brand-900/60 bg-brand-50/70 dark:bg-brand-950/40',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2 sm:p-0"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-200 animate-fade-in bg-white dark:bg-surface-900',
            toastBorderColors[t.type]
          )}
        >
          {toastIcons[t.type]}
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100">{t.title}</h4>
            {t.message && (
              <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5 leading-relaxed">
                {t.message}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeToast(t.id)}
            aria-label="Close notification"
            className="text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors p-1 rounded-md"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
};
