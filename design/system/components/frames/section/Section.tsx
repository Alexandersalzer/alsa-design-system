import React, { ReactNode } from 'react';
import styles from './Section.module.css';

type Height = 'auto' | 'full' | 'screen';
type Position = 'static' | 'relative' | 'sticky' | 'fixed' | 'absolute';
type SpacingScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Overflow = 'visible' | 'hidden' | 'auto' | 'scroll' | 'clip';
type PaddingTopMultiplier = 1 | 1.25 | 1.5 | 1.75 | 2;

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  height?: Height;
  position?: Position;
  sticky?: boolean;
  top?: string | number;
  zIndex?: number;
  spacing?: SpacingScale; // ✅ optional per-section override (uses .spacingMd etc.)
  paddingTopMultiplier?: PaddingTopMultiplier; // ✅ Multiplier for top padding (1, 1.25, 1.5, 1.75, 2)
  overflow?: Overflow; // ✅ Control overflow behavior (default: 'hidden')
  overflowX?: Overflow; // ✅ Control horizontal overflow separately
  overflowY?: Overflow; // ✅ Control vertical overflow separately
  style?: React.CSSProperties;
  sectionKey?: string; // För live editing identification
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
  if (sticky) return styles.positionSticky;
  switch (position) {
    case 'static': return styles.positionStatic;
    case 'relative': return styles.positionRelative;
    case 'sticky': return styles.positionSticky;
    case 'fixed': return styles.positionFixed;
    case 'absolute': return styles.positionAbsolute;
    default: return styles.positionRelative;
  }
};

const getSpacingClass = (spacing?: SpacingScale): string => {
  if (!spacing) return '';
  return styles[`spacing${spacing.charAt(0).toUpperCase() + spacing.slice(1)}`] || '';
};

const getOverflowClass = (overflow?: Overflow): string => {
  if (!overflow) return '';
  return styles[`overflow${overflow.charAt(0).toUpperCase() + overflow.slice(1)}`] || '';
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
  spacing, // optional override
  paddingTopMultiplier,
  overflow,
  overflowX,
  overflowY,
  style,
  sectionKey,
}: SectionProps) => {
  const heightClass = getHeightClass(height);
  const positionClass = getPositionClass(position, sticky);
  const spacingClass = getSpacingClass(spacing);
  const overflowClass = getOverflowClass(overflow);

  const combinedClassName = [
    styles.section,
    heightClass,
    positionClass,
    spacingClass,
    overflowClass,
    className,
  ].join(' ').trim();

  const inlineStyles: Record<string, any> = {};
  if (top !== undefined) inlineStyles.top = typeof top === 'number' ? `${top}px` : top;
  if (zIndex !== undefined) inlineStyles.zIndex = zIndex;
  if (overflowX !== undefined) inlineStyles.overflowX = overflowX;
  if (overflowY !== undefined) inlineStyles.overflowY = overflowY;

  // Apply padding top multiplier using CSS custom property
  if (paddingTopMultiplier !== undefined) {
    inlineStyles['--section-padding-top-multiplier'] = paddingTopMultiplier;
  }

  const finalStyles: React.CSSProperties = { ...inlineStyles, ...style };

  return (
    <Component
      id={id}
      className={combinedClassName}
      style={finalStyles}
      data-section-key={sectionKey}
      data-padding-multiplier={paddingTopMultiplier}
    >
      {children}
    </Component>
  );
};
