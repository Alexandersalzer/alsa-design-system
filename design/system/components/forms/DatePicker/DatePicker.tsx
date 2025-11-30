// ===============================================
// blimpify-ui/design/system/components/forms/DatePicker/DatePicker.tsx
// DATE PICKER - DateInput + Calendar popover
// ===============================================

import React, { forwardRef, useState, useId } from 'react';
import { cn } from '../../../utils/cn';
import type { DateValue } from '@internationalized/date';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Icon } from '../../media';
import { IconButton } from '../../actions';
import { Popover } from '../../overlays';
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
  /** Popover props */
  popoverProps?: any;
  /** Selector button props */
  selectorButtonProps?: any;
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
  popoverProps,
  selectorButtonProps,
  calendarProps,
  timeInputProps,
  onChange,
  onFocus,
  onBlur,
  id: providedId,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<DateValue | null>(defaultValue || null);
  
  // Use controlled value if provided, otherwise use internal state
  const currentValue = value !== undefined ? value : internalValue;
  
  const handleChange = (newValue: DateValue | null) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  // Determine if we should show time input
  const showTimeField = granularity && ['hour', 'minute', 'second'].includes(granularity);

  // Default selector icon
  const defaultSelectorIcon = (
    <Icon size="sm" color="secondary">
      <CalendarIcon />
    </Icon>
  );

  // Build selector button
  const selectorButton = (
    <IconButton
      variant="ghost"
      size={size}
      aria-label="Toggle calendar"
      icon={selectorIcon || defaultSelectorIcon}
      className={cn('date-picker-selector-button', classNames.selectorButton)}
      {...selectorButtonProps}
    />
  );

  return (
    <div ref={ref} className={cn('date-picker', `date-picker--${size}`, classNames.base)}>
      <Popover
        open={isOpen}
        onOpenChange={setIsOpen}
        size={size}
        {...popoverProps}
      >
        <Popover.Trigger asChild>
          <div>
            <DateInput
              id={id}
              label={label}
              value={currentValue}
              onChange={handleChange}
              size={size}
              variant={variant}
              labelPlacement={labelPlacement}
              minValue={minValue}
              maxValue={maxValue}
              granularity={granularity}
              hideTimeZone={hideTimeZone}
              description={description}
              errorMessage={errorMessage}
              helper={helper}
              isDisabled={isDisabled}
              isReadOnly={isReadOnly}
              isRequired={isRequired}
              isInvalid={isInvalid}
              autoFocus={autoFocus}
              onFocus={onFocus}
              onBlur={onBlur}
              startContent={selectorButtonPlacement === 'start' ? selectorButton : undefined}
              endContent={selectorButtonPlacement === 'end' ? selectorButton : undefined}
              {...props}
            />
          </div>
        </Popover.Trigger>

        <Popover.Positioner>
          <Popover.Content 
            className={cn('date-picker-popover-content', classNames.popoverContent)}
            maxHeight={500}
          >
            <div className={cn('date-picker-calendar-content', classNames.calendarContent)}>
              {CalendarTopContent}
              
              <Calendar
                value={currentValue}
                onChange={handleChange}
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
                    value={currentValue as any}
                    onChange={handleChange as any}
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
          </Popover.Content>
        </Popover.Positioner>
      </Popover>
    </div>
  );
});

DatePicker.displayName = 'DatePicker';