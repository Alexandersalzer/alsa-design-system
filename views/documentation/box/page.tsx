"use client";

import React from 'react';
import { Box, Body, VStack, HStack } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function BoxPage() {
  return (
    <ComponentDocPage
      componentName="Box"
      description="Versatile layout primitive for building layouts with spacing, borders, backgrounds, radius, flexbox, and grid properties"
      importStatement={`import { Box } from '../../../design/index';`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'The Box component is the most fundamental layout primitive',
          preview: (
            <Box padding="md" bg="base" radius="md">
              <Body>Simple box with padding and background</Body>
            </Box>
          ),
          code: `import { Box, Body } from '../../../design/index';

export function BasicBox() {
  return (
    <Box padding="md" bg="base" radius="md">
      <Body>Simple box with padding and background</Body>
    </Box>
  );
}`,
        },

        {
          title: 'Padding Variants',
          description: 'Control internal spacing with different padding sizes',
          preview: (
            <HStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box padding="sm" bg="base" radius="md">
                  <Body size="sm">Small</Body>
                </Box>
                <Body size="xs" color="secondary">padding="sm"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box padding="md" bg="base" radius="md">
                  <Body size="sm">Medium</Body>
                </Box>
                <Body size="xs" color="secondary">padding="md"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box padding="lg" bg="base" radius="md">
                  <Body size="sm">Large</Body>
                </Box>
                <Body size="xs" color="secondary">padding="lg"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box padding="xl" bg="base" radius="md">
                  <Body size="sm">XL</Body>
                </Box>
                <Body size="xs" color="secondary">padding="xl"</Body>
              </VStack>
            </HStack>
          ),
          code: `import { Box, Body } from '../../../design/index';

export function BoxPaddingVariants() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Box padding="sm" bg="base" radius="md">
        <Body size="sm">Small</Body>
      </Box>

      <Box padding="md" bg="base" radius="md">
        <Body size="sm">Medium</Body>
      </Box>

      <Box padding="lg" bg="base" radius="md">
        <Body size="sm">Large</Body>
      </Box>

      <Box padding="xl" bg="base" radius="md">
        <Body size="sm">XL</Body>
      </Box>
    </div>
  );
}`,
        },

        {
          title: 'Border Variants',
          description: 'Add borders to create visual separation',
          preview: (
            <HStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box padding="md" border="light" radius="md" bg="base">
                  <Body size="sm">Light Border</Body>
                </Box>
                <Body size="xs" color="secondary">border="light"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box padding="md" border="default" radius="md" bg="base">
                  <Body size="sm">Default Border</Body>
                </Box>
                <Body size="xs" color="secondary">border="default"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box padding="md" border="heavy" radius="md" bg="base">
                  <Body size="sm">Strong Border</Body>
                </Box>
                <Body size="xs" color="secondary">border="heavy"</Body>
              </VStack>
            </HStack>
          ),
          code: `import { Box, Body } from '../../../design/index';

export function BoxBorderVariants() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Box padding="md" border="light" radius="md" bg="base">
        <Body size="sm">Light Border</Body>
      </Box>

      <Box padding="md" border="default" radius="md" bg="base">
        <Body size="sm">Default Border</Body>
      </Box>

      <Box padding="md" border="strong" radius="md" bg="base">
        <Body size="sm">Strong Border</Body>
      </Box>
    </div>
  );
}`,
        },

        {
          title: 'Border Radius',
          description: 'Round the corners of boxes for different visual effects',
          preview: (
            <HStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box padding="md" bg="base" radius="sm" border="default">
                  <Body size="sm">Small</Body>
                </Box>
                <Body size="xs" color="secondary">radius="sm"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box padding="md" bg="base" radius="md" border="default">
                  <Body size="sm">Medium</Body>
                </Box>
                <Body size="xs" color="secondary">radius="md"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box padding="md" bg="base" radius="lg" border="default">
                  <Body size="sm">Large</Body>
                </Box>
                <Body size="xs" color="secondary">radius="lg"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box padding="md" bg="base" radius="xl" border="default">
                  <Body size="sm">XL</Body>
                </Box>
                <Body size="xs" color="secondary">radius="xl"</Body>
              </VStack>
            </HStack>
          ),
          code: `import { Box, Body } from '../../../design/index';

export function BoxRadiusVariants() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Box padding="md" bg="base" radius="sm" border="default">
        <Body size="sm">Small</Body>
      </Box>

      <Box padding="md" bg="base" radius="md" border="default">
        <Body size="sm">Medium</Body>
      </Box>

      <Box padding="md" bg="base" radius="lg" border="default">
        <Body size="sm">Large</Body>
      </Box>

      <Box padding="md" bg="base" radius="xl" border="default">
        <Body size="sm">XL</Body>
      </Box>
    </div>
  );
}`,
        },

        {
          title: 'Background Colors',
          description: 'Use semantic background colors from the design system',
          preview: (
            <HStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box padding="md" bg="base" radius="md" border="default">
                  <Body size="sm">Base</Body>
                </Box>
                <Body size="xs" color="secondary">bg="base"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box>
                  <Body size="sm">Card</Body>
                </Box>
                <Body size="xs" color="secondary">bg="card"</Body>
              </VStack>
            </HStack>
          ),
          code: `import { Box, Body } from '../../../design/index';

export function BoxBackgrounds() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Box padding="md" bg="base" radius="md" border="default">
        <Body size="sm">Base</Body>
      </Box>

      <Box>
        <Body size="sm">Card</Body>
      </Box>
    </div>
  );
}`,
        },

        {
          title: 'Flexbox Layout',
          description: 'Use Box with display="flex" for flexible layouts',
          preview: (
            <Box
              display="flex"
              gap="md"
              align="center"
              justify="between"
              padding="md"
              bg="base"
              radius="md"
              border="default"
              style={{ width: '100%' }}
            >
              <Body size="sm">Left content</Body>
              <Body size="sm" weight="semibold">Center</Body>
              <Body size="sm">Right content</Body>
            </Box>
          ),
          code: `import { Box, Body } from '../../../design/index';

export function BoxFlexLayout() {
  return (
    <Box
      display="flex"
      gap="md"
      align="center"
      justify="between"
      padding="md"
      bg="base"
      radius="md"
      border="default"
    >
      <Body size="sm">Left content</Body>
      <Body size="sm" weight="semibold">Center</Body>
      <Body size="sm">Right content</Body>
    </Box>
  );
}`,
        },

        {
          title: 'Flex Direction',
          description: 'Control the direction of flex items',
          preview: (
            <HStack spacing="lg" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box display="flex" direction="row" gap="sm" padding="md" bg="base" radius="md">
                  <Box><Body size="xs">1</Body></Box>
                  <Box><Body size="xs">2</Body></Box>
                  <Box><Body size="xs">3</Body></Box>
                </Box>
                <Body size="xs" color="secondary">direction="row"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                <Box display="flex" direction="column" gap="sm" padding="md" bg="base" radius="md">
                  <Box><Body size="xs">1</Body></Box>
                  <Box><Body size="xs">2</Body></Box>
                  <Box><Body size="xs">3</Body></Box>
                </Box>
                <Body size="xs" color="secondary">direction="column"</Body>
              </VStack>
            </HStack>
          ),
          code: `import { Box, Body } from '../../../design/index';

export function BoxFlexDirection() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Box display="flex" direction="row" gap="sm" padding="md" bg="base" radius="md">
        <Box><Body size="xs">1</Body></Box>
        <Box><Body size="xs">2</Body></Box>
        <Box><Body size="xs">3</Body></Box>
      </Box>

      <Box display="flex" direction="column" gap="sm" padding="md" bg="base" radius="md">
        <Box><Body size="xs">1</Body></Box>
        <Box><Body size="xs">2</Body></Box>
        <Box><Body size="xs">3</Body></Box>
      </Box>
    </div>
  );
}`,
        },

        {
          title: 'Combined Properties',
          description: 'Combine multiple properties to create rich layouts',
          preview: (
            <Box
              padding="lg"
              border="default"
              radius="lg"
              bg="base"
              display="flex"
              direction="column"
              gap="md"
              style={{ width: '100%', maxWidth: 520 }}
            >
              <Body weight="semibold">Card Title</Body>
              <Body size="sm" color="secondary">
                This card combines padding, border, radius, background, and flex layout properties.
              </Body>
              <Box display="flex" gap="sm" justify="end">
                <Body size="sm" weight="semibold" style={{ color: 'var(--color-primary)' }}>
                  Action
                </Body>
              </Box>
            </Box>
          ),
          code: `import { Box, Body } from '../../../design/index';

export function CombinedBoxProperties() {
  return (
    <Box
      padding="lg"
      border="default"
      radius="lg"
      bg="base"
      display="flex"
      direction="column"
      gap="md"
    >
      <Body weight="semibold">Card Title</Body>

      <Body size="sm" color="secondary">
        This card combines padding, border, radius, background, and flex layout properties.
      </Body>

      <Box display="flex" gap="sm" justify="end">
        <Body size="sm" weight="semibold" style={{ color: 'var(--color-primary)' }}>
          Action
        </Body>
      </Box>
    </Box>
  );
}`,
        },
      ]}
      properties={[
        { name: 'padding', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", description: 'Internal spacing' },
        { name: 'border', type: "'none' | 'light' | 'default' | 'strong'", description: 'Border style' },
        { name: 'radius', type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'", description: 'Border radius' },
        { name: 'bg', type: "'base' | 'card' | string", description: 'Semantic background color' },
        { name: 'display', type: "'block' | 'flex' | 'grid' | 'inline-flex'", description: 'CSS display mode' },
        { name: 'direction', type: "'row' | 'column'", description: 'Flex direction' },
        { name: 'gap', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'", description: 'Gap between children' },
        { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", description: 'Cross-axis alignment' },
        { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", description: 'Main-axis alignment' },
        { name: 'className', type: 'string', description: 'Optional class name for custom styling' },
        { name: 'style', type: 'React.CSSProperties', description: 'Optional inline styles' },
        { name: 'children', type: 'ReactNode', description: 'Box content' },
      ]}
    />
  );
}