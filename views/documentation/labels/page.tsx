"use client";

import React from 'react';
import { VStack, Box, Body, Label } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function LabelsPage() {
  return (
    <ComponentDocPage
      componentName="Labels"
      description="Small text for labels and metadata"
      importStatement={`import { Label } from '../../../design/index'`}
      sections={[
        {
          title: 'Sizes',
          preview: (
            <Box>
              <VStack spacing="md">
                <Box>
                  <Label size="xs">Extra small label</Label>
                  <Body size="xs" color="secondary">size="xs"</Body>
                </Box>
                <Box>
                  <Label size="sm">Small label</Label>
                  <Body size="xs" color="secondary">size="sm"</Body>
                </Box>
                <Box>
                  <Label size="md">Medium label</Label>
                  <Body size="xs" color="secondary">size="md"</Body>
                </Box>
                <Box>
                  <Label size="lg">Large label</Label>
                  <Body size="xs" color="secondary">size="lg"</Body>
                </Box>
              </VStack>
            </Box>
          ),
          code: `<Label size="xs">Extra small</Label>
<Label size="sm">Small</Label>
<Label size="md">Medium</Label>
<Label size="lg">Large</Label>`,
        },
      ]}
    />
  );
}
