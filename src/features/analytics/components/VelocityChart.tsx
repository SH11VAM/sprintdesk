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
import { VelocityItem } from '../selectors/analyticsSelectors';

export interface VelocityChartProps {
  data: VelocityItem[];
}

export const VelocityChart: React.FC<VelocityChartProps> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} vertical={false} />
          <XAxis
            dataKey="sprint"
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
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            }}
            cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
          />
          <Bar dataKey="committed" name="Committed" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={32} />
          <Bar dataKey="completed" name="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
