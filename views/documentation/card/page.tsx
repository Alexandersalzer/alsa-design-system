"use client";

import React from 'react';
import {
  VStack,
  HStack,
  Body,
  Button,
  Icon,
} from '../../../design/index';

import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function ButtonPage() {
  return (
    <ComponentDocPage
      componentName="Button"
      description="Action component used to trigger events, submit forms, navigate flows, show loading states, and display icons"
      importStatement={`import { Button, Icon } from '../../../design/index';
import { PlusIcon } from '@heroicons/react/24/outline';`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple button with text content',
          preview: (
            <Button>Click me</Button>
          ),
          code: `import { Button } from '../../../design/index';

export function BasicButton() {
  return (
    <Button>Click me</Button>
  );
}`,
        },

        {
          title: 'Sizes',
          description: 'Four button sizes: sm, md, lg, and xl',
          preview: (
            <HStack spacing="md" align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <VStack spacing="xs" align="center">
                <Button size="sm">Small</Button>
                <Body size="xs" color="secondary">sm</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Button size="md">Medium</Button>
                <Body size="xs" color="secondary">md</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Button size="lg">Large</Button>
                <Body size="xs" color="secondary">lg</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Button size="xl">Extra Large</Button>
                <Body size="xs" color="secondary">xl</Body>
              </VStack>
            </HStack>
          ),
          code: `import { Button } from '../../../design/index';

export function ButtonSizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  );
}`,
        },

        {
          title: 'Variants',
          description: 'Six visual styles for primary actions, secondary actions, destructive actions, and low-emphasis controls',
          preview: (
            <VStack spacing="md" align="center" style={{ width: '100%' }}>
              <HStack spacing="md" align="center" style={{ justifyContent: 'center', width: '100%' }}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="accent">Accent</Button>
              </HStack>

              <HStack spacing="md" align="center" style={{ justifyContent: 'center', width: '100%' }}>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
              </HStack>
            </VStack>
          ),
          code: `import { Button } from '../../../design/index';

export function ButtonVariants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}`,
        },

        {
          title: 'Left Icon',
          description: 'Add an icon before the button label',
          preview: (
            <HStack spacing="md" align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <Button leftIcon={<Icon><PlusIcon /></Icon>}>
                Add
              </Button>

              <Button variant="secondary" leftIcon={<Icon><PencilIcon /></Icon>}>
                Edit
              </Button>

              <Button variant="destructive" leftIcon={<Icon><TrashIcon /></Icon>}>
                Delete
              </Button>
            </HStack>
          ),
          code: `import { Button, Icon } from '../../../design/index';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export function ButtonsWithLeftIcons() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Button leftIcon={<Icon><PlusIcon /></Icon>}>
        Add
      </Button>

      <Button variant="secondary" leftIcon={<Icon><PencilIcon /></Icon>}>
        Edit
      </Button>

      <Button variant="destructive" leftIcon={<Icon><TrashIcon /></Icon>}>
        Delete
      </Button>
    </div>
  );
}`,
        },

        {
          title: 'Right Icon',
          description: 'Add an icon after the button label',
          preview: (
            <HStack spacing="md" align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <Button rightIcon={<Icon><ArrowRightIcon /></Icon>}>
                Next
              </Button>

              <Button variant="secondary" rightIcon={<Icon><ChevronDownIcon /></Icon>}>
                Menu
              </Button>
            </HStack>
          ),
          code: `import { Button, Icon } from '../../../design/index';
import {
  ArrowRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

export function ButtonsWithRightIcons() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Button rightIcon={<Icon><ArrowRightIcon /></Icon>}>
        Next
      </Button>

      <Button variant="secondary" rightIcon={<Icon><ChevronDownIcon /></Icon>}>
        Menu
      </Button>
    </div>
  );
}`,
        },

        {
          title: 'Icon Buttons',
          description: 'Buttons with icons for compact action patterns',
          preview: (
            <HStack spacing="md" align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <Button
                size="md"
                leftIcon={<Icon><PlusIcon /></Icon>}
                aria-label="Lägg till"
              >
                Lägg till
              </Button>

              <Button
                variant="secondary"
                size="md"
                leftIcon={<Icon><Cog6ToothIcon /></Icon>}
                aria-label="Inställningar"
              >
                Inställningar
              </Button>

              <Button
                variant="ghost"
                size="md"
                leftIcon={<Icon><XMarkIcon /></Icon>}
                aria-label="Stäng"
              >
                Stäng
              </Button>
            </HStack>
          ),
          code: `import { Button, Icon } from '../../../design/index';
import {
  PlusIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export function IconButtons() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Button
        leftIcon={<Icon><PlusIcon /></Icon>}
        aria-label="Lägg till"
      >
        Lägg till
      </Button>

      <Button
        variant="secondary"
        leftIcon={<Icon><Cog6ToothIcon /></Icon>}
        aria-label="Inställningar"
      >
        Inställningar
      </Button>

      <Button
        variant="ghost"
        leftIcon={<Icon><XMarkIcon /></Icon>}
        aria-label="Stäng"
      >
        Stäng
      </Button>
    </div>
  );
}`,
        },

        {
          title: 'Disabled',
          description: 'Disable buttons when an action is unavailable',
          preview: (
            <HStack spacing="md" align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <Button disabled>Primary</Button>
              <Button variant="secondary" disabled>Secondary</Button>
              <Button variant="accent" disabled>Accent</Button>
            </HStack>
          ),
          code: `import { Button } from '../../../design/index';

export function DisabledButtons() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Button disabled>Primary</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="accent" disabled>Accent</Button>
    </div>
  );
}`,
        },

        {
          title: 'Glass Variants',
          description: 'Glass button styles for use over gradients, images, or layered surfaces',
          preview: (
            <VStack spacing="lg" align="stretch" style={{ width: '100%' }}>
              <VStack
                spacing="lg"
                align="center"
                style={{
                  padding: 24,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)',
                  minHeight: 160,
                  justifyContent: 'center',
                }}
              >
                <Body
                  size="xs"
                  style={{
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Over image / gradient
                </Body>

                <HStack spacing="sm" align="center">
                  <Button variant="secondary-glass">Secondary</Button>
                  <Button variant="ghost-glass">Ghost</Button>
                  <Button variant="accent-glass">Accent</Button>
                </HStack>
              </VStack>

              <HStack spacing="sm" align="center" style={{ justifyContent: 'center', width: '100%' }}>
                <Button variant="secondary-glass">Secondary</Button>
                <Button variant="ghost-glass">Ghost</Button>
                <Button variant="accent-glass">Accent</Button>
              </HStack>
            </VStack>
          ),
          code: `import { Button } from '../../../design/index';

export function GlassButtons() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Button variant="secondary-glass">Secondary Glass</Button>
      <Button variant="ghost-glass">Ghost Glass</Button>
      <Button variant="accent-glass">Accent Glass</Button>
    </div>
  );
}`,
        },

        {
          title: 'Loading',
          description: 'Show loading state while an action is processing',
          preview: (
            <HStack spacing="md" align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <Button loading>Loading</Button>
              <Button variant="secondary" loading>Processing</Button>
              <Button variant="accent" loading>Saving</Button>
            </HStack>
          ),
          code: `import { Button } from '../../../design/index';

export function LoadingButtons() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Button loading>Loading</Button>
      <Button variant="secondary" loading>Processing</Button>
      <Button variant="accent" loading>Saving</Button>
    </div>
  );
}`,
        },
      ]}
      properties={[
        { name: 'children', type: 'ReactNode', description: 'Button label or content' },
        { name: 'variant', type: "'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'destructive' | 'secondary-glass' | 'ghost-glass' | 'accent-glass'", default: "'primary'", description: 'Visual style' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Button size' },
        { name: 'leftIcon', type: 'ReactNode', description: 'Icon shown before the label' },
        { name: 'rightIcon', type: 'ReactNode', description: 'Icon shown after the label' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction' },
        { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading state and prevent normal interaction' },
        { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Native button type' },
        { name: 'onClick', type: '(event: MouseEvent) => void', description: 'Click handler' },
        { name: 'aria-label', type: 'string', description: 'Accessible label, especially useful for icon-only buttons' },
        { name: 'className', type: 'string', description: 'Optional class name for custom styling' },
        { name: 'style', type: 'React.CSSProperties', description: 'Optional inline styles' },
      ]}
    />
  );
}