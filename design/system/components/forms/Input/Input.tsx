// ===============================================
// src/design-system/components/primitives/Input/Input.tsx
// UPDATED - Added fullWidth prop support
// ===============================================

import React, { forwardRef, ReactNode, useId, useState, useRef, useEffect, ReactElement, cloneElement, isValidElement } from 'react';
import { EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../utils/cn';
import { Component } from '../../frames/component/Component';
import type { ButtonProps } from '../../actions/Button/Button';
import { useFormCollectionContext } from '../../../core/forms';

// ===== KEYBOARD NAVIGATION TRACKER =====
// Tracks if user is navigating via keyboard (Tab) or mouse
// Used to show focus outline ONLY on keyboard navigation
let isKeyboardUser = false;
let keyboardTrackerInitialized = false;

if (typeof window !== 'undefined' && !keyboardTrackerInitialized) {
  keyboardTrackerInitialized = true;

  // Track Tab key for keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isKeyboardUser = true;
      document.documentElement.setAttribute('data-keyboard-user', 'true');
    }
  });

  // Reset on ANY mouse interaction - use capture phase to run BEFORE focus event
  window.addEventListener('mousedown', () => {
    isKeyboardUser = false;
    document.documentElement.setAttribute('data-keyboard-user', 'false');
  }, { capture: true }); // ← Capture phase = runs BEFORE focus event

  // Also handle touch/pointer events for mobile
  window.addEventListener('pointerdown', (e) => {
    // Only for mouse/touch, not pen (keeps keyboard behavior for pen)
    if (e.pointerType === 'mouse' || e.pointerType === 'touch') {
      isKeyboardUser = false;
      document.documentElement.setAttribute('data-keyboard-user', 'false');
    }
  }, { capture: true });
}

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
  /** Action button displayed inside the input on the right side (e.g., Search, Submit, Send) */
  actionButton?: ReactElement<ButtonProps>;
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
    actionButton,
    id,
    name,
    value,
    defaultValue,
    onChange,
    ...props
  }, ref) => {
    const generatedId = useId();
    const formCollection = useFormCollectionContext();
    const inputId = id || `input-${generatedId}`;
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState((value || defaultValue || '') as string);
    const startContentRef = useRef<HTMLDivElement>(null);
    const endContentRef = useRef<HTMLDivElement>(null);
    const actionButtonRef = useRef<HTMLDivElement>(null);
    const internalInputRef = useRef<HTMLInputElement>(null);
    const [startContentWidth, setStartContentWidth] = useState(0);
    const [endContentWidth, setEndContentWidth] = useState(0);
    const [actionButtonWidth, setActionButtonWidth] = useState(0);
    
    // Combine internal and forwarded refs
    const setRefs = (element: HTMLInputElement | null) => {
      internalInputRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    // Sync with controlled value
    useEffect(() => {
      if (value !== undefined) {
        setInputValue(value as string);
      }
    }, [value]);

    // Listen for form reset to clear internal state
    useEffect(() => {
      const inputElement = internalInputRef.current;
      const form = inputElement?.closest('form');
      
      if (!form) return;
      
      const handleReset = () => {
        setInputValue(defaultValue as string || '');
      };
      
      form.addEventListener('reset', handleReset);
      return () => form.removeEventListener('reset', handleReset);
    }, [defaultValue]);

    // Measure start/end content and action button width
    useEffect(() => {
      if (startContentRef.current) {
        setStartContentWidth(startContentRef.current.offsetWidth);
      }
      if (endContentRef.current) {
        setEndContentWidth(endContentRef.current.offsetWidth);
      }
      if (actionButtonRef.current) {
        setActionButtonWidth(actionButtonRef.current.offsetWidth);
      }
    }, [startContent, endContent, actionButton]);

    // Handle input change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInputValue(newValue);
      if (name && formCollection) formCollection.setField(undefined, name, newValue);
      if (onChange) onChange(event);
      if (onValueChange) onValueChange(newValue);
    };

    // Handle clear button
    const handleClear = () => {
      setInputValue('');
      if (name && formCollection) formCollection.setField(undefined, name, '');
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
    // Add padding for action button (takes priority over endContent)
    if (actionButtonWidth > 0) {
      inputStyle.paddingRight = `${actionButtonWidth + 8}px`;
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
      actionButton ? 'input-with-action-button' : null,
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
            ref={setRefs}
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
            name={name}
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
                color: 'var(--text-default)',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-default)';
              }}
              aria-label={showPassword ? 'Dölj lösenord' : 'Visa lösenord'}
            >
              {showPassword ? <EyeSlashIcon width={16} height={16} /> : <EyeIcon width={16} height={16} />}
            </button>
          )}

          {/* Action Button */}
          {actionButton && !shouldShowToggle && isValidElement(actionButton) && (
            <div
              ref={actionButtonRef}
              className={cn('input-action-button', `input-action-button--${size}`)}
            >
              {cloneElement(actionButton as ReactElement<ButtonProps>, {
                size: size === 'lg' ? 'md' : 'sm',
                radius: radius,
              })}
            </div>
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