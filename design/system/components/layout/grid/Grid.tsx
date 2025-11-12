// ===============================================
// src/design-system/components/layout/utilities/grid/Grid.tsx
// FIXED GRID COMPONENT - Responsive grid layouts with Chakra-like API
// ===============================================
import React, { ReactNode, CSSProperties } from 'react';

// ===== TYPE DEFINITIONS =====
export interface ResponsiveValue {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  // Simplified grid configuration - auto-fit approach
  minItemWidth?: string; // e.g., '280px', '350px'
  maxColumns?: number; // Optional limit on column count
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  // Alignment
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
  // Legacy support - will convert to auto-fit
  columns?: number | 'auto-fit' | 'auto-fill' | ResponsiveValue;
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  colStart?: number;
  rowStart?: number;
}

// ===== SIMPLE CLASS CONCATENATION =====
function buildClasses(...classNames: (string | undefined | false)[]): string {
  return classNames.filter(Boolean).join(' ');
}

// ===== HELPER FUNCTIONS =====
function isResponsiveValue(value: any): value is ResponsiveValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getResponsiveStyles(columns: ResponsiveValue): CSSProperties {
  const styles: CSSProperties = {};
  
  // Base (mobile first)
  if (columns.base) {
    styles.gridTemplateColumns = `repeat(${columns.base}, 1fr)`;
  }
  
  return styles;
}

// ===== MAIN GRID COMPONENT =====
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(({
  children,
  className,
  minItemWidth = '300px',
  maxColumns,
  gap = 'md',
  alignItems = 'stretch',
  justifyItems = 'stretch',
  style,
  // Legacy support
  columns,
  ...props
}, ref) => {
  // Convert legacy responsive columns to minItemWidth if needed
  const getMinWidth = () => {
    if (minItemWidth !== '300px') return minItemWidth;
    
    // Convert common responsive patterns to sensible min widths
    if (isResponsiveValue(columns)) {
      const mdCols = columns.md || columns.sm || columns.base || 3;
      // Assume ~1200px container, calculate min width
      return `${Math.floor(1200 / mdCols) - 24}px`;
    }
    
    if (typeof columns === 'number') {
      return `${Math.floor(1200 / columns) - 24}px`;
    }
    
    return minItemWidth;
  };

  const finalMinWidth = getMinWidth();

  // Build CSS classes
  const classes = buildClasses(
    'grid',
    'grid--auto-fit',
    `grid--gap-${gap}`,
    alignItems !== 'stretch' && `grid--align-${alignItems}`,
    justifyItems !== 'stretch' && `grid--justify-${justifyItems}`,
    className
  );

  // Build inline styles - simple and reliable
  const inlineStyles: CSSProperties = {
    ...(finalMinWidth && { ['--min-item-width' as any]: finalMinWidth }),
    ...(maxColumns && { ['--max-columns' as any]: maxColumns }),
    ...style
  };

  return (
    <div
      ref={ref}
      className={classes}
      style={inlineStyles}
      {...props}
    >
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

// ===== GRID ITEM COMPONENT =====
export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(({
  children,
  className,
  colSpan,
  rowSpan,
  colStart,
  rowStart,
  style,
  ...props
}, ref) => {
  const inlineStyles: CSSProperties = {
    ...(colSpan && { gridColumn: `span ${colSpan}` }),
    ...(rowSpan && { gridRow: `span ${rowSpan}` }),
    ...(colStart && { gridColumnStart: colStart }),
    ...(rowStart && { gridRowStart: rowStart }),
    ...style
  };

  return (
    <div
      ref={ref}
      className={buildClasses('grid-item', className)}
      style={inlineStyles}
      {...props}
    >
      {children}
    </div>
  );
});

GridItem.displayName = 'GridItem';

// ===== SPECIALIZED GRID COMPONENTS =====
export interface ResponsiveGridProps extends Omit<GridProps, 'columns'> {
  children: ReactNode;
  className?: string;
  minItemWidth?: string;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(({
  children,
  className,
  minItemWidth = '300px',
  gap = 'lg',
  ...props
}, ref) => {
  return (
    <Grid
      ref={ref}
      minItemWidth={minItemWidth}
      gap={gap}
      className={className}
      {...props}
    >
      {children}
    </Grid>
  );
});

ResponsiveGrid.displayName = 'ResponsiveGrid';

export interface CardGridProps extends Omit<GridProps, 'columns' | 'minItemWidth' | 'gap'> {
  children: ReactNode;
  className?: string;
  variant?: 'compact' | 'standard' | 'spacious';
}

export const CardGrid = React.forwardRef<HTMLDivElement, CardGridProps>(({
  children,
  className,
  variant = 'standard',
  ...props
}, ref) => {
  const config = {
    compact: { minItemWidth: '250px', gap: 'sm' as const },
    standard: { minItemWidth: '300px', gap: 'lg' as const },
    spacious: { minItemWidth: '350px', gap: 'xl' as const }
  };

  return (
    <ResponsiveGrid
      ref={ref}
      minItemWidth={config[variant].minItemWidth}
      gap={config[variant].gap}
      className={buildClasses('card-grid', `card-grid--${variant}`, className)}
      {...props}
    >
      {children}
    </ResponsiveGrid>
  );
});

CardGrid.displayName = 'CardGrid';