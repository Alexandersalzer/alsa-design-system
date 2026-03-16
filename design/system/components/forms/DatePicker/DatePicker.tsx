// ===============================================
// blimpify-ui/design/system/components/forms/DatePicker/DatePicker.tsx
// DATE PICKER - FIXED: Proper trigger styling and calendar navigation
// ===============================================

import React, { forwardRef, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import type { DateValue } from '@internationalized/date';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Icon } from '../../media';
import { today, getLocalTimeZone, CalendarDate } from '@internationalized/date';
import { useFormCollectionContext } from '../../../core/forms';
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
  /** Field name for form collection (if not set, label is used to derive key) */
  name?: string;
  /** Name of a radio group whose values map to date offsets: 'today', 'tomorrow', 'in2days', 'in3days' */
  linkedRadioName?: string;
  /**
   * When true, disables all past dates. If lastTimeSlot is also set,
   * today is disabled once the current time is past that slot (e.g. "17:00").
   */
  disablePastDates?: boolean;
  /**
   * "HH:MM" string of the last available time slot.
   * When the current time is past this, today is also disabled.
   */
  lastTimeSlot?: string;
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
  name,
  linkedRadioName,
  disablePastDates,
  lastTimeSlot,
  ...props
}, ref) => {
  const { locale } = useLocale();
  const formCollection = useFormCollectionContext();
  const fieldKey = name ?? (label != null && String(label).trim()
    ? String(label).trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '')
    : undefined);

  const formatDateValueForForm = useCallback((v: DateValue | null): string => {
    if (!v) return '';
    const y = v.year;
    const m = String(v.month).padStart(2, '0');
    const d = String(v.day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const handleChange = useCallback((newValue: DateValue | null) => {
    if (onChange) onChange(newValue);
    if (fieldKey && formCollection) {
      formCollection.setField(undefined, fieldKey, formatDateValueForForm(newValue));
    }
  }, [onChange, fieldKey, formCollection, formatDateValueForForm]);

  // Compute effective minValue from disablePastDates + lastTimeSlot
  const effectiveMinValue = React.useMemo(() => {
    if (!disablePastDates) return minValue;
    const tz = getLocalTimeZone();
    const todayDate = today(tz);
    if (lastTimeSlot) {
      const [hours, minutes] = lastTimeSlot.split(':').map(Number);
      const now = new Date();
      const isPastLastSlot = now.getHours() > hours || (now.getHours() === hours && now.getMinutes() >= minutes);
      if (isPastLastSlot) {
        // Today is fully booked — earliest is tomorrow
        return todayDate.add({ days: 1 });
      }
    }
    return todayDate;
  }, [disablePastDates, lastTimeSlot, minValue]);

  const state = useDatePickerState({
    value: value as any,
    defaultValue: defaultValue as any,
    placeholderValue: placeholderValue as any,
    minValue: (effectiveMinValue ?? minValue) as any,
    maxValue: maxValue as any,
    granularity,
    hideTimeZone,
    isDisabled,
    isReadOnly,
    isRequired,
    onChange: handleChange as any,
  });

  const triggerRef = useRef<HTMLDivElement>(null);

  // Sync linked radio shortcuts → datePicker value (and form collection)
  useEffect(() => {
    if (!linkedRadioName) return;
    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.type !== 'radio' || target.name !== linkedRadioName) return;
      const tz = getLocalTimeZone();
      const base = today(tz);
      const offsets: Record<string, number> = { today: 0, tomorrow: 1, in2days: 2, in3days: 3 };
      const offset = offsets[target.value];
      if (offset === undefined) return;
      const date = base.add({ days: offset });
      const calendarDate = new CalendarDate(date.year, date.month, date.day);
      state.setDateValue(calendarDate);
      if (fieldKey && formCollection) {
        const str = `${calendarDate.year}-${String(calendarDate.month).padStart(2, '0')}-${String(calendarDate.day).padStart(2, '0')}`;
        formCollection.setField(undefined, fieldKey, str);
      }
    };
    document.addEventListener('change', handleChange);
    return () => document.removeEventListener('change', handleChange);
  }, [linkedRadioName, state, fieldKey, formCollection]);

  // Sync datePicker value → linked radio shortcut
  // When user picks a date directly, select the matching shortcut radio (today/tomorrow/in2days/in3days)
  // or deselect all shortcuts if the date doesn't match any offset
  const prevDateRef = useRef<string | null>(null);
  useEffect(() => {
    if (!linkedRadioName) return;
    const dateValue = state.dateValue;
    if (!dateValue) return;

    const tz = getLocalTimeZone();
    const base = today(tz);
    const offsets: Record<string, number> = { today: 0, tomorrow: 1, in2days: 2, in3days: 3 };

    // Find which shortcut value matches the selected date
    let matchingValue: string | null = null;
    for (const [key, offset] of Object.entries(offsets)) {
      const candidate = base.add({ days: offset });
      if (
        candidate.year === dateValue.year &&
        candidate.month === dateValue.month &&
        candidate.day === dateValue.day
      ) {
        matchingValue = key;
        break;
      }
    }

    const dateKey = `${dateValue.year}-${dateValue.month}-${dateValue.day}`;
    if (prevDateRef.current === dateKey) return;
    prevDateRef.current = dateKey;

    // Find all radio inputs in the linked group and update accordingly
    const radios = document.querySelectorAll<HTMLInputElement>(
      `input[type="radio"][name="${linkedRadioName}"]`
    );
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'checked'
    )?.set;

    if (matchingValue) {
      // Select the matching shortcut radio
      radios.forEach((radio) => {
        const shouldBeChecked = radio.value === matchingValue;
        if (radio.checked !== shouldBeChecked && nativeInputValueSetter) {
          nativeInputValueSetter.call(radio, shouldBeChecked);
          if (shouldBeChecked) {
            radio.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      });
    } else {
      // No shortcut matches — deselect all radios in the group and notify SelectionCard registry
      radios.forEach((radio) => {
        if (radio.checked && nativeInputValueSetter) {
          nativeInputValueSetter.call(radio, false);
        }
      });
      // Dispatch a custom event so SelectionCard registry clears the group
      document.dispatchEvent(
        new CustomEvent('radiogroup-clear', { detail: { name: linkedRadioName }, bubbles: true })
      );
    }
  }, [linkedRadioName, state.dateValue]);

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
      minValue: (effectiveMinValue ?? minValue) as any,
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
                minValue={effectiveMinValue ?? minValue}
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