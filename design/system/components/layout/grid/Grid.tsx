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
  const getGridConfig = () => {
    // If user explicitly passed responsive columns object, use legacy responsive approach
    if (isResponsiveValue(columns)) {
      return { useResponsive: true, responsiveColumns: columns };
    }
    
    // If user passed specific number of columns, convert to responsive object
    if (typeof columns === 'number') {
      return { useResponsive: true, responsiveColumns: { base: 1, sm: Math.max(1, columns - 1), md: columns } };
    }
    
    // Default to auto-fit approach
    const autoMinWidth = minItemWidth !== '300px' ? minItemWidth : '300px';
    return { useResponsive: false, minWidth: autoMinWidth };
  };

  const gridConfig = getGridConfig();

  // Build CSS classes
  const classes = buildClasses(
    'grid',
    gridConfig.useResponsive ? 'grid--responsive' : 'grid--auto-fit',
    `grid--gap-${gap}`,
    alignItems !== 'stretch' && `grid--align-${alignItems}`,
    justifyItems !== 'stretch' && `grid--justify-${justifyItems}`,
    className
  );

  // Build inline styles
  const inlineStyles: CSSProperties = {
    ...style
  };

  if (gridConfig.useResponsive && gridConfig.responsiveColumns) {
    // Set CSS variables for responsive breakpoints
    const cols = gridConfig.responsiveColumns;
    if (cols.base !== undefined) (inlineStyles as any)['--grid-cols-base'] = cols.base;
    if (cols.sm !== undefined) (inlineStyles as any)['--grid-cols-sm'] = cols.sm;
    if (cols.md !== undefined) (inlineStyles as any)['--grid-cols-md'] = cols.md;
    if (cols.lg !== undefined) (inlineStyles as any)['--grid-cols-lg'] = cols.lg;
    if (cols.xl !== undefined) (inlineStyles as any)['--grid-cols-xl'] = cols.xl;
    if (cols['2xl'] !== undefined) (inlineStyles as any)['--grid-cols-2xl'] = cols['2xl'];
  } else {
    // Auto-fit approach
    (inlineStyles as any)['--min-item-width'] = gridConfig.minWidth;
    if (maxColumns) (inlineStyles as any)['--max-columns'] = maxColumns;
  }

  console.log('Grid Debug:', { 
    useResponsive: gridConfig.useResponsive, 
    columns, 
    responsiveColumns: gridConfig.responsiveColumns,
    cssVars: inlineStyles 
  });

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