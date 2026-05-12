"use client";

import React from 'react';
import { Box, Body, Container, VStack } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function ContainerPage() {
  return (
    <ComponentDocPage
      componentName="Container"
      description="Layout component for centering content and constraining page width with responsive breakpoints"
      importStatement={`import { Container } from '../../../design/index';`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Centered content with a max-width constraint',
          preview: (
            <Container>
              <Box padding="md" bg="base" radius="md">
                <Body>This content is centered and has a max-width constraint</Body>
              </Box>
            </Container>
          ),
          code: `import { Container, Box, Body } from '../../../design/index';

export function BasicContainer() {
  return (
    <Container>
      <Box padding="md" bg="base" radius="md">
        <Body>Centered content with max-width</Body>
      </Box>
    </Container>
  );
}`,
        },
      ]}
      properties={[
        { name: 'children', type: 'ReactNode', description: 'Content inside the container' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'lg'", description: 'Maximum container width' },
        { name: 'className', type: 'string', description: 'Optional class name for custom styling' },
        { name: 'style', type: 'React.CSSProperties', description: 'Optional inline styles' },
      ]}
    />
  );
}