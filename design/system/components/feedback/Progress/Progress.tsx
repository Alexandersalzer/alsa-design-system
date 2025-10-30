
// ===============================================
// Progress.tsx
// Progressbar för att visa framsteg
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';

export interface ProgressProps {
  value: number; // 0-100
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'accent' | 'success' | 'warning' | 'error' | 'info';
  rounded?: boolean;
  animated?: boolean;
  showLabel?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(({
  value,
  size = 'md',
  color = 'accent',
  rounded = false,
  animated = true,
  showLabel = false,
  className,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizeMap = {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px'
  };

  const colorMap = {
    accent: 'var(--accent-500)',
    success: 'var(--success-500)',
    warning: 'var(--warning-500)',
    error: 'var(--error-500)',
    info: 'var(--info-500)'
  };

  const progressClasses = cn(
    'progress',
    `progress-${size}`,
    `progress-${color}`,
    rounded && 'progress-rounded',
    animated && 'progress-animated',
    className
  );

  return (
    <>
      <style>{`
        .progress {
          width: 100%;
          background-color: var(--surface-subtle);
          overflow: hidden;
          position: relative;
        }

        .progress-xs { height: 4px; }
        .progress-sm { height: 6px; }
        .progress-md { height: 8px; }
        .progress-lg { height: 12px; }

        .progress-rounded {
          border-radius: var(--radius-full);
        }

        .progress-bar {
          height: 100%;
          transition: width 0.6s ease;
        }

        .progress-animated .progress-bar {
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .progress-rounded .progress-bar {
          border-radius: var(--radius-full);
        }
      `}</style>

      <div
        ref={ref}
        className={progressClasses}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        {...props}
      >
        <div
          className="progress-bar"
          style={{
            width: `${clampedValue}%`,
            height: sizeMap[size],
            backgroundColor: colorMap[color]
          }}
        />
      </div>
    </>
  );
});

Progress.displayName = 'Progress';

