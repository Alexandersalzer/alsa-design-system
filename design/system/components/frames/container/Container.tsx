import React, { ReactNode } from 'react';
import styles from './Container.module.css';

type Alignment = 'left' | 'center' | 'right';
type Height = 'auto' | 'full' | 'fit';
type SpacingScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type ContainerWidth = 'content' | 'media' | 'form' | 'navbar';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  align?: Alignment;
  /** Aligns content inside the container without moving the container itself */
  contentAlign?: Alignment;
  height?: Height;
  width?: ContainerWidth;
  /** @deprecated use width="media" */
  useMediaWidth?: boolean;
  /** @deprecated use width="form" */
  useFormWidth?: boolean;
  /** @deprecated use width="navbar" */
  useNavbarWidth?: boolean;
  spacing?: SpacingScale;
  noPadding?: boolean;
  style?: React.CSSProperties;
  patternKey?: string;
}

const getAlignmentClass = (align?: Alignment): string => {
  if (!align) return '';
  switch (align) {
    case 'center': return styles.alignCenter;
    case 'right': return styles.alignRight;
    case 'left': return styles.alignLeft;
    default: return '';
  }
};

const getContentAlignmentClass = (align?: Alignment): string => {
  if (!align) return '';
  switch (align) {
    case 'center': return styles.contentAlignCenter;
    case 'right': return styles.contentAlignRight;
    case 'left': return styles.contentAlignLeft;
    default: return '';
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
  align,
  contentAlign,
  height = 'auto',
  width,
  useMediaWidth = false,
  useFormWidth = false,
  useNavbarWidth = false,
  spacing,
  noPadding = false,
  style,
  patternKey,
}: ContainerProps) => {
  const alignmentClass = getAlignmentClass(align);
  const contentAlignmentClass = getContentAlignmentClass(contentAlign);
  const heightClass = getHeightClass(height);
  const spacingClass = getSpacingClass(spacing);
  const paddingClass = getPaddingClass(noPadding);

  // Resolve effective width: new enum takes precedence, deprecated booleans as fallback
  const effectiveWidth: ContainerWidth | undefined =
    width ?? (useNavbarWidth ? 'navbar' : useMediaWidth ? 'media' : useFormWidth ? 'form' : undefined);

  const widthClass =
    effectiveWidth === 'navbar' ? styles.maxWidthNavbar
    : effectiveWidth === 'media' ? styles.maxWidthMedia
    : effectiveWidth === 'form'  ? styles.maxWidthForm
    : '';

  const combinedClassName = [
    styles.container,
    alignmentClass,
    contentAlignmentClass,
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
