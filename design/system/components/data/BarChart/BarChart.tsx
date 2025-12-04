// ===============================================
// src/design-system/components/data/BarChart/BarChart.tsx
// BAR CHART COMPONENT - VERTICAL/HORIZONTAL
// Supports grouped and stacked variants
// ===============================================

import React, { useMemo } from 'react';
import './BarChart.css';

export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: 'accent' | 'error' | 'success' | 'warning' | 'info';
}

export interface BarChartSeries {
  name: string;
  data: number[];
  color?: 'accent' | 'error' | 'success' | 'warning' | 'info';
}

export interface BarChartProps {
  /** Chart title */
  title?: string;
  /** Chart subtitle */
  subtitle?: string;
  /** Data points (simple mode) */
  data?: BarChartDataPoint[];
  /** Multiple series (grouped/stacked mode) */
  series?: BarChartSeries[];
  /** Labels for grouped/stacked charts */
  labels?: string[];
  /** Chart height */
  height?: number;
  /** Horizontal or vertical bars */
  orientation?: 'horizontal' | 'vertical';
  /** Show grid lines */
  showGrid?: boolean;
  /** Show values on bars */
  showValues?: boolean;
  /** Value formatter */
  valueFormatter?: (value: number) => string;
  /** Bar grouping mode */
  variant?: 'simple' | 'grouped' | 'stacked';
  /** Responsive */
  responsive?: boolean;
  /** Aspect ratio */
  aspectRatio?: string;
  /** Show legend */
  showLegend?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  title,
  subtitle,
  data,
  series,
  labels,
  height = 300,
  orientation = 'vertical',
  showGrid = true,
  showValues = false,
  valueFormatter,
  variant = 'simple',
  responsive = true,
  aspectRatio = '4/3',
  showLegend = true,
}) => {
  const chartData = useMemo(() => {
    let maxValue = 0;
    let items: Array<{ label: string; values: number[]; colors: string[] }> = [];

    if (variant === 'simple' && data) {
      maxValue = Math.max(...data.map(d => d.value));
      items = data.map(d => ({
        label: d.label,
        values: [d.value],
        colors: [d.color || 'accent'],
      }));
    } else if (series && labels) {
      if (variant === 'stacked') {
        const sums = labels.map((_, i) => 
          series.reduce((sum, s) => sum + s.data[i], 0)
        );
        maxValue = Math.max(...sums);
        items = labels.map((label, i) => ({
          label,
          values: series.map(s => s.data[i]),
          colors: series.map(s => s.color || 'accent'),
        }));
      } else {
        maxValue = Math.max(...series.flatMap(s => s.data));
        items = labels.map((label, i) => ({
          label,
          values: series.map(s => s.data[i]),
          colors: series.map(s => s.color || 'accent'),
        }));
      }
    }

    return { maxValue, items };
  }, [data, series, labels, variant]);

  const formatValue = (value: number): string => {
    if (valueFormatter) return valueFormatter(value);
    return value.toLocaleString();
  };

  const isHorizontal = orientation === 'horizontal';
  const padding = { top: 40, right: 40, bottom: 60, left: isHorizontal ? 100 : 60 };
  const chartWidth = 800;
  const chartHeight = 400;
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  const { maxValue, items } = chartData;

  return (
    <div 
      className={`bar-chart bar-chart--${orientation} ${responsive ? 'bar-chart--responsive' : ''}`}
      style={{ 
        height: responsive ? undefined : `${height}px`,
        aspectRatio: responsive ? aspectRatio : undefined 
      }}
    >
      {(title || subtitle) && (
        <div className="bar-chart__header">
          {title && <h3 className="bar-chart__title">{title}</h3>}
          {subtitle && <p className="bar-chart__subtitle">{subtitle}</p>}
        </div>
      )}

      {showLegend && series && series.length > 1 && (
        <div className="bar-chart__legend">
          {series.map((s, i) => (
            <div key={i} className="bar-chart__legend-item">
              <span className={`bar-chart__legend-marker bar-chart__legend-marker--${s.color || 'accent'}`} />
              <span className="bar-chart__legend-label">{s.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="bar-chart__container">
        <svg
          className="bar-chart__svg"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Grid lines */}
            {showGrid && (
              <g className="bar-chart__grid">
                {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
                  if (isHorizontal) {
                    const x = tick * plotWidth;
                    return (
                      <line
                        key={i}
                        className="bar-chart__grid-line"
                        x1={x}
                        y1="0"
                        x2={x}
                        y2={plotHeight}
                      />
                    );
                  } else {
                    const y = plotHeight - tick * plotHeight;
                    return (
                      <line
                        key={i}
                        className="bar-chart__grid-line"
                        x1="0"
                        y1={y}
                        x2={plotWidth}
                        y2={y}
                      />
                    );
                  }
                })}
              </g>
            )}

            {/* Bars */}
            {items.map((item, itemIndex) => {
              const barCount = item.values.length;
              const categorySize = isHorizontal ? plotHeight / items.length : plotWidth / items.length;
              const barWidth = (categorySize * 0.8) / (variant === 'grouped' ? barCount : 1);
              const barGap = categorySize * 0.1;

              if (variant === 'stacked') {
                let stackOffset = 0;
                return item.values.map((value, valueIndex) => {
                  const barSize = (value / maxValue) * (isHorizontal ? plotWidth : plotHeight);
                  const color = item.colors[valueIndex];

                  let barX, barY, barW, barH;

                  if (isHorizontal) {
                    barX = stackOffset;
                    barY = itemIndex * categorySize + barGap;
                    barW = barSize;
                    barH = categorySize * 0.8;
                  } else {
                    barX = itemIndex * categorySize + barGap;
                    barY = plotHeight - stackOffset - barSize;
                    barW = categorySize * 0.8;
                    barH = barSize;
                  }

                  stackOffset += barSize;

                  return (
                    <rect
                      key={`${itemIndex}-${valueIndex}`}
                      className={`bar-chart__bar bar-chart__bar--${color}`}
                      x={barX}
                      y={barY}
                      width={barW}
                      height={barH}
                      rx="4"
                    >
                      <title>{`${item.label}: ${formatValue(value)}`}</title>
                    </rect>
                  );
                });
              } else {
                return item.values.map((value, valueIndex) => {
                  const barSize = (value / maxValue) * (isHorizontal ? plotWidth : plotHeight);
                  const color = item.colors[valueIndex];
                  const offset = variant === 'grouped' ? valueIndex * barWidth : 0;

                  let barX, barY, barW, barH;

                  if (isHorizontal) {
                    barX = 0;
                    barY = itemIndex * categorySize + barGap + offset;
                    barW = barSize;
                    barH = barWidth;
                  } else {
                    barX = itemIndex * categorySize + barGap + offset;
                    barY = plotHeight - barSize;
                    barW = barWidth;
                    barH = barSize;
                  }

                  return (
                    <rect
                      key={`${itemIndex}-${valueIndex}`}
                      className={`bar-chart__bar bar-chart__bar--${color}`}
                      x={barX}
                      y={barY}
                      width={barW}
                      height={barH}
                      rx="4"
                    >
                      <title>{`${item.label}: ${formatValue(value)}`}</title>
                    </rect>
                  );
                });
              }
            })}

            {/* Labels */}
            <g className="bar-chart__labels">
              {items.map((item, i) => {
                const categorySize = isHorizontal ? plotHeight / items.length : plotWidth / items.length;
                const pos = i * categorySize + categorySize / 2;

                if (isHorizontal) {
                  return (
                    <text
                      key={i}
                      className="bar-chart__label"
                      x="-10"
                      y={pos}
                      textAnchor="end"
                      dominantBaseline="middle"
                    >
                      {item.label}
                    </text>
                  );
                } else {
                  return (
                    <text
                      key={i}
                      className="bar-chart__label"
                      x={pos}
                      y={plotHeight + 20}
                      textAnchor="middle"
                      dominantBaseline="hanging"
                    >
                      {item.label}
                    </text>
                  );
                }
              })}
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default BarChart;