import React, { ReactNode } from 'react';
import styles from './Container.module.css';

type Alignment = 'left' | 'center' | 'right';
type Height = 'auto' | 'full' | 'fit';
type MaxWidth = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
type PaddingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  align?: Alignment;
  height?: Height;
  maxWidth?: MaxWidth;
  paddingTop?: PaddingSize;
  paddingBottom?: PaddingSize;
  paddingLeft?: PaddingSize;
  paddingRight?: PaddingSize;
  padding?: PaddingSize; // Shorthand for all sides
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

const getPaddingValue = (size: PaddingSize): string => {
  switch (size) {
    case 'none':
      return '0';
    case 'xs':
      return 'var(--foundation-space-2, 0.5rem)';
    case 'sm':
      return 'var(--foundation-space-3, 0.75rem)';
    case 'md':
      return 'var(--foundation-space-4, 1rem)';
    case 'lg':
      return 'var(--foundation-space-6, 1.5rem)';
    case 'xl':
      return 'var(--foundation-space-8, 2rem)';
    case '2xl':
      return 'var(--foundation-space-12, 3rem)';
    default:
      return '';
  }
};

export const Container = ({ 
  children, 
  className = '', 
  id,
  as: Component = 'div',
  align = 'left',
  height = 'auto',
  maxWidth = 'none',
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  padding
}: ContainerProps) => {
  const alignmentClass = getAlignmentClass(align);
  const heightClass = getHeightClass(height);
  const maxWidthClass = getMaxWidthClass(maxWidth);
  const combinedClassName = `${styles.container} ${alignmentClass} ${heightClass} ${maxWidthClass} ${className}`.trim();
  
  // Build custom padding styles
  const customStyles: React.CSSProperties = {};
  
  if (padding) {
    const paddingValue = getPaddingValue(padding);
    if (paddingValue) customStyles.padding = paddingValue;
  } else {
    if (paddingTop) {
      const value = getPaddingValue(paddingTop);
      if (value) customStyles.paddingTop = value;
    }
    if (paddingBottom) {
      const value = getPaddingValue(paddingBottom);
      if (value) customStyles.paddingBottom = value;
    }
    if (paddingLeft) {
      const value = getPaddingValue(paddingLeft);
      if (value) customStyles.paddingLeft = value;
    }
    if (paddingRight) {
      const value = getPaddingValue(paddingRight);
      if (value) customStyles.paddingRight = value;
    }
  }
  
  return (
    <Component 
      id={id}
      className={combinedClassName}
      style={Object.keys(customStyles).length > 0 ? customStyles : undefined}
    >
      {children}
    </Component>
  );
}; 