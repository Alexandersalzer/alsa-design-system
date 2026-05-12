"use client";

import React from 'react';
import { Box, Body, Button, HStack, VStack, ToastProvider, useToast } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

function ToastDemo() {
  const { showToast } = useToast();
  return (
    <ComponentDocPage
      componentName="Toast"
      description="Temporary notification messages"
      importStatement={`import { ToastProvider, useToast } from 'alsa-design-system'`}
      sections={[
        {
          title: 'Variants',
          description: 'Four semantic variants for different notification types',
          preview: (
            <Box>
              <VStack spacing="md">
                <HStack spacing="md" wrap={true}>
                  <Button size="md" variant="accent" onClick={() => showToast('Operation completed successfully', 'success')}>Success</Button>
                  <Button size="md" variant="secondary" onClick={() => showToast('New features are available', 'info')}>Info</Button>
                  <Button size="md" variant="secondary" onClick={() => showToast('Please review your settings', 'warning')}>Warning</Button>
                  <Button size="md" variant="destructive" onClick={() => showToast('An error occurred', 'error')}>Error</Button>
                </HStack>
              </VStack>
            </Box>
          ),
          code: `const { showToast } = useToast();

showToast('Operation completed', 'success');
showToast('New features available', 'info');
showToast('Review your settings', 'warning');
showToast('An error occurred', 'error');`,
        },
        {
          title: 'Setup',
          preview: (
            <Box>
              <Body size="sm" color="secondary">Wrap your app with ToastProvider to enable toasts.</Body>
            </Box>
          ),
          code: `import { ToastProvider } from 'alsa-design-system';

<ToastProvider>
  {children}
</ToastProvider>`,
        },
      ]}
    />
  );
}

export default function ToastPage() {
  return (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  );
}
