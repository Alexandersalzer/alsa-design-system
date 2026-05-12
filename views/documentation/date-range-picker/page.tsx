"use client";

import React, { useState } from 'react';
import { VStack, Body, DateRangePicker } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import { parseDate, today, getLocalTimeZone } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';

export default function DateRangePickerPage() {
  const [basicRange, setBasicRange] = useState<RangeValue<DateValue> | null>(null);
  const [controlledRange, setControlledRange] = useState<RangeValue<DateValue> | null>(null);
  const [vacationDates, setVacationDates] = useState<RangeValue<DateValue> | null>(null);
  const [campaignDates, setCampaignDates] = useState<RangeValue<DateValue> | null>(null);

  return (
    <ComponentDocPage
      componentName="DateRangePicker"
      description="Date range input with accessible calendar selection, internationalized date handling, variants, sizes, validation states, and range constraints"
      importStatement={`import { DateRangePicker } from '../../../design/index';
import { today, getLocalTimeZone } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple date range picker with label and helper text',
          preview: (
            <DateRangePicker
              label="Select date range"
              value={basicRange}
              onChange={setBasicRange}
              description="Choose your start and end dates"
            />
          ),
          code: `import { useState } from 'react';
import { DateRangePicker } from '../../../design/index';
import type { DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';

export function BasicDateRangePicker() {
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);

  return (
    <DateRangePicker
      label="Select date range"
      value={dateRange}
      onChange={setDateRange}
      description="Choose your start and end dates"
    />
  );
}`,
        },

        {
          title: 'Variants',
          description: 'Four visual styles: bordered, flat, faded, and underlined',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 420 }}>
              <DateRangePicker variant="bordered" label="Bordered" />
              <DateRangePicker variant="flat" label="Flat" />
              <DateRangePicker variant="faded" label="Faded" />
              <DateRangePicker variant="underlined" label="Underlined" />
            </VStack>
          ),
          code: `import { DateRangePicker } from '../../../design/index';

export function DateRangePickerVariants() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DateRangePicker variant="bordered" label="Bordered" />
      <DateRangePicker variant="flat" label="Flat" />
      <DateRangePicker variant="faded" label="Faded" />
      <DateRangePicker variant="underlined" label="Underlined" />
    </div>
  );
}`,
        },

        {
          title: 'Sizes',
          description: 'Three size options: sm, md, and lg',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 420 }}>
              <DateRangePicker size="sm" label="Small" />
              <DateRangePicker size="md" label="Medium" />
              <DateRangePicker size="lg" label="Large" />
            </VStack>
          ),
          code: `import { DateRangePicker } from '../../../design/index';

export function DateRangePickerSizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DateRangePicker size="sm" label="Small" />
      <DateRangePicker size="md" label="Medium" />
      <DateRangePicker size="lg" label="Large" />
    </div>
  );
}`,
        },

        {
          title: 'Label Placement',
          description: 'Position the label outside, inside, or to the left',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 520 }}>
              <DateRangePicker
                label="Outside"
                labelPlacement="outside"
              />
              <DateRangePicker
                label="Inside"
                labelPlacement="inside"
              />
              <DateRangePicker
                label="Outside Left"
                labelPlacement="outside-left"
              />
            </VStack>
          ),
          code: `import { DateRangePicker } from '../../../design/index';

export function DateRangePickerLabelPlacement() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DateRangePicker
        label="Outside"
        labelPlacement="outside"
      />
      <DateRangePicker
        label="Inside"
        labelPlacement="inside"
      />
      <DateRangePicker
        label="Outside Left"
        labelPlacement="outside-left"
      />
    </div>
  );
}`,
        },

        {
          title: 'Validation States',
          description: 'Show required, disabled, read-only, and invalid states',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 420 }}>
              <DateRangePicker
                label="Required field"
                isRequired
                helper="This field is required"
              />
              <DateRangePicker
                label="Disabled field"
                isDisabled
              />
              <DateRangePicker
                label="Read-only field"
                isReadOnly
                defaultValue={{
                  start: parseDate('2024-01-15'),
                  end: parseDate('2024-01-20'),
                }}
              />
              <DateRangePicker
                label="Invalid field"
                isInvalid
                errorMessage="Please select a valid date range"
              />
            </VStack>
          ),
          code: `import { DateRangePicker } from '../../../design/index';
import { parseDate } from '@internationalized/date';

export function DateRangePickerValidation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DateRangePicker
        label="Required field"
        isRequired
        helper="This field is required"
      />
      <DateRangePicker
        label="Disabled field"
        isDisabled
      />
      <DateRangePicker
        label="Read-only field"
        isReadOnly
        defaultValue={{
          start: parseDate('2024-01-15'),
          end: parseDate('2024-01-20'),
        }}
      />
      <DateRangePicker
        label="Invalid field"
        isInvalid
        errorMessage="Please select a valid date range"
      />
    </div>
  );
}`,
        },

        {
          title: 'Date Constraints',
          description: 'Restrict selectable dates with minimum and maximum values',
          preview: (
            <DateRangePicker
              label="Future dates only"
              minValue={today(getLocalTimeZone())}
              description="You can only select dates from today onwards"
            />
          ),
          code: `import { DateRangePicker } from '../../../design/index';
import { today, getLocalTimeZone } from '@internationalized/date';

export function ConstrainedDateRangePicker() {
  return (
    <DateRangePicker
      label="Future dates only"
      minValue={today(getLocalTimeZone())}
      description="You can only select dates from today onwards"
    />
  );
}`,
        },

        {
          title: 'Visible Months',
          description: 'Control how many calendar months are visible in the popover',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 420 }}>
              <DateRangePicker
                label="Single month"
                visibleMonths={1}
              />
              <DateRangePicker
                label="Two months"
                visibleMonths={2}
              />
              <DateRangePicker
                label="Three months"
                visibleMonths={3}
              />
            </VStack>
          ),
          code: `import { DateRangePicker } from '../../../design/index';

export function DateRangePickerVisibleMonths() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DateRangePicker
        label="Single month"
        visibleMonths={1}
      />
      <DateRangePicker
        label="Two months"
        visibleMonths={2}
      />
      <DateRangePicker
        label="Three months"
        visibleMonths={3}
      />
    </div>
  );
}`,
        },

        {
          title: 'Selector Button Placement',
          description: 'Position the calendar selector button at the start or end',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 420 }}>
              <DateRangePicker
                label="Icon at start"
                selectorButtonPlacement="start"
              />
              <DateRangePicker
                label="Icon at end"
                selectorButtonPlacement="end"
              />
            </VStack>
          ),
          code: `import { DateRangePicker } from '../../../design/index';

export function DateRangePickerSelectorPlacement() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DateRangePicker
        label="Icon at start"
        selectorButtonPlacement="start"
      />
      <DateRangePicker
        label="Icon at end"
        selectorButtonPlacement="end"
      />
    </div>
  );
}`,
        },

        {
          title: 'Controlled Range',
          description: 'Control the selected range with React state',
          preview: (
            <VStack spacing="sm" align="stretch" style={{ width: '100%', maxWidth: 420 }}>
              <DateRangePicker
                label="Project timeline"
                value={controlledRange}
                onChange={setControlledRange}
                description="Select the project start and end dates"
              />
              <Body size="sm" color="secondary">
                Start: {controlledRange?.start?.toString() || '(empty)'}
              </Body>
              <Body size="sm" color="secondary">
                End: {controlledRange?.end?.toString() || '(empty)'}
              </Body>
            </VStack>
          ),
          code: `import { useState } from 'react';
import { DateRangePicker, Body } from '../../../design/index';
import type { DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';

export function ControlledDateRangePicker() {
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);

  return (
    <>
      <DateRangePicker
        label="Project timeline"
        value={dateRange}
        onChange={setDateRange}
        description="Select the project start and end dates"
      />

      <Body size="sm" color="secondary">
        Start: {dateRange?.start?.toString() || '(empty)'}
      </Body>

      <Body size="sm" color="secondary">
        End: {dateRange?.end?.toString() || '(empty)'}
      </Body>
    </>
  );
}`,
        },

        {
          title: 'Practical Examples',
          description: 'Real-world date range picker use cases',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 420 }}>
              <DateRangePicker
                label="Vacation dates"
                value={vacationDates}
                onChange={setVacationDates}
                description="Select your check-in and check-out dates"
                minValue={today(getLocalTimeZone())}
              />
              <DateRangePicker
                label="Campaign period"
                value={campaignDates}
                onChange={setCampaignDates}
                description="When should this campaign run?"
                isRequired
              />
            </VStack>
          ),
          code: `import { useState } from 'react';
import { DateRangePicker } from '../../../design/index';
import { today, getLocalTimeZone } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import type { RangeValue } from '@react-types/shared';

export function PracticalDateRangePickers() {
  const [vacationDates, setVacationDates] = useState<RangeValue<DateValue> | null>(null);
  const [campaignDates, setCampaignDates] = useState<RangeValue<DateValue> | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DateRangePicker
        label="Vacation dates"
        value={vacationDates}
        onChange={setVacationDates}
        description="Select your check-in and check-out dates"
        minValue={today(getLocalTimeZone())}
      />

      <DateRangePicker
        label="Campaign period"
        value={campaignDates}
        onChange={setCampaignDates}
        description="When should this campaign run?"
        isRequired
      />
    </div>
  );
}`,
        },
      ]}
      properties={[
        { name: 'label', type: 'string', description: 'Label shown for the date range picker' },
        { name: 'value', type: 'RangeValue<DateValue> | null', description: 'Controlled selected date range' },
        { name: 'defaultValue', type: 'RangeValue<DateValue>', description: 'Initial selected date range for uncontrolled usage' },
        { name: 'onChange', type: '(value: RangeValue<DateValue> | null) => void', description: 'Change handler fired when the selected range changes' },
        { name: 'variant', type: "'bordered' | 'flat' | 'faded' | 'underlined'", default: "'bordered'", description: 'Visual style' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Input and calendar size' },
        { name: 'labelPlacement', type: "'outside' | 'inside' | 'outside-left'", default: "'outside'", description: 'Label position' },
        { name: 'description', type: 'string', description: 'Helper text shown under the input' },
        { name: 'helper', type: 'string', description: 'Additional helper text shown under the input' },
        { name: 'errorMessage', type: 'string', description: 'Error message shown when invalid' },
        { name: 'isRequired', type: 'boolean', default: 'false', description: 'Mark the field as required' },
        { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disable the date range picker' },
        { name: 'isReadOnly', type: 'boolean', default: 'false', description: 'Prevent editing while still displaying the value' },
        { name: 'isInvalid', type: 'boolean', default: 'false', description: 'Mark the field as invalid' },
        { name: 'minValue', type: 'DateValue', description: 'Minimum selectable date' },
        { name: 'maxValue', type: 'DateValue', description: 'Maximum selectable date' },
        { name: 'visibleMonths', type: '1 | 2 | 3 | number', default: '2', description: 'Number of calendar months visible in the popover' },
        { name: 'selectorButtonPlacement', type: "'start' | 'end'", default: "'end'", description: 'Position of the calendar selector button' },
      ]}
    />
  );
}