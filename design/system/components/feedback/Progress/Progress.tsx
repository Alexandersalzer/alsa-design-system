
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
  className?: string;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({
    value,
    size = 'md',
    color = 'accent',
    rounded = false,
    animated = false,
    className,
    ...props
  }, ref) => {
    const clampedValue = Math.max(0, Math.min(100, value));

    const progressClasses = cn(
      'progress',
      `progress--size-${size}`,
      `progress--color-${color}`,
      rounded && 'progress--rounded',
      animated && 'progress--animated',
      className
    );

    return (
      <div
        ref={ref}
        className={progressClasses}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        <div
          className="progress__indicator"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

