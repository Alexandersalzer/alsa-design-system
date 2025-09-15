// ===============================================
// src/design-system/components/primitives/Chart/Chart.tsx
// LINE CHART COMPONENT - Display data as a line chart
// ===============================================

import React from 'react';
import { cn } from '../../../lib/utils';
import { Typography } from '../Typography';
import { Card, CardContent } from '../Card';
import { Stack } from '../../../layout/utilities/stack/Stack';
import './Chart.css';

// ===== TYPE DEFINITIONS =====

export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

export interface ChartData {
  label: string;
  data: ChartDataPoint[];
  color?: string;
}

export interface ChartProps {
  /** Chart data array */
  data: ChartData[];
  
  /** Chart title */
  title?: string;
  
  /** Chart height */
  height?: number;
  
  /** Loading state */
  loading?: boolean;
  
  /** Empty state message */
  emptyMessage?: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Card variant */
  variant?: 'default' | 'outlined';
  
  /** Show grid lines */
  showGrid?: boolean;
  
  /** Show data points */
  showPoints?: boolean;
  
  /** Chart type */
  type?: 'line' | 'area';
}

// ===== MAIN CHART COMPONENT =====

export const Chart: React.FC<ChartProps> = ({
  data = [],
  title,
  height = 300,
  loading = false,
  emptyMessage = 'Ingen data tillgänglig',
  className,
  variant = 'default',
  showGrid = true,
  showPoints = true,
  type = 'line'
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height });

  // Update dimensions on resize
  React.useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const containerWidth = svgRef.current.parentElement?.clientWidth || 400;
        setDimensions({ width: containerWidth, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [height]);

  // Calculate chart dimensions and scales
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const chartWidth = dimensions.width - margin.left - margin.right;
  const chartHeight = dimensions.height - margin.top - margin.bottom;

  // Get all unique x values and y values for scaling
  const allXValues = React.useMemo(() => {
    const xSet = new Set<string | number>();
    data.forEach(dataset => {
      dataset.data.forEach(point => xSet.add(point.x));
    });
    return Array.from(xSet).sort((a, b) => {
      if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b);
      }
      return Number(a) - Number(b);
    });
  }, [data]);

  const allYValues = React.useMemo(() => {
    const yValues: number[] = [];
    data.forEach(dataset => {
      dataset.data.forEach(point => yValues.push(point.y));
    });
    return yValues;
  }, [data]);

  const minY = Math.min(...allYValues);
  const maxY = Math.max(...allYValues);
  const yPadding = (maxY - minY) * 0.1;

  // Scale functions
  const xScale = (value: string | number) => {
    const index = allXValues.indexOf(value);
    return (index / (allXValues.length - 1)) * chartWidth;
  };

  const yScale = (value: number) => {
    return chartHeight - ((value - minY + yPadding) / (maxY - minY + yPadding * 2)) * chartHeight;
  };

  // Generate path for line/area
  const generatePath = (dataset: ChartData) => {
    if (dataset.data.length === 0) return '';

    const points = dataset.data
      .map(point => `${xScale(point.x)},${yScale(point.y)}`)
      .join(' ');

    if (type === 'area') {
      const firstPoint = `${xScale(dataset.data[0].x)},${chartHeight}`;
      const lastPoint = `${xScale(dataset.data[dataset.data.length - 1].x)},${chartHeight}`;
      return `M ${firstPoint} L ${points} L ${lastPoint} Z`;
    } else {
      return `M ${points.split(' ')[0]} L ${points}`;
    }
  };

  // Default colors
  const defaultColors = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--muted-foreground))',
    'hsl(var(--destructive))'
  ];

  if (loading) {
    return (
      <Card variant={variant} className={cn('chart', className)}>
        <CardContent>
          <Stack spacing="md">
            {title && <Typography variant="h3" weight="semibold">{title}</Typography>}
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0 || allXValues.length === 0) {
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
          
          <div className="w-full">
            <svg
              ref={svgRef}
              width={dimensions.width}
              height={dimensions.height}
              className="w-full h-auto"
            >
              <defs>
                {type === 'area' && (
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
                  </linearGradient>
                )}
              </defs>
              
              <g transform={`translate(${margin.left},${margin.top})`}>
                {/* Grid lines */}
                {showGrid && (
                  <g className="grid-lines">
                    {/* Horizontal grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                      <line
                        key={`h-${i}`}
                        x1={0}
                        y1={chartHeight * ratio}
                        x2={chartWidth}
                        y2={chartHeight * ratio}
                        stroke="hsl(var(--border))"
                        strokeWidth="1"
                        opacity="0.3"
                      />
                    ))}
                    {/* Vertical grid lines */}
                    {allXValues.map((_, i) => (
                      <line
                        key={`v-${i}`}
                        x1={xScale(allXValues[i])}
                        y1={0}
                        x2={xScale(allXValues[i])}
                        y2={chartHeight}
                        stroke="hsl(var(--border))"
                        strokeWidth="1"
                        opacity="0.3"
                      />
                    ))}
                  </g>
                )}

                {/* Chart lines/areas */}
                {data.map((dataset, index) => {
                  const color = dataset.color || defaultColors[index % defaultColors.length];
                  
                  return (
                    <g key={dataset.label}>
                      {/* Area (if type is area) */}
                      {type === 'area' && (
                        <path
                          d={generatePath(dataset)}
                          fill={`url(#areaGradient)`}
                          className="chart-area"
                          style={{ color }}
                        />
                      )}
                      
                      {/* Line */}
                      <path
                        d={generatePath(dataset)}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        className="chart-line"
                      />
                      
                      {/* Data points */}
                      {showPoints && dataset.data.map((point, pointIndex) => (
                        <circle
                          key={pointIndex}
                          cx={xScale(point.x)}
                          cy={yScale(point.y)}
                          r="4"
                          fill={color}
                          stroke="hsl(var(--background))"
                          strokeWidth="2"
                          className="chart-point"
                        />
                      ))}
                    </g>
                  );
                })}

                {/* X-axis labels */}
                <g className="x-axis">
                  {allXValues.map((value, index) => (
                    <text
                      key={index}
                      x={xScale(value)}
                      y={chartHeight + 20}
                      textAnchor="middle"
                      className="text-xs fill-muted-foreground"
                    >
                      {typeof value === 'string' ? value : value.toString()}
                    </text>
                  ))}
                </g>

                {/* Y-axis labels */}
                <g className="y-axis">
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                    const value = minY + (maxY - minY) * (1 - ratio);
                    return (
                      <text
                        key={index}
                        x={-10}
                        y={chartHeight * ratio + 4}
                        textAnchor="end"
                        className="text-xs fill-muted-foreground"
                      >
                        {value.toLocaleString('sv-SE')}
                      </text>
                    );
                  })}
                </g>
              </g>
            </svg>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
};

Chart.displayName = 'Chart';