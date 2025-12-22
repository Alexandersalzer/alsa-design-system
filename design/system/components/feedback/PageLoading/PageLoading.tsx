// ===============================================
// LOCATION: design/system/components/feedback/PageLoading/PageLoading.tsx
// PageLoading - Full page loading state with spinner and optional text
// ===============================================

'use client';

import React, { useState, useEffect } from 'react';
import { Spinner } from '../Spinner/Spinner';
import { Body } from '../../Typography';
import { VStack } from '../../layout';
import './PageLoading.css';

export interface PageLoadingProps {
  /** Static text to display */
  text?: string;
  /** Array of texts to cycle through with animation */
  animatedTexts?: string[];
  /** Interval between text changes in ms */
  textInterval?: number;
  /** Spinner size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Spinner variant */
  variant?: 'brand' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  /** Whether to take full viewport height */
  fullHeight?: boolean;
  /** Whether to show overlay backdrop */
  overlay?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * PageLoading - Standardized full-page loading state
 *
 * Features:
 * - Uses official Spinner component from design system
 * - Optional text with animated cycling
 * - Smooth fade-in animation
 * - Full height or inline modes
 * - Optional overlay backdrop
 *
 * @example
 * ```tsx
 * // Simple loading
 * <PageLoading text="Loading..." />
 *
 * // Animated texts
 * <PageLoading
 *   animatedTexts={["Loading data...", "Preparing content...", "Almost there..."]}
 *   textInterval={2000}
 * />
 * ```
 */
export const PageLoading: React.FC<PageLoadingProps> = ({
  text = 'Laddar...',
  animatedTexts,
  textInterval = 3000,
  size = 'lg',
  variant = 'accent',
  fullHeight = true,
  overlay = false,
  className,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  // Cycle through animated texts if provided
  useEffect(() => {
    if (!animatedTexts || animatedTexts.length === 0) return;

    const cycleInterval = setInterval(() => {
      // Fade out
      setFadeState('out');
      // After fade out, change text and fade in
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % animatedTexts.length);
        setFadeState('in');
      }, 300); // Fade out duration
    }, textInterval);

    return () => clearInterval(cycleInterval);
  }, [animatedTexts, textInterval]);

  const displayText =
    animatedTexts && animatedTexts.length > 0
      ? animatedTexts[currentTextIndex]
      : text;

  return (
    <div
      className={`page-loading ${fullHeight ? 'page-loading--full-height' : ''} ${overlay ? 'page-loading--overlay' : ''} ${className || ''}`}
    >
      <VStack spacing="md" align="center">
        <Spinner size={size} variant={variant} />
        {displayText && (
          <Body
            size="md"
            color="secondary"
            weight="medium"
            style={{
              opacity: fadeState === 'in' ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              minHeight: '1.5em',
            }}
          >
            {displayText}
          </Body>
        )}
      </VStack>
    </div>
  );
};

PageLoading.displayName = 'PageLoading';
