/**
 * Background system types - Shared across Page and Section components
 */

export type BackgroundType = 
  | 'default' 
  | 'raised' 
  | 'elevated' 
  | 'inverse' 
  | 'media' 
  | 'transparent' 
  | 'generative' 
  | 'gradient' 
  | 'pattern' 
  | 'video' 
  | 'solid'
  | 'image'
  | 'particle';

export type ColorScheme = 'accent' | 'primary' | 'success' | 'warning' | 'info';
export type FadeEdge = 'top' | 'bottom' | 'both' | 'none';

// ===== GENERATIVE BACKGROUND =====
export interface GenerativeBackgroundProps {
  generativeVariant?: 'subtle' | 'medium' | 'vibrant';
  generativeColorScheme?: ColorScheme;
  generativeSeed?: number;
  generativeIntensity?: number;
  generativeBlurAmount?: number;
  generativeBlur?: number; // Alias for backward compatibility
  generativeFadeEdge?: FadeEdge;
  generativeFadeStrength?: number;
}

// ===== GRADIENT BACKGROUND =====
export interface GradientBackgroundProps {
  gradientType?: 'mesh' | 'radial' | 'conic' | 'linear';
  gradientColorScheme?: ColorScheme;
  gradientAnimated?: boolean;
  gradientIntensity?: number;
  gradientFadeEdge?: FadeEdge;
  gradientFadeStrength?: number;
}

// ===== IMAGE BACKGROUND =====
export interface ImageBackgroundProps {
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto' | string;
  backgroundPosition?: string;
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' | 'space' | 'round';
  backgroundOpacity?: number;
  backgroundOverlay?: string | false;
  backgroundOverlayOpacity?: number;
  backgroundBlendMode?: 'overlay' | 'soft-light' | 'multiply' | 'screen' | 'normal';
  /** Invert the background image colors */
  backgroundInvert?: boolean;
  /** Custom CSS filter for background image */
  backgroundFilter?: string;
  imageFadeEdge?: FadeEdge;
  imageFadeStrength?: number;
}

// ===== PATTERN BACKGROUND =====
export interface PatternBackgroundProps {
  patternType?: 'dots' | 'lines' | 'grid' | 'diagonal' | 'hexagon';
  patternColorScheme?: ColorScheme | 'neutral';
  patternDensity?: 'sparse' | 'normal' | 'dense';
  patternAnimated?: boolean;
  patternOpacity?: number;
  patternFadeEdge?: FadeEdge;
  patternFadeStrength?: number;
}

// ===== VIDEO BACKGROUND =====
export interface VideoBackgroundProps {
  videoSrc?: string;
  videoPoster?: string;
  videoFit?: 'cover' | 'contain' | 'fill';
  videoOverlayType?: 'none' | 'dark' | 'light' | 'gradient';
  videoOverlayOpacity?: number;
  videoPlaybackRate?: number;
  videoFadeEdge?: FadeEdge;
  videoFadeStrength?: number;
}

// ===== SOLID BACKGROUND =====
export interface SolidBackgroundProps {
  solidColorPreset?: 'white' | 'black' | 'surface' | 'surface-raised' | 'surface-elevated' | 'accent' | 'accent-subtle';
  solidOpacity?: number;
  solidFadeEdge?: FadeEdge;
  solidFadeStrength?: number;
}

// ===== PARTICLE BACKGROUND =====
export interface ParticleBackgroundProps {
  particleCount?: number;
  particleColorScheme?: 'light' | 'warm' | 'cool' | 'accent' | 'custom';
  particleCustomColors?: string[];
  particleSpeed?: number;
  particleMinSize?: number;
  particleMaxSize?: number;
  particleMinOpacity?: number;
  particleMaxOpacity?: number;
  particleBlur?: number;
}


// ===== GLOW/MASK EFFECTS =====
export interface BackgroundEffectsProps {
  /** Enable glow/spotlight effect */
  backgroundGlow?: boolean;
  /** Glow intensity (0-1, default: 0.15) */
  backgroundGlowIntensity?: number;
  /** Glow vertical size/spread (default: 60%) */
  backgroundGlowSize?: string;
  /** Glow horizontal width (default: 120%) */
  backgroundGlowWidth?: string;
  /** Glow position: 'top' | 'center' | 'bottom' or custom "x% y%" */
  backgroundGlowPosition?: 'top' | 'center' | 'bottom' | string;
  /** Glow color in RGB format (default: '255,255,255') */
  backgroundGlowColor?: string;
  
  /** Enable mask/fade effect at bottom */
  backgroundMask?: boolean;
  /** Mask opacity (0-1, default: 0.3) */
  backgroundMaskOpacity?: number;
  /** Where mask fade begins in % (default: 75) */
  backgroundMaskStart?: number;
  /** Mask color in RGB format (default: '0,0,0') */
  backgroundMaskColor?: string;
}

// ===== BOTTOM BLUR =====
export type BottomBlurVariant = 'subtle' | 'medium' | 'strong' | 'reflection';
export type BottomBlurPosition = 'bottom' | 'top';

export interface BottomBlurProps {
  /** Enable blur effect - boolean or variant name */
  bottomBlur?: boolean | BottomBlurVariant;
  /** Custom height in pixels (overrides variant) */
  bottomBlurHeight?: number;
  /** Custom max blur amount in pixels (overrides variant) */
  bottomBlurAmount?: number;
  /** Position of blur: 'bottom' (default) or 'top' */
  bottomBlurPosition?: BottomBlurPosition;
  /** Opacity of blur effect (0-1) */
  bottomBlurOpacity?: number;
}

// ===== COMBINED BACKGROUND PROPS =====
/**
 * All background-related props combined
 * Use this for components that support all background types
 */
export interface BackgroundProps
  extends GenerativeBackgroundProps,
    GradientBackgroundProps,
    PatternBackgroundProps,
    VideoBackgroundProps,
    SolidBackgroundProps,
    ImageBackgroundProps,
    ParticleBackgroundProps,
    BackgroundEffectsProps,
    BottomBlurProps {
  background?: BackgroundType;
  backgroundColor?: string;
  /** Enable split background (background only covers portion of section) */
  backgroundSplit?: boolean;
  /** Split percentage - width of background on right side (default: 50) */
  backgroundSplitPercentage?: number;
}
