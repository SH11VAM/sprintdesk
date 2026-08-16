import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { CompletionTrendItem } from '../selectors/analyticsSelectors';

export interface CompletionTrendChartProps {
  data: CompletionTrendItem[];
}

export const CompletionTrendChart: React.FC<CompletionTrendChartProps> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="remainingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#cbd5e1', opacity: 0.3 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
          />
          <Area
            type="monotone"
            dataKey="completed"
            name="Completed Tasks"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#completedGrad)"
          />
          <Area
            type="monotone"
            dataKey="remaining"
            name="Remaining Tasks"
            stroke="#6366f1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#remainingGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
