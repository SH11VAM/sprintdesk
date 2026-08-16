import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { Plus, Layers } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  color: string;
  description?: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onQuickAddTask: (status: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  tasks,
  onTaskClick,
  onQuickAddTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      status: id,
    },
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col flex-1 min-w-[280px] max-w-full sm:max-w-[340px] rounded-2xl bg-surface-100/70 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-800 transition-colors duration-150',
        isOver && 'ring-2 ring-brand-500/40 bg-brand-50/20 dark:bg-brand-950/20'
      )}
    >
      {/* Column Header */}
      <div className={cn('p-4 border-b border-surface-200/80 dark:border-surface-800/80 border-t-4 rounded-t-2xl', color)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100 tracking-tight">
              {title}
            </h3>
            <span
              className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300"
              aria-label={`${tasks.length} tasks in ${title}`}
            >
              {tasks.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onQuickAddTask(id)}
            aria-label={`Add new task to ${title}`}
            className="p-1 rounded-lg text-surface-500 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-200/70 dark:hover:bg-surface-800 transition-colors focus-ring"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Column Body / Cards list */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-230px)] min-h-[160px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-surface-300 dark:border-surface-800 rounded-xl">
            <Layers className="w-5 h-5 text-surface-400 dark:text-surface-600 mb-1.5" aria-hidden="true" />
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400">No tasks in {title}</p>
            <button
              type="button"
              onClick={() => onQuickAddTask(id)}
              className="mt-2 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" aria-hidden="true" /> Create one
            </button>
          </div>
        )}
      </div>

      {/* Column Footer Quick Add */}
      <div className="p-3 pt-0">
        <button
          type="button"
          onClick={() => onQuickAddTask(id)}
          className="w-full py-2 px-3 text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-200/60 dark:hover:bg-surface-800/60 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-dashed border-surface-300/80 dark:border-surface-700/80 focus-ring"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add task
        </button>
      </div>
    </div>
  );
};
