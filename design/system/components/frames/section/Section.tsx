import React, { ReactNode } from 'react';
import styles from './Section.module.css';
import { Bleed } from '../../layout/bleed';

type Height = 'auto' | 'full' | 'screen';
type Position = 'static' | 'relative' | 'sticky' | 'fixed' | 'absolute';
type SpacingScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Overflow = 'visible' | 'hidden' | 'auto' | 'scroll' | 'clip';
type Background = 'default' | 'raised' | 'elevated' | 'inverse' | 'media' | 'transparent';
type LayoutIntent = 'default' | 'fullscreen' | 'overlay' | 'edge';

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
  overflow?: Overflow; // ✅ Control overflow behavior (default: 'hidden')
  overflowX?: Overflow; // ✅ Control horizontal overflow separately
  overflowY?: Overflow; // ✅ Control vertical overflow separately
  background?: Background; // ✅ Background surface variant
  backgroundImage?: string; // ✅ Background image URL (for 'media' variant)
  backgroundOverlay?: boolean; // ✅ Add dark overlay over background image
  backgroundOverlayOpacity?: number; // ✅ Overlay opacity (0-1, default 0.5)
  layoutIntent?: LayoutIntent; // ✅ Layout intention for automatic bleed behavior
  noPaddingTop?: boolean; // ✅ Remove top padding (useful for split layouts)
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

const getBackgroundClass = (background?: Background): string => {
  if (!background || background === 'default') return '';
  return styles[`background${background.charAt(0).toUpperCase() + background.slice(1)}`] || '';
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
  overflow,
  overflowX,
  overflowY,
  background,
  backgroundImage,
  backgroundOverlay = false,
  backgroundOverlayOpacity = 0.5,
  layoutIntent = 'default',
  noPaddingTop = false,
  style,
  sectionKey,
}: SectionProps) => {
  const heightClass = getHeightClass(height);
  const positionClass = getPositionClass(position, sticky);
  const spacingClass = getSpacingClass(spacing);
  const overflowClass = getOverflowClass(overflow);
  const backgroundClass = getBackgroundClass(background);

  // Determine if this section should get automatic bleed behavior
  const isFullscreenIntent = layoutIntent === 'fullscreen' && height === 'screen';

  const combinedClassName = [
    styles.section,
    heightClass,
    positionClass,
    spacingClass,
    overflowClass,
    backgroundClass,
    isFullscreenIntent && styles.fullscreenIntent,
    className,
  ].join(' ').trim();

  const inlineStyles: React.CSSProperties = {};
  if (top !== undefined) inlineStyles.top = typeof top === 'number' ? `${top}px` : top;
  if (zIndex !== undefined) inlineStyles.zIndex = zIndex;
  if (overflowX !== undefined) inlineStyles.overflowX = overflowX;
  if (overflowY !== undefined) inlineStyles.overflowY = overflowY;

  // For noPaddingTop prop, explicitly remove top padding
  // Note: fullscreenIntent padding-top is handled by CSS class (.fullscreenIntent)
  // which applies var(--navbar-void) - the exact layout mass lost when navbar became fixed
  if (noPaddingTop && !isFullscreenIntent) {
    inlineStyles.paddingTop = 0;
  }

  if (backgroundImage && background === 'media') {
    inlineStyles.backgroundImage = `url(${backgroundImage})`;
  }

  const finalStyles = { ...inlineStyles, ...style };

  // Wrap children with Bleed when fullscreen intent is active
  const content = isFullscreenIntent ? (
    <Bleed blockStart="var(--space-navbar)">
      {children}
    </Bleed>
  ) : (
    children
  );

  return (
    <Component
      id={id}
      className={combinedClassName}
      style={finalStyles}
      data-section-key={sectionKey}
    >
      {backgroundImage && background === 'media' && backgroundOverlay && (
        <div
          className={styles.backgroundOverlay}
          style={{ opacity: backgroundOverlayOpacity }}
        />
      )}
      {content}
    </Component>
  );
};
