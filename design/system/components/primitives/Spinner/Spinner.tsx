// ===============================================
// LOCATION: design/system/components/layout/utilities/spinner/Spinner.tsx
// Spinner - Visual loading indicator component
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';


export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spinner size */
  size?: 'inherit' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /** Custom color (overrides semantic accent) */
  color?: string;

  /** Track color (defaults to subtle border color) */
  trackColor?: string;

  /** Border thickness */
  thickness?: string | number;

  /** Spin speed (e.g. '0.45s', '1s') */
  animationDuration?: string;

  /** Optional accessibility label */
  label?: string;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      color,
      trackColor,
      thickness,
      animationDuration = '0.45s',
      label,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const spinnerStyle: React.CSSProperties = {
      '--spinner-color': color || 'var(--accent-500)',
      '--spinner-track-color': trackColor || 'var(--border-subtle)',
      '--spinner-duration': animationDuration,
      borderWidth: thickness,
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label || 'Loading'}
        className={cn('spinner', `spinner--${size}`, className)}
        style={spinnerStyle}
        {...props}
      >
        {label && <span className="spinner__label">{label}</span>}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
