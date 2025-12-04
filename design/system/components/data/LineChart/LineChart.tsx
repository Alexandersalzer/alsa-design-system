// ===============================================
// src/design-system/components/data/LineChart/LineChart.tsx
// LINE CHART COMPONENT - STRIPE-INSPIRED
// Modern line chart with zero hardcoded colors
// ===============================================

import React, { useMemo } from 'react';
import './LineChart.css';

export interface LineChartDataPoint {
  label: string;
  value: number;
  [key: string]: string | number;
}

export interface LineChartSeries {
  name: string;
  data: number[];
  color?: 'accent' | 'error' | 'success' | 'warning' | 'info';
  showDots?: boolean;
  dashed?: boolean;
}

export interface LineChartProps {
  /** Chart title */
  title?: string;
  /** Chart subtitle/description */
  subtitle?: string;
  /** Data series to display */
  series: LineChartSeries[];
  /** X-axis labels */
  labels: string[];
  /** Chart height in pixels */
  height?: number;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show area fill under line */
  showArea?: boolean;
  /** Smooth curve instead of straight lines */
  smooth?: boolean;
  /** Show Y-axis labels */
  showYAxis?: boolean;
  /** Show X-axis labels */
  showXAxis?: boolean;
  /** Y-axis label suffix (e.g., 'k', 'M', '%') */
  yAxisSuffix?: string;
  /** Custom Y-axis formatter */
  yAxisFormatter?: (value: number) => string;
  /** Enable responsive behavior */
  responsive?: boolean;
  /** Custom aspect ratio (width:height) */
  aspectRatio?: string;
  /** Show legend */
  showLegend?: boolean;
  /** Minimum value for Y axis */
  minY?: number;
  /** Maximum value for Y axis */
  maxY?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  title,
  subtitle,
  series,
  labels,
  height = 300,
  showGrid = true,
  showArea = false,
  smooth = true,
  showYAxis = true,
  showXAxis = true,
  yAxisSuffix = '',
  yAxisFormatter,
  responsive = true,
  aspectRatio = '4/3',
  showLegend = true,
  minY,
  maxY,
}) => {
  const chartData = useMemo(() => {
    // Calculate min and max values
    const allValues = series.flatMap(s => s.data);
    const dataMin = minY ?? Math.min(...allValues, 0);
    const dataMax = maxY ?? Math.max(...allValues);
    const range = dataMax - dataMin;
    const yMin = dataMin - range * 0.1;
    const yMax = dataMax + range * 0.1;

    // Generate Y-axis ticks
    const tickCount = 5;
    const step = (yMax - yMin) / (tickCount - 1);
    const yTicks = Array.from({ length: tickCount }, (_, i) => yMin + step * i);

    return { yMin, yMax, yTicks };
  }, [series, minY, maxY]);

  const formatYValue = (value: number): string => {
    if (yAxisFormatter) return yAxisFormatter(value);
    return `${Math.round(value)}${yAxisSuffix}`;
  };

  const generatePath = (data: number[], smooth: boolean): string => {
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = 800 - padding.left - padding.right;
    const height = 400 - padding.top - padding.bottom;
    const { yMin, yMax } = chartData;

    const xStep = width / (data.length - 1);
    const points = data.map((value, i) => ({
      x: i * xStep,
      y: height - ((value - yMin) / (yMax - yMin)) * height,
    }));

    if (!smooth || points.length < 2) {
      return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    }

    // Smooth curve using Catmull-Rom spline
    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i === points.length - 2 ? i + 1 : i + 2];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    return path;
  };

  const generateAreaPath = (data: number[]): string => {
    const linePath = generatePath(data, smooth);
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = 800 - padding.left - padding.right;
    const height = 400 - padding.top - padding.bottom;
    
    const firstX = 0;
    const lastX = width;
    
    return `${linePath} L ${lastX},${height} L ${firstX},${height} Z`;
  };

  return (
    <div 
      className={`line-chart ${responsive ? 'line-chart--responsive' : ''}`}
      style={{ 
        height: responsive ? undefined : `${height}px`,
        aspectRatio: responsive ? aspectRatio : undefined 
      }}
    >
      {(title || subtitle) && (
        <div className="line-chart__header">
          {title && <h3 className="line-chart__title">{title}</h3>}
          {subtitle && <p className="line-chart__subtitle">{subtitle}</p>}
        </div>
      )}

      {showLegend && series.length > 1 && (
        <div className="line-chart__legend">
          {series.map((s, i) => (
            <div key={i} className="line-chart__legend-item">
              <span 
                className={`line-chart__legend-marker line-chart__legend-marker--${s.color || 'accent'}`}
              />
              <span className="line-chart__legend-label">{s.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="line-chart__container">
        <svg 
          className="line-chart__svg" 
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {series.map((s, i) => (
              <linearGradient 
                key={i}
                id={`gradient-${i}`} 
                x1="0%" 
                y1="0%" 
                x2="0%" 
                y2="100%"
              >
                <stop 
                  offset="0%" 
                  className={`line-chart__gradient-start line-chart__gradient-start--${s.color || 'accent'}`}
                />
                <stop 
                  offset="100%" 
                  className={`line-chart__gradient-end`}
                />
              </linearGradient>
            ))}
          </defs>

          <g transform="translate(60, 20)">
            {/* Grid lines */}
            {showGrid && (
              <g className="line-chart__grid">
                {chartData.yTicks.map((tick, i) => {
                  const y = 360 - ((tick - chartData.yMin) / (chartData.yMax - chartData.yMin)) * 360;
                  return (
                    <line
                      key={i}
                      className="line-chart__grid-line line-chart__grid-line--horizontal"
                      x1="0"
                      y1={y}
                      x2="720"
                      y2={y}
                    />
                  );
                })}
                {labels.map((_, i) => {
                  const x = (i / (labels.length - 1)) * 720;
                  return (
                    <line
                      key={i}
                      className="line-chart__grid-line line-chart__grid-line--vertical"
                      x1={x}
                      y1="0"
                      x2={x}
                      y2="360"
                    />
                  );
                })}
              </g>
            )}

            {/* Y-axis */}
            {showYAxis && (
              <g className="line-chart__y-axis">
                {chartData.yTicks.map((tick, i) => {
                  const y = 360 - ((tick - chartData.yMin) / (chartData.yMax - chartData.yMin)) * 360;
                  return (
                    <text
                      key={i}
                      className="line-chart__label line-chart__label--y"
                      x="-10"
                      y={y}
                    >
                      {formatYValue(tick)}
                    </text>
                  );
                })}
              </g>
            )}

            {/* Data series */}
            {series.map((s, seriesIndex) => {
              const linePath = generatePath(s.data, smooth);
              const areaPath = showArea ? generateAreaPath(s.data) : '';

              return (
                <g key={seriesIndex}>
                  {/* Area fill */}
                  {showArea && (
                    <path
                      className={`line-chart__area line-chart__area--${s.color || 'accent'}`}
                      d={areaPath}
                      fill={`url(#gradient-${seriesIndex})`}
                    />
                  )}

                  {/* Line */}
                  <path
                    className={`line-chart__line line-chart__line--${s.color || 'accent'} ${
                      s.dashed ? 'line-chart__line--dashed' : ''
                    }`}
                    d={linePath}
                  />

                  {/* Data points */}
                  {s.showDots !== false && s.data.map((value, i) => {
                    const x = (i / (s.data.length - 1)) * 720;
                    const y = 360 - ((value - chartData.yMin) / (chartData.yMax - chartData.yMin)) * 360;
                    return (
                      <circle
                        key={i}
                        className={`line-chart__dot line-chart__dot--${s.color || 'accent'}`}
                        cx={x}
                        cy={y}
                        r="4"
                      >
                        <title>{`${s.name}: ${formatYValue(value)}`}</title>
                      </circle>
                    );
                  })}
                </g>
              );
            })}

            {/* X-axis labels */}
            {showXAxis && (
              <g className="line-chart__x-axis" transform="translate(0, 370)">
                {labels.map((label, i) => {
                  const x = (i / (labels.length - 1)) * 720;
                  return (
                    <text
                      key={i}
                      className="line-chart__label line-chart__label--x"
                      x={x}
                      y="0"
                    >
                      {label}
                    </text>
                  );
                })}
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default LineChart;