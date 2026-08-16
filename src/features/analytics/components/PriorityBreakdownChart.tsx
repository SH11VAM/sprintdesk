import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { PriorityBreakdownItem } from '../selectors/analyticsSelectors';

export interface PriorityBreakdownChartProps {
  data: PriorityBreakdownItem[];
}

export const PriorityBreakdownChart: React.FC<PriorityBreakdownChartProps> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} vertical={false} />
          <XAxis
            dataKey="column"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#cbd5e1', opacity: 0.3 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
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
          <Bar dataKey="high" name="High" fill="#f43f5e" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={36} />
          <Bar dataKey="medium" name="Medium" fill="#f59e0b" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={36} />
          <Bar dataKey="low" name="Low" fill="#94a3b8" stackId="a" radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
