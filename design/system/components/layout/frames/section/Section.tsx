import React, { ReactNode } from 'react';
import styles from './Section.module.css';

type Height = 'auto' | 'full' | 'screen';
type Position = 'static' | 'relative' | 'sticky' | 'fixed' | 'absolute';

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
  style
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