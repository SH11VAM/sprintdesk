import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskPriority } from '../types';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { getDaysRemaining } from '@/utils/date';
import { MessageSquare, Calendar, GripVertical, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  isOverlay?: boolean;
}

const priorityBadgeMap: Record<TaskPriority, { variant: BadgeVariant; label: string }> = {
  high: { variant: 'danger', label: 'High' },
  medium: { variant: 'warning', label: 'Medium' },
  low: { variant: 'neutral', label: 'Low' },
};

export const TaskCard: React.FC<TaskCardProps> = React.memo(({ task, onClick, isOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityInfo = priorityBadgeMap[task.priority] || priorityBadgeMap.medium;
  const dueInfo = getDaysRemaining(task.dueDate);

  const handleClick = () => {
    // Only open details if user clicked the card body rather than dragging
    if (!isDragging && onClick) {
      onClick(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      className={cn(
        'group relative flex flex-col gap-3 p-4 rounded-xl border transition-all duration-150 text-left select-none',
        'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 shadow-soft-sm hover:shadow-soft hover:border-surface-300 dark:hover:border-surface-700',
        isDragging && 'opacity-30 border-dashed border-brand-500 scale-[0.98]',
        isOverlay && 'shadow-soft-xl border-brand-500 ring-2 ring-brand-500/20 rotate-1 cursor-grabbing bg-white dark:bg-surface-900',
        !isOverlay && 'cursor-pointer'
      )}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${task.title}. Priority: ${task.priority}. Assignee: ${task.assignee}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(task);
        }
      }}
    >
      {/* Top Header: Priority & Drag Handle */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Badge variant={priorityInfo.variant} size="sm" dot>
            {priorityInfo.label}
          </Badge>
          {task.tags && task.tags.length > 0 && (
            <span className="text-[10px] font-medium text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">
              {task.tags[0]}
            </span>
          )}
        </div>

        {/* Drag handle button with explicit ARIA */}
        <button
          type="button"
          aria-label="Drag task"
          className="p-1 text-surface-400 opacity-40 group-hover:opacity-100 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 rounded transition-opacity cursor-grab active:cursor-grabbing focus-ring"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 line-clamp-2 leading-snug">
        {task.title}
      </h4>

      {/* Task Description Snippet */}
      {task.description && (
        <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Bottom Metadata: Assignee, Due Date & Comment Count */}
      <div className="flex items-center justify-between pt-2 border-t border-surface-100 dark:border-surface-800/80 text-xs">
        {/* Assignee */}
        <div className="flex items-center gap-2 min-w-0 pr-2">
          {task.assigneeAvatar ? (
            <img
              src={task.assigneeAvatar}
              alt={task.assignee}
              width="20"
              height="20"
              decoding="async"
              className="w-5 h-5 rounded-full object-cover ring-1 ring-surface-200 dark:ring-surface-700 shrink-0"
              loading="lazy"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 font-bold text-[10px] flex items-center justify-center shrink-0">
              {task.assignee ? task.assignee.charAt(0) : '?'}
            </div>
          )}
          <span className="truncate text-xs font-medium text-surface-600 dark:text-surface-400">
            {task.assignee.split(' ')[0]}
          </span>
        </div>

        {/* Date & Comments */}
        <div className="flex items-center gap-2.5 shrink-0 text-surface-500 dark:text-surface-400">
          {task.dueDate && (
            <span
              className={cn(
                'flex items-center gap-1 text-[11px] font-medium',
                dueInfo.isOverdue
                  ? 'text-rose-600 dark:text-rose-400 font-semibold'
                  : 'text-surface-500 dark:text-surface-400'
              )}
              title={`Due: ${task.dueDate} (${dueInfo.label})`}
            >
              {dueInfo.isOverdue ? (
                <Clock className="w-3 h-3 text-rose-500" aria-hidden="true" />
              ) : (
                <Calendar className="w-3 h-3 text-surface-400" aria-hidden="true" />
              )}
              {dueInfo.label}
            </span>
          )}

          {task.comments && task.comments.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-surface-500 dark:text-surface-400">
              <MessageSquare className="w-3 h-3" aria-hidden="true" />
              {task.comments.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';
