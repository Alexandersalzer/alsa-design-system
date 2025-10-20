// ===============================================
// src/design-system/components/layout/utilities/stack/Stack.tsx
// FIXED STACK COMPONENT - With proper style prop support
// ===============================================
import React, { ReactNode, CSSProperties } from 'react';

// ===== TYPE DEFINITIONS =====
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  // Spacing between items
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  // Alignment
  align?: 'start' | 'center' | 'end' | 'stretch';
  // Split behavior (push last item to bottom)
  split?: boolean;
  // Responsive behavior
  collapseSpacing?: 'mobile' | 'tablet' | 'never';
  // Flex child behavior (for use in HStack, etc.)
  flexChild?: boolean;
  // Full width behavior
  fullWidth?: boolean;
  // Style prop (now properly typed)
  style?: CSSProperties;
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
  style,
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
    <div ref={ref} className={classes} style={style} {...props}>
      {children}
    </div>
  );
});

Stack.displayName = 'Stack';