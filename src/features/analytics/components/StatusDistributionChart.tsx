import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { StatusDistributionItem } from '../selectors/analyticsSelectors';

export interface StatusDistributionChartProps {
  data: StatusDistributionItem[];
}

export const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full h-72 flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
              fontSize: '12px',
            }}
            formatter={(value: number, name: string) => [
              `${value} tasks (${total > 0 ? Math.round((value / total) * 100) : 0}%)`,
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '8px', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label */}
      <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
        <div className="text-2xl font-extrabold text-surface-900 dark:text-surface-100">{total}</div>
        <div className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider">Total</div>
      </div>
    </div>
  );
};
