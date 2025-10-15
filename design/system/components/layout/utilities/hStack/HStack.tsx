// ===============================================
// src/design-system/components/patterns/page/HStack.tsx
// HStack COMPONENT - Horizontal grouping with wrapping
// ===============================================
import React, { ReactNode } from 'react';

// ===== TYPE DEFINITIONS =====
export interface HStackProps {
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

// ===== MAIN HStack COMPONENT =====
export const HStack = React.forwardRef<HTMLDivElement, HStackProps>(({
  children,
  className,
  spacing = 'md',
  align = 'center',
  justify = 'start',
  wrap = false, // CHANGED: Default to false
  direction = 'row',
  ...props
}, ref) => {
  // Build CSS classes
    const classes = buildClasses(
    'hStack',
    `hStack--spacing-${spacing}`,
    align !== 'center' && `hStack--align-${align}`,
    justify !== 'start' && `hStack--justify-${justify}`,
    wrap && 'hStack--wrap',
    direction !== 'row' && `hStack--${direction}`,
    className
    );

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

HStack.displayName = 'HStack';