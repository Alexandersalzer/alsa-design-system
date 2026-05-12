"use client";

import React from 'react';
import { Box, Body, VStack, Divider } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function DividerPage() {
  return (
    <ComponentDocPage
      componentName="Divider"
      description="A horizontal line that visually separates content sections with configurable spacing and weight"
      importStatement={`import { Divider } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'A simple divider to separate content',
          preview: (
            <Box>
              <VStack spacing="sm">
                <Box padding="md">
                  <Body>Content above divider</Body>
                </Box>
                <Divider />
                <Box padding="md">
                  <Body>Content below divider</Body>
                </Box>
              </VStack>
            </Box>
          ),
          code: `<VStack spacing="xs">
  <Box padding="md">
    <Body>Content above divider</Body>
  </Box>
  <Divider />
  <Box padding="md">
    <Body>Content below divider</Body>
  </Box>
</VStack>`,
        },
        {
          title: 'Spacing Variants',
          description: 'Control vertical spacing around the divider',
          preview: (
            <Box display="grid" gap="lg" className="grid-cols-1">
              <Box>
                <VStack spacing="xs">
                  <Body size="sm">Content above</Body>
                  <Divider spacing="sm" />
                  <Body size="sm">Content below</Body>
                </VStack>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>
                  spacing="sm"
                </Body>
              </Box>
              <Box>
                <VStack spacing="xs">
                  <Body size="sm">Content above</Body>
                  <Divider spacing="md" />
                  <Body size="sm">Content below</Body>
                </VStack>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>
                  spacing="md"
                </Body>
              </Box>
              <Box>
                <VStack spacing="xs">
                  <Body size="sm">Content above</Body>
                  <Divider spacing="lg" />
                  <Body size="sm">Content below</Body>
                </VStack>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>
                  spacing="lg"
                </Body>
              </Box>
              <Box>
                <VStack spacing="xs">
                  <Body size="sm">Content above</Body>
                  <Divider spacing="lg" />
                  <Body size="sm">Content below</Body>
                </VStack>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>
                  spacing="lg"
                </Body>
              </Box>
            </Box>
          ),
          code: `
            <Divider spacing="sm" />
            <Divider spacing="md" />
            <Divider spacing="lg" />
            <Divider spacing="lg" />`
          
        },
        {
          title: 'Weight Variants',
          description: 'Adjust the visual thickness and opacity of the divider',
          preview: (
            <Box display="grid" gap="lg" className="grid-cols-1 sm:grid-cols-3">
              <Box>
                <VStack spacing="xs">
                  <Body size="sm">Content above</Body>
                  <Divider spacing="md" weight="default" />
                  <Body size="sm">Content below</Body>
                </VStack>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>
                  weight="default"
                </Body>
              </Box>
              <Box>
                <VStack spacing="xs">
                  <Body size="sm">Content above</Body>
                  <Divider spacing="md" weight="default" />
                  <Body size="sm">Content below</Body>
                </VStack>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>
                  weight="default"
                </Body>
              </Box>
              <Box>
                <VStack spacing="xs">
                  <Body size="sm">Content above</Body>
                  <Divider spacing="md" weight="strong" />
                  <Body size="sm">Content below</Body>
                </VStack>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>
                  weight="strong"
                </Body>
              </Box>
            </Box>
          ),
          code: 
            `<Divider weight="default" />
            <Divider weight="default" />
            <Divider weight="strong" />`
          ,
        },
        {
          title: 'Combined Properties',
          description: 'Combine spacing and weight for precise control',
          preview: (
            <Box>
              <VStack spacing="xs">
                <Body weight="semibold">Section 1</Body>
                <Body size="sm" color="secondary" style={{ marginTop: '4px' }}>
                  First section with important content
                </Body>
                <Divider spacing="lg" weight="strong" />
                <Body weight="semibold">Section 2</Body>
                <Body size="sm" color="secondary" style={{ marginTop: '4px' }}>
                  Second section clearly separated
                </Body>
                <Divider spacing="sm" weight="default" />
                <Body size="sm" color="secondary">
                  Related subsection with subtle separation
                </Body>
              </VStack>
            </Box>
          ),
          code: `<VStack spacing="xs">
  <Body weight="semibold">Section 1</Body>
  <Body size="sm" color="secondary">First section content</Body>

  <Divider spacing="lg" weight="strong" />

  <Body weight="semibold">Section 2</Body>
  <Body size="sm" color="secondary">Second section content</Body>

  <Divider spacing="sm" weight="default" />

  <Body size="sm" color="secondary">Related subsection</Body>
</VStack>`,
        },
        {
          title: 'In Documentation Layout',
          description: 'Common pattern for organizing documentation sections',
          preview: (
            <Box>
              <VStack spacing="md">
                <Box>
                  <Body weight="semibold" size="lg">Component API</Body>
                  <Body size="sm" color="secondary" style={{ marginTop: '4px' }}>
                    Overview of component properties and usage
                  </Body>
                </Box>

                <Divider spacing="lg" />

                <Box>
                  <Body weight="semibold">Props</Body>
                  <Body size="sm" color="secondary" style={{ marginTop: '4px' }}>
                    spacing: "sm" | "md" | "lg" | "xl"
                  </Body>
                  <Body size="sm" color="secondary">
                    weight: "light" | "default" | "strong"
                  </Body>
                </Box>

                <Divider spacing="md" />

                <Box>
                  <Body weight="semibold">Examples</Body>
                  <Body size="sm" color="secondary" style={{ marginTop: '4px' }}>
                    Common usage patterns and best practices
                  </Body>
                </Box>
              </VStack>
            </Box>
          ),
          code: `<VStack spacing="md">
  <Box>
    <Body weight="semibold" size="lg">Component API</Body>
    <Body size="sm" color="secondary">Overview of properties</Body>
  </Box>

  <Divider spacing="lg" />

  <Box>
    <Body weight="semibold">Props</Body>
    <Body size="sm" color="secondary">Property details...</Body>
  </Box>

  <Divider spacing="md" />

  <Box>
    <Body weight="semibold">Examples</Body>
    <Body size="sm" color="secondary">Usage patterns...</Body>
  </Box>
</VStack>`,
        },
        {
          title: 'In Card Layouts',
          description: 'Use dividers to organize content within cards',
          preview: (
            <Box>
              <Box border="default" radius="md" bg="base">
                <Box padding="md">
                  <Body weight="semibold">Card Header</Body>
                  <Body size="sm" color="secondary">Header content and title</Body>
                </Box>

                <Divider />

                <Box padding="md">
                  <Body size="sm">Main card content goes here with details and information.</Body>
                </Box>

                <Divider />

                <Box padding="md">
                  <Body size="xs" color="secondary">Footer information</Body>
                </Box>
              </Box>
            </Box>
          ),
          code: `<Box border="default" radius="md" bg="surface">
  <Box padding="md">
    <Body weight="semibold">Card Header</Body>
    <Body size="sm" color="secondary">Header content</Body>
  </Box>

  <Divider />

  <Box padding="md">
    <Body size="sm">Main card content...</Body>
  </Box>

  <Divider />

  <Box padding="md">
    <Body size="xs" color="secondary">Footer information</Body>
  </Box>
</Box>`,
        },
        {
          title: 'Subsection Separators',
          description: 'Create visual hierarchy with different divider styles',
          preview: (
            <Box>
              <VStack spacing="xs">
                <Body weight="semibold">Main Section</Body>
                <Divider spacing="md" weight="strong" />

                <Box padding="sm">
                  <Body size="sm" weight="semibold">Subsection A</Body>
                  <Body size="sm" color="secondary">Content for subsection A</Body>
                </Box>

                <Divider spacing="sm" weight="default" />

                <Box padding="sm">
                  <Body size="sm" weight="semibold">Subsection B</Body>
                  <Body size="sm" color="secondary">Content for subsection B</Body>
                </Box>

                <Divider spacing="sm" weight="default" />

                <Box padding="sm">
                  <Body size="sm" weight="semibold">Subsection C</Body>
                  <Body size="sm" color="secondary">Content for subsection C</Body>
                </Box>
              </VStack>
            </Box>
          ),
          code: `<VStack spacing="xs">
  <Body weight="semibold">Main Section</Body>
  <Divider spacing="md" weight="strong" />

  <Box padding="sm">
    <Body size="sm" weight="semibold">Subsection A</Body>
    <Body size="sm" color="secondary">Content A</Body>
  </Box>

  <Divider spacing="sm" weight="default" />

  <Box padding="sm">
    <Body size="sm" weight="semibold">Subsection B</Body>
    <Body size="sm" color="secondary">Content B</Body>
  </Box>

  <Divider spacing="sm" weight="default" />

  <Box padding="sm">
    <Body size="sm" weight="semibold">Subsection C</Body>
    <Body size="sm" color="secondary">Content C</Body>
  </Box>
</VStack>`,
        },
      ]}
    />
  );
}
