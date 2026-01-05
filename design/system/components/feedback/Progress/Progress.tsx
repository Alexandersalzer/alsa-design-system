
// ===============================================
// Progress.tsx
// Progressbar för att visa framsteg
// ===============================================

'use client';

import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import './Progress.css';

export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';
export type ProgressColor = 'accent' | 'success' | 'warning' | 'error' | 'info';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  size?: ProgressSize;
  color?: ProgressColor;
  rounded?: boolean;
  animated?: boolean;
  /** Label text shown above progress bar */
  label?: string;
  /** Whether to show percentage value */
  showValue?: boolean;
  /** Custom format function for value display */
  formatValue?: (value: number) => string;
  /** Position of label and value */
  labelPosition?: 'top' | 'inline';
  className?: string;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({
    value,
    size = 'md',
    color = 'accent',
    rounded = false,
    animated = false,
    label,
    showValue = false,
    formatValue,
    labelPosition = 'top',
    className,
    ...props
  }, ref) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    const displayValue = formatValue ? formatValue(clampedValue) : `${Math.round(clampedValue)}%`;

    const progressClasses = cn(
      'progress',
      `progress--size-${size}`,
      `progress--color-${color}`,
      rounded && 'progress--rounded',
      animated && 'progress--animated',
      className
    );

    const hasHeader = label || showValue;

    return (
      <div ref={ref} className="progress-wrapper">
        {hasHeader && labelPosition === 'top' && (
          <div className="progress-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--foundation-space-2)'
          }}>
            {label && <span className="progress-label" style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{label}</span>}
            {showValue && <span className="progress-value" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: `var(--${color}-500)` }}>{displayValue}</span>}
          </div>
        )}
        <div
          className={progressClasses}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
          {...props}
        >
          <div
            className="progress__indicator"
            style={{ width: `${clampedValue}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

