"use client";

import React from 'react';
import { Box, Body, VStack } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function VStackPage() {
  return (
    <ComponentDocPage
      componentName="VStack"
      description="Vertical stack layout component for arranging children in a column with consistent spacing"
      importStatement={`import { VStack } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          preview: (
            <Box>
              <VStack spacing="md">
                <Box padding="md" bg="base" radius="md"><Body>Item 1</Body></Box>
                <Box padding="md" bg="base" radius="md"><Body>Item 2</Body></Box>
                <Box padding="md" bg="base" radius="md"><Body>Item 3</Body></Box>
              </VStack>
            </Box>
          ),
          code: `<VStack spacing="md">
  <Box>Item 1</Box>
  <Box>Item 2</Box>
  <Box>Item 3</Box>
</VStack>`,
        },
        {
          title: 'Spacing Variants',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-3">
              <Box>
                <VStack spacing="sm">
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                </VStack>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>spacing="sm"</Body>
              </Box>
              <Box>
                <VStack spacing="md">
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                </VStack>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>spacing="md"</Body>
              </Box>
              <Box>
                <VStack spacing="lg">
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                </VStack>
                <Body size="xs" color="secondary" style={{ marginTop: '8px' }}>spacing="lg"</Body>
              </Box>
            </Box>
          ),
          code: `<VStack spacing="sm">...</VStack>

<VStack spacing="md">...</VStack>

<VStack spacing="lg">...</VStack>`,
        },
      ]}
    />
  );
}
