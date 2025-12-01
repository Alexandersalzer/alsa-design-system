// ===============================================
// blimpify-ui/design/system/components/forms/DatePicker/DatePicker.tsx
// DATE PICKER - FIXED: Proper trigger styling and calendar navigation
// ===============================================

import React, { forwardRef, useRef } from 'react';
import { cn } from '../../../utils/cn';
import type { DateValue } from '@internationalized/date';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Icon } from '../../media';
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
    selectorButton: string;
    popoverContent: string;
    calendar: string;
  }>;
  calendarProps?: any;
  timeInputProps?: any;
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
  classNames = {},
  calendarProps,
  timeInputProps,
  onChange,
  id,
  ...props
}, ref) => {
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

  const { groupProps, labelProps, buttonProps, dialogProps } = useDatePicker(
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

  const showTimeField = granularity && ['hour', 'minute', 'second'].includes(granularity);

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
    <div ref={ref} className={cn('date-picker-wrapper', classNames.base)}>
      {/* Label */}
      {label && labelPlacement !== 'inside' && (
        <label {...labelProps} className={cn('date-picker-label', `date-picker-label--${size}`, classNames.label)}>
          {label}
          {isRequired && <span className="date-picker-label__required">*</span>}
        </label>
      )}

      {/* Description */}
      {description && labelPlacement === 'outside' && (
        <div className="date-picker-description">{description}</div>
      )}

      {/* Input Wrapper - Matches DateRangePicker structure */}
      <div {...groupProps} className={inputWrapperClasses}>
        {selectorButtonPlacement === 'start' && (
          <button
            ref={triggerRef as any}
            {...triggerButtonProps}
            className={cn('date-picker-selector-button', classNames.selectorButton)}
            disabled={isDisabled || isReadOnly}
          >
            {selectorIcon || defaultSelectorIcon}
          </button>
        )}

        <div className="date-picker-input-area">
          <DateInput
            label={labelPlacement === 'inside' ? label : undefined}
            value={state.value as any}
            onChange={(newValue) => state.setValue(newValue as any)}
            size={size}
            variant="flat"
            labelPlacement={labelPlacement}
            granularity={granularity}
            hideTimeZone={hideTimeZone}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            isRequired={isRequired}
            isInvalid={isInvalid}
            classNames={{
              base: 'date-picker-date-input',
              inputWrapper: 'date-picker-date-input-wrapper',
            }}
          />
        </div>

        {selectorButtonPlacement === 'end' && (
          <button
            ref={triggerRef as any}
            {...triggerButtonProps}
            className={cn('date-picker-selector-button', classNames.selectorButton)}
            disabled={isDisabled || isReadOnly}
          >
            {selectorIcon || defaultSelectorIcon}
          </button>
        )}
      </div>

      {/* Helper/Error */}
      {(helper || errorMessage) && (
        <div className="date-picker-help-wrapper">
          {errorMessage && <div className="date-picker-error" role="alert">{errorMessage}</div>}
          {helper && !errorMessage && <div className="date-picker-helper">{helper}</div>}
        </div>
      )}

      {/* Popover with Calendar */}
      {state.isOpen && (
        <AriaPopover
          {...dialogProps}
          state={state}
          triggerRef={triggerRef}
          maxHeight={500}
          width={calendarWidth * visibleMonths + (visibleMonths - 1) * 16 + 32}
          className={cn('date-picker-popover', 'aria-popover--no-padding', classNames.popoverContent)}
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
              className={classNames.calendar}
              {...calendarProps}
            />

            {showTimeField && (
              <div className="date-picker-time-input-wrapper">
                <TimeInput
                  value={state.timeValue as any}
                  onChange={(newValue) => state.setTimeValue(newValue as any)}
                  size={size}
                  granularity={granularity}
                  hideTimeZone={hideTimeZone}
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