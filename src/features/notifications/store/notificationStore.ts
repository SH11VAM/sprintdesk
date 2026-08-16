import { create } from 'zustand';
import { NotificationItem } from '../types';
import { storage } from '@/services/storage';

const NOTIFICATIONS_STORAGE_KEY = 'sprintdesk_notifications';

interface NotificationState {
  notifications: NotificationItem[];
  isPopoverOpen: boolean;

  // Actions
  addNotification: (item: Omit<NotificationItem, 'timestamp'>) => void;
  markAsRead: (id: string | number) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  setPopoverOpen: (isOpen: boolean) => void;
}

const initialSaved = storage.get<NotificationItem[]>(NOTIFICATIONS_STORAGE_KEY, []);

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: Array.isArray(initialSaved) ? initialSaved : [],
  isPopoverOpen: false,

  addNotification: (item) => {
    const state = get();
    // Check duplicate by id
    if (state.notifications.some((n) => String(n.id) === String(item.id))) {
      return;
    }

    const newItem: NotificationItem = {
      ...item,
      timestamp: new Date().toISOString(),
    };

    // Keep up to 30 notifications in history
    const nextNotifications = [newItem, ...state.notifications].slice(0, 30);
    storage.set(NOTIFICATIONS_STORAGE_KEY, nextNotifications);
    set({ notifications: nextNotifications });
  },

  markAsRead: (id) => {
    const state = get();
    const nextNotifications = state.notifications.map((n) => {
      if (String(n.id) === String(id)) {
        return { ...n, read: true };
      }
      return n;
    });

    storage.set(NOTIFICATIONS_STORAGE_KEY, nextNotifications);
    set({ notifications: nextNotifications });
  },

  markAllAsRead: () => {
    const state = get();
    const nextNotifications = state.notifications.map((n) => ({ ...n, read: true }));

    storage.set(NOTIFICATIONS_STORAGE_KEY, nextNotifications);
    set({ notifications: nextNotifications });
  },

  clearAll: () => {
    storage.set(NOTIFICATIONS_STORAGE_KEY, []);
    set({ notifications: [] });
  },

  setPopoverOpen: (isOpen) => {
    set({ isPopoverOpen: isOpen });
  },
}));

export function selectUnreadCount(notifications: NotificationItem[]): number {
  return notifications.filter((n) => !n.read).length;
}
