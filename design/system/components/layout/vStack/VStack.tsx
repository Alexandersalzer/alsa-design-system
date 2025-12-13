// ===============================================
// src/design-system/components/layout/utilities/vStack/VStack.tsx
// ===============================================
import React, { ReactNode, CSSProperties } from 'react';
import './VStack.css';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  // Spacing between items
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  // Horizontal alignment (cross-axis)
  align?: 'start' | 'center' | 'end' | 'stretch';
  // Vertical distribution (main-axis) - NEW!
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  // Split behavior (push last item to bottom)
  split?: boolean;
  // Responsive behavior
  collapseSpacing?: 'mobile' | 'tablet' | 'never';
  // Flex child behavior
  flexChild?: boolean;
  // Full width behavior
  fullWidth?: boolean;
  // Style prop
  style?: CSSProperties;
}

function buildClasses(...classNames: (string | undefined | false)[]): string {
  return classNames.filter(Boolean).join(' ');
}

export const VStack = React.forwardRef<HTMLDivElement, StackProps>(({
  children,
  className,
  spacing = 'md',
  align = 'stretch',
  justify, // NEW!
  split = false,
  collapseSpacing = 'mobile',
  flexChild,
  fullWidth = false,
  style,
  ...props
}, ref) => {
  const classes = buildClasses(
    'vStack',
    `vStack--spacing-${spacing}`,
    align !== 'stretch' && `vStack--align-${align}`,
    justify && `vStack--justify-${justify}`, // NEW!
    split && 'vStack--split',
    collapseSpacing !== 'never' && `vStack--collapse-${collapseSpacing}`,
    flexChild && 'vStack--flex-child',
    fullWidth && 'vStack--full-width',
    className
  );

  return (
    <div ref={ref} className={classes} style={style} {...props}>
      {children}
    </div>
  );
});

VStack.displayName = 'VStack';