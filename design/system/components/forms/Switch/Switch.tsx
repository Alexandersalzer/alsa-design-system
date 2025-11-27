// ===============================================
// src/design-system/components/primitives/Switch/Switch.tsx
// SWITCH COMPONENT - Modern, Clean Implementation
// ===============================================

import React, { forwardRef, useId } from 'react';
import { cn } from '../../../utils/cn';

export type SwitchSize = 'sm' | 'md' | 'lg';
export type SwitchLabelPosition = 'left' | 'right';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  /** The label text for the switch */
  label?: string;
  /** Helper text displayed below the switch */
  description?: string;
  /** Error message to display */
  error?: string;
  /** Success message to display */
  success?: string;
  /** Size variant */
  size?: SwitchSize;
  /** Label position */
  labelPosition?: SwitchLabelPosition;
  /** Required field indicator */
  required?: boolean;
  /** Whether the switch is checked */
  checked?: boolean;
  /** Change handler - receives boolean value */
  onChange?: (checked: boolean) => void;
  /** Additional CSS classes for the wrapper */
  wrapperClassName?: string;
  /** Additional CSS classes for the switch */
  className?: string;
  /** ID for the switch */
  id?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  label,
  description,
  error,
  success,
  size = 'md',
  labelPosition = 'right',
  required = false,
  disabled = false,
  checked = false,
  onChange,
  className,
  wrapperClassName,
  id: providedId,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const successId = success ? `${id}-success` : undefined;

  // Handle the change event and call onChange with boolean value
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  // Build classes using your design system
  const wrapperClasses = cn(
    'switch-wrapper',
    `switch-wrapper--${size}`,
    `switch-wrapper--label-${labelPosition}`,
    disabled && 'switch-wrapper--disabled',
    error && 'switch-wrapper--error',
    success && 'switch-wrapper--success',
    wrapperClassName
  );

  const switchClasses = cn(
    'switch',
    `switch--${size}`,
    checked && 'switch--checked',
    disabled && 'switch--disabled',
    className
  );

  const labelContent = label && (
    <div className="switch-label-content">
      <label htmlFor={id} className="switch-label">
        {label}
        {required && (
          <span className="switch-label__required" aria-label="required">
            *
          </span>
        )}
      </label>
      {description && (
        <div id={descriptionId} className="switch-description">
          {description}
        </div>
      )}
    </div>
  );

  return (
    <div className={wrapperClasses}>
      {/* Label on left */}
      {labelPosition === 'left' && labelContent}

      <div className="switch-container">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          required={required}
          className="switch-input"
          aria-describedby={cn(descriptionId, errorId, successId)}
          aria-invalid={error ? 'true' : 'false'}
          onChange={handleChange}
          {...props}
        />

        <label htmlFor={id} className={switchClasses}>
          <span className="switch-track">
            <span className="switch-thumb" />
          </span>
        </label>
      </div>

      {/* Label on right */}
      {labelPosition === 'right' && labelContent}

      {error && (
        <div id={errorId} className="switch-error" role="alert">
          {error}
        </div>
      )}

      {success && !error && (
        <div id={successId} className="switch-success">
          {success}
        </div>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';

// ===============================================
// SWITCH GROUP COMPONENT
// ===============================================

export interface SwitchGroupProps {
  /** Group label */
  label?: string;
  /** Group description */
  description?: string;
  /** Error message for the group */
  error?: string;
  /** Required field indicator */
  required?: boolean;
  /** Size for all switches in group */
  size?: SwitchSize;
  /** Layout orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Array of switches */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export const SwitchGroup: React.FC<SwitchGroupProps> = ({
  label,
  description,
  error,
  required = false,
  size = 'md',
  orientation = 'vertical',
  children,
  className
}) => {
  const groupClasses = cn(
    'switch-group',
    `switch-group--${orientation}`,
    `switch-group--${size}`,
    className
  );

  return (
    <fieldset className={groupClasses}>
      {label && (
        <legend className="switch-group-legend">
          {label}
          {required && (
            <span className="switch-group-legend__required" aria-label="required">
              *
            </span>
          )}
        </legend>
      )}
      
      {description && (
        <div className="switch-group-description">
          {description}
        </div>
      )}
      
      <div className="switch-group-content">
        {children}
      </div>
      
      {error && (
        <div className="switch-group-error" role="alert">
          {error}
        </div>
      )}
    </fieldset>
  );
};