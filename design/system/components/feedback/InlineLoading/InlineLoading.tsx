// ===============================================
// LOCATION: design/system/components/feedback/InlineLoading/InlineLoading.tsx
// InlineLoading - Inline loading spinner for buttons and sections
// ===============================================

"use client";

import React from "react";
import { Spinner, SpinnerProps } from "../Spinner/Spinner";
import { Body } from "../../Typography";
import { HStack } from "../../layout";
import { cn } from "../../../utils/cn";

export interface InlineLoadingProps {
  /** Loading message text (optional) */
  text?: string;

  /** Spinner size */
  size?: SpinnerProps["size"];

  /** Spinner variant */
  variant?: SpinnerProps["variant"];

  /** Text position relative to spinner */
  textPosition?: "right" | "left";

  /** Custom className */
  className?: string;

  /** Additional styles */
  style?: React.CSSProperties;
}

/**
 * InlineLoading - Compact loading indicator for inline use
 *
 * Features:
 * - Uses official Spinner component
 * - Optional text label
 * - Flexible sizing
 * - Perfect for buttons, cards, and sections
 *
 * @example
 * ```tsx
 * // Simple inline spinner
 * <InlineLoading size="sm" />
 *
 * // With text
 * <InlineLoading text="Loading..." size="md" />
 *
 * // In a button context
 * <Button disabled>
 *   <InlineLoading size="sm" variant="primary" />
 * </Button>
 * ```
 */
export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text,
  size = "sm",
  variant,
  textPosition = "right",
  className,
  style,
}) => {
  if (!text) {
    return (
      <Spinner
        size={size}
        variant={variant}
        className={className}
        style={style}
      />
    );
  }

  return (
    <HStack
      spacing="sm"
      align="center"
      className={cn("inline-loading", className)}
      style={style}
    >
      {textPosition === "left" && (
        <Body size="sm" color="secondary" weight="medium">
          {text}
        </Body>
      )}

      <Spinner size={size} variant={variant} />

      {textPosition === "right" && (
        <Body size="sm" color="secondary" weight="medium">
          {text}
        </Body>
      )}
    </HStack>
  );
};

InlineLoading.displayName = "InlineLoading";
