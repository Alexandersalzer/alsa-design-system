"use client";

import React from 'react';
import { Box, Body, Nav, Icon } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function NavPage() {
  return (
    <ComponentDocPage
      componentName="Nav"
      description="Navigation component with composable structure for building menus"
      importStatement={`import { Nav } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple navigation menu with Nav.Root, Nav.List, and Nav.Item',
          preview: (
            <Box
              display="flex"
              justify="center"
            >
              <Box style={{ width: '100%', maxWidth: '300px' }}>
                <Nav.Root>
                  <Nav.List>
                    <Nav.Item href="/dashboard">
                      <Icon><HomeIcon /></Icon>
                      Dashboard
                    </Nav.Item>
                    <Nav.Item href="/profile">
                      <Icon><UserIcon /></Icon>
                      Profile
                    </Nav.Item>
                    <Nav.Item href="/settings">
                      <Icon><Cog6ToothIcon /></Icon>
                      Settings
                    </Nav.Item>
                  </Nav.List>
                </Nav.Root>
              </Box>
            </Box>
          ),
          code: `<Nav.Root>
  <Nav.List>
    <Nav.Item href="/dashboard">
      <Icon><HomeIcon /></Icon>
      Dashboard
    </Nav.Item>
    <Nav.Item href="/profile">
      <Icon><UserIcon /></Icon>
      Profile
    </Nav.Item>
    <Nav.Item href="/settings">
      <Icon><Cog6ToothIcon /></Icon>
      Settings
    </Nav.Item>
  </Nav.List>
</Nav.Root>`,
        },

        {
          title: 'With Sections',
          description: 'Organize navigation items into sections with labels',
          preview: (
            <Box
              display="flex"
              justify="center"
            >
              <Box style={{ width: '100%', maxWidth: '300px' }}>
                <Nav.Root>
                  <Nav.Section label="Main">
                    <Nav.List>
                      <Nav.Item href="/dashboard">
                        <Icon><HomeIcon /></Icon>
                        Dashboard
                      </Nav.Item>
                      <Nav.Item href="/documents">
                        <Icon><DocumentTextIcon /></Icon>
                        Documents
                      </Nav.Item>
                    </Nav.List>
                  </Nav.Section>
                  <Nav.Section label="Account">
                    <Nav.List>
                      <Nav.Item href="/profile">
                        <Icon><UserIcon /></Icon>
                        Profile
                      </Nav.Item>
                      <Nav.Item href="/settings">
                        <Icon><Cog6ToothIcon /></Icon>
                        Settings
                      </Nav.Item>
                    </Nav.List>
                  </Nav.Section>
                </Nav.Root>
              </Box>
            </Box>
          ),
          code: `<Nav.Root>
  <Nav.Section label="Main">
    <Nav.List>
      <Nav.Item href="/dashboard">
        <Icon><HomeIcon /></Icon>
        Dashboard
      </Nav.Item>
      <Nav.Item href="/documents">
        <Icon><DocumentTextIcon /></Icon>
        Documents
      </Nav.Item>
    </Nav.List>
  </Nav.Section>
  <Nav.Section label="Account">
    <Nav.List>
      <Nav.Item href="/profile">
        <Icon><UserIcon /></Icon>
        Profile
      </Nav.Item>
      <Nav.Item href="/settings">
        <Icon><Cog6ToothIcon /></Icon>
        Settings
      </Nav.Item>
    </Nav.List>
  </Nav.Section>
</Nav.Root>`,
        },

        {
          title: 'Active State',
          description: 'Highlight the currently active navigation item',
          preview: (
            <Box
              display="flex"
              justify="center"
            >
              <Box style={{ width: '100%', maxWidth: '300px' }}>
                <Nav.Root>
                  <Nav.List>
                    <Nav.Item href="/dashboard" isActive>
                      <Icon><HomeIcon /></Icon>
                      Dashboard
                    </Nav.Item>
                    <Nav.Item href="/profile">
                      <Icon><UserIcon /></Icon>
                      Profile
                    </Nav.Item>
                    <Nav.Item href="/settings">
                      <Icon><Cog6ToothIcon /></Icon>
                      Settings
                    </Nav.Item>
                  </Nav.List>
                </Nav.Root>
              </Box>
            </Box>
          ),
          code: `<Nav.Root>
  <Nav.List>
    <Nav.Item href="/dashboard" active>
      <Icon><HomeIcon /></Icon>
      Dashboard
    </Nav.Item>
    <Nav.Item href="/profile">
      <Icon><UserIcon /></Icon>
      Profile
    </Nav.Item>
  </Nav.List>
</Nav.Root>`,
        },

        {
          title: 'Practical Example',
          description: 'Complete sidebar navigation',
          preview: (
            <Box
              display="flex"
              justify="center"
            >
              <Box style={{ width: '100%', maxWidth: '300px' }}>
                <Nav.Root>
                  <Nav.Section label="Main Menu">
                    <Nav.List>
                      <Nav.Item href="/dashboard" isActive>
                        <Icon><HomeIcon /></Icon>
                        Dashboard
                      </Nav.Item>
                      <Nav.Item href="/documents">
                        <Icon><DocumentTextIcon /></Icon>
                        Documents
                      </Nav.Item>
                    </Nav.List>
                  </Nav.Section>
                  <Nav.Section label="Settings">
                    <Nav.List>
                      <Nav.Item href="/profile">
                        <Icon><UserIcon /></Icon>
                        Profile
                      </Nav.Item>
                      <Nav.Item href="/settings">
                        <Icon><Cog6ToothIcon /></Icon>
                        Preferences
                      </Nav.Item>
                    </Nav.List>
                  </Nav.Section>
                </Nav.Root>
              </Box>
            </Box>
          ),
          code: `// Sidebar navigation with sections
<Nav.Root>
  <Nav.Section label="Main Menu">
    <Nav.List>
      <Nav.Item href="/dashboard" active>
        <Icon><HomeIcon /></Icon>
        Dashboard
      </Nav.Item>
      <Nav.Item href="/documents">
        <Icon><DocumentTextIcon /></Icon>
        Documents
      </Nav.Item>
    </Nav.List>
  </Nav.Section>
  <Nav.Section label="Settings">
    <Nav.List>
      <Nav.Item href="/profile">
        <Icon><UserIcon /></Icon>
        Profile
      </Nav.Item>
      <Nav.Item href="/settings">
        <Icon><Cog6ToothIcon /></Icon>
        Preferences
      </Nav.Item>
    </Nav.List>
  </Nav.Section>
</Nav.Root>`,
        },
      ]}
    />
  );
}
