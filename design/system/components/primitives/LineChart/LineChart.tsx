// ===============================================
// src/design-system/components/primitives/LineChart/LineChart.tsx
// BEAUTIFUL LINE CHART COMPONENT WITH SMOOTH ANIMATIONS
// ===============================================

import React, { forwardRef, useMemo, useRef, useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import './LineChart.css';

export interface LineChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
}

export interface LineChartDataset {
  label: string;
  data: LineChartDataPoint[];
  color?: string;
  strokeWidth?: number;
  showPoints?: boolean;
  showArea?: boolean;
  areaOpacity?: number;
}

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: LineChartDataset[];
  title?: string;
  height?: number;
  width?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  loading?: boolean;
  className?: string;
  // Animation properties
  animate?: boolean;
  animationDuration?: number;
  // Responsive properties
  responsive?: boolean;
  // Custom styling
  gridColor?: string;
  axisColor?: string;
  textColor?: string;
}

export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
  ({
    data,
    title,
    height = 300,
    width,
    showGrid = true,
    showLegend = true,
    showTooltip = true,
    loading = false,
    className,
    animate = true,
    animationDuration = 1000,
    responsive = true,
    gridColor = 'hsl(var(--border))',
    axisColor = 'hsl(var(--text-secondary))',
    textColor = 'hsl(var(--text-primary))',
    ...props
  }, ref) => {
    // Sanitize label for use as CSS ID
    const sanitizeId = (label: string) => {
      return label
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    };
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: width || 600, height });
    const [hoveredPoint, setHoveredPoint] = useState<{ dataset: number; point: number } | null>(null);

    // Calculate chart dimensions and margins
    const margin = { top: 20, right: 40, bottom: 40, left: 60 };
    const chartWidth = dimensions.width - margin.left - margin.right;
    const chartHeight = dimensions.height - margin.top - margin.bottom;

    // Process data and calculate scales
    const processedData = useMemo(() => {
      if (!data.length) return { allPoints: [], xScale: [], yScale: { min: 0, max: 100 } };

      // Flatten all data points
      const allPoints = data.flatMap(dataset => dataset.data);
      
      // Get unique x values and sort them
      const xValues = [...new Set(allPoints.map(point => point.x))].sort((a, b) => {
        if (typeof a === 'string' && typeof b === 'string') {
          return new Date(a).getTime() - new Date(b).getTime();
        }
        return Number(a) - Number(b);
      });

      // Calculate y scale
      const yValues = allPoints.map(point => point.y);
      const yMin = Math.min(...yValues);
      const yMax = Math.max(...yValues);
      const yPadding = (yMax - yMin) * 0.1; // 10% padding

      return {
        allPoints,
        xScale: xValues,
        yScale: {
          min: Math.max(0, yMin - yPadding),
          max: yMax + yPadding
        }
      };
    }, [data]);

    // Generate SVG path for line
    const generatePath = (dataset: LineChartDataset, animated: boolean = false) => {
      const { xScale, yScale } = processedData;
      
      const points = xScale.map(x => {
        const point = dataset.data.find(p => p.x === x);
        const xPos = margin.left + (xScale.indexOf(x) / (xScale.length - 1)) * chartWidth;
        const yPos = margin.top + chartHeight - ((point?.y || 0) - yScale.min) / (yScale.max - yScale.min) * chartHeight;
        return `${xPos},${yPos}`;
      }).join(' L');

      const path = `M ${points}`;
      
      if (animated && animate) {
        // Create animated path
        const sanitizedId = sanitizeId(dataset.label);
        const pathElement = svgRef.current?.querySelector(`#path-${sanitizedId}`) as SVGPathElement;
        const pathLength = pathElement?.getTotalLength() || 0;
        return (
          <path
            id={`path-${sanitizedId}`}
            d={path}
            fill="none"
            stroke={dataset.color || 'hsl(var(--primary))'}
            strokeWidth={dataset.strokeWidth || 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength}
            style={{
              animation: `drawLine ${animationDuration}ms ease-in-out forwards`
            }}
          />
        );
      }

      return (
        <path
          d={path}
          fill="none"
          stroke={dataset.color || 'hsl(var(--primary))'}
          strokeWidth={dataset.strokeWidth || 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    };

    // Generate area path for filled areas
    const generateAreaPath = (dataset: LineChartDataset) => {
      const { xScale, yScale } = processedData;
      
      const points = xScale.map(x => {
        const point = dataset.data.find(p => p.x === x);
        const xPos = margin.left + (xScale.indexOf(x) / (xScale.length - 1)) * chartWidth;
        const yPos = margin.top + chartHeight - ((point?.y || 0) - yScale.min) / (yScale.max - yScale.min) * chartHeight;
        return `${xPos},${yPos}`;
      });

      const topLine = points.join(' L');
      const bottomY = margin.top + chartHeight;
      const bottomLine = `${margin.left + chartWidth},${bottomY} L${margin.left},${bottomY}`;
      
      return `M ${topLine} L ${bottomLine} Z`;
    };

    // Handle responsive resizing
    useEffect(() => {
      if (!responsive || width) return;

      const handleResize = () => {
        if (svgRef.current?.parentElement) {
          const containerWidth = svgRef.current.parentElement.clientWidth;
          setDimensions(prev => ({ ...prev, width: Math.max(300, containerWidth - 40) }));
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [responsive, width]);

    // Format x-axis labels
    const formatXLabel = (value: string | number) => {
      if (typeof value === 'string') {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
          }
        } catch {}
      }
      return String(value);
    };

    // Format y-axis labels
    const formatYLabel = (value: number) => {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
      return value.toString();
    };

    if (loading) {
      return (
        <div 
          ref={ref} 
          className={cn('line-chart line-chart--loading', className)} 
          style={{ height, width }}
          {...props}
        >
          <div className="line-chart__skeleton">
            <div className="line-chart__skeleton-header" />
            <div className="line-chart__skeleton-chart" />
          </div>
        </div>
      );
    }

    return (
      <div 
        ref={ref} 
        className={cn('line-chart', className)} 
        style={{ height, width }}
        {...props}
      >
        {title && (
          <div className="line-chart__title">
            <h3 className="text-lg font-semibold" style={{ color: textColor }}>
              {title}
            </h3>
          </div>
        )}

        <div className="line-chart__container">
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="line-chart__svg"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          >
            {/* Grid lines */}
            {showGrid && (
              <g className="line-chart__grid">
                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                  <line
                    key={`h-grid-${index}`}
                    x1={margin.left}
                    y1={margin.top + ratio * chartHeight}
                    x2={margin.left + chartWidth}
                    y2={margin.top + ratio * chartHeight}
                    stroke={gridColor}
                    strokeWidth={0.5}
                    opacity={0.3}
                  />
                ))}
                
                {/* Vertical grid lines */}
                {processedData.xScale.map((_, index) => (
                  <line
                    key={`v-grid-${index}`}
                    x1={margin.left + (index / (processedData.xScale.length - 1)) * chartWidth}
                    y1={margin.top}
                    x2={margin.left + (index / (processedData.xScale.length - 1)) * chartWidth}
                    y2={margin.top + chartHeight}
                    stroke={gridColor}
                    strokeWidth={0.5}
                    opacity={0.3}
                  />
                ))}
              </g>
            )}

            {/* Areas (filled areas under lines) */}
            {data.map((dataset, datasetIndex) => (
              dataset.showArea && (
                <path
                  key={`area-${datasetIndex}`}
                  d={generateAreaPath(dataset)}
                  fill={dataset.color || 'hsl(var(--primary))'}
                  opacity={dataset.areaOpacity || 0.1}
                />
              )
            ))}

            {/* Lines */}
            {data.map((dataset, datasetIndex) => (
              <g key={`line-${datasetIndex}`}>
                {generatePath(dataset, true)}
              </g>
            ))}

            {/* Data points */}
            {data.map((dataset, datasetIndex) => (
              dataset.showPoints !== false && dataset.data.map((point, pointIndex) => {
                const xPos = margin.left + (processedData.xScale.indexOf(point.x) / (processedData.xScale.length - 1)) * chartWidth;
                const yPos = margin.top + chartHeight - ((point.y - processedData.yScale.min) / (processedData.yScale.max - processedData.yScale.min)) * chartHeight;
                
                return (
                  <circle
                    key={`point-${datasetIndex}-${pointIndex}`}
                    cx={xPos}
                    cy={yPos}
                    r={4}
                    fill={dataset.color || 'hsl(var(--primary))'}
                    stroke="white"
                    strokeWidth={2}
                    className="line-chart__point"
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={() => setHoveredPoint({ dataset: datasetIndex, point: pointIndex })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })
            ))}

            {/* X-axis */}
            <g className="line-chart__x-axis">
              {processedData.xScale.map((value, index) => (
                <text
                  key={`x-label-${index}`}
                  x={margin.left + (index / (processedData.xScale.length - 1)) * chartWidth}
                  y={dimensions.height - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fill={axisColor}
                >
                  {formatXLabel(value)}
                </text>
              ))}
            </g>

            {/* Y-axis */}
            <g className="line-chart__y-axis">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const value = processedData.yScale.min + ratio * (processedData.yScale.max - processedData.yScale.min);
                return (
                  <text
                    key={`y-label-${index}`}
                    x={margin.left - 10}
                    y={margin.top + ratio * chartHeight + 4}
                    textAnchor="end"
                    fontSize="12"
                    fill={axisColor}
                  >
                    {formatYLabel(value)}
                  </text>
                );
              })}
            </g>

            {/* Tooltip */}
            {showTooltip && hoveredPoint && (
              <g className="line-chart__tooltip">
                <rect
                  x={margin.left + (processedData.xScale.indexOf(data[hoveredPoint.dataset].data[hoveredPoint.point].x) / (processedData.xScale.length - 1)) * chartWidth - 30}
                  y={margin.top + chartHeight - ((data[hoveredPoint.dataset].data[hoveredPoint.point].y - processedData.yScale.min) / (processedData.yScale.max - processedData.yScale.min)) * chartHeight - 40}
                  width={60}
                  height={30}
                  fill="rgba(0, 0, 0, 0.8)"
                  rx={4}
                />
                <text
                  x={margin.left + (processedData.xScale.indexOf(data[hoveredPoint.dataset].data[hoveredPoint.point].x) / (processedData.xScale.length - 1)) * chartWidth}
                  y={margin.top + chartHeight - ((data[hoveredPoint.dataset].data[hoveredPoint.point].y - processedData.yScale.min) / (processedData.yScale.max - processedData.yScale.min)) * chartHeight - 20}
                  textAnchor="middle"
                  fontSize="11"
                  fill="white"
                >
                  {data[hoveredPoint.dataset].data[hoveredPoint.point].y.toLocaleString('sv-SE')}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Legend */}
        {showLegend && data.length > 1 && (
          <div className="line-chart__legend">
            {data.map((dataset, index) => (
              <div key={`legend-${index}`} className="line-chart__legend-item">
                <div 
                  className="line-chart__legend-color" 
                  style={{ backgroundColor: dataset.color || 'hsl(var(--primary))' }}
                />
                <span className="line-chart__legend-label" style={{ color: textColor }}>
                  {dataset.label}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    );
  }
);

LineChart.displayName = 'LineChart';
