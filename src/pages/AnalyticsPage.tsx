import React, { useMemo } from 'react';
import { useBoardStore } from '@/features/board/store/boardStore';
import { analyticsSelectors } from '@/features/analytics/selectors/analyticsSelectors';
import { VelocityChart } from '@/features/analytics/components/VelocityChart';
import { StatusDistributionChart } from '@/features/analytics/components/StatusDistributionChart';
import { PriorityBreakdownChart } from '@/features/analytics/components/PriorityBreakdownChart';
import { CompletionTrendChart } from '@/features/analytics/components/CompletionTrendChart';
import { AnalyticsSummaryCards } from '@/features/analytics/components/AnalyticsSummaryCards';
import { BarChart3, PieChart as PieIcon, Layers, TrendingUp, Info } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { tasks } = useBoardStore();

  // Memoize all chart selector calculations so they only recalculate when tasks change
  const summary = useMemo(() => analyticsSelectors.getSummaryMetrics(tasks), [tasks]);
  const velocityData = useMemo(() => analyticsSelectors.getSprintVelocity(tasks), [tasks]);
  const statusData = useMemo(() => analyticsSelectors.getTaskStatusDistribution(tasks), [tasks]);
  const priorityData = useMemo(() => analyticsSelectors.getPriorityBreakdown(tasks), [tasks]);
  const trendData = useMemo(() => analyticsSelectors.getCompletionTrend(tasks), [tasks]);

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-surface-900 dark:text-surface-50 tracking-tight">
            Sprint 24 Engineering Analytics
          </h2>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            Real-time delivery telemetry calculated directly from current sprint tasks.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-xs font-semibold text-surface-600 dark:text-surface-300">
          <Info className="w-3.5 h-3.5 text-brand-500" />
          <span>Updates dynamically on board state changes</span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <AnalyticsSummaryCards summary={summary} />

      {/* 2x2 Responsive Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Sprint Velocity */}
        <div className="p-6 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-brand-600 dark:text-brand-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100">
                  Sprint Velocity Comparison
                </h3>
                <p className="text-[11px] text-surface-500">Committed vs Completed story units</p>
              </div>
            </div>
          </div>
          <VelocityChart data={velocityData} />
        </div>

        {/* Chart 2: Task Status Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100">
                  Status Breakdown
                </h3>
                <p className="text-[11px] text-surface-500">Distribution across 4 workflow stages</p>
              </div>
            </div>
          </div>
          <StatusDistributionChart data={statusData} />
        </div>

        {/* Chart 3: Priority Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100">
                  Priority Breakdown by Column
                </h3>
                <p className="text-[11px] text-surface-500">High, medium, and low distribution</p>
              </div>
            </div>
          </div>
          <PriorityBreakdownChart data={priorityData} />
        </div>

        {/* Chart 4: Completion / Burndown Trend */}
        <div className="p-6 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100">
                  Sprint Burndown & Delivery Trend
                </h3>
                <p className="text-[11px] text-surface-500">Completed vs remaining tasks trajectory</p>
              </div>
            </div>
          </div>
          <CompletionTrendChart data={trendData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
