export interface NotificationItem {
  id: string | number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type?: 'task_assigned' | 'task_moved' | 'comment_added' | 'system' | 'mention';
}

export interface RawJsonPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}
