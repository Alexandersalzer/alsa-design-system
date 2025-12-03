// File: src/design-system/components/primitives/Tag/Tag.tsx
import React, { forwardRef } from 'react';
import './Tag.css';

export type TagVariant = 'success' | 'error' | 'warning' | 'info' | 'accent' | 'default';
export type TagSize = 'small' | 'medium' | 'large';
export type TagSurface = 'subtle' | 'muted' | 'vibrant';

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onClick'> {
  children: React.ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  surface?: TagSurface;
  icon?: React.ReactNode;
  removable?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
  disabled?: boolean;
  componentKey?: string; // För live editing identification
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(({
  children,
  variant = 'default',
  size = 'medium',
  surface = 'subtle',
  icon,
  removable = false,
  interactive = false,
  onClick,
  onRemove,
  className = '',
  disabled = false,
  componentKey,
  ...props
}, ref) => {
  const baseClasses = 'tag';
  const variantClass = `tag--${variant}`;
  const sizeClass = size !== 'medium' ? `tag--${size}` : '';
  const surfaceClass = surface !== 'subtle' ? `tag--${surface}` : '';
  const iconClass = icon ? 'tag--with-icon' : '';
  const interactiveClass = (interactive || onClick) && !disabled ? 'tag--interactive' : '';
  const removableClass = removable ? 'tag--removable' : '';

  const classes = [
    baseClasses,
    variantClass,
    sizeClass,
    surfaceClass,
    iconClass,
    interactiveClass,
    removableClass,
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (onClick && !disabled && !removable) {
      onClick();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove && !disabled) {
      onRemove();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <span
      ref={ref}
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick && !disabled ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      data-component-key={componentKey}
      {...props}
    >
      {icon && (
        <span className="tag__icon">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {removable && (
        <button
          className="tag__remove"
          onClick={handleRemove}
          aria-label="Remove tag"
          type="button"
          disabled={disabled}
          tabIndex={-1}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
});

Tag.displayName = 'Tag';

export default Tag;