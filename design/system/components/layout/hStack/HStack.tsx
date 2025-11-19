// ===============================================
// design/system/components/layout/hStack/HStack.tsx
// UPDATED TO ACCEPT ALL DIV PROPS
// ===============================================
import React, { ReactNode, HTMLAttributes } from 'react';

// ===== TYPE DEFINITIONS =====
export interface HStackProps extends HTMLAttributes<HTMLDivElement> { // ✅ Extend HTMLAttributes
  children: ReactNode;
  className?: string;
  // Spacing between items
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  // Alignment
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
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
  wrap = false,
  direction = 'row',
  ...props // ✅ Now includes onClick and other HTML props
}, ref) => {
  // Build CSS classes
  const classes = buildClasses(
    'hStack',
    `hStack--spacing-${spacing}`,
    `hStack--align-${align}`,
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