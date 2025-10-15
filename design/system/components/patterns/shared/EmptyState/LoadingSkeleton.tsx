import React from "react";
import "./LoadingSkeleton.css";

/**
 * TYPES
 */
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

/**
 * Main Skeleton Component
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "20px",
  loading = true,
  variant = "pulse",
  shape = "rect",
  startColor = "var(--skeleton-start, #e5e7eb)",
  endColor = "var(--skeleton-end, #d1d5db)",
  lines,
  lineHeight = "1rem",
  lineGap = "0.5rem",
  fadeDuration = 200,
  className = "",
  style,
  children,
  ...rest
}) => {
  if (!loading) {
    return (
      <div
        className={`skeleton-content ${className}`}
        style={{
          transition: `opacity ${fadeDuration}ms ease`,
          opacity: 1,
        }}
      >
        {children}
      </div>
    );
  }

  // Text skeleton variant (multiple lines)
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
          } as React.CSSProperties & Record<string, string | number>
        }
        {...rest}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className="skeleton-line"
            style={{
              width: i === lines - 1 ? "70%" : "100%",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`skeleton ${variant} ${shape} ${className}`}
      style={
        {
          "--start-color": startColor,
          "--end-color": endColor,
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          ...style,
        } as React.CSSProperties & Record<string, string | number>
      }
      {...rest}
    />
  );
};

/**
 * Circle Skeleton
 */
export interface SkeletonCircleProps
  extends Omit<SkeletonProps, "shape" | "width" | "height"> {
  size?: string | number;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = "40px",
  ...props
}) => (
  <Skeleton
    {...props}
    shape="circle"
    width={size}
    height={size}
  />
);

/**
 * Text Skeleton
 */
export interface SkeletonTextProps
  extends Omit<SkeletonProps, "shape" | "height"> {
  noOfLines?: number;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  noOfLines = 3,
  ...props
}) => (
  <Skeleton
    {...props}
    shape="text"
    lines={noOfLines}
  />
);
