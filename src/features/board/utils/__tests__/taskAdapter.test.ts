import { describe, it, expect } from 'vitest';
import { adaptJsonPlaceholderTasks } from '../taskAdapter';
import { RawJsonPlaceholderTodo } from '../../types';

describe('adaptJsonPlaceholderTasks', () => {
  it('maps JSONPlaceholder todos to SprintDesk tasks with 4 columns and priorities', () => {
    const rawTodos: RawJsonPlaceholderTodo[] = Array.from({ length: 30 }, (_, i) => ({
      userId: 1,
      id: i + 1,
      title: `sample todo title ${i + 1}`,
      completed: i > 20,
    }));

    const adapted = adaptJsonPlaceholderTasks(rawTodos);

    expect(adapted).toHaveLength(30);
    expect(adapted[0].title).toBe('Sample todo title 1');
    expect(adapted[0].status).toBe('backlog');
    expect(adapted[0].priority).toBe('high');
    expect(adapted[0].assignee).toBeTruthy();
    expect(adapted[0].dueDate).toBeTruthy();

    // Verify 4 statuses are present across the 30 tasks
    const statuses = new Set(adapted.map((t) => t.status));
    expect(statuses.has('backlog')).toBe(true);
    expect(statuses.has('in-progress')).toBe(true);
    expect(statuses.has('review')).toBe(true);
    expect(statuses.has('done')).toBe(true);
  });
});
