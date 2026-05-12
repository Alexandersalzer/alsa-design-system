"use client";

import React, { useState } from 'react';
import { Box, Body, Textarea } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function TextareaPage() {
  const [value, setValue] = useState('');
  const [clearableValue, setClearableValue] = useState('This text can be cleared');
  const [controlledValue, setControlledValue] = useState('');

  return (
    <ComponentDocPage
      componentName="Textarea"
      description="Multi-line text input with HeroUI features including variants, colors, clearable, and label placements"
      importStatement={`import { Textarea } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple multi-line text input',
          preview: (
            <Box
              display="flex"
              justify="center"
            >
              <Box style={{ width: '100%', maxWidth: '500px' }}>
                <Textarea
                  label="Message"
                  placeholder="Enter your message..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  rows={4}
                />
              </Box>
            </Box>
          ),
          code: `const [value, setValue] = useState('');

<Textarea
  label="Message"
  placeholder="Enter your message..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  rows={4}
/>`,
        },

        {
          title: 'Variants',
          description: 'Different visual styles for the textarea',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 md:grid-cols-2">
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Textarea variant="flat" label="Flat" placeholder="Flat variant" rows={3} />
                  <Body size="xs" color="secondary">variant="flat" (default)</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Textarea variant="bordered" label="Bordered" placeholder="Bordered variant" rows={3} />
                  <Body size="xs" color="secondary">variant="bordered"</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Textarea variant="faded" label="Faded" placeholder="Faded variant" rows={3} />
                  <Body size="xs" color="secondary">variant="faded"</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Textarea variant="underlined" label="Underlined" placeholder="Underlined variant" rows={3} />
                  <Body size="xs" color="secondary">variant="underlined"</Body>
                </Box>
              </Box>
            </Box>
          ),
          code: `<Textarea variant="flat" label="Description" />

<Textarea variant="bordered" label="Description" />

<Textarea variant="faded" label="Description" />

<Textarea variant="underlined" label="Description" />`        },

        {
          title: 'Color Variants',
          description: 'Different color themes for focus states',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 md:grid-cols-2">
              <Box>
                <Textarea color="primary" variant="bordered" label="Primary" placeholder="Focus to see color" rows={2} />
              </Box>
              <Box>
                <Textarea color="success" variant="bordered" label="Success" placeholder="Focus to see color" rows={2} />
              </Box>
              <Box>
                <Textarea color="warning" variant="bordered" label="Warning" placeholder="Focus to see color" rows={2} />
              </Box>
              <Box>
                <Textarea color="danger" variant="bordered" label="Danger" placeholder="Focus to see color" rows={2} />
              </Box>
            </Box>
          ),
          code: `<Textarea color="primary" variant="bordered" label="Primary" />

<Textarea color="success" variant="bordered" label="Success" />

<Textarea color="warning" variant="bordered" label="Warning" />

<Textarea color="danger" variant="bordered" label="Danger" />`        },

        {
          title: 'Clearable',
          description: 'Add a clear button to quickly remove all text',
          preview: (
            <Box display="flex" justify="center">
              <Box style={{ width: '100%', maxWidth: '500px' }}>
                <Textarea
                  label="Clearable Textarea"
                  placeholder="Type something..."
                  value={clearableValue}
                  onValueChange={setClearableValue}
                  isClearable
                  onClear={() => setClearableValue('')}
                  rows={4}
                />
              </Box>
            </Box>
          ),
          code: `const [value, setValue] = useState('Some text');

<Textarea
  label="Clearable Textarea"
  value={value}
  onValueChange={setValue}
  isClearable
  onClear={() => setValue('')}
/>`,
        },

        {
          title: 'Label Placement',
          description: 'Control where the label appears',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Textarea labelPlacement="outside" label="Outside" placeholder="Label above (default)" rows={2} />
                  <Body size="xs" color="secondary">labelPlacement="outside"</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Textarea labelPlacement="outside-left" label="Outside Left" placeholder="Label to the left" rows={2} />
                  <Body size="xs" color="secondary">labelPlacement="outside-left"</Body>
                </Box>
              </Box>
            </Box>
          ),
          code: `<Textarea labelPlacement="outside" label="Description" />

<Textarea labelPlacement="outside-left" label="Notes" />`        },

        {
          title: 'Validation States',
          description: 'Show error, success, or invalid states',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Textarea label="Default" placeholder="Default state" rows={2} />
                  <Body size="xs" color="secondary">Normal state</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Textarea
                    label="Invalid"
                    placeholder="Invalid state"
                    rows={2}
                    isInvalid
                    error="This field is required"
                  />
                  <Body size="xs" color="error">isInvalid with error message</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Textarea
                    label="Success"
                    placeholder="Success state"
                    rows={2}
                    success="Looks good!"
                  />
                  <Body size="xs" color="success">With success message</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Textarea label="Disabled" placeholder="Disabled state" rows={2} disabled />
                  <Body size="xs" color="secondary">Disabled state</Body>
                </Box>
              </Box>
            </Box>
          ),
          code: `<Textarea label="Normal" />

<Textarea label="Invalid" isInvalid error="Required" />

<Textarea label="Success" success="Looks good!" />

<Textarea label="Disabled" disabled />`        },

        {
          title: 'With Required Indicator',
          description: 'Show a required asterisk when needed',
          preview: (
            <Box display="flex" justify="center">
              <Box style={{ width: '100%', maxWidth: '500px' }}>
                <Textarea
                  label="Message"
                  placeholder="This field is required..."
                  required
                  rows={4}
                />
              </Box>
            </Box>
          ),
          code: `<Textarea
  label="Message"
  placeholder="This field is required..."
  required
/>`,
        },

        {
          title: 'Controlled with onValueChange',
          description: 'Use HeroUI-style value control',
          preview: (
            <Box display="flex" direction="column" gap="md">
              <Textarea
                label="Controlled Textarea"
                placeholder="Type something..."
                value={controlledValue}
                onValueChange={setControlledValue}
                rows={4}
              />
              <Body size="sm" color="secondary">
                Current value: {controlledValue || '(empty)'}
              </Body>
            </Box>
          ),
          code: `const [value, setValue] = useState('');

<Textarea
  label="Controlled Textarea"
  value={value}
  onValueChange={setValue}
/>

{/* Current value: {value} */}`,
        },

        {
          title: 'Practical Examples',
          description: 'Real-world textarea usage patterns',
          preview: (
            <Box display="flex" direction="column" gap="md">
              <Box>
                <Textarea
                  variant="bordered"
                  label="Feedback"
                  placeholder="Share your feedback..."
                  description="Help us improve our product"
                  rows={4}
                  isClearable
                />
              </Box>

              <Box>
                <Textarea
                  variant="faded"
                  color="primary"
                  label="Project Description"
                  placeholder="Describe your project goals..."
                  required
                  rows={5}
                  description="Provide as much detail as possible"
                />
              </Box>

              <Box>
                <Textarea
                  variant="underlined"
                  labelPlacement="outside-left"
                  label="Notes"
                  placeholder="Quick notes..."
                  rows={3}
                />
              </Box>
            </Box>
          ),
          code: `// Feedback form with clear button
<Textarea
  variant="bordered"
  label="Feedback"
  placeholder="Share your feedback..."
  description="Help us improve"
  isClearable
/>

// Required field with description
<Textarea
  variant="faded"
  color="primary"
  label="Description"
  placeholder="Describe..."
  required
  description="Provide detail"
/>

// Compact horizontal layout
<Textarea
  variant="underlined"
  labelPlacement="outside-left"
  label="Notes"
  placeholder="Quick notes..."
/>`        },
      ]}
    />
  );
}
