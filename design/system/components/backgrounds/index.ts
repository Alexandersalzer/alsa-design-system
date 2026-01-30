/**
 * Background Components Index
 * 
 * Exporterar alla background-komponenter och presets för enkel import.
 */

export { GenerativeBackground } from './GenerativeBackground/GenerativeBackground';
export type { GenerativeBackgroundProps, FadeEdge as GenerativeFadeEdge } from './GenerativeBackground/GenerativeBackground';

export { GradientBackground } from './GradientBackground/GradientBackground';
export type { GradientBackgroundProps, FadeEdge as GradientFadeEdge } from './GradientBackground/GradientBackground';

export { PatternBackground } from './PatternBackground/PatternBackground';
export type { PatternBackgroundProps, FadeEdge as PatternFadeEdge } from './PatternBackground/PatternBackground';

export { VideoBackground } from './VideoBackground/VideoBackground';
export type { VideoBackgroundProps, FadeEdge as VideoFadeEdge } from './VideoBackground/VideoBackground';

export { SolidBackground } from './SolidBackground/SolidBackground';
export type { SolidBackgroundProps, FadeEdge as SolidFadeEdge, ColorPreset as SolidColorPreset } from './SolidBackground/SolidBackground';

// Shared types
export type FadeEdge = 'top' | 'bottom' | 'both' | 'none';

// Export centralized background types
export * from './types';

export {
  BACKGROUND_PRESETS,
  GENERATIVE_PRESETS,
  GRADIENT_PRESETS,
  PATTERN_PRESETS,
  LAYERED_PRESETS,
  getBackgroundPreset,
  listBackgroundPresets,
  getPresetsByType,
} from './background-presets';

export type {
  BackgroundPreset,
  BackgroundLayer,
} from './background-presets';
