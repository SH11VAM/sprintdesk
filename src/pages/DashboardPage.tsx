import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardStore } from '@/features/board/store/boardStore';
import { selectTaskCountByStatus, selectSprintProgress } from '@/features/board/selectors/boardSelectors';
import { taskApi } from '@/features/board/api/taskApi';
import { TaskDetailsDrawer } from '@/features/board/components/TaskDetailsDrawer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { getDaysRemaining } from '@/utils/date';
import {
  Kanban,
  BarChart3,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, isInitialized, initializeTasks } = useBoardStore();
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(!isInitialized && tasks.length === 0);

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

  const counts = selectTaskCountByStatus(tasks);
  const sprintProgress = selectSprintProgress(tasks);

  // High priority unresolved tasks
  const urgentTasks = tasks
    .filter((t) => t.priority === 'high' && t.status !== 'done')
    .slice(0, 5);

  if (isLoadingInitial) {
    return (
      <div className="space-y-6">
        <Skeleton variant="card" className="h-36" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton variant="card" count={4} />
        </div>
        <Skeleton variant="table" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Top Sprint Health Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white p-6 sm:p-8 shadow-soft-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                Active Iteration
              </span>
              <span className="text-xs text-brand-200">Sprint 24 (Day 7 of 10)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sprint Velocity & Progress
            </h2>
            <p className="text-xs sm:text-sm text-brand-100/90 leading-relaxed">
              {counts.done} of {counts.total} total deliverables completed. {counts['in-progress']} tasks currently under active development.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/board')}
              leftIcon={<Kanban className="w-4 h-4 text-brand-600" />}
              className="bg-white text-surface-900 hover:bg-brand-50 shadow-md border-0"
            >
              Open Sprint Board
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/analytics')}
              leftIcon={<BarChart3 className="w-4 h-4 text-white" />}
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              View Analytics
            </Button>
          </div>
        </div>

        {/* Progress bar inside Hero */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/15">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-100 mb-2">
            <span>Overall Completion Rate: {sprintProgress.percentage}%</span>
            <span>{counts.done} / {counts.total} Done</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden backdrop-blur-sm">
            <div
              className="bg-emerald-400 h-2.5 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${sprintProgress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-sm hover:shadow-soft transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider">
              Total Scope
            </span>
            <div className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-surface-50">
            {counts.total}
          </div>
          <p className="text-xs text-surface-500 mt-1">Sprint commitments</p>
        </div>

        {/* In Progress */}
        <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-sm hover:shadow-soft transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              In Progress
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {counts['in-progress']}
          </div>
          <p className="text-xs text-surface-500 mt-1">Actively being worked on</p>
        </div>

        {/* In Review */}
        <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-sm hover:shadow-soft transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              In Review
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {counts.review}
          </div>
          <p className="text-xs text-surface-500 mt-1">PRs & QA validation</p>
        </div>

        {/* Completed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-sm hover:shadow-soft transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Completed
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {counts.done}
          </div>
          <p className="text-xs text-surface-500 mt-1">Delivered to main</p>
        </div>
      </div>

      {/* Two Column Section: High Priority Tasks & Sprint Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* High Priority Open Items (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" aria-hidden="true" />
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">
                High-Priority Attention Items
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/board')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              View Board <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-surface-200 dark:divide-surface-800 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-soft-sm overflow-hidden">
            {urgentTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-surface-500">
                🎉 No high-priority blockers remaining in sprint!
              </div>
            ) : (
              urgentTasks.map((task) => {
                const dueInfo = getDaysRemaining(task.dueDate);
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-surface-50 dark:hover:bg-surface-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Badge variant="danger" size="sm">
                        High
                      </Badge>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-surface-500 mt-0.5">
                          <span>{task.assignee}</span>
                          <span>•</span>
                          <span className="capitalize">{task.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={cn(
                          'text-xs font-medium',
                          dueInfo.isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-surface-500'
                        )}
                      >
                        {dueInfo.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sprint Summary & Quick Insights */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" aria-hidden="true" />
            <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">
              Sprint Insights
            </h3>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-sm space-y-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-surface-500">Backlog Scope</div>
              <div className="text-sm font-bold text-surface-900 dark:text-surface-100">
                {counts.backlog} items awaiting refinement
              </div>
            </div>

            <div className="space-y-1 pt-3 border-t border-surface-100 dark:border-surface-800">
              <div className="text-xs font-semibold text-surface-500">Cycle Time Average</div>
              <div className="text-sm font-bold text-surface-900 dark:text-surface-100">
                1.8 days per completed task
              </div>
            </div>

            <div className="space-y-1 pt-3 border-t border-surface-100 dark:border-surface-800">
              <div className="text-xs font-semibold text-surface-500">Active Contributors</div>
              <div className="text-sm font-bold text-surface-900 dark:text-surface-100">
                6 engineers assigned
              </div>
            </div>

            <div className="pt-3 border-t border-surface-100 dark:border-surface-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/analytics')}
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Detailed Chart Breakdown
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Details Drawer for direct dashboard click */}
      <TaskDetailsDrawer
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />
    </div>
  );
};

export default DashboardPage;
