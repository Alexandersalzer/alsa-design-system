"use client";

import React from 'react';
import { VStack, Box, Body } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function BodyTextPage() {
  return (
    <ComponentDocPage
      componentName="Body Text"
      description="Text for body content and paragraphs"
      importStatement={`import { Body } from '../../../design/index'`}
      sections={[
        {
          title: 'Sizes',
          preview: (
            <Box>
              <VStack spacing="md">
                <Box>
                  <Body size="xs">Extra small body text</Body>
                  <Body size="xs" color="secondary">size="xs"</Body>
                </Box>
                <Box>
                  <Body size="sm">Small body text</Body>
                  <Body size="xs" color="secondary">size="sm"</Body>
                </Box>
                <Box>
                  <Body size="md">Medium body text (default)</Body>
                  <Body size="xs" color="secondary">size="md"</Body>
                </Box>
                <Box>
                  <Body size="lg">Large body text</Body>
                  <Body size="xs" color="secondary">size="lg"</Body>
                </Box>
                <Box>
                  <Body size="xl">Extra large body text</Body>
                  <Body size="xs" color="secondary">size="xl"</Body>
                </Box>
              </VStack>
            </Box>
          ),
          code: `<Body size="xs">Extra small</Body>
<Body size="sm">Small</Body>
<Body size="md">Medium</Body>
<Body size="lg">Large</Body>
<Body size="xl">Extra large</Body>`,
        },
      ]}
    />
  );
}
