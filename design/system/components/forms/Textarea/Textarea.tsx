// ===============================================
// src/design-system/components/primitives/Textarea/Textarea.tsx
// TEXTAREA COMPONENT - Complete with proper design system integration
// ===============================================

import React, { forwardRef, useId, useState } from 'react';
import { cn } from '../../../utils/cn';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';
export type TextareaVariant = 'flat' | 'bordered' | 'faded' | 'underlined';
export type TextareaColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type TextareaLabelPlacement = 'outside' | 'outside-left';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** The label text for the textarea */
  label?: string;
  /** Helper text displayed below the label */
  description?: string;
  /** Error message to display */
  error?: string;
  /** Success message to display */
  success?: string;
  /** Size variant */
  size?: TextareaSize;
  /** Required field indicator */
  required?: boolean;
  /** Resize behavior */
  resize?: TextareaResize;
  /** Show character count */
  showCharacterCount?: boolean;
  /** Maximum character limit */
  maxLength?: number;
  /** Minimum number of rows */
  minRows?: number;
  /** Maximum number of rows (for auto-resize) */
  maxRows?: number;
  /** Auto-resize textarea based on content */
  autoResize?: boolean;
  /** Additional CSS classes for the wrapper */
  wrapperClassName?: string;
  /** Additional CSS classes for the textarea */
  textareaClassName?: string;
  /** Variant style (HeroUI) */
  variant?: TextareaVariant;
  /** Color theme (HeroUI) */
  color?: TextareaColor;
  /** Label placement (HeroUI) */
  labelPlacement?: TextareaLabelPlacement;
  /** Show clear button when has value (HeroUI) */
  isClearable?: boolean;
  /** Invalid state (HeroUI) */
  isInvalid?: boolean;
  /** Disable animation (HeroUI) */
  disableAnimation?: boolean;
  /** Callback when clear button clicked (HeroUI) */
  onClear?: () => void;
  /** Full width (HeroUI) */
  fullWidth?: boolean;
  /** Callback when value changes (HeroUI) */
  onValueChange?: (value: string) => void;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  description,
  error,
  success,
  size = 'md',
  required = false,
  disabled = false,
  resize = 'vertical',
  showCharacterCount = false,
  maxLength,
  minRows = 3,
  maxRows,
  autoResize = false,
  className,
  wrapperClassName,
  textareaClassName,
  id: providedId,
  value,
  defaultValue,
  onChange,
  // HeroUI props
  variant = 'flat',
  color = 'default',
  labelPlacement = 'outside',
  isClearable = false,
  isInvalid = false,
  disableAnimation = false,
  onClear,
  fullWidth = true,
  onValueChange,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const successId = success ? `${id}-success` : undefined;

  // Character count — derived directly from value so it's always accurate
  const characterCount = value !== undefined
    ? value.toString().length
    : (defaultValue?.toString().length ?? 0);

  // Focus state for data attributes
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize functionality
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  
  React.useImperativeHandle(ref, () => textareaRef.current!);

  const adjustHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || !autoResize) return;

    // Reset height to calculate new height
    textarea.style.height = 'auto';
    
    // Calculate new height
    const newHeight = textarea.scrollHeight;
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const minHeight = lineHeight * minRows;
    const maxHeight = maxRows ? lineHeight * maxRows : Infinity;
    
    // Set constrained height
    textarea.style.height = `${Math.min(Math.max(newHeight, minHeight), maxHeight)}px`;
  }, [autoResize, minRows, maxRows]);

  // Handle input changes
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;

    // Auto-resize if enabled
    if (autoResize) {
      adjustHeight();
    }

    // Call parent onChange
    if (onChange) {
      onChange(event);
    }

    // Call HeroUI onValueChange
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  // Handle clear button
  const handleClear = () => {
    if (onClear) {
      onClear();
    }

    // If using controlled component, call onValueChange
    if (onValueChange) {
      onValueChange('');
    }
  };

  // Effect for initial auto-resize
  React.useEffect(() => {
    if (autoResize) {
      adjustHeight();
    }
  }, [adjustHeight, value, defaultValue]);

  // Listen for form reset to clear internal state
  React.useEffect(() => {
    const textarea = textareaRef.current;
    const form = textarea?.closest('form');
    
    if (!form) return;
    
    const handleReset = () => {
      if (autoResize) {
        // Small delay to let the form reset first
        setTimeout(adjustHeight, 0);
      }
    };
    
    form.addEventListener('reset', handleReset);
    return () => form.removeEventListener('reset', handleReset);
  }, [defaultValue, autoResize, adjustHeight]);

  // Build classes
  const wrapperClasses = cn(
    'textarea-wrapper',
    `textarea-wrapper--${size}`,
    `textarea-wrapper--variant-${variant}`,
    `textarea-wrapper--label-${labelPlacement}`,
    disabled && 'textarea-wrapper--disabled',
    (error || isInvalid) && 'textarea-wrapper--error',
    success && 'textarea-wrapper--success',
    !fullWidth && 'textarea-wrapper--not-full-width',
    wrapperClassName
  );

  const textareaClasses = cn(
    'textarea',
    `textarea--${size}`,
    `textarea--variant-${variant}`,
    `textarea--color-${color}`,
    `textarea--resize-${resize}`,
    (error || isInvalid) && 'textarea--error',
    success && 'textarea--success',
    disabled && 'textarea--disabled',
    autoResize && 'textarea--auto-resize',
    disableAnimation && 'textarea--no-animation',
    textareaClassName,
    className
  );

  // Character count info
  const isOverLimit = maxLength ? characterCount > maxLength : false;
  const showCount = showCharacterCount || maxLength;

  return (
    <div
      className={wrapperClasses}
      data-invalid={(isInvalid || !!error).toString()}
      data-required={required.toString()}
      data-readonly={(props.readOnly || false).toString()}
      data-disabled={disabled.toString()}
      data-focus={isFocused.toString()}
    >
      {label && (
        <label
          htmlFor={id}
          className="textarea-label"
        >
          {label}
          {required && (
            <span className="textarea-label__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {description && (
        <div
          id={descriptionId}
          className="textarea-description"
        >
          {description}
        </div>
      )}

      <div className="textarea-container">
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          rows={autoResize ? minRows : props.rows || minRows}
          className={textareaClasses}
          aria-describedby={cn(descriptionId, errorId, successId)}
          aria-invalid={(isInvalid || !!error) ? 'true' : 'false'}
          onChange={handleChange}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          style={{
            resize: autoResize ? 'none' : resize,
            minHeight: autoResize ? `${minRows * 1.5}em` : undefined,
            maxHeight: autoResize && maxRows ? `${maxRows * 1.5}em` : undefined,
            ...props.style
          }}
          {...props}
        />

        {/* Clear button */}
        {isClearable && (value || defaultValue) && (
          <button
            type="button"
            className="textarea-clear-button"
            onClick={handleClear}
            aria-label="Clear textarea"
            tabIndex={-1}
          >
            <XMarkIcon style={{ width: '16px', height: '16px' }} />
          </button>
        )}

        {showCount && (
          <div 
            className={cn(
              'textarea-count',
              isOverLimit && 'textarea-count--error'
            )}
            style={{
              fontSize: 'var(--foundation-text-xs)',
              color: isOverLimit ? 'var(--text-error)' : 'var(--text-default)',
              marginTop: 'var(--foundation-space-1)',
              textAlign: 'right'
            }}
          >
            {maxLength ? `${characterCount}/${maxLength}` : characterCount}
          </div>
        )}
      </div>

      {error && (
        <div
          id={errorId}
          className="textarea-error"
          role="alert"
          style={{
            fontSize: 'var(--foundation-text-sm)',
            color: 'var(--text-error)',
            marginTop: 'var(--space-form-error-margin)'
          }}
        >
          {error}
        </div>
      )}

      {success && !error && (
        <div
          id={successId}
          className="textarea-success"
          style={{
            fontSize: 'var(--foundation-text-sm)',
            color: 'var(--success-600)',
            marginTop: 'var(--space-form-error-margin)'
          }}
        >
          {success}
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// ===============================================
// ENHANCED TEXTAREA WITH RICH FEATURES
// ===============================================

export interface EnhancedTextareaProps extends Omit<TextareaProps, 'autoSave'> {
  /** Show formatting toolbar */
  showToolbar?: boolean;
  /** Allowed formatting options */
  allowedFormats?: ('bold' | 'italic' | 'underline' | 'link' | 'list')[];
  /** Template suggestions */
  templates?: { label: string; value: string }[];
  /** Auto-save functionality */
  autoSave?: boolean;
  /** Auto-save delay in milliseconds */
  autoSaveDelay?: number;
  /** Auto-save callback */
  onAutoSave?: (value: string) => void;
}

export const EnhancedTextarea: React.FC<EnhancedTextareaProps> = ({
  showToolbar = false,
  allowedFormats = [],
  templates = [],
  autoSave = false,
  autoSaveDelay = 1000,
  onAutoSave,
  ...textareaProps
}) => {
  const [internalValue, setInternalValue] = useState(textareaProps.value || textareaProps.defaultValue || '');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Auto-save functionality
  React.useEffect(() => {
    if (!autoSave || !onAutoSave) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      onAutoSave(internalValue.toString());
      setLastSaved(new Date());
    }, autoSaveDelay);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [internalValue, autoSave, onAutoSave, autoSaveDelay]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(event.target.value);
    if (textareaProps.onChange) {
      textareaProps.onChange(event);
    }
  };

  const insertTemplate = (template: string) => {
    setInternalValue(prev => prev + template);
  };

  return (
    <div className="enhanced-textarea">
      {templates.length > 0 && (
        <div className="textarea-templates" style={{ marginBottom: 'var(--foundation-space-2)' }}>
          <label style={{ fontSize: 'var(--foundation-text-sm)', color: 'var(--text-default)' }}>
            Quick Templates:
          </label>
          <div style={{ display: 'flex', gap: 'var(--foundation-space-2)', marginTop: 'var(--foundation-space-1)' }}>
            {templates.map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => insertTemplate(template.value)}
                style={{
                  padding: 'var(--foundation-space-1) var(--foundation-space-2)',
                  fontSize: 'var(--foundation-text-xs)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-input)',
                  color: 'var(--text-strong)',
                  cursor: 'pointer'
                }}
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <Textarea
        {...textareaProps}
        value={internalValue}
        onChange={handleChange}
      />

      {autoSave && lastSaved && (
        <div style={{ 
          fontSize: 'var(--foundation-text-xs)', 
          color: 'var(--text-default)', 
          marginTop: 'var(--foundation-space-1)',
          textAlign: 'right' 
        }}>
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};