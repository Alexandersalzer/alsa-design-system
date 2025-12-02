// ===============================================
// blimpify-ui/design/system/components/forms/TimeInput/TimeInput.tsx
// TIME INPUT - Editable time field component
// ===============================================

import React, { forwardRef, useId, useRef } from 'react';
import { cn } from '../../../utils/cn';
import type { TimeValue } from '@react-aria/datepicker';
import { useTimeFieldState } from '@react-stately/datepicker';
import { useTimeField } from '@react-aria/datepicker';
import { useLocale } from '@react-aria/i18n';
import { useDateSegment } from '@react-aria/datepicker';
import './TimeInput.css';

// ===============================================
// TYPES
// ===============================================

export type TimeInputSize = 'sm' | 'md' | 'lg';
export type TimeInputVariant = 'flat' | 'bordered' | 'faded' | 'underlined';

export interface TimeInputProps {
  /** Label text */
  label?: string;
  /** Current value */
  value?: TimeValue | null;
  /** Default value (uncontrolled) */
  defaultValue?: TimeValue | null;
  /** Placeholder value */
  placeholderValue?: TimeValue;
  /** Size variant */
  size?: TimeInputSize;
  /** Visual variant */
  variant?: TimeInputVariant;
  /** Label placement */
  labelPlacement?: 'inside' | 'outside' | 'outside-left';
  /** Minimum time value */
  minValue?: TimeValue;
  /** Maximum time value */
  maxValue?: TimeValue;
  /** Hour cycle (12 or 24 hour) */
  hourCycle?: 12 | 24;
  /** Granularity (hour, minute, second) */
  granularity?: 'hour' | 'minute' | 'second';
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
  onChange?: (value: TimeValue) => void;
  /** Focus handler */
  onFocus?: (e: React.FocusEvent) => void;
  /** Blur handler */
  onBlur?: (e: React.FocusEvent) => void;
  /** ID for accessibility */
  id?: string;
}

// ===============================================
// TIME INPUT COMPONENT
// ===============================================

export const TimeInput = forwardRef<HTMLDivElement, TimeInputProps>(({
  label,
  value,
  defaultValue,
  placeholderValue,
  size = 'md',
  variant = 'bordered',
  labelPlacement = 'outside',
  minValue,
  maxValue,
  hourCycle,
  granularity = 'minute',
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

  const state = useTimeFieldState({
    value: value as any,
    defaultValue: defaultValue as any,
    placeholderValue: placeholderValue as any,
    minValue: minValue as any,
    maxValue: maxValue as any,
    hourCycle,
    granularity,
    hideTimeZone,
    shouldForceLeadingZeros,
    isDisabled,
    isReadOnly,
    isRequired,
    onChange: onChange as any,
    locale,
  });

  const { labelProps, fieldProps } = useTimeField(
    {
      ...props,
      value: value as any,
      defaultValue: defaultValue as any,
      minValue: minValue as any,
      maxValue: maxValue as any,
      hourCycle,
      granularity,
      hideTimeZone,
      isDisabled,
      isReadOnly,
      isRequired,
      'aria-label': label || 'Time',
      'aria-describedby': cn(descriptionId, errorId),
      autoFocus,
    },
    state,
    inputRef
  );

  // Build classes
  const baseClasses = cn(
    'time-input-wrapper',
    `time-input-wrapper--${size}`,
    `time-input-wrapper--${variant}`,
    `time-input-wrapper--label-${labelPlacement}`,
    isDisabled && 'time-input-wrapper--disabled',
    isReadOnly && 'time-input-wrapper--readonly',
    isInvalid && 'time-input-wrapper--invalid',
    classNames.base
  );

  const inputWrapperClasses = cn(
    'time-input',
    `time-input--${size}`,
    `time-input--${variant}`,
    isDisabled && 'time-input--disabled',
    isReadOnly && 'time-input--readonly',
    isInvalid && 'time-input--invalid',
    startContent ? 'time-input--with-start-content' : null,
    endContent ? 'time-input--with-end-content' : null,
    classNames.inputWrapper
  );

  return (
    <div ref={ref} className={baseClasses}>
      {/* Label */}
      {label && labelPlacement !== 'inside' && (
        <label 
          {...labelProps} 
          htmlFor={id}
          className={cn('time-input-label', `time-input-label--${size}`, classNames.label)}
        >
          {label}
          {isRequired && (
            <span className="time-input-label__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {/* Description */}
      {description && labelPlacement === 'outside' && (
        <div id={descriptionId} className={cn('time-input-description', classNames.description)}>
          {description}
        </div>
      )}

      {/* Input Wrapper */}
      <div className={inputWrapperClasses}>
        {/* Start Content */}
        {startContent && (
          <div className="time-input-start-content">
            {startContent}
          </div>
        )}

        {/* Segments Container */}
        <div 
          {...fieldProps}
          ref={inputRef}
          className={cn('time-input-inner-wrapper', classNames.innerWrapper)}
        >
          {state.segments.map((segment, i) => (
            <TimeSegment
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
          <div className="time-input-end-content">
            {endContent}
          </div>
        )}
      </div>

      {/* Helper/Error Text */}
      {(helper || errorMessage) && (
        <div className={cn('time-input-help-wrapper', classNames.helperWrapper)}>
          {errorMessage && (
            <div id={errorId} className={cn('time-input-error', classNames.errorMessage)} role="alert">
              {errorMessage}
            </div>
          )}
          {helper && !errorMessage && (
            <div className={cn('time-input-helper', classNames.description)}>
              {helper}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

TimeInput.displayName = 'TimeInput';

// ===============================================
// TIME SEGMENT
// ===============================================

interface TimeSegmentProps {
  segment: any;
  state: any;
  size: TimeInputSize;
  className?: string;
}

function TimeSegment({ segment, state, size, className }: TimeSegmentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  const segmentClasses = cn(
    'time-input-segment',
    `time-input-segment--${size}`,
    segment.isPlaceholder && 'time-input-segment--placeholder',
    !segment.isEditable && 'time-input-segment--literal',
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