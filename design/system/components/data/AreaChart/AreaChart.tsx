// ===============================================
// src/design-system/components/data/AreaChart/AreaChart.tsx
// AREA CHART COMPONENT - STACKED AREAS
// Perfect for composition over time
// ===============================================

import React, { useMemo } from 'react';
import './AreaChart.css';

export interface AreaChartSeries {
  name: string;
  data: number[];
  color?: 'accent' | 'error' | 'success' | 'warning' | 'info';
}

export interface AreaChartProps {
  /** Chart title */
  title?: string;
  /** Chart subtitle */
  subtitle?: string;
  /** Data series */
  series: AreaChartSeries[];
  /** X-axis labels */
  labels: string[];
  /** Chart height */
  height?: number;
  /** Show grid */
  showGrid?: boolean;
  /** Smooth curves */
  smooth?: boolean;
  /** Stacked mode */
  stacked?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Y-axis formatter */
  yAxisFormatter?: (value: number) => string;
  /** Responsive */
  responsive?: boolean;
  /** Aspect ratio */
  aspectRatio?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  title,
  subtitle,
  series,
  labels,
  height = 300,
  showGrid = true,
  smooth = true,
  stacked = false,
  showLegend = true,
  yAxisFormatter,
  responsive = true,
  aspectRatio = '4/3',
}) => {
  const chartData = useMemo(() => {
    let maxValue = 0;
    
    if (stacked) {
      // Calculate stacked max
      const sums = labels.map((_, i) => 
        series.reduce((sum, s) => sum + s.data[i], 0)
      );
      maxValue = Math.max(...sums);
    } else {
      maxValue = Math.max(...series.flatMap(s => s.data));
    }
    
    const range = maxValue;
    const yMin = 0;
    const yMax = maxValue + range * 0.1;
    
    const tickCount = 5;
    const step = yMax / (tickCount - 1);
    const yTicks = Array.from({ length: tickCount }, (_, i) => i * step);
    
    return { yMin, yMax, yTicks };
  }, [series, labels, stacked]);

  const formatYValue = (value: number): string => {
    if (yAxisFormatter) return yAxisFormatter(value);
    return Math.round(value).toLocaleString();
  };

  const generatePath = (data: number[], baseData?: number[]): string => {
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = 800 - padding.left - padding.right;
    const height = 400 - padding.top - padding.bottom;
    const { yMin, yMax } = chartData;

    const xStep = width / (data.length - 1);
    const points = data.map((value, i) => {
      const baseValue = baseData ? baseData[i] : 0;
      return {
        x: i * xStep,
        y: height - ((value + baseValue - yMin) / (yMax - yMin)) * height,
        baseY: height - ((baseValue - yMin) / (yMax - yMin)) * height,
      };
    });

    if (!smooth || points.length < 2) {
      let path = `M ${points[0].x},${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x},${points[i].y}`;
      }
      
      // Close the path for area
      for (let i = points.length - 1; i >= 0; i--) {
        path += ` L ${points[i].x},${points[i].baseY}`;
      }
      path += ' Z';
      
      return path;
    }

    // Smooth curve
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

    // Close path with base line
    path += ` L ${points[points.length - 1].x},${points[points.length - 1].baseY}`;
    
    if (smooth) {
      for (let i = points.length - 1; i > 0; i--) {
        const p0 = points[i === points.length - 1 ? i : i + 1];
        const p1 = points[i];
        const p2 = points[i - 1];
        const p3 = points[i === 1 ? i - 1 : i - 2];

        const cp1x = p1.x - (p0.x - p2.x) / 6;
        const cp1y = p1.baseY - (p0.baseY - p2.baseY) / 6;
        const cp2x = p2.x + (p1.x - p3.x) / 6;
        const cp2y = p2.baseY + (p1.baseY - p3.baseY) / 6;

        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.baseY}`;
      }
    } else {
      for (let i = points.length - 1; i >= 0; i--) {
        path += ` L ${points[i].x},${points[i].baseY}`;
      }
    }
    
    path += ' Z';
    
    return path;
  };

  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const plotWidth = 800 - padding.left - padding.right;
  const plotHeight = 400 - padding.top - padding.bottom;

  // Calculate cumulative data for stacking
  const cumulativeData: number[][] = [];
  if (stacked) {
    series.forEach((s, sIndex) => {
      cumulativeData[sIndex] = s.data.map((value, i) => {
        let sum = value;
        for (let j = 0; j < sIndex; j++) {
          sum += series[j].data[i];
        }
        return sum;
      });
    });
  }

  return (
    <div 
      className={`area-chart ${responsive ? 'area-chart--responsive' : ''}`}
      style={{ 
        height: responsive ? undefined : `${height}px`,
        aspectRatio: responsive ? aspectRatio : undefined 
      }}
    >
      {(title || subtitle) && (
        <div className="area-chart__header">
          {title && <h3 className="area-chart__title">{title}</h3>}
          {subtitle && <p className="area-chart__subtitle">{subtitle}</p>}
        </div>
      )}

      {showLegend && series.length > 1 && (
        <div className="area-chart__legend">
          {series.map((s, i) => (
            <div key={i} className="area-chart__legend-item">
              <span className={`area-chart__legend-marker area-chart__legend-marker--${s.color || 'accent'}`} />
              <span className="area-chart__legend-label">{s.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="area-chart__container">
        <svg
          className="area-chart__svg"
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {series.map((s, i) => (
              <linearGradient key={i} id={`area-gradient-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className={`area-chart__gradient-start area-chart__gradient-start--${s.color || 'accent'}`} />
                <stop offset="100%" className="area-chart__gradient-end" />
              </linearGradient>
            ))}
          </defs>

          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Grid */}
            {showGrid && (
              <g className="area-chart__grid">
                {chartData.yTicks.map((tick, i) => {
                  const y = plotHeight - ((tick - chartData.yMin) / (chartData.yMax - chartData.yMin)) * plotHeight;
                  return (
                    <line
                      key={i}
                      className="area-chart__grid-line"
                      x1="0"
                      y1={y}
                      x2={plotWidth}
                      y2={y}
                    />
                  );
                })}
              </g>
            )}

            {/* Y-axis labels */}
            <g className="area-chart__y-axis">
              {chartData.yTicks.map((tick, i) => {
                const y = plotHeight - ((tick - chartData.yMin) / (chartData.yMax - chartData.yMin)) * plotHeight;
                return (
                  <text
                    key={i}
                    className="area-chart__label area-chart__label--y"
                    x="-10"
                    y={y}
                  >
                    {formatYValue(tick)}
                  </text>
                );
              })}
            </g>

            {/* Areas */}
            {series.map((s, sIndex) => {
              const baseData = stacked && sIndex > 0 
                ? cumulativeData[sIndex - 1].map(v => v - s.data[0])
                : undefined;
              
              const areaPath = generatePath(
                stacked ? cumulativeData[sIndex] : s.data,
                baseData
              );

              return (
                <path
                  key={sIndex}
                  className={`area-chart__area area-chart__area--${s.color || 'accent'}`}
                  d={areaPath}
                  fill={`url(#area-gradient-${sIndex})`}
                />
              );
            })}

            {/* X-axis labels */}
            <g className="area-chart__x-axis" transform={`translate(0, ${plotHeight + 10})`}>
              {labels.map((label, i) => {
                const x = (i / (labels.length - 1)) * plotWidth;
                return (
                  <text
                    key={i}
                    className="area-chart__label area-chart__label--x"
                    x={x}
                    y="0"
                  >
                    {label}
                  </text>
                );
              })}
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default AreaChart;