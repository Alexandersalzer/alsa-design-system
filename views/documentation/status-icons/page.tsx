"use client";

import React from 'react';
import { Box, Body, StatusIcons } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function StatusIconsPage() {
  return (
    <ComponentDocPage
      componentName="StatusIcons"
      description="Visual status indicator component with predefined variants for success, error, warning, and info states"
      importStatement={`import { StatusIcons } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple status icon with default success variant',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <StatusIcons.Success />
            </Box>
          ),
          code: `<StatusIcons.Success />`,
        },

        {
          title: 'Variants',
          description: 'Different status variants for various states',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-2 sm:grid-cols-5"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <StatusIcons.Success />
                <Body size="xs" color="secondary">success</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <StatusIcons.Error />
                <Body size="xs" color="secondary">error</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <StatusIcons.Warning />
                <Body size="xs" color="secondary">warning</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <StatusIcons.Info />
                <Body size="xs" color="secondary">info</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <StatusIcons.Success />
                <Body size="xs" color="secondary">pending</Body>
              </Box>
            </Box>
          ),
          code: `<StatusIcons.Success />

<StatusIcons.Error />

<StatusIcons.Warning />

<StatusIcons.Info />`        },

        {
          title: 'Sizes',
          description: 'Different sizes for various contexts',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-2 sm:grid-cols-4"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <StatusIcons.Success size="sm" />
                <Body size="xs" color="secondary">size="sm"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <StatusIcons.Success size="md" />
                <Body size="xs" color="secondary">size="md"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <StatusIcons.Success size="lg" />
                <Body size="xs" color="secondary">size="lg"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <StatusIcons.Success size="xl" />
                <Body size="xs" color="secondary">size="xl"</Body>
              </Box>
            </Box>
          ),
          code: `<StatusIcons.Success size="sm" />

<StatusIcons.Success size="md" />

<StatusIcons.Success size="lg" />

<StatusIcons.Success size="xl" />`        },

        {
          title: 'With Labels',
          description: 'Combine status icons with descriptive text',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1 sm:grid-cols-2"
            >
              <Box display="flex" direction="column" gap="md">
                <Box display="flex" gap="sm" align="center">
                  <StatusIcons.Success />
                  <Body>Operation completed successfully</Body>
                </Box>
                <Box display="flex" gap="sm" align="center">
                  <StatusIcons.Error />
                  <Body>Failed to process request</Body>
                </Box>
                <Box display="flex" gap="sm" align="center">
                  <StatusIcons.Warning />
                  <Body>Please review your settings</Body>
                </Box>
              </Box>
              <Box display="flex" direction="column" gap="md">
                <Box display="flex" gap="sm" align="center">
                  <StatusIcons.Info />
                  <Body>New updates available</Body>
                </Box>
                <Box display="flex" gap="sm" align="center">
                  <StatusIcons.Success />
                  <Body>Processing your request...</Body>
                </Box>
              </Box>
            </Box>
          ),
          code: `<Box display="flex" gap="sm" align="center">
  <StatusIcons.Success />
  <Body>Operation completed successfully</Body>
</Box>

<Box display="flex" gap="sm" align="center">
  <StatusIcons.Error />
  <Body>Failed to process request</Body>
</Box>

<Box display="flex" gap="sm" align="center">
  <StatusIcons.Warning />
  <Body>Please review your settings</Body>
</Box>

<Box display="flex" gap="sm" align="center">
  <StatusIcons.Info />
  <Body>New updates available</Body>
</Box>`        },

        {
          title: 'Animated Pending',
          description: 'Animated pending state for loading operations',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1 sm:grid-cols-2"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <StatusIcons.Success size="lg" animated />
                <Body size="xs" color="secondary">Animated</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <StatusIcons.Success size="lg" />
                <Body size="xs" color="secondary">Static</Body>
              </Box>
            </Box>
          ),
          code: `<StatusIcons.Success animated />

<StatusIcons.Success />`        },

        {
          title: 'Status Lists',
          description: 'Display multiple status items in a list',
          preview: (
            <Box
            >
              <Box display="flex" direction="column" gap="md">
                <Body weight="medium">System Status</Body>
                <Box display="flex" direction="column" gap="sm">
                  <Box display="flex" justify="between" align="center">
                    <Body size="sm">Database Connection</Body>
                    <Box display="flex" gap="xs" align="center">
                      <StatusIcons.Success size="sm" />
                      <Body size="sm" color="secondary">Healthy</Body>
                    </Box>
                  </Box>
                  <Box display="flex" justify="between" align="center">
                    <Body size="sm">API Server</Body>
                    <Box display="flex" gap="xs" align="center">
                      <StatusIcons.Success size="sm" />
                      <Body size="sm" color="secondary">Running</Body>
                    </Box>
                  </Box>
                  <Box display="flex" justify="between" align="center">
                    <Body size="sm">Background Jobs</Body>
                    <Box display="flex" gap="xs" align="center">
                      <StatusIcons.Warning size="sm" />
                      <Body size="sm" color="secondary">Degraded</Body>
                    </Box>
                  </Box>
                  <Box display="flex" justify="between" align="center">
                    <Body size="sm">Cache Server</Body>
                    <Box display="flex" gap="xs" align="center">
                      <StatusIcons.Error size="sm" />
                      <Body size="sm" color="secondary">Down</Body>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ),
          code: `<Box display="flex" direction="column" gap="sm">
  <Box display="flex" justify="between" align="center">
    <Body size="sm">Database Connection</Body>
    <Box display="flex" gap="xs" align="center">
      <StatusIcons.Success size="sm" />
      <Body size="sm">Healthy</Body>
    </Box>
  </Box>
  <Box display="flex" justify="between" align="center">
    <Body size="sm">API Server</Body>
    <Box display="flex" gap="xs" align="center">
      <StatusIcons.Success size="sm" />
      <Body size="sm">Running</Body>
    </Box>
  </Box>
  <Box display="flex" justify="between" align="center">
    <Body size="sm">Background Jobs</Body>
    <Box display="flex" gap="xs" align="center">
      <StatusIcons.Warning size="sm" />
      <Body size="sm">Degraded</Body>
    </Box>
  </Box>
</Box>`,
        },

        {
          title: 'Practical Examples',
          description: 'Real-world status icon usage patterns',
          preview: (
            <Box display="flex" direction="column" gap="md">
              {/* Notification Card */}
              <Box>
                <Box display="flex" gap="md" align="start">
                  <StatusIcons.Success size="lg" />
                  <Box display="flex" direction="column" gap="xs" style={{ flex: 1 }}>
                    <Body weight="bold">Payment Successful</Body>
                    <Body size="sm" color="secondary">
                      Your payment of $99.99 has been processed successfully.
                    </Body>
                  </Box>
                </Box>
              </Box>

              {/* Error Message */}
              <Box>
                <Box display="flex" gap="md" align="start">
                  <StatusIcons.Error size="lg" />
                  <Box display="flex" direction="column" gap="xs" style={{ flex: 1 }}>
                    <Body weight="bold">Upload Failed</Body>
                    <Body size="sm" color="secondary">
                      Unable to upload file. Please check your connection and try again.
                    </Body>
                  </Box>
                </Box>
              </Box>

              {/* Warning Alert */}
              <Box>
                <Box display="flex" gap="md" align="start">
                  <StatusIcons.Warning size="lg" />
                  <Box display="flex" direction="column" gap="xs" style={{ flex: 1 }}>
                    <Body weight="bold">Storage Almost Full</Body>
                    <Body size="sm" color="secondary">
                      You have used 95% of your storage. Consider upgrading your plan.
                    </Body>
                  </Box>
                </Box>
              </Box>

              {/* Info Banner */}
              <Box>
                <Box display="flex" gap="md" align="start">
                  <StatusIcons.Info size="lg" />
                  <Box display="flex" direction="column" gap="xs" style={{ flex: 1 }}>
                    <Body weight="bold">New Feature Available</Body>
                    <Body size="sm" color="secondary">
                      Check out our new dashboard analytics feature!
                    </Body>
                  </Box>
                </Box>
              </Box>

              {/* Processing State */}
              <Box>
                <Box display="flex" gap="md" align="start">
                  <StatusIcons.Success size="lg" />
                  <Box display="flex" direction="column" gap="xs" style={{ flex: 1 }}>
                    <Body weight="bold">Processing Request</Body>
                    <Body size="sm" color="secondary">
                      Please wait while we process your request...
                    </Body>
                  </Box>
                </Box>
              </Box>
            </Box>
          ),
          code: `// Success Notification
<Box display="flex" gap="md" align="start">
  <StatusIcons.Success size="lg" />
  <Box>
    <Body weight="bold">Payment Successful</Body>
    <Body size="sm" color="secondary">
      Your payment has been processed successfully.
    </Body>
  </Box>
</Box>

// Error Message
<Box display="flex" gap="md" align="start">
  <StatusIcons.Error size="lg" />
  <Box>
    <Body weight="bold">Upload Failed</Body>
    <Body size="sm" color="secondary">
      Unable to upload file. Please try again.
    </Body>
  </Box>
</Box>

// Warning Alert
<Box display="flex" gap="md" align="start">
  <StatusIcons.Warning size="lg" />
  <Box>
    <Body weight="bold">Storage Almost Full</Body>
    <Body size="sm" color="secondary">
      You have used 95% of your storage.
    </Body>
  </Box>
</Box>

// Info Banner
<Box display="flex" gap="md" align="start">
  <StatusIcons.Info size="lg" />
  <Box>
    <Body weight="bold">New Feature Available</Body>
    <Body size="sm" color="secondary">
      Check out our new dashboard analytics!
    </Body>
  </Box>
</Box>

// Processing State
<Box display="flex" gap="md" align="start">
  <StatusIcons.Success size="lg" animated />
  <Box>
    <Body weight="bold">Processing Request</Body>
    <Body size="sm" color="secondary">
      Please wait...
    </Body>
  </Box>
</Box>`        },
      ]}
    >
      <Box display="flex" direction="column" gap="md">
        <Box>
          <Body color="secondary" size="md">
            <strong>Best Practices:</strong> Use status icons consistently throughout your application.
            Success for completed actions, error for failures, warning for caution states, info for
            informational messages, and pending for loading or processing states. Always pair icons
            with clear descriptive text.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Accessibility:</strong> Status icons should not be the only means of conveying
            information. Always include descriptive text that explains the status. Use appropriate
            ARIA labels and ensure icons have sufficient color contrast.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Usage Guidelines:</strong> Use success icons for confirmations and completed actions,
            error icons for failures and validation errors, warning icons for potential issues that need
            attention, info icons for helpful tips and updates, and pending icons for loading states and
            in-progress operations.
          </Body>
        </Box>
      </Box>
    </ComponentDocPage>
  );
}
