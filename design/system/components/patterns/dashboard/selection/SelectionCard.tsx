// ===============================================
// FIXED SelectionCard.tsx - Uses CSS classes instead of inline styles
// ===============================================

import React from 'react';
import { cn } from '../../../../lib/utils';

export interface SelectionCardProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  children,
  selected = false,
  onClick,
  disabled = false,
  size = 'md',
  badge,
  icon,
  className
}) => {
  const isClickable = !!onClick && !disabled;

  return (
    <div
      className={cn(
        'selection-card',
        isClickable && 'selection-card--clickable',
        selected && 'selection-card--selected', 
        disabled && 'selection-card--disabled',
        `selection-card--${size}`,
        className
      )}
      onClick={disabled ? undefined : onClick}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      aria-pressed={isClickable ? selected : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="selection-card__content">
        {/* Header with icon and badge */}
        {(icon || badge) && (
          <div className="selection-card__header">
            {icon && (
              <div className="selection-card__icon">
                {icon}
              </div>
            )}
            {badge && (
              <div className="selection-card__badge">
                {badge}
              </div>
            )}
          </div>
        )}

        {/* Selected indicator - checkmark */}
        {selected && (
          <div className="selection-card__indicator">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path 
                d="M10 3L4.5 8.5L2 6" 
                stroke="white" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Main content */}
        <div className="selection-card__body">
          {children}
        </div>
      </div>
    </div>
  );
};