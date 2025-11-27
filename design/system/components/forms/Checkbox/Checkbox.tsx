// ===============================================
// src/design-system/components/primitives/Checkbox/Checkbox.tsx

// ===============================================

import React, { forwardRef, useId } from 'react';
import { cn } from '../../../utils/cn';
import { CheckIcon, MinusIcon } from '@heroicons/react/24/outline';
import { Icon } from '../../media' 
export type CheckboxSize = 'sm' | 'md' | 'lg';
export type CheckboxState = 'checked' | 'unchecked' | 'indeterminate';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** The label text for the checkbox */
  label?: string;
  /** Helper text displayed below the label */
  description?: string;
  /** Error message to display */
  error?: string;
  /** Size variant */
  size?: CheckboxSize;
  /** Indeterminate state (overrides checked) */
  indeterminate?: boolean;
  /** Required field indicator */
  required?: boolean;
  /** Additional CSS classes for the wrapper */
  wrapperClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  description,
  error,
  size = 'md',
  indeterminate = false,
  required = false,
  disabled = false,
  checked,
  className,
  wrapperClassName,
  id: providedId,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  // Determine the current state
  const getState = (): CheckboxState => {
    if (indeterminate) return 'indeterminate';
    return checked ? 'checked' : 'unchecked';
  };

  const state = getState();

  // Build classes
  const wrapperClasses = cn(
    'checkbox-wrapper',
    `checkbox-wrapper--${size}`,
    disabled && 'checkbox-wrapper--disabled',
    error && 'checkbox-wrapper--error',
    wrapperClassName
  );

  const checkboxClasses = cn(
    'checkbox',
    `checkbox--${size}`,
    `checkbox--${state}`,
    disabled && 'checkbox--disabled',
    error && 'checkbox--error',
    className
  );

  const iconClasses = cn(
    'checkbox__icon',
    `checkbox__icon--${size}`,
    state !== 'unchecked' && 'checkbox__icon--visible'
  );

  // Typography props for consistent text styling
  const getLabelTypography = () => {
    const sizeMap = {
      sm: 'sm' as const,
      md: 'md' as const,
      lg: 'lg' as const,
    };

    return {
      size: sizeMap[size],
      weight: 'medium' as const,
      color: disabled ? 'disabled' as const : 'primary' as const,
    };
  };

  const labelProps = getLabelTypography();

  return (
    <div className={wrapperClasses}>
      <div className="checkbox-field">
        <div className="checkbox-container">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            checked={indeterminate ? false : checked}
            disabled={disabled}
            required={required}
            className={checkboxClasses}
            aria-describedby={cn(descriptionId, errorId)}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
          
          <div className={iconClasses}>
            {state === 'indeterminate' ? (
              <Icon color='inverse'><MinusIcon/></Icon>
            ) : state === 'checked' ? (
              <Icon color='inverse' weight='bold' size='sm'><CheckIcon/></Icon>
            ) : null}
          </div>
        </div>

        {label && (
          <label
            htmlFor={id}
            className="checkbox-label"
            style={{
              fontSize: labelProps.size === 'sm' ? 'var(--foundation-text-sm)' : 
                        labelProps.size === 'lg' ? 'var(--foundation-text-lg)' : 'var(--foundation-text-md)',
              fontWeight: 'var(--foundation-weight-medium)',
              color: labelProps.color === 'disabled' ? 'var(--text-disabled)' : 'var(--text-primary)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              userSelect: 'none',
              lineHeight: 1.4
            }}
          >
            {label}
            {required && (
              <span className="checkbox-label__required" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
      </div>

      {description && (
        <div
          id={descriptionId}
          className="checkbox-description"
          style={{
            fontSize: 'var(--foundation-text-sm)',
            color: disabled ? 'var(--text-disabled)' : 'var(--text-secondary)',
            marginTop: 'var(--space-form-hint-margin)',
            marginLeft: `calc(var(--size-checkbox-${size}) + var(--foundation-space-3))`
          }}
        >
          {description}
        </div>
      )}

      {error && (
        <div
          id={errorId}
          className="checkbox-error"
          role="alert"
          style={{
            fontSize: 'var(--foundation-text-sm)',
            color: 'var(--error-600)',
            marginTop: 'var(--space-form-error-margin)',
            marginLeft: `calc(var(--size-checkbox-${size}) + var(--foundation-space-3))`
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

// ===============================================
// CHECKBOX GROUP COMPONENT
// ===============================================

export interface CheckboxGroupProps {
  /** Group label */
  label?: string;
  /** Group description */
  description?: string;
  /** Error message for the group */
  error?: string;
  /** Required field indicator */
  required?: boolean;
  /** Size for all checkboxes in group */
  size?: CheckboxSize;
  /** Children checkboxes */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  description,
  error,
  required = false,
  size = 'md',
  children,
  className,
}) => {
  const groupId = useId();
  const descriptionId = description ? `${groupId}-description` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;

  const groupClasses = cn(
    'checkbox-group',
    `checkbox-group--${size}`,
    error && 'checkbox-group--error',
    className
  );

  return (
    <div 
      className={groupClasses} 
      role="group" 
      aria-labelledby={label ? `${groupId}-label` : undefined}
    >
      {label && (
        <label
          id={`${groupId}-label`}
          className="checkbox-group__label"
          style={{
            fontSize: size === 'sm' ? 'var(--foundation-text-sm)' : 'var(--foundation-text-md)',
            fontWeight: 'var(--foundation-weight-semibold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-form-label-margin)',
            display: 'component'
          }}
        >
          {label}
          {required && (
            <span className="checkbox-group__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {description && (
        <div
          id={descriptionId}
          className="checkbox-group__description"
          style={{
            fontSize: 'var(--foundation-text-sm)',
            color: 'var(--text-secondary)',
            marginTop: 'calc(-1 * var(--space-form-label-margin))',
            marginBottom: 'var(--space-form-hint-margin)'
          }}
        >
          {description}
        </div>
      )}

      <div 
        className="checkbox-group__items"
        aria-describedby={cn(descriptionId, errorId)}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === Checkbox) {
            return React.cloneElement(child as React.ReactElement<CheckboxProps>, {
              size: (child.props as CheckboxProps).size || size,
            });
          }
          return child;
        })}
      </div>

      {error && (
        <div
          id={errorId}
          className="checkbox-group__error"
          role="alert"
          style={{
            fontSize: 'var(--foundation-text-sm)',
            color: 'var(--error-600)',
            marginTop: 'var(--space-form-error-margin)'
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};