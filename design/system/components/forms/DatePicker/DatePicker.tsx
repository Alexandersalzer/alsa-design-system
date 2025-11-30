// ===============================================
// blimpify-ui/design/system/components/forms/DatePicker/DatePicker.tsx
// DATE PICKER - Using React Aria's useDatePicker hook
// ===============================================

import React, { forwardRef, useRef } from 'react';
import { cn } from '../../../utils/cn';
import type { DateValue } from '@internationalized/date';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Icon } from '../../media';
import { IconButton } from '../../actions';
import { useDatePickerState } from '@react-stately/datepicker';
import { useDatePicker } from '@react-aria/datepicker';
import { useButton } from '@react-aria/button';
import { AriaPopover } from '../../overlays/AriaPopover';
import { DateInput } from '../DateInput';
import { TimeInput } from '../TimeInput';
import { Calendar } from '../Calendar';
import './DatePicker.css';

// ===============================================
// TYPES
// ===============================================

export type DatePickerSize = 'sm' | 'md' | 'lg';
export type DatePickerVariant = 'flat' | 'bordered' | 'faded' | 'underlined';

export interface DatePickerProps {
  /** Label text */
  label?: string;
  /** Current value */
  value?: DateValue | null;
  /** Default value (uncontrolled) */
  defaultValue?: DateValue | null;
  /** Placeholder value */
  placeholderValue?: DateValue;
  /** Size variant */
  size?: DatePickerSize;
  /** Visual variant */
  variant?: DatePickerVariant;
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
  /** Number of visible months in calendar */
  visibleMonths?: number;
  /** Show month and year pickers */
  showMonthAndYearPickers?: boolean;
  /** First day of week */
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
  /** Selector button placement */
  selectorButtonPlacement?: 'start' | 'end';
  /** Custom selector icon */
  selectorIcon?: React.ReactNode;
  /** Calendar width */
  calendarWidth?: number;
  /** Page behavior */
  pageBehavior?: 'single' | 'visible';
  /** Function to check if a date is unavailable */
  isDateUnavailable?: (date: DateValue) => boolean;
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
  /** Calendar bottom content */
  CalendarBottomContent?: React.ReactNode;
  /** Calendar top content */
  CalendarTopContent?: React.ReactNode;
  /** Custom class names */
  classNames?: Partial<{
    base: string;
    selectorButton: string;
    selectorIcon: string;
    popoverContent: string;
    calendar: string;
    calendarContent: string;
    timeInputLabel: string;
    timeInput: string;
  }>;
  /** Calendar props */
  calendarProps?: any;
  /** Time input props */
  timeInputProps?: any;
  /** Change handler */
  onChange?: (value: DateValue | null) => void;
  /** Focus handler */
  onFocus?: (e: React.FocusEvent) => void;
  /** Blur handler */
  onBlur?: (e: React.FocusEvent) => void;
  /** ID for accessibility */
  id?: string;
}

// ===============================================
// DATE PICKER COMPONENT
// ===============================================

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(({
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
  visibleMonths = 1,
  showMonthAndYearPickers = false,
  firstDayOfWeek,
  selectorButtonPlacement = 'end',
  selectorIcon,
  calendarWidth = 256,
  pageBehavior = 'visible',
  isDateUnavailable,
  description,
  errorMessage,
  helper,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  isInvalid = false,
  autoFocus = false,
  CalendarBottomContent,
  CalendarTopContent,
  classNames = {},
  calendarProps,
  timeInputProps,
  onChange,
  onFocus,
  onBlur,
  id,
  ...props
}, ref) => {
  // Create state
  const state = useDatePickerState({
    value: value as any,
    defaultValue: defaultValue as any,
    placeholderValue: placeholderValue as any,
    minValue: minValue as any,
    maxValue: maxValue as any,
    granularity,
    hideTimeZone,
    isDisabled,
    isReadOnly,
    isRequired,
    onChange: onChange as any,
  });

  const triggerRef = useRef<Element>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Get props from React Aria
  const { groupProps, labelProps, fieldProps, buttonProps, dialogProps, calendarProps: ariaCalendarProps } = useDatePicker(
    {
      ...props,
      label,
      minValue: minValue as any,
      maxValue: maxValue as any,
      granularity,
      hideTimeZone,
      isDisabled,
      isReadOnly,
      isRequired,
      autoFocus,
      'aria-describedby': description || errorMessage ? `${id}-description` : undefined,
    },
    state,
    triggerRef
  );

  const { buttonProps: triggerButtonProps } = useButton(buttonProps, triggerRef);

  // Determine if we should show time input
  const showTimeField = granularity && ['hour', 'minute', 'second'].includes(granularity);

  // Default selector icon
  const defaultSelectorIcon = (
    <Icon size="sm" color="secondary">
      <CalendarIcon />
    </Icon>
  );

  return (
    <div ref={ref} className={cn('date-picker', `date-picker--${size}`, classNames.base)}>
      <div {...groupProps} className="date-picker-group">
        {/* Label */}
        {label && labelPlacement !== 'inside' && (
          <label {...labelProps} className={cn('date-picker-label', `date-picker-label--${size}`)}>
            {label}
            {isRequired && <span className="date-picker-label__required">*</span>}
          </label>
        )}

        {/* Description */}
        {description && labelPlacement === 'outside' && (
          <div id={`${id}-description`} className="date-picker-description">
            {description}
          </div>
        )}

        {/* Date Input Group */}
        <div className={cn('date-picker-input-group', `date-picker-input-group--${variant}`)}>
          {/* Selector Button (Start) */}
          {selectorButtonPlacement === 'start' && (
            <button
              ref={triggerRef as any}
              {...triggerButtonProps}
              className={cn('date-picker-trigger', classNames.selectorButton)}
            >
              <IconButton
                variant="ghost"
                size={size}
                aria-label="Toggle calendar"
                icon={selectorIcon || defaultSelectorIcon}
                disabled={isDisabled || isReadOnly}
              />
            </button>
          )}

          {/* Date Field */}
          <div className="date-picker-field-wrapper">
            <DateInput
              label={labelPlacement === 'inside' ? label : undefined}
              value={state.value as any}
              onChange={(newValue) => state.setValue(newValue as any)}
              size={size}
              variant={variant}
              labelPlacement={labelPlacement}
              granularity={granularity}
              hideTimeZone={hideTimeZone}
              isDisabled={isDisabled}
              isReadOnly={isReadOnly}
              isRequired={isRequired}
              isInvalid={isInvalid}
              classNames={{
                base: 'date-picker-date-input',
              }}
            />
          </div>

          {/* Selector Button (End) */}
          {selectorButtonPlacement === 'end' && (
            <button
              ref={triggerRef as any}
              {...triggerButtonProps}
              className={cn('date-picker-trigger', classNames.selectorButton)}
            >
              <IconButton
                variant="ghost"
                size={size}
                aria-label="Toggle calendar"
                icon={selectorIcon || defaultSelectorIcon}
                disabled={isDisabled || isReadOnly}
              />
            </button>
          )}
        </div>

        {/* Helper/Error Text */}
        {(helper || errorMessage) && (
          <div className="date-picker-help-wrapper">
            {errorMessage && (
              <div className="date-picker-error" role="alert">
                {errorMessage}
              </div>
            )}
            {helper && !errorMessage && (
              <div className="date-picker-helper">{helper}</div>
            )}
          </div>
        )}
      </div>

      {/* Popover with Calendar */}
      {state.isOpen && (
        <AriaPopover
          {...dialogProps}
          state={state}
          triggerRef={triggerRef}
          maxHeight={500}
          width={calendarWidth * visibleMonths + (visibleMonths - 1) * 16 + 32}
          className={cn('date-picker-popover', classNames.popoverContent)}
        >
          <div className={cn('date-picker-calendar-content', classNames.calendarContent)}>
            {CalendarTopContent}

            <Calendar
              value={state.value as any}
              onChange={(newValue) => state.setValue(newValue as any)}
              size={size}
              minValue={minValue}
              maxValue={maxValue}
              visibleMonths={visibleMonths}
              showMonthAndYearPickers={showMonthAndYearPickers && visibleMonths === 1}
              firstDayOfWeek={firstDayOfWeek}
              calendarWidth={calendarWidth}
              pageBehavior={pageBehavior}
              isDateUnavailable={isDateUnavailable}
              isDisabled={isDisabled}
              isReadOnly={isReadOnly}
              className={cn('date-picker-calendar', classNames.calendar)}
              {...calendarProps}
            />

            {showTimeField && (
              <div className={cn('date-picker-time-input-wrapper', classNames.timeInputLabel)}>
                <TimeInput
                  value={state.value as any}
                  onChange={(newValue) => state.setValue(newValue as any)}
                  size={size}
                  granularity={granularity}
                  hideTimeZone={hideTimeZone}
                  className={cn('date-picker-time-input', classNames.timeInput)}
                  {...timeInputProps}
                />
              </div>
            )}

            {CalendarBottomContent}
          </div>
        </AriaPopover>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';