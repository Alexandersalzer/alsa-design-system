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
  /** Enable glow/spotlight effect at top (default: false) */
  backgroundGlow?: boolean;
  /** Glow color (default: rgba(255,255,255,0.06)) */
  backgroundGlowColor?: string;
  /** Glow size/spread (default: 65%) */
  backgroundGlowSize?: string;
  /** Enable mask/fade at bottom */
  backgroundMask?: boolean;
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
    BackgroundEffectsProps {
  background?: BackgroundType;
  backgroundColor?: string;
}
