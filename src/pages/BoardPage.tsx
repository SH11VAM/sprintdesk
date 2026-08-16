import React, { useState, useEffect } from 'react';
import { useBoardStore } from '@/features/board/store/boardStore';
import { taskApi } from '@/features/board/api/taskApi';
import { KanbanBoard } from '@/features/board/components/KanbanBoard';
import { BoardFilters } from '@/features/board/components/BoardFilters';
import { TaskDetailsDrawer } from '@/features/board/components/TaskDetailsDrawer';
import { CreateTaskModal } from '@/features/board/components/CreateTaskModal';
import { Task, TaskStatus } from '@/features/board/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export const BoardPage: React.FC = () => {
  const { tasks, isInitialized, initializeTasks, resetBoardToInitial } = useBoardStore();
  const { success } = useToast();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDefaultStatus, setCreateModalDefaultStatus] = useState<TaskStatus>('backlog');
  const [isLoadingInitial, setIsLoadingInitial] = useState(!isInitialized && tasks.length === 0);
  const [isResetting, setIsResetting] = useState(false);

  // Initialize initial 30 tasks from JSONPlaceholder if empty
  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (tasks.length === 0 && !isInitialized) {
        setIsLoadingInitial(true);
        try {
          const initialTasks = await taskApi.fetchInitialTasks();
          if (isMounted) {
            initializeTasks(initialTasks);
          }
        } catch (err) {
          console.error('Failed to load initial tasks:', err);
        } finally {
          if (isMounted) setIsLoadingInitial(false);
        }
      } else {
        setIsLoadingInitial(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [tasks.length, isInitialized, initializeTasks]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleQuickAddTask = (status: TaskStatus) => {
    setCreateModalDefaultStatus(status);
    setIsCreateModalOpen(true);
  };

  const handleResetBoard = async () => {
    setIsResetting(true);
    try {
      const freshTasks = await taskApi.fetchInitialTasks();
      resetBoardToInitial(freshTasks);
      success('Board Reset', 'Reset board back to initial 30 tasks from JSONPlaceholder.');
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoadingInitial) {
    return (
      <div className="space-y-6">
        <Skeleton variant="card" className="h-14" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton variant="card" count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Board Controls & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-surface-900 dark:text-surface-50 tracking-tight">
            Active Sprint 24 Board
          </h2>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            Drag cards between columns or reorder within a column to update sprint status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetBoard}
            isLoading={isResetting}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            title="Reset board to initial JSONPlaceholder tasks"
          >
            Reset Seed Data
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleQuickAddTask('backlog')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Task
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <BoardFilters />

      {/* Kanban Board with dnd-kit */}
      <KanbanBoard
        onTaskClick={handleTaskClick}
        onQuickAddTask={handleQuickAddTask}
      />

      {/* Task Details Slide-over Drawer */}
      <TaskDetailsDrawer
        taskId={selectedTask ? selectedTask.id : null}
        onClose={() => setSelectedTask(null)}
      />

      {/* Quick Add Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultStatus={createModalDefaultStatus}
      />
    </div>
  );
};

export default BoardPage;
