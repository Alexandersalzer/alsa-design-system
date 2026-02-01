'use client';

import React from 'react';
import styles from './EdgeBlur.module.css';

export type EdgePosition = 'bottom' | 'top';

export interface EdgeBlurProps {
  /** Position of the blur edge (default: 'bottom') */
  position?: EdgePosition;
  /** Height of the blur area in pixels (default: 80) */
  height?: number;
  /** Blur intensity in pixels (default: 12) */
  blur?: number;
  /** How much the blur "peaks" in the center - creates the triangle effect (0-1, default: 0.3) */
  peak?: number;
  /** Whether to use fixed positioning (default: true) */
  fixed?: boolean;
  /** Custom z-index (default: 9999) */
  zIndex?: number;
  /** Additional className */
  className?: string;
}

/**
 * EdgeBlur - A subtle blur effect that sits at the edge of the viewport
 * 
 * Creates a frosted glass effect that naturally "respects" the colors
 * underneath, with an optional "peak" that creates a subtle triangle
 * effect where strong colors meet.
 * 
 * @example
 * // Basic usage - fixed to bottom of viewport
 * <EdgeBlur />
 * 
 * @example
 * // Custom height and blur
 * <EdgeBlur height={100} blur={16} />
 * 
 * @example
 * // Top edge with peak effect
 * <EdgeBlur position="top" peak={0.5} />
 */
export function EdgeBlur({
  position = 'bottom',
  height = 80,
  blur = 12,
  peak = 0.3,
  fixed = true,
  zIndex = 9999,
  className,
}: EdgeBlurProps) {
  // Calculate mask gradient based on peak value
  // Peak creates a subtle curve/triangle in the center
  const maskGradient = position === 'bottom'
    ? `linear-gradient(
        to top,
        black 0%,
        black ${20 + peak * 10}%,
        rgba(0,0,0,${0.5 - peak * 0.3}) ${50 + peak * 20}%,
        transparent 100%
      )`
    : `linear-gradient(
        to bottom,
        black 0%,
        black ${20 + peak * 10}%,
        rgba(0,0,0,${0.5 - peak * 0.3}) ${50 + peak * 20}%,
        transparent 100%
      )`;

  const style: React.CSSProperties = {
    position: fixed ? 'fixed' : 'absolute',
    [position]: 0,
    left: 0,
    right: 0,
    height: `${height}px`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    maskImage: maskGradient,
    WebkitMaskImage: maskGradient,
    pointerEvents: 'none',
    zIndex,
  };

  return (
    <div
      aria-hidden="true"
      className={className}
      style={style}
    />
  );
}

export default EdgeBlur;
