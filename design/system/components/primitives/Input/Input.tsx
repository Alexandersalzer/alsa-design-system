// src/design-system/components/primitives/Input/Input.tsx
import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../../lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: 'default' | 'search';
  size?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    helper,
    leftIcon,
    rightIcon,
    variant = 'default',
    size = 'md',
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    // Build class names explicitly to avoid type issues
    const inputClasses = [
      'input',
      `input--${size}`,
      error ? 'input-error' : null,
      leftIcon ? 'input-with-left-icon' : null,
      rightIcon ? 'input-with-right-icon' : null,
      variant === 'search' ? 'search-input' : null,
      className
    ].filter(Boolean);
    
    return (
      <div className="input-group">
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className={cn('input-wrapper', `input-wrapper--${size}`)}>
          {/* Left Icon */}
          {leftIcon && (
            <div className={cn('input-icon input-icon-left', `input-icon--${size}`)}>
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses.join(' ')}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className={cn('input-icon input-icon-right', `input-icon--${size}`)}>
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper/Error Text */}
        {(helper || error) && (
          <div className={cn('input-help', error ? 'input-help-error' : null)}>
            {error || helper}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Search Input Component
export interface SearchInputProps extends Omit<InputProps, 'variant'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, size = 'md', ...props }, ref) => {
    const searchIcon = (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M17 17L12.3333 12.3333M13.8889 8.44444C13.8889 11.4513 11.4513 13.8889 8.44444 13.8889C5.43756 13.8889 3 11.4513 3 8.44444C3 5.43756 5.43756 3 8.44444 3C11.4513 3 13.8889 5.43756 13.8889 8.44444Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

    const clearIcon = value && onClear ? (
      <button
        type="button"
        onClick={onClear}
        className="input-clear-button"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M12 4L4 12M4 4L12 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    ) : null;

    return (
      <Input
        ref={ref}
        variant="search"
        size={size}
        leftIcon={searchIcon}
        rightIcon={clearIcon}
        value={value}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';