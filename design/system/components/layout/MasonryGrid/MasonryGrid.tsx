// ===============================================
// MasonryGrid Component - CSS Column-based Masonry Layout
// ===============================================
import React, { ReactNode } from 'react';
import './MasonryGrid.css';

export interface MasonryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  /**
   * Number of columns for different breakpoints
   * Default: { base: 1, md: 2, lg: 3 }
   */
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /**
   * Gap between items
   */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const MasonryGrid = React.forwardRef<HTMLDivElement, MasonryGridProps>(
  ({ children, className = '', columns, gap = 'lg', style, ...props }, ref) => {
    // Default column configuration
    const defaultColumns: Required<NonNullable<MasonryGridProps['columns']>> = {
      base: 1,
      sm: 1,
      md: 2,
      lg: 3,
      xl: 3,
    };

    const columnConfig: NonNullable<MasonryGridProps['columns']> = columns || defaultColumns;

    // Build inline styles for CSS variables
    const inlineStyles: React.CSSProperties & Record<string, any> = {
      ...style,
    };

    // Set column counts as CSS variables
    if (columnConfig.base !== undefined) {
      inlineStyles['--masonry-columns-base'] = columnConfig.base;
    }
    if (columnConfig.sm !== undefined) {
      inlineStyles['--masonry-columns-sm'] = columnConfig.sm;
    }
    if (columnConfig.md !== undefined) {
      inlineStyles['--masonry-columns-md'] = columnConfig.md;
    }
    if (columnConfig.lg !== undefined) {
      inlineStyles['--masonry-columns-lg'] = columnConfig.lg;
    }
    if (columnConfig.xl !== undefined) {
      inlineStyles['--masonry-columns-xl'] = columnConfig.xl;
    }

    // Build className with gap modifier
    const gridClassName = `masonry-grid masonry-grid--gap-${gap} ${className}`.trim();

    return (
      <div
        ref={ref}
        className={gridClassName}
        style={inlineStyles}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MasonryGrid.displayName = 'MasonryGrid';

export interface MasonryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const MasonryItem = React.forwardRef<HTMLDivElement, MasonryItemProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`masonry-item ${className}`.trim()} {...props}>
        {children}
      </div>
    );
  }
);

MasonryItem.displayName = 'MasonryItem';
