// ===============================================
// src/design-system/components/data/Sparkline/Sparkline.tsx
// SPARKLINE COMPONENT - COMPACT MINI-CHART
// Perfect for dashboards and KPI cards
// ===============================================

import React, { useMemo } from 'react';
import './Sparkline.css';

export interface SparklineProps {
  /** Data values to display */
  data: number[];
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Show area fill */
  showArea?: boolean;
  /** Smooth curve */
  smooth?: boolean;
  /** Color variant */
  color?: 'accent' | 'error' | 'success' | 'warning' | 'info';
  /** Show current value */
  showValue?: boolean;
  /** Value label */
  valueLabel?: string;
  /** Value formatter */
  valueFormatter?: (value: number) => string;
  /** Show trend indicator */
  showTrend?: boolean;
  /** Show subtle grid lines */
  showGrid?: boolean;
  /** Number of grid lines (default: 3 for min/mid/max) */
  gridLines?: number;
  /** Show numeric scale labels */
  showScale?: boolean;
  /** Format scale labels */
  scaleFormatter?: (value: number) => string;
  /** Custom className */
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 40,
  showArea = true,
  smooth = true,
  color = 'accent',
  showValue = false,
  valueLabel,
  valueFormatter,
  showTrend = false,
  showGrid = false,
  gridLines = 3,
  showScale = false,
  scaleFormatter,
  className = '',
}) => {
  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - ((value - min) / range) * (height - 4) - 2,
    }));

    // Calculate trend
    const firstValue = data[0];
    const lastValue = data[data.length - 1];
    const trendPercent = ((lastValue - firstValue) / firstValue) * 100;
    const isPositive = trendPercent >= 0;

    // Calculate grid lines (skip edges for cleaner look)
    const gridLineValues = [];
    if (showGrid && gridLines > 0) {
      // Include all values for scale display
      for (let i = 0; i <= gridLines; i++) {
        const value = min + (range / gridLines) * i;
        gridLineValues.push(value);
      }
    }

    return { points, min, max, lastValue, trendPercent, isPositive, gridLineValues };
  }, [data, width, height, showGrid, gridLines]);

  if (!chartData || data.length === 0) {
    return <div className={`sparkline sparkline--empty ${className}`}>No data</div>;
  }

  const generatePath = (): string => {
    const { points } = chartData;
    if (!smooth || points.length < 2) {
      return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    }

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

  const generateAreaPath = (): string => {
    const linePath = generatePath();
    return `${linePath} L ${width},${height} L 0,${height} Z`;
  };

  const formatValue = (value: number): string => {
    if (valueFormatter) return valueFormatter(value);
    return value.toLocaleString();
  };

  const linePath = generatePath();
  const areaPath = showArea ? generateAreaPath() : '';

  return (
    <div className={`sparkline ${className}`}>
      {(showValue || showTrend) && (
        <div className="sparkline__header">
          {showValue && (
            <div className="sparkline__value-container">
              {valueLabel && (
                <span className="sparkline__value-label">{valueLabel}</span>
              )}
              <span className={`sparkline__value sparkline__value--${color}`}>
                {formatValue(chartData.lastValue)}
              </span>
            </div>
          )}
          {showTrend && (
            <div className={`sparkline__trend sparkline__trend--${chartData.isPositive ? 'positive' : 'negative'}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" className="sparkline__trend-icon">
                {chartData.isPositive ? (
                  <path d="M6 3 L9 6 L6 6 L6 9 L6 6 L3 6 Z" />
                ) : (
                  <path d="M6 9 L9 6 L6 6 L6 3 L6 6 L3 6 Z" />
                )}
              </svg>
              <span className="sparkline__trend-value">
                {Math.abs(chartData.trendPercent).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      )}

      <div className="sparkline__chart-wrapper">
        {showScale && chartData && chartData.gridLineValues.length > 0 && (
          <div
            className="sparkline__scale"
            style={{ height }}
          >
            {chartData.gridLineValues
              .slice()
              .reverse()
              .map((value, index) => (
                <span
                  key={`scale-${index}`}
                  className="sparkline__scale-label"
                >
                  {scaleFormatter ? scaleFormatter(value) : Math.round(value)}
                </span>
              ))}
          </div>
        )}

        <svg
          width={width}
          height={height}
          className={`sparkline__svg sparkline__svg--${color}`}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`sparkline-gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className={`sparkline__gradient-start sparkline__gradient-start--${color}`} />
              <stop offset="100%" className="sparkline__gradient-end" />
            </linearGradient>
          </defs>

          {showGrid && chartData && chartData.gridLineValues.length > 0 && (
            <g className="sparkline__grid">
              {chartData.gridLineValues
                .slice(1, -1)
                .map((value, index) => {
                  const min = chartData.min;
                  const max = chartData.max;
                  const range = max - min || 1;
                  const yPos = height - ((value - min) / range) * (height - 4) - 2;
                  return (
                    <line
                      key={`grid-${index}`}
                      className="sparkline__grid-line"
                      x1="0"
                      y1={yPos}
                      x2={width}
                      y2={yPos}
                    />
                  );
                })}
            </g>
          )}

          {showArea && (
            <path
              className={`sparkline__area sparkline__area--${color}`}
              d={areaPath}
              fill={`url(#sparkline-gradient-${color})`}
            />
          )}

          <path
            className={`sparkline__line sparkline__line--${color}`}
            d={linePath}
          />
        </svg>
      </div>
    </div>
  );
};

export default Sparkline;