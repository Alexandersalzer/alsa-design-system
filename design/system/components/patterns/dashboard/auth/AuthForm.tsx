// ===============================================
// src/design-system/components/patterns/auth/AuthForm.tsx
// AUTH FORM PATTERN - Updated to use Toast component
// ===============================================

import React, { forwardRef, ReactNode, FormEvent } from 'react';
import { cn } from '@/design/system/lib/utils';
import { ErrorToast, SuccessToast } from '@/design/system/components/primitives/Toast';
import { Button } from '@/design/system/components/primitives/Button';

// ===== TYPE DEFINITIONS =====
export interface AuthFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Form content (fields, buttons, etc.) */
  children: ReactNode;
  /** Handle form submission */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  /** Loading state during form submission */
  loading?: boolean;
  /** Global form error message */
  error?: string | null;
  /** Success message */
  success?: string | null;
  /** Disable the entire form */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ===== MAIN COMPONENT =====
export const AuthForm = forwardRef<HTMLFormElement, AuthFormProps>(({
  children,
  onSubmit,
  loading = false,
  error,
  success,
  disabled = false,
  className,
  ...props
}, ref) => {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (loading || disabled) return;
    
    if (onSubmit) {
      await onSubmit(event);
    }
  };

  const formClasses = cn(
    'auth-form',
    loading && 'auth-form--loading',
    disabled && 'auth-form--disabled',
    className
  );

  return (
    <form
      ref={ref}
      className={formClasses}
      onSubmit={handleSubmit}
      noValidate
      {...props}
    >
      {/* Error Toast */}
      {error && (
        <ErrorToast className="auth-form-toast">
          {error}
        </ErrorToast>
      )}

      {/* Success Toast */}
      {success && (
        <SuccessToast className="auth-form-toast">
          {success}
        </SuccessToast>
      )}

      {/* Form Content */}
      <div className="auth-form-content">
        {children}
      </div>
    </form>
  );
});

AuthForm.displayName = 'AuthForm';

// ===== SUB-COMPONENTS =====

export interface AuthFormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const AuthFormActions = forwardRef<HTMLDivElement, AuthFormActionsProps>(({
  children,
  className,
  ...props
}, ref) => (
  <div ref={ref} className={cn('auth-form-actions', className)} {...props}>
    {children}
  </div>
));

AuthFormActions.displayName = 'AuthFormActions';

export interface AuthFormFieldsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const AuthFormFields = forwardRef<HTMLDivElement, AuthFormFieldsProps>(({
  children,
  className,
  ...props
}, ref) => (
  <div ref={ref} className={cn('auth-form-fields', className)} {...props}>
    {children}
  </div>
));

AuthFormFields.displayName = 'AuthFormFields';

export interface AuthFormFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const AuthFormFooter = forwardRef<HTMLDivElement, AuthFormFooterProps>(({
  children,
  className,
  ...props
}, ref) => (
  <div ref={ref} className={cn('auth-form-footer', className)} {...props}>
    {children}
  </div>
));

AuthFormFooter.displayName = 'AuthFormFooter';

// ===== HELPER COMPONENTS =====

export interface AuthSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  className?: string;
}

export const AuthSubmitButton = forwardRef<HTMLButtonElement, AuthSubmitButtonProps>(({
  children,
  loading = false,
  loadingText = 'Loading...',
  disabled,
  className,
  ...props
}, ref) => (
  <Button
    ref={ref}
    type="submit"
    variant="primary"
    className={cn('auth-submit-button', className)}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? loadingText : children}
  </Button>
));

AuthSubmitButton.displayName = 'AuthSubmitButton';