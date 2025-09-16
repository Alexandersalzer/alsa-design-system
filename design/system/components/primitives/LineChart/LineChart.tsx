// ===============================================
// src/design-system/components/primitives/LineChart/LineChart.tsx
// BEAUTIFUL LINE CHART COMPONENT USING RECHARTS
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import './LineChart.css';

export interface LineChartDataPoint {
  label: string;
  value: number;
  [key: string]: any;
}

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  data: LineChartDataPoint[];
  color?: string;
  loading?: boolean;
  className?: string;
}

export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
  ({ title, data, color = "hsl(var(--accent))", loading, className, ...props }, ref) => {
    if (loading) {
      return (
        <div 
          ref={ref} 
          className={cn('line-chart line-chart--loading', className)} 
          {...props}
        >
          <div className="h-64 animate-pulse bg-muted rounded-md" />
        </div>
      );
    }

    if (!data?.length) {
      return (
        <div 
          ref={ref} 
          className={cn('line-chart', className)} 
          {...props}
        >
          <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
            No data available
          </div>
        </div>
      );
    }

    return (
      <div 
        ref={ref} 
        className={cn('line-chart w-full bg-white border border-gray-200 rounded-md', className)} 
        style={{ minHeight: '400px' }}
        {...props}
      >
        {title && (
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          </div>
        )}

        <div className="p-4" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="label" 
                stroke="#666" 
                fontSize={12}
                tick={{ fill: '#666' }}
              />
              <YAxis 
                stroke="#666" 
                fontSize={12}
                tick={{ fill: '#666' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
                labelStyle={{ color: "#333" }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2} 
                dot={{ r: 4, fill: color }} 
                activeDot={{ r: 6, fill: color }}
              />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
);

LineChart.displayName = 'LineChart';
