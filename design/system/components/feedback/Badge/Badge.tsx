// ===============================================
// src/design-system/components/feedback/Badge/Badge.tsx
// Badge component for notification indicators
// ===============================================

import React, { forwardRef } from 'react';
import './Badge.css';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'accent' | 'default';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgePlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type BadgeShape = 'circle' | 'rectangle';

export interface BadgeProps {
  /** Content to be badged (the element the badge wraps) */
  children: React.ReactNode;
  /** Badge content - can be number, string, or React node */
  content?: React.ReactNode;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Badge size */
  size?: BadgeSize;
  /** Badge placement relative to children */
  placement?: BadgePlacement;
  /** Badge shape */
  shape?: BadgeShape;
  /** Show outline/border around badge (default: true) */
  showOutline?: boolean;
  /** Hide the badge */
  isInvisible?: boolean;
  /** Show as a dot (no content) */
  isDot?: boolean;
  /** Treat single character specially for better centering */
  isOneChar?: boolean;
  /** Custom className for the wrapper */
  className?: string;
  /** Custom className for the badge itself */
  badgeClassName?: string;
  /** Accessibility label for the badge */
  'aria-label'?: string;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(({
  children,
  content,
  variant = 'default',
  size = 'md',
  placement = 'top-right',
  shape = 'rectangle',
  showOutline = true,
  isInvisible = false,
  isDot = false,
  isOneChar = false,
  className = '',
  badgeClassName = '',
  'aria-label': ariaLabel,
}, ref) => {
  // Determine if content is a single character
  const isSingleChar = isOneChar || (
    typeof content === 'string' && content.length === 1
  ) || (
    typeof content === 'number' && content < 10
  );

  // Format number content (99+ for large numbers)
  const formattedContent = typeof content === 'number' && content > 99
    ? '99+'
    : content;

  const badgeClasses = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    `badge--${placement}`,
    `badge--${shape}`,
    showOutline && 'badge--outline',
    isInvisible && 'badge--invisible',
    isDot && 'badge--dot',
    isSingleChar && 'badge--one-char',
    badgeClassName
  ].filter(Boolean).join(' ');

  const wrapperClasses = [
    'badge-wrapper',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={wrapperClasses}>
      {children}
      {!isInvisible && (
        <span
          className={badgeClasses}
          aria-label={ariaLabel}
          role={ariaLabel ? 'status' : undefined}
        >
          {!isDot && formattedContent}
        </span>
      )}
    </div>
  );
});

Badge.displayName = 'Badge';

export default Badge;
