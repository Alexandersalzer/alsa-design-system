// ===============================================
// LOCATION: design/system/components/feedback/PageLoading/PageLoading.tsx
// PageLoading - Full page loading state with spinner and optional text
// ===============================================

"use client";

import React, { useState, useEffect } from "react";
import { Spinner, SpinnerProps } from "../Spinner/Spinner";
import { Body } from "../../Typography";
import { VStack } from "../../layout";
import "./PageLoading.css";

export interface PageLoadingProps {
  /** Loading message text */
  text?: string;

  /** Secondary text shown below the main text (e.g. estimated time) */
  subtext?: string;

  /** Array of texts to cycle through (optional) */
  animatedTexts?: string[];

  /** Interval in ms between text changes (default 3000) */
  textInterval?: number;

  /** Spinner size */
  size?: SpinnerProps["size"];

  /** Spinner variant */
  variant?: SpinnerProps["variant"];

  /** Whether to fill full viewport height (default true) */
  fullHeight?: boolean;

  /** Whether to show backdrop overlay (default false) */
  overlay?: boolean;

  /** Disable fade-in animation for instant appearance (default false) */
  instant?: boolean;

  /** Custom className */
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
  text = "Laddar...",
  subtext,
  animatedTexts,
  textInterval = 3000,
  size = "lg",
  variant = "accent",
  fullHeight = true,
  overlay = false,
  instant = false,
  className,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");

  // Cycle through animated texts if provided
  useEffect(() => {
    if (!animatedTexts || animatedTexts.length === 0) return;

    const cycleInterval = setInterval(() => {
      // Fade out
      setFadeState("out");

      // After fade out, change text and fade in
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % animatedTexts.length);
        setFadeState("in");
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
      className={`page-loading ${fullHeight ? "page-loading--full-height" : ""} ${overlay ? "page-loading--overlay" : ""} ${instant ? "page-loading--instant" : ""} ${className || ""}`}
    >
      <VStack spacing="md" align="center">
        <Spinner size={size} variant={variant} />

        {displayText && (
          <Body
            size="md"
            color="secondary"
            weight="medium"
            style={{
              opacity: fadeState === "in" ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              minHeight: "1.5em",
            }}
          >
            {displayText}
          </Body>
        )}

        {subtext && (
          <Body
            size="sm"
            color="tertiary"
            align="center"
          >
            {subtext}
          </Body>
        )}
      </VStack>
    </div>
  );
};

PageLoading.displayName = "PageLoading";
