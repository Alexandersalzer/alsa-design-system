// ===============================================
// src/design-system/components/primitives/LineChart/LineChart.tsx
// REUSABLE LINE CHART COMPONENT FOR BLIMPIFY UI
// ===============================================

import React, { forwardRef } from 'react';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  type TooltipProps
} from "recharts";
import { cn } from '../../../lib/utils';

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Chart title displayed at the top */
  title?: string;
  /** Data array for the chart */
  data: { label: string; value: number }[];
  /** Color for the line (defaults to accent color) */
  color?: string;
  /** Loading state */
  loading?: boolean;
  /** Height of the chart container */
  height?: number | string;
  /** Show/hide grid lines */
  showGrid?: boolean;
  /** Show/hide legend */
  showLegend?: boolean;
  /** Show/hide tooltip */
  showTooltip?: boolean;
  /** Custom tooltip content */
  customTooltip?: TooltipProps<any, any>['content'];
  /** Chart variant for different styling */
  variant?: 'default' | 'minimal' | 'detailed';
}

export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
  ({ 
    className,
    title, 
    data, 
    color = "hsl(var(--accent))", 
    loading = false,
    height = 256,
    showGrid = true,
    showLegend = true,
    showTooltip = true,
    customTooltip,
    variant = 'default',
    ...props 
  }, ref) => {
    
    // Loading state
    if (loading) {
      return (
        <div 
          ref={ref}
          className={cn('line-chart line-chart--loading', className)} 
          style={{ height: typeof height === 'number' ? `${height}px` : height }}
          {...props}
        >
          <div className="line-chart__skeleton" />
        </div>
      );
    }

    // Empty state
    if (!data?.length) {
      return (
        <div 
          ref={ref}
          className={cn('line-chart line-chart--empty', className)}
          style={{ height: typeof height === 'number' ? `${height}px` : height }}
          {...props}
        >
          <div className="line-chart__empty-state">
            <span className="line-chart__empty-text">No data available</span>
          </div>
        </div>
      );
    }

    const chartClasses = cn(
      'line-chart',
      `line-chart--${variant}`,
      className
    );

    return (
      <div ref={ref} className={chartClasses} {...props}>
        {/* Chart Header */}
        {title && (
          <div className="line-chart__header">
            <h3 className="line-chart__title">{title}</h3>
          </div>
        )}

        {/* Chart Content */}
        <div 
          className="line-chart__content"
          style={{ height: typeof height === 'number' ? `${height}px` : height }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={data}>
              {showGrid && (
                <CartesianGrid 
                  stroke="hsl(var(--border))" 
                  strokeDasharray="3 3" 
                  className="line-chart__grid"
                />
              )}
              <XAxis 
                dataKey="label" 
                stroke="hsl(var(--text-secondary))" 
                className="line-chart__axis line-chart__axis--x"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="hsl(var(--text-secondary))" 
                className="line-chart__axis line-chart__axis--y"
                tick={{ fontSize: 12 }}
              />
              {showTooltip && (
                <Tooltip
                  content={customTooltip || undefined}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-md)"
                  }}
                  labelStyle={{ 
                    color: "hsl(var(--text-primary))",
                    fontWeight: 500
                  }}
                  itemStyle={{
                    color: "hsl(var(--text-primary))"
                  }}
                  wrapperStyle={{
                    outline: 'none'
                  }}
                />
              )}
              {showLegend && (
                <Legend 
                  className="line-chart__legend"
                  wrapperStyle={{
                    color: "hsl(var(--text-primary))"
                  }}
                />
              )}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2} 
                dot={{ 
                  r: 4, 
                  fill: color,
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2
                }} 
                activeDot={{ 
                  r: 6, 
                  fill: color,
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2
                }}
                className="line-chart__line"
              />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
);

LineChart.displayName = 'LineChart';

// ===============================================
// USAGE EXAMPLES
// ===============================================

/*

// Basic usage
<LineChart 
  title="Monthly Trends"
  data={[
    { label: 'Jan', value: 100 },
    { label: 'Feb', value: 150 },
    { label: 'Mar', value: 200 }
  ]}
/>

// With custom color
<LineChart 
  title="Sales Data"
  data={salesData}
  color="#3b82f6"
  height={300}
/>

// Minimal variant
<LineChart 
  data={data}
  variant="minimal"
  showLegend={false}
  showGrid={false}
/>

// With loading state
<LineChart 
  title="Loading Chart"
  data={[]}
  loading={true}
/>

// Custom height
<LineChart 
  data={data}
  height="400px"
/>

*/
