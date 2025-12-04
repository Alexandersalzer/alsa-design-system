// ===============================================
// src/design-system/components/data/DonutChart/DonutChart.tsx
// DONUT CHART COMPONENT - PIE/DONUT CHARTS
// With center text and interactive legend
// ===============================================

import React, { useMemo } from 'react';
import './DonutChart.css';

export interface DonutChartDataPoint {
  label: string;
  value: number;
  color?: 'accent' | 'error' | 'success' | 'warning' | 'info';
}

export interface DonutChartProps {
  /** Chart title */
  title?: string;
  /** Chart subtitle */
  subtitle?: string;
  /** Data points */
  data: DonutChartDataPoint[];
  /** Inner radius (0 = pie, 0.5 = donut) */
  innerRadius?: number;
  /** Show labels on slices */
  showLabels?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Show values */
  showValues?: boolean;
  /** Value formatter */
  valueFormatter?: (value: number) => string;
  /** Size in pixels */
  size?: number;
  /** Show center text (for donut) */
  centerText?: string;
  /** Center subtext */
  centerSubtext?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  title,
  subtitle,
  data,
  innerRadius = 0.6,
  showLabels = true,
  showLegend = true,
  showValues = false,
  valueFormatter,
  size = 300,
  centerText,
  centerSubtext,
}) => {
  const chartData = useMemo(() => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    
    let currentAngle = -90; // Start at top
    const slices = data.map((d, i) => {
      const percentage = (d.value / total) * 100;
      const angle = (d.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      currentAngle = endAngle;
      
      return {
        ...d,
        percentage,
        startAngle,
        endAngle,
        color: d.color || (['accent', 'success', 'info', 'warning', 'error'][i % 5] as any),
      };
    });
    
    return { slices, total };
  }, [data]);

  const formatValue = (value: number): string => {
    if (valueFormatter) return valueFormatter(value);
    return value.toLocaleString();
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    ].join(' ');
  };

  const describeSlice = (centerX: number, centerY: number, outerRadius: number, innerRadius: number, startAngle: number, endAngle: number) => {
    const outerStart = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const outerEnd = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const innerStart = polarToCartesian(centerX, centerY, innerRadius, startAngle);
    const innerEnd = polarToCartesian(centerX, centerY, innerRadius, endAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    const path = [
      'M', outerStart.x, outerStart.y,
      'A', outerRadius, outerRadius, 0, largeArcFlag, 1, outerEnd.x, outerEnd.y,
      'L', innerEnd.x, innerEnd.y,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 0, innerStart.x, innerStart.y,
      'Z',
    ].join(' ');
    
    return path;
  };

  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size / 2 - 20;
  const innerRadiusValue = outerRadius * innerRadius;

  return (
    <div className="donut-chart">
      {(title || subtitle) && (
        <div className="donut-chart__header">
          {title && <h3 className="donut-chart__title">{title}</h3>}
          {subtitle && <p className="donut-chart__subtitle">{subtitle}</p>}
        </div>
      )}

      <div className="donut-chart__container">
        <svg
          className="donut-chart__svg"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <g>
            {chartData.slices.map((slice, i) => {
              const path = describeSlice(
                centerX,
                centerY,
                outerRadius,
                innerRadiusValue,
                slice.startAngle,
                slice.endAngle
              );

              const labelAngle = (slice.startAngle + slice.endAngle) / 2;
              const labelRadius = outerRadius + 15;
              const labelPos = polarToCartesian(centerX, centerY, labelRadius, labelAngle);

              return (
                <g key={i}>
                  <path
                    className={`donut-chart__slice donut-chart__slice--${slice.color}`}
                    d={path}
                  >
                    <title>{`${slice.label}: ${formatValue(slice.value)} (${slice.percentage.toFixed(1)}%)`}</title>
                  </path>
                  
                  {showLabels && slice.percentage > 5 && (
                    <text
                      className="donut-chart__label"
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor={labelPos.x > centerX ? 'start' : 'end'}
                      dominantBaseline="middle"
                    >
                      {slice.percentage.toFixed(1)}%
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Center text for donut */}
          {innerRadius > 0 && (centerText || centerSubtext) && (
            <g>
              {centerText && (
                <text
                  className="donut-chart__center-text"
                  x={centerX}
                  y={centerSubtext ? centerY - 10 : centerY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {centerText}
                </text>
              )}
              {centerSubtext && (
                <text
                  className="donut-chart__center-subtext"
                  x={centerX}
                  y={centerY + 15}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {centerSubtext}
                </text>
              )}
            </g>
          )}
        </svg>
      </div>

      {showLegend && (
        <div className="donut-chart__legend">
          {chartData.slices.map((slice, i) => (
            <div key={i} className="donut-chart__legend-item">
              <span className={`donut-chart__legend-marker donut-chart__legend-marker--${slice.color}`} />
              <span className="donut-chart__legend-label">{slice.label}</span>
              {showValues && (
                <span className="donut-chart__legend-value">
                  {formatValue(slice.value)} ({slice.percentage.toFixed(1)}%)
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonutChart;