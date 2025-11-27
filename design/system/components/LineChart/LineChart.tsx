// ===============================================
// src/design-system/components/primitives/LineChart/LineChart.tsx
// CLEAN LINECHART COMPONENT WITH PROPER AXES
// ===============================================

import React, { forwardRef, useMemo, useState } from 'react';
import { cn } from '../../utils/cn';

export interface LineChartDataPoint {
  x: number | string;
  y: number;
  label?: string;
  originalX?: number | string;
}

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: LineChartDataPoint[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  showLabels?: boolean;
  lineColor?: string;
  lineWidth?: number;
  dotSize?: number;
  showDots?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
  subtitle?: string;
  // Responsive behavior
  responsive?: boolean;
  // Animation
  animate?: boolean;
  animationDuration?: number;
}

export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
  ({
    className,
    data = [],
    width = 400,
    height = 300,
    showGrid = true,
    showAxes = true,
    showLabels = true,
    lineColor = 'var(--color-primary)',
    lineWidth = 2,
    dotSize = 4,
    showDots = true,
    xAxisLabel,
    yAxisLabel,
    title,
    subtitle,
    responsive = true,
    animate = true,
    animationDuration = 1000,
    ...props
  }, ref) => {
    
    // Helper function to format large numbers
    const formatNumber = (num: number): string => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      } else if (num % 1 !== 0) {
        return num.toFixed(1);
      }
      return num.toString();
    };

    // Helper function to format X-axis labels
    const formatXLabel = (value: string | number): string => {
      if (typeof value === 'string') {
        return value;
      }
      // For numeric values, clean up decimals
      if (value % 1 !== 0) {
        return value.toFixed(1);
      }
      return value.toString();
    };

    // Tooltip state
    const [tooltip, setTooltip] = useState<{
      visible: boolean;
      x: number;
      y: number;
      data: LineChartDataPoint | null;
    }>({
      visible: false,
      x: 0,
      y: 0,
      data: null
    });
    
    // Calculate chart dimensions with padding
    const padding = { top: 30, right: 60, bottom: 60, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Process data and calculate scales
    const { processedData, xScale, yScale, xTicks, yTicks } = useMemo(() => {
      if (!data || data.length === 0) {
        return {
          processedData: [],
          xScale: (x: number) => x,
          yScale: (y: number) => y,
          xTicks: [],
          yTicks: []
        };
      }

      // Convert x values to numbers if they're strings
      const numericData = data.map((point, index) => ({
        ...point,
        x: typeof point.x === 'string' ? index : point.x,
        originalX: point.x
      }));

      // Find min/max values
      const xValues = numericData.map(d => d.x as number);
      const yValues = numericData.map(d => d.y);
      
      const xMin = Math.min(...xValues);
      const xMax = Math.max(...xValues);
      const yMin = Math.min(...yValues);
      const yMax = Math.max(...yValues);

      // Add some padding to y-axis
      const yRange = yMax - yMin;
      const yPadding = yRange * 0.1;
      const yMinPadded = Math.max(0, yMin - yPadding);
      const yMaxPadded = yMax + yPadding;

      // Create scales
      const xScale = (x: number) => 
        padding.left + ((x - xMin) / (xMax - xMin)) * chartWidth;
      
      const yScale = (y: number) => 
        padding.top + chartHeight - ((y - yMinPadded) / (yMaxPadded - yMinPadded)) * chartHeight;

      // Generate ticks - use original data points for cleaner labels
      const xTicks = numericData
        .filter((_, index) => {
                  // Show every nth point to avoid overcrowding - max 5 labels
          const step = Math.max(1, Math.floor(numericData.length / 5));
          return index % step === 0 || index === numericData.length - 1;
        })
        .map((point) => ({
          value: point.x as number,
          label: formatXLabel(point.originalX || point.x),
          x: xScale(point.x as number),
          y: padding.top + chartHeight
        }));

      const yTicks = Array.from({ length: 6 }, (_, i) => {
        const value = yMinPadded + (i / 5) * (yMaxPadded - yMinPadded);
        return {
          value: Math.round(value),
          formattedValue: formatNumber(Math.round(value)),
          x: padding.left,
          y: yScale(value)
        };
      });

      return {
        processedData: numericData,
        xScale,
        yScale,
        xTicks,
        yTicks
      };
    }, [data, chartWidth, chartHeight, padding]);

    // Generate SVG path for the line
    const linePath = useMemo(() => {
      if (processedData.length === 0) return '';
      
      const pathData = processedData
        .map((point, index) => {
          const x = xScale(point.x as number);
          const y = yScale(point.y);
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');
      
      return pathData;
    }, [processedData, xScale, yScale]);

    // Generate area path for fill
    const areaPath = useMemo(() => {
      if (processedData.length === 0) return '';
      
      const firstPoint = processedData[0];
      const lastPoint = processedData[processedData.length - 1];
      const bottomY = padding.top + chartHeight;
      
      const pathData = processedData
        .map((point, index) => {
          const x = xScale(point.x as number);
          const y = yScale(point.y);
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');
      
      return `${pathData} L ${xScale(lastPoint.x as number)} ${bottomY} L ${xScale(firstPoint.x as number)} ${bottomY} Z`;
    }, [processedData, xScale, yScale, padding, chartHeight]);

    const chartClasses = cn(
      'line-chart',
      responsive && 'line-chart--responsive',
      className
    );

    return (
      <div
        ref={ref}
        className={chartClasses}
        style={{
          width: responsive ? '100%' : width,
          height: responsive ? 'auto' : height,
          maxWidth: width,
          ...props.style
        }}
        {...props}
      >
        {/* Title and Subtitle */}
        {(title || subtitle) && (
          <div className="line-chart__header">
            {title && <h3 className="line-chart__title">{title}</h3>}
            {subtitle && <p className="line-chart__subtitle">{subtitle}</p>}
          </div>
        )}

        {/* Chart Container */}
        <div className="line-chart__container">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="line-chart__svg"
          >
            {/* Grid Lines */}
            {showGrid && (
              <g className="line-chart__grid">
                {/* Vertical grid lines */}
                {xTicks.map((tick, index) => (
                  <line
                    key={`v-grid-${index}`}
                    x1={tick.x}
                    y1={padding.top}
                    x2={tick.x}
                    y2={padding.top + chartHeight}
                    className="line-chart__grid-line line-chart__grid-line--vertical"
                  />
                ))}
                {/* Horizontal grid lines */}
                {yTicks.map((tick, index) => (
                  <line
                    key={`h-grid-${index}`}
                    x1={padding.left}
                    y1={tick.y}
                    x2={padding.left + chartWidth}
                    y2={tick.y}
                    className="line-chart__grid-line line-chart__grid-line--horizontal"
                  />
                ))}
              </g>
            )}

            {/* Axes */}
            {showAxes && (
              <g className="line-chart__axes">
                {/* X-axis */}
                <line
                  x1={padding.left}
                  y1={padding.top + chartHeight}
                  x2={padding.left + chartWidth}
                  y2={padding.top + chartHeight}
                  className="line-chart__axis line-chart__axis--x"
                />
                {/* Y-axis */}
                <line
                  x1={padding.left}
                  y1={padding.top}
                  x2={padding.left}
                  y2={padding.top + chartHeight}
                  className="line-chart__axis line-chart__axis--y"
                />
              </g>
            )}

            {/* Area fill */}
            <path
              d={areaPath}
              className="line-chart__area"
              fill={lineColor}
              fillOpacity="0.1"
            />

            {/* Line */}
            <path
              d={linePath}
              className="line-chart__line"
              fill="none"
              stroke={lineColor}
              strokeWidth={lineWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: animate ? '1000' : 'none',
                strokeDashoffset: animate ? '1000' : '0',
                animation: animate ? `line-chart-draw ${animationDuration}ms ease-out forwards` : 'none'
              }}
            />

            {/* Data points */}
            {showDots && processedData.map((point, index) => (
              <circle
                key={`dot-${index}`}
                cx={xScale(point.x as number)}
                cy={yScale(point.y)}
                r={dotSize}
                className="line-chart__dot"
                fill={lineColor}
                style={{
                  opacity: animate ? 0 : 1,
                  animation: animate ? `line-chart-dot-appear ${animationDuration}ms ease-out ${index * 100}ms forwards` : 'none'
                }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const chartRect = e.currentTarget.closest('.line-chart')?.getBoundingClientRect();
                  if (chartRect) {
                    setTooltip({
                      visible: true,
                      x: rect.left - chartRect.left + rect.width / 2,
                      y: rect.top - chartRect.top - 50,
                      data: point
                    });
                  }
                }}
                onMouseLeave={() => {
                  setTooltip(prev => ({ ...prev, visible: false }));
                }}
              />
            ))}

            {/* Labels */}
            {showLabels && (
              <g className="line-chart__labels">
                {/* X-axis labels */}
                {xTicks.map((tick, index) => (
                  <text
                    key={`x-label-${index}`}
                    x={tick.x}
                    y={height - 20}
                    className="line-chart__label line-chart__label--x"
                    textAnchor="middle"
                  >
                    {tick.label}
                  </text>
                ))}
                {/* Y-axis labels */}
                {yTicks.map((tick, index) => (
                  <text
                    key={`y-label-${index}`}
                    x={padding.left - 15}
                    y={tick.y + 4}
                    className="line-chart__label line-chart__label--y"
                    textAnchor="end"
                  >
                    {tick.formattedValue}
                  </text>
                ))}
              </g>
            )}

            {/* Axis labels */}
            {xAxisLabel && (
              <text
                x={width / 2}
                y={height - 5}
                className="line-chart__axis-label line-chart__axis-label--x"
                textAnchor="middle"
              >
                {xAxisLabel}
              </text>
            )}
            {yAxisLabel && (
              <text
                x={25}
                y={height / 2}
                className="line-chart__axis-label line-chart__axis-label--y"
                textAnchor="middle"
                transform={`rotate(-90, 25, ${height / 2})`}
              >
                {yAxisLabel}
              </text>
            )}
          </svg>
        </div>

        {/* Tooltip */}
        {tooltip.visible && tooltip.data && (
          <div
            className="line-chart__tooltip"
            style={{
              position: 'absolute',
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              zIndex: 1000
            }}
          >
            <div className="line-chart__tooltip-content">
              <div className="line-chart__tooltip-label">
                {formatXLabel(tooltip.data.originalX || tooltip.data.x)}
              </div>
              <div className="line-chart__tooltip-value">
                {formatNumber(tooltip.data.y)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

LineChart.displayName = 'LineChart';
