import React from 'react';
import { BackgroundType } from './types';
import { GenerativeBackground } from './GenerativeBackground/GenerativeBackground';
import { GradientBackground } from './GradientBackground/GradientBackground';
import { PatternBackground } from './PatternBackground/PatternBackground';
import { VideoBackground } from './VideoBackground/VideoBackground';
import { SolidBackground } from './SolidBackground/SolidBackground';
import { ImageBackground } from './ImageBackground/ImageBackground';

/**
 * Background component registry
 * Maps background types to their React components
 * 
 * This registry pattern allows for dynamic background rendering
 * and makes it easy to add new background types without modifying
 * the rendering logic in Section or PageBackground components.
 */
export const backgroundRegistry = {
  generative: GenerativeBackground,
  gradient: GradientBackground,
  pattern: PatternBackground,
  video: VideoBackground,
  solid: SolidBackground,
  image: ImageBackground,
} as const;

/**
 * Background components for the main component registry
 * Exported to be merged into the global componentRegistry
 */
export const backgroundComponents: Record<string, React.ComponentType<any>> = {
  GenerativeBackground,
  GradientBackground,
  PatternBackground,
  VideoBackground,
  SolidBackground,
  ImageBackground,
};

/**
 * Type for registered background components
 */
export type RegisteredBackgroundType = keyof typeof backgroundRegistry;

/**
 * Get a background component from the registry
 * 
 * @param type - The background type to look up
 * @returns The component class or undefined if not registered
 */
export function getBackgroundComponent(type: BackgroundType) {
  return backgroundRegistry[type as RegisteredBackgroundType];
}

/**
 * Check if a background type is registered
 * 
 * @param type - The background type to check
 * @returns True if the type is registered
 */
export function isRegisteredBackground(type: BackgroundType): type is RegisteredBackgroundType {
  return type in backgroundRegistry;
}

/**
 * Get all registered background types
 * 
 * @returns Array of registered background type keys
 */
export function getRegisteredBackgroundTypes(): RegisteredBackgroundType[] {
  return Object.keys(backgroundRegistry) as RegisteredBackgroundType[];
}
