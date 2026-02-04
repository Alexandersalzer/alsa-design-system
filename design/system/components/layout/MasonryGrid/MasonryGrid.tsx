'use client';

// ===============================================
// MasonryGrid Component - CSS Column-based Masonry Layout
// WITH BUILT-IN RESPONSIVE ITEM LIMITING
// ===============================================
import React, { ReactNode } from 'react';
import './MasonryGrid.css';

type BreakpointConfig<T> = {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
};

export interface MasonryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  /**
   * Number of columns for different breakpoints
   * Default: { base: 1, md: 2, lg: 3 }
   */
  columns?: BreakpointConfig<number>;
  /**
   * Gap between items
   */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Max items to show per breakpoint (used for responsive limiting)
   */
  maxItems?: BreakpointConfig<number>;
  /**
   * Label for show more button
   */
  showMoreLabel?: string;
  /**
   * Label for show less button
   */
  showLessLabel?: string;
}

export const MasonryGrid = React.forwardRef<HTMLDivElement, MasonryGridProps>(
  (
    {
      children,
      className = '',
      columns = { base: 1, md: 2, lg: 3 },
      gap = 'lg',
      maxItems,
      showMoreLabel = 'Visa fler',
      showLessLabel = 'Visa färre',
      style,
      ...props
    },
    ref
  ) => {
    const items = React.Children.toArray(children);

    const [showAll, setShowAll] = React.useState(false);
    const [width, setWidth] = React.useState<number | null>(null);

    React.useEffect(() => {
      const update = () => setWidth(window.innerWidth);
      update();
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }, []);

    const currentMaxItems = React.useMemo(() => {
      if (!maxItems || width == null) return items.length;

      if (width < 640) return maxItems.base ?? items.length;
      if (width < 768) return maxItems.sm ?? maxItems.base ?? items.length;
      if (width < 1024) return maxItems.md ?? items.length;
      if (width < 1280) return maxItems.lg ?? items.length;
      return maxItems.xl ?? items.length;
    }, [maxItems, width, items.length]);

    const hasMore = items.length > currentMaxItems;

    const visibleItems = showAll || !hasMore
      ? items
      : items.slice(0, currentMaxItems);

    // Build inline styles for CSS variables
    const inlineStyles: React.CSSProperties & Record<string, any> = {
      ...style,
      '--masonry-columns-base': columns.base,
      '--masonry-columns-sm': columns.sm,
      '--masonry-columns-md': columns.md,
      '--masonry-columns-lg': columns.lg,
      '--masonry-columns-xl': columns.xl,
    };

    // Build className with gap modifier
    const gridClassName = `masonry-grid masonry-grid--gap-${gap} ${className}`.trim();

    return (
      <div className="masonry-grid-wrapper">
        <div
          ref={ref}
          className={gridClassName}
          style={inlineStyles}
          {...props}
        >
          {visibleItems}
        </div>

        {hasMore && (
          <div className="masonry-grid-show-more">
            <button
              type="button"
              className="masonry-grid-show-more-button"
              onClick={() => setShowAll(v => !v)}
            >
              {showAll ? showLessLabel : showMoreLabel}
            </button>
          </div>
        )}
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
