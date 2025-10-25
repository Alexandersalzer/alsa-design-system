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
  // Grid configuration - supports responsive object
  columns?: number | 'auto-fit' | 'auto-fill' | ResponsiveValue;
  minItemWidth?: string; // e.g., '300px', '250px'
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  // Responsive behavior
  collapseOn?: 'mobile' | 'tablet' | 'never';
  // Alignment
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
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
  columns = 'auto-fit',
  minItemWidth = '300px',
  gap = 'md',
  collapseOn = 'mobile',
  alignItems = 'stretch',
  justifyItems = 'stretch',
  style,
  ...props
}, ref) => {
  // Build CSS classes
  const classes = buildClasses(
    'grid',
    `grid--gap-${gap}`,
    collapseOn !== 'never' && `grid--collapse-${collapseOn}`,
    alignItems !== 'stretch' && `grid--align-${alignItems}`,
    justifyItems !== 'stretch' && `grid--justify-${justifyItems}`,
    // Add responsive column classes if using responsive object
    isResponsiveValue(columns) && 'grid--responsive',
    className
  );

  // Build grid template columns
  const getGridTemplateColumns = () => {
    if (isResponsiveValue(columns)) {
      // Return base value for inline style
      return columns.base ? `repeat(${columns.base}, 1fr)` : '1fr';
    }
    
    if (typeof columns === 'number') {
      return `repeat(${columns}, 1fr)`;
    }
    
    return `repeat(${columns}, minmax(${minItemWidth}, 1fr))`;
  };

  // Build inline styles
  const inlineStyles: CSSProperties = {
    gridTemplateColumns: getGridTemplateColumns(),
    ...style
  };

  // Add CSS variables for responsive breakpoints
  if (isResponsiveValue(columns)) {
    if (columns.sm) (inlineStyles as any)['--grid-cols-sm'] = columns.sm;
    if (columns.md) (inlineStyles as any)['--grid-cols-md'] = columns.md;
    if (columns.lg) (inlineStyles as any)['--grid-cols-lg'] = columns.lg;
    if (columns.xl) (inlineStyles as any)['--grid-cols-xl'] = columns.xl;
    if (columns['2xl']) (inlineStyles as any)['--grid-cols-2xl'] = columns['2xl'];
  }

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
      columns="auto-fit"
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