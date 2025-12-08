import React, { ReactNode } from 'react';
import styles from './Container.module.css';

type Alignment = 'left' | 'center' | 'right';
type Height = 'auto' | 'full' | 'fit';
type SpacingScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  align?: Alignment;
  height?: Height;
  useMediaWidth?: boolean;
  useFormWidth?: boolean;
  useNavbarWidth?: boolean; // ✅ NEW PROP
  spacing?: SpacingScale;
  noPadding?: boolean;
  style?: React.CSSProperties;
  patternKey?: string; // För live editing identification
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

const getSpacingClass = (spacing?: SpacingScale): string => {
  if (!spacing) return '';
  return styles[`spacing${spacing.charAt(0).toUpperCase() + spacing.slice(1)}`] || '';
};

const getPaddingClass = (noPadding: boolean): string => {
  return noPadding ? styles.noPadding : '';
};

export const Container = ({
  children,
  className = '',
  id,
  as: Component = 'div',
  align = 'left',
  height = 'auto',
  useMediaWidth = false,
  useFormWidth = false,
  useNavbarWidth = false, // ✅ NEW
  spacing,
  noPadding = false,
  style,
  patternKey,
}: ContainerProps) => {
  const alignmentClass = getAlignmentClass(align);
  const heightClass = getHeightClass(height);
  const spacingClass = getSpacingClass(spacing);
  const paddingClass = getPaddingClass(noPadding);
  
  const widthClass = useNavbarWidth
    ? styles.maxWidthNavbar // ✅ NEW
    : useFormWidth
    ? styles.maxWidthForm
    : useMediaWidth
    ? styles.maxWidthMedia
    : '';

  const combinedClassName = [
    styles.container,
    alignmentClass,
    heightClass,
    widthClass,
    spacingClass,
    paddingClass,
    className,
  ].join(' ').trim();

  return (
    <Component 
      id={id} 
      className={combinedClassName} 
      style={style}
      data-pattern-key={patternKey}
    >
      {children}
    </Component>
  );
};
