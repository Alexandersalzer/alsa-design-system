'use client';

import React from 'react';

export type EdgePosition = 'bottom' | 'top';
export type EdgeBlurMode = 'fade' | 'blur' | 'both';

export interface EdgeBlurProps {
  /** Position of the edge effect (default: 'bottom') */
  position?: EdgePosition;
  /** Height of the effect area in pixels (default: 60) */
  height?: number;
  /** Mode: 'fade' for soft gradient, 'blur' for backdrop blur, 'both' for combined (default: 'fade') */
  mode?: EdgeBlurMode;
  /** Blur intensity in pixels - only used when mode is 'blur' or 'both' (default: 8) */
  blur?: number;
  /** Opacity of the fade effect (0-1, default: 0.4) */
  opacity?: number;
  /** Whether to use fixed positioning (default: true) */
  fixed?: boolean;
  /** Custom z-index (default: 9999) */
  zIndex?: number;
  /** Additional className */
  className?: string;
}

/**
 * EdgeBlur - A subtle fade/blur effect at the edge of the viewport
 * 
 * Creates a smooth, almost invisible transition that softens content
 * at the edge of the screen. Three modes available:
 * - 'fade': Soft gradient overlay (smoothest, most subtle)
 * - 'blur': Backdrop blur effect
 * - 'both': Combined fade + blur
 * 
 * @example
 * // Basic soft fade (recommended)
 * <EdgeBlur />
 * 
 * @example
 * // Stronger fade
 * <EdgeBlur height={80} opacity={0.6} />
 * 
 * @example
 * // With blur effect
 * <EdgeBlur mode="blur" blur={12} />
 */
export function EdgeBlur({
  position = 'bottom',
  height = 100,
  mode = 'fade',
  blur = 8,
  opacity = 0.7,
  fixed = true,
  zIndex = 9999,
  className,
}: EdgeBlurProps) {
  const isTop = position === 'top';
  
  // Soft fade gradient - uses surface color that adapts to theme
  const fadeGradient = isTop
    ? `linear-gradient(
        to bottom,
        var(--surface-base, #ffffff) 0%,
        color-mix(in srgb, var(--surface-base, #ffffff) ${opacity * 100}%, transparent) 30%,
        transparent 100%
      )`
    : `linear-gradient(
        to top,
        var(--surface-base, #ffffff) 0%,
        color-mix(in srgb, var(--surface-base, #ffffff) ${opacity * 100}%, transparent) 30%,
        transparent 100%
      )`;

  // Blur mask - fades the blur effect smoothly
  const blurMask = isTop
    ? 'linear-gradient(to bottom, black 0%, transparent 100%)'
    : 'linear-gradient(to top, black 0%, transparent 100%)';

  const baseStyle: React.CSSProperties = {
    position: fixed ? 'fixed' : 'absolute',
    [position]: 0,
    left: 0,
    right: 0,
    height: `${height}px`,
    pointerEvents: 'none',
    zIndex,
  };

  // Fade-only mode (smoothest)
  if (mode === 'fade') {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{
          ...baseStyle,
          background: fadeGradient,
        }}
      />
    );
  }

  // Blur-only mode
  if (mode === 'blur') {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{
          ...baseStyle,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          maskImage: blurMask,
          WebkitMaskImage: blurMask,
        }}
      />
    );
  }

  // Both mode - layered fade + blur
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          ...baseStyle,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          maskImage: blurMask,
          WebkitMaskImage: blurMask,
        }}
      />
      <div
        aria-hidden="true"
        className={className}
        style={{
          ...baseStyle,
          background: fadeGradient,
        }}
      />
    </>
  );
}

export default EdgeBlur;
