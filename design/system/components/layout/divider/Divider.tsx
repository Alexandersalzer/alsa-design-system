// ===============================================
// LOCATION: design/system/components/layout/utilities/divider/Divider.tsx
// Divider - Visual separator component
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import './Divider.css';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /** Divider orientation */
  orientation?: 'horizontal' | 'vertical';
  
  /** Visual weight/thickness */
  weight?: 'default' | 'strong' | 'emphasis';
  
  /** Spacing around the divider */
  spacing?: 'sm' | 'md' | 'lg';
  
  /** Optional text label */
  label?: string;
  
  /** Label position (only for horizontal dividers) */
  labelPosition?: 'left' | 'center' | 'right';
  
  /** Additional CSS classes */
  className?: string;
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(({
  orientation = 'horizontal',
  weight = 'default',
  spacing = 'md',
  label,
  labelPosition = 'center',
  className,
  ...props
}, ref) => {
  // If there's a label, we need a different structure
  if (label && orientation === 'horizontal') {
    return (
      <div
        className={cn(
          'divider-container',
          `divider-container--${spacing}`,
          `divider-container--${labelPosition}`,
          className
        )}
        role="separator"
      >
        <hr
          ref={ref}
          className={cn(
            'divider',
            `divider--${weight}`
          )}
          {...props}
        />
        <span className="divider-label">
          {label}
        </span>
        <hr
          className={cn(
            'divider',
            `divider--${weight}`
          )}
        />
      </div>
    );
  }

  // Simple divider without label
  return (
    <hr
      ref={ref}
      className={cn(
        'divider',
        `divider--${orientation}`,
        `divider--${weight}`,
        `divider--spacing-${spacing}`,
        className
      )}
      role="separator"
      {...props}
    />
  );
});

Divider.displayName = 'Divider';