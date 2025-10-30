import React, { ReactNode } from 'react';
import styles from './Container.module.css';

type Alignment = 'left' | 'center' | 'right';
type Height = 'auto' | 'full' | 'fit';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  align?: Alignment;
  height?: Height;
  useMediaWidth?: boolean; // ✅ SIMPLE BOOLEAN!
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

export const Container = ({ 
  children, 
  className = '', 
  id,
  as: Component = 'div',
  align = 'left',
  height = 'auto',
  useMediaWidth = false, // ✅ Default: use content width
  style
}: ContainerProps) => {
  const alignmentClass = getAlignmentClass(align);
  const heightClass = getHeightClass(height);
  
  // ✅ SIMPLE: Add media class if true
  const maxWidthClass = useMediaWidth ? styles.maxWidthMedia : '';
  
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