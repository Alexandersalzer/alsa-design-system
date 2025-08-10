import React, { ReactNode } from 'react';
import styles from './Container.module.css';

type Alignment = 'left' | 'center' | 'right';
type Height = 'auto' | 'full' | 'fit';
type MaxWidth = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  align?: Alignment;
  height?: Height;
  maxWidth?: MaxWidth;
  // New margin props
  marginTop?: Spacing | string | number;
  marginBottom?: Spacing | string | number;
  marginX?: Spacing | string | number;
  marginY?: Spacing | string | number;
  // New padding props
  paddingTop?: Spacing | string | number;
  paddingBottom?: Spacing | string | number;
  paddingX?: Spacing | string | number;
  paddingY?: Spacing | string | number;
}

const getAlignmentClass = (align: Alignment): string => {
  switch (align) {
    case 'left':
      return styles.alignLeft;
    case 'center':
      return styles.alignCenter;
    case 'right':
      return styles.alignRight;
    default:
      return styles.alignLeft;
  }
};

const getHeightClass = (height: Height): string => {
  switch (height) {
    case 'full':
      return styles.heightFull;
    case 'fit':
      return styles.heightFit;
    case 'auto':
    default:
      return styles.heightAuto;
  }
};

const getMaxWidthClass = (maxWidth: MaxWidth): string => {
  switch (maxWidth) {
    case 'xs':
      return styles.maxWidthXs;
    case 'sm':
      return styles.maxWidthSm;
    case 'md':
      return styles.maxWidthMd;
    case 'lg':
      return styles.maxWidthLg;
    case 'xl':
      return styles.maxWidthXl;
    case '2xl':
      return styles.maxWidth2xl;
    case 'full':
      return styles.maxWidthFull;
    case 'none':
    default:
      return styles.maxWidthNone;
  }
};

// Helper function to convert spacing values to CSS values
const getSpacingValue = (spacing: Spacing | string | number | undefined): string | undefined => {
  if (spacing === undefined) return undefined;
  
  if (typeof spacing === 'number') {
    return `${spacing}px`;
  }
  
  if (typeof spacing === 'string') {
    // If it's already a CSS value (contains px, rem, etc.), return as is
    if (spacing.includes('px') || spacing.includes('rem') || spacing.includes('%') || spacing.includes('vh') || spacing.includes('vw')) {
      return spacing;
    }
    
    // Convert spacing tokens to CSS custom properties
    const spacingMap: Record<Spacing, string> = {
      'none': '0',
      'xs': 'var(--foundation-space-2, 0.5rem)',
      'sm': 'var(--foundation-space-4, 1rem)',
      'md': 'var(--foundation-space-6, 1.5rem)', 
      'lg': 'var(--foundation-space-8, 2rem)',
      'xl': 'var(--foundation-space-12, 3rem)',
      '2xl': 'var(--foundation-space-16, 4rem)'
    };
    
    return spacingMap[spacing as Spacing] || spacing;
  }
  
  return undefined;
};

export const Container = ({ 
  children, 
  className = '', 
  id,
  as: Component = 'div',
  align = 'left',
  height = 'auto',
  maxWidth = 'none',
  marginTop,
  marginBottom,
  marginX,
  marginY,
  paddingTop,
  paddingBottom,
  paddingX,
  paddingY
}: ContainerProps) => {
  const alignmentClass = getAlignmentClass(align);
  const heightClass = getHeightClass(height);
  const maxWidthClass = getMaxWidthClass(maxWidth);
  const combinedClassName = `${styles.container} ${alignmentClass} ${heightClass} ${maxWidthClass} ${className}`.trim();
  
  const inlineStyles: React.CSSProperties = {};
  
  // Margin styles
  if (marginTop !== undefined) {
    inlineStyles.marginTop = getSpacingValue(marginTop);
  }
  if (marginBottom !== undefined) {
    inlineStyles.marginBottom = getSpacingValue(marginBottom);
  }
  if (marginX !== undefined) {
    const value = getSpacingValue(marginX);
    inlineStyles.marginLeft = value;
    inlineStyles.marginRight = value;
  }
  if (marginY !== undefined) {
    const value = getSpacingValue(marginY);
    inlineStyles.marginTop = value;
    inlineStyles.marginBottom = value;
  }
  
  // Padding styles
  if (paddingTop !== undefined) {
    inlineStyles.paddingTop = getSpacingValue(paddingTop);
  }
  if (paddingBottom !== undefined) {
    inlineStyles.paddingBottom = getSpacingValue(paddingBottom);
  }
  if (paddingX !== undefined) {
    const value = getSpacingValue(paddingX);
    inlineStyles.paddingLeft = value;
    inlineStyles.paddingRight = value;
  }
  if (paddingY !== undefined) {
    const value = getSpacingValue(paddingY);
    inlineStyles.paddingTop = value;
    inlineStyles.paddingBottom = value;
  }
  
  return (
    <Component 
      id={id}
      className={combinedClassName}
      style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
    >
      {children}
    </Component>
  );
}; 