'use client';

import React, { ReactNode, CSSProperties } from 'react';
import './BentoGrid.css';

// ===== TYPE DEFINITIONS =====
export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  /**
   * Number of columns
   * @default 2
   */
  columns?: 1 | 2 | 3 | 4;
  /**
   * Gap between items
   * @default 'lg'
   */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Vertical alignment of items
   * @default 'stretch'
   */
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
}

export interface BentoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  /**
   * Column span
   * @default 1
   */
  colSpan?: 1 | 2 | 3 | 4;
  /**
   * Row span
   * @default 1
   */
  rowSpan?: 1 | 2 | 3;
}

// ===== BENTO GRID COMPONENT =====
export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(({
  children,
  className,
  columns = 2,
  gap = 'lg',
  alignItems = 'stretch',
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

  return (
    <div ref={ref} className={classes} style={style} {...props}>
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
  const inlineStyles: CSSProperties = {
    ...(colSpan > 1 && { gridColumn: `span ${colSpan}` }),
    ...(rowSpan > 1 && { gridRow: `span ${rowSpan}` }),
    ...style
  };

  const classes = [
    'bento-item',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} style={inlineStyles} {...props}>
      {children}
    </div>
  );
});

BentoItem.displayName = 'BentoItem';

export default BentoGrid;
