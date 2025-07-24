// ===============================================
// src/design-system/components/patterns/page/Cluster.tsx
// CLUSTER COMPONENT - Horizontal grouping with wrapping
// ===============================================

import React, { ReactNode } from 'react';
import './Cluster.css';

// ===== TYPE DEFINITIONS =====

export interface ClusterProps {
  children: ReactNode;
  className?: string;
  
  // Spacing between items
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Alignment
  align?: 'start' | 'center' | 'end' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  
  // Wrapping behavior
  wrap?: boolean;
  
  // Direction
  direction?: 'row' | 'row-reverse';
}

// ===== SIMPLE CLASS CONCATENATION =====
function buildClasses(...classNames: (string | undefined | false)[]): string {
  return classNames.filter(Boolean).join(' ');
}

// ===== MAIN CLUSTER COMPONENT =====

export const Cluster = React.forwardRef<HTMLDivElement, ClusterProps>(({
  children,
  className,
  spacing = 'md',
  align = 'center',
  justify = 'start',
  wrap = true,
  direction = 'row',
  ...props
}, ref) => {
  
  // Build CSS classes
  const classes = buildClasses(
    'cluster',
    `cluster--spacing-${spacing}`,
    align !== 'center' && `cluster--align-${align}`,
    justify !== 'start' && `cluster--justify-${justify}`,
    !wrap && 'cluster--no-wrap',
    direction !== 'row' && `cluster--${direction}`,
    className
  );

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

Cluster.displayName = 'Cluster';