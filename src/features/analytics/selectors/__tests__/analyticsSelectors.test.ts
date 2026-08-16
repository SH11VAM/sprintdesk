import { describe, it, expect } from 'vitest';
import { analyticsSelectors } from '../analyticsSelectors';
import { Task } from '@/features/board/types';

const mockTasks: Task[] = [
  { id: 1, title: 'T1', description: '', status: 'backlog', priority: 'high', assignee: 'Alex', dueDate: '2025-03-01', order: 0, comments: [] },
  { id: 2, title: 'T2', description: '', status: 'in-progress', priority: 'medium', assignee: 'Alex', dueDate: '2025-03-02', order: 1, comments: [] },
  { id: 3, title: 'T3', description: '', status: 'review', priority: 'low', assignee: 'Emily', dueDate: '2025-03-03', order: 2, comments: [] },
  { id: 4, title: 'T4', description: '', status: 'done', priority: 'high', assignee: 'Michael', dueDate: '2025-03-04', order: 3, comments: [] },
];

describe('analyticsSelectors', () => {
  it('correctly calculates task status distribution', () => {
    const dist = analyticsSelectors.getTaskStatusDistribution(mockTasks);
    expect(dist).toHaveLength(4);

    const backlog = dist.find((d) => d.status === 'backlog');
    const done = dist.find((d) => d.status === 'done');

    expect(backlog?.value).toBe(1);
    expect(done?.value).toBe(1);
  });

  it('correctly breaks down priorities by column', () => {
    const breakdown = analyticsSelectors.getPriorityBreakdown(mockTasks);
    expect(breakdown).toHaveLength(4);

    const backlogCol = breakdown.find((b) => b.column === 'Backlog');
    expect(backlogCol?.high).toBe(1);
    expect(backlogCol?.medium).toBe(0);
    expect(backlogCol?.low).toBe(0);
  });

  it('computes summary metrics including completion rate', () => {
    const summary = analyticsSelectors.getSummaryMetrics(mockTasks);
    expect(summary.totalTasks).toBe(4);
    expect(summary.completedTasks).toBe(1);
    expect(summary.completionRate).toBe(25);
    expect(summary.highPriorityCount).toBe(1); // 1 open high priority (T1) since T4 is done
  });
});
