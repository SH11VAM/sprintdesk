import { describe, it, expect, beforeEach } from 'vitest';
import { useBoardStore } from '../boardStore';
import { Task } from '../../types';

const mockInitialTasks: Task[] = [
  {
    id: 1,
    title: 'Task One',
    description: 'First task description',
    status: 'backlog',
    priority: 'high',
    assignee: 'Emily Smith',
    dueDate: '2025-03-01',
    order: 0,
    comments: [],
  },
  {
    id: 2,
    title: 'Task Two',
    description: 'Second task description',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Michael Williams',
    dueDate: '2025-03-02',
    order: 0,
    comments: [],
  },
];

describe('useBoardStore', () => {
  beforeEach(() => {
    useBoardStore.getState().resetBoardToInitial(mockInitialTasks);
  });

  it('adds a new task with incremented ID and appropriate order', () => {
    const newTask = useBoardStore.getState().addTask({
      title: 'New Feature Task',
      description: 'Feature description',
      status: 'backlog',
      priority: 'high',
      assignee: 'Alex Rivera',
      dueDate: '2025-03-05',
    });

    expect(newTask.id).toBe(3);
    expect(newTask.title).toBe('New Feature Task');

    const tasks = useBoardStore.getState().tasks;
    expect(tasks).toHaveLength(3);
    expect(tasks[0].id).toBe(3);
  });

  it('moves task between columns and saves previous state for undo', () => {
    // Task 1 is currently in backlog
    expect(useBoardStore.getState().tasks.find((t) => t.id === 1)?.status).toBe('backlog');

    // Move Task 1 to in-progress
    useBoardStore.getState().moveTask(1, 'in-progress');

    const updatedTask = useBoardStore.getState().tasks.find((t) => t.id === 1);
    expect(updatedTask?.status).toBe('in-progress');

    // Verify undo state was captured
    expect(useBoardStore.getState().previousTasks).not.toBeNull();

    // Undo move
    const undone = useBoardStore.getState().undoLastMove();
    expect(undone).toBe(true);

    const revertedTask = useBoardStore.getState().tasks.find((t) => t.id === 1);
    expect(revertedTask?.status).toBe('backlog');
  });

  it('reorders tasks within the same column', () => {
    // Add two more tasks in backlog
    useBoardStore.getState().addTask({
      title: 'Task B2',
      description: 'Desc',
      status: 'backlog',
      priority: 'low',
      assignee: 'David Kim',
      dueDate: '2025-03-04',
    });

    const backlogTasks = useBoardStore
      .getState()
      .tasks.filter((t) => t.status === 'backlog')
      .sort((a, b) => a.order - b.order);

    expect(backlogTasks.length).toBeGreaterThanOrEqual(2);

    const firstId = backlogTasks[0].id;
    const secondId = backlogTasks[1].id;

    useBoardStore.getState().reorderTaskInColumn(firstId, 0, 1);

    const reorderedBacklog = useBoardStore
      .getState()
      .tasks.filter((t) => t.status === 'backlog')
      .sort((a, b) => a.order - b.order);

    expect(reorderedBacklog[0].id).toBe(secondId);
    expect(reorderedBacklog[1].id).toBe(firstId);
  });

  it('deletes a task by ID', () => {
    expect(useBoardStore.getState().tasks).toHaveLength(2);

    useBoardStore.getState().deleteTask(1);

    const tasks = useBoardStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks.find((t) => t.id === 1)).toBeUndefined();
  });

  it('adds comments to a specific task', () => {
    useBoardStore.getState().addComment(1, {
      author: 'Sarah Connor',
      content: 'LGTM!',
    });

    const task = useBoardStore.getState().tasks.find((t) => t.id === 1);
    expect(task?.comments).toHaveLength(1);
    expect(task?.comments[0].author).toBe('Sarah Connor');
    expect(task?.comments[0].content).toBe('LGTM!');
  });
});
