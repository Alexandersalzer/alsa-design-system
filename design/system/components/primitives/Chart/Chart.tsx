// ===============================================
// src/design-system/components/primitives/Chart/Chart.tsx
// GENERIC CHART COMPONENT - Display data in a clean table format
// ===============================================

import React from 'react';
import { cn } from '../../../lib/utils';
import { Typography } from '../Typography';
import { Card, CardContent } from '../Card';
import { Stack } from '../../../layout/utilities/stack/Stack';
import './Chart.css';

// ===== TYPE DEFINITIONS =====

export interface ChartColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  format?: 'text' | 'number' | 'currency' | 'percentage' | 'date';
  hidden?: boolean;
}

export interface ChartData {
  [key: string]: any;
}

export interface ChartProps {
  /** Chart data array */
  data: ChartData[];
  
  /** Column definitions */
  columns: ChartColumn[];
  
  /** Chart title */
  title?: string;
  
  /** Maximum number of rows to display */
  maxRows?: number;
  
  /** Loading state */
  loading?: boolean;
  
  /** Empty state message */
  emptyMessage?: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Card variant */
  variant?: 'default' | 'outlined';
  
  /** Sort by column key */
  sortBy?: string;
  
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  
  /** Show hover effects */
  hoverable?: boolean;
}

// ===== MAIN CHART COMPONENT =====

export const Chart: React.FC<ChartProps> = ({
  data = [],
  columns = [],
  title,
  maxRows,
  loading = false,
  emptyMessage = 'Ingen data tillgänglig',
  className,
  variant = 'default',
  sortBy,
  sortDirection = 'desc',
  hoverable = true
}) => {
  // Filter visible columns
  const visibleColumns = columns.filter(col => !col.hidden);
  
  // Sort data if sortBy is specified
  const sortedData = React.useMemo(() => {
    if (!sortBy) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (aVal === bVal) return 0;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortBy, sortDirection]);

  // Apply maxRows limit
  const displayData = maxRows ? sortedData.slice(0, maxRows) : sortedData;

  // Format cell value based on column format
  const formatCellValue = (value: any, format?: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (format) {
      case 'number':
        return typeof value === 'number' ? value.toLocaleString('sv-SE') : value;
      case 'currency':
        return typeof value === 'number' ? `${value.toLocaleString('sv-SE')} kr` : value;
      case 'percentage':
        return typeof value === 'number' ? `${value.toFixed(1)}%` : value;
      case 'date':
        try {
          return new Date(value).toLocaleDateString('sv-SE');
        } catch {
          return value;
        }
      default:
        return value;
    }
  };

  // Get column width class
  const getColumnWidth = (width?: string) => {
    if (!width) return '';
    
    // Convert percentage to fraction
    if (width.includes('%')) {
      const percent = parseInt(width);
      if (percent <= 25) return 'w-1/4';
      if (percent <= 33) return 'w-1/3';
      if (percent <= 50) return 'w-1/2';
      if (percent <= 66) return 'w-2/3';
      if (percent <= 75) return 'w-3/4';
    }
    
    return '';
  };

  // Get alignment class
  const getAlignmentClass = (align?: string) => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  if (loading) {
    return (
      <Card variant={variant} className={cn('chart', className)}>
        <CardContent>
          <Stack spacing="md">
            {title && <Typography variant="h3" weight="semibold">{title}</Typography>}
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (displayData.length === 0) {
    return (
      <Card variant={variant} className={cn('chart', className)}>
        <CardContent>
          <Stack spacing="md" align="center" className="py-8">
            {title && <Typography variant="h3" weight="semibold">{title}</Typography>}
            <Typography variant="body-md" color="secondary">{emptyMessage}</Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant={variant} className={cn('chart', className)}>
      <CardContent>
        <Stack spacing="md">
          {title && <Typography variant="h3" weight="semibold">{title}</Typography>}
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed">
              <thead>
                <tr className="border-b border-gray-200">
                  {visibleColumns.map((column) => (
                    <th 
                      key={column.key}
                      className={`py-2 ${getAlignmentClass(column.align)} ${getColumnWidth(column.width)}`}
                    >
                      <Typography variant="label-sm" color="secondary">
                        {column.label}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayData.map((row, index) => (
                  <tr 
                    key={index} 
                    className={cn(
                      hoverable && 'hover:bg-gray-50 transition-colors'
                    )}
                  >
                    {visibleColumns.map((column) => (
                      <td 
                        key={column.key}
                        className={`py-2 ${getAlignmentClass(column.align)}`}
                      >
                        <Typography 
                          variant="body-sm" 
                          className={cn(
                            column.format === 'number' || 
                            column.format === 'currency' || 
                            column.format === 'percentage' 
                              ? 'tabular-nums' 
                              : ''
                          )}
                        >
                          {formatCellValue(row[column.key], column.format)}
                        </Typography>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
};

Chart.displayName = 'Chart';
