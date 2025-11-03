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
  useMediaWidth?: boolean; // ✅ Switch between content or media width
  style?: React.CSSProperties;
}

const getAlignmentClass = (align: Alignment): string => {
  switch (align) {
    case 'center': return styles.alignCenter;
    case 'right': return styles.alignRight;
    case 'left':
    default: return styles.alignLeft;
  }
};

const getHeightClass = (height: Height): string => {
  switch (height) {
    case 'full': return styles.heightFull;
    case 'fit': return styles.heightFit;
    case 'auto':
    default: return styles.heightAuto;
  }
};

export const Container = ({
  children,
  className = '',
  id,
  as: Component = 'div',
  align = 'left',
  height = 'auto',
  useMediaWidth = false,
  style,
}: ContainerProps) => {
  const alignmentClass = getAlignmentClass(align);
  const heightClass = getHeightClass(height);
  const widthClass = useMediaWidth ? styles.maxWidthMedia : '';

  const combinedClassName = [
    styles.container,
    alignmentClass,
    heightClass,
    widthClass,
    className,
  ].join(' ').trim();

  return (
    <Component id={id} className={combinedClassName} style={style}>
      {children}
    </Component>
  );
};
