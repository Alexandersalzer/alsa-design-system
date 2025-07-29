// ===============================================
// src/design-system/components/patterns/auth/AuthField.tsx
// AUTH FIELD PATTERN - Label + Input + Validation
// ===============================================

import React, { forwardRef, ReactNode, useId } from 'react';
import { cn } from '../../../../lib/utils';
import { Typography } from '../../../../components/primitives/Typography';
import { Input } from '../../../../components/primitives/Input';

// ===== TYPE DEFINITIONS =====
export interface AuthFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'size'> {
  /** Field label text */
  label: string;
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  /** Field validation state */
  state?: 'default' | 'error' | 'success';
  /** Error message to display */
  error?: string;
  /** Help text to display below the field */
  helpText?: string;
  /** Mark field as required */
  required?: boolean;
  /** Show optional indicator for non-required fields */
  showOptional?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Additional CSS classes for the input element */
  inputClassName?: string;
  /** Custom field ID (auto-generated if not provided) */
  id?: string;
}

// ===== MAIN COMPONENT =====
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(({
  label,
  type = 'text',
  state = 'default',
  error,
  helpText,
  required = false,
  showOptional = false,
  className,
  inputClassName,
  id: providedId,
  ...inputProps
}, ref) => {
  // Generate unique ID for accessibility
  const generatedId = useId();
  const fieldId = providedId || generatedId;
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;

  // Determine input state based on validation
  const inputState = state === 'error' && error ? 'error' : 
                    state === 'success' ? 'success' : 
                    'default';

  // Build accessibility attributes
  const ariaDescribedBy = [
    error ? errorId : null,
    helpText ? helpId : null
  ].filter(Boolean).join(' ') || undefined;

  const fieldClasses = cn(
    'auth-field',
    `auth-field--${state}`,
    className
  );

  const inputClasses = cn(
    'auth-field-input',
    inputClassName
  );

  return (
    <div className={fieldClasses}>
      {/* Label */}
      <label htmlFor={fieldId} className="auth-field-label">
        <Typography variant="label-md" color="label" weight="medium">
          {label}
          {required && (
            <span className="auth-field-required" aria-label="required">
              *
            </span>
          )}
          {!required && showOptional && (
            <span className="auth-field-optional">
              (optional)
            </span>
          )}
        </Typography>
      </label>

      {/* Input */}
      <Input
        ref={ref}
        id={fieldId}
        type={type}
        required={required}
        aria-invalid={state === 'error' ? 'true' : 'false'}
        aria-describedby={ariaDescribedBy}
        className={inputClasses}
        {...inputProps}
      />

      {/* Error Message */}
      {error && state === 'error' && (
        <div id={errorId} className="auth-field-error" role="alert">
          <Typography variant="body-sm" color="error">
            {error}
          </Typography>
        </div>
      )}

      {/* Help Text */}
      {helpText && (
        <div id={helpId} className="auth-field-help">
          <Typography variant="body-sm" color="tertiary">
            {helpText}
          </Typography>
        </div>
      )}
    </div>
  );
});

AuthField.displayName = 'AuthField';

// ===== SPECIALIZED FIELD COMPONENTS =====

export interface EmailFieldProps extends Omit<AuthFieldProps, 'type' | 'label'> {
  label?: string;
}

export const EmailField = forwardRef<HTMLInputElement, EmailFieldProps>(({
  label = 'Email',
  ...props
}, ref) => (
  <AuthField
    ref={ref}
    type="email"
    label={label}
    autoComplete="email"
    {...props}
  />
));

EmailField.displayName = 'EmailField';

export interface PasswordFieldProps extends Omit<AuthFieldProps, 'type' | 'label'> {
  label?: string;
  autoComplete?: 'current-password' | 'new-password';
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(({
  label = 'Password',
  autoComplete = 'current-password',
  ...props
}, ref) => (
  <AuthField
    ref={ref}
    type="password"
    label={label}
    autoComplete={autoComplete}
    {...props}
  />
));

PasswordField.displayName = 'PasswordField';

export interface UsernameFieldProps extends Omit<AuthFieldProps, 'type' | 'label'> {
  label?: string;
}

export const UsernameField = forwardRef<HTMLInputElement, UsernameFieldProps>(({
  label = 'Username',
  ...props
}, ref) => (
  <AuthField
    ref={ref}
    type="text"
    label={label}
    autoComplete="username"
    {...props}
  />
));

UsernameField.displayName = 'UsernameField';