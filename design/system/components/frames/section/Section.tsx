import React, { ReactNode } from 'react';
import styles from './Section.module.css';
import { BackgroundProps, BackgroundType } from '../../backgrounds/types';
import { renderBackgroundComponent } from '../../../core/render/background';

type Height = 'auto' | 'full' | 'screen' | '90vh' | '75vh' | '50vh' | 'media-half';
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
  /** Override bottom padding with token value */
  paddingBottom?: SpacingScale | 'none';
  applyNavbarVoid?: boolean;
  style?: React.CSSProperties;
  sectionKey?: string;
  /** Add border to top of section */
  borderTop?: boolean;
  /** Add border to bottom of section */
  borderBottom?: boolean;
  /** Border weight/thickness */
  borderWeight?: 'thin' | 'default' | 'thick';
  /** Enable split background (background only covers portion of section) */
  backgroundSplit?: boolean;
  /** Split percentage - width of background on right side (default: 50) */
  backgroundSplitPercentage?: number;
  /** Mobile-specific background opacity (0-1) - only affects mobile screens */
  mobileBackgroundOpacity?: number;
}

const getHeightClass = (height: Height): string => {
  switch (height) {
    case '90vh':
      return styles.height90vh;
    case '75vh':
      return styles.height75vh;
    case '50vh':
      return styles.height50vh;
    case 'media-half':
      return styles.heightMediaHalf;
    case 'full': // deprecated, alias for screen
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
  borderTop = false,
  borderBottom = false,
  borderWeight = 'default',
  background,
  backgroundImage,
  backgroundSize,
  backgroundPosition,
  backgroundAspectRatio,
  backgroundRepeat,
  backgroundOpacity,
  backgroundOverlay = false,
  backgroundOverlayOpacity = 0.5,
  imageFadeEdge,
  imageFadeStrength,
  backgroundTint,
  backgroundTintStrength,
  backgroundThemeAware,
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
  paddingBottom,
  applyNavbarVoid = false,
  style,
  sectionKey,
  backgroundSplit = false,
  backgroundSplitPercentage = 50,
  mobileBackgroundOpacity,
}: SectionProps) => {
  // Media-half height calculation
  const [mediaHeight, setMediaHeight] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (height === 'media-half' && backgroundImage && (background === 'image' || background === 'media')) {
      const img = new Image();
      img.src = backgroundImage;
      img.onload = () => {
        setMediaHeight(img.naturalHeight / 2);
      };
      img.onerror = () => {
        setMediaHeight(null); // Fallback to CSS default (50vh)
      };
    }
  }, [height, backgroundImage, background]);

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

  // Apply border styles
  const borderWidthMap = {
    thin: '1px',
    default: '1px',
    thick: '2px'
  };

  if (borderTop) {
    inlineStyles.borderTop = `${borderWidthMap[borderWeight]} solid var(--border-default)`;
  }
  if (borderBottom) {
    inlineStyles.borderBottom = `${borderWidthMap[borderWeight]} solid var(--border-default)`;
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

  // Apply custom paddingBottom
  if (paddingBottom) {
    inlineStyles.paddingBottom = paddingBottom === 'none' 
      ? 0 
      : `var(--foundation-space-${paddingBottom})`;
  }

  if (backgroundImage && background === 'media') {
    inlineStyles.backgroundImage = `url(${backgroundImage})`;
  }

  const finalStyles = { ...inlineStyles, ...style };

  // CSS custom properties for dynamic values
  const customProperties: Record<string, string> = {};

  if (backgroundSplit && backgroundSplitPercentage) {
    customProperties['--split-percentage'] = `${backgroundSplitPercentage}%`;
  }

  if (height === 'media-half' && mediaHeight) {
    customProperties['--section-media-height'] = `${mediaHeight}px`;
  }

  if (mobileBackgroundOpacity !== undefined) {
    customProperties['--mobile-bg-opacity'] = `${mobileBackgroundOpacity}`;
  }

  const allStyles = { ...finalStyles, ...customProperties } as React.CSSProperties;

  // Create background props object for renderBackgroundComponent
  const backgroundProps: BackgroundProps = {
    background,
    backgroundImage,
    backgroundSize,
    backgroundPosition,
    backgroundAspectRatio,
    backgroundRepeat,
    backgroundOpacity,
    backgroundOverlay,
    backgroundOverlayOpacity,
    imageFadeEdge,
    imageFadeStrength,
    backgroundTint,
    backgroundTintStrength,
    backgroundThemeAware,
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
      style={allStyles}
      data-section-key={sectionKey}
    >
      {/* Render background - wrapped in split container if needed */}
      {backgroundSplit && background && background !== 'default' ? (
        <div className={styles.splitBackgroundContainer}>
          {renderBackgroundComponent(background, backgroundProps)}
        </div>
      ) : (
        renderBackgroundComponent(background, backgroundProps)
      )}

      {/* Background overlay for image + media - darkens the background */}
      {backgroundImage && (background === 'media' || background === 'image') && backgroundOverlay && !backgroundSplit && (
        <div
          className={styles.backgroundOverlay}
          style={{
            opacity: backgroundOverlayOpacity,
            ...(typeof backgroundOverlay === 'string' && { backgroundColor: backgroundOverlay }),
          }}
        />
      )}

      {children}
    </Component>
  );
};
