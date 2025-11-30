// ===============================================
// blimpify-ui/design/system/components/forms/DateRangePicker/DateRangePicker.tsx
// DATE RANGE PICKER - Select start and end dates
// ===============================================

import React, { forwardRef, useState, useId, useRef } from 'react';
import { cn } from '../../../utils/cn';
import type { DateValue } from '@internationalized/date';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Icon } from '../../media';
import { IconButton } from '../../actions';
import { Popover } from '../../overlays';
import { useDateRangePickerState } from '@react-stately/datepicker';
import { useDateRangePicker } from '@react-aria/datepicker';
import { useDateField } from '@react-aria/datepicker';
import { useDateSegment } from '@react-aria/datepicker';
import { useLocale } from '@react-aria/i18n';
import { useDateFieldState } from '@react-stately/datepicker';
import { useRangeCalendar } from '@react-aria/calendar';
import { useRangeCalendarState } from '@react-stately/calendar';
import { createCalendar, getWeeksInMonth } from '@internationalized/date';
import './DateRangePicker.css';

// ===============================================
// TYPES
// ===============================================

export type DateRangePickerSize = 'sm' | 'md' | 'lg';
export type DateRangePickerVariant = 'flat' | 'bordered' | 'faded' | 'underlined';

export interface DateRangeValue {
  start: DateValue;
  end: DateValue;
}

export interface DateRangePickerProps {
  /** Label text */
  label?: string;
  /** Current value */
  value?: DateRangeValue | null;
  /** Default value (uncontrolled) */
  defaultValue?: DateRangeValue | null;
  /** Placeholder value */
  placeholderValue?: DateValue;
  /** Size variant */
  size?: DateRangePickerSize;
  /** Visual variant */
  variant?: DateRangePickerVariant;
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
  /** Allow non-contiguous ranges */
  allowsNonContiguousRanges?: boolean;
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
    label: string;
    inputWrapper: string;
    input: string;
    segment: string;
    separator: string;
    selectorButton: string;
    popoverContent: string;
    calendar: string;
    helperWrapper: string;
    description: string;
    errorMessage: string;
  }>;
  /** Change handler */
  onChange?: (value: DateRangeValue | null) => void;
  /** ID for accessibility */
  id?: string;
}

// ===============================================
// DATE RANGE PICKER COMPONENT
// ===============================================

export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(({
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
  visibleMonths = 2,
  showMonthAndYearPickers = false,
  firstDayOfWeek,
  selectorButtonPlacement = 'end',
  selectorIcon,
  calendarWidth = 256,
  pageBehavior = 'visible',
  allowsNonContiguousRanges = false,
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
  onChange,
  id: providedId,
  ...props
}, ref) => {
  const { locale } = useLocale();
  const generatedId = useId();
  const id = providedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = errorMessage ? `${id}-error` : undefined;
  
  const [isOpen, setIsOpen] = useState(false);
  
  const state = useDateRangePickerState({
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

  const inputRef = useRef<HTMLDivElement>(null);
  const { groupProps, labelProps, startFieldProps, endFieldProps, buttonProps, dialogProps, calendarProps } = 
    useDateRangePicker(
      {
        ...props,
        'aria-label': label || 'Date range',
        'aria-describedby': cn(descriptionId, errorId),
      },
      state,
      inputRef
    );

  // Default selector icon
  const defaultSelectorIcon = (
    <Icon size="sm" color="secondary">
      <CalendarIcon />
    </Icon>
  );

  // Build selector button
  const selectorButton = (
    <IconButton
      {...buttonProps}
      variant="ghost"
      size={size}
      aria-label="Toggle calendar"
      icon={selectorIcon || defaultSelectorIcon}
      className={cn('date-range-picker-selector-button', classNames.selectorButton)}
    />
  );

  // Build classes
  const baseClasses = cn(
    'date-range-picker-wrapper',
    `date-range-picker-wrapper--${size}`,
    `date-range-picker-wrapper--${variant}`,
    isDisabled && 'date-range-picker-wrapper--disabled',
    classNames.base
  );

  const inputWrapperClasses = cn(
    'date-range-picker',
    `date-range-picker--${size}`,
    `date-range-picker--${variant}`,
    isDisabled && 'date-range-picker--disabled',
    isReadOnly && 'date-range-picker--readonly',
    isInvalid && 'date-range-picker--invalid',
    classNames.inputWrapper
  );

  return (
    <div ref={ref} className={baseClasses}>
      {/* Label */}
      {label && labelPlacement !== 'inside' && (
        <label 
          {...labelProps}
          htmlFor={id}
          className={cn('date-range-picker-label', `date-range-picker-label--${size}`, classNames.label)}
        >
          {label}
          {isRequired && (
            <span className="date-range-picker-label__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {/* Description */}
      {description && labelPlacement === 'outside' && (
        <div id={descriptionId} className={cn('date-range-picker-description', classNames.description)}>
          {description}
        </div>
      )}

      {/* Input with Popover */}
      <Popover
        open={isOpen}
        onOpenChange={setIsOpen}
        size={size}
      >
        <Popover.Trigger asChild>
          <div {...groupProps} ref={inputRef} className={inputWrapperClasses}>
            {selectorButtonPlacement === 'start' && selectorButton}
            
            <div className={cn('date-range-picker-input', classNames.input)}>
              <DateRangeField
                {...startFieldProps}
                size={size}
                state={state}
                isStart
                classNames={classNames}
              />
              
              <span className={cn('date-range-picker-separator', classNames.separator)}>
                –
              </span>
              
              <DateRangeField
                {...endFieldProps}
                size={size}
                state={state}
                isStart={false}
                classNames={classNames}
              />
            </div>
            
            {selectorButtonPlacement === 'end' && selectorButton}
          </div>
        </Popover.Trigger>

        <Popover.Positioner>
          <Popover.Content 
            className={cn('date-range-picker-popover-content', classNames.popoverContent)}
            maxHeight={500}
            width={visibleMonths * calendarWidth + (visibleMonths - 1) * 16}
          >
            <div {...dialogProps} className="date-range-picker-calendar-wrapper">
              {CalendarTopContent}
              
              <RangeCalendar
                {...calendarProps}
                state={state}
                size={size}
                visibleMonths={visibleMonths}
                calendarWidth={calendarWidth}
                className={cn('date-range-picker-calendar', classNames.calendar)}
              />
              
              {CalendarBottomContent}
            </div>
          </Popover.Content>
        </Popover.Positioner>
      </Popover>

      {/* Helper/Error Text */}
      {(helper || errorMessage) && (
        <div className={cn('date-range-picker-help-wrapper', classNames.helperWrapper)}>
          {errorMessage && (
            <div id={errorId} className={cn('date-range-picker-error', classNames.errorMessage)} role="alert">
              {errorMessage}
            </div>
          )}
          {helper && !errorMessage && (
            <div className={cn('date-range-picker-helper', classNames.description)}>
              {helper}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

DateRangePicker.displayName = 'DateRangePicker';

// ===============================================
// DATE RANGE FIELD (Start/End Input)
// ===============================================

interface DateRangeFieldProps {
  size: DateRangePickerSize;
  state: any;
  isStart: boolean;
  classNames?: DateRangePickerProps['classNames'];
  [key: string]: any;
}

function DateRangeField({ size, state, isStart, classNames, ...props }: DateRangeFieldProps) {
  const { locale } = useLocale();
  const fieldRef = useRef<HTMLDivElement>(null);
  
  const fieldState = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  });

  const { fieldProps } = useDateField(props, fieldState, fieldRef);

  return (
    <div {...fieldProps} ref={fieldRef} className="date-range-picker-field">
      {fieldState.segments.map((segment, i) => (
        <DateRangeSegment
          key={i}
          segment={segment}
          state={fieldState}
          size={size}
          className={classNames?.segment}
        />
      ))}
    </div>
  );
}

// ===============================================
// DATE RANGE SEGMENT
// ===============================================

interface DateRangeSegmentProps {
  segment: any;
  state: any;
  size: DateRangePickerSize;
  className?: string;
}

function DateRangeSegment({ segment, state, size, className }: DateRangeSegmentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  const segmentClasses = cn(
    'date-range-picker-segment',
    `date-range-picker-segment--${size}`,
    segment.isPlaceholder && 'date-range-picker-segment--placeholder',
    !segment.isEditable && 'date-range-picker-segment--literal',
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

// ===============================================
// RANGE CALENDAR
// ===============================================

interface RangeCalendarProps {
  state: any;
  size: DateRangePickerSize;
  visibleMonths: number;
  calendarWidth: number;
  className?: string;
  [key: string]: any;
}

function RangeCalendar({ state, size, visibleMonths, calendarWidth, className, ...props }: RangeCalendarProps) {
  // This is a simplified version - you would implement full range calendar logic here
  // For now, showing basic structure
  return (
    <div className={cn('range-calendar', className)} style={{ width: visibleMonths * calendarWidth }}>
      {/* Range calendar implementation would go here */}
      {/* This would be similar to Calendar component but with range selection support */}
      <div className="range-calendar-placeholder">
        Range Calendar (to be fully implemented with range selection)
      </div>
    </div>
  );
}