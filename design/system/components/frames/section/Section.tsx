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
  /** Split variant: vertical (right band) or diagonal (image in upper-right triangle, slice from top-left to bottom-right) */
  backgroundSplitVariant?: 'vertical' | 'diagonal';
  /** Split percentage - width of background on right side for vertical (default: 50); diagonal uses full triangle */
  backgroundSplitPercentage?: number;
  /** Shape of the split edge */
  backgroundSplitShape?: 'straight' | 'diagonal' | 'diagonal-reverse' | 'wave';
  /** Mobile-specific background opacity (0-1) - only affects mobile screens */
  mobileBackgroundOpacity?: number;
  /** Image background opacity in light mode (0-1). Används t.ex. i footer så bilden blir ljusare. Default i footer: 0.55. */
  backgroundImageLightModeOpacity?: number;
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
  backgroundFilter,
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
  backgroundSplitVariant = 'vertical',
  backgroundSplitPercentage = 50,
  backgroundSplitShape = 'straight',
  backgroundSplitInset,
  backgroundSplitRadius,
  mobileBackgroundOpacity,
  backgroundImageLightModeOpacity,
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
  // Foundation spacing är numeriskt (--foundation-space-4 osv), mappa semantiska namn
  const insetTokenMap: Record<string, string> = {
    xs: '2',
    sm: '3',
    md: '4',
    lg: '6',
    xl: '8',
    '2xl': '12',
    '3xl': '16', /* 64px */
  };
  if (backgroundSplit && backgroundSplitInset && backgroundSplitInset !== 'none') {
    const token = insetTokenMap[backgroundSplitInset] ?? '4';
    customProperties['--split-inset'] = `var(--foundation-space-${token})`;
  }
  if (backgroundSplit && backgroundSplitRadius && backgroundSplitRadius !== 'none') {
    customProperties['--split-radius'] = `var(--radius-${backgroundSplitRadius})`;
  }

  if (height === 'media-half' && mediaHeight) {
    customProperties['--section-media-height'] = `${mediaHeight}px`;
  }

  if (mobileBackgroundOpacity !== undefined) {
    customProperties['--mobile-bg-opacity'] = `${mobileBackgroundOpacity}`;
  }

  if (backgroundImageLightModeOpacity !== undefined) {
    customProperties['--section-bg-image-light-opacity'] = String(backgroundImageLightModeOpacity);
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
    backgroundFilter,
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
      {...(background && background !== 'default' && { 'data-background': background })}
    >
      {/* Render background - wrapped in split container if needed */}
      {backgroundSplit && background && background !== 'default' ? (
        <div 
          className={styles.splitBackgroundContainer}
          data-split-shape={backgroundSplitShape}
        >
          {renderBackgroundComponent(background, backgroundProps)}
        </div>
      ) : (
        renderBackgroundComponent(background, backgroundProps)
      )}

      {/* Background overlay för media (image använder ImageBackgrounds egen overlay) */}
      {backgroundImage && background === 'media' && backgroundOverlay && !backgroundSplit && (
        <div
          className={styles.backgroundOverlay}
          style={{
            opacity: backgroundOverlayOpacity,
            ...(typeof backgroundOverlay === 'string' && { backgroundColor: backgroundOverlay }),
          }}
        />
      )}

      {/* Fit mode: image drives height, content overlays on top */}
      {backgroundSize === 'fit' && background === 'image' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          {children}
        </div>
      ) : (
        children
      )}
    </Component>
  );
};
