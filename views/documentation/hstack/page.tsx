"use client";

import React from 'react';
import { Box, Body, HStack, VStack } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function HStackPage() {
  return (
    <ComponentDocPage
      componentName="HStack"
      description="Horizontal stack layout component for arranging children in a row with consistent spacing"
      importStatement={`import { HStack } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          preview: (
            <HStack spacing="md">
              <Box padding="md" bg="base" radius="md"><Body>Item 1</Body></Box>
              <Box padding="md" bg="base" radius="md"><Body>Item 2</Body></Box>
              <Box padding="md" bg="base" radius="md"><Body>Item 3</Body></Box>
            </HStack>
          ),
          code: `import { HStack, Box, Body } from '../../../design/index';

export function BasicHStack() {
  return (
    <HStack spacing="md">
      <Box padding="md" bg="base" radius="md"><Body>Item 1</Body></Box>
      <Box padding="md" bg="base" radius="md"><Body>Item 2</Body></Box>
      <Box padding="md" bg="base" radius="md"><Body>Item 3</Body></Box>
    </HStack>
  );
}`,
        },
        {
          title: 'Spacing Variants',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="xs">
                <HStack spacing="sm">
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                </HStack>
                <Body size="xs" color="secondary">spacing="sm"</Body>
              </VStack>
              <VStack spacing="xs">
                <HStack spacing="md">
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                </HStack>
                <Body size="xs" color="secondary">spacing="md"</Body>
              </VStack>
              <VStack spacing="xs">
                <HStack spacing="lg">
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                  <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
                </HStack>
                <Body size="xs" color="secondary">spacing="lg"</Body>
              </VStack>
            </VStack>
          ),
          code: `import { HStack, Box, Body } from '../../../design/index';

export function HStackSpacing() {
  return (
    <>
      <HStack spacing="sm">
        <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
        <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
        <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
      </HStack>

      <HStack spacing="md">
        <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
        <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
        <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
      </HStack>

      <HStack spacing="lg">
        <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
        <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
        <Box padding="sm" bg="base" radius="sm"><Body size="xs">Item</Body></Box>
      </HStack>
    </>
  );
}`,
        },
      ]}
    />
  );
}
