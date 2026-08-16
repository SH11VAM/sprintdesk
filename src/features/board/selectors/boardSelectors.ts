import { Task, TaskStatus, BoardFilterState, TaskPriority } from '../types';

export const COLUMNS: { id: TaskStatus; title: string; color: string; description: string }[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: 'border-t-slate-400 dark:border-t-slate-500',
    description: 'Upcoming tasks queued for refinement or future execution',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'border-t-blue-500 dark:border-t-blue-400',
    description: 'Tasks actively being developed by the engineering team',
  },
  {
    id: 'review',
    title: 'In Review',
    color: 'border-t-amber-500 dark:border-t-amber-400',
    description: 'Pull requests, code reviews, and QA verification',
  },
  {
    id: 'done',
    title: 'Done',
    color: 'border-t-emerald-500 dark:border-t-emerald-400',
    description: 'Verified and delivered tasks meeting definition of done',
  },
];

export function selectFilteredTasks(tasks: Task[], filters: BoardFilterState): Task[] {
  return tasks.filter((task) => {
    // Search filter (title, description, tags, assignee)
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchDesc = task.description.toLowerCase().includes(query);
      const matchAssignee = task.assignee.toLowerCase().includes(query);
      const matchTags = task.tags?.some((t) => t.toLowerCase().includes(query));
      if (!matchTitle && !matchDesc && !matchAssignee && !matchTags) {
        return false;
      }
    }

    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // Assignee filter
    if (filters.assignee !== 'all' && task.assignee !== filters.assignee) {
      return false;
    }

    return true;
  });
}

export function selectTasksByStatus(
  tasks: Task[],
  status: TaskStatus,
  filters?: BoardFilterState
): Task[] {
  const list = filters ? selectFilteredTasks(tasks, filters) : tasks;
  return list
    .filter((task) => task.status === status)
    .sort((a, b) => a.order - b.order);
}

export function selectTaskCountByStatus(tasks: Task[]): Record<TaskStatus | 'total', number> {
  const counts: Record<TaskStatus | 'total', number> = {
    backlog: 0,
    'in-progress': 0,
    review: 0,
    done: 0,
    total: tasks.length,
  };

  tasks.forEach((task) => {
    if (counts[task.status] !== undefined) {
      counts[task.status]++;
    }
  });

  return counts;
}

export function selectCompletedTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status === 'done');
}

export function selectTasksByPriority(tasks: Task[]): Record<TaskPriority, Task[]> {
  const groups: Record<TaskPriority, Task[]> = {
    high: [],
    medium: [],
    low: [],
  };

  tasks.forEach((t) => {
    if (groups[t.priority]) {
      groups[t.priority].push(t);
    }
  });

  return groups;
}

export function selectUniqueAssignees(tasks: Task[]): string[] {
  const names = new Set<string>();
  tasks.forEach((t) => {
    if (t.assignee) names.add(t.assignee);
  });
  return Array.from(names).sort();
}

export function selectTaskById(tasks: Task[], id: number | null): Task | null {
  if (id === null) return null;
  return tasks.find((t) => t.id === id) || null;
}

export function selectSprintProgress(tasks: Task[]) {
  if (tasks.length === 0) return { percentage: 0, completed: 0, total: 0, overdue: 0 };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'done').length;
  const percentage = Math.round((completed / total) * 100);

  const now = new Date();
  const overdue = tasks.filter((t) => {
    if (t.status === 'done' || !t.dueDate) return false;
    const due = new Date(t.dueDate);
    return due.getTime() < now.getTime();
  }).length;

  return {
    percentage,
    completed,
    total,
    overdue,
  };
}
