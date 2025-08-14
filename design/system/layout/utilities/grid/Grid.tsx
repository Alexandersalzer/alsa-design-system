// ===============================================
// src/design-system/components/patterns/page/Grid.tsx
// GRID COMPONENT - Responsive grid layouts
// ===============================================

import React, { ReactNode } from 'react';

// ===== TYPE DEFINITIONS =====

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  
  // Grid configuration
  columns?: number | 'auto-fit' | 'auto-fill';
  minItemWidth?: string; // e.g., '300px', '250px'
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Responsive behavior
  collapseOn?: 'mobile' | 'tablet' | 'never';
  
  // Alignment
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
}

// ===== SIMPLE CLASS CONCATENATION =====
function buildClasses(...classNames: (string | undefined | false)[]): string {
  return classNames.filter(Boolean).join(' ');
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
    className
  );

  // Build grid template columns
  const getGridTemplateColumns = () => {
    if (typeof columns === 'number') {
      return `repeat(${columns}, 1fr)`;
    }
    return `repeat(${columns}, minmax(${minItemWidth}, 1fr))`;
  };

  return (
    <div 
      ref={ref} 
      className={classes}
      style={{
        display: 'grid',
        gridTemplateColumns: getGridTemplateColumns(),
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

// ===== SPECIALIZED GRID COMPONENTS =====

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
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

export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
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