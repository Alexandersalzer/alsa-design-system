// ===============================================
// AppIconGrid Component
// Responsive grid layout för app-ikoner
// ===============================================

import React, { forwardRef } from 'react';
import { Grid, GridProps } from '../layout/grid/Grid';
import { cn } from '../../../utils/cn';
import './AppIconGrid.css';

export interface AppIconGridProps extends Omit<GridProps, 'cardDensity' | 'minItemWidth'> {
  /**
   * Grid density för app-ikoner
   */
  density?: 'compact' | 'standard' | 'spacious';
  /**
   * Custom className
   */
  className?: string;
}

export const AppIconGrid = forwardRef<HTMLDivElement, AppIconGridProps>(({
  density = 'standard',
  gap = 'lg',
  className,
  ...props
}, ref) => {
  // Beräkna minItemWidth baserat på density
  const minItemWidthMap = {
    compact: '120px',
    standard: '140px',
    spacious: '160px',
  };

  const classes = cn(
    'app-icon-grid',
    `app-icon-grid--${density}`,
    className
  );

  return (
    <Grid
      ref={ref}
      minItemWidth={minItemWidthMap[density]}
      gap={gap}
      className={classes}
      {...props}
    />
  );
});

AppIconGrid.displayName = 'AppIconGrid';

