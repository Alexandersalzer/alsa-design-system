// ===============================================
// AnimatedBox Component
// Box with scroll-driven transform and opacity
// ===============================================

import React, { CSSProperties, forwardRef } from 'react';
import { cn } from '../../../utils/cn';

export interface AnimatedBoxProps {
  children: React.ReactNode;
  /** Opacity value (0-1) */
  opacity?: number;
  /** X translation in pixels */
  translateX?: number;
  /** Y translation in pixels */
  translateY?: number;
  /** Scale value */
  scale?: number;
  /** Additional className */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
  /** Transition duration (default: '0ms' for RAF-driven) */
  transitionDuration?: string;
}

/**
 * AnimatedBox - A box that can be animated with transforms
 * Designed to work with useScrollAnimation hook for smooth scroll-driven animations
 */
export const AnimatedBox = forwardRef<HTMLDivElement, AnimatedBoxProps>(
  (
    {
      children,
      opacity = 1,
      translateX = 0,
      translateY = 0,
      scale = 1,
      className,
      style,
      transitionDuration = '0ms',
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('animated-box', className)}
        style={{
          opacity,
          transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          transition: transitionDuration !== '0ms' ? `all ${transitionDuration} ease-out` : 'none',
          ...style,
        }}
      >
        {children}
      </div>
    );
  }
);

AnimatedBox.displayName = 'AnimatedBox';
