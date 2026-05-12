"use client";

import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Body,
  DatePicker,
  DateInput,
  TimeInput,
  Calendar,
  DateRangePicker,
} from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import { parseDate, today, getLocalTimeZone } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import type { TimeValue } from '@react-aria/datepicker';
import type { RangeValue } from '@react-types/shared';

export default function DatePickerPage() {
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<DateValue | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeValue | null>(null);
  const [calendarDate, setCalendarDate] = useState<DateValue | null>(null);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);

  return (
    <ComponentDocPage
      componentName="Date & Time Pickers"
      description="Accessible date and time selection components with internationalized date handling, keyboard navigation, calendar popovers, and validation states"
      importStatement={`import { DatePicker, DateInput, TimeInput, Calendar, DateRangePicker } from '../../../design/index';
import { parseDate, today, getLocalTimeZone } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import type { TimeValue } from '@react-aria/datepicker';
import type { RangeValue } from '@react-types/shared';`}
      sections={[
        {
          title: 'DatePicker - Basic Usage',
          description: 'Select a date with a calendar popup',
          preview: (
            <DatePicker
              label="Select a date"
              value={selectedDate}
              onChange={setSelectedDate}
              description="Choose any date from the calendar"
            />
          ),
          code: `import { useState } from 'react';
import { DatePicker } from '../../../design/index';
import type { DateValue } from '@internationalized/date';

export function BasicDatePicker() {
  const [date, setDate] = useState<DateValue | null>(null);

  return (
    <DatePicker
      label="Select a date"
      value={date}
      onChange={setDate}
      description="Choose any date from the calendar"
    />
  );
}`,
        },

        {
          title: 'DatePicker with Time',
          description: 'Select both date and time using minute granularity',
          preview: (
            <DatePicker
              label="Meeting time"
              value={selectedDateTime}
              onChange={setSelectedDateTime}
              granularity="minute"
              description="Select date and time for the meeting"
            />
          ),
          code: `import { useState } from 'react';
import { DatePicker } from '../../../design/index';
import type { DateValue } from '@internationalized/date';

export function DatePickerWithTime() {
  const [dateTime, setDateTime] = useState<DateValue | null>(null);

  return (
    <DatePicker
      label="Meeting time"
      value={dateTime}
      onChange={setDateTime}
      granularity="minute"
      description="Select date and time for the meeting"
    />
  );
}`,
        },

        {
          title: 'DatePicker Variants',
          description: 'Four visual styles: bordered, flat, faded, and underlined',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 420 }}>
              <DatePicker variant="bordered" label="Bordered" />
              <DatePicker variant="flat" label="Flat" />
              <DatePicker variant="faded" label="Faded" />
              <DatePicker variant="underlined" label="Underlined" />
            </VStack>
          ),
          code: `import { DatePicker } from '../../../design/index';

export function DatePickerVariants() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DatePicker variant="bordered" label="Bordered" />
      <DatePicker variant="flat" label="Flat" />
      <DatePicker variant="faded" label="Faded" />
      <DatePicker variant="underlined" label="Underlined" />
    </div>
  );
}`,
        },

        {
          title: 'DatePicker Sizes',
          description: 'Three size options: sm, md, and lg',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 420 }}>
              <DatePicker size="sm" label="Small" />
              <DatePicker size="md" label="Medium" />
              <DatePicker size="lg" label="Large" />
            </VStack>
          ),
          code: `import { DatePicker } from '../../../design/index';

export function DatePickerSizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DatePicker size="sm" label="Small" />
      <DatePicker size="md" label="Medium" />
      <DatePicker size="lg" label="Large" />
    </div>
  );
}`,
        },

        {
          title: 'DateInput - Keyboard Entry',
          description: 'Editable date field without a calendar popup',
          preview: (
            <DateInput
              label="Birth date"
              description="Type or use arrow keys to adjust"
            />
          ),
          code: `import { DateInput } from '../../../design/index';

export function BasicDateInput() {
  return (
    <DateInput
      label="Birth date"
      description="Type or use arrow keys to adjust"
    />
  );
}`,
        },

        {
          title: 'TimeInput - Time Selection',
          description: 'Dedicated time input field with controlled state',
          preview: (
            <TimeInput
              label="Meeting time"
              value={selectedTime}
              onChange={setSelectedTime}
              granularity="minute"
            />
          ),
          code: `import { useState } from 'react';
import { TimeInput } from '../../../design/index';
import type { TimeValue } from '@react-aria/datepicker';

export function BasicTimeInput() {
  const [time, setTime] = useState<TimeValue | null>(null);

  return (
    <TimeInput
      label="Meeting time"
      value={time}
      onChange={setTime}
      granularity="minute"
    />
  );
}`,
        },

        {
          title: 'TimeInput - Hour Cycle',
          description: 'Display time using 12-hour or 24-hour format',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 420 }}>
              <TimeInput
                label="12-hour format"
                hourCycle={12}
              />
              <TimeInput
                label="24-hour format"
                hourCycle={24}
              />
            </VStack>
          ),
          code: `import { TimeInput } from '../../../design/index';

export function TimeInputHourCycle() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TimeInput
        label="12-hour format"
        hourCycle={12}
      />
      <TimeInput
        label="24-hour format"
        hourCycle={24}
      />
    </div>
  );
}`,
        },

        {
          title: 'Calendar - Standalone',
          description: 'Standalone calendar component for custom date selection interfaces',
          preview: (
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Calendar
                value={calendarDate}
                onChange={setCalendarDate}
              />
            </div>
          ),
          code: `import { useState } from 'react';
import { Calendar } from '../../../design/index';
import type { DateValue } from '@internationalized/date';

export function StandaloneCalendar() {
  const [date, setDate] = useState<DateValue | null>(null);

  return (
    <Calendar
      value={date}
      onChange={setDate}
    />
  );
}`,
        },

        {
          title: 'DateRangePicker',
          description: 'Select a start date and an end date',
          preview: (
            <DateRangePicker
              label="Vacation dates"
              value={dateRange}
              onChange={setDateRange}
              description="Select check-in and check-out dates"
            />
          ),
          code: `import { useState } from 'react';
import { DateRangePicker } from '../../../design/index';
import type { DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';

export function BasicDateRangePicker() {
  const [range, setRange] = useState<RangeValue<DateValue> | null>(null);

  return (
    <DateRangePicker
      label="Vacation dates"
      value={range}
      onChange={setRange}
      description="Select check-in and check-out dates"
    />
  );
}`,
        },

        {
          title: 'Validation States',
          description: 'Show required, disabled, read-only, and invalid states',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 420 }}>
              <DatePicker
                label="Required field"
                isRequired
                helper="This field is required"
              />
              <DatePicker
                label="Disabled field"
                isDisabled
              />
              <DatePicker
                label="Read-only field"
                isReadOnly
                defaultValue={parseDate('2024-01-15')}
              />
              <DatePicker
                label="Invalid field"
                isInvalid
                errorMessage="Please select a valid date"
              />
            </VStack>
          ),
          code: `import { DatePicker } from '../../../design/index';
import { parseDate } from '@internationalized/date';

export function DatePickerValidation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DatePicker
        label="Required field"
        isRequired
        helper="This field is required"
      />
      <DatePicker
        label="Disabled field"
        isDisabled
      />
      <DatePicker
        label="Read-only field"
        isReadOnly
        defaultValue={parseDate('2024-01-15')}
      />
      <DatePicker
        label="Invalid field"
        isInvalid
        errorMessage="Please select a valid date"
      />
    </div>
  );
}`,
        },

        {
          title: 'Date Constraints',
          description: 'Restrict selectable dates with minimum and maximum values',
          preview: (
            <DatePicker
              label="Future dates only"
              minValue={today(getLocalTimeZone())}
              description="You can only select dates from today onwards"
            />
          ),
          code: `import { DatePicker } from '../../../design/index';
import { today, getLocalTimeZone } from '@internationalized/date';

export function ConstrainedDatePicker() {
  return (
    <DatePicker
      label="Future dates only"
      minValue={today(getLocalTimeZone())}
      description="You can only select dates from today onwards"
    />
  );
}`,
        },

        {
          title: 'Label Placement',
          description: 'Position the label outside, inside, or to the left',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 520 }}>
              <DatePicker
                label="Outside"
                labelPlacement="outside"
              />
              <DatePicker
                label="Inside"
                labelPlacement="inside"
              />
              <DatePicker
                label="Outside Left"
                labelPlacement="outside-left"
              />
            </VStack>
          ),
          code: `import { DatePicker } from '../../../design/index';

export function DatePickerLabelPlacement() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DatePicker
        label="Outside"
        labelPlacement="outside"
      />
      <DatePicker
        label="Inside"
        labelPlacement="inside"
      />
      <DatePicker
        label="Outside Left"
        labelPlacement="outside-left"
      />
    </div>
  );
}`,
        },
      ]}
      properties={[
        { name: 'label', type: 'string', description: 'Label shown for the field' },
        { name: 'value', type: 'DateValue | TimeValue | RangeValue<DateValue> | null', description: 'Controlled selected value' },
        { name: 'defaultValue', type: 'DateValue | TimeValue | RangeValue<DateValue>', description: 'Initial value for uncontrolled usage' },
        { name: 'onChange', type: '(value) => void', description: 'Change handler fired when the value changes' },
        { name: 'variant', type: "'bordered' | 'flat' | 'faded' | 'underlined'", default: "'bordered'", description: 'Visual style for date and time inputs' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Input and calendar size' },
        { name: 'labelPlacement', type: "'outside' | 'inside' | 'outside-left'", default: "'outside'", description: 'Label position' },
        { name: 'description', type: 'string', description: 'Helper text shown under the field' },
        { name: 'helper', type: 'string', description: 'Additional helper text shown under the field' },
        { name: 'errorMessage', type: 'string', description: 'Error message shown when invalid' },
        { name: 'granularity', type: "'day' | 'hour' | 'minute' | 'second'", default: "'day'", description: 'Smallest editable date or time unit' },
        { name: 'hourCycle', type: '12 | 24', description: 'Controls 12-hour or 24-hour time display' },
        { name: 'isRequired', type: 'boolean', default: 'false', description: 'Mark the field as required' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disable the field' },
        { name: 'isReadOnly', type: 'boolean', default: 'false', description: 'Prevent editing while still displaying the value' },
        { name: 'isInvalid', type: 'boolean', default: 'false', description: 'Mark the field as invalid' },
        { name: 'minValue', type: 'DateValue', description: 'Minimum selectable date' },
        { name: 'maxValue', type: 'DateValue', description: 'Maximum selectable date' },
        { name: 'DatePicker', type: 'component', description: 'Combines date input with a calendar popover' },
        { name: 'DateInput', type: 'component', description: 'Keyboard-editable date field without calendar popup' },
        { name: 'TimeInput', type: 'component', description: 'Keyboard-editable time field' },
        { name: 'Calendar', type: 'component', description: 'Standalone calendar for custom date selection flows' },
        { name: 'DateRangePicker', type: 'component', description: 'Selects start and end dates as a range' },
      ]}
    />
  );
}