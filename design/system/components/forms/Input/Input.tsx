// ===============================================
// src/design-system/components/primitives/Input/Input.tsx
// UPDATED - Added fullWidth prop support
// ===============================================

import React, { forwardRef, ReactNode, useId, useState, useRef, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../utils/cn';
import { Component } from '../../frames/component/Component';

// ===== TYPES =====
export type InputVariant = 'flat' | 'bordered' | 'faded' | 'underlined' | 'page';
export type InputColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type InputLabelPlacement = 'outside' | 'outside-left';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  error?: string;
  helper?: string;
  description?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  variant?: InputVariant;
  color?: InputColor;
  size?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg';
  labelPlacement?: InputLabelPlacement;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  showPasswordToggle?: boolean;
  isClearable?: boolean;
  isInvalid?: boolean;
  disableAnimation?: boolean;
  fullWidth?: boolean;
  onClear?: () => void;
  onValueChange?: (value: string) => void;
  componentKey?: string; // För live editing identification
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    helper,
    description,
    leftIcon,
    rightIcon,
    startContent,
    endContent,
    variant = 'flat',
    color = 'default',
    size = 'md',
    radius = 'md',
    labelPlacement = 'outside',
    type = 'text',
    showPasswordToggle = true,
    isClearable = false,
    isInvalid = false,
    disableAnimation = false,
    fullWidth = false,
    onClear,
    onValueChange,
    componentKey,
    id,
    value,
    defaultValue,
    onChange,
    ...props
  }, ref) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState((value || defaultValue || '') as string);
    const startContentRef = useRef<HTMLDivElement>(null);
    const endContentRef = useRef<HTMLDivElement>(null);
    const [startContentWidth, setStartContentWidth] = useState(0);
    const [endContentWidth, setEndContentWidth] = useState(0);

    // Sync with controlled value
    useEffect(() => {
      if (value !== undefined) {
        setInputValue(value as string);
      }
    }, [value]);

    // Measure start/end content width
    useEffect(() => {
      if (startContentRef.current) {
        setStartContentWidth(startContentRef.current.offsetWidth);
      }
      if (endContentRef.current) {
        setEndContentWidth(endContentRef.current.offsetWidth);
      }
    }, [startContent, endContent]);

    // Handle input change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInputValue(newValue);
      if (onChange) onChange(event);
      if (onValueChange) onValueChange(newValue);
    };

    // Handle clear button
    const handleClear = () => {
      setInputValue('');
      if (onClear) onClear();
      if (onValueChange) onValueChange('');
    };

    // Handle password toggle
    const isPassword = type === 'password';
    const shouldShowToggle = isPassword && showPasswordToggle;
    const actualType = isPassword && showPassword ? 'text' : type;

    // Calculate input padding dynamically
    // Add extra spacing after the divider for better visual separation
    const inputStyle: React.CSSProperties = {};
    if (startContentWidth > 0) {
      inputStyle.paddingLeft = `${startContentWidth + 8}px`;
    }
    if (endContentWidth > 0) {
      inputStyle.paddingRight = `${endContentWidth + 8}px`;
    }

    // Build class names explicitly to avoid type issues
    const inputClasses = [
      'input',
      `input--${size}`,
      `input--variant-${variant}`,
      `input--color-${color}`,
      radius === 'sm' ? 'input--radius-sm' : null,
      radius === 'lg' ? 'input--radius-lg' : null,
      error || isInvalid ? 'input-error' : null,
      leftIcon ? 'input-with-left-icon' : null,
      rightIcon ? 'input-with-right-icon' : null,
      startContent ? 'input-with-start-content' : null,
      endContent ? 'input-with-end-content' : null,
      disableAnimation ? 'input--no-animation' : null,
      fullWidth ? 'input--full-width' : null,
      className
    ].filter(Boolean);

    const wrapperClasses = cn(
      'input-group',
      `input-group--label-${labelPlacement}`,
      fullWidth ? 'input-group--full-width' : null
    );

    return (
      <Component componentKey={componentKey}>
        <div
          className={wrapperClasses}
          data-invalid={(isInvalid || !!error).toString()}
          data-required={(props.required || false).toString()}
          data-readonly={(props.readOnly || false).toString()}
          data-disabled={(props.disabled || false).toString()}
          data-focus={isFocused.toString()}
        >
          {/* Label */}
          {label && (
            <label htmlFor={inputId} className="input-label">
              {label}
              {props.required && <span className="input-label__required"> *</span>}
            </label>
          )}

        {/* Input wrapper */}
        <div className={cn('input-wrapper', `input-wrapper--${size}`)} style={{ position: 'relative' }}>

          {/* Start Content (Prefix) */}
          {startContent && (
            <div ref={startContentRef} className={cn('input-start-content', `input-start-content--${size}`)}>
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
            value={value !== undefined ? value : inputValue}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true);
              if (props.onFocus) props.onFocus(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              if (props.onBlur) props.onBlur(e);
            }}
            className={inputClasses.join(' ')}
            style={inputStyle}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && !isClearable && !shouldShowToggle && (
            <div className={cn('input-icon input-icon-right', `input-icon--${size}`)}>
              {rightIcon}
            </div>
          )}

          {/* End Content (Suffix) */}
          {endContent && !shouldShowToggle && !isClearable && (
            <div ref={endContentRef} className={cn('input-end-content', `input-end-content--${size}`)}>
              {endContent}
            </div>
          )}

          {/* Clear Button */}
          {isClearable && inputValue && !shouldShowToggle && (
            <button
              type="button"
              onClick={handleClear}
              className="input-clear-button"
              aria-label="Clear input"
              tabIndex={-1}
            >
              <XMarkIcon style={{ width: '16px', height: '16px' }} />
            </button>
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

        {/* Description/Helper Text */}
        {(description || helper) && !error && !isInvalid && (
          <div className="input-help">
            {description || helper}
          </div>
        )}

        {/* Error Text */}
        {(error || isInvalid) && (
          <div className="input-help input-help-error">
            {error}
          </div>
        )}
        </div>
      </Component>
    );
  }
);

Input.displayName = 'Input';

// Search Input Component - Updated with fullWidth and componentKey support
export interface SearchInputProps extends Omit<InputProps, 'variant'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, size = 'md', radius = 'md', fullWidth = false, componentKey, ...props }, ref) => {
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

    return (
      <Input
        ref={ref}
        type="search"
        variant="flat"
        size={size}
        radius={radius}
        leftIcon={searchIcon}
        isClearable={!!onClear}
        onClear={onClear}
        value={value}
        fullWidth={fullWidth}
        componentKey={componentKey}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';