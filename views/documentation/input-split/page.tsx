"use client";

import React, { useState } from 'react';
import {
  Box,
  Body,
  InputSplit,
  VStack,
} from '../../../design/index';

import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function InputSplitPage() {
  const [speedValue, setSpeedValue] = useState('1.5');
  const [speedUnit, setSpeedUnit] = useState('1.5x');

  // Sync playback speed values
  const handleSpeedChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setSpeedValue(value);
      setSpeedUnit(`${value}x`);
    } else {
      setSpeedValue(value);
    }
  };

  const handleSpeedUnitChange = (unit: string) => {
    setSpeedUnit(unit);
    // Extract numeric value from unit (e.g., "1.75x" -> "1.75")
    const numericValue = unit.replace('x', '').replace('×', '');
    setSpeedValue(numericValue);
  };

  const [widthValue, setWidthValue] = useState('320');
  const [widthUnit, setWidthUnit] = useState('px');

  const [timeValue, setTimeValue] = useState('45');
  const [timeUnit, setTimeUnit] = useState('min');

  const [fontValue, setFontValue] = useState('16');
  const [fontSize, setFontSize] = useState('px');

  const [marginValue, setMarginValue] = useState('2');
  const [marginUnit, setMarginUnit] = useState('rem');

  return (
    <ComponentDocPage
      componentName="InputSplit"
      description="A text input with an attached dropdown picker for selecting units or options. Perfect for measurements, playback controls, and value + unit combinations."
      importStatement={`import { InputSplit } from '../../../design/index'`}
      sections={[
        // ===== BASIC USAGE =====
        {
          title: 'Basic Usage',
          preview: (
            <Box
              display="flex"
              direction="column"
              gap="md"
              align="center"
              justify="center"
            >
              <InputSplit
                value={speedValue}
                onValueChange={setSpeedValue}
                pickerValue={speedUnit}
                onPickerChange={setSpeedUnit}
                pickerOptions={[
                  { value: '0.5x', label: '0.5×' },
                  { value: '1x', label: '1×' },
                  { value: '1.5x', label: '1.5×' },
                  { value: '2x', label: '2×' },
                ]}
                placeholder="Speed"
              />
              <Body size="sm" color="secondary">
                Value: {speedValue} | Unit: {speedUnit}
              </Body>
            </Box>
          ),
          code: `const [value, setValue] = useState('1.5');
const [unit, setUnit] = useState('1.5x');

<InputSplit
  value={value}
  onValueChange={setValue}
  pickerValue={unit}
  onPickerChange={setUnit}
  pickerOptions={[
    { value: '0.5x', label: '0.5×' },
    { value: '1x', label: '1×' },
    { value: '1.5x', label: '1.5×' },
    { value: '2x', label: '2×' },
  ]}
  placeholder="Speed"
/>`,
        },

        // ===== SIZES =====
        {
          title: 'Sizes',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1 sm:grid-cols-3"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <InputSplit
                  size="sm"
                  value="100"
                  pickerValue="px"
                  pickerOptions={[
                    { value: 'px', label: 'px' },
                    { value: '%', label: '%' },
                  ]}
                  placeholder="Width"
                />
                <Body size="xs" color="secondary">size="sm"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <InputSplit
                  size="md"
                  value="100"
                  pickerValue="px"
                  pickerOptions={[
                    { value: 'px', label: 'px' },
                    { value: '%', label: '%' },
                  ]}
                  placeholder="Width"
                />
                <Body size="xs" color="secondary">size="md"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <InputSplit
                  size="lg"
                  value="100"
                  pickerValue="px"
                  pickerOptions={[
                    { value: 'px', label: 'px' },
                    { value: '%', label: '%' },
                  ]}
                  placeholder="Width"
                />
                <Body size="xs" color="secondary">size="lg"</Body>
              </Box>
            </Box>
          ),
          code: `<InputSplit size="sm" value="100" pickerValue="px" pickerOptions={opts} />

<InputSplit size="md" value="100" pickerValue="px" pickerOptions={opts} />

<InputSplit size="lg" value="100" pickerValue="px" pickerOptions={opts} />`,
        },

        // ===== DIMENSION UNITS =====
        {
          title: 'Use Case: Dimensions',
          description: 'Perfect for width, height, spacing, and other dimensional inputs',
          preview: (
            <Box
              display="flex"
              direction="column"
              gap="md"
              align="center"
              justify="center"
            >
              <VStack spacing="md" style={{ width: '100%', maxWidth: '400px' }}>
                <InputSplit
                  label="Width"
                  value={widthValue}
                  onValueChange={setWidthValue}
                  pickerValue={widthUnit}
                  onPickerChange={setWidthUnit}
                  pickerOptions={[
                    { value: 'px', label: 'px' },
                    { value: '%', label: '%' },
                    { value: 'rem', label: 'rem' },
                    { value: 'em', label: 'em' },
                    { value: 'vw', label: 'vw' },
                  ]}
                  placeholder="Enter width"
                />
                <Body size="sm" color="secondary">
                  Result: {widthValue}{widthUnit}
                </Body>
              </VStack>
            </Box>
          ),
          code: `<InputSplit
  label="Width"
  value={widthValue}
  onValueChange={setWidthValue}
  pickerValue={widthUnit}
  onPickerChange={setWidthUnit}
  pickerOptions={[
    { value: 'px', label: 'px' },
    { value: '%', label: '%' },
    { value: 'rem', label: 'rem' },
    { value: 'em', label: 'em' },
    { value: 'vw', label: 'vw' },
  ]}
  placeholder="Enter width"
/>`,
        },

        // ===== TIME UNITS =====
        {
          title: 'Use Case: Time/Duration',
          description: 'For animation durations, timeouts, and time-based inputs',
          preview: (
            <Box
              display="flex"
              direction="column"
              gap="md"
              align="center"
              justify="center"
            >
              <VStack spacing="md" style={{ width: '100%', maxWidth: '400px' }}>
                <InputSplit
                  label="Duration"
                  value={timeValue}
                  onValueChange={setTimeValue}
                  pickerValue={timeUnit}
                  onPickerChange={setTimeUnit}
                  pickerOptions={[
                    { value: 'ms', label: 'ms', description: 'Milliseconds' },
                    { value: 's', label: 's', description: 'Seconds' },
                    { value: 'min', label: 'min', description: 'Minutes' },
                    { value: 'h', label: 'h', description: 'Hours' },
                  ]}
                  placeholder="Enter duration"
                />
                <Body size="sm" color="secondary">
                  Result: {timeValue}{timeUnit}
                </Body>
              </VStack>
            </Box>
          ),
          code: `<InputSplit
  label="Duration"
  value={timeValue}
  onValueChange={setTimeValue}
  pickerValue={timeUnit}
  onPickerChange={setTimeUnit}
  pickerOptions={[
    { value: 'ms', label: 'ms', description: 'Milliseconds' },
    { value: 's', label: 's', description: 'Seconds' },
    { value: 'min', label: 'min', description: 'Minutes' },
    { value: 'h', label: 'h', description: 'Hours' },
  ]}
/>`,
        },

        // ===== PLAYBACK SPEED =====
        {
          title: 'Use Case: Playback Speed',
          description: 'Media player controls and speed selectors. The input value syncs with the selected speed.',
          preview: (
            <Box
              display="flex"
              direction="column"
              gap="md"
              align="center"
              justify="center"
            >
              <VStack spacing="md" style={{ width: '100%', maxWidth: '280px' }}>
                <InputSplit
                  label="Playback Speed"
                  value={speedValue}
                  onValueChange={handleSpeedChange}
                  pickerValue={speedUnit}
                  onPickerChange={handleSpeedUnitChange}
                  pickerOptions={[
                    { value: '0.25x', label: '0.25×' },
                    { value: '0.5x', label: '0.5×' },
                    { value: '0.75x', label: '0.75×' },
                    { value: '1x', label: '1× (Normal)' },
                    { value: '1.25x', label: '1.25×' },
                    { value: '1.5x', label: '1.5×' },
                    { value: '1.75x', label: '1.75×' },
                    { value: '2x', label: '2×' },
                  ]}
                  placeholder="Speed"
                  style={{ maxWidth: '200px' }}
                />
                <Body size="sm" color="secondary">
                  Current speed: {speedValue}×
                </Body>
              </VStack>
            </Box>
          ),
          code: `// Sync playback speed values
const handleSpeedChange = (value: string) => {
  const numValue = parseFloat(value);
  if (!isNaN(numValue)) {
    setSpeedValue(value);
    setSpeedUnit(\`\${value}x\`);
  } else {
    setSpeedValue(value);
  }
};

const handleSpeedUnitChange = (unit: string) => {
  setSpeedUnit(unit);
  // Extract numeric value ("1.75x" -> "1.75")
  const numericValue = unit.replace('x', '').replace('×', '');
  setSpeedValue(numericValue);
};

<InputSplit
  label="Playback Speed"
  value={speedValue}
  onValueChange={handleSpeedChange}
  pickerValue={speedUnit}
  onPickerChange={handleSpeedUnitChange}
  pickerOptions={[
    { value: '0.5x', label: '0.5×' },
    { value: '1x', label: '1× (Normal)' },
    { value: '1.5x', label: '1.5×' },
    { value: '2x', label: '2×' },
  ]}
/>`,
        },

        // ===== TYPOGRAPHY =====
        {
          title: 'Use Case: Typography Settings',
          description: 'Font sizes, line heights, and spacing',
          preview: (
            <Box
              display="flex"
              direction="column"
              gap="md"
              align="center"
              justify="center"
            >
              <VStack spacing="md" style={{ width: '100%', maxWidth: '400px' }}>
                <InputSplit
                  label="Font Size"
                  value={fontValue}
                  onValueChange={setFontValue}
                  pickerValue={fontSize}
                  onPickerChange={setFontSize}
                  pickerOptions={[
                    { value: 'px', label: 'px' },
                    { value: 'rem', label: 'rem' },
                    { value: 'em', label: 'em' },
                    { value: 'pt', label: 'pt' },
                  ]}
                  placeholder="Size"
                />
                <Body size="sm" color="secondary">
                  Font size: {fontValue}{fontSize}
                </Body>
              </VStack>
            </Box>
          ),
          code: `<InputSplit
  label="Font Size"
  value={fontValue}
  onValueChange={setFontValue}
  pickerValue={fontSize}
  onPickerChange={setFontSize}
  pickerOptions={[
    { value: 'px', label: 'px' },
    { value: 'rem', label: 'rem' },
    { value: 'em', label: 'em' },
  ]}
/>`,
        },

        // ===== WITH LABELS =====
        {
          title: 'With Labels',
          preview: (
            <Box
              display="flex"
              direction="column"
              gap="md"
              align="center"
              justify="center"
            >
              <VStack spacing="md" style={{ width: '100%', maxWidth: '400px' }}>
                <InputSplit
                  label="Margin"
                  value={marginValue}
                  onValueChange={setMarginValue}
                  pickerValue={marginUnit}
                  onPickerChange={setMarginUnit}
                  pickerOptions={[
                    { value: 'px', label: 'px' },
                    { value: 'rem', label: 'rem' },
                    { value: 'em', label: 'em' },
                  ]}
                  placeholder="Enter value"
                />
              </VStack>
            </Box>
          ),
          code: `<InputSplit
  label="Margin"
  value={marginValue}
  onValueChange={setMarginValue}
  pickerValue={marginUnit}
  onPickerChange={setMarginUnit}
  pickerOptions={[
    { value: 'px', label: 'px' },
    { value: 'rem', label: 'rem' },
  ]}
/>`,
        },

        // ===== ERROR STATE =====
        {
          title: 'Error State',
          preview: (
            <Box
              display="flex"
              direction="column"
              gap="md"
              align="center"
              justify="center"
            >
              <VStack spacing="md" style={{ width: '100%', maxWidth: '400px' }}>
                <InputSplit
                  label="Width"
                  value="-50"
                  pickerValue="px"
                  pickerOptions={[
                    { value: 'px', label: 'px' },
                    { value: '%', label: '%' },
                  ]}
                  error="Value must be positive"
                />
              </VStack>
            </Box>
          ),
          code: `<InputSplit
  label="Width"
  value="-50"
  pickerValue="px"
  pickerOptions={opts}
  error="Value must be positive"
/>`,
        },

        // ===== DISABLED STATE =====
        {
          title: 'Disabled State',
          preview: (
            <Box
              display="flex"
              direction="column"
              gap="md"
              align="center"
              justify="center"
            >
              <VStack spacing="md" style={{ width: '100%', maxWidth: '400px' }}>
                <InputSplit
                  label="Width"
                  value="100"
                  pickerValue="px"
                  pickerOptions={[
                    { value: 'px', label: 'px' },
                    { value: '%', label: '%' },
                  ]}
                  disabled
                />
              </VStack>
            </Box>
          ),
          code: `<InputSplit
  label="Width"
  value="100"
  pickerValue="px"
  pickerOptions={opts}
  disabled
/>`,
        },
      ]}
    />
  );
}
