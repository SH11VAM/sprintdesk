import { useEffect, useRef } from 'react';
import { notificationApi } from '../api/notificationApi';
import { useNotificationStore } from '../store/notificationStore';
import { useToast } from '@/hooks/useToast';
import { useAuthStore } from '@/features/auth/store/authStore';

export function useNotificationPolling(intervalMs: number = 30000) {
  const { isAuthenticated } = useAuthStore();
  const { addNotification, notifications } = useNotificationStore();
  const { info } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const knownIdsRef = useRef<Set<string>>(new Set());

  // Initialize known IDs
  useEffect(() => {
    notifications.forEach((n) => knownIdsRef.current.add(String(n.id)));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const poll = async () => {
      // Check if page is hidden
      if (document.visibilityState !== 'visible') {
        return;
      }

      try {
        const posts = await notificationApi.fetchLatestPosts();
        const state = useNotificationStore.getState();

        posts.forEach((post) => {
          const strId = `post-${post.id}`;
          if (!knownIdsRef.current.has(strId)) {
            knownIdsRef.current.add(strId);

            const title =
              post.title.charAt(0).toUpperCase() + post.title.slice(1, 40) + '...';
            const message = post.body.slice(0, 80) + '...';

            // Add to store
            addNotification({
              id: strId,
              title: `Sprint Update: ${title}`,
              message,
              read: false,
              type: 'system',
            });

            // If popover is closed, show a toast notification!
            if (!state.isPopoverOpen) {
              info(`New Sprint Notification`, title);
            }
          }
        });
      } catch (err) {
        console.warn('[NotificationPolling] Error during polling:', err);
      }
    };

    // Initial poll
    poll();

    // Set interval
    timerRef.current = setInterval(poll, intervalMs);

    // Smart Visibility API Listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Tab became active: immediately poll and ensure timer is running
        poll();
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(poll, intervalMs);
      } else {
        // Tab became hidden: stop background timer to save resources
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, intervalMs, addNotification, info]);
}
