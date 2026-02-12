// ===============================================
// NumberDisplay Component
// Displays numbers with button-like variants using Label typography
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { Box } from '../../layout/box/Box';
import { Label } from '../../Typography/Typography';

export type NumberDisplaySize = 'sm' | 'md' | 'lg' | 'xl';
export type NumberDisplayVariant = 'brand' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'raised';
export type NumberDisplayShape = 'square' | 'rounded' | 'circle';

export interface NumberDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  size?: NumberDisplaySize;
  variant?: NumberDisplayVariant;
  shape?: NumberDisplayShape;
  className?: string;
}

// Map NumberDisplay sizes to Label typography sizes and box dimensions
const SIZE_MAP: Record<NumberDisplaySize, {
  width: number;
  height: number;
  labelSize: 'xs' | 'sm' | 'md' | 'lg';
}> = {
  sm: { width: 32, height: 32, labelSize: 'xs' },
  md: { width: 48, height: 48, labelSize: 'md' },
  lg: { width: 56, height: 56, labelSize: 'lg' },
  xl: { width: 64, height: 64, labelSize: 'lg' },
};

export const NumberDisplay = forwardRef<HTMLDivElement, NumberDisplayProps>(
  ({ value, size = 'md', variant = 'raised', shape = 'rounded', className, ...props }, ref) => {
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
          flexShrink: 0,
        }}
        role="img"
        aria-label={`Number ${value}`}
        {...props}
      >
        <Label
          size={sizeConfig.labelSize}
          weight="extrabold"
          className="number-display-value"
        >
          {value}
        </Label>
      </Box>
    );
  }
);

NumberDisplay.displayName = 'NumberDisplay';

export default NumberDisplay;
