/*
  COPILOT INSTRUCTION:
  --------------------
  Grid.tsx supports:
  - auto-fit responsive grid
  - density-based card widths via semantic tokens
  - minItemWidth overrides

  When extending:
  - Add new density modes by adding new semantic tokens
  - Map `cardDensity` -> CSS variable (--width-card-*)
  - Never hardcode pixel values in Grid.tsx
  - Always source widths from design tokens
*/
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
  /**
   * Card density mode (uses semantic tokens for min width)
   * 'compact' | 'standard' | 'spacious'
   */
  cardDensity?: 'compact' | 'standard' | 'spacious';
  /**
   * Min width override (optional)
   */
  minItemWidth?: string;
  maxColumns?: number;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
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
  // 💡 NEW: Resolve minItemWidth from density mode
  // =====================================================
  let resolvedMinWidth = minItemWidth;

  if (!minItemWidth && cardDensity) {
    if (cardDensity === 'compact') resolvedMinWidth = 'var(--width-card-compact)';
    if (cardDensity === 'standard') resolvedMinWidth = 'var(--width-card-standard)';
    if (cardDensity === 'spacious') resolvedMinWidth = 'var(--width-card-spacious)';
  }

  // Default to dynamic card width
  if (!resolvedMinWidth) resolvedMinWidth = 'var(--width-card)';

  // =====================================================
  // Determine grid mode
  // =====================================================
  const useResponsive = isResponsiveValue(columns);
  const useExplicitColumns = typeof columns === 'number';
  const useAutoFit = !useResponsive && !useExplicitColumns && (cardDensity || minItemWidth);

  const inlineStyles: CSSProperties = { ...style };

  if (useExplicitColumns) {
    // Explicit column count - use fixed columns (e.g., columns={2})
    inlineStyles.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  } else if (useAutoFit) {
    // Auto-fit mode only when cardDensity or minItemWidth is provided
    (inlineStyles as Record<string, any>)['--min-item-width'] = resolvedMinWidth;
    if (maxColumns) (inlineStyles as Record<string, any>)['--max-columns'] = maxColumns;
  } else if (useResponsive) {
    // Responsive mode with breakpoint objects
    // Handled by CSS classes
  }

  // Build classes
  const classes = buildClasses(
    'grid',
    useExplicitColumns ? 'grid--explicit' : 
      useAutoFit ? 'grid--auto-fit' : 
      useResponsive ? 'grid--responsive' : 
      'grid--explicit', // ← Default to explicit if nothing specified
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