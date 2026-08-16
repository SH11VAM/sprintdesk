import React from 'react';
import { useBoardStore } from '../store/boardStore';
import { selectUniqueAssignees } from '../selectors/boardSelectors';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TaskPriority } from '../types';
import { Search, RotateCcw, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export const BoardFilters: React.FC = () => {
  const { tasks, filters, setFilter, clearFilters, previousTasks, undoLastMove } = useBoardStore();
  const { info } = useToast();
  const assignees = selectUniqueAssignees(tasks);

  const hasActiveFilters =
    filters.search.trim() !== '' || filters.priority !== 'all' || filters.assignee !== 'all';

  const handleUndo = () => {
    const success = undoLastMove();
    if (success) {
      info('Action Undone', 'Reverted your previous task move.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-sm">
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="w-full sm:max-w-xs">
          <Input
            id="board-search"
            placeholder="Filter by title, tag, or assignee..."
            value={filters.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            leftIcon={<Search className="w-4 h-4 text-surface-400" aria-hidden="true" />}
            className="py-1.5 text-xs"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              aria-label="Filter by priority"
              value={filters.priority}
              onChange={(e) => setFilter({ priority: e.target.value as TaskPriority | 'all' })}
              className="appearance-none text-xs font-medium rounded-lg border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-800 dark:text-surface-200 pl-3 pr-8 py-2 focus-ring cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="relative">
            <select
              aria-label="Filter by assignee"
              value={filters.assignee}
              onChange={(e) => setFilter({ assignee: e.target.value })}
              className="appearance-none text-xs font-medium rounded-lg border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-800 dark:text-surface-200 pl-3 pr-8 py-2 focus-ring cursor-pointer max-w-[160px] truncate"
            >
              <option value="all">All Assignees</option>
              {assignees.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="xs"
              onClick={clearFilters}
              leftIcon={<X className="w-3.5 h-3.5" aria-hidden="true" />}
              className="text-surface-500 hover:text-rose-600"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Undo Button */}
      {previousTasks && (
        <div className="flex items-center justify-end shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleUndo}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" aria-hidden="true" />}
            className="border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300"
          >
            Undo Last Move
          </Button>
        </div>
      )}
    </div>
  );
};
