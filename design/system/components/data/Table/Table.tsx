// ===============================================
// src/design-system/components/primitives/Table/index.ts
// Table COMPONENT
// ===============================================


import React from 'react';
import { cn } from '../../../utils/cn';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  className?: string;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'striped';
  hoverable?: boolean;
  onRowClick?: (record: T, index: number) => void;
  rowKey?: keyof T | ((record: T) => string | number);
}

export const Table = React.forwardRef<HTMLDivElement, TableProps>(
  ({
    data,
    columns,
    loading = false,
    emptyText = 'Ingen data tillgänglig',
    className,
    size = 'md',
    variant = 'default',
    hoverable = true,
    onRowClick,
    rowKey = 'id',
    ...props
  }, ref) => {
    const getRowKey = (record: any, index: number): string | number => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }
      return record[rowKey] || index;
    };

    const handleRowClick = (record: any, index: number) => {
      if (onRowClick) {
        onRowClick(record, index);
      }
    };

    if (loading) {
      return (
        <div ref={ref} className={cn('table-container', className)} {...props}>
          <div className="table-loading">
            <div className="table-loading-skeleton">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="table-loading-row">
                  {columns.map((_, colIndex) => (
                    <div key={colIndex} className="table-loading-cell" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div ref={ref} className={cn('table-container', className)} {...props}>
          <div className="table-empty">
            <div className="table-empty-content">
              <p className="table-empty-text">{emptyText}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('table-container', className)} {...props}>
        <div className="table-wrapper">
          <table className={cn(
            'table', 
            `table--${size}`, 
            `table--${variant}`,
            hoverable && 'table--hoverable'
          )}>
            <thead className="table-header">
              <tr className="table-header-row">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'table-header-cell', 
                      column.className,
                      column.align && `table-header-cell--${column.align}`
                    )}
                    style={{ width: column.width }}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="table-body">
              {data.map((record, index) => (
                <tr
                  key={getRowKey(record, index)}
                  className="table-body-row"
                  onClick={() => handleRowClick(record, index)}
                >
                  {columns.map((column) => {
                    const value = column.dataIndex ? record[column.dataIndex] : null;
                    const cellContent = column.render ? column.render(value, record, index) : value;
                    
                    return (
                      <td
                        key={column.key}
                        className={cn(
                          'table-body-cell', 
                          column.className,
                          column.align && `table-body-cell--${column.align}`
                        )}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

Table.displayName = 'Table';
