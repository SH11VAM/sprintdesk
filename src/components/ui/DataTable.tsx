import React from 'react';
import { cn } from '@/utils/cn';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyTitle = 'No data available',
  emptyDescription,
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return <Skeleton variant="table" />;
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} className="my-4" />;
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm', className)}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950/60">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  'py-3.5 px-4 text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider',
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
          {data.map((item, index) => {
            const key = keyExtractor(item);
            return (
              <tr
                key={key}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/60',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={`${key}-${col.key}`}
                    className={cn('py-3.5 px-4 text-surface-800 dark:text-surface-200', col.className)}
                  >
                    {col.render
                      ? col.render(item, index)
                      : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
