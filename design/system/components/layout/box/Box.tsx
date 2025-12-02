// ===============================================
// LOCATION: design/system/components/layout/utilities/box/Box.tsx
// Box - The foundational layout primitive
// UPDATED: Now imports Box.css
// ===============================================

import React, { forwardRef, ElementType, ReactNode } from 'react';
import { cn } from '../../../utils/cn';
import './Box.css';

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  /** Content to render inside the box */
  children?: ReactNode;
  
  /** The HTML element or React component to render */
  as?: ElementType;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Padding size */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /** Margin size */
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /** Border radius */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /** Background color */
  bg?: 'base' | 'card' | 'hover' | 'sidebar' | 'nav' | 'transparent';
  
  /** Border */
  border?: 'none' | 'light' | 'default' | 'heavy';
  
  /** Display type */
  display?: 'component' | 'inline-component' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none';
  
  /** Flex direction (only when display is flex) */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  
  /** Align items (flex/grid) */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  
  /** Justify content (flex/grid) */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  
  /** Gap between children (flex/grid) */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /** Width */
  width?: 'auto' | 'full' | 'fit' | 'screen';
  
  /** Height */
  height?: 'auto' | 'full' | 'fit' | 'screen';
}

export const Box = forwardRef<HTMLElement, BoxProps>(({
  children,
  as: Component = 'div',
  className,
  padding,
  margin,
  radius,
  bg,
  border,
  display,
  direction,
  align,
  justify,
  gap,
  width,
  height,
  ...props
}, ref) => {
  const classes = cn(
    'box',
    // Padding
    padding && `box-p-${padding}`,
    // Margin
    margin && `box-m-${margin}`,
    // Radius
    radius && `box-radius-${radius}`,
    // Background
    bg && `box-bg-${bg}`,
    // Border
    border && border !== 'none' && `box-border-${border}`,
    // Display
    display && `box-display-${display}`,
    // Flex direction
    direction && `box-direction-${direction}`,
    // Align
    align && `box-align-${align}`,
    // Justify
    justify && `box-justify-${justify}`,
    // Gap
    gap && `box-gap-${gap}`,
    // Width
    width && `box-width-${width}`,
    // Height
    height && `box-height-${height}`,
    className
  );

  return (
    <Component ref={ref} className={classes} {...props}>
      {children}
    </Component>
  );
});

Box.displayName = 'Box';