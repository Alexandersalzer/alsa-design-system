import React from 'react';
import { cn } from '../../../../lib/utils';

export interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
  }[];
  className?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({ data, columns, className, onRowClick }: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface-subtle border-b border-border-subtle">
            {columns.map((column) => (
              <th
                key={column.key.toString()}
                className="px-4 py-3 text-left text-sm font-medium text-text-subtle"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(item)}
              className={cn(
                'border-b border-border-subtle hover:bg-surface-hover transition-colors',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key.toString()}
                  className="px-4 py-3 text-sm text-text-default"
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]?.toString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 