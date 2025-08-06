// ===============================================
// src/design-system/components/primitives/Input/Input.tsx
// UPDATED WITH RADIUS SIZE VARIANTS
// ===============================================

import React, { forwardRef, ReactNode, useId } from 'react';
import { cn } from '../../../lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: 'default' | 'search';
  size?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg';  // ✅ NEW: Radius size variant
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
    radius = 'md',  // ✅ NEW: Default to medium radius
    id,
    ...props
  }, ref) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;

    // Build class names with radius variant
    const inputClasses = cn(
      'input',
      `input--${size}`,
      // ✅ NEW: Radius classes
      radius === 'sm' && 'input--radius-sm',
      radius === 'lg' && 'input--radius-lg',
      // Error state
      error && 'input-error',
      // Icon classes
      leftIcon && 'input-with-left-icon',
      rightIcon && 'input-with-right-icon',
      // Variant classes
      variant === 'search' && 'search-input',
      className
    );

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
            className={inputClasses}
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
          <div className={cn('input-help', error && 'input-help-error')}>
            {error || helper}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Search Input Component - Updated with radius support
export interface SearchInputProps extends Omit<InputProps, 'variant'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, size = 'md', radius = 'md', ...props }, ref) => {
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
        radius={radius}  // ✅ NEW: Pass radius to Input
        leftIcon={searchIcon}
        rightIcon={clearIcon}
        value={value}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

/* ===== USAGE EXAMPLES =====

// ✅ Default input (medium radius - 8px)
<Input 
  label="Email" 
  placeholder="Enter your email"
/>

// ✅ Small radius input (4px) - Great for dense forms
<Input 
  label="Username" 
  radius="sm"
  placeholder="username"
/>

// ✅ Large radius input (12px) - Great for hero sections
<Input 
  label="Search" 
  radius="lg"
  size="lg"
  placeholder="Search anything..."
/>

// ✅ Search input with custom radius
<SearchInput 
  placeholder="Search products..." 
  radius="lg"
  size="md"
/>

// ✅ Inside a card - radius will automatically harmonize
<Card radius="lg">
  <CardContent>
    <Input 
      label="Name"
      radius="lg"  // Matches card's radius style
    />
  </CardContent>
</Card>

*/