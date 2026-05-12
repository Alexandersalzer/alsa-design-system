"use client";

import React from "react";
import { Box, Body, HStack, VStack, IconButton, Icon } from "../../../design/index";
import { ComponentDocPage } from "../../documentation-components/ComponentDocPage";

import {
  HeartIcon,
  PlusIcon,
  XMarkIcon,
  Cog6ToothIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

export default function IconButtonPage() {
  return (
    <ComponentDocPage
      componentName="IconButton"
      description="Icon-only buttons for actions and navigation, optimized for touch targets"
      importStatement={`import { IconButton, Icon } from '../../../design/index'
import { HeartIcon } from '@heroicons/react/24/outline'`}
      sections={[
        {
          title: "Basic Usage",
          description: "Icon buttons provide a compact way to represent actions",
          preview: (
            <IconButton
              aria-label="Like"
              onClick={() => alert("Liked!")}
              icon={<Icon><HeartIcon /></Icon>}
            />
          ),
          code: `import { IconButton, Icon } from '../../../design/index';
import { HeartIcon } from '@heroicons/react/24/outline';

export function BasicIconButton() {
  return (
    <IconButton
      aria-label="Like"
      icon={<Icon><HeartIcon /></Icon>}
    />
  );
}`,
        },

        {
          title: "Sizes",
          description: "Available size variants for different contexts",
          preview: (
            <HStack spacing="lg" align="center">
              <VStack spacing="xs" align="center">
                <IconButton size="sm" aria-label="Add" icon={<Icon><PlusIcon /></Icon>} />
                <Body size="xs" color="secondary">size="sm"</Body>
              </VStack>
              <VStack spacing="xs" align="center">
                <IconButton size="md" aria-label="Add" icon={<Icon><PlusIcon /></Icon>} />
                <Body size="xs" color="secondary">size="md"</Body>
              </VStack>
              <VStack spacing="xs" align="center">
                <IconButton size="lg" aria-label="Add" icon={<Icon><PlusIcon /></Icon>} />
                <Body size="xs" color="secondary">size="lg"</Body>
              </VStack>
            </HStack>
          ),
          code: `import { IconButton, Icon } from '../../../design/index';
import { PlusIcon } from '@heroicons/react/24/outline';

export function IconButtonSizes() {
  return (
    <>
      <IconButton size="sm" aria-label="Add" icon={<Icon><PlusIcon /></Icon>} />
      <IconButton size="md" aria-label="Add" icon={<Icon><PlusIcon /></Icon>} />
      <IconButton size="lg" aria-label="Add" icon={<Icon><PlusIcon /></Icon>} />
    </>
  );
}`,
        },

        {
          title: "Variants",
          description: "Different visual styles for various use cases",
          preview: (
            <HStack spacing="lg" align="center">
              <VStack spacing="xs" align="center">
                <IconButton variant="accent" aria-label="Settings" icon={<Icon><Cog6ToothIcon /></Icon>} />
                <Body size="xs" color="secondary">accent</Body>
              </VStack>
              <VStack spacing="xs" align="center">
                <IconButton variant="secondary" aria-label="Settings" icon={<Icon><Cog6ToothIcon /></Icon>} />
                <Body size="xs" color="secondary">secondary</Body>
              </VStack>
              <VStack spacing="xs" align="center">
                <IconButton variant="ghost" aria-label="Settings" icon={<Icon><Cog6ToothIcon /></Icon>} />
                <Body size="xs" color="secondary">ghost</Body>
              </VStack>
              <VStack spacing="xs" align="center">
                <IconButton variant="destructive" aria-label="Delete" icon={<Icon><TrashIcon /></Icon>} />
                <Body size="xs" color="secondary">destructive</Body>
              </VStack>
            </HStack>
          ),
          code: `import { IconButton, Icon } from '../../../design/index';
import { Cog6ToothIcon, TrashIcon } from '@heroicons/react/24/outline';

export function IconButtonVariants() {
  return (
    <>
      <IconButton variant="accent" aria-label="Settings" icon={<Icon><Cog6ToothIcon /></Icon>} />
      <IconButton variant="secondary" aria-label="Settings" icon={<Icon><Cog6ToothIcon /></Icon>} />
      <IconButton variant="ghost" aria-label="Settings" icon={<Icon><Cog6ToothIcon /></Icon>} />
      <IconButton variant="destructive" aria-label="Delete" icon={<Icon><TrashIcon /></Icon>} />
    </>
  );
}`,
        },

        {
          title: "States",
          description: "Disabled and loading states",
          preview: (
            <HStack spacing="lg" align="center">
              <VStack spacing="xs" align="center">
                <IconButton disabled aria-label="Edit" icon={<Icon><PencilIcon /></Icon>} />
                <Body size="xs" color="secondary">Disabled</Body>
              </VStack>
              <VStack spacing="xs" align="center">
                <IconButton loading aria-label="Saving" icon={<Icon><PencilIcon /></Icon>} />
                <Body size="xs" color="secondary">Loading</Body>
              </VStack>
            </HStack>
          ),
          code: `import { IconButton, Icon } from '../../../design/index';
import { PencilIcon } from '@heroicons/react/24/outline';

export function IconButtonStates() {
  return (
    <>
      <IconButton disabled aria-label="Edit" icon={<Icon><PencilIcon /></Icon>} />
      <IconButton loading aria-label="Saving" icon={<Icon><PencilIcon /></Icon>} />
    </>
  );
}`,
        },

        {
          title: 'Glass Variants',
          description: 'Frosted glass icon buttons for use over images, gradients, or transparent areas',
          preview: (
            <Box
              display="flex"
              gap="sm"
              align="center"
              justify="center"
              padding="lg"
              radius="lg"
              style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)', minHeight: '120px' }}
            >
              <IconButton variant="secondary-glass" aria-label="Settings" icon={<Icon><Cog6ToothIcon /></Icon>} />
              <IconButton variant="ghost-glass" aria-label="Edit" icon={<Icon><PencilIcon /></Icon>} />
              <IconButton variant="accent-glass" aria-label="Add" icon={<Icon><PlusIcon /></Icon>} />
            </Box>
          ),
          code: `import { IconButton, Icon } from '../../../design/index';
import { Cog6ToothIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

export function GlassIconButtons() {
  return (
    // Place over an image or gradient background
    <Box style={{ background: 'linear-gradient(135deg, #1a1a2e, #533483)' }}>
      <IconButton variant="secondary-glass" aria-label="Settings" icon={<Icon><Cog6ToothIcon /></Icon>} />
      <IconButton variant="ghost-glass" aria-label="Edit" icon={<Icon><PencilIcon /></Icon>} />
      <IconButton variant="accent-glass" aria-label="Add" icon={<Icon><PlusIcon /></Icon>} />
    </Box>
  );
}`,
        },

        {
          title: "Practical Examples",
          description: "Common use cases for icon buttons",
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 400 }}>
              <Box display="flex" justify="between" align="center" padding="md" border="default" radius="md">
                <Body weight="medium">Modal Header</Body>
                <IconButton variant="ghost" size="sm" aria-label="Close" icon={<Icon><XMarkIcon /></Icon>} />
              </Box>
              <Box display="flex" gap="sm" padding="md" border="default" radius="md">
                <IconButton variant="ghost" size="sm" aria-label="Edit" icon={<Icon><PencilIcon /></Icon>} />
                <IconButton variant="ghost" size="sm" aria-label="Delete" icon={<Icon><TrashIcon /></Icon>} />
              </Box>
            </VStack>
          ),
          code: `import { IconButton, Icon, Box, Body } from '../../../design/index';
import { XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export function IconButtonExamples() {
  return (
    <>
      {/* Modal close button */}
      <Box display="flex" justify="between" align="center">
        <Body weight="medium">Modal Header</Body>
        <IconButton variant="ghost" size="sm" aria-label="Close" icon={<Icon><XMarkIcon /></Icon>} />
      </Box>

      {/* Action row */}
      <Box display="flex" gap="sm">
        <IconButton variant="ghost" size="sm" aria-label="Edit" icon={<Icon><PencilIcon /></Icon>} />
        <IconButton variant="ghost" size="sm" aria-label="Delete" icon={<Icon><TrashIcon /></Icon>} />
      </Box>
    </>
  );
}`,
        },
      ]}
    />
  );
}
