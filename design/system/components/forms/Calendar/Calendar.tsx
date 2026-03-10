// ===============================================
// blimpify-ui/design/system/components/forms/Calendar/Calendar.tsx
// CALENDAR - With month/year picker panel
// ===============================================

import React, { forwardRef, useId, useState, useRef, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { Icon } from '../../media';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type {
  CalendarDate,
  DateValue,
  DateDuration
} from '@internationalized/date';
import {
  createCalendar,
  getWeeksInMonth,
  isSameMonth,
  isToday as checkIsToday,
  toCalendarDate,
} from '@internationalized/date';
import { useCalendarState } from '@react-stately/calendar';
import { useCalendar, useCalendarGrid, useCalendarCell } from '@react-aria/calendar';
import { useLocale } from '@react-aria/i18n';
import { useButton } from '@react-aria/button';
import './Calendar.css';

// ===============================================
// TYPES
// ===============================================

export type CalendarSize = 'sm' | 'md' | 'lg';

export interface CalendarProps {
  value?: DateValue | null;
  defaultValue?: DateValue | null;
  focusedValue?: DateValue;
  defaultFocusedValue?: DateValue;
  size?: CalendarSize;
  minValue?: DateValue;
  maxValue?: DateValue;
  visibleMonths?: number;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isDateUnavailable?: (date: DateValue) => boolean;
  showMonthAndYearPickers?: boolean;
  pageBehavior?: 'single' | 'visible';
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
  autoFocus?: boolean;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  calendarWidth?: number;
  classNames?: Partial<{
    base: string;
    header: string;
    title: string;
    gridWrapper: string;
    grid: string;
    gridHeader: string;
    gridHeaderCell: string;
    gridBody: string;
    cell: string;
    cellButton: string;
  }>;
  onChange?: (value: DateValue) => void;
  onFocusChange?: (date: DateValue) => void;
  id?: string;
  // Range picker props
  isRangePicker?: boolean;
  rangeValue?: { start: DateValue | null; end: DateValue | null } | null;
}

// ===============================================
// MONTH NAMES
// ===============================================

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// ===============================================
// CALENDAR COMPONENT
// ===============================================

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(({
  value,
  defaultValue,
  focusedValue,
  defaultFocusedValue,
  size = 'md',
  minValue,
  maxValue,
  visibleMonths = 1,
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  isDateUnavailable,
  showMonthAndYearPickers = false,
  pageBehavior = 'visible',
  firstDayOfWeek,
  autoFocus = false,
  topContent,
  bottomContent,
  calendarWidth = 256,
  classNames = {},
  onChange,
  onFocusChange,
  id: providedId,
  isRangePicker = false,
  rangeValue = null,
  ...props
}, ref) => {
  const { locale } = useLocale();
  const generatedId = useId();
  const id = providedId || generatedId;

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Strip time component — useCalendarState only accepts CalendarDate, not ZonedDateTime/DateTime
  const safeValue = value ? toCalendarDate(value as any) : value;
  const safeDefaultValue = defaultValue ? toCalendarDate(defaultValue as any) : defaultValue;
  // Use focusedValue as defaultFocusedValue (uncontrolled) so Calendar can navigate freely.
  // If we pass focusedValue as a controlled prop, DatePicker re-renders reset the visible month.
  const initialFocusedValue = (focusedValue || defaultFocusedValue)
    ? toCalendarDate((focusedValue || defaultFocusedValue) as any)
    : undefined;

  const state = useCalendarState({
    value: safeValue as any,
    defaultValue: safeDefaultValue as any,
    defaultFocusedValue: initialFocusedValue as any,
    minValue: minValue as any,
    maxValue: maxValue as any,
    isDisabled,
    isReadOnly,
    onChange: onChange as any,
    onFocusChange: onFocusChange as any,
    locale,
    createCalendar,
    visibleDuration: { months: visibleMonths } as DateDuration,
    pageBehavior: pageBehavior as any,
    autoFocus,
    isDateUnavailable: isDateUnavailable as any,
  });

  const calendarRef = React.useRef<HTMLDivElement>(null);
  const prevButtonRef = React.useRef<HTMLButtonElement>(null);
  const nextButtonRef = React.useRef<HTMLButtonElement>(null);

  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    {
      ...props,
      value: safeValue as any,
      defaultValue: safeDefaultValue as any,
      minValue: minValue as any,
      maxValue: maxValue as any,
      isDisabled,
      isReadOnly,
    },
    state
  );

  const { buttonProps: prevProps } = useButton(prevButtonProps, prevButtonRef);
  const { buttonProps: nextProps } = useButton(nextButtonProps, nextButtonRef);

  // Current focused month/year for the picker
  const currentYear = state.visibleRange.start.year;
  const currentMonth = state.visibleRange.start.month; // 1-indexed

  // Build year list: 10 years back, 10 years forward
  const minYear = minValue ? minValue.year : currentYear - 10;
  const maxYear = maxValue ? maxValue.year : currentYear + 10;
  const years: number[] = [];
  for (let y = minYear; y <= maxYear; y++) years.push(y);

  // Scroll selected items into view when picker opens
  const monthListRef = useRef<HTMLDivElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPickerOpen) return;
    // Small delay to let DOM render
    const t = setTimeout(() => {
      const mEl = monthListRef.current?.querySelector('[data-selected="true"]') as HTMLElement | null;
      if (mEl) mEl.scrollIntoView({ block: 'center' });
      const yEl = yearListRef.current?.querySelector('[data-selected="true"]') as HTMLElement | null;
      if (yEl) yEl.scrollIntoView({ block: 'center' });
    }, 20);
    return () => clearTimeout(t);
  }, [isPickerOpen]);

  const handlePickerSelect = (month: number, year: number) => {
    // state.focusedDate is the calendar's internal focused date.
    // We navigate by setting it to the 1st of the target month/year.
    // Use the same calendar system as the current focused date.
    const current = state.focusedDate;
    const newDate = current.set({ year, month, day: 1 });
    state.setFocusedDate(newDate);
    setIsPickerOpen(false);
  };

  const baseClasses = cn(
    'calendar',
    `calendar--${size}`,
    isDisabled && 'calendar--disabled',
    isReadOnly && 'calendar--readonly',
    isInvalid && 'calendar--invalid',
    classNames.base
  );

  return (
    <div
      {...calendarProps}
      ref={(node) => {
        if (calendarRef) (calendarRef as any).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as any).current = node;
      }}
      id={id}
      className={baseClasses}
      style={{ width: calendarWidth ? `${calendarWidth}px` : '100%' }}
    >
      {/* Top Content */}
      {topContent && (
        <div className="calendar-top-content">
          {topContent}
        </div>
      )}

      {/* Calendar Header */}
      <div className={cn('calendar-header', `calendar-header--${size}`, classNames.header)}>
        {!isPickerOpen && (
          <button
            {...prevProps}
            ref={prevButtonRef}
            type="button"
            onMouseDown={(e) => {
              e.stopPropagation();
              prevProps.onMouseDown?.(e as any);
            }}
            className={cn('calendar-nav-button', `calendar-nav-button--${size}`)}
          >
            <Icon size="sm" color="secondary">
              <ChevronLeftIcon />
            </Icon>
          </button>
        )}

        {showMonthAndYearPickers ? (
          <button
            type="button"
            className={cn('calendar-title', 'calendar-title--picker', `calendar-title--${size}`, classNames.title)}
            onClick={() => setIsPickerOpen((v) => !v)}
          >
            {title}
            <ChevronDownIcon
              className={cn('calendar-title__chevron', isPickerOpen && 'calendar-title__chevron--open')}
            />
          </button>
        ) : (
          <h2 className={cn('calendar-title', `calendar-title--${size}`, classNames.title)}>
            {title}
          </h2>
        )}

        {!isPickerOpen && (
          <button
            {...nextProps}
            ref={nextButtonRef}
            type="button"
            onMouseDown={(e) => {
              e.stopPropagation();
              nextProps.onMouseDown?.(e as any);
            }}
            className={cn('calendar-nav-button', `calendar-nav-button--${size}`)}
          >
            <Icon size="sm" color="secondary">
              <ChevronRightIcon />
            </Icon>
          </button>
        )}
      </div>

      {/* Month/Year Picker Panel */}
      {isPickerOpen && showMonthAndYearPickers && (
        <div className="calendar-picker">
          {/* Month column */}
          <div className="calendar-picker__column" ref={monthListRef}>
            {MONTH_NAMES.map((name, i) => {
              const monthNum = i + 1;
              const isSelected = monthNum === currentMonth;
              return (
                <button
                  key={monthNum}
                  type="button"
                  data-selected={isSelected}
                  className={cn('calendar-picker__item', isSelected && 'calendar-picker__item--selected')}
                  onClick={() => handlePickerSelect(monthNum, currentYear)}
                >
                  {name}
                </button>
              );
            })}
          </div>
          {/* Year column */}
          <div className="calendar-picker__column" ref={yearListRef}>
            {years.map((y) => {
              const isSelected = y === currentYear;
              return (
                <button
                  key={y}
                  type="button"
                  data-selected={isSelected}
                  className={cn('calendar-picker__item', isSelected && 'calendar-picker__item--selected')}
                  onClick={() => handlePickerSelect(currentMonth, y)}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Calendar Grid(s) */}
      {!isPickerOpen && (
        <div className={cn('calendar-grid-wrapper', `calendar-grid-wrapper--${size}`, classNames.gridWrapper)}>
          {[...new Array(visibleMonths).keys()].map((monthIndex) => (
            <CalendarGrid
              key={monthIndex}
              state={state}
              offset={{ months: monthIndex } as DateDuration}
              size={size}
              isDateUnavailable={isDateUnavailable}
              classNames={classNames}
              isRangePicker={isRangePicker}
              rangeValue={rangeValue}
            />
          ))}
        </div>
      )}

      {/* Bottom Content */}
      {bottomContent && (
        <div className="calendar-bottom-content">
          {bottomContent}
        </div>
      )}
    </div>
  );
});

Calendar.displayName = 'Calendar';

// ===============================================
// CALENDAR GRID
// ===============================================

interface CalendarGridProps {
  state: any;
  offset?: DateDuration;
  size: CalendarSize;
  isDateUnavailable?: (date: DateValue) => boolean;
  classNames?: CalendarProps['classNames'];
  isRangePicker?: boolean;
  rangeValue?: { start: DateValue | null; end: DateValue | null } | null;
}

function CalendarGrid({ state, offset, size, isDateUnavailable, classNames, isRangePicker, rangeValue }: CalendarGridProps) {
  const { locale } = useLocale();
  const gridRef = React.useRef<HTMLTableElement>(null);

  // Calculate the start date for this grid
  const startDate = offset ? state.visibleRange.start.add(offset) : state.visibleRange.start;

  const { gridProps, headerProps, weekDays } = useCalendarGrid(
    {
      startDate: startDate as any,
      endDate: startDate.add({ months: 1 }).subtract({ days: 1 }) as any,
    },
    state
  );

  const weeksInMonth = getWeeksInMonth(startDate, locale);

  return (
    <table
      {...gridProps}
      ref={gridRef}
      className={cn('calendar-grid', `calendar-grid--${size}`, classNames?.grid)}
    >
      <thead {...headerProps} className={cn('calendar-grid-header', classNames?.gridHeader)}>
        <tr className="calendar-grid-header-row">
          {weekDays.map((day, index) => (
            <th
              key={index}
              className={cn('calendar-grid-header-cell', `calendar-grid-header-cell--${size}`, classNames?.gridHeaderCell)}
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={cn('calendar-grid-body', classNames?.gridBody)}>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex} className="calendar-grid-body-row">
            {state.getDatesInWeek(weekIndex, startDate)
              .map((date: DateValue | null, i: number) =>
                date ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                    size={size}
                    currentMonth={startDate}
                    isDateUnavailable={isDateUnavailable}
                    classNames={classNames}
                    isRangePicker={isRangePicker}
                    rangeValue={rangeValue}
                  />
                ) : <td key={i} />
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ===============================================
// CALENDAR CELL
// ===============================================

interface CalendarCellProps {
  state: any;
  date: DateValue;
  size: CalendarSize;
  currentMonth: DateValue;
  isDateUnavailable?: (date: DateValue) => boolean;
  classNames?: CalendarProps['classNames'];
  isRangePicker?: boolean;
  rangeValue?: { start: DateValue | null; end: DateValue | null } | null;
}

function CalendarCell({ state, date, size, currentMonth, isDateUnavailable, classNames, isRangePicker, rangeValue }: CalendarCellProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const { cellProps, buttonProps, isSelected, isDisabled, isUnavailable, formattedDate } = useCalendarCell(
    { date: date as any },
    state,
    ref
  );

  const isOutsideMonth = !isSameMonth(currentMonth, date);
  const isToday = checkIsToday(date, state.timeZone);

  // Range selection logic
  let isRangeStart = false;
  let isRangeEnd = false;
  let isRangeMiddle = false;

  if (isRangePicker && rangeValue?.start && rangeValue?.end) {
    const dateCompare = date.compare(rangeValue.start);
    const endCompare = date.compare(rangeValue.end);

    isRangeStart = dateCompare === 0;
    isRangeEnd = endCompare === 0;
    isRangeMiddle = dateCompare > 0 && endCompare < 0;
  }

  const cellClasses = cn(
    'calendar-cell',
    `calendar-cell--${size}`,
    classNames?.cell
  );

  const buttonClasses = cn(
    'calendar-cell-button',
    `calendar-cell-button--${size}`,
    isSelected && !isRangePicker && 'calendar-cell-button--selected',
    isRangeStart && 'calendar-cell-button--range-start',
    isRangeEnd && 'calendar-cell-button--range-end',
    isRangeMiddle && 'calendar-cell-button--range-middle',
    isDisabled && 'calendar-cell-button--disabled',
    isUnavailable && 'calendar-cell-button--unavailable',
    isOutsideMonth && 'calendar-cell-button--outside-month',
    isToday && 'calendar-cell-button--today',
    classNames?.cellButton
  );

  return (
    <td {...cellProps} className={cellClasses}>
      <button
        {...buttonProps}
        ref={ref}
        disabled={isDisabled || isUnavailable}
        className={buttonClasses}
      >
        {formattedDate}
      </button>
    </td>
  );
}
