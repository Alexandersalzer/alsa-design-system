'use client';

import React from 'react';

// ============================================
// BOTTOM BLUR COMPONENT
// A stacked blur effect for smooth edge transitions
// Uses 8 progressive blur layers with masks
// ============================================

export type BottomBlurVariant = 'subtle' | 'medium' | 'strong' | 'reflection';
export type BottomBlurPosition = 'bottom' | 'top';

export interface BottomBlurProps {
  /** Preset variant or true for default (medium) */
  variant?: BottomBlurVariant | boolean;
  /** Position of the blur effect */
  position?: BottomBlurPosition;
  /** Custom height in pixels (overrides variant) */
  height?: number;
  /** Custom max blur amount in pixels (overrides variant) */
  blurAmount?: number;
  /** Opacity of the blur effect (0-1) */
  opacity?: number;
  /** Base z-index for blur layers (default: 9990) */
  zIndex?: number;
  /** Whether the blur is enabled */
  enabled?: boolean;
}

// Variant presets
const BLUR_PRESETS: Record<BottomBlurVariant, { height: number; maxBlur: number }> = {
  subtle: { height: 60, maxBlur: 6 },
  medium: { height: 80, maxBlur: 10 },
  strong: { height: 100, maxBlur: 14 },
  reflection: { height: 120, maxBlur: 20 },
};

// Progressive blur multipliers (8 layers)
const BLUR_MULTIPLIERS = [0.0078, 0.0156, 0.03125, 0.0625, 0.125, 0.25, 0.5, 1];

/**
 * BottomBlur - Creates a smooth blur transition at screen edges
 * 
 * Uses stacked backdrop-filter layers with masks for a natural blur falloff.
 * Can be positioned at bottom (default) or top of the viewport.
 * 
 * @example
 * // Using variant
 * <BottomBlur variant="reflection" />
 * 
 * @example
 * // Custom settings
 * <BottomBlur height={150} blurAmount={25} position="top" />
 * 
 * @example
 * // Conditional rendering
 * <BottomBlur enabled={showBlur} variant="subtle" />
 */
export const BottomBlur: React.FC<BottomBlurProps> = ({
  variant = 'medium',
  position = 'bottom',
  height,
  blurAmount,
  opacity = 1,
  zIndex = 9990,
  enabled = true,
}) => {
  // Early return if disabled
  if (!enabled) return null;

  // Resolve variant to preset
  const variantKey: BottomBlurVariant = typeof variant === 'boolean' 
    ? 'medium' 
    : variant;
  
  const preset = BLUR_PRESETS[variantKey] || BLUR_PRESETS.medium;
  
  // Allow prop overrides
  const blurHeight = height ?? preset.height;
  const maxBlur = blurAmount ?? preset.maxBlur;
  
  // Calculate blur values for each layer
  const blurValues = BLUR_MULTIPLIERS.map(m => maxBlur * m);
  
  // Generate mask gradient for a specific layer
  const getMaskGradient = (layerIndex: number): string => {
    const bandHeight = blurHeight / 8;
    const bandTop = blurHeight - (bandHeight * (layerIndex + 2));
    const bandBottom = blurHeight - (bandHeight * layerIndex);
    
    // Flip gradient direction based on position
    if (position === 'top') {
      return `linear-gradient(to bottom, 
        transparent calc(0% + ${Math.max(0, bandTop - bandHeight)}px),
        black calc(0% + ${Math.max(0, bandTop)}px),
        black calc(0% + ${Math.max(0, bandBottom)}px),
        transparent calc(0% + ${Math.max(0, bandBottom + bandHeight)}px),
        transparent 100%
      )`;
    }
    
    // Default: bottom position
    return `linear-gradient(to bottom, 
      transparent 0%, 
      transparent calc(100% - ${Math.max(0, bandBottom + bandHeight)}px),
      black calc(100% - ${Math.max(0, bandBottom)}px),
      black calc(100% - ${Math.max(0, bandTop)}px),
      transparent calc(100% - ${Math.max(0, bandTop - bandHeight)}px),
      transparent 100%
    )`;
  };
  
  return (
    <>
      {blurValues.map((blur, i) => (
        <div
          key={`blur-layer-${i}`}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'transparent',
            pointerEvents: 'none',
            zIndex: zIndex + i,
            opacity,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: getMaskGradient(i),
            WebkitMaskImage: getMaskGradient(i),
          }}
        />
      ))}
    </>
  );
};

BottomBlur.displayName = 'BottomBlur';

export default BottomBlur;
