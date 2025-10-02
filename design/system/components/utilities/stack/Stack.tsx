// ===============================================
// src/design-system/components/patterns/page/Stack.tsx
// STACK COMPONENT - Vertical spacing layout
// ===============================================
import React, { ReactNode } from 'react';

// ===== TYPE DEFINITIONS =====
export interface StackProps {
  children: ReactNode;
  className?: string;
  // Spacing between items
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  // Alignment
  align?: 'start' | 'center' | 'end' | 'stretch';
  // Split behavior (push last item to bottom)
  split?: boolean;
  // Responsive behavior
  collapseSpacing?: 'mobile' | 'tablet' | 'never';
  // Flex child behavior (for use in Cluster, etc.)
  flexChild?: boolean;
  // Full width behavior
  fullWidth?: boolean;
}

// ===== SIMPLE CLASS CONCATENATION =====
function buildClasses(...classNames: (string | undefined | false)[]): string {
  return classNames.filter(Boolean).join(' ');
}

// ===== MAIN STACK COMPONENT =====
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(({
  children,
  className,
  spacing = 'md',
  align = 'stretch',
  split = false,
  collapseSpacing = 'mobile',
  flexChild,
  fullWidth = false,
  ...props
}, ref) => {
  // Build CSS classes
  const classes = buildClasses(
    'stack',
    `stack--spacing-${spacing}`,
    align !== 'stretch' && `stack--align-${align}`,
    split && 'stack--split',
    collapseSpacing !== 'never' && `stack--collapse-${collapseSpacing}`,
    flexChild && 'stack--flex-child',
    fullWidth && 'stack--full-width',
    className
  );

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

Stack.displayName = 'Stack';