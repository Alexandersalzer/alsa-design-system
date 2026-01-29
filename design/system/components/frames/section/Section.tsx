import React, { ReactNode } from 'react';
import styles from './Section.module.css';
import { GenerativeBackground } from '../../backgrounds/GenerativeBackground/GenerativeBackground';
import { GradientBackground } from '../../backgrounds/GradientBackground/GradientBackground';
import { PatternBackground } from '../../backgrounds/PatternBackground/PatternBackground';
import { VideoBackground } from '../../backgrounds/VideoBackground/VideoBackground';

type Height = 'auto' | 'full' | 'screen';
type Position = 'static' | 'relative' | 'sticky' | 'fixed' | 'absolute';
type SpacingScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Overflow = 'visible' | 'hidden' | 'auto' | 'scroll' | 'clip';
type Background = 'default' | 'raised' | 'elevated' | 'inverse' | 'media' | 'transparent' | 'generative' | 'gradient' | 'pattern' | 'video';
type ColorScheme = 'accent' | 'primary' | 'success' | 'warning' | 'info';

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
  spacing?: SpacingScale;
  overflow?: Overflow;
  overflowX?: Overflow;
  overflowY?: Overflow;
  background?: Background;
  backgroundImage?: string; // For 'media' and 'video' variants
  backgroundOverlay?: boolean;
  backgroundOverlayOpacity?: number;
  
  // Generative background props
  generativeVariant?: 'subtle' | 'medium' | 'vibrant';
  generativeColorScheme?: ColorScheme;
  generativeSeed?: number;
  generativeIntensity?: number;
  generativeBlur?: number;
  
  // Gradient background props
  gradientType?: 'mesh' | 'radial' | 'conic' | 'linear';
  gradientColorScheme?: ColorScheme;
  gradientAnimated?: boolean;
  gradientIntensity?: number;
  
  // Pattern background props
  patternType?: 'dots' | 'lines' | 'grid' | 'diagonal' | 'hexagon';
  patternColorScheme?: ColorScheme | 'neutral';
  patternDensity?: 'sparse' | 'normal' | 'dense';
  patternAnimated?: boolean;
  patternOpacity?: number;
  
  // Video background props
  videoSrc?: string;
  videoPoster?: string;
  videoFit?: 'cover' | 'contain' | 'fill';
  videoOverlayType?: 'none' | 'dark' | 'light' | 'gradient';
  videoOverlayOpacity?: number;
  videoPlaybackRate?: number;
  
  noPaddingTop?: boolean;
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
  spacing,
  overflow,
  overflowX,
  overflowY,
  background,
  backgroundImage,
  backgroundOverlay = false,
  backgroundOverlayOpacity = 0.5,
  // Generative props
  generativeVariant = 'subtle',
  generativeColorScheme = 'accent',
  generativeSeed = 1337,
  generativeIntensity = 1.0,
  generativeBlur = 18,
  // Gradient props
  gradientType = 'mesh',
  gradientColorScheme = 'accent',
  gradientAnimated = false,
  gradientIntensity = 1.0,
  // Pattern props
  patternType = 'dots',
  patternColorScheme = 'neutral',
  patternDensity = 'normal',
  patternAnimated = false,
  patternOpacity = 0.15,
  // Video props
  videoSrc,
  videoPoster,
  videoFit = 'cover',
  videoOverlayType = 'dark',
  videoOverlayOpacity = 0.3,
  videoPlaybackRate = 1.0,
  noPaddingTop = false,
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
  if (noPaddingTop) inlineStyles.paddingTop = 0;
  if (backgroundImage && background === 'media') {
    inlineStyles.backgroundImage = `url(${backgroundImage})`;
  }

  const finalStyles = { ...inlineStyles, ...style };

  return (
    <Component
      id={id}
      className={combinedClassName}
      style={finalStyles}
      data-section-key={sectionKey}
    >
      {/* Generative Background */}
      {background === 'generative' && (
        <GenerativeBackground 
          variant={generativeVariant}
          colorScheme={generativeColorScheme}
          seed={generativeSeed}
          intensity={generativeIntensity}
          blurAmount={generativeBlur}
        />
      )}

      {/* Gradient Background */}
      {background === 'gradient' && (
        <GradientBackground
          type={gradientType}
          colorScheme={gradientColorScheme}
          animated={gradientAnimated}
          intensity={gradientIntensity}
        />
      )}

      {/* Pattern Background */}
      {background === 'pattern' && (
        <PatternBackground
          type={patternType}
          colorScheme={patternColorScheme}
          density={patternDensity}
          animated={patternAnimated}
          opacity={patternOpacity}
        />
      )}

      {/* Video Background */}
      {background === 'video' && videoSrc && (
        <VideoBackground
          src={videoSrc}
          poster={videoPoster}
          fit={videoFit}
          overlayType={videoOverlayType}
          overlayOpacity={videoOverlayOpacity}
          playbackRate={videoPlaybackRate}
        />
      )}

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
