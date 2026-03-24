'use client';

import React, { ReactNode, CSSProperties } from 'react';
import './BentoGrid.css';

// ===== TYPE DEFINITIONS =====
export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  /**
   * Number of columns (1-12)
   * @default 12
   */
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /**
   * Gap between items
   * @default 'md'
   */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Vertical alignment of items within their row
   * @default 'stretch'
   */
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  /**
   * Auto row height. Each unit equals this value.
   * E.g. '200px', '1fr', 'minmax(200px, auto)'
   * @default 'auto'
   */
  rowHeight?: string;
}

export interface BentoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  /**
   * Column span out of the parent grid's column count (1-12)
   * @default 1
   */
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /**
   * Row span (1-6)
   * @default 1
   */
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6;
}

// ===== BENTO GRID COMPONENT =====
export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(({
  children,
  className,
  columns = 12,
  gap = 'md',
  alignItems = 'stretch',
  rowHeight = 'auto',
  style,
  ...props
}, ref) => {
  const classes = [
    'bento-grid',
    `bento-grid--cols-${columns}`,
    `bento-grid--gap-${gap}`,
    alignItems !== 'stretch' && `bento-grid--align-${alignItems}`,
    className
  ].filter(Boolean).join(' ');

  const inlineStyle: CSSProperties = {
    '--bento-row-height': rowHeight,
    ...style
  } as CSSProperties;

  return (
    <div ref={ref} className={classes} style={inlineStyle} {...props}>
      {children}
    </div>
  );
});

BentoGrid.displayName = 'BentoGrid';

// ===== BENTO ITEM COMPONENT =====
export const BentoItem = React.forwardRef<HTMLDivElement, BentoItemProps>(({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
  style,
  ...props
}, ref) => {
  const inlineStyle: CSSProperties = {
    '--bento-col-span': colSpan,
    '--bento-row-span': rowSpan,
    ...style
  } as CSSProperties;

  const classes = [
    'bento-item',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} style={inlineStyle} {...props}>
      {children}
    </div>
  );
});

BentoItem.displayName = 'BentoItem';

export default BentoGrid;
