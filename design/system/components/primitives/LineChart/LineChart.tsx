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
        className={cn('line-chart w-full bg-background border border-border rounded-md', className)} 
        {...props}
      >
        {title && (
          <div className="px-4 py-2 border-b border-border">
            <h3 className="text-sm font-medium">{title}</h3>
          </div>
        )}

        <div className="p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={data}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="label" stroke="hsl(var(--text-secondary))" />
              <YAxis stroke="hsl(var(--text-secondary))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "4px"
                }}
                labelStyle={{ color: "hsl(var(--text-primary))" }}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 4 }} />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
);

LineChart.displayName = 'LineChart';
