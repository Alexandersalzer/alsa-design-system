"use client";

import React, { useState } from 'react';
import { Box, Body, Picker, VStack } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function PickerPage() {
  const [value1, setValue1] = useState<string | null>('');
  const [value2, setValue2] = useState<string | null>('us');

  return (
    <ComponentDocPage
      componentName="Picker"
      description="Select dropdown for choosing from a list of options with keyboard navigation support"
      importStatement={`import { Picker } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple dropdown select',
          preview: (
            <Box style={{ width: '100%', maxWidth: '300px' }}>
              <Picker
                value={value1}
                onChange={setValue1}
                options={[
                  { value: '', label: 'Select an option' },
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3' },
                ]}
              />
            </Box>
          ),
          code: `import { useState } from 'react';
import { Picker } from '../../../design/index';

export function BasicPicker() {
  const [value, setValue] = useState('');

  return (
    <Picker
      value={value}
      onChange={setValue}
      options={[
        { value: '', label: 'Select an option' },
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ]}
    />
  );
}`,
        },

        {
          title: 'Sizes',
          description: 'Different size variants',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 300 }}>
              <VStack spacing="xs">
                <Picker size="sm" value={value1} onChange={setValue1} options={[{ value: '', label: 'Select size' }, { value: 'xs', label: 'Extra Small' }]} />
                <Body size="xs" color="secondary">size="sm"</Body>
              </VStack>
              <VStack spacing="xs">
                <Picker size="md" value={value1} onChange={setValue1} options={[{ value: '', label: 'Select size' }, { value: 'xs', label: 'Extra Small' }]} />
                <Body size="xs" color="secondary">size="md"</Body>
              </VStack>
            </VStack>
          ),
          code: `<Picker size="sm" value={value} onChange={setValue} options={options} />

<Picker size="md" value={value} onChange={setValue} options={options} />`,
        },

        {
          title: 'States',
          description: 'Disabled and error states',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 300 }}>
              <VStack spacing="xs">
                <Picker value={value2} onChange={setValue2} options={[{ value: 'us', label: 'United States' }, { value: 'uk', label: 'United Kingdom' }]} />
                <Body size="xs" color="secondary">Default</Body>
              </VStack>
              <VStack spacing="xs">
                <Picker disabled value="" options={[{ value: '', label: 'Disabled select' }]} />
                <Body size="xs" color="secondary">Disabled</Body>
              </VStack>
            </VStack>
          ),
          code: `<Picker value={value} onChange={setValue} options={options} />

<Picker disabled value="" options={options} />`,
        },

        {
          title: 'Practical Examples',
          description: 'Common select field patterns',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 360 }}>
              <VStack spacing="xs">
                <Body weight="medium" size="sm">Country</Body>
                <Picker
                  value={value2}
                  onChange={setValue2}
                  options={[
                    { value: 'us', label: 'United States' },
                    { value: 'uk', label: 'United Kingdom' },
                    { value: 'ca', label: 'Canada' },
                    { value: 'au', label: 'Australia' },
                  ]}
                />
              </VStack>
              <VStack spacing="xs">
                <Body weight="medium" size="sm">Priority</Body>
                <Picker
                  value=""
                  options={[
                    { value: '', label: 'Select priority' },
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' },
                  ]}
                />
              </VStack>
            </VStack>
          ),
          code: `import { useState } from 'react';
import { Picker, VStack, Body } from '../../../design/index';

export function PickerExamples() {
  const [country, setCountry] = useState('us');
  const [priority, setPriority] = useState('');

  return (
    <>
      <VStack spacing="xs">
        <Body weight="medium" size="sm">Country</Body>
        <Picker
          value={country}
          onChange={setCountry}
          options={[
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
            { value: 'ca', label: 'Canada' },
          ]}
        />
      </VStack>

      <VStack spacing="xs">
        <Body weight="medium" size="sm">Priority</Body>
        <Picker
          value={priority}
          onChange={setPriority}
          options={[
            { value: '', label: 'Select priority' },
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />
      </VStack>
    </>
  );
}`,
        },
      ]}
    />
  );
}
