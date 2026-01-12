// ===============================================
// NumberDisplay Component
// Displays numbers with button-like variants
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { Box } from '../../layout/box/Box';

export type NumberDisplaySize = 'sm' | 'md' | 'lg' | 'xl';
export type NumberDisplayVariant = 'brand' | 'primary' | 'secondary' | 'accent' | 'ghost';
export type NumberDisplayShape = 'square' | 'rounded' | 'circle';

export interface NumberDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  size?: NumberDisplaySize;
  variant?: NumberDisplayVariant;
  shape?: NumberDisplayShape;
  className?: string;
}

const SIZE_MAP: Record<NumberDisplaySize, { width: number; height: number; fontSize: string }> = {
  sm: { width: 32, height: 32, fontSize: '0.875rem' },
  md: { width: 48, height: 48, fontSize: '1.125rem' },
  lg: { width: 56, height: 56, fontSize: '1.25rem' },
  xl: { width: 64, height: 64, fontSize: '1.5rem' },
};

export const NumberDisplay = forwardRef<HTMLDivElement, NumberDisplayProps>(
  ({ value, size = 'md', variant = 'primary', shape = 'circle', className, ...props }, ref) => {
    const sizeConfig = SIZE_MAP[size];

    const classes = cn(
      'number-display',
      `number-display-${variant}`,
      `number-display-${size}`,
      `number-display-${shape}`,
      className
    );

    return (
      <Box
        ref={ref}
        display="flex"
        align="center"
        justify="center"
        className={classes}
        style={{
          width: sizeConfig.width,
          height: sizeConfig.height,
          fontSize: sizeConfig.fontSize,
          flexShrink: 0,
        }}
        role="img"
        aria-label={`Number ${value}`}
        {...props}
      >
        <span className="number-display-value">{value}</span>
      </Box>
    );
  }
);

NumberDisplay.displayName = 'NumberDisplay';

export default NumberDisplay;
