// ===============================================
// blimpify-ui/design/system/components/forms/DateInput/DateInput.tsx
// DATE INPUT - Editable date field component
// ===============================================

import React, { forwardRef, useId, useRef } from 'react';
import { cn } from '../../../utils/cn';
import type { DateValue } from '@internationalized/date';
import { createCalendar } from '@internationalized/date';
import { useDateFieldState } from '@react-stately/datepicker';
import { useDateField } from '@react-aria/datepicker';
import { useLocale } from '@react-aria/i18n';
import { useDateSegment } from '@react-aria/datepicker';
import './DateInput.css';

// ===============================================
// TYPES
// ===============================================

export type DateInputSize = 'sm' | 'md' | 'lg';
export type DateInputVariant = 'flat' | 'bordered' | 'faded' | 'underlined';

export interface DateInputProps {
  /** Label text */
  label?: string;
  /** Current value */
  value?: DateValue | null;
  /** Default value (uncontrolled) */
  defaultValue?: DateValue | null;
  /** Placeholder value */
  placeholderValue?: DateValue;
  /** Size variant */
  size?: DateInputSize;
  /** Visual variant */
  variant?: DateInputVariant;
  /** Label placement */
  labelPlacement?: 'inside' | 'outside' | 'outside-left';
  /** Minimum date value */
  minValue?: DateValue;
  /** Maximum date value */
  maxValue?: DateValue;
  /** Granularity (day, hour, minute, second) */
  granularity?: 'day' | 'hour' | 'minute' | 'second';
  /** Hide time zone */
  hideTimeZone?: boolean;
  /** Should force leading zeros */
  shouldForceLeadingZeros?: boolean;
  /** Description text */
  description?: string;
  /** Error message */
  errorMessage?: string;
  /** Helper text */
  helper?: string;
  /** Disabled state */
  isDisabled?: boolean;
  /** Read-only state */
  isReadOnly?: boolean;
  /** Required state */
  isRequired?: boolean;
  /** Invalid state */
  isInvalid?: boolean;
  /** Auto focus */
  autoFocus?: boolean;
  /** Start content */
  startContent?: React.ReactNode;
  /** End content */
  endContent?: React.ReactNode;
  /** Custom class names */
  classNames?: Partial<{
    base: string;
    label: string;
    inputWrapper: string;
    innerWrapper: string;
    segment: string;
    helperWrapper: string;
    description: string;
    errorMessage: string;
  }>;
  /** Change handler */
  onChange?: (value: DateValue) => void;
  /** Focus handler */
  onFocus?: (e: React.FocusEvent) => void;
  /** Blur handler */
  onBlur?: (e: React.FocusEvent) => void;
  /** ID for accessibility */
  id?: string;
}

// ===============================================
// DATE INPUT COMPONENT
// ===============================================

export const DateInput = forwardRef<HTMLDivElement, DateInputProps>(({
  label,
  value,
  defaultValue,
  placeholderValue,
  size = 'md',
  variant = 'bordered',
  labelPlacement = 'outside',
  minValue,
  maxValue,
  granularity,
  hideTimeZone = false,
  shouldForceLeadingZeros = true,
  description,
  errorMessage,
  helper,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  isInvalid = false,
  autoFocus = false,
  startContent,
  endContent,
  classNames = {},
  onChange,
  onFocus,
  onBlur,
  id: providedId,
  ...props
}, ref) => {
  const { locale } = useLocale();
  const generatedId = useId();
  const id = providedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = errorMessage ? `${id}-error` : undefined;

  const inputRef = useRef<HTMLDivElement>(null);

  const state = useDateFieldState({
    value: value as any,
    defaultValue: defaultValue as any,
    placeholderValue: placeholderValue as any,
    minValue: minValue as any,
    maxValue: maxValue as any,
    granularity,
    hideTimeZone,
    shouldForceLeadingZeros,
    isDisabled,
    isReadOnly,
    isRequired,
    onChange: onChange as any,
    locale,
    createCalendar,
  });

  const { labelProps, fieldProps } = useDateField(
    {
      ...props,
      granularity,
      hideTimeZone,
      isDisabled,
      isReadOnly,
      isRequired,
      'aria-label': label || 'Date',
      'aria-describedby': cn(descriptionId, errorId),
      autoFocus,
    },
    state,
    inputRef
  );

  // Build classes
  const baseClasses = cn(
    'date-input-wrapper',
    `date-input-wrapper--${size}`,
    `date-input-wrapper--${variant}`,
    `date-input-wrapper--label-${labelPlacement}`,
    isDisabled && 'date-input-wrapper--disabled',
    isReadOnly && 'date-input-wrapper--readonly',
    isInvalid && 'date-input-wrapper--invalid',
    classNames.base
  );

  const inputWrapperClasses = cn(
    'date-input',
    `date-input--${size}`,
    `date-input--${variant}`,
    isDisabled && 'date-input--disabled',
    isReadOnly && 'date-input--readonly',
    isInvalid && 'date-input--invalid',
    startContent ? 'date-input--with-start-content' : null,
    endContent ? 'date-input--with-end-content' : null,
    classNames.inputWrapper
  );

  return (
    <div ref={ref} className={baseClasses}>
      {/* Label */}
      {label && labelPlacement !== 'inside' && (
        <label 
          {...labelProps} 
          htmlFor={id}
          className={cn('date-input-label', `date-input-label--${size}`, classNames.label)}
        >
          {label}
          {isRequired && (
            <span className="date-input-label__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {/* Description */}
      {description && labelPlacement === 'outside' && (
        <div id={descriptionId} className={cn('date-input-description', classNames.description)}>
          {description}
        </div>
      )}

      {/* Input Wrapper */}
      <div className={inputWrapperClasses}>
        {/* Start Content */}
        {startContent && (
          <div className="date-input-start-content">
            {startContent}
          </div>
        )}

        {/* Segments Container */}
        <div 
          {...fieldProps}
          ref={inputRef}
          className={cn('date-input-inner-wrapper', classNames.innerWrapper)}
        >
          {state.segments.map((segment, i) => (
            <DateSegment
              key={i}
              segment={segment}
              state={state}
              size={size}
              className={classNames.segment}
            />
          ))}
        </div>

        {/* End Content */}
        {endContent && (
          <div className="date-input-end-content">
            {endContent}
          </div>
        )}
      </div>

      {/* Helper/Error Text */}
      {(helper || errorMessage) && (
        <div className={cn('date-input-help-wrapper', classNames.helperWrapper)}>
          {errorMessage && (
            <div id={errorId} className={cn('date-input-error', classNames.errorMessage)} role="alert">
              {errorMessage}
            </div>
          )}
          {helper && !errorMessage && (
            <div className={cn('date-input-helper', classNames.description)}>
              {helper}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

DateInput.displayName = 'DateInput';

// ===============================================
// DATE SEGMENT
// ===============================================

interface DateSegmentProps {
  segment: any;
  state: any;
  size: DateInputSize;
  className?: string;
}

function DateSegment({ segment, state, size, className }: DateSegmentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  const segmentClasses = cn(
    'date-input-segment',
    `date-input-segment--${size}`,
    segment.isPlaceholder && 'date-input-segment--placeholder',
    !segment.isEditable && 'date-input-segment--literal',
    className
  );

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={segmentClasses}
      style={{
        ...segmentProps.style,
        minWidth: segment.maxValue != null ? String(segment.maxValue).length + 'ch' : undefined,
      }}
    >
      {segment.text}
    </div>
  );
}