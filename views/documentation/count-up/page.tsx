"use client";

import React from 'react';
import { Body, CountUp, HStack, VStack } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function CountUpPage() {
  return (
    <ComponentDocPage
      componentName="CountUp"
      description="Animated number component that counts from a start value to an end value with duration, easing, separators, decimals, prefixes, and suffixes"
      importStatement={`import { CountUp } from '../../../design/index';`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple count up animation from 0 to a target value',
          preview: (
            <Body size="xl" weight="bold">
              <CountUp end={1000} duration={2000} />
            </Body>
          ),
          code: `import { CountUp } from '../../../design/index';

export function BasicCountUp() {
  return (
    <CountUp end={1000} duration={2000} />
  );
}`,
        },

        {
          title: 'Custom Start Value',
          description: 'Animate from a specific start value to an end value',
          preview: (
            <HStack spacing="lg" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                <Body size="xl" weight="bold">
                  <CountUp start={0} end={100} duration={2000} />
                </Body>
                <Body size="xs" color="secondary">0 to 100</Body>
              </VStack>

              <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                <Body size="xl" weight="bold">
                  <CountUp start={50} end={200} duration={2000} />
                </Body>
                <Body size="xs" color="secondary">50 to 200</Body>
              </VStack>

              <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                <Body size="xl" weight="bold">
                  <CountUp start={100} end={500} duration={2000} />
                </Body>
                <Body size="xs" color="secondary">100 to 500</Body>
              </VStack>
            </HStack>
          ),
          code: `import { CountUp } from '../../../design/index';

export function CountUpStartValues() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <CountUp start={0} end={100} duration={2000} />
      <CountUp start={50} end={200} duration={2000} />
      <CountUp start={100} end={500} duration={2000} />
    </div>
  );
}`,
        },

        {
          title: 'Duration',
          description: 'Control animation speed with different duration values',
          preview: (
            <HStack spacing="lg" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                <Body size="xl" weight="bold">
                  <CountUp end={1000} duration={1000} />
                </Body>
                <Body size="xs" color="secondary">1s duration</Body>
              </VStack>

              <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                <Body size="xl" weight="bold">
                  <CountUp end={1000} duration={2500} />
                </Body>
                <Body size="xs" color="secondary">2.5s duration</Body>
              </VStack>

              <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                <Body size="xl" weight="bold">
                  <CountUp end={1000} duration={4000} />
                </Body>
                <Body size="xs" color="secondary">4s duration</Body>
              </VStack>
            </HStack>
          ),
          code: `import { CountUp } from '../../../design/index';

export function CountUpDurations() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <CountUp end={1000} duration={1000} />
      <CountUp end={1000} duration={2500} />
      <CountUp end={1000} duration={4000} />
    </div>
  );
}`,
        },

        {
          title: 'Number Formatting',
          description: 'Format numbers with separators, decimals, prefixes, and suffixes',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 520 }}>
              <HStack spacing="lg" align="stretch">
                <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                  <Body size="xl" weight="bold">
                    <CountUp end={1234567} duration={2000} separator="," />
                  </Body>
                  <Body size="xs" color="secondary">Separator</Body>
                </VStack>

                <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                  <Body size="xl" weight="bold">
                    <CountUp end={99.99} duration={2000} decimals={2} />
                  </Body>
                  <Body size="xs" color="secondary">Decimals</Body>
                </VStack>
              </HStack>

              <HStack spacing="lg" align="stretch">
                <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                  <Body size="xl" weight="bold">
                    <CountUp end={4999} duration={2000} prefix="$" />
                  </Body>
                  <Body size="xs" color="secondary">Prefix</Body>
                </VStack>

                <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                  <Body size="xl" weight="bold">
                    <CountUp end={95} duration={2000} suffix="%" />
                  </Body>
                  <Body size="xs" color="secondary">Suffix</Body>
                </VStack>
              </HStack>

              <HStack spacing="lg" align="stretch">
                <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                  <Body size="xl" weight="bold">
                    <CountUp end={2500} duration={2000} prefix="$" separator="," decimals={2} />
                  </Body>
                  <Body size="xs" color="secondary">Combined</Body>
                </VStack>

                <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                  <Body size="xl" weight="bold">
                    <CountUp end={1500000} duration={2000} suffix="+" separator="," />
                  </Body>
                  <Body size="xs" color="secondary">Large number</Body>
                </VStack>
              </HStack>
            </VStack>
          ),
          code: `import { CountUp } from '../../../design/index';

export function CountUpFormatting() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <CountUp end={1234567} separator="," />
      <CountUp end={99.99} decimals={2} />
      <CountUp end={4999} prefix="$" />
      <CountUp end={95} suffix="%" />
      <CountUp end={2500} prefix="$" separator="," decimals={2} />
      <CountUp end={1500000} suffix="+" separator="," />
    </div>
  );
}`,
        },

        {
          title: 'Easing Functions',
          description: 'Different animation easing effects',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 520 }}>
              <HStack spacing="lg" align="stretch">
                <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                  <Body size="xl" weight="bold">
                    <CountUp end={1000} duration={2000} easing="linear" />
                  </Body>
                  <Body size="xs" color="secondary">Linear</Body>
                </VStack>

                <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                  <Body size="xl" weight="bold">
                    <CountUp end={1000} duration={2000} easing="easeOut" />
                  </Body>
                  <Body size="xs" color="secondary">Ease Out</Body>
                </VStack>
              </HStack>

              <HStack spacing="lg" align="stretch">
                <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                  <Body size="xl" weight="bold">
                    <CountUp end={1000} duration={2000} easing="easeIn" />
                  </Body>
                  <Body size="xs" color="secondary">Ease In</Body>
                </VStack>

                <VStack spacing="xs" align="center" style={{ flex: 1 }}>
                  <Body size="xl" weight="bold">
                    <CountUp end={1000} duration={2000} easing="easeInOut" />
                  </Body>
                  <Body size="xs" color="secondary">Ease In Out</Body>
                </VStack>
              </HStack>
            </VStack>
          ),
          code: `import { CountUp } from '../../../design/index';

export function CountUpEasing() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <CountUp end={1000} easing="linear" />
      <CountUp end={1000} easing="easeOut" />
      <CountUp end={1000} easing="easeIn" />
      <CountUp end={1000} easing="easeInOut" />
    </div>
  );
}`,
        },

        {
          title: 'Practical Examples',
          description: 'Real-world usage scenarios for dashboard metrics and statistics',
          preview: (
            <VStack spacing="lg" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="md" align="stretch">
                <Body weight="medium" color="secondary" size="sm">
                  Dashboard Statistics
                </Body>

                <HStack spacing="lg" align="stretch">
                  <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                    <Body size="xs" color="secondary">Total Users</Body>
                    <Body size="xl" weight="bold">
                      <CountUp end={12543} duration={2000} separator="," />
                    </Body>
                  </VStack>

                  <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                    <Body size="xs" color="secondary">Revenue</Body>
                    <Body size="xl" weight="bold">
                      <CountUp end={98765} duration={2000} prefix="$" separator="," />
                    </Body>
                  </VStack>

                  <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                    <Body size="xs" color="secondary">Success Rate</Body>
                    <Body size="xl" weight="bold">
                      <CountUp end={97.5} duration={2000} suffix="%" decimals={1} />
                    </Body>
                  </VStack>
                </HStack>
              </VStack>

              <HStack spacing="md" align="center" justify="between">
                <VStack spacing="xs" align="stretch">
                  <Body weight="medium">Active Sessions</Body>
                  <Body size="sm" color="secondary">Currently online</Body>
                </VStack>

                <Body size="xl" weight="bold">
                  <CountUp end={1247} duration={1500} separator="," />
                </Body>
              </HStack>

              <VStack spacing="sm" align="stretch">
                <Body weight="medium">Monthly Goal Progress</Body>
                <HStack spacing="xs" align="baseline">
                  <Body size="xl" weight="bold">
                    <CountUp end={87} duration={2000} suffix="%" />
                  </Body>
                  <Body color="secondary">of $50,000 target</Body>
                </HStack>
              </VStack>
            </VStack>
          ),
          code: `import { CountUp, Body, HStack, VStack } from '../../../design/index';

export function CountUpPracticalExamples() {
  return (
    <VStack spacing="lg" align="stretch">
      <VStack spacing="md" align="stretch">
        <Body weight="medium" color="secondary" size="sm">
          Dashboard Statistics
        </Body>

        <HStack spacing="lg" align="stretch">
          <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
            <Body size="xs" color="secondary">Total Users</Body>
            <Body size="xl" weight="bold">
              <CountUp end={12543} duration={2000} separator="," />
            </Body>
          </VStack>

          <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
            <Body size="xs" color="secondary">Revenue</Body>
            <Body size="xl" weight="bold">
              <CountUp end={98765} duration={2000} prefix="$" separator="," />
            </Body>
          </VStack>

          <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
            <Body size="xs" color="secondary">Success Rate</Body>
            <Body size="xl" weight="bold">
              <CountUp end={97.5} duration={2000} suffix="%" decimals={1} />
            </Body>
          </VStack>
        </HStack>
      </VStack>

      <HStack spacing="md" align="center" justify="between">
        <VStack spacing="xs" align="stretch">
          <Body weight="medium">Active Sessions</Body>
          <Body size="sm" color="secondary">Currently online</Body>
        </VStack>

        <Body size="xl" weight="bold">
          <CountUp end={1247} duration={1500} separator="," />
        </Body>
      </HStack>

      <VStack spacing="sm" align="stretch">
        <Body weight="medium">Monthly Goal Progress</Body>
        <HStack spacing="xs" align="baseline">
          <Body size="xl" weight="bold">
            <CountUp end={87} duration={2000} suffix="%" />
          </Body>
          <Body color="secondary">of $50,000 target</Body>
        </HStack>
      </VStack>
    </VStack>
  );
}`,
        },
      ]}
      properties={[
        { name: 'start', type: 'number', default: '0', description: 'Initial value to animate from' },
        { name: 'end', type: 'number', description: 'Target value to animate to' },
        { name: 'duration', type: 'number', default: '2000', description: 'Animation duration in milliseconds' },
        { name: 'delay', type: 'number', default: '0', description: 'Delay before the animation starts in milliseconds' },
        { name: 'decimals', type: 'number', default: '0', description: 'Number of decimal places to display' },
        { name: 'separator', type: 'string', description: 'Thousands separator, for example "," or " "' },
        { name: 'prefix', type: 'string', description: 'Text displayed before the number, for example "$"' },
        { name: 'suffix', type: 'string', description: 'Text displayed after the number, for example "%"' },
        { name: 'easing', type: "'linear' | 'easeOut' | 'easeIn' | 'easeInOut'", default: "'easeOut'", description: 'Animation easing function' },
        { name: 'className', type: 'string', description: 'Optional class name for custom styling' },
        { name: 'style', type: 'React.CSSProperties', description: 'Optional inline styles' },
      ]}
    />
  );
}