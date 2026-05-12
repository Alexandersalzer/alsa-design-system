"use client";

import React, { useState } from 'react';
import { VStack, Body, Input, Icon, Button } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import {
  MagnifyingGlassIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

export default function InputPage() {
  const [basicValue, setBasicValue] = useState('');
  const [clearableValue, setClearableValue] = useState('');
  const [controlledValue, setControlledValue] = useState('');

  return (
    <ComponentDocPage
      componentName="Input"
      description="Text input field with HeroUI-style variants, colors, label placements, and interactive features"
      importStatement={`import { Input, Icon } from '../../../design/index';
import { EnvelopeIcon } from '@heroicons/react/24/outline';`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple text input with label and placeholder',
          preview: (
            <Input
              label="Email"
              placeholder="Enter your email"
              value={basicValue}
              onChange={(e) => setBasicValue(e.target.value)}
            />
          ),
          code: `import { useState } from 'react';
import { Input } from '../../../design/index';

export function BasicInput() {
  const [value, setValue] = useState('');

  return (
    <Input
      label="Email"
      placeholder="Enter your email"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}`,
        },

        {
          title: 'Variants',
          description: 'Five visual styles: flat, bordered, faded, underlined, and page',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 360 }}>
              <Input variant="flat" label="Flat" placeholder="Flat variant" />
              <Input variant="bordered" label="Bordered" placeholder="Bordered variant" />
              <Input variant="faded" label="Faded" placeholder="Faded variant" />
              <Input variant="underlined" label="Underlined" placeholder="Underlined variant" />
              <Input variant="page" label="Page" placeholder="Seamless page integration" />
            </VStack>
          ),
          code: `import { Input } from '../../../design/index';

export function InputVariants() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input variant="flat" label="Flat" placeholder="Flat variant" />
      <Input variant="bordered" label="Bordered" placeholder="Bordered variant" />
      <Input variant="faded" label="Faded" placeholder="Faded variant" />
      <Input variant="underlined" label="Underlined" placeholder="Underlined variant" />
      <Input variant="page" label="Page" placeholder="Seamless page integration" />
    </div>
  );
}`,
        },

        {
          title: 'Color Variants',
          description: 'Semantic color options for focus states',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 360 }}>
              <Input variant="bordered" color="primary" label="Primary" placeholder="Focus to see color" />
              <Input variant="bordered" color="success" label="Success" placeholder="Focus to see color" />
              <Input variant="bordered" color="warning" label="Warning" placeholder="Focus to see color" />
              <Input variant="bordered" color="danger" label="Danger" placeholder="Focus to see color" />
            </VStack>
          ),
          code: `import { Input } from '../../../design/index';

export function InputColors() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input variant="bordered" color="primary" label="Primary" placeholder="Focus to see color" />
      <Input variant="bordered" color="success" label="Success" placeholder="Focus to see color" />
      <Input variant="bordered" color="warning" label="Warning" placeholder="Focus to see color" />
      <Input variant="bordered" color="danger" label="Danger" placeholder="Focus to see color" />
    </div>
  );
}`,
        },

        {
          title: 'Sizes',
          description: 'Three size options: sm, md, lg',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 360 }}>
              <Input size="sm" label="Small" placeholder="Small input" />
              <Input size="md" label="Medium" placeholder="Medium input (default)" />
              <Input size="lg" label="Large" placeholder="Large input" />
            </VStack>
          ),
          code: `import { Input } from '../../../design/index';

export function InputSizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input size="sm" label="Small" placeholder="Small input" />
      <Input size="md" label="Medium" placeholder="Medium input (default)" />
      <Input size="lg" label="Large" placeholder="Large input" />
    </div>
  );
}`,
        },

        {
          title: 'Clearable',
          description: 'Show a clear button when input has value',
          preview: (
            <Input
              label="Clearable Input"
              placeholder="Type something..."
              value={clearableValue}
              onValueChange={setClearableValue}
              isClearable
              onClear={() => setClearableValue('')}
              style={{ maxWidth: 360 }}
            />
          ),
          code: `import { useState } from 'react';
import { Input } from '../../../design/index';

export function ClearableInput() {
  const [value, setValue] = useState('');

  return (
    <Input
      label="Clearable Input"
      placeholder="Type something..."
      value={value}
      onValueChange={setValue}
      isClearable
      onClear={() => setValue('')}
    />
  );
}`,
        },

        {
          title: 'Validation States',
          description: 'Show validation feedback with colors and messages',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 360 }}>
              <Input label="Email" placeholder="you@example.com" />
              <Input label="Email" placeholder="you@example.com" isInvalid error="Please enter a valid email" />
              <Input variant="bordered" color="success" label="Email" defaultValue="valid@example.com" description="Email is valid!" />
              <Input label="Email" placeholder="you@example.com" disabled />
            </VStack>
          ),
          code: `import { Input } from '../../../design/index';

export function InputValidation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input label="Email" placeholder="you@example.com" />
      <Input
        label="Email"
        placeholder="you@example.com"
        isInvalid
        error="Please enter a valid email"
      />
      <Input
        variant="bordered"
        color="success"
        label="Email"
        defaultValue="valid@example.com"
        description="Email is valid!"
      />
      <Input label="Email" placeholder="you@example.com" disabled />
    </div>
  );
}`,
        },

        {
          title: 'With Icons',
          description: 'Add left icons to clarify input intent',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 360 }}>
              <Input
                label="Email"
                placeholder="you@example.com"
                leftIcon={<Icon size="sm" color="secondary"><EnvelopeIcon /></Icon>}
              />
              <Input
                label="Search"
                placeholder="Search..."
                leftIcon={<Icon size="sm" color="secondary"><MagnifyingGlassIcon /></Icon>}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                leftIcon={<Icon size="sm" color="secondary"><LockClosedIcon /></Icon>}
              />
            </VStack>
          ),
          code: `import { Input, Icon } from '../../../design/index';
import { EnvelopeIcon, MagnifyingGlassIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export function InputsWithIcons() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input
        label="Email"
        placeholder="you@example.com"
        leftIcon={<Icon size="sm" color="secondary"><EnvelopeIcon /></Icon>}
      />
      <Input
        label="Search"
        placeholder="Search..."
        leftIcon={<Icon size="sm" color="secondary"><MagnifyingGlassIcon /></Icon>}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        leftIcon={<Icon size="sm" color="secondary"><LockClosedIcon /></Icon>}
      />
    </div>
  );
}`,
        },

        {
          title: 'Start & End Content',
          description: 'Add prefix or suffix content with dividers',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 360 }}>
              <Input label="Website" placeholder="example.com" startContent="https://" />
              <Input label="Phone" type="tel" placeholder="70 123 45 67" startContent="+46" />
              <Input label="Domain" placeholder="mycompany" endContent=".com" />
              <Input label="Weight" type="number" placeholder="100" endContent="kg" />
            </VStack>
          ),
          code: `import { Input } from '../../../design/index';

export function InputAffixes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input label="Website" placeholder="example.com" startContent="https://" />
      <Input label="Phone" type="tel" placeholder="70 123 45 67" startContent="+46" />
      <Input label="Domain" placeholder="mycompany" endContent=".com" />
      <Input label="Weight" type="number" placeholder="100" endContent="kg" />
    </div>
  );
}`,
        },

        {
          title: 'Action Button',
          description: 'Embed an action button inside the input',
          preview: (
            <Input
              label="Newsletter"
              type="email"
              placeholder="Enter your email"
              leftIcon={<Icon size="sm" color="secondary"><EnvelopeIcon /></Icon>}
              actionButton={<Button variant="primary">Subscribe</Button>}
              style={{ maxWidth: 420 }}
            />
          ),
          code: `import { Input, Icon, Button } from '../../../design/index';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export function NewsletterInput() {
  return (
    <Input
      label="Newsletter"
      type="email"
      placeholder="Enter your email"
      leftIcon={<Icon size="sm" color="secondary"><EnvelopeIcon /></Icon>}
      actionButton={<Button variant="primary">Subscribe</Button>}
    />
  );
}`,
        },

        {
          title: 'Controlled with onValueChange',
          description: 'Use onValueChange for cleaner state management',
          preview: (
            <VStack spacing="sm" align="stretch" style={{ width: '100%', maxWidth: 360 }}>
              <Input
                label="Email"
                placeholder="you@example.com"
                value={controlledValue}
                onValueChange={setControlledValue}
              />
              <Body size="sm" color="secondary">
                Value: {controlledValue || '(empty)'}
              </Body>
            </VStack>
          ),
          code: `import { useState } from 'react';
import { Input, Body } from '../../../design/index';

export function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <>
      <Input
        label="Email"
        placeholder="you@example.com"
        value={value}
        onValueChange={setValue}
      />
      <Body size="sm" color="secondary">
        Value: {value || '(empty)'}
      </Body>
    </>
  );
}`,
        },
      ]}
      properties={[
        { name: 'label', type: 'string', description: 'Label above the input' },
        { name: 'placeholder', type: 'string', description: 'Placeholder text' },
        { name: 'value', type: 'string', description: 'Controlled value' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Value change handler' },
        { name: 'variant', type: "'flat' | 'bordered' | 'faded' | 'underlined' | 'page'", default: "'flat'", description: 'Visual style' },
        { name: 'color', type: "'default' | 'primary' | 'success' | 'warning' | 'danger'", default: "'default'", description: 'Semantic color for focus states' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Input size' },
        { name: 'labelPlacement', type: "'outside' | 'outside-left'", default: "'outside'", description: 'Label position' },
        { name: 'isClearable', type: 'boolean', default: 'false', description: 'Show clear button when value is present' },
        { name: 'isInvalid', type: 'boolean', default: 'false', description: 'Mark as invalid' },
        { name: 'error', type: 'string', description: 'Error message shown under input' },
        { name: 'description', type: 'string', description: 'Helper text shown under input' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Show required indicator' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input' },
        { name: 'leftIcon', type: 'ReactNode', description: 'Icon rendered on the left' },
        { name: 'startContent', type: 'ReactNode', description: 'Prefix content (e.g. "https://")' },
        { name: 'endContent', type: 'ReactNode', description: 'Suffix content (e.g. ".com")' },
        { name: 'actionButton', type: 'ReactNode', description: 'Action button rendered inside the input' },
      ]}
    />
  );
}
