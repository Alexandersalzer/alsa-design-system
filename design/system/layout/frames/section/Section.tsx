import React, { ReactNode } from 'react';
import styles from './Section.module.css';

type Height = 'auto' | 'full' | 'screen';
type Position = 'static' | 'relative' | 'sticky' | 'fixed' | 'absolute';
type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  height?: Height;
  position?: Position;
  sticky?: boolean; // New boolean prop for sticky behavior
  top?: string | number;
  zIndex?: number;
  style?: React.CSSProperties;
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

const getHeightClass = (height: Height): string => {
  switch (height) {
    case 'full':
      return styles.heightFull;
    case 'screen':
      return styles.heightScreen;
    case 'auto':
    default:
      return styles.heightAuto;
  }
};

const getPositionClass = (position: Position, sticky: boolean): string => {
  // If sticky is true, override position to sticky
  if (sticky) {
    return styles.positionSticky;
  }
  
  switch (position) {
    case 'static':
      return styles.positionStatic;
    case 'relative':
      return styles.positionRelative;
    case 'sticky':
      return styles.positionSticky;
    case 'fixed':
      return styles.positionFixed;
    case 'absolute':
      return styles.positionAbsolute;
    default:
      return styles.positionRelative;
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

export const Section = ({ 
  children, 
  className = '', 
  id,
  as: Component = 'section',
  height = 'auto',
  position = 'relative',
  sticky = false,
  top,
  zIndex,
  style,
  marginTop,
  marginBottom,
  marginX,
  marginY,
  paddingTop,
  paddingBottom,
  paddingX,
  paddingY
}: SectionProps) => {
  const heightClass = getHeightClass(height);
  const positionClass = getPositionClass(position, sticky);
  const combinedClassName = `${styles.section} ${heightClass} ${positionClass} ${className}`.trim();
  
  const inlineStyles: React.CSSProperties = {};
  
  // Position styles
  if (top !== undefined) {
    inlineStyles.top = typeof top === 'number' ? `${top}px` : top;
  }
  if (zIndex !== undefined) {
    inlineStyles.zIndex = zIndex;
  }
  
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
  
  // Merge custom style prop with inline styles
  const finalStyles = { ...inlineStyles, ...style };
  
  return (
    <Component 
      id={id}
      className={combinedClassName}
      style={Object.keys(finalStyles).length > 0 ? finalStyles : undefined}
    >
      {children}
    </Component>
  );
}; 