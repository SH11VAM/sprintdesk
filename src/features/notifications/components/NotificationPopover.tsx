import React, { useRef, useEffect } from 'react';
import { useNotificationStore, selectUnreadCount } from '../store/notificationStore';
import { formatRelativeTime } from '@/utils/date';
import { Bell, Trash2, MailOpen } from 'lucide-react';
import { cn } from '@/utils/cn';

export const NotificationPopover: React.FC = () => {
  const {
    notifications,
    isPopoverOpen,
    setPopoverOpen,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotificationStore();

  const popoverRef = useRef<HTMLDivElement>(null);
  const unreadCount = selectUnreadCount(notifications);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen, setPopoverOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setPopoverOpen(!isPopoverOpen)}
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={isPopoverOpen}
        className={cn(
          'relative p-2 rounded-xl text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-800 transition-colors focus-ring',
          isPopoverOpen && 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100'
        )}
      >
        <Bell className="w-5 h-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-brand-600 rounded-full ring-2 ring-white dark:ring-surface-900 animate-pulse"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isPopoverOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-xl z-50 overflow-hidden animate-fade-in text-left">
          {/* Header */}
          <div className="p-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between bg-surface-50/50 dark:bg-surface-950/40">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead()}
                  className="text-[11px] font-medium text-brand-600 dark:text-brand-400 hover:underline p-1 rounded"
                >
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => clearAll()}
                  title="Clear all"
                  aria-label="Clear all notifications"
                  className="p-1 text-surface-400 hover:text-rose-500 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-surface-100 dark:divide-surface-800/60">
            {notifications.length === 0 ? (
              <div className="py-10 text-center px-4">
                <MailOpen className="w-8 h-8 mx-auto text-surface-300 dark:text-surface-600 mb-2" aria-hidden="true" />
                <p className="text-xs font-semibold text-surface-700 dark:text-surface-300">No notifications yet</p>
                <p className="text-[11px] text-surface-400 mt-0.5">
                  You will receive real-time sprint updates here
                </p>
              </div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={cn(
                    'p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800/50',
                    !n.read && 'bg-brand-50/40 dark:bg-brand-950/20'
                  )}
                >
                  <div
                    className={cn(
                      'mt-0.5 w-2 h-2 rounded-full shrink-0',
                      !n.read ? 'bg-brand-500' : 'bg-transparent'
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-xs leading-snug', !n.read ? 'font-bold text-surface-900 dark:text-surface-100' : 'font-medium text-surface-700 dark:text-surface-300')}>
                      {n.title}
                    </p>
                    <p className="text-[11px] text-surface-500 dark:text-surface-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-surface-400 mt-1 block">
                      {formatRelativeTime(n.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
