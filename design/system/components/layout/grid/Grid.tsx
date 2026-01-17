/*
  COPILOT INSTRUCTION:
  --------------------
  Grid.tsx supports:
  - Simple responsive columns with automatic 3-2-1 behavior: <Grid columns={3}>
  - Explicit responsive control: <Grid columns={{ base: 1, md: 2, lg: 3 }}>
  - Auto-fit mode with cardDensity: <Grid cardDensity="standard">
  
  When extending:
  - cardDensity should NOT be used with columns prop
  - columns prop takes priority over cardDensity
  - Default responsive behavior: desktop 3, tablet 2, mobile 1
*/
// ===============================================
// src/design-system/components/layout/utilities/grid/Grid.tsx
// GRID COMPONENT - Responsive grid layouts with Chakra-like API
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
  /**
   * Number of columns (responsive by default: desktop 3, tablet 2, mobile 1)
   * Or explicit responsive object: { base: 1, md: 2, lg: 3 }
   */
  columns?: number | ResponsiveValue;
  /**
   * Card density mode (uses semantic tokens for min width)
   * Only works when columns is NOT set
   */
  cardDensity?: 'compact' | 'standard' | 'spacious';
  /**
   * Min width override for auto-fit mode (optional)
   * Only works when columns is NOT set
   */
  minItemWidth?: string;
  /**
   * Max columns constraint for auto-fit mode
   */
  maxColumns?: number;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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

function getResponsiveStyles(columns: ResponsiveValue): Record<string, any> {
  const styles: Record<string, any> = {};
  
  // Set CSS variables for each breakpoint that will be read by CSS
  if (columns.base !== undefined) styles['--grid-cols-base'] = columns.base;
  if (columns.sm !== undefined) styles['--grid-cols-sm'] = columns.sm;
  if (columns.md !== undefined) styles['--grid-cols-md'] = columns.md;
  if (columns.lg !== undefined) styles['--grid-cols-lg'] = columns.lg;
  if (columns.xl !== undefined) styles['--grid-cols-xl'] = columns.xl;
  if (columns['2xl'] !== undefined) styles['--grid-cols-2xl'] = columns['2xl'];
  
  return styles;
}

function getDefaultResponsiveColumns(baseColumns: number): ResponsiveValue {
  // Default responsive behavior based on column count
  if (baseColumns === 1) {
    return { base: 1, sm: 1, md: 1, lg: 1, xl: 1, '2xl': 1 };
  }
  if (baseColumns === 2) {
    return { base: 1, sm: 1, md: 2, lg: 2, xl: 2, '2xl': 2 };
  }
  // For 3+ columns: mobile 1, tablet 2, desktop uses the specified number
  return {
    base: 1,
    sm: 1,
    md: 2,
    lg: baseColumns,
    xl: baseColumns,
    '2xl': baseColumns
  };
}

// ===== MAIN GRID COMPONENT =====
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(({
  children,
  className,
  cardDensity,
  minItemWidth,
  maxColumns,
  gap = 'md',
  alignItems = 'stretch',
  justifyItems = 'stretch',
  style,
  columns,
  ...props
}, ref) => {
  // =====================================================
  // MODE DETECTION - Priority: columns > cardDensity
  // =====================================================
  const hasColumns = columns !== undefined;
  const useResponsiveColumns = hasColumns && isResponsiveValue(columns);
  const useSimpleColumns = hasColumns && typeof columns === 'number';
  const useAutoFit = !hasColumns && (cardDensity || minItemWidth);

  const inlineStyles: CSSProperties & Record<string, any> = { ...style };

  // =====================================================
  // RESPONSIVE COLUMNS MODE
  // =====================================================
  if (useResponsiveColumns) {
    // User provided explicit breakpoint object
    Object.assign(inlineStyles, getResponsiveStyles(columns as ResponsiveValue));
  } 
  // =====================================================
  // SIMPLE COLUMNS MODE (with automatic responsive behavior)
  // =====================================================
  else if (useSimpleColumns) {
    // Convert simple number to responsive object with smart defaults
    const responsiveColumns = getDefaultResponsiveColumns(columns as number);
    Object.assign(inlineStyles, getResponsiveStyles(responsiveColumns));
  } 
  // =====================================================
  // AUTO-FIT MODE (density-based)
  // =====================================================
  else if (useAutoFit) {
    // Resolve minItemWidth from density mode
    let resolvedMinWidth = minItemWidth;
    if (!minItemWidth && cardDensity) {
      if (cardDensity === 'compact') resolvedMinWidth = 'var(--width-card-compact)';
      if (cardDensity === 'standard') resolvedMinWidth = 'var(--width-card-standard)';
      if (cardDensity === 'spacious') resolvedMinWidth = 'var(--width-card-spacious)';
    }
    if (!resolvedMinWidth) resolvedMinWidth = 'var(--width-card)';

    inlineStyles['--min-item-width'] = resolvedMinWidth;
    if (maxColumns) inlineStyles['--max-columns'] = maxColumns;
  }

  // =====================================================
  // BUILD CLASSES
  // =====================================================
  const classes = buildClasses(
    'grid',
    useResponsiveColumns || useSimpleColumns ? 'grid--responsive' : 
      useAutoFit ? 'grid--auto-fit' : 
      'grid--responsive', // Default to responsive mode
    `grid--gap-${gap}`,
    alignItems !== 'stretch' && `grid--align-${alignItems}`,
    justifyItems !== 'stretch' && `grid--justify-${justifyItems}`,
    className
  );

  return (
    <div ref={ref} className={classes} style={inlineStyles} {...props}>
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