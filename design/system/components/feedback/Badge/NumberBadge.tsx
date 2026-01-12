// ===============================================
// design/system/components/feedback/Badge/NumberBadge.tsx
// Number badge component for displaying step numbers
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { Box } from '../../layout/box/Box';

export type NumberBadgeSize = 'sm' | 'md' | 'lg' | 'xl';
export type NumberBadgeVariant = 'solid' | 'subtle' | 'outline';
export type NumberBadgeColorPalette =
  | 'gray'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'cyan'
  | 'purple'
  | 'pink';

export interface NumberBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  size?: NumberBadgeSize;
  variant?: NumberBadgeVariant;
  colorPalette?: NumberBadgeColorPalette;
  className?: string;
}

const SIZE_MAP: Record<NumberBadgeSize, { minWidth: number; height: number; fontSize: number; padding: string }> = {
  sm: { minWidth: 32, height: 32, fontSize: 14, padding: 'var(--spacing-xs) var(--spacing-sm)' },
  md: { minWidth: 48, height: 48, fontSize: 16, padding: 'var(--spacing-sm) var(--spacing-md)' },
  lg: { minWidth: 56, height: 56, fontSize: 20, padding: 'var(--spacing-md) var(--spacing-lg)' },
  xl: { minWidth: 64, height: 64, fontSize: 24, padding: 'var(--spacing-lg) var(--spacing-xl)' },
};

export const NumberBadge = forwardRef<HTMLDivElement, NumberBadgeProps>(
  (
    {
      value,
      size = 'md',
      variant = 'solid',
      colorPalette = 'purple',
      className,
      ...props
    },
    ref
  ) => {
    const sizeStyles = SIZE_MAP[size];

    const badgeClasses = cn(
      'number-badge',
      `number-badge-${variant}`,
      `number-badge-${colorPalette}`,
      className
    );

    return (
      <Box
        ref={ref}
        display="inline-flex"
        align="center"
        justify="center"
        radius="md"
        className={badgeClasses}
        style={{
          minWidth: sizeStyles.minWidth,
          height: sizeStyles.height,
          padding: sizeStyles.padding,
          fontSize: sizeStyles.fontSize,
          fontWeight: 'var(--font-weight-bold)',
          lineHeight: 1,
        }}
        {...props}
      >
        {value}
      </Box>
    );
  }
);

NumberBadge.displayName = 'NumberBadge';

export default NumberBadge;
