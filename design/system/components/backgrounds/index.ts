/**
 * Background Components Index
 * 
 * Exporterar alla background-komponenter och presets för enkel import.
 */

export { GenerativeBackground } from './GenerativeBackground/GenerativeBackground';
export type { GenerativeBackgroundProps } from './GenerativeBackground/GenerativeBackground';

export { GradientBackground } from './GradientBackground/GradientBackground';
export type { GradientBackgroundProps } from './GradientBackground/GradientBackground';

export { PatternBackground } from './PatternBackground/PatternBackground';
export type { PatternBackgroundProps } from './PatternBackground/PatternBackground';

export { VideoBackground } from './VideoBackground/VideoBackground';
export type { VideoBackgroundProps } from './VideoBackground/VideoBackground';

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
