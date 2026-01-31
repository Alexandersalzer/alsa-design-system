import React, { ReactNode } from 'react';
import styles from './Section.module.css';
import { BackgroundProps, BackgroundType } from '../../backgrounds/types';
import { renderBackgroundComponent } from '../../../core/render/background';

type Height = 'auto' | 'full' | 'screen';
type Position = 'static' | 'relative' | 'sticky' | 'fixed' | 'absolute';
type SpacingScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Overflow = 'visible' | 'hidden' | 'auto' | 'scroll' | 'clip';
type ContentPosition = 'top' | 'center' | 'bottom';

interface SectionProps extends BackgroundProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  height?: Height;
  /** Vertical position of content when height is full/screen */
  contentPosition?: ContentPosition;
  position?: Position;
  sticky?: boolean;
  top?: string | number;
  zIndex?: number;
  spacing?: SpacingScale;
  overflow?: Overflow;
  overflowX?: Overflow;
  overflowY?: Overflow;
  noPaddingTop?: boolean;
  applyNavbarVoid?: boolean;
  style?: React.CSSProperties;
  sectionKey?: string;
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

const getBackgroundClass = (background?: BackgroundType): string => {
  if (!background || background === 'default') return '';
  return styles[`background${background.charAt(0).toUpperCase() + background.slice(1)}`] || '';
};

export const Section = ({
  children,
  className = '',
  id,
  as: Component = 'section',
  height = 'auto',
  contentPosition = 'center',
  position = 'relative',
  sticky = false,
  top,
  zIndex,
  spacing,
  overflow,
  overflowX,
  overflowY,
  background,
  backgroundImage,
  backgroundSize,
  backgroundPosition,
  backgroundRepeat,
  backgroundOpacity,
  backgroundOverlay = false,
  backgroundOverlayOpacity = 0.5,
  imageFadeEdge,
  imageFadeStrength,
  // Generative props
  generativeVariant = 'subtle',
  generativeColorScheme = 'accent',
  generativeSeed = 1337,
  generativeIntensity = 1.0,
  generativeBlur = 18,
  generativeFadeEdge = 'none',
  generativeFadeStrength = 0.15,
  // Gradient props
  gradientType = 'mesh',
  gradientColorScheme = 'accent',
  gradientAnimated = false,
  gradientIntensity = 1.0,
  gradientFadeEdge = 'none',
  gradientFadeStrength = 0.15,
  // Pattern props
  patternType = 'dots',
  patternColorScheme = 'neutral',
  patternDensity = 'normal',
  patternAnimated = false,
  patternOpacity = 0.15,
  patternFadeEdge = 'none',
  patternFadeStrength = 0.15,
  // Video props
  videoSrc,
  videoPoster,
  videoFit = 'cover',
  videoOverlayType = 'dark',
  videoOverlayOpacity = 0.3,
  videoPlaybackRate = 1.0,
  videoFadeEdge = 'none',
  videoFadeStrength = 0.15,
  // Solid props
  solidColorPreset = 'white',
  solidOpacity = 1,
  solidFadeEdge = 'none',
  solidFadeStrength = 0.15,
  noPaddingTop = false,
  applyNavbarVoid = false,
  style,
  sectionKey,
}: SectionProps) => {
  const heightClass = getHeightClass(height);
  const positionClass = getPositionClass(position, sticky);
  const spacingClass = getSpacingClass(spacing);
  const overflowClass = getOverflowClass(overflow);
  const backgroundClass = getBackgroundClass(background);

  const combinedClassName = [
    styles.section,
    heightClass,
    positionClass,
    spacingClass,
    overflowClass,
    backgroundClass,
    className,
  ].join(' ').trim();

  const inlineStyles: React.CSSProperties = {};
  if (top !== undefined) inlineStyles.top = typeof top === 'number' ? `${top}px` : top;
  if (zIndex !== undefined) inlineStyles.zIndex = zIndex;
  if (overflowX !== undefined) inlineStyles.overflowX = overflowX;
  if (overflowY !== undefined) inlineStyles.overflowY = overflowY;
  
  // Content position for full/screen height sections
  if (height === 'full' || height === 'screen') {
    const positionMap: Record<ContentPosition, string> = {
      top: 'flex-start',
      center: 'center',
      bottom: 'flex-end',
    };
    inlineStyles.justifyContent = positionMap[contentPosition];
  }

  // Apply navbar void compensation for hero sections
  // This overrides default section padding to compensate for fixed navbar
  if (applyNavbarVoid) {
    inlineStyles.paddingTop = 'var(--navbar-void)';
    inlineStyles.overflow = 'visible';
  }
  // For noPaddingTop prop, explicitly remove top padding
  else if (noPaddingTop && !applyNavbarVoid) {
    inlineStyles.paddingTop = 0;
  }

  if (backgroundImage && background === 'media') {
    inlineStyles.backgroundImage = `url(${backgroundImage})`;
  }

  const finalStyles = { ...inlineStyles, ...style };

  // Create background props object for renderBackgroundComponent
  const backgroundProps: BackgroundProps = {
    background,
    backgroundImage,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat,
    backgroundOpacity,
    backgroundOverlay,
    backgroundOverlayOpacity,
    imageFadeEdge,
    imageFadeStrength,
    generativeVariant,
    generativeColorScheme,
    generativeSeed,
    generativeIntensity,
    generativeBlur,
    generativeFadeEdge,
    generativeFadeStrength,
    gradientType,
    gradientColorScheme,
    gradientAnimated,
    gradientIntensity,
    gradientFadeEdge,
    gradientFadeStrength,
    patternType,
    patternColorScheme,
    patternDensity,
    patternAnimated,
    patternOpacity,
    patternFadeEdge,
    patternFadeStrength,
    videoSrc,
    videoPoster,
    videoFit,
    videoOverlayType,
    videoOverlayOpacity,
    videoPlaybackRate,
    videoFadeEdge,
    videoFadeStrength,
    solidColorPreset,
    solidOpacity,
    solidFadeEdge,
    solidFadeStrength,
  };

  return (
    <Component
      id={id}
      className={combinedClassName}
      style={finalStyles}
      data-section-key={sectionKey}
    >
      {/* Render background using helper */}
      {renderBackgroundComponent(background, backgroundProps)}

      {/* Media Background Overlay (legacy) */}
      {backgroundImage && background === 'media' && backgroundOverlay && (
        <div
          className={styles.backgroundOverlay}
          style={{ opacity: backgroundOverlayOpacity }}
        />
      )}
      
      {children}
    </Component>
  );
};
