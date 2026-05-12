"use client";

import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Body,
  Button,
  Drawer,
  Label,
  Input,
  Divider,
  Nav,
} from '../../../design/index';

import {
  HomeIcon,
  Cog6ToothIcon,
  UserIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function DrawerPage() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [topOpen, setTopOpen] = useState(false);
  const [bottomOpen, setBottomOpen] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [pillOpen, setPillOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <ComponentDocPage
      componentName="Drawer"
      description="Side panel overlay for navigation, settings, or supplementary content"
      importStatement={`import { Drawer } from '../../../design/index'`}
      sections={[
        // ===== BASIC USAGE =====
        {
          title: 'Basic Usage',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Button onClick={() => setLeftOpen(true)}>Open Drawer</Button>
              <Drawer
                isOpen={leftOpen}
                onClose={() => setLeftOpen(false)}
                type="left"
              >
                <VStack spacing="md">
                  <Body>This is a basic drawer example that slides in from the left.</Body>
                  <Body color="secondary">
                    Drawers are useful for navigation menus, settings panels, or additional content.
                  </Body>
                  <Button onClick={() => setLeftOpen(false)}>Close Drawer</Button>
                </VStack>
              </Drawer>
            </Box>
          ),
          code: `const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Open Drawer</Button>

<Drawer
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  type="left"
>
  <VStack spacing="md">
    <Body>This is a basic drawer example.</Body>
    <Button onClick={() => setIsOpen(false)}>Close</Button>
  </VStack>
</Drawer>`,
        },

        // ===== DRAWER TYPES =====
        {
          title: 'Drawer Types',
          description: 'Drawers support different types for various use cases and positions',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button size="sm" onClick={() => setLeftOpen(true)}>Left</Button>
                <Body size="xs" color="secondary">type="left"</Body>
                <Drawer
                  isOpen={leftOpen}
                  onClose={() => setLeftOpen(false)}
                  type="left"
                >
                  <VStack spacing="md">
                    <Body>This drawer slides in from the left side.</Body>
                    <Body color="secondary" size="sm">
                      Commonly used for navigation menus and primary actions.
                    </Body>
                    <Button variant="secondary" onClick={() => setLeftOpen(false)}>
                      Close
                    </Button>
                  </VStack>
                </Drawer>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button size="sm" onClick={() => setRightOpen(true)}>Right</Button>
                <Body size="xs" color="secondary">type="right"</Body>
                <Drawer
                  isOpen={rightOpen}
                  onClose={() => setRightOpen(false)}
                  type="right"
                >
                  <VStack spacing="md">
                    <Body>This drawer slides in from the right side.</Body>
                    <Body color="secondary" size="sm">
                      Often used for settings, filters, or supplementary information.
                    </Body>
                    <Button variant="secondary" onClick={() => setRightOpen(false)}>
                      Close
                    </Button>
                  </VStack>
                </Drawer>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button size="sm" onClick={() => setTopOpen(true)}>Top</Button>
                <Body size="xs" color="secondary">type="top"</Body>
                <Drawer
                  isOpen={topOpen}
                  onClose={() => setTopOpen(false)}
                  type="top"
                >
                  <VStack spacing="md">
                    <Body>This drawer slides in from the top.</Body>
                    <Body color="secondary" size="sm">
                      Useful for notifications, announcements, or contextual help.
                    </Body>
                    <Button variant="secondary" onClick={() => setTopOpen(false)}>
                      Close
                    </Button>
                  </VStack>
                </Drawer>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button size="sm" onClick={() => setBottomOpen(true)}>Bottom</Button>
                <Body size="xs" color="secondary">type="bottom"</Body>
                <Drawer
                  isOpen={bottomOpen}
                  onClose={() => setBottomOpen(false)}
                  type="bottom"
                >
                  <VStack spacing="md">
                    <Body>This drawer slides in from the bottom.</Body>
                    <Body color="secondary" size="sm">
                      Great for mobile-friendly actions or additional content.
                    </Body>
                    <Button variant="secondary" onClick={() => setBottomOpen(false)}>
                      Close
                    </Button>
                  </VStack>
                </Drawer>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button size="sm" onClick={() => setNavbarOpen(true)}>Navbar</Button>
                <Body size="xs" color="secondary">type="navbar"</Body>
                <Drawer
                  isOpen={navbarOpen}
                  onClose={() => setNavbarOpen(false)}
                  type="navbar"
                >
                  <VStack spacing="md">
                    <Body>This is a navbar-style drawer.</Body>
                    <Body color="secondary" size="sm">
                      Optimized for horizontal navigation bars.
                    </Body>
                    <Button variant="secondary" onClick={() => setNavbarOpen(false)}>
                      Close
                    </Button>
                  </VStack>
                </Drawer>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button size="sm" onClick={() => setPillOpen(true)}>Pill</Button>
                <Body size="xs" color="secondary">type="pill"</Body>
                <Drawer
                  isOpen={pillOpen}
                  onClose={() => setPillOpen(false)}
                  type="pill"
                >
                  <VStack spacing="md">
                    <Body>This is a pill-style drawer.</Body>
                    <Body color="secondary" size="sm">
                      Compact drawer with rounded corners.
                    </Body>
                    <Button variant="secondary" onClick={() => setPillOpen(false)}>
                      Close
                    </Button>
                  </VStack>
                </Drawer>
              </Box>
            </Box>
          ),
          code: `<Drawer type="left" isOpen={isOpen} onClose={onClose}>...</Drawer>
<Drawer type="right" isOpen={isOpen} onClose={onClose}>...</Drawer>
<Drawer type="top" isOpen={isOpen} onClose={onClose}>...</Drawer>
<Drawer type="bottom" isOpen={isOpen} onClose={onClose}>...</Drawer>
<Drawer type="navbar" isOpen={isOpen} onClose={onClose}>...</Drawer>
<Drawer type="pill" isOpen={isOpen} onClose={onClose}>...</Drawer>`,
        },

        // ===== INTERACTIVE EXAMPLES =====
        {
          title: 'Interactive Examples',
          description: 'Common drawer use cases with real-world content',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button variant="accent" onClick={() => setNavOpen(true)}>Navigation Menu</Button>
                <Body size="xs" color="secondary">With nav items</Body>
                <Drawer
                  isOpen={navOpen}
                  onClose={() => setNavOpen(false)}
                  type="left"
                >
                  <VStack spacing="md">
                    <Nav.Root variant="sidebar">
                      <Nav.List>
                        <Nav.Item icon={<HomeIcon className="w-5 h-5" />}>
                          Dashboard
                        </Nav.Item>
                        <Nav.Item icon={<ChartBarIcon className="w-5 h-5" />}>
                          Analytics
                        </Nav.Item>
                        <Nav.Item icon={<UserIcon className="w-5 h-5" />}>
                          Profile
                        </Nav.Item>
                        <Nav.Item icon={<DocumentTextIcon className="w-5 h-5" />}>
                          Documents
                        </Nav.Item>
                        <Nav.Item icon={<Cog6ToothIcon className="w-5 h-5" />}>
                          Settings
                        </Nav.Item>
                      </Nav.List>
                    </Nav.Root>
                    <Divider spacing="sm" />
                    <Button variant="secondary" onClick={() => setNavOpen(false)}>
                      Close Menu
                    </Button>
                  </VStack>
                </Drawer>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button variant="secondary" onClick={() => setSettingsOpen(true)}>Settings Panel</Button>
                <Body size="xs" color="secondary">With form controls</Body>
                <Drawer
                  isOpen={settingsOpen}
                  onClose={() => setSettingsOpen(false)}
                  type="right"
                >
                  <VStack spacing="lg">
                    <VStack spacing="sm">
                      <Label weight="semibold">Profile Settings</Label>
                      <Divider spacing="sm" />
                    </VStack>
                    <VStack spacing="sm">
                      <Label>Display Name</Label>
                      <Input placeholder="Enter your name" />
                    </VStack>
                    <VStack spacing="sm">
                      <Label>Email</Label>
                      <Input type="email" placeholder="you@example.com" />
                    </VStack>
                    <VStack spacing="sm">
                      <Label>Bio</Label>
                      <Input placeholder="Tell us about yourself" />
                    </VStack>
                    <HStack justify="end" spacing="sm">
                      <Button variant="secondary" onClick={() => setSettingsOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setSettingsOpen(false)}>
                        Save Changes
                      </Button>
                    </HStack>
                  </VStack>
                </Drawer>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Button variant="accent" onClick={() => setNotificationsOpen(true)}>Notifications</Button>
                <Body size="xs" color="secondary">With list content</Body>
                <Drawer
                  isOpen={notificationsOpen}
                  onClose={() => setNotificationsOpen(false)}
                  type="right"
                >
                  <VStack spacing="md">
                    <Box padding="sm" border="default" radius="md">
                      <VStack spacing="sm">
                        <HStack spacing="sm">
                          <BellIcon className="w-5 h-5 text-blue-500" />
                          <Body weight="semibold" size="sm">New message received</Body>
                        </HStack>
                        <Body size="xs" color="secondary">2 minutes ago</Body>
                      </VStack>
                    </Box>
                    <Box padding="sm" border="default" radius="md">
                      <VStack spacing="sm">
                        <HStack spacing="sm">
                          <UserIcon className="w-5 h-5 text-green-500" />
                          <Body weight="semibold" size="sm">New user registered</Body>
                        </HStack>
                        <Body size="xs" color="secondary">1 hour ago</Body>
                      </VStack>
                    </Box>
                    <Box padding="sm" border="default" radius="md">
                      <VStack spacing="sm">
                        <HStack spacing="sm">
                          <Cog6ToothIcon className="w-5 h-5 text-orange-500" />
                          <Body weight="semibold" size="sm">System update available</Body>
                        </HStack>
                        <Body size="xs" color="secondary">3 hours ago</Body>
                      </VStack>
                    </Box>
                    <Button variant="ghost" onClick={() => setNotificationsOpen(false)}>
                      Mark all as read
                    </Button>
                  </VStack>
                </Drawer>
              </Box>
            </Box>
          ),
          code: `// Navigation Drawer
<Drawer isOpen={isOpen} onClose={onClose} type="left">
  <VStack spacing="md">
    <Nav.Root variant="sidebar">
      <Nav.List>
        <Nav.Item icon={<HomeIcon />}>Dashboard</Nav.Item>
        <Nav.Item icon={<ChartBarIcon />}>Analytics</Nav.Item>
        <Nav.Item icon={<UserIcon />}>Profile</Nav.Item>
      </Nav.List>
    </Nav.Root>
  </VStack>
</Drawer>

// Settings Drawer
<Drawer isOpen={isOpen} onClose={onClose} type="right">
  <VStack spacing="lg">
    <VStack spacing="sm">
      <Label>Display Name</Label>
      <Input placeholder="Enter your name" />
    </VStack>
    <HStack justify="end" spacing="sm">
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button onClick={onClose}>Save</Button>
    </HStack>
  </VStack>
</Drawer>

// Notifications Drawer
<Drawer isOpen={isOpen} onClose={onClose} type="right">
  <VStack spacing="md">
    <Box padding="sm" border="default" radius="md">
      <VStack spacing="sm">
        <Body weight="semibold" size="sm">New message</Body>
        <Body size="xs" color="secondary">2 minutes ago</Body>
      </VStack>
    </Box>
  </VStack>
</Drawer>`,
        },
      ]}
    >
      {/* Props Section */}
      <VStack spacing="md">
        <Box>
          <VStack spacing="sm">
            <HStack spacing="md">
              <Body weight="semibold" className="min-w-[180px]">isOpen</Body>
              <Body color="secondary">boolean - Controls drawer visibility</Body>
            </HStack>
            <Divider spacing="sm" />
            <HStack spacing="md">
              <Body weight="semibold" className="min-w-[180px]">onClose</Body>
              <Body color="secondary">function - Callback when drawer is closed</Body>
            </HStack>
            <Divider spacing="sm" />
            <HStack spacing="md">
              <Body weight="semibold" className="min-w-[180px]">type</Body>
              <Body color="secondary">'left' | 'right' | 'top' | 'bottom' | 'navbar' | 'pill' - Drawer type and position</Body>
            </HStack>
            <Divider spacing="sm" />
            <HStack spacing="md">
              <Body weight="semibold" className="min-w-[180px]">children</Body>
              <Body color="secondary">ReactNode - Drawer content</Body>
            </HStack>
            <Divider spacing="sm" />
            <HStack spacing="md">
              <Body weight="semibold" className="min-w-[180px]">showCloseButton</Body>
              <Body color="secondary">boolean - Show close button in header (optional)</Body>
            </HStack>
            <Divider spacing="sm" />
            <HStack spacing="md">
              <Body weight="semibold" className="min-w-[180px]">closeButtonVariant</Body>
              <Body color="secondary">string - Variant for close button (optional)</Body>
            </HStack>
            <Divider spacing="sm" />
            <HStack spacing="md">
              <Body weight="semibold" className="min-w-[180px]">closeButtonLabel</Body>
              <Body color="secondary">string - Label for close button (optional)</Body>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </ComponentDocPage>
  );
}
