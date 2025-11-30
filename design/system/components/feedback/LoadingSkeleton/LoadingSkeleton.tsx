// ===============================================
// design/system/components/primitives/LoadingSkeleton/LoadingSkeleton.tsx
// SKELETON COMPONENTS - Pulse, Shine, and Text variants for content placeholders
// ===============================================

import React from "react";

export type SkeletonVariant = "pulse" | "shine" | "none";
export type SkeletonShape = "rect" | "circle" | "text";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  loading?: boolean;
  variant?: SkeletonVariant;
  shape?: SkeletonShape;
  startColor?: string;
  endColor?: string;
  lines?: number;
  lineHeight?: string;
  lineGap?: string;
  fadeDuration?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "20px",
  loading = true,
  variant = "pulse",
  shape = "rect",
  startColor = "var(--surface-skeleton-start)",
  endColor = "var(--surface-skeleton-end)",
  lines,
  lineHeight = "1rem",
  lineGap = "0.5rem",
  fadeDuration = 400,
  className = "",
  style,
  children,
  ...rest
}) => {
  if (!loading) {
    return (
      <div
        className={`skeleton-content ${className}`}
        style={{ transition: `opacity ${fadeDuration}ms ease`, opacity: 1 }}
      >
        {children}
      </div>
    );
  }

  if (shape === "text" && lines) {
    return (
      <div
        className={`skeleton-text ${variant} ${className}`}
        style={
          {
            "--start-color": startColor,
            "--end-color": endColor,
            "--line-height": lineHeight,
            "--line-gap": lineGap,
          } as React.CSSProperties
        }
        aria-busy={loading}
        aria-live="polite"
        {...rest}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className="skeleton-line"
            style={{ width: i === lines - 1 ? "70%" : "100%" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`skeleton ${variant} ${shape} ${className}`}
      aria-busy={loading}
      aria-live="polite"
      style={
        {
          "--start-color": startColor,
          "--end-color": endColor,
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    />
  );
};

export interface SkeletonCircleProps extends Omit<SkeletonProps, "shape" | "width" | "height"> {
  size?: string | number;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({ size = "40px", ...props }) => (
  <Skeleton {...props} shape="circle" width={size} height={size} />
);

export interface SkeletonTextProps extends Omit<SkeletonProps, "shape" | "height"> {
  noOfLines?: number;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ noOfLines = 3, ...props }) => (
  <Skeleton {...props} shape="text" lines={noOfLines} />
);
