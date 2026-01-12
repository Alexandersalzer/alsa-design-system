// ===============================================
// LOCATION: design/system/components/layout/utilities/divider/Divider.tsx
// Divider - Visual separator component
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { Button } from '../../actions/Button/Button';
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

  /** Optional button configuration (for horizontal dividers) */
  button?: {
    content: string;
    href?: string;
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
    size?: 'sm' | 'md' | 'lg';
  };

  /** Additional CSS classes */
  className?: string;
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(({
  orientation = 'horizontal',
  weight = 'default',
  spacing = 'md',
  label,
  labelPosition = 'center',
  button,
  className,
  ...props
}, ref) => {
  // Filter out non-DOM props that shouldn't be spread to <hr>
  const { sectionKey, patternKey, componentKey, components, order, type, ...domProps } = props as any;
  // If there's a button, render divider with button in the middle
  if (button && orientation === 'horizontal') {
    return (
      <div
        className={cn(
          'divider-container',
          'divider-container--button',
          `divider-container--${spacing}`,
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
          {...domProps}
        />
        <Button
          variant={button.variant || 'secondary'}
          size={button.size || 'md'}
          href={button.href}
          className="divider-button"
        >
          {button.content}
        </Button>
        <hr
          className={cn(
            'divider',
            `divider--${weight}`
          )}
        />
      </div>
    );
  }

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
          {...domProps}
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