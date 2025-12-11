// ===============================================
// src/design-system/components/primitives/Input/Input.tsx
// UPDATED - Added fullWidth prop support
// ===============================================

import React, { forwardRef, ReactNode, useId, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../utils/cn';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  variant?: 'default' | 'search';
  size?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  showPasswordToggle?: boolean;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    helper,
    leftIcon,
    rightIcon,
    startContent,
    endContent,
    variant = 'default',
    size = 'md',
    radius = 'md',
    type = 'text',
    showPasswordToggle = true,
    fullWidth = false,
    id,
    ...props
  }, ref) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    const [showPassword, setShowPassword] = useState(false);

    // Handle password toggle
    const isPassword = type === 'password';
    const shouldShowToggle = isPassword && showPasswordToggle;
    const actualType = isPassword && showPassword ? 'text' : type;

    // Build class names explicitly to avoid type issues
    const inputClasses = [
      'input',
      `input--${size}`,
      radius === 'sm' ? 'input--radius-sm' : null,
      radius === 'lg' ? 'input--radius-lg' : null,
      error ? 'input-error' : null,
      leftIcon ? 'input-with-left-icon' : null,
      rightIcon ? 'input-with-right-icon' : null,
      startContent ? 'input-with-start-content' : null,
      endContent ? 'input-with-end-content' : null,
      variant === 'search' ? 'search-input' : null,
      fullWidth ? 'input--full-width' : null,
      className
    ].filter(Boolean);

    return (
      <div className={cn('input-group', fullWidth ? 'input-group--full-width' : null)}> {/* 👈 UPDATED */}
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className={cn('input-wrapper', `input-wrapper--${size}`)} style={{ position: 'relative' }}>
          {/* Start Content (Prefix) */}
          {startContent && (
            <div className={cn('input-start-content', `input-start-content--${size}`)}>
              {startContent}
            </div>
          )}

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
            type={actualType}
            className={inputClasses.join(' ')}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className={cn('input-icon input-icon-right', `input-icon--${size}`)}>
              {rightIcon}
            </div>
          )}

          {/* End Content (Suffix) */}
          {endContent && !shouldShowToggle && (
            <div className={cn('input-end-content', `input-end-content--${size}`)}>
              {endContent}
            </div>
          )}

          {/* Password Toggle */}
          {shouldShowToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn('input-password-toggle', `input-password-toggle--${size}`)}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              aria-label={showPassword ? 'Dölj lösenord' : 'Visa lösenord'}
            >
              {showPassword ? <EyeSlashIcon width={16} height={16} /> : <EyeIcon width={16} height={16} />}
            </button>
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

// Search Input Component - Updated with fullWidth support
export interface SearchInputProps extends Omit<InputProps, 'variant'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, size = 'md', radius = 'md', fullWidth = false, ...props }, ref) => {
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
        radius={radius}
        leftIcon={searchIcon}
        rightIcon={clearIcon}
        value={value}
        fullWidth={fullWidth} // 👈 PASS THROUGH
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';