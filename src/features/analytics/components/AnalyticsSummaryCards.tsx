import React from 'react';
import { AnalyticsSummary } from '../selectors/analyticsSelectors';
import { CheckCircle2, AlertOctagon, Activity, Flame } from 'lucide-react';

export interface AnalyticsSummaryCardsProps {
  summary: AnalyticsSummary;
}

export const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Completion Rate */}
      <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
            Sprint Completion
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-surface-900 dark:text-surface-50">
            {summary.completionRate}%
          </span>
          <span className="text-xs text-surface-500">
            ({summary.completedTasks}/{summary.totalTasks} tasks)
          </span>
        </div>
        {/* Visual progress bar */}
        <div className="w-full bg-surface-100 dark:bg-surface-800 rounded-full h-1.5 mt-3 overflow-hidden">
          <div
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${summary.completionRate}%` }}
          />
        </div>
      </div>

      {/* In Progress */}
      <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
            Work in Progress
          </span>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Activity className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-surface-900 dark:text-surface-50">
            {summary.inProgressTasks}
          </span>
          <span className="text-xs text-surface-500">active tasks</span>
        </div>
        <p className="text-xs text-surface-500 mt-2">Active engineering throughput</p>
      </div>

      {/* High Priority Risks */}
      <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
            High Priority Risks
          </span>
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <Flame className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
            {summary.highPriorityCount}
          </span>
          <span className="text-xs text-surface-500">unresolved</span>
        </div>
        <p className="text-xs text-surface-500 mt-2">
          {summary.overdueCount > 0
            ? `${summary.overdueCount} task(s) overdue`
            : 'All high-priority tasks on schedule'}
        </p>
      </div>

      {/* Bottleneck Column */}
      <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
            Potential Bottleneck
          </span>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <AlertOctagon className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-surface-900 dark:text-surface-50">
            {summary.bottleneckColumn}
          </span>
        </div>
        <p className="text-xs text-surface-500 mt-2">Column with highest workload accumulation</p>
      </div>
    </div>
  );
};
