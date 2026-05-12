"use client";

import React from 'react';
import { Box, Body, Clickable, Icon, VStack, HStack } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function ClickablePage() {
  return (
    <ComponentDocPage
      componentName="Clickable"
      description="Wrapper component for creating custom interactive elements with proper semantics, link support, disabled state, spacing, radius, background, and border options"
      importStatement={`import { Clickable } from '../../../design/index';`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Wrap any content to make it clickable with proper semantics',
          preview: (
            <Clickable onClick={() => alert('Clicked!')}>
              <Box
                padding="md"
                border="default"
                radius="md"
                bg="base"
                display="flex"
                align="center"
                gap="sm"
              >
                <Body>Click me</Body>
                <Icon size="sm">
                  <ArrowRightIcon />
                </Icon>
              </Box>
            </Clickable>
          ),
          code: `import { Clickable, Box, Body } from '../../../design/index';

export function BasicClickable() {
  return (
    <Clickable onClick={() => console.log('Clicked!')}>
      <Box padding="md" border="default" radius="md" bg="base">
        <Body>Click me</Body>
      </Box>
    </Clickable>
  );
}`,
        },

        {
          title: 'As Link',
          description: 'Use href to render clickable content as navigation',
          preview: (
            <Clickable href="/dashboard">
              <Box
                padding="md"
                border="default"
                radius="md"
                bg="base"
                display="flex"
                align="center"
                gap="sm"
              >
                <Body>Go to Dashboard</Body>
                <Icon size="sm">
                  <ArrowRightIcon />
                </Icon>
              </Box>
            </Clickable>
          ),
          code: `import { Clickable, Box, Body } from '../../../design/index';

export function ClickableLink() {
  return (
    <Clickable href="/dashboard">
      <Box padding="md" border="default" radius="md" bg="base">
        <Body>Go to Dashboard</Body>
      </Box>
    </Clickable>
  );
}`,
        },

        {
          title: 'Disabled State',
          description: 'Disable interaction when an item is unavailable',
          preview: (
            <HStack spacing="lg" align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <VStack spacing="xs" align="center">
                <Clickable onClick={() => alert('Clicked!')}>
                  <Box padding="md" border="default" radius="md" bg="base">
                    <Body>Enabled</Body>
                  </Box>
                </Clickable>
                <Body size="xs" color="secondary">Interactive</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Clickable disabled onClick={() => alert('Clicked!')}>
                  <Box padding="md" border="default" radius="md" bg="base">
                    <Body color="secondary">Disabled</Body>
                  </Box>
                </Clickable>
                <Body size="xs" color="secondary">Not interactive</Body>
              </VStack>
            </HStack>
          ),
          code: `import { Clickable, Box, Body } from '../../../design/index';

export function ClickableDisabledState() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Clickable onClick={() => console.log('Clicked!')}>
        <Box padding="md" border="default" radius="md" bg="base">
          <Body>Enabled</Body>
        </Box>
      </Clickable>

      <Clickable disabled onClick={() => console.log('Clicked!')}>
        <Box padding="md" border="default" radius="md" bg="base">
          <Body color="secondary">Disabled</Body>
        </Box>
      </Clickable>
    </div>
  );
}`,
        },

        {
          title: 'Padding Options',
          description: 'Different padding sizes for clickable areas',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <HStack spacing="md" align="center" style={{ justifyContent: 'center', width: '100%' }}>
                <Clickable onClick={() => alert('Clicked!')} padding="none">
                  <Body>None</Body>
                </Clickable>
                <Clickable onClick={() => alert('Clicked!')} padding="xs">
                  <Body>XS</Body>
                </Clickable>
                <Clickable onClick={() => alert('Clicked!')} padding="sm">
                  <Body>SM</Body>
                </Clickable>
                <Clickable onClick={() => alert('Clicked!')} padding="md">
                  <Body>MD</Body>
                </Clickable>
              </HStack>

              <HStack spacing="md" align="center" style={{ justifyContent: 'center', width: '100%' }}>
                <Clickable onClick={() => alert('Clicked!')} padding="lg">
                  <Body>LG</Body>
                </Clickable>
                <Clickable onClick={() => alert('Clicked!')} padding="xl">
                  <Body>XL</Body>
                </Clickable>
                <Clickable onClick={() => alert('Clicked!')} padding="2xl">
                  <Body>2XL</Body>
                </Clickable>
              </HStack>
            </VStack>
          ),
          code: `import { Clickable, Body } from '../../../design/index';

export function ClickablePaddingOptions() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <Clickable padding="none" onClick={() => console.log('Clicked!')}>
        <Body>None</Body>
      </Clickable>

      <Clickable padding="xs" onClick={() => console.log('Clicked!')}>
        <Body>XS</Body>
      </Clickable>

      <Clickable padding="sm" onClick={() => console.log('Clicked!')}>
        <Body>SM</Body>
      </Clickable>

      <Clickable padding="md" onClick={() => console.log('Clicked!')}>
        <Body>MD</Body>
      </Clickable>

      <Clickable padding="lg" onClick={() => console.log('Clicked!')}>
        <Body>LG</Body>
      </Clickable>

      <Clickable padding="xl" onClick={() => console.log('Clicked!')}>
        <Body>XL</Body>
      </Clickable>

      <Clickable padding="2xl" onClick={() => console.log('Clicked!')}>
        <Body>2XL</Body>
      </Clickable>
    </div>
  );
}`,
        },

        {
          title: 'Border Radius Options',
          description: 'Different radius values for clickable surfaces',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <HStack spacing="md" align="center" style={{ justifyContent: 'center', width: '100%' }}>
                <Clickable padding="md" borderRadius="none" background="card">
                  <Body>None</Body>
                </Clickable>
                <Clickable padding="md" borderRadius="sm" background="card">
                  <Body>SM</Body>
                </Clickable>
                <Clickable padding="md" borderRadius="md" background="card">
                  <Body>MD</Body>
                </Clickable>
                <Clickable padding="md" borderRadius="lg" background="card">
                  <Body>LG</Body>
                </Clickable>
              </HStack>

              <HStack spacing="md" align="center" style={{ justifyContent: 'center', width: '100%' }}>
                <Clickable padding="md" borderRadius="xl" background="card">
                  <Body>XL</Body>
                </Clickable>
                <Clickable padding="md" borderRadius="2xl" background="card">
                  <Body>2XL</Body>
                </Clickable>
                <Clickable padding="md" borderRadius="full" background="card">
                  <Body>Full</Body>
                </Clickable>
              </HStack>
            </VStack>
          ),
          code: `import { Clickable, Body } from '../../../design/index';

export function ClickableRadiusOptions() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <Clickable padding="md" borderRadius="none" background="card">
        <Body>None</Body>
      </Clickable>

      <Clickable padding="md" borderRadius="sm" background="card">
        <Body>Small</Body>
      </Clickable>

      <Clickable padding="md" borderRadius="md" background="card">
        <Body>Medium</Body>
      </Clickable>

      <Clickable padding="md" borderRadius="lg" background="card">
        <Body>Large</Body>
      </Clickable>

      <Clickable padding="md" borderRadius="xl" background="card">
        <Body>XL</Body>
      </Clickable>

      <Clickable padding="md" borderRadius="2xl" background="card">
        <Body>2XL</Body>
      </Clickable>

      <Clickable padding="md" borderRadius="full" background="card">
        <Body>Full</Body>
      </Clickable>
    </div>
  );
}`,
        },

        {
          title: 'Background Options',
          description: 'Different background styles for interactive surfaces',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <HStack spacing="md" align="center" style={{ justifyContent: 'center', width: '100%' }}>
                <Clickable padding="md" borderRadius="md" background="transparent">
                  <Body>Transparent</Body>
                </Clickable>
                <Clickable padding="md" borderRadius="md" background="subdued">
                  <Body>Subdued</Body>
                </Clickable>
                <Clickable padding="md" borderRadius="md" background="card">
                  <Body>Card</Body>
                </Clickable>
              </HStack>

              <HStack spacing="md" align="center" style={{ justifyContent: 'center', width: '100%' }}>
                <Clickable padding="md" borderRadius="md" background="hover">
                  <Body>Hover</Body>
                </Clickable>
                <Clickable padding="md" borderRadius="md" background="selected">
                  <Body>Selected</Body>
                </Clickable>
              </HStack>
            </VStack>
          ),
          code: `import { Clickable, Body } from '../../../design/index';

export function ClickableBackgroundOptions() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <Clickable padding="md" borderRadius="md" background="transparent">
        <Body>Transparent</Body>
      </Clickable>

      <Clickable padding="md" borderRadius="md" background="subdued">
        <Body>Subdued</Body>
      </Clickable>

      <Clickable padding="md" borderRadius="md" background="card">
        <Body>Card</Body>
      </Clickable>

      <Clickable padding="md" borderRadius="md" background="hover">
        <Body>Hover</Body>
      </Clickable>

      <Clickable padding="md" borderRadius="md" background="selected">
        <Body>Selected</Body>
      </Clickable>
    </div>
  );
}`,
        },

        {
          title: 'Border Options',
          description: 'Different border styles for clickable surfaces',
          preview: (
            <HStack spacing="md" align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <Clickable padding="md" borderRadius="md" background="card" border="none">
                <Body>None</Body>
              </Clickable>

              <Clickable padding="md" borderRadius="md" background="card" border="base">
                <Body>Base</Body>
              </Clickable>

              <Clickable padding="md" borderRadius="md" background="card" border="strong">
                <Body>Strong</Body>
              </Clickable>

              <Clickable padding="md" borderRadius="md" background="card" border="subtle">
                <Body>Subtle</Body>
              </Clickable>
            </HStack>
          ),
          code: `import { Clickable, Body } from '../../../design/index';

export function ClickableBorderOptions() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Clickable padding="md" borderRadius="md" background="card" border="none">
        <Body>None</Body>
      </Clickable>

      <Clickable padding="md" borderRadius="md" background="card" border="base">
        <Body>Base</Body>
      </Clickable>

      <Clickable padding="md" borderRadius="md" background="card" border="strong">
        <Body>Strong</Body>
      </Clickable>

      <Clickable padding="md" borderRadius="md" background="card" border="subtle">
        <Body>Subtle</Body>
      </Clickable>
    </div>
  );
}`,
        },

        {
          title: 'Practical Examples',
          description: 'Common patterns using Clickable for cards and list items',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <Clickable onClick={() => alert('Card clicked!')}>
                <Box
                  style={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Box display="flex" justify="between" align="center">
                    <Box>
                      <Body weight="medium">Interactive Card</Body>
                      <Body size="sm" color="secondary">Click anywhere on this card</Body>
                    </Box>
                    <Icon size="sm">
                      <ArrowRightIcon />
                    </Icon>
                  </Box>
                </Box>
              </Clickable>

              <Clickable onClick={() => alert('List item clicked!')}>
                <Box
                  display="flex"
                  align="center"
                  gap="md"
                >
                  <Box
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--surface-secondary)',
                    }}
                  />

                  <Box style={{ flex: 1 }}>
                    <Body weight="medium">List Item</Body>
                    <Body size="sm" color="secondary">Description text</Body>
                  </Box>

                  <Icon size="sm">
                    <ArrowRightIcon />
                  </Icon>
                </Box>
              </Clickable>
            </VStack>
          ),
          code: `import { Clickable, Box, Body, Icon, VStack } from '../../../design/index';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export function PracticalClickableExamples() {
  return (
    <VStack spacing="md" align="stretch">
      <Clickable onClick={() => console.log('Card clicked!')}>
        <Box>
          <Box display="flex" justify="between" align="center">
            <Box>
              <Body weight="medium">Interactive Card</Body>
              <Body size="sm" color="secondary">Click anywhere on this card</Body>
            </Box>
            <Icon size="sm">
              <ArrowRightIcon />
            </Icon>
          </Box>
        </Box>
      </Clickable>

      <Clickable onClick={() => console.log('List item clicked!')}>
        <Box
          display="flex"
          align="center"
          gap="md"
        >
          <Box style={{ flex: 1 }}>
            <Body weight="medium">List Item</Body>
            <Body size="sm" color="secondary">Description text</Body>
          </Box>

          <Icon size="sm">
            <ArrowRightIcon />
          </Icon>
        </Box>
      </Clickable>
    </VStack>
  );
}`,
        },
      ]}
      properties={[
        { name: 'children', type: 'ReactNode', description: 'Clickable content' },
        { name: 'onClick', type: '() => void', description: 'Click handler for button-style usage' },
        { name: 'href', type: 'string', description: 'URL for link-style usage' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction' },
        { name: 'padding', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", description: 'Clickable area padding' },
        { name: 'borderRadius', type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'", description: 'Clickable surface radius' },
        { name: 'background', type: "'transparent' | 'subdued' | 'card' | 'hover' | 'selected'", description: 'Background style' },
        { name: 'border', type: "'none' | 'base' | 'strong' | 'subtle'", description: 'Border style' },
        { name: 'className', type: 'string', description: 'Optional class name for custom styling' },
        { name: 'style', type: 'React.CSSProperties', description: 'Optional inline styles' },
      ]}
    />
  );
}