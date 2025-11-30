// ===============================================
// blimpify-ui/design/system/components/forms/Calendar/Calendar.tsx
// CALENDAR - Date selection component
// ===============================================

import React, { forwardRef, useMemo, useCallback, useId } from 'react';
import { cn } from '../../../utils/cn';
import { Icon } from '../../media';
import { IconButton } from '../../actions';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { 
  CalendarDate, 
  DateValue,
  DateDuration
} from '@internationalized/date';
import { 
  createCalendar,
  getWeeksInMonth,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday as checkIsToday
} from '@internationalized/date';
import { useCalendarState } from '@react-stately/calendar';
import { useCalendar, useCalendarGrid, useCalendarCell } from '@react-aria/calendar';
import { useDateFormatter, useLocale } from '@react-aria/i18n';
import './Calendar.css';

// ===============================================
// TYPES
// ===============================================

export type CalendarSize = 'sm' | 'md' | 'lg';

export interface CalendarProps {
  /** Current selected value */
  value?: DateValue | null;
  /** Default value (uncontrolled) */
  defaultValue?: DateValue | null;
  /** Focused date value */
  focusedValue?: DateValue;
  /** Default focused value */
  defaultFocusedValue?: DateValue;
  /** Size variant */
  size?: CalendarSize;
  /** Minimum selectable date */
  minValue?: DateValue;
  /** Maximum selectable date */
  maxValue?: DateValue;
  /** Number of visible months */
  visibleMonths?: number;
  /** Disabled state */
  isDisabled?: boolean;
  /** Read-only state */
  isReadOnly?: boolean;
  /** Invalid state */
  isInvalid?: boolean;
  /** Function to check if a date is unavailable */
  isDateUnavailable?: (date: DateValue) => boolean;
  /** Show month/year pickers */
  showMonthAndYearPickers?: boolean;
  /** Page behavior */
  pageBehavior?: 'single' | 'visible';
  /** First day of week */
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
  /** Auto focus */
  autoFocus?: boolean;
  /** Top content */
  topContent?: React.ReactNode;
  /** Bottom content */
  bottomContent?: React.ReactNode;
  /** Calendar width */
  calendarWidth?: number;
  /** Custom class names */
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
  /** Change handler */
  onChange?: (value: DateValue) => void;
  /** Focus change handler */
  onFocusChange?: (date: DateValue) => void;
  /** ID for accessibility */
  id?: string;
}

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
  ...props
}, ref) => {
  const { locale } = useLocale();
  const generatedId = useId();
  const id = providedId || generatedId;

  // Create calendar state
  const state = useCalendarState({
    value: value as any,
    defaultValue: defaultValue as any,
    focusedValue: focusedValue as any,
    defaultFocusedValue: defaultFocusedValue as any,
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

  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    {
      ...props,
      value: value as any,
      defaultValue: defaultValue as any,
      minValue: minValue as any,
      maxValue: maxValue as any,
      isDisabled,
      isReadOnly,
    },
    state
  );

  // Build classes
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
      ref={ref} 
      id={id}
      className={baseClasses}
      style={{ width: calendarWidth }}
    >
      {/* Top Content */}
      {topContent && (
        <div className="calendar-top-content">
          {topContent}
        </div>
      )}

      {/* Calendar Header */}
      <div className={cn('calendar-header', `calendar-header--${size}`, classNames.header)}>
        <button
          {...prevButtonProps}
          className={cn('calendar-nav-button', `calendar-nav-button--${size}`)}
        >
          <Icon size="sm" color="secondary">
            <ChevronLeftIcon />
          </Icon>
        </button>
        
        <h2 className={cn('calendar-title', `calendar-title--${size}`, classNames.title)}>
          {title}
        </h2>

        <button
          {...nextButtonProps}
          className={cn('calendar-nav-button', `calendar-nav-button--${size}`)}
        >
          <Icon size="sm" color="secondary">
            <ChevronRightIcon />
          </Icon>
        </button>
      </div>

      {/* Calendar Grid(s) */}
      <div className={cn('calendar-grid-wrapper', `calendar-grid-wrapper--${size}`, classNames.gridWrapper)}>
        {[...new Array(visibleMonths).keys()].map((monthIndex) => (
          <CalendarGrid
            key={monthIndex}
            state={state}
            offset={{ months: monthIndex } as DateDuration}
            size={size}
            isDateUnavailable={isDateUnavailable}
            classNames={classNames}
          />
        ))}
      </div>

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
}

function CalendarGrid({ state, offset, size, isDateUnavailable, classNames }: CalendarGridProps) {
  const { locale } = useLocale();
  const { gridProps, headerProps, weekDays } = useCalendarGrid(
    { 
      ...offset && { startDate: state.visibleRange.start.add(offset) },
      endDate: offset ? state.visibleRange.start.add(offset).add({ months: 1 }).subtract({ days: 1 }) : undefined,
    },
    state
  );

  const weeksInMonth = getWeeksInMonth(state.visibleRange.start.add(offset || { months: 0 }), locale);

  return (
    <table 
      {...gridProps} 
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
            {state.getDatesInWeek(weekIndex, state.visibleRange.start.add(offset || { months: 0 }))
              .map((date: DateValue | null, i: number) => 
                date ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                    size={size}
                    currentMonth={state.visibleRange.start.add(offset || { months: 0 })}
                    isDateUnavailable={isDateUnavailable}
                    classNames={classNames}
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
}

function CalendarCell({ state, date, size, currentMonth, isDateUnavailable, classNames }: CalendarCellProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const { cellProps, buttonProps, isSelected, isDisabled, isUnavailable, formattedDate } = useCalendarCell(
    { date: date as any },
    state,
    ref
  );

  const isOutsideMonth = !isSameMonth(currentMonth, date);
  const isToday = checkIsToday(date, state.timeZone);

  const cellClasses = cn(
    'calendar-cell',
    `calendar-cell--${size}`,
    classNames?.cell
  );

  const buttonClasses = cn(
    'calendar-cell-button',
    `calendar-cell-button--${size}`,
    isSelected && 'calendar-cell-button--selected',
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