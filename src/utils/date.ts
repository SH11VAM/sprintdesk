/**
 * Formats an ISO date string or timestamp into a human-readable date.
 * Example: "Feb 15, 2025" or relative "2h ago"
 */
export function formatDate(dateString: string | number | Date): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(dateString: string | number | Date): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(dateString: string | number | Date): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date);
}

export function getDaysRemaining(dueDateString: string): { days: number; isOverdue: boolean; label: string } {
  if (!dueDateString) return { days: 0, isOverdue: false, label: 'No date' };
  const due = new Date(dueDateString);
  if (isNaN(due.getTime())) return { days: 0, isOverdue: false, label: 'Invalid date' };

  const now = new Date();
  // Set to start of day for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diffTime = dueDateOnly.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { days: Math.abs(diffDays), isOverdue: true, label: `${Math.abs(diffDays)}d overdue` };
  } else if (diffDays === 0) {
    return { days: 0, isOverdue: false, label: 'Due today' };
  } else if (diffDays === 1) {
    return { days: 1, isOverdue: false, label: 'Due tomorrow' };
  } else {
    return { days: diffDays, isOverdue: false, label: `${diffDays}d left` };
  }
}
