"use client";

import React, { useState } from 'react';
import { Box, Body, Progress, Button, VStack } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function ProgressPage() {
  const [progress, setProgress] = useState(45);

  return (
    <ComponentDocPage
      componentName="Progress"
      description="Visual indicator that shows the completion status of a task or process with a determinate value"
      importStatement={`import { Progress } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple progress bar showing completion percentage',
          preview: (
            <Box style={{ width: '100%' }}>
              <Progress value={65} />
            </Box>
          ),
          code: `import { Progress } from '../../../design/index';

export function BasicProgress() {
  return <Progress value={65} />;
}`,
        },

        {
          title: 'Sizes',
          description: 'Available progress bar sizes',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="xs">
                <Progress size="sm" value={40} />
                <Body size="xs" color="secondary">size="sm"</Body>
              </VStack>
              <VStack spacing="xs">
                <Progress size="md" value={60} />
                <Body size="xs" color="secondary">size="md"</Body>
              </VStack>
              <VStack spacing="xs">
                <Progress size="lg" value={80} />
                <Body size="xs" color="secondary">size="lg"</Body>
              </VStack>
            </VStack>
          ),
          code: `<Progress size="sm" value={40} />
<Progress size="md" value={60} />
<Progress size="lg" value={80} />`,
        },

        {
          title: 'Colors',
          description: 'Different color variants for various states',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="xs">
                <Progress value={45} />
                <Body size="xs" color="secondary">default</Body>
              </VStack>
              <VStack spacing="xs">
                <Progress color="success" value={75} />
                <Body size="xs" color="secondary">color="success"</Body>
              </VStack>
              <VStack spacing="xs">
                <Progress color="warning" value={50} />
                <Body size="xs" color="secondary">color="warning"</Body>
              </VStack>
              <VStack spacing="xs">
                <Progress color="error" value={25} />
                <Body size="xs" color="secondary">color="error"</Body>
              </VStack>
              <VStack spacing="xs">
                <Progress color="accent" value={90} />
                <Body size="xs" color="secondary">color="accent"</Body>
              </VStack>
            </VStack>
          ),
          code: `<Progress value={45} />
<Progress color="success" value={75} />
<Progress color="warning" value={50} />
<Progress color="error" value={25} />
<Progress color="accent" value={90} />`,
        },

        {
          title: 'With Label',
          description: 'Progress bars with built-in labels and value display',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <Progress value={35} label="Upload Progress" showValue />
              <Progress value={70} label="Profile Completion" showValue color="success" />
              <Progress value={85} label="Storage Used" showValue color="warning" />
            </VStack>
          ),
          code: `<Progress value={35} label="Upload Progress" showValue />
<Progress value={70} label="Profile Completion" showValue color="success" />
<Progress value={85} label="Storage Used" showValue color="warning" />`,
        },

        {
          title: 'Custom Value Format',
          description: 'Use formatValue to display custom text instead of percentage',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <Progress
                value={85}
                label="Storage Used"
                showValue
                formatValue={(v) => `${(v / 10).toFixed(1)} GB / 10 GB`}
                color="warning"
              />
              <Progress
                value={60}
                label="Onboarding Progress"
                showValue
                formatValue={(v) => `${Math.floor(v / 20)} of 5 steps`}
                color="accent"
              />
            </VStack>
          ),
          code: '<Progress\n  value={85}\n  label="Storage Used"\n  showValue\n  formatValue={(v) => `${(v / 10).toFixed(1)} GB / 10 GB`}\n  color="warning"\n/>\n\n<Progress\n  value={60}\n  label="Onboarding Progress"\n  showValue\n  formatValue={(v) => `${Math.floor(v / 20)} of 5 steps`}\n  color="accent"\n/>',
        },

        {
          title: 'Interactive Example',
          description: 'Dynamic progress bar that updates based on user interaction',
          preview: (
            <Box style={{ width: '100%' }}>
              <VStack spacing="md">
                <Box display="flex" justify="between" align="center">
                  <Body size="sm" weight="medium">Processing...</Body>
                  <Body size="sm" color="secondary">{progress}%</Body>
                </Box>
                <Progress value={progress} color={progress >= 75 ? 'success' : progress >= 50 ? 'accent' : 'warning'} />
                <Box display="flex" gap="sm">
                  <Button size="sm" variant="secondary" onClick={() => setProgress(Math.max(0, progress - 10))}>-10%</Button>
                  <Button size="sm" variant="secondary" onClick={() => setProgress(Math.min(100, progress + 10))}>+10%</Button>
                  <Button size="sm" variant="ghost" onClick={() => setProgress(0)}>Reset</Button>
                </Box>
              </VStack>
            </Box>
          ),
          code: `import { useState } from 'react';
import { Progress, Box, Body, Button, VStack } from '../../../design/index';

export function InteractiveProgress() {
  const [progress, setProgress] = useState(45);

  return (
    <VStack spacing="md">
      <Box display="flex" justify="between" align="center">
        <Body size="sm" weight="medium">Processing...</Body>
        <Body size="sm" color="secondary">{progress}%</Body>
      </Box>
      <Progress value={progress} color={progress >= 75 ? 'success' : 'warning'} />
      <Box display="flex" gap="sm">
        <Button size="sm" variant="secondary" onClick={() => setProgress(Math.max(0, progress - 10))}>-10%</Button>
        <Button size="sm" variant="secondary" onClick={() => setProgress(Math.min(100, progress + 10))}>+10%</Button>
        <Button size="sm" variant="ghost" onClick={() => setProgress(0)}>Reset</Button>
      </Box>
    </VStack>
  );
}`,
        },

        {
          title: 'Practical Examples',
          description: 'Common progress bar usage patterns',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <Box padding="md" border="default" radius="md">
                <VStack spacing="xs">
                  <Body weight="semibold" size="sm">File Upload</Body>
                  <Body size="xs" color="secondary">document.pdf (2.3 MB)</Body>
                  <Progress value={67} size="sm" />
                  <Body size="xs" color="secondary">Uploading... 67% complete</Body>
                </VStack>
              </Box>
              <Box padding="md" border="default" radius="md">
                <VStack spacing="sm">
                  <Body weight="semibold">Onboarding Progress</Body>
                  <Box display="flex" justify="between">
                    <Body size="sm">3 of 5 steps completed</Body>
                    <Body size="sm" color="secondary">60%</Body>
                  </Box>
                  <Progress color="accent" value={60} />
                </VStack>
              </Box>
              <Box padding="md" border="default" radius="md">
                <VStack spacing="xs">
                  <Box display="flex" justify="between" align="center">
                    <Body weight="semibold" size="sm">Subscription Plan</Body>
                    <Body size="xs" color="error">90% used</Body>
                  </Box>
                  <Progress color="error" value={90} />
                  <Body size="xs" color="secondary">9,000 of 10,000 API calls this month</Body>
                </VStack>
              </Box>
            </VStack>
          ),
          code: `import { Progress, Box, Body, VStack } from '../../../design/index';

export function ProgressExamples() {
  return (
    <>
      {/* File upload */}
      <VStack spacing="xs">
        <Body weight="semibold" size="sm">File Upload</Body>
        <Body size="xs" color="secondary">document.pdf (2.3 MB)</Body>
        <Progress value={67} size="sm" />
        <Body size="xs" color="secondary">Uploading... 67% complete</Body>
      </VStack>

      {/* Onboarding */}
      <VStack spacing="sm">
        <Body weight="semibold">Onboarding Progress</Body>
        <Box display="flex" justify="between">
          <Body size="sm">3 of 5 steps completed</Body>
          <Body size="sm" color="secondary">60%</Body>
        </Box>
        <Progress color="accent" value={60} />
      </VStack>

      {/* Quota */}
      <VStack spacing="xs">
        <Box display="flex" justify="between" align="center">
          <Body weight="semibold" size="sm">Subscription Plan</Body>
          <Body size="xs" color="error">90% used</Body>
        </Box>
        <Progress color="error" value={90} />
        <Body size="xs" color="secondary">9,000 of 10,000 API calls this month</Body>
      </VStack>
    </>
  );
}`,
        },
      ]}
    >
      <Box display="flex" direction="column" gap="md">
        <Body color="secondary" size="md">
          <strong>Best Practices:</strong> Use progress bars when you can calculate the completion percentage.
          For indeterminate operations, use a Spinner instead. Always provide context with labels.
        </Body>
        <Body color="secondary" size="md">
          <strong>Accessibility:</strong> Include ARIA attributes (aria-valuenow, aria-valuemin, aria-valuemax)
          to communicate progress to assistive technologies.
        </Body>
      </Box>
    </ComponentDocPage>
  );
}
