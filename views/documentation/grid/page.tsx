"use client";

import React from 'react';
import { Box, Body } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function GridPage() {
  return (
    <ComponentDocPage
      componentName="Grid"
      description="Layout component for creating responsive grid layouts using CSS Grid with flexible column configurations"
      importStatement={`import { Box } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Grid Layout',
          description: 'Use display="grid" with gap to create a basic grid layout',
          preview: (
            <Box>
              <Box display="grid" gap="md" className="grid-cols-3">
                <Box padding="md" bg="base" radius="md"><Body align="center">1</Body></Box>
                <Box padding="md" bg="base" radius="md"><Body align="center">2</Body></Box>
                <Box padding="md" bg="base" radius="md"><Body align="center">3</Body></Box>
                <Box padding="md" bg="base" radius="md"><Body align="center">4</Body></Box>
                <Box padding="md" bg="base" radius="md"><Body align="center">5</Body></Box>
                <Box padding="md" bg="base" radius="md"><Body align="center">6</Body></Box>
              </Box>
            </Box>
          ),
          code: `<Box display="grid" gap="md" className="grid-cols-3">
  <Box>1</Box>
  <Box>2</Box>
  <Box>3</Box>
  <Box>4</Box>
  <Box>5</Box>
  <Box>6</Box>
</Box>`,
        },
        {
          title: 'Responsive Grid',
          description: 'Grids can adapt to different screen sizes using responsive Tailwind classes',
          preview: (
            <Box>
              <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Box padding="md" bg="base" radius="md"><Body size="sm" align="center">Item 1</Body></Box>
                <Box padding="md" bg="base" radius="md"><Body size="sm" align="center">Item 2</Body></Box>
                <Box padding="md" bg="base" radius="md"><Body size="sm" align="center">Item 3</Body></Box>
                <Box padding="md" bg="base" radius="md"><Body size="sm" align="center">Item 4</Body></Box>
              </Box>
              <Body size="xs" color="secondary" style={{ marginTop: '12px' }}>
                1 column on mobile, 2 on tablet, 4 on desktop
              </Body>
            </Box>
          ),
          code: `<Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  <Box>Item 1</Box>
  <Box>Item 2</Box>
  <Box>Item 3</Box>
  <Box>Item 4</Box>
</Box>`,
        },
        {
          title: 'Gap Variations',
          description: 'Control spacing between grid items with different gap sizes',
          preview: (
            <Box display="grid" gap="lg" className="grid-cols-1 sm:grid-cols-3">
              <Box>
                <Box display="grid" gap="sm" className="grid-cols-2">
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs" align="center">1</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs" align="center">2</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs" align="center">3</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs" align="center">4</Body></Box>
                </Box>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>gap="sm"</Body>
              </Box>
              <Box>
                <Box display="grid" gap="md" className="grid-cols-2">
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs" align="center">1</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs" align="center">2</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs" align="center">3</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs" align="center">4</Body></Box>
                </Box>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>gap="md"</Body>
              </Box>
              <Box>
                <Box display="grid" gap="lg" className="grid-cols-2">
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs" align="center">1</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs" align="center">2</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs" align="center">3</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs" align="center">4</Body></Box>
                </Box>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>gap="lg"</Body>
              </Box>
            </Box>
          ),
          code: `
            <Box display="grid" gap="sm">...</Box>
            <Box display="grid" gap="md">...</Box>
            <Box display="grid" gap="lg">...</Box>
         `
        },
        {
          title: 'Column Configurations',
          description: 'Common grid column patterns for different layouts',
          preview: (
            <Box display="grid" gap="lg" className="grid-cols-1">
              <Box>
                <Box display="grid" gap="md" className="grid-cols-2">
                  <Box padding="md" bg="base" radius="md"><Body size="sm" align="center">50%</Body></Box>
                  <Box padding="md" bg="base" radius="md"><Body size="sm" align="center">50%</Body></Box>
                </Box>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>grid-cols-2 (2 equal columns)</Body>
              </Box>
              <Box>
                <Box display="grid" gap="md" className="grid-cols-3">
                  <Box padding="md" bg="base" radius="md"><Body size="sm" align="center">33%</Body></Box>
                  <Box padding="md" bg="base" radius="md"><Body size="sm" align="center">33%</Body></Box>
                  <Box padding="md" bg="base" radius="md"><Body size="sm" align="center">33%</Body></Box>
                </Box>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>grid-cols-3 (3 equal columns)</Body>
              </Box>
              <Box>
                <Box display="grid" gap="md" className="grid-cols-4">
                  <Box padding="md" bg="base" radius="md"><Body size="sm" align="center">25%</Body></Box>
                  <Box padding="md" bg="base" radius="md"><Body size="sm" align="center">25%</Body></Box>
                  <Box padding="md" bg="base" radius="md"><Body size="sm" align="center">25%</Body></Box>
                  <Box padding="md" bg="base" radius="md"><Body size="sm" align="center">25%</Body></Box>
                </Box>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>grid-cols-4 (4 equal columns)</Body>
              </Box>
            </Box>
          ),
          code: `
            <Box display="grid" className="grid-cols-2">...</Box>
            <Box display="grid" className="grid-cols-3">...</Box>
            <Box display="grid" className="grid-cols-4">...</Box>
         `
        },
        {
          title: 'Practical Example',
          description: 'A card grid layout commonly used for displaying content',
          preview: (
            <Box>
              <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Box padding="lg" border="default" radius="md" bg="base">
                  <Body weight="semibold">Card 1</Body>
                  <Body size="sm" color="secondary" style={{ marginTop: '4px' }}>
                    Example content for the first card
                  </Body>
                </Box>
                <Box padding="lg" border="default" radius="md" bg="base">
                  <Body weight="semibold">Card 2</Body>
                  <Body size="sm" color="secondary" style={{ marginTop: '4px' }}>
                    Example content for the second card
                  </Body>
                </Box>
                <Box padding="lg" border="default" radius="md" bg="base">
                  <Body weight="semibold">Card 3</Body>
                  <Body size="sm" color="secondary" style={{ marginTop: '4px' }}>
                    Example content for the third card
                  </Body>
                </Box>
              </Box>
            </Box>
          ),
          code: `<Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  <Box padding="lg" border="default" radius="md" bg="surface">
    <Body weight="semibold">Card 1</Body>
    <Body size="sm" color="secondary">Example content</Body>
  </Box>
  <Box padding="lg" border="default" radius="md" bg="surface">
    <Body weight="semibold">Card 2</Body>
    <Body size="sm" color="secondary">Example content</Body>
  </Box>
  <Box padding="lg" border="default" radius="md" bg="surface">
    <Body weight="semibold">Card 3</Body>
    <Body size="sm" color="secondary">Example content</Body>
  </Box>
</Box>`,
        },
      ]}
    />
  );
}
