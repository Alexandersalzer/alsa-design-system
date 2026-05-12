"use client";

import React, { useState } from 'react';
import {
  Box,
  Body,
  Slider,
} from '../../../design/index';
import type { SliderValue } from '../../../design/index';

import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function SliderPage() {
  const [controlledValue, setControlledValue] = useState<SliderValue>(50);
  const [rangeValue, setRangeValue] = useState<SliderValue>([25, 75]);
  const [priceRange, setPriceRange] = useState<SliderValue>([100, 800]);
  const [exposureValue, setExposureValue] = useState<SliderValue>(5);

  return (
    <ComponentDocPage
      componentName="Slider"
      description="A slider allows a user to select one or more values within a range"
      importStatement={`import { Slider } from '../../../design/index'`}
      sections={[
        // ===== BASIC USAGE =====
        {
          title: 'Basic Usage',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Box style={{ width: '100%', maxWidth: '400px' }}>
                <Slider
                  label="Temperature"
                  defaultValue={25}
                  minValue={0}
                  maxValue={100}
                />
              </Box>
            </Box>
          ),
          code: `<Slider
  label="Temperature"
  defaultValue={25}
  minValue={0}
  maxValue={100}
/>`,
        },

        // ===== SIZES =====
        {
          title: 'Sizes',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box display="flex" direction="column" gap="lg">
                <div>
                  <Slider label="Small" size="sm" defaultValue={30} />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>size="sm"</Body>
                </div>
                <div>
                  <Slider label="Medium" size="md" defaultValue={50} />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>size="md" (default)</Body>
                </div>
                <div>
                  <Slider label="Large" size="lg" defaultValue={70} />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>size="lg"</Body>
                </div>
              </Box>
            </Box>
          ),
          code: `<Slider label="Small" size="sm" defaultValue={30} />

<Slider label="Medium" size="md" defaultValue={50} />

<Slider label="Large" size="lg" defaultValue={70} />`
        },

        // ===== COLORS =====
        {
          title: 'Colors',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box display="flex" direction="column" gap="lg">
                <div>
                  <Slider label="Primary" color="primary" defaultValue={25} />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>color="primary"</Body>
                </div>
                <div>
                  <Slider label="Secondary" color="secondary" defaultValue={35} />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>color="secondary"</Body>
                </div>
                <div>
                  <Slider label="Success" color="success" defaultValue={45} />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>color="success"</Body>
                </div>
                <div>
                  <Slider label="Warning" color="warning" defaultValue={55} />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>color="warning"</Body>
                </div>
                <div>
                  <Slider label="Danger" color="danger" defaultValue={65} />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>color="danger"</Body>
                </div>
              </Box>
            </Box>
          ),
          code: `<Slider label="Primary" color="primary" defaultValue={25} />

<Slider label="Secondary" color="secondary" defaultValue={35} />

<Slider label="Success" color="success" defaultValue={45} />

<Slider label="Warning" color="warning" defaultValue={55} />

<Slider label="Danger" color="danger" defaultValue={65} />`
        },

        // ===== DISABLED =====
        {
          title: 'Disabled',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Box style={{ width: '100%', maxWidth: '400px' }}>
                <Slider
                  label="Disabled Slider"
                  defaultValue={50}
                  isDisabled
                />
              </Box>
            </Box>
          ),
          code: `<Slider
  label="Disabled Slider"
  defaultValue={50}
  isDisabled
/>`,
        },

        // ===== WITH STEPS =====
        {
          title: 'With Steps',
          description: 'Display small dots on each step using the showSteps prop.',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box display="flex" direction="column" gap="lg">
                <div>
                  <Slider
                    label="Temperature"
                    showSteps
                    step={10}
                    minValue={0}
                    maxValue={100}
                    defaultValue={50}
                  />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>step={10}</Body>
                </div>
                <div>
                  <Slider
                    label="Volume"
                    showSteps
                    step={25}
                    minValue={0}
                    maxValue={100}
                    defaultValue={50}
                  />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>step={25}</Body>
                </div>
              </Box>
            </Box>
          ),
          code: `<Slider
  label="Temperature"
  showSteps
  step={10}
  minValue={0}
  maxValue={100}
  defaultValue={50}
/>

<Slider
  label="Volume"
  showSteps
  step={25}
  minValue={0}
  maxValue={100}
  defaultValue={50}
/>`
        },

        // ===== WITH MARKS =====
        {
          title: 'With Marks',
          description: 'Display custom labels at specific values using the marks prop.',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Box style={{ width: '100%', maxWidth: '500px' }}>
                <Slider
                  label="Select a percentage"
                  minValue={0}
                  maxValue={1}
                  step={0.1}
                  defaultValue={0.5}
                  formatOptions={{ style: 'percent' }}
                  marks={[
                    { value: 0.2, label: '20%' },
                    { value: 0.5, label: '50%' },
                    { value: 0.8, label: '80%' },
                  ]}
                />
              </Box>
            </Box>
          ),
          code: `<Slider
  label="Select a percentage"
  minValue={0}
  maxValue={1}
  step={0.1}
  defaultValue={0.5}
  formatOptions={{ style: 'percent' }}
  marks={[
    { value: 0.2, label: '20%' },
    { value: 0.5, label: '50%' },
    { value: 0.8, label: '80%' },
  ]}
/>`,
        },

        // ===== RANGE SLIDER =====
        {
          title: 'Range Slider',
          description: 'Pass an array of values to create a range slider with multiple thumbs.',
          preview: (
            <Box
              display="flex"
              direction="column"
              gap="md"
            >
              <Box style={{ width: '100%', maxWidth: '500px' }}>
                <Slider
                  label="Price Range"
                  value={priceRange}
                  onChange={setPriceRange}
                  formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
                  minValue={0}
                  maxValue={1000}
                />
                <Body size="sm" color="secondary" style={{ marginTop: '12px' }}>
                  Selected range: ${Array.isArray(priceRange) && `${priceRange[0]} - $${priceRange[1]}`}
                </Body>
              </Box>
            </Box>
          ),
          code: `const [priceRange, setPriceRange] = useState<SliderValue>([100, 800]);

<Slider
  label="Price Range"
  value={priceRange}
  onChange={setPriceRange}
  formatOptions={{
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }}
  minValue={0}
  maxValue={1000}
/>`,
        },

        // ===== FILL OFFSET =====
        {
          title: 'Fill Offset',
          description: 'Set where the fill should start using the fillOffset prop.',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Box style={{ width: '100%', maxWidth: '400px' }}>
                <Slider
                  label="Exposure"
                  value={exposureValue}
                  onChange={setExposureValue}
                  minValue={-50}
                  maxValue={50}
                  fillOffset={0}
                />
              </Box>
            </Box>
          ),
          code: `<Slider
  label="Exposure"
  minValue={-50}
  maxValue={50}
  fillOffset={0}
  defaultValue={20}
/>`,
        },

        // ===== WITH TOOLTIP =====
        {
          title: 'With Tooltip',
          description: 'Show a tooltip with the current value on hover using showTooltip.',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Box style={{ width: '100%', maxWidth: '400px' }}>
                <Slider
                  label="Volume"
                  showTooltip
                  defaultValue={50}
                  minValue={0}
                  maxValue={100}
                />
              </Box>
            </Box>
          ),
          code: `<Slider
  label="Volume"
  showTooltip
  defaultValue={50}
  minValue={0}
  maxValue={100}
/>`,
        },

        // ===== CONTROLLED =====
        {
          title: 'Controlled',
          description: 'Control the slider value using the value and onChange props.',
          preview: (
            <Box
              display="flex"
              direction="column"
              gap="md"
            >
              <Box style={{ width: '100%', maxWidth: '500px' }}>
                <Slider
                  label="Volume"
                  value={controlledValue}
                  onChange={setControlledValue}
                  minValue={0}
                  maxValue={100}
                />
                <Body size="sm" color="secondary" style={{ marginTop: '12px' }}>
                  Current volume: {controlledValue}
                </Body>
              </Box>
            </Box>
          ),
          code: `const [controlledValue, setControlledValue] = useState<SliderValue>(50);

<Slider
  label="Volume"
  value={controlledValue}
  onChange={setControlledValue}
  minValue={0}
  maxValue={100}
/>`,
        },

        // ===== VALUE FORMATTING =====
        {
          title: 'Value Formatting',
          description: 'Format values using formatOptions (compatible with Intl.NumberFormat).',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box display="flex" direction="column" gap="lg">
                <div>
                  <Slider
                    label="Currency"
                    defaultValue={500}
                    minValue={0}
                    maxValue={2000}
                    step={50}
                    formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
                  />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>Currency format</Body>
                </div>
                <div>
                  <Slider
                    label="Percentage"
                    defaultValue={0.5}
                    minValue={0}
                    maxValue={1}
                    step={0.01}
                    formatOptions={{ style: 'percent' }}
                  />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>Percent format</Body>
                </div>
              </Box>
            </Box>
          ),
          code: `<Slider
  label="Currency"
  defaultValue={500}
  minValue={0}
  maxValue={2000}
  step={50}
  formatOptions={{
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }}
/>

<Slider
  label="Percentage"
  defaultValue={0.5}
  minValue={0}
  maxValue={1}
  step={0.01}
  formatOptions={{ style: 'percent' }}
/>`
        },

        // ===== CUSTOM VALUE =====
        {
          title: 'Custom Value Formatter',
          description: 'Use the getValue prop to customize the displayed value label.',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Box style={{ width: '100%', maxWidth: '400px' }}>
                <Slider
                  label="Donuts"
                  defaultValue={30}
                  minValue={0}
                  maxValue={60}
                  getValue={(value) => {
                    const v = Array.isArray(value) ? value[0] : value;
                    return `${v} of 60 donuts`;
                  }}
                />
              </Box>
            </Box>
          ),
          code: `<Slider
  label="Donuts"
  defaultValue={30}
  minValue={0}
  maxValue={60}
  getValue={(value) => {
    const v = Array.isArray(value) ? value[0] : value;
    return \`\${v} of 60 donuts\`;
  }}
/>`,
        },

        // ===== START & END CONTENT =====
        {
          title: 'Start & End Content',
          description: 'Add icons or content at the start and end of the slider.',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Box style={{ width: '100%', maxWidth: '400px' }}>
                <Slider
                  label="Volume"
                  defaultValue={50}
                  startContent={<span>🔉</span>}
                  endContent={<span>🔊</span>}
                />
              </Box>
            </Box>
          ),
          code: `<Slider
  label="Volume"
  defaultValue={50}
  startContent={<span>🔉</span>}
  endContent={<span>🔊</span>}
/>`,
        },

        // ===== HIDE VALUE =====
        {
          title: 'Hide Value',
          description: 'Hide the value label using the hideValue prop.',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Box style={{ width: '100%', maxWidth: '400px' }}>
                <Slider
                  label="Progress"
                  hideValue
                  defaultValue={75}
                />
              </Box>
            </Box>
          ),
          code: `<Slider
  label="Progress"
  hideValue
  defaultValue={75}
/>`,
        },

        // ===== RADIUS =====
        {
          title: 'Border Radius',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box display="flex" direction="column" gap="lg">
                <div>
                  <Slider label="None" radius="none" defaultValue={30} />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>radius="none"</Body>
                </div>
                <div>
                  <Slider label="Small" radius="sm" defaultValue={40} />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>radius="sm"</Body>
                </div>
                <div>
                  <Slider label="Medium" radius="md" defaultValue={50} />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>radius="md"</Body>
                </div>
                <div>
                  <Slider label="Large" radius="lg" defaultValue={60} />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>radius="lg"</Body>
                </div>
                <div>
                  <Slider label="Full" radius="full" defaultValue={70} />
                  <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>radius="full" (default)</Body>
                </div>
              </Box>
            </Box>
          ),
          code: `<Slider label="None" radius="none" defaultValue={30} />

<Slider label="Small" radius="sm" defaultValue={40} />

<Slider label="Medium" radius="md" defaultValue={50} />

<Slider label="Large" radius="lg" defaultValue={60} />

<Slider label="Full" radius="full" defaultValue={70} />`
        },

        // ===== WITH OUTLINE =====
        {
          title: 'With Outline',
          description: 'Add a small outline to the thumb using showOutline.',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Box style={{ width: '100%', maxWidth: '400px' }}>
                <Slider
                  label="Volume"
                  showOutline
                  defaultValue={60}
                />
              </Box>
            </Box>
          ),
          code: `<Slider
  label="Volume"
  showOutline
  defaultValue={60}
/>`,
        },
      ]}
    />
  );
}
