// ===============================================
// src/design-system/components/primitives/Radio/Radio.tsx
// RADIO COMPONENT - Complete with proper design system integration
// ===============================================

import React, { forwardRef, useId, createContext, useContext, useState } from 'react';
import { cn } from '../../../utils/cn';
import { Label, Body } from '../../Typography';


export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** The label text for the radio */
  label?: string;
  /** Helper text displayed below the label */
  description?: string;
  /** Size variant */
  size?: RadioSize;
  /** Additional CSS classes for the wrapper */
  wrapperClassName?: string;
}

// Context for RadioGroup to share name and value
interface RadioGroupContextValue {
  name?: string;
  value?: string;
  size?: RadioSize;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  label,
  description,
  size: propSize = 'md',
  disabled: propDisabled = false,
  className,
  wrapperClassName,
  id: providedId,
  name: propName,
  value,
  checked: propChecked,
  onChange: propOnChange,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;

  // Get context from RadioGroup if available
  const groupContext = useContext(RadioGroupContext);
  
  // Merge props with group context
  const name = propName || groupContext?.name;
  const size = propSize || groupContext?.size || 'md';
  const disabled = propDisabled || groupContext?.disabled || false;
  const checked = propChecked ?? (groupContext != null && value != null ? groupContext.value === value : false);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Call group onChange first if available
    if (groupContext?.onChange && value) {
      groupContext.onChange(value as string);
    }
    
    // Then call individual onChange
    if (propOnChange) {
      propOnChange(event);
    }
  };

  // Build classes
  const wrapperClasses = cn(
    'radio-wrapper',
    `radio-wrapper--${size}`,
    disabled && 'radio-wrapper--disabled',
    wrapperClassName
  );

  const radioClasses = cn(
    'radio',
    `radio--${size}`,
    checked && 'radio--checked',
    disabled && 'radio--disabled',
    className
  );

  const indicatorClasses = cn(
    'radio__indicator',
    `radio__indicator--${size}`,
    checked && 'radio__indicator--checked'
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
      <div className="radio-field">
        <div className="radio-container">
          <input
            ref={ref}
            type="radio"
            id={id}
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            className={radioClasses}
            aria-describedby={descriptionId}
            onChange={handleChange}
            {...props}
          />
          
          <div className={indicatorClasses} />
        </div>

        {label && (
          <label
            htmlFor={id}
            className="radio-label"
            style={{
              fontSize: labelProps.size === 'sm' ? 'var(--foundation-text-sm)' : 'var(--foundation-text-md)',
              fontWeight: 'var(--foundation-weight-medium)',
              color: disabled ? 'var(--text-disabled)' : 'var(--text-strong)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              userSelect: 'none'
            }}
          >
            {label}
          </label>
        )}
      </div>

      {description && (
        <Body
          id={descriptionId}
          size="sm"
          color={disabled ? 'disabled' : 'secondary'}
          className="radio-description"
        >
          {description}
        </Body>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

// ===============================================
// RADIO GROUP COMPONENT
// ===============================================

export interface RadioGroupProps {
  /** Group label */
  label?: string;
  /** Group description */
  description?: string;
  /** Error message for the group */
  error?: string;
  /** Required field indicator */
  required?: boolean;
  /** Size for all radios in group */
  size?: RadioSize;
  /** Name attribute for all radios */
  name: string;
  /** Current selected value */
  value?: string;
  /** Default selected value */
  defaultValue?: string;
  /** Disabled state for all radios */
  disabled?: boolean;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Children radio buttons */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Layout direction */
  direction?: 'vertical' | 'horizontal';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  description,
  error,
  required = false,
  size = 'md',
  name,
  value: controlledValue,
  defaultValue,
  disabled = false,
  onChange,
  children,
  className,
  direction = 'vertical',
}) => {
  const groupId = useId();
  const descriptionId = description ? `${groupId}-description` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;

  // Handle controlled/uncontrolled state
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const groupClasses = cn(
    'radio-group',
    `radio-group--${size}`,
    `radio-group--${direction}`,
    disabled && 'radio-group--disabled',
    error && 'radio-group--error',
    className
  );

  const contextValue: RadioGroupContextValue = {
    name,
    value,
    size,
    disabled,
    onChange: handleChange,
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div 
        className={groupClasses} 
        role="radiogroup" 
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-describedby={cn(descriptionId, errorId)}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
      >
        {label && (
          <Label
            id={`${groupId}-label`}
            size={size === 'sm' ? 'sm' : 'md'}
            weight="semibold"
            color="primary"
            className="radio-group__label"
          >
            {label}
            {required && (
              <span className="radio-group__required" aria-label="required">
                *
              </span>
            )}
          </Label>
        )}

        {description && (
          <Body
            id={descriptionId}
            size="sm"
            color="secondary"
            className="radio-group__description"
          >
            {description}
          </Body>
        )}

        <div className="radio-group__items">
          {children}
        </div>

        {error && (
          <Body
            id={errorId}
            size="sm"
            color="error"
            className="radio-group__error"
            role="alert"
          >
            {error}
          </Body>
        )}
      </div>
    </RadioGroupContext.Provider>
  );
};