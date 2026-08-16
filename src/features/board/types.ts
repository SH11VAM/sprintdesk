export type TaskStatus = 'backlog' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeAvatar?: string;
  dueDate: string;
  order: number;
  tags?: string[];
  comments: Comment[];
}

export interface BoardFilterState {
  search: string;
  priority: TaskPriority | 'all';
  assignee: string | 'all';
}

export interface ColumnDefinition {
  id: TaskStatus;
  title: string;
  color: string;
  description: string;
}

export interface RawJsonPlaceholderTodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface RawJsonPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}
