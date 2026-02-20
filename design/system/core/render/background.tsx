import React from 'react';
import { BackgroundType, BackgroundProps } from '../../components/backgrounds/types';
import { getBackgroundComponent, isRegisteredBackground } from '../../components/backgrounds/registry';

/**
 * Props configuration map for each background type
 * Maps the generic BackgroundProps to specific component props
 */
const propsMappers = {
  generative: (props: BackgroundProps) => ({
    variant: props.generativeVariant || 'subtle',
    colorScheme: props.generativeColorScheme || 'accent',
    seed: props.generativeSeed,
    intensity: props.generativeIntensity,
    blurAmount: props.generativeBlurAmount || props.generativeBlur,
    fadeEdge: props.generativeFadeEdge,
    fadeStrength: props.generativeFadeStrength,
  }),
  gradient: (props: BackgroundProps) => ({
    type: props.gradientType || 'mesh',
    colorScheme: props.gradientColorScheme || 'accent',
    animated: props.gradientAnimated,
    intensity: props.gradientIntensity,
    fadeEdge: props.gradientFadeEdge,
    fadeStrength: props.gradientFadeStrength,
  }),
  image: (props: BackgroundProps) => ({
    src: props.backgroundImage || '',
    size: props.backgroundSize,
    position: props.backgroundPosition,
    aspectRatio: props.backgroundAspectRatio,
    repeat: props.backgroundRepeat || 'repeat',
    opacity: props.backgroundOpacity,
    overlay: typeof props.backgroundOverlay === 'string' ? props.backgroundOverlay : false,
    overlayOpacity: props.backgroundOverlayOpacity,
    fadeEdge: props.imageFadeEdge,
    fadeStrength: props.imageFadeStrength,
    tint: props.backgroundTint ?? 'none',
    tintStrength: props.backgroundTintStrength ?? 1,
    themeAware: props.backgroundThemeAware ?? false,
  }),
  pattern: (props: BackgroundProps) => ({
    type: props.patternType || 'dots',
    colorScheme: props.patternColorScheme || 'neutral',
    density: props.patternDensity,
    animated: props.patternAnimated,
    opacity: props.patternOpacity,
    fadeEdge: props.patternFadeEdge,
    fadeStrength: props.patternFadeStrength,
  }),
  video: (props: BackgroundProps) => ({
    src: props.videoSrc || '',
    poster: props.videoPoster,
    fit: props.videoFit,
    overlayType: props.videoOverlayType,
    overlayOpacity: props.videoOverlayOpacity,
    playbackRate: props.videoPlaybackRate,
    fadeEdge: props.videoFadeEdge,
    fadeStrength: props.videoFadeStrength,
  }),
  solid: (props: BackgroundProps) => ({
    colorPreset: props.solidColorPreset,
    opacity: props.solidOpacity,
    fadeEdge: props.solidFadeEdge,
    fadeStrength: props.solidFadeStrength,
  }),
  particle: (props: BackgroundProps) => ({
    count: props.particleCount,
    colorScheme: props.particleColorScheme,
    customColors: props.particleCustomColors,
    speed: props.particleSpeed,
    minSize: props.particleMinSize,
    maxSize: props.particleMaxSize,
    minOpacity: props.particleMinOpacity,
    maxOpacity: props.particleMaxOpacity,
    blur: props.particleBlur,
  }),
} as const;

/**
 * Renders the appropriate background component based on the background type.
 * Uses the background registry for dynamic component lookup.
 * 
 * This helper eliminates code duplication between Section and PageBackground components
 * and makes it easy to add new background types by simply registering them.
 * 
 * @param type - The type of background to render
 * @param props - The background props containing configuration
 * @returns The rendered background component or null if no valid background type
 * 
 * @example
 * // In Section component:
 * {renderBackgroundComponent(background, props)}
 * 
 * @example
 * // In PageBackground component:
 * const bgComponent = renderBackgroundComponent(pageProps?.background, pageProps);
 */
export function renderBackgroundComponent(
  type: BackgroundType | undefined,
  props: BackgroundProps
): React.ReactNode {
  if (!type || !isRegisteredBackground(type)) {
    return null;
  }

  // Get the component from registry
  const Component = getBackgroundComponent(type);
  if (!Component) {
    return null;
  }

  // Get the props mapper for this type
  const mapper = propsMappers[type];
  if (!mapper) {
    return null;
  }

  // Map generic props to component-specific props and render
  const componentProps = mapper(props);
  return React.createElement(Component as React.ComponentType<any>, componentProps);
}
