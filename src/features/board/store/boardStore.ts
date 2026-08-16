import { create } from 'zustand';
import { Task, TaskStatus, BoardFilterState, Comment } from '../types';
import { storage } from '@/services/storage';

const BOARD_STORAGE_KEY = 'sprintdesk_board_tasks';

interface BoardState {
  tasks: Task[];
  previousTasks: Task[] | null;
  filters: BoardFilterState;
  selectedTaskId: number | null;
  isInitialized: boolean;

  // Actions
  initializeTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'order' | 'comments'>) => Task;
  updateTask: (id: number, updates: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: number) => void;
  moveTask: (taskId: number, targetStatus: TaskStatus, targetIndex?: number) => void;
  reorderTaskInColumn: (taskId: number, sourceIndex: number, destinationIndex: number) => void;
  updateTaskStatus: (taskId: number, status: TaskStatus) => void;
  addComment: (taskId: number, commentData: { author: string; authorAvatar?: string; content: string }) => void;
  undoLastMove: () => boolean;
  setFilter: (filterUpdates: Partial<BoardFilterState>) => void;
  clearFilters: () => void;
  setSelectedTaskId: (id: number | null) => void;
  resetBoardToInitial: (tasks: Task[]) => void;
}

const defaultFilters: BoardFilterState = {
  search: '',
  priority: 'all',
  assignee: 'all',
};

// Safe initial load from storage
const savedTasks = storage.get<Task[] | null>(BOARD_STORAGE_KEY, null);

export const useBoardStore = create<BoardState>((set, get) => ({
  tasks: savedTasks && Array.isArray(savedTasks) && savedTasks.length > 0 ? savedTasks : [],
  previousTasks: null,
  filters: defaultFilters,
  selectedTaskId: null,
  isInitialized: Boolean(savedTasks && savedTasks.length > 0),

  initializeTasks: (tasks: Task[]) => {
    // If already initialized with saved tasks from localStorage, don't overwrite unless empty
    if (get().tasks.length > 0 && get().isInitialized) {
      return;
    }
    storage.set(BOARD_STORAGE_KEY, tasks);
    set({ tasks, isInitialized: true });
  },

  resetBoardToInitial: (tasks: Task[]) => {
    storage.set(BOARD_STORAGE_KEY, tasks);
    set({ tasks, previousTasks: null, isInitialized: true });
  },

  addTask: (taskData) => {
    const state = get();
    const newId = state.tasks.length > 0 ? Math.max(...state.tasks.map((t) => t.id)) + 1 : 1;
    
    // Find next order in target status
    const statusTasks = state.tasks.filter((t) => t.status === taskData.status);
    const maxOrder = statusTasks.length > 0 ? Math.max(...statusTasks.map((t) => t.order)) : -1;

    const newTask: Task = {
      ...taskData,
      id: newId,
      order: maxOrder + 1,
      comments: [],
    };

    const nextTasks = [newTask, ...state.tasks];
    storage.set(BOARD_STORAGE_KEY, nextTasks);
    set({ tasks: nextTasks });

    return newTask;
  },

  updateTask: (id, updates) => {
    const state = get();
    const nextTasks = state.tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, ...updates };
    });

    storage.set(BOARD_STORAGE_KEY, nextTasks);
    set({ tasks: nextTasks });
  },

  deleteTask: (id) => {
    const state = get();
    const nextTasks = state.tasks.filter((task) => task.id !== id);
    const nextSelected = state.selectedTaskId === id ? null : state.selectedTaskId;

    storage.set(BOARD_STORAGE_KEY, nextTasks);
    set({ tasks: nextTasks, selectedTaskId: nextSelected });
  },

  moveTask: (taskId, targetStatus, targetIndex) => {
    const state = get();
    const currentTask = state.tasks.find((t) => t.id === taskId);
    if (!currentTask) return;

    // Save previous state for undo capability
    const previousSnapshot = JSON.parse(JSON.stringify(state.tasks));

    // If status didn't change and no targetIndex specified, return
    if (currentTask.status === targetStatus && targetIndex === undefined) return;

    const otherTasks = state.tasks.filter((t) => t.id !== taskId);
    const targetStatusTasks = otherTasks
      .filter((t) => t.status === targetStatus)
      .sort((a, b) => a.order - b.order);

    const updatedTask: Task = {
      ...currentTask,
      status: targetStatus,
    };

    let newTargetList: Task[];
    if (targetIndex !== undefined && targetIndex >= 0) {
      newTargetList = [
        ...targetStatusTasks.slice(0, targetIndex),
        updatedTask,
        ...targetStatusTasks.slice(targetIndex),
      ];
    } else {
      newTargetList = [...targetStatusTasks, updatedTask];
    }

    // Reassign orders cleanly in target column
    newTargetList = newTargetList.map((t, idx) => ({ ...t, order: idx }));

    // Reconstruct full list preserving tasks from other columns
    const untouchedTasks = otherTasks.filter((t) => t.status !== targetStatus);
    const nextTasks = [...untouchedTasks, ...newTargetList];

    storage.set(BOARD_STORAGE_KEY, nextTasks);
    set({ tasks: nextTasks, previousTasks: previousSnapshot });
  },

  reorderTaskInColumn: (taskId, sourceIndex, destinationIndex) => {
    const state = get();
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task || sourceIndex === destinationIndex) return;

    const previousSnapshot = JSON.parse(JSON.stringify(state.tasks));

    const columnTasks = state.tasks
      .filter((t) => t.status === task.status)
      .sort((a, b) => a.order - b.order);

    const [movedTask] = columnTasks.splice(sourceIndex, 1);
    columnTasks.splice(destinationIndex, 0, movedTask);

    const reorderedColumnTasks = columnTasks.map((t, idx) => ({ ...t, order: idx }));
    const otherTasks = state.tasks.filter((t) => t.status !== task.status);
    const nextTasks = [...otherTasks, ...reorderedColumnTasks];

    storage.set(BOARD_STORAGE_KEY, nextTasks);
    set({ tasks: nextTasks, previousTasks: previousSnapshot });
  },

  updateTaskStatus: (taskId, status) => {
    get().moveTask(taskId, status);
  },

  addComment: (taskId, commentData) => {
    const state = get();
    const newComment: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: commentData.author,
      authorAvatar: commentData.authorAvatar,
      content: commentData.content,
      createdAt: new Date().toISOString(),
    };

    const nextTasks = state.tasks.map((task) => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        comments: [newComment, ...(task.comments || [])],
      };
    });

    storage.set(BOARD_STORAGE_KEY, nextTasks);
    set({ tasks: nextTasks });
  },

  undoLastMove: () => {
    const state = get();
    if (!state.previousTasks) return false;

    const restoredTasks = state.previousTasks;
    storage.set(BOARD_STORAGE_KEY, restoredTasks);
    set({ tasks: restoredTasks, previousTasks: null });
    return true;
  },

  setFilter: (filterUpdates) => {
    set((state) => ({
      filters: { ...state.filters, ...filterUpdates },
    }));
  },

  clearFilters: () => {
    set({ filters: defaultFilters });
  },

  setSelectedTaskId: (id) => {
    set({ selectedTaskId: id });
  },
}));
