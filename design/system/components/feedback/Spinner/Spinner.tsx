// ===============================================
// LOCATION: design/system/components/layout/utilities/spinner/Spinner.tsx
// Spinner - Visual loading indicator component
// ===============================================

import React, { forwardRef } from "react";
import { cn } from "../../../utils/cn";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spinner size */
  size?: "inherit" | "xs" | "sm" | "md" | "lg" | "xl";

  /** Custom color override (optional) */
  color?: string;

  /** Track color override (optional) */
  trackColor?: string;

  /** Variant context — matches button variant */
  variant?: "brand" | "primary" | "secondary" | "accent" | "ghost" | "destructive";

  /** Disabled state (used to pick softer contrasts) */
  disabled?: boolean;

  /** Border thickness */
  thickness?: string | number;

  /** Spin speed (e.g. "0.45s", "1s") */
  animationDuration?: string;

  /** Optional accessibility label */
  label?: string;
}

/**
 * Spinner automatically adapts to semantic theme context.
 * - If used in a button, pass `variant` + `disabled`.
 * - Otherwise, uses default accent + subtle track.
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = "md",
      color,
      trackColor,
      variant,
      disabled,
      thickness,
      animationDuration = "0.45s",
      label,
      className,
      style,
      ...props
    },
    ref
  ) => {
    // ===== 1. Determine contextual colors =====
    let spinnerColor = color;
    let spinnerTrack = trackColor;

    if (!spinnerColor || !spinnerTrack) {
      switch (variant) {
        case "primary":
          spinnerTrack =
            trackColor ||
            (disabled
              ? "var(--surface-button-primary-disabled)"
              : "var(--surface-button-primary)");
          spinnerColor =
            color ||
            (disabled
              ? "var(--text-button-primary-disabled)"
              : "var(--text-button-primary)");
          break;

        case "secondary":
          spinnerTrack =
            trackColor ||
            (disabled
              ? "var(--surface-button-secondary-disabled)"
              : "var(--surface-button-secondary)");
          spinnerColor =
            color ||
            (disabled
              ? "var(--text-button-secondary-disabled)"
              : "var(--text-button-secondary)");
          break;

        case "accent":
          spinnerTrack =
            trackColor ||
            (disabled
              ? "var(--surface-button-accent-disabled)"
              : "var(--surface-button-accent)");
          spinnerColor =
            color ||
            (disabled
              ? "var(--text-button-accent-disabled)"
              : "var(--text-button-accent)");
          break;

        case "destructive":
          spinnerTrack =
            trackColor ||
            (disabled
              ? "var(--surface-button-destructive-disabled)"
              : "var(--surface-button-destructive)");
          spinnerColor =
            color ||
            (disabled
              ? "var(--text-button-destructive-disabled)"
              : "var(--text-button-destructive)");
          break;

        case "ghost":
          spinnerTrack =
            trackColor ||
            "color-mix(in srgb, var(--text-button-ghost) 8%, transparent)";
          spinnerColor = color || "var(--text-button-ghost)";
          break;

        default:
          // Neutral standalone spinner
          spinnerTrack = trackColor || "var(--border-subtle)";
          spinnerColor = color || "var(--icon-accent)";
          break;
      }
    }

    // ===== 2. Apply styles =====
    const spinnerStyle: React.CSSProperties = {
      "--spinner-color": spinnerColor,
      "--spinner-track-color": spinnerTrack,
      "--spinner-duration": animationDuration,
      borderWidth: thickness,
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label || "Loading"}
        className={cn("spinner", `spinner--${size}`, className)}
        style={spinnerStyle}
        {...props}
      >
        {label && <span className="spinner__label">{label}</span>}
      </div>
    );
  }
);

Spinner.displayName = "Spinner";
