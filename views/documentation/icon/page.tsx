"use client";

import React from 'react';
import { Box, Body, Icon } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  HeartIcon,
  StarIcon,
  BellIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function IconPage() {
  return (
    <ComponentDocPage
      componentName="Icon"
      description="Wrapper component for displaying icons with consistent sizing"
      importStatement={`import { Icon } from '../../../design/index'
import { HomeIcon } from '@heroicons/react/24/outline'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Wrap Heroicons with the Icon component',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Icon>
                <HomeIcon />
              </Icon>
            </Box>
          ),
          code: `<Icon>
  <HomeIcon />
</Icon>`,
        },

        {
          title: 'Sizes',
          description: 'Available icon size variants',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Icon size="xs">
                  <StarIcon />
                </Icon>
                <Body size="xs" color="secondary">size="xs"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Icon size="sm">
                  <StarIcon />
                </Icon>
                <Body size="xs" color="secondary">size="sm"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Icon size="md">
                  <StarIcon />
                </Icon>
                <Body size="xs" color="secondary">size="md"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Icon size="lg">
                  <StarIcon />
                </Icon>
                <Body size="xs" color="secondary">size="lg"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Icon size="xl">
                  <StarIcon />
                </Icon>
                <Body size="xs" color="secondary">size="xl"</Body>
              </Box>
            </Box>
          ),
          code: `import { Icon } from '../../../design/index';
import { StarIcon } from '@heroicons/react/24/outline';

export function IconSizes() {
  return (
    <>
      <Icon size="xs"><StarIcon /></Icon>
      <Icon size="sm"><StarIcon /></Icon>
      <Icon size="md"><StarIcon /></Icon>
      <Icon size="lg"><StarIcon /></Icon>
      <Icon size="xl"><StarIcon /></Icon>
    </>
  );
}`,
        },

        {
          title: 'Common Icons',
          description: 'Examples of commonly used icons',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-2 sm:grid-cols-4"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Icon size="lg">
                  <HomeIcon />
                </Icon>
                <Body size="xs" color="secondary">Home</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Icon size="lg">
                  <UserIcon />
                </Icon>
                <Body size="xs" color="secondary">User</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Icon size="lg">
                  <Cog6ToothIcon />
                </Icon>
                <Body size="xs" color="secondary">Settings</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Icon size="lg">
                  <BellIcon />
                </Icon>
                <Body size="xs" color="secondary">Bell</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Icon size="lg">
                  <HeartIcon />
                </Icon>
                <Body size="xs" color="secondary">Heart</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Icon size="lg">
                  <PlusIcon />
                </Icon>
                <Body size="xs" color="secondary">Plus</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Icon size="lg">
                  <XMarkIcon />
                </Icon>
                <Body size="xs" color="secondary">Close</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Icon size="lg">
                  <StarIcon />
                </Icon>
                <Body size="xs" color="secondary">Star</Body>
              </Box>
            </Box>
          ),
          code: `import { Icon } from '../../../design/index';
import { HomeIcon, UserIcon, Cog6ToothIcon, BellIcon, HeartIcon, PlusIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';

export function CommonIcons() {
  return (
    <>
      <Icon size="lg"><HomeIcon /></Icon>
      <Icon size="lg"><UserIcon /></Icon>
      <Icon size="lg"><Cog6ToothIcon /></Icon>
      <Icon size="lg"><BellIcon /></Icon>
      <Icon size="lg"><HeartIcon /></Icon>
      <Icon size="lg"><PlusIcon /></Icon>
      <Icon size="lg"><XMarkIcon /></Icon>
      <Icon size="lg"><StarIcon /></Icon>
    </>
  );
}`,
        },
      ]}
    />
  );
}
