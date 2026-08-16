import { Task, TaskStatus, TaskPriority, RawJsonPlaceholderTodo, Comment } from '../types';

export const TEAM_MEMBERS = [
  { name: 'Emily Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { name: 'Michael Williams', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
  { name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face' },
  { name: 'Jessica Chen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face' },
];

const SAMPLE_TAGS = ['Frontend', 'Backend', 'Security', 'DevOps', 'UI/UX', 'Database', 'API', 'Bug', 'Feature'];

const SAMPLE_DESCRIPTIONS = [
  'Ensure comprehensive test coverage and implement end-to-end user validation flows across all target viewports.',
  'Optimize performance bottlenecks by memoizing selector computations and debouncing high-frequency event handlers.',
  'Implement accessible focus trapping and keyboard navigation listeners in accordance with WCAG 2.1 AA standards.',
  'Refactor API client interceptors to handle token expiration seamlessly with request queuing and automatic retry logic.',
  'Update database schema indexing to improve query throughput and reduce latency under concurrent load spikes.',
  'Design responsive Kanban column layouts with fluid drag-and-drop handles and real-time state persistence.',
];

/**
 * Maps raw JSONPlaceholder items to rich SprintDesk Task domain entities.
 */
export function adaptJsonPlaceholderTasks(rawTasks: RawJsonPlaceholderTodo[]): Task[] {
  const now = new Date();

  return rawTasks.slice(0, 30).map((raw, index) => {
    // Distribute across 4 columns:
    // 0-7: backlog, 8-15: in-progress, 16-21: review, 22-29: done
    let status: TaskStatus = 'backlog';
    if (index >= 8 && index < 16) {
      status = 'in-progress';
    } else if (index >= 16 && index < 22) {
      status = 'review';
    } else if (index >= 22) {
      status = 'done';
    }

    const priority: TaskPriority =
      index % 3 === 0 ? 'high' : index % 2 === 0 ? 'medium' : 'low';

    const member = TEAM_MEMBERS[index % TEAM_MEMBERS.length];

    // Compute due dates relative to now (-2 days to +8 days)
    const dueOffsetDays = ((index * 3) % 10) - 2;
    const dueDate = new Date(now.getTime() + dueOffsetDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const description =
      SAMPLE_DESCRIPTIONS[index % SAMPLE_DESCRIPTIONS.length];

    const comments: Comment[] = [];
    if (index % 2 === 0) {
      const commenter = TEAM_MEMBERS[(index + 1) % TEAM_MEMBERS.length];
      comments.push({
        id: `comment-${index}-1`,
        author: commenter.name,
        authorAvatar: commenter.avatar,
        content: 'Reviewed initial implementation. Code looks clean, ready for integration testing.',
        createdAt: new Date(now.getTime() - (index + 1) * 3600000).toISOString(),
      });
    }

    // Capitalize title
    const formattedTitle = raw.title.charAt(0).toUpperCase() + raw.title.slice(1);

    return {
      id: raw.id,
      title: formattedTitle,
      description,
      status,
      priority,
      assignee: member.name,
      assigneeAvatar: member.avatar,
      dueDate,
      order: index,
      tags: [SAMPLE_TAGS[index % SAMPLE_TAGS.length], SAMPLE_TAGS[(index + 3) % SAMPLE_TAGS.length]],
      comments,
    };
  });
}
