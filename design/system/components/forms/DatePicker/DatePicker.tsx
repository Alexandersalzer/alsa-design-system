// ===============================================
// blimpify-ui/design/system/components/forms/DatePicker/DatePicker.tsx
// DATE PICKER - FIXED: Proper trigger styling and calendar navigation
// ===============================================

import React, { forwardRef, useRef, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import type { DateValue } from '@internationalized/date';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Icon } from '../../media';
import { today, getLocalTimeZone, CalendarDate } from '@internationalized/date';
import { useDatePickerState, useDateFieldState, useTimeFieldState } from '@react-stately/datepicker';
import { useDatePicker, useDateField, useDateSegment, useTimeField } from '@react-aria/datepicker';
import { useButton } from '@react-aria/button';
import { useLocale } from '@react-aria/i18n';
import { createCalendar } from '@internationalized/date';
import { Popover } from '../../overlays';
import { Calendar } from '../Calendar';
import './DatePicker.css';

// ===============================================
// TYPES
// ===============================================

export type DatePickerSize = 'sm' | 'md' | 'lg';
export type DatePickerVariant = 'flat' | 'bordered' | 'faded' | 'underlined';

export interface DatePickerProps {
  label?: string;
  value?: DateValue | null;
  defaultValue?: DateValue | null;
  placeholderValue?: DateValue;
  size?: DatePickerSize;
  variant?: DatePickerVariant;
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
    selectorButton: string;
    popoverContent: string;
    calendar: string;
    description: string;
    errorMessage: string;
  }>;
  calendarProps?: any;
  fullWidth?: boolean;
  onChange?: (value: DateValue | null) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
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
  fullWidth = false,
  classNames = {},
  calendarProps,
  onChange,
  id,
  ...props
}, ref) => {
  const { locale } = useLocale();

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

  const triggerRef = useRef<HTMLDivElement>(null);

  const { groupProps, labelProps, fieldProps, buttonProps, dialogProps } = useDatePicker(
    {
      ...props,
      label,
      granularity,
      hideTimeZone,
      isDisabled,
      isReadOnly,
      isRequired,
      autoFocus,
    },
    state,
    triggerRef
  );

  const { buttonProps: triggerButtonProps } = useButton(buttonProps, triggerRef as any);

  const defaultSelectorIcon = (
    <Icon size="sm" color="secondary">
      <CalendarIcon />
    </Icon>
  );

  const inputWrapperClasses = cn(
    'date-picker',
    `date-picker--${size}`,
    `date-picker--${variant}`,
    state.isOpen && 'date-picker--open',
    isDisabled && 'date-picker--disabled',
    isReadOnly && 'date-picker--readonly',
    isInvalid && 'date-picker--invalid',
    classNames.inputWrapper
  );

  return (
    <div ref={ref} className={cn('date-picker-wrapper', fullWidth && 'date-picker-wrapper--full-width', classNames.base)}>
      {/* Label */}
      {label && labelPlacement !== 'inside' && (
        <label {...labelProps} className={cn('date-picker-label', `date-picker-label--${size}`, classNames.label)}>
          {label}
          {isRequired && <span className="date-picker-label__required">*</span>}
        </label>
      )}

      {/* Description */}
      {description && labelPlacement === 'outside' && (
        <div className={cn('date-picker-description', classNames.description)}>
          {description}
        </div>
      )}

      {/* Input Wrapper - Matches DateRangePicker structure */}
      <Popover
        open={state.isOpen}
        onOpenChange={state.setOpen}
        size="md"
        closeOnInteractOutside={true}
        closeOnEscape={true}
      >
        <div {...groupProps} className={inputWrapperClasses}>
          {selectorButtonPlacement === 'start' && (
            <Popover.Trigger asChild>
              <button
                ref={triggerRef as any}
                {...triggerButtonProps}
                className={cn('date-picker-selector-button', classNames.selectorButton)}
                disabled={isDisabled || isReadOnly}
              >
                {selectorIcon || defaultSelectorIcon}
              </button>
            </Popover.Trigger>
          )}

          <div className={cn('date-picker-input', classNames.input)}>
            <DatePickerField
              {...fieldProps}
              size={size}
              state={state}
              classNames={classNames}
            />
          </div>

          {selectorButtonPlacement === 'end' && (
            <Popover.Trigger asChild>
              <button
                ref={triggerRef as any}
                {...triggerButtonProps}
                className={cn('date-picker-selector-button', classNames.selectorButton)}
                disabled={isDisabled || isReadOnly}
              >
                {selectorIcon || defaultSelectorIcon}
              </button>
            </Popover.Trigger>
          )}
        </div>

        <Popover.Positioner>
          <Popover.Content
            maxHeight={500}
            width={calendarWidth * visibleMonths + (visibleMonths - 1) * 16 + 32}
            className={cn('date-picker-popover', classNames.popoverContent)}
          >
            <div className="date-picker-calendar-content">
              {CalendarTopContent}

              <Calendar
                value={state.value as any}
                onChange={(newValue) => state.setValue(newValue as any)}
                focusedValue={state.dateValue as any}
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
                classNames={{ base: classNames.calendar }}
                {...calendarProps}
              />

              {/* Time field — shown when granularity includes time */}
              {granularity && granularity !== 'day' && (
                <div className="date-picker-time-wrapper">
                  <DatePickerTimeField
                    value={state.timeValue as any}
                    onChange={(t) => state.setTimeValue(t as any)}
                    granularity={granularity}
                    hideTimeZone={hideTimeZone}
                    isDisabled={isDisabled}
                    isReadOnly={isReadOnly}
                    size={size}
                    classNames={classNames}
                  />
                </div>
              )}

              {CalendarBottomContent}
            </div>
          </Popover.Content>
        </Popover.Positioner>
      </Popover>

      {/* Helper/Error */}
      {(helper || errorMessage) && (
        <div className="date-picker-help-wrapper">
          {errorMessage && <div className="date-picker-error" role="alert">{errorMessage}</div>}
          {helper && !errorMessage && <div className="date-picker-helper">{helper}</div>}
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

// ===============================================
// DATE PICKER TIME FIELD (inline time in popover)
// ===============================================

interface DatePickerTimeFieldProps {
  value?: any;
  onChange?: (value: any) => void;
  granularity?: 'hour' | 'minute' | 'second';
  hideTimeZone?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  size: DatePickerSize;
  classNames?: DatePickerProps['classNames'];
}

function DatePickerTimeField({ value, onChange, granularity = 'minute', hideTimeZone, isDisabled, isReadOnly, size, classNames }: DatePickerTimeFieldProps) {
  const { locale } = useLocale();
  const fieldRef = useRef<HTMLDivElement>(null);

  const timeState = useTimeFieldState({
    value,
    onChange,
    granularity,
    hideTimeZone,
    isDisabled,
    isReadOnly,
    locale,
  });

  const { labelProps, fieldProps } = useTimeField(
    { granularity, hideTimeZone, isDisabled, isReadOnly, 'aria-label': 'Time' },
    timeState,
    fieldRef
  );

  return (
    <div className="date-picker-time-field">
      <span className="date-picker-time-label">Time</span>
      <div {...fieldProps} ref={fieldRef} className={`date-picker-time-input date-picker-time-input--${size}`}>
        {timeState.segments.map((segment, i) => (
          <DatePickerSegment
            key={i}
            segment={segment}
            state={timeState}
            size={size}
            className={classNames?.segment}
          />
        ))}
      </div>
    </div>
  );
}

// ===============================================
// DATE PICKER FIELD (Single Date Input)
// ===============================================

interface DatePickerFieldProps {
  size: DatePickerSize;
  state: any;
  classNames?: DatePickerProps['classNames'];
  [key: string]: any;
}

function DatePickerField({ size, state, classNames, ...props }: DatePickerFieldProps) {
  const { locale } = useLocale();
  const fieldRef = useRef<HTMLDivElement>(null);

  const fieldState = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  });

  const { fieldProps } = useDateField(props, fieldState, fieldRef);

  return (
    <div {...fieldProps} ref={fieldRef} className="date-picker-field">
      {fieldState.segments.map((segment, i) => (
        <DatePickerSegment
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
// DATE PICKER SEGMENT
// ===============================================

interface DatePickerSegmentProps {
  segment: any;
  state: any;
  size: DatePickerSize;
  className?: string;
}

function DatePickerSegment({ segment, state, size, className }: DatePickerSegmentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  const segmentClasses = cn(
    'date-picker-segment',
    `date-picker-segment--${size}`,
    segment.isPlaceholder && 'date-picker-segment--placeholder',
    !segment.isEditable && 'date-picker-segment--literal',
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