// ===============================================
// blimpify-ui/design/system/components/forms/DateRangePicker/DateRangePicker.tsx
// DATE RANGE PICKER - FIXED: Uses AriaPopover, shows real calendars
// ===============================================

import React, { forwardRef, useId, useRef } from 'react';
import { cn } from '../../../utils/cn';
import type { DateValue } from '@internationalized/date';
import { today, getLocalTimeZone } from '@internationalized/date';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Icon } from '../../media';
import { AriaPopover } from '../../overlays/AriaPopover';
import { useDateRangePickerState } from '@react-stately/datepicker';
import { useDateRangePicker } from '@react-aria/datepicker';
import { useDateField, useDateSegment } from '@react-aria/datepicker';
import { useLocale } from '@react-aria/i18n';
import { useDateFieldState } from '@react-stately/datepicker';
import { useButton } from '@react-aria/button';
import { createCalendar } from '@internationalized/date';
import { Calendar } from '../Calendar';
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
  label?: string;
  value?: DateRangeValue | null;
  defaultValue?: DateRangeValue | null;
  placeholderValue?: DateValue;
  size?: DateRangePickerSize;
  variant?: DateRangePickerVariant;
  labelPlacement?: 'inside' | 'outside' | 'outside-left';
  minValue?: DateValue;
  maxValue?: DateValue;
  granularity?: 'day' | 'hour' | 'minute' | 'second';
  hideTimeZone?: boolean;
  visibleMonths?: number;
  showMonthAndYearPickers?: boolean;
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
  selectorButtonPlacement?: 'start' | 'end';
  selectorIcon?: React.ReactNode;
  calendarWidth?: number;
  pageBehavior?: 'single' | 'visible';
  allowsNonContiguousRanges?: boolean;
  isDateUnavailable?: (date: DateValue) => boolean;
  description?: string;
  errorMessage?: string;
  helper?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  autoFocus?: boolean;
  CalendarBottomContent?: React.ReactNode;
  CalendarTopContent?: React.ReactNode;
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
    description: string;
    errorMessage: string;
  }>;
  onChange?: (value: DateRangeValue | null) => void;
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

  const triggerRef = useRef<Element>(null);
  const { groupProps, labelProps, startFieldProps, endFieldProps, buttonProps, dialogProps } = 
    useDateRangePicker(
      {
        ...props,
        'aria-label': label || 'Date range',
      },
      state,
      triggerRef
    );

  const { buttonProps: triggerButtonProps } = useButton(buttonProps, triggerRef);

  const defaultSelectorIcon = (
    <Icon size="sm" color="secondary">
      <CalendarIcon />
    </Icon>
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
    <div ref={ref} className={cn('date-range-picker-wrapper', classNames.base)}>
      {/* Label */}
      {label && labelPlacement !== 'inside' && (
        <label {...labelProps} htmlFor={id} className={cn('date-range-picker-label', `date-range-picker-label--${size}`, classNames.label)}>
          {label}
          {isRequired && <span className="date-range-picker-label__required">*</span>}
        </label>
      )}

      {/* Description */}
      {description && labelPlacement === 'outside' && (
        <div className={cn('date-range-picker-description', classNames.description)}>
          {description}
        </div>
      )}

      {/* Input */}
      <div {...groupProps} className={inputWrapperClasses}>
        {selectorButtonPlacement === 'start' && (
          <button
            ref={triggerRef as any}
            {...triggerButtonProps}
            className={cn('date-range-picker-selector-button', classNames.selectorButton)}
            disabled={isDisabled || isReadOnly}
          >
            {selectorIcon || defaultSelectorIcon}
          </button>
        )}

        <div className={cn('date-range-picker-input', classNames.input)}>
          <DateRangeField
            {...startFieldProps}
            size={size}
            state={state}
            isStart
            classNames={classNames}
          />

          <span className={cn('date-range-picker-separator', classNames.separator)}>–</span>

          <DateRangeField
            {...endFieldProps}
            size={size}
            state={state}
            isStart={false}
            classNames={classNames}
          />
        </div>

        {selectorButtonPlacement === 'end' && (
          <button
            ref={triggerRef as any}
            {...triggerButtonProps}
            className={cn('date-range-picker-selector-button', classNames.selectorButton)}
            disabled={isDisabled || isReadOnly}
          >
            {selectorIcon || defaultSelectorIcon}
          </button>
        )}
      </div>

      {/* Helper/Error */}
      {(helper || errorMessage) && (
        <div className="date-range-picker-help-wrapper">
          {errorMessage && <div className="date-range-picker-error" role="alert">{errorMessage}</div>}
          {helper && !errorMessage && <div className="date-range-picker-helper">{helper}</div>}
        </div>
      )}

      {/* Popover with Calendars */}
      {state.isOpen && (
        <AriaPopover
          {...dialogProps}
          state={state}
          triggerRef={triggerRef}
          maxHeight={500}
          width={visibleMonths * calendarWidth + (visibleMonths - 1) * 16 + 32}
          className="date-range-picker-popover"
        >
          <div className="date-range-picker-calendar-content">
            {CalendarTopContent}

            {/* Show multiple calendars side by side for range selection */}
            <div className="date-range-picker-calendars">
              {[...Array(visibleMonths)].map((_, index) => {
                // Calculate the month offset for this calendar
                // Each calendar shows a different month starting from the current focus
                const baseDate = state.value?.start || state.dateRange?.start || placeholderValue;
                
                // Create a calendar that shows the appropriate month
                // For multiple months, each subsequent calendar is offset by 1 month
                return (
                  <DateRangeCalendar
                    key={index}
                    state={state}
                    size={size}
                    minValue={minValue}
                    maxValue={maxValue}
                    isDateUnavailable={isDateUnavailable}
                    isDisabled={isDisabled}
                    isReadOnly={isReadOnly}
                    monthOffset={index}
                    baseDate={baseDate}
                    showMonthAndYearPickers={showMonthAndYearPickers}
                    firstDayOfWeek={firstDayOfWeek}
                    calendarWidth={calendarWidth}
                  />
                );
              })}
            </div>

            {CalendarBottomContent}
          </div>
        </AriaPopover>
      )}
    </div>
  );
});

DateRangePicker.displayName = 'DateRangePicker';

// ===============================================
// DATE RANGE CALENDAR (Internal component for rendering offset months)
// ===============================================

interface DateRangeCalendarProps {
  state: any;
  size: DateRangePickerSize;
  minValue?: DateValue;
  maxValue?: DateValue;
  isDateUnavailable?: (date: DateValue) => boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  monthOffset: number;
  baseDate?: DateValue;
  showMonthAndYearPickers?: boolean;
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
  calendarWidth?: number;
}

function DateRangeCalendar({
  state,
  size,
  minValue,
  maxValue,
  isDateUnavailable,
  isDisabled,
  isReadOnly,
  monthOffset,
  baseDate,
  showMonthAndYearPickers,
  firstDayOfWeek,
  calendarWidth,
}: DateRangeCalendarProps) {
  const { locale } = useLocale();
  
  // Calculate which month this calendar should display
  const displayDate = React.useMemo(() => {
    if (!baseDate) {
      // Use today's date as fallback
      const todayDate = today(getLocalTimeZone());
      return todayDate.add({ months: monthOffset });
    }
    
    // Offset the base date by the specified number of months
    return baseDate.add({ months: monthOffset });
  }, [baseDate, monthOffset]);

  return (
    <Calendar
      value={state.value?.start as any}
      onChange={(newValue) => {
        const currentRange = state.value;
        
        if (!currentRange || !currentRange.start || currentRange.end) {
          // No range selected or complete range selected -> start new range
          state.setValue({ start: newValue, end: newValue } as any);
        } else {
          // Start date exists but no end -> complete the range
          const startDate = currentRange.start;
          
          if (newValue.compare(startDate) < 0) {
            // New date is before start -> make it the new start
            state.setValue({ start: newValue, end: startDate } as any);
          } else {
            // New date is after start -> make it the end
            state.setValue({ start: startDate, end: newValue } as any);
          }
          
          state.setOpen(false);
        }
      }}
      size={size}
      minValue={minValue}
      maxValue={maxValue}
      visibleMonths={1}
      showMonthAndYearPickers={showMonthAndYearPickers && monthOffset === 0}
      firstDayOfWeek={firstDayOfWeek}
      calendarWidth={calendarWidth}
      pageBehavior="single"
      isDateUnavailable={isDateUnavailable}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      defaultFocusedValue={displayDate as any}
    />
  );
}

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