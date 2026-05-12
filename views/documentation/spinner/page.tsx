"use client";

import React from 'react';
import { Box, Body, Spinner } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function SpinnerPage() {
  return (
    <ComponentDocPage
      componentName="Spinner"
      description="Animated loading indicator that shows an indeterminate loading state for asynchronous operations"
      importStatement={`import { Spinner } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple loading spinner',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Spinner />
            </Box>
          ),
          code: `<Spinner />`,
        },

        {
          title: 'Sizes',
          description: 'Available spinner sizes for different use cases',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-2 sm:grid-cols-4"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Spinner size="sm" />
                <Body size="xs" color="secondary">size="sm"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Spinner size="md" />
                <Body size="xs" color="secondary">size="md"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Spinner size="lg" />
                <Body size="xs" color="secondary">size="lg"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Spinner size="xl" />
                <Body size="xs" color="secondary">size="xl"</Body>
              </Box>
            </Box>
          ),
          code: `<Spinner size="sm" />

<Spinner size="md" />

<Spinner size="lg" />

<Spinner size="xl" />`        },

        {
          title: 'Variants',
          description: 'Different spinner color variants',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1 sm:grid-cols-3"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Spinner variant="accent" />
                <Body size="xs" color="secondary">variant="primary"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Spinner variant="secondary" />
                <Body size="xs" color="secondary">variant="secondary"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Spinner variant="accent" />
                <Body size="xs" color="secondary">variant="accent"</Body>
              </Box>
            </Box>
          ),
          code: `<Spinner variant="accent" />

<Spinner variant="secondary" />

<Spinner variant="accent" />`        },

        {
          title: 'Centered in Container',
          description: 'Center spinner within a container for full-page or section loading states',
          preview: (
            <Box
            >
              <Box
                display="flex"
                justify="center"
                align="center"
                style={{ minHeight: '200px' }}
              >
                <Spinner size="lg" />
              </Box>
            </Box>
          ),
          code: `<Box
  display="flex"
  justify="center"
  align="center"
  style={{ minHeight: '200px' }}
>
  <Spinner size="lg" />
</Box>`,
        },

        {
          title: 'With Label',
          description: 'Combine spinner with text for better context',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1"
            >
              <Box>
                <Box display="flex" direction="column" gap="md" align="center" justify="center" style={{ minHeight: '120px' }}>
                  <Spinner size="lg" />
                  <Body color="secondary">Loading...</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" gap="md" align="center" justify="center" style={{ minHeight: '80px' }}>
                  <Spinner size="md" />
                  <Body color="secondary">Processing your request</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" gap="sm" align="center" justify="center" style={{ minHeight: '60px' }}>
                  <Spinner size="sm" />
                  <Body size="sm" color="secondary">Uploading files...</Body>
                </Box>
              </Box>
            </Box>
          ),
          code: `<Box display="flex" direction="column" gap="md" align="center">
  <Spinner size="lg" />
  <Body color="secondary">Loading...</Body>
</Box>

<Box display="flex" gap="md" align="center">
  <Spinner size="md" />
  <Body color="secondary">Processing your request</Body>
</Box>

<Box display="flex" gap="sm" align="center">
  <Spinner size="sm" />
  <Body size="sm" color="secondary">Uploading files...</Body>
</Box>`        },

        {
          title: 'Practical Examples',
          description: 'Common spinner usage patterns',
          preview: (
            <Box display="flex" direction="column" gap="md">
              <Box>
                <Box display="flex" direction="column" gap="lg" align="center" justify="center" style={{ minHeight: '160px' }}>
                  <Spinner size="xl" variant="accent" />
                  <Box display="flex" direction="column" gap="xs" align="center">
                    <Body weight="medium">Loading Dashboard</Body>
                    <Body size="sm" color="secondary">Please wait while we fetch your data...</Body>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box display="flex" gap="md" align="center" justify="center" style={{ minHeight: '80px' }}>
                  <Spinner size="md" variant="accent" />
                  <Box display="flex" direction="column" gap="xs">
                    <Body weight="medium" size="sm">Saving changes</Body>
                    <Body size="xs" color="secondary">This may take a few seconds</Body>
                  </Box>
                </Box>
              </Box>
            </Box>
          ),
          code: `// Full page loading state
<Box display="flex" direction="column" gap="lg" align="center">
  <Spinner size="xl" variant="accent" />
  <Box display="flex" direction="column" gap="xs" align="center">
    <Body weight="medium">Loading Dashboard</Body>
    <Body size="sm" color="secondary">
      Please wait while we fetch your data...
    </Body>
  </Box>
</Box>

// Inline loading state
<Box display="flex" gap="md" align="center">
  <Spinner size="md" variant="accent" />
  <Box display="flex" direction="column" gap="xs">
    <Body weight="medium" size="sm">Saving changes</Body>
    <Body size="xs" color="secondary">
      This may take a few seconds
    </Body>
  </Box>
</Box>`        },
      ]}
    >
      <Box display="flex" direction="column" gap="md">
        <Box>
          <Body color="secondary" size="md">
            <strong>Best Practices:</strong> Use spinners to indicate loading states for asynchronous operations.
            Choose appropriate sizes based on the context - larger spinners for full-page loading, smaller ones
            for inline or button loading states.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Accessibility:</strong> Always provide appropriate loading text for screen readers when using
            spinners. Consider using aria-label or aria-describedby attributes to communicate the loading state.
          </Body>
        </Box>
      </Box>
    </ComponentDocPage>
  );
}
