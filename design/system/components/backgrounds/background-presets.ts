/**
 * Background Presets
 * 
 * Pre-configured background combinations för snabb iteration.
 * Använd dessa i start.json för konsekvent visuell identitet.
 */

import type { GenerativeBackgroundProps } from './GenerativeBackground/GenerativeBackground';
import type { GradientBackgroundProps } from './GradientBackground/GradientBackground';
import type { PatternBackgroundProps } from './PatternBackground/PatternBackground';
import type { VideoBackgroundProps } from './VideoBackground/VideoBackground';

export interface BackgroundPreset {
  type: 'generative' | 'gradient' | 'pattern' | 'video' | 'layered';
  name: string;
  description: string;
  config: any; // Type varies based on background type
  layers?: BackgroundLayer[]; // För layered backgrounds
}

export interface BackgroundLayer {
  type: 'generative' | 'gradient' | 'pattern' | 'video';
  config: any;
  zIndex?: number;
  blendMode?: string;
  opacity?: number;
}

// ===== GENERATIVE PRESETS =====

export const GENERATIVE_PRESETS: Record<string, BackgroundPreset> = {
  'hero-vibrant': {
    type: 'generative',
    name: 'Hero Vibrant',
    description: 'Kraftfull vattenfärg för hero-sections',
    config: {
      variant: 'vibrant',
      colorScheme: 'accent',
      seed: 42,
      intensity: 1.0,
      blurAmount: 20,
    } as GenerativeBackgroundProps,
  },
  'subtle-accent': {
    type: 'generative',
    name: 'Subtle Accent',
    description: 'Diskret vattenfärg för content-sections',
    config: {
      variant: 'subtle',
      colorScheme: 'accent',
      seed: 1337,
      intensity: 0.8,
      blurAmount: 18,
    } as GenerativeBackgroundProps,
  },
  'calm-primary': {
    type: 'generative',
    name: 'Calm Primary',
    description: 'Lugn blå vattenfärg',
    config: {
      variant: 'medium',
      colorScheme: 'primary',
      seed: 777,
      intensity: 0.9,
      blurAmount: 22,
    } as GenerativeBackgroundProps,
  },
  'success-soft': {
    type: 'generative',
    name: 'Success Soft',
    description: 'Mjuk grön vattenfärg för success states',
    config: {
      variant: 'subtle',
      colorScheme: 'success',
      seed: 888,
      intensity: 0.7,
      blurAmount: 16,
    } as GenerativeBackgroundProps,
  },
};

// ===== GRADIENT PRESETS =====

export const GRADIENT_PRESETS: Record<string, BackgroundPreset> = {
  'mesh-modern': {
    type: 'gradient',
    name: 'Mesh Modern',
    description: 'Modern mesh-gradient à la Stripe',
    config: {
      type: 'mesh',
      colorScheme: 'accent',
      animated: false,
      intensity: 1.0,
    } as GradientBackgroundProps,
  },
  'radial-hero': {
    type: 'gradient',
    name: 'Radial Hero',
    description: 'Klassisk radial gradient för hero',
    config: {
      type: 'radial',
      colorScheme: 'primary',
      animated: false,
      intensity: 0.9,
    } as GradientBackgroundProps,
  },
  'conic-animated': {
    type: 'gradient',
    name: 'Conic Animated',
    description: 'Roterande färghjul',
    config: {
      type: 'conic',
      colorScheme: 'accent',
      animated: true,
      intensity: 0.6,
    } as GradientBackgroundProps,
  },
};

// ===== PATTERN PRESETS =====

export const PATTERN_PRESETS: Record<string, BackgroundPreset> = {
  'dots-subtle': {
    type: 'pattern',
    name: 'Dots Subtle',
    description: 'Diskreta prickar',
    config: {
      type: 'dots',
      colorScheme: 'neutral',
      density: 'normal',
      animated: false,
      opacity: 0.1,
    } as PatternBackgroundProps,
  },
  'grid-tech': {
    type: 'pattern',
    name: 'Grid Tech',
    description: 'Teknisk grid för SaaS/tech',
    config: {
      type: 'grid',
      colorScheme: 'primary',
      density: 'sparse',
      animated: false,
      opacity: 0.15,
    } as PatternBackgroundProps,
  },
  'lines-minimal': {
    type: 'pattern',
    name: 'Lines Minimal',
    description: 'Minimalistiska linjer',
    config: {
      type: 'lines',
      colorScheme: 'neutral',
      density: 'normal',
      animated: true,
      opacity: 0.08,
    } as PatternBackgroundProps,
  },
};

// ===== LAYERED PRESETS =====

export const LAYERED_PRESETS: Record<string, BackgroundPreset> = {
  'hero-rich': {
    type: 'layered',
    name: 'Hero Rich',
    description: 'Rik hero med gradient + pattern',
    config: {},
    layers: [
      {
        type: 'gradient',
        config: {
          type: 'mesh',
          colorScheme: 'accent',
          intensity: 0.8,
        } as GradientBackgroundProps,
        zIndex: 0,
        opacity: 1.0,
      },
      {
        type: 'pattern',
        config: {
          type: 'dots',
          colorScheme: 'neutral',
          density: 'sparse',
          opacity: 0.1,
        } as PatternBackgroundProps,
        zIndex: 1,
        opacity: 1.0,
      },
    ],
  },
  'video-overlay': {
    type: 'layered',
    name: 'Video Overlay',
    description: 'Video med generativ overlay',
    config: {},
    layers: [
      {
        type: 'video',
        config: {
          src: '/videos/hero-bg.mp4',
          overlayType: 'dark',
          overlayOpacity: 0.4,
        } as VideoBackgroundProps,
        zIndex: 0,
      },
      {
        type: 'generative',
        config: {
          variant: 'subtle',
          colorScheme: 'accent',
          intensity: 0.5,
          blurAmount: 30,
        } as GenerativeBackgroundProps,
        zIndex: 1,
        blendMode: 'overlay',
        opacity: 0.6,
      },
    ],
  },
};

// ===== EXPORT ALL PRESETS =====

export const BACKGROUND_PRESETS = {
  ...GENERATIVE_PRESETS,
  ...GRADIENT_PRESETS,
  ...PATTERN_PRESETS,
  ...LAYERED_PRESETS,
};

// Helper function to get preset by name
export function getBackgroundPreset(presetName: string): BackgroundPreset | undefined {
  return BACKGROUND_PRESETS[presetName];
}

// Helper function to list all presets
export function listBackgroundPresets(): string[] {
  return Object.keys(BACKGROUND_PRESETS);
}

// Helper function to filter presets by type
export function getPresetsByType(type: BackgroundPreset['type']): BackgroundPreset[] {
  return Object.values(BACKGROUND_PRESETS).filter(preset => preset.type === type);
}
