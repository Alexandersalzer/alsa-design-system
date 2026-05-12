"use client";

import React, { useState } from 'react';
import { VStack, Body, Alert } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function AlertPage() {
  const [showAlert1, setShowAlert1] = useState(true);
  const [showAlert2, setShowAlert2] = useState(true);

  return (
    <ComponentDocPage
      componentName="Alert"
      description="Prominent message component for displaying important information, feedback, warnings, errors, and dismissible banners"
      importStatement={`import { Alert } from '../../../design/index';
import { InformationCircleIcon } from '@heroicons/react/24/outline';`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple alert message using Alert.Root composition',
          preview: (
            <Alert.Root variant="info">
              <Alert.Indicator>
                <InformationCircleIcon />
              </Alert.Indicator>
              <Alert.Content>
                <Alert.Description>
                  This is a basic alert message
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          ),
          code: `import { Alert } from '../../../design/index';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export function BasicAlert() {
  return (
    <Alert.Root variant="info">
      <Alert.Indicator>
        <InformationCircleIcon />
      </Alert.Indicator>
      <Alert.Content>
        <Alert.Description>
          This is a basic alert message
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}`,
        },

        {
          title: 'Variants',
          description: 'Four semantic variants: info, success, warning, and error',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <Alert.Root variant="info">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Description>
                    This is an informational message
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>

              <Alert.Root variant="success">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Description>
                    Operation completed successfully
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>

              <Alert.Root variant="warning">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Description>
                    Please review this warning
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>

              <Alert.Root variant="error">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Description>
                    An error has occurred
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            </VStack>
          ),
          code: `import { Alert } from '../../../design/index';

export function AlertVariants() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Alert.Root variant="info">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Description>
            This is an informational message
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <Alert.Root variant="success">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Description>
            Operation completed successfully
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <Alert.Root variant="warning">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Description>
            Please review this warning
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <Alert.Root variant="error">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Description>
            An error has occurred
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </div>
  );
}`,
        },

        {
          title: 'Surface Variants',
          description: 'Three surface treatments: subtle, muted, and vibrant',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <Alert.Root variant="info" surface="subtle">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Description>
                    Subtle surface variant
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>

              <Alert.Root variant="success" surface="muted">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Description>
                    Muted surface variant
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>

              <Alert.Root variant="warning" surface="vibrant">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Description>
                    Vibrant surface variant
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            </VStack>
          ),
          code: `import { Alert } from '../../../design/index';

export function AlertSurfaces() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Alert.Root variant="info" surface="subtle">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Description>
            Subtle surface variant
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <Alert.Root variant="success" surface="muted">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Description>
            Muted surface variant
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <Alert.Root variant="warning" surface="vibrant">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Description>
            Vibrant surface variant
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </div>
  );
}`,
        },

        {
          title: 'With Title',
          description: 'Alert with a title and supporting description',
          preview: (
            <Alert.Root variant="info">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Update Available</Alert.Title>
                <Alert.Description>
                  A new version of the application is ready to install. Click here to update now.
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          ),
          code: `import { Alert } from '../../../design/index';

export function AlertWithTitle() {
  return (
    <Alert.Root variant="info">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Update Available</Alert.Title>
        <Alert.Description>
          A new version of the application is ready to install. Click here to update now.
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}`,
        },

        {
          title: 'Dismissible Alerts',
          description: 'Alerts with close buttons controlled by React state',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              {showAlert1 && (
                <Alert.Root variant="success">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Success!</Alert.Title>
                    <Alert.Description>
                      Your changes have been saved successfully
                    </Alert.Description>
                  </Alert.Content>
                  <Alert.CloseButton onClose={() => setShowAlert1(false)} />
                </Alert.Root>
              )}

              {showAlert2 && (
                <Alert.Root variant="warning">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Description>
                      Please review the terms before continuing
                    </Alert.Description>
                  </Alert.Content>
                  <Alert.CloseButton onClose={() => setShowAlert2(false)} />
                </Alert.Root>
              )}
            </VStack>
          ),
          code: `import { useState } from 'react';
import { Alert } from '../../../design/index';

export function DismissibleAlerts() {
  const [showSuccess, setShowSuccess] = useState(true);
  const [showWarning, setShowWarning] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {showSuccess && (
        <Alert.Root variant="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Success!</Alert.Title>
            <Alert.Description>
              Your changes have been saved successfully
            </Alert.Description>
          </Alert.Content>
          <Alert.CloseButton onClose={() => setShowSuccess(false)} />
        </Alert.Root>
      )}

      {showWarning && (
        <Alert.Root variant="warning">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>
              Please review the terms before continuing
            </Alert.Description>
          </Alert.Content>
          <Alert.CloseButton onClose={() => setShowWarning(false)} />
        </Alert.Root>
      )}
    </div>
  );
}`,
        },

        {
          title: 'Practical Examples',
          description: 'Real-world alert usage patterns for payment, maintenance, and pending actions',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <Alert.Root variant="error" surface="vibrant">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Payment Failed</Alert.Title>
                  <Alert.Description>
                    Your payment could not be processed. Please check your payment details and try again.
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>

              <Alert.Root variant="warning" surface="muted">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Maintenance Scheduled</Alert.Title>
                  <Alert.Description>
                    System maintenance is scheduled for tonight at 11 PM. Services will be unavailable for approximately 2 hours.
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>

              <Alert.Root variant="info" surface="subtle">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Description>
                    You have 3 pending invitations. Review them in your inbox.
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            </VStack>
          ),
          code: `import { Alert } from '../../../design/index';

export function PracticalAlerts() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Alert.Root variant="error" surface="vibrant">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Payment Failed</Alert.Title>
          <Alert.Description>
            Your payment could not be processed. Please check your payment details and try again.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <Alert.Root variant="warning" surface="muted">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Maintenance Scheduled</Alert.Title>
          <Alert.Description>
            System maintenance is scheduled for tonight at 11 PM. Services will be unavailable for approximately 2 hours.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <Alert.Root variant="info" surface="subtle">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Description>
            You have 3 pending invitations. Review them in your inbox.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </div>
  );
}`,
        },
      ]}
      properties={[
        { name: 'Alert.Root', type: 'component', description: 'Root wrapper for the alert component' },
        { name: 'Alert.Indicator', type: 'component', description: 'Icon or status indicator area' },
        { name: 'Alert.Content', type: 'component', description: 'Content wrapper for title and description' },
        { name: 'Alert.Title', type: 'component', description: 'Optional alert title' },
        { name: 'Alert.Description', type: 'component', description: 'Main alert message text' },
        { name: 'Alert.CloseButton', type: 'component', description: 'Dismiss button for closable alerts' },
        { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: 'Semantic alert type' },
        { name: 'surface', type: "'subtle' | 'muted' | 'vibrant'", default: "'subtle'", description: 'Visual surface intensity' },
        { name: 'onClose', type: '() => void', description: 'Callback fired when the close button is clicked' },
        { name: 'children', type: 'ReactNode', description: 'Alert content and composition children' },
        { name: 'className', type: 'string', description: 'Optional class name for custom styling' },
        { name: 'style', type: 'React.CSSProperties', description: 'Optional inline styles' },
      ]}
    />
  );
}