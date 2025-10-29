import React, { ReactNode } from 'react';
import styles from './Container.module.css';

type Alignment = 'left' | 'center' | 'right';
type Height = 'auto' | 'full' | 'fit';
type MaxWidth = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  align?: Alignment;
  height?: Height;
  maxWidth?: MaxWidth;
  style?: React.CSSProperties;
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
    case '3xl':
      return styles.maxWidth3xl;
    case 'full':
      return styles.maxWidthFull;
    case 'none':
    default:
      return styles.maxWidthNone;
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
  style
}: ContainerProps) => {
  const alignmentClass = getAlignmentClass(align);
  const heightClass = getHeightClass(height);
  const maxWidthClass = getMaxWidthClass(maxWidth);
  
  const combinedClassName = `${styles.container} ${alignmentClass} ${heightClass} ${maxWidthClass} ${className}`.trim();

  return (
    <Component 
      id={id}
      className={combinedClassName}
      style={style}
    >
      {children}
    </Component>
  );
};