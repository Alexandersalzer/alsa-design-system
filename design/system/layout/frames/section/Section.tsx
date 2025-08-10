import React, { ReactNode } from 'react';
import styles from './Section.module.css';

type Height = 'auto' | 'full' | 'screen';
type Position = 'static' | 'relative' | 'sticky' | 'fixed' | 'absolute';
type PaddingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

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
  paddingTop?: PaddingSize;
  paddingBottom?: PaddingSize;
}

const getPaddingValue = (size: PaddingSize): string => {
  switch (size) {
    case 'none':
      return '0';
    case 'xs':
      return 'var(--foundation-space-2, 0.5rem)';
    case 'sm':
      return 'var(--foundation-space-4, 1rem)';
    case 'md':
      return 'var(--foundation-space-8, 2rem)';
    case 'lg':
      return 'var(--foundation-space-16, 4rem)';
    case 'xl':
      return 'var(--foundation-space-20, 5rem)';
    case '2xl':
      return 'var(--foundation-space-24, 6rem)';
    default:
      return 'var(--foundation-space-16, 4rem)';
  }
};

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
  paddingTop,
  paddingBottom
}: SectionProps) => {
  const heightClass = getHeightClass(height);
  const positionClass = getPositionClass(position, sticky);
  const combinedClassName = `${styles.section} ${heightClass} ${positionClass} ${className}`.trim();
  
  const inlineStyles: React.CSSProperties = {};
  if (top !== undefined) {
    inlineStyles.top = typeof top === 'number' ? `${top}px` : top;
  }
  if (zIndex !== undefined) {
    inlineStyles.zIndex = zIndex;
  }
  if (paddingTop !== undefined) {
    inlineStyles.paddingTop = getPaddingValue(paddingTop);
  }
  if (paddingBottom !== undefined) {
    inlineStyles.paddingBottom = getPaddingValue(paddingBottom);
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