// ===============================================
// src/design-system/components/data/Sparkline/Sparkline.tsx
// SPARKLINE COMPONENT - TIME-AWARE MINI-CHART
// Perfect for dashboards and KPI cards
// ===============================================

import React, { useMemo, useState } from 'react';
import './Sparkline.css';

// ===== TIME-SERIES DATA MODEL =====

export interface SparklineDatum {
  /** ISO timestamp or date string */
  timestamp: string;
  /** Numeric value */
  value: number;
}

export interface SparklineProps {
  /** Data values - supports both simple number[] (legacy) and time-series SparklineDatum[] */
  data: number[] | SparklineDatum[];

  // ===== DIMENSIONS =====
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;

  // ===== TIME-SERIES CONFIG (New) =====
  /** Time range context - triggers smart defaults */
  timeRange?: 'day' | 'week' | 'month' | 'year';
  /** How to bucket time data */
  bucketBy?: 'hour' | 'day' | 'week' | 'month';
  /** Maximum data points to render (auto-aggregates if exceeded) */
  maxPoints?: number;
  /** Aggregation strategy when bucketing */
  aggregation?: 'sum' | 'average';

  // ===== Y-AXIS CONFIG =====
  /** Y-axis step for human-friendly rounding (default: 25) */
  yAxisStep?: number;
  /** Show subtle grid lines */
  showGrid?: boolean;
  /** Number of grid lines (default: 4) */
  gridLines?: number;
  /** Show numeric scale labels */
  showScale?: boolean;
  /** Format scale labels */
  scaleFormatter?: (value: number) => string;

  // ===== X-AXIS CONFIG (New) =====
  /** Show time labels below chart */
  showXAxis?: boolean;
  /** Custom X-axis label formatter */
  xAxisFormatter?: (date: Date, bucket: string) => string;

  // ===== INTERACTION (New) =====
  /** Enable hover tooltip with date + value */
  showTooltip?: boolean;

  // ===== VISUAL CONFIG =====
  /** Show area fill */
  showArea?: boolean;
  /** Smooth curve */
  smooth?: boolean;
  /** Color variant */
  color?: 'accent' | 'error' | 'success' | 'warning' | 'info';

  // ===== HEADER CONFIG =====
  /** Show current value */
  showValue?: boolean;
  /** Value label */
  valueLabel?: string;
  /** Value formatter */
  valueFormatter?: (value: number) => string;
  /** Show trend indicator */
  showTrend?: boolean;

  /** Custom className */
  className?: string;
}

// ===== HELPER FUNCTIONS =====

/** Check if data is time-series format */
const isTimeSeries = (data: number[] | SparklineDatum[]): data is SparklineDatum[] => {
  return data.length > 0 && typeof data[0] === 'object' && 'timestamp' in data[0];
};

/** Calculate human-friendly Y-axis bounds */
const calculateNiceScale = (min: number, max: number, step: number) => {
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  return { niceMin, niceMax };
};

/** Get smart default bucket based on time range */
const getDefaultBucket = (timeRange?: string): 'hour' | 'day' | 'week' | 'month' => {
  switch (timeRange) {
    case 'day': return 'hour';
    case 'week': return 'day';
    case 'month': return 'day';
    case 'year': return 'month';
    default: return 'day';
  }
};

/** Bucket and aggregate time-series data */
const bucketData = (
  data: SparklineDatum[],
  bucketBy: 'hour' | 'day' | 'week' | 'month',
  aggregation: 'sum' | 'average' = 'sum'
): SparklineDatum[] => {
  const buckets = new Map<string, number[]>();

  data.forEach(datum => {
    const date = new Date(datum.timestamp);
    let key: string;

    switch (bucketBy) {
      case 'hour':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
        break;
      case 'day':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
    }

    if (!buckets.has(key)) {
      buckets.set(key, []);
    }
    buckets.get(key)!.push(datum.value);
  });

  const result: SparklineDatum[] = [];
  buckets.forEach((values, timestamp) => {
    const value = aggregation === 'sum'
      ? values.reduce((a, b) => a + b, 0)
      : values.reduce((a, b) => a + b, 0) / values.length;
    result.push({ timestamp, value });
  });

  return result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

/** Limit data points by aggregating if needed */
const limitDataPoints = (
  data: SparklineDatum[],
  maxPoints: number,
  aggregation: 'sum' | 'average' = 'sum'
): SparklineDatum[] => {
  if (data.length <= maxPoints) return data;

  const chunkSize = Math.ceil(data.length / maxPoints);
  const result: SparklineDatum[] = [];

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const values = chunk.map(d => d.value);
    const value = aggregation === 'sum'
      ? values.reduce((a, b) => a + b, 0)
      : values.reduce((a, b) => a + b, 0) / values.length;

    result.push({
      timestamp: chunk[0].timestamp,
      value
    });
  }

  return result;
};

/** Format X-axis label based on bucket type */
const formatXAxisLabel = (date: Date, bucketBy: 'hour' | 'day' | 'week' | 'month'): string => {
  switch (bucketBy) {
    case 'hour':
      return String(date.getHours()).padStart(2, '0');
    case 'day':
      return date.toLocaleDateString('sv-SE', { day: 'numeric' });
    case 'week':
      return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
    case 'month':
      return date.toLocaleDateString('sv-SE', { month: 'short' });
  }
};

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 40,
  // Time-series config
  timeRange,
  bucketBy,
  maxPoints = 100,
  aggregation = 'sum',
  // Y-axis config
  yAxisStep = 25,
  showGrid = false,
  gridLines = 4,
  showScale = false,
  scaleFormatter,
  // X-axis config
  showXAxis = false,
  xAxisFormatter,
  // Interaction
  showTooltip = false,
  // Visual config
  showArea = true,
  smooth = true,
  color = 'accent',
  // Header config
  showValue = false,
  valueLabel,
  valueFormatter,
  showTrend = false,
  className = '',
}) => {
  // Hover state for tooltip
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    // Step 1: Detect data format and normalize to time-series
    let processedData: SparklineDatum[];

    if (isTimeSeries(data)) {
      // Already time-series format
      processedData = [...data];
    } else {
      // Legacy number[] format - create synthetic timestamps
      processedData = (data as number[]).map((value, i) => ({
        timestamp: new Date(Date.now() - (data.length - 1 - i) * 24 * 60 * 60 * 1000).toISOString(),
        value
      }));
    }

    // Step 2: Apply smart bucketing if time-series
    const effectiveBucket = bucketBy || getDefaultBucket(timeRange);
    if (isTimeSeries(data) && bucketBy) {
      processedData = bucketData(processedData, effectiveBucket, aggregation);
    }

    // Step 3: Limit data points if needed
    if (processedData.length > maxPoints) {
      processedData = limitDataPoints(processedData, maxPoints, aggregation);
    }

    // Step 4: Calculate human-friendly Y-axis bounds
    const rawMin = Math.min(...processedData.map(d => d.value));
    const rawMax = Math.max(...processedData.map(d => d.value));
    const { niceMin, niceMax } = calculateNiceScale(rawMin, rawMax, yAxisStep);
    const range = niceMax - niceMin || 1;

    // Step 5: Map to points for rendering
    const points = processedData.map((datum, i) => ({
      x: (i / (processedData.length - 1 || 1)) * width,
      y: height - ((datum.value - niceMin) / range) * (height - 4) - 2,
      value: datum.value,
      timestamp: datum.timestamp
    }));

    // Step 6: Calculate grid lines using yAxisStep for human-friendly values
    const gridLineValues = [];
    if (showGrid || showScale) {
      for (let value = niceMin; value <= niceMax; value += yAxisStep) {
        gridLineValues.push(value);
      }
    }

    // Step 7: Generate X-axis labels
    const xAxisLabels: string[] = [];
    if (showXAxis) {
      const labelDensity = Math.max(1, Math.floor(processedData.length / 7)); // Max 7 labels
      processedData.forEach((datum, i) => {
        if (i % labelDensity === 0 || i === processedData.length - 1) {
          const date = new Date(datum.timestamp);
          xAxisLabels.push(
            xAxisFormatter
              ? xAxisFormatter(date, effectiveBucket)
              : formatXAxisLabel(date, effectiveBucket)
          );
        } else {
          xAxisLabels.push('');
        }
      });
    }

    // Step 8: Calculate trend
    const firstValue = processedData[0].value;
    const lastValue = processedData[processedData.length - 1].value;
    const trendPercent = firstValue !== 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
    const isPositive = trendPercent >= 0;

    return {
      points,
      min: niceMin,
      max: niceMax,
      rawMin,
      rawMax,
      lastValue,
      trendPercent,
      isPositive,
      gridLineValues,
      xAxisLabels,
      processedData,
      bucketType: effectiveBucket
    };
  }, [
    data,
    width,
    height,
    timeRange,
    bucketBy,
    maxPoints,
    aggregation,
    yAxisStep,
    showGrid,
    showScale,
    gridLines,
    showXAxis,
    xAxisFormatter
  ]);

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

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!showTooltip) return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Find nearest point
    let nearestIndex = 0;
    let minDistance = Infinity;

    chartData.points.forEach((point, i) => {
      const distance = Math.abs(point.x - x);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    });

    setHoveredIndex(nearestIndex);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const linePath = generatePath();
  const areaPath = showArea ? generateAreaPath() : '';

  const hoveredPoint = hoveredIndex !== null ? chartData.points[hoveredIndex] : null;
  const hoveredDatum = hoveredIndex !== null ? chartData.processedData[hoveredIndex] : null;

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

        <div className="sparkline__svg-container">
          <div style={{ position: 'relative' }}>
            <svg
              width={width}
              height={height}
              className={`sparkline__svg sparkline__svg--${color}`}
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
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

              {/* Hover indicator */}
              {showTooltip && hoveredPoint && (
                <circle
                  className={`sparkline__hover-dot sparkline__hover-dot--${color}`}
                  cx={hoveredPoint.x}
                  cy={hoveredPoint.y}
                  r="4"
                />
              )}
            </svg>

            {/* Tooltip */}
            {showTooltip && hoveredPoint && hoveredDatum && (
              <div
                className="sparkline__tooltip"
                style={{
                  position: 'absolute',
                  left: `${hoveredPoint.x}px`,
                  top: `${hoveredPoint.y - 40}px`,
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none'
                }}
              >
                <div className="sparkline__tooltip-date">
                  {new Date(hoveredDatum.timestamp).toLocaleDateString('sv-SE', {
                    month: 'short',
                    day: 'numeric',
                    hour: chartData.bucketType === 'hour' ? '2-digit' : undefined
                  })}
                </div>
                <div className="sparkline__tooltip-value">
                  {formatValue(hoveredDatum.value)}
                </div>
              </div>
            )}
          </div>

          {/* X-axis labels */}
          {showXAxis && chartData.xAxisLabels.length > 0 && (
            <div className="sparkline__x-axis" style={{ width }}>
              {chartData.xAxisLabels.map((label, i) => (
                <span key={`x-label-${i}`} className="sparkline__x-axis-label">
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sparkline;