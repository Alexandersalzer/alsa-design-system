// @ts-nocheck
"use client";

import React, { useState } from 'react';
import { Box, Body, Button, Menu, Icon, HStack } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import {
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  FolderIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline';

export default function MenuPage() {
  const [selectedView, setSelectedView] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [showHidden, setShowHidden] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [multiSelectedKeys, setMultiSelectedKeys] = useState(new Set(['option1']));
  const [singleSelectedKey, setSingleSelectedKey] = useState(new Set(['default']));

  return (
    <ComponentDocPage
      componentName="Menu"
      description="Dropdown menu with selectable items for actions and navigation"
      importStatement={`import { Menu } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple menu with items',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Menu>
                <Menu.Trigger asChild>
                  <Button rightIcon={<Icon><ChevronDownIcon /></Icon>}>
                    Menu
                  </Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item onClick={() => console.log('Option 1')}>
                    Option 1
                  </Menu.Item>
                  <Menu.Item onClick={() => console.log('Option 2')}>
                    Option 2
                  </Menu.Item>
                  <Menu.Item onClick={() => console.log('Option 3')}>
                    Option 3
                  </Menu.Item>
                </Menu.Content>
              </Menu>
            </Box>
          ),
          code: `<Menu>
  <Menu.Trigger asChild>
    <Button rightIcon={<Icon><ChevronDownIcon /></Icon>}>
      Menu
    </Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item onClick={() => handleAction('option1')}>
      Option 1
    </Menu.Item>
    <Menu.Item onClick={() => handleAction('option2')}>
      Option 2
    </Menu.Item>
    <Menu.Item onClick={() => handleAction('option3')}>
      Option 3
    </Menu.Item>
  </Menu.Content>
</Menu>`,
        },

        {
          title: 'With Icons',
          description: 'Menu items with icons placed inside children',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Menu>
                <Menu.Trigger asChild>
                  <Button variant="secondary" rightIcon={<Icon><ChevronDownIcon /></Icon>}>
                    Actions
                  </Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item onClick={() => console.log('View')}>
                    <HStack spacing="sm" align="center">
                      <Icon size="sm"><EyeIcon /></Icon>
                      <Body size="sm">View Details</Body>
                    </HStack>
                  </Menu.Item>
                  <Menu.Item onClick={() => console.log('Edit')}>
                    <HStack spacing="sm" align="center">
                      <Icon size="sm"><PencilIcon /></Icon>
                      <Body size="sm">Edit Item</Body>
                    </HStack>
                  </Menu.Item>
                  <Menu.Item onClick={() => console.log('Share')}>
                    <HStack spacing="sm" align="center">
                      <Icon size="sm"><ShareIcon /></Icon>
                      <Body size="sm">Share</Body>
                    </HStack>
                  </Menu.Item>
                  <Menu.Item onClick={() => console.log('Archive')}>
                    <HStack spacing="sm" align="center">
                      <Icon size="sm"><ArchiveBoxIcon /></Icon>
                      <Body size="sm">Archive</Body>
                    </HStack>
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item onClick={() => console.log('Delete')}>
                    <HStack spacing="sm" align="center">
                      <Icon size="sm"><TrashIcon /></Icon>
                      <Body size="sm">Delete</Body>
                    </HStack>
                  </Menu.Item>
                </Menu.Content>
              </Menu>
            </Box>
          ),
          code: `<Menu>
  <Menu.Trigger asChild>
    <Button rightIcon={<Icon><ChevronDownIcon /></Icon>}>
      Actions
    </Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item onClick={() => handleAction('view')}>
      <HStack spacing="sm" align="center">
        <Icon size="sm"><EyeIcon /></Icon>
        <Body size="sm">View Details</Body>
      </HStack>
    </Menu.Item>
    <Menu.Separator />
    <Menu.Item onClick={() => handleAction('delete')}>
      <HStack spacing="sm" align="center">
        <Icon size="sm"><TrashIcon /></Icon>
        <Body size="sm">Delete</Body>
      </HStack>
    </Menu.Item>
  </Menu.Content>
</Menu>`,
        },

        {
          title: 'Menu Sizes',
          description: 'Different menu sizes',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1 sm:grid-cols-3"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Menu size="sm">
                  <Menu.Trigger asChild>
                    <Button size="sm">Small Menu</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item>Option 1</Menu.Item>
                    <Menu.Item>Option 2</Menu.Item>
                  </Menu.Content>
                </Menu>
                <Body size="xs" color="secondary">size="sm"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Menu size="md">
                  <Menu.Trigger asChild>
                    <Button size="md">Medium Menu</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item>Option 1</Menu.Item>
                    <Menu.Item>Option 2</Menu.Item>
                  </Menu.Content>
                </Menu>
                <Body size="xs" color="secondary">size="md"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Menu size="lg">
                  <Menu.Trigger asChild>
                    <Button size="lg">Large Menu</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item>Option 1</Menu.Item>
                    <Menu.Item>Option 2</Menu.Item>
                  </Menu.Content>
                </Menu>
                <Body size="xs" color="secondary">size="lg"</Body>
              </Box>
            </Box>
          ),
          code: [
            { code: `<Menu size="sm">\n  <Menu.Trigger asChild>\n    <Button size="sm">Small Menu</Button>\n  </Menu.Trigger>\n  <Menu.Content>\n    <Menu.Item>Option 1</Menu.Item>\n  </Menu.Content>\n</Menu>`, label: 'Small' },
            { code: `<Menu size="md">\n  <Menu.Trigger asChild>\n    <Button size="md">Medium Menu</Button>\n  </Menu.Trigger>\n  <Menu.Content>\n    <Menu.Item>Option 1</Menu.Item>\n  </Menu.Content>\n</Menu>`, label: 'Medium' },
            { code: `<Menu size="lg">\n  <Menu.Trigger asChild>\n    <Button size="lg">Large Menu</Button>\n  </Menu.Trigger>\n  <Menu.Content>\n    <Menu.Item>Option 1</Menu.Item>\n  </Menu.Content>\n</Menu>`, label: 'Large' },
          ],
          codeGridClassName: 'grid-cols-1 sm:grid-cols-3',
        },

        {
          title: 'Menu Variants',
          description: 'Different visual styles',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2">
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Menu variant="light">
                  <Menu.Trigger asChild>
                    <Button>Light Menu</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item>Light Item 1</Menu.Item>
                    <Menu.Item>Light Item 2</Menu.Item>
                    <Menu.Item>Light Item 3</Menu.Item>
                  </Menu.Content>
                </Menu>
                <Body size="xs" color="secondary">variant="light"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Menu variant="solid">
                  <Menu.Trigger asChild>
                    <Button>Solid Menu</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item>Solid Item 1</Menu.Item>
                    <Menu.Item>Solid Item 2</Menu.Item>
                    <Menu.Item>Solid Item 3</Menu.Item>
                  </Menu.Content>
                </Menu>
                <Body size="xs" color="secondary">variant="solid"</Body>
              </Box>
            </Box>
          ),
          code: [
            { code: `<Menu variant="subtle">...</Menu>`, label: 'Subtle' },
            { code: `<Menu variant="solid">...</Menu>`, label: 'Solid' },
          ],
          codeGridClassName: 'grid-cols-1 sm:grid-cols-2',
        },

        {
          title: 'Color Palettes',
          description: 'Different color themes',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-2 sm:grid-cols-3">
              {['blue', 'green', 'purple', 'red', 'orange', 'cyan'].map((color) => (
                <Box key={color} display="flex" direction="column" gap="sm" align="center" justify="center">
                  <Menu colorPalette={color as any}>
                    <Menu.Trigger asChild>
                      <Button size="sm">{color}</Button>
                    </Menu.Trigger>
                    <Menu.Content>
                      <Menu.Item>Action 1</Menu.Item>
                      <Menu.Item>Action 2</Menu.Item>
                    </Menu.Content>
                  </Menu>
                  <Body size="xs" color="secondary">{color}</Body>
                </Box>
              ))}
            </Box>
          ),
          code: [
            { code: `<Menu colorPalette="blue">...</Menu>`, label: 'Blue' },
            { code: `<Menu colorPalette="green">...</Menu>`, label: 'Green' },
            { code: `<Menu colorPalette="purple">...</Menu>`, label: 'Purple' },
            { code: `<Menu colorPalette="red">...</Menu>`, label: 'Red' },
          ],
          codeGridClassName: 'grid-cols-2 sm:grid-cols-4',
        },

        {
          title: 'Item Groups',
          description: 'Group related menu items with labels',
          preview: (
            <Box display="flex" justify="center" align="center">
              <Menu>
                <Menu.Trigger asChild>
                  <Button>New File</Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.ItemGroup label="Documents">
                    <Menu.Item onClick={() => console.log('Text')}>
                      <HStack spacing="sm" align="center">
                        <Icon size="sm"><DocumentTextIcon /></Icon>
                        <Body size="sm">Text Document</Body>
                      </HStack>
                    </Menu.Item>
                    <Menu.Item onClick={() => console.log('Folder')}>
                      <HStack spacing="sm" align="center">
                        <Icon size="sm"><FolderIcon /></Icon>
                        <Body size="sm">Folder</Body>
                      </HStack>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.Separator />
                  <Menu.ItemGroup label="Media">
                    <Menu.Item onClick={() => console.log('Photo')}>
                      <HStack spacing="sm" align="center">
                        <Icon size="sm"><PhotoIcon /></Icon>
                        <Body size="sm">Photo</Body>
                      </HStack>
                    </Menu.Item>
                    <Menu.Item onClick={() => console.log('Video')}>
                      <HStack spacing="sm" align="center">
                        <Icon size="sm"><VideoCameraIcon /></Icon>
                        <Body size="sm">Video</Body>
                      </HStack>
                    </Menu.Item>
                    <Menu.Item onClick={() => console.log('Audio')}>
                      <HStack spacing="sm" align="center">
                        <Icon size="sm"><MusicalNoteIcon /></Icon>
                        <Body size="sm">Audio</Body>
                      </HStack>
                    </Menu.Item>
                  </Menu.ItemGroup>
                </Menu.Content>
              </Menu>
            </Box>
          ),
          code: `<Menu>
  <Menu.Trigger asChild>
    <Button>New File</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.ItemGroup label="Documents">
      <Menu.Item>Text Document</Menu.Item>
      <Menu.Item>Folder</Menu.Item>
    </Menu.ItemGroup>
    <Menu.Separator />
    <Menu.ItemGroup label="Media">
      <Menu.Item>Photo</Menu.Item>
      <Menu.Item>Video</Menu.Item>
      <Menu.Item>Audio</Menu.Item>
    </Menu.ItemGroup>
  </Menu.Content>
</Menu>`,
        },

        {
          title: 'Checkbox Items',
          description: 'Multi-select options with checkboxes',
          preview: (
            <Box display="flex" justify="center" align="center">
              <Menu closeOnSelect={false}>
                <Menu.Trigger asChild>
                  <Button>View Options</Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.CheckboxItem
                    value="hidden"
                    checked={showHidden}
                    onChange={setShowHidden}
                  >
                    Show Hidden Files
                  </Menu.CheckboxItem>
                  <Menu.CheckboxItem
                    value="notifications"
                    checked={notifications}
                    onChange={setNotifications}
                  >
                    Enable Notifications
                  </Menu.CheckboxItem>
                  <Menu.CheckboxItem
                    value="sound"
                    checked={soundEnabled}
                    onChange={setSoundEnabled}
                  >
                    Enable Sound
                  </Menu.CheckboxItem>
                </Menu.Content>
              </Menu>
            </Box>
          ),
          code: `const [showHidden, setShowHidden] = useState(false);
const [notifications, setNotifications] = useState(true);

<Menu closeOnSelect={false}>
  <Menu.Trigger asChild>
    <Button>View Options</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.CheckboxItem
      value="hidden"
      checked={showHidden}
      onChange={setShowHidden}
    >
      Show Hidden Files
    </Menu.CheckboxItem>
    <Menu.CheckboxItem
      value="notifications"
      checked={notifications}
      onChange={setNotifications}
    >
      Enable Notifications
    </Menu.CheckboxItem>
  </Menu.Content>
</Menu>`,
        },

        {
          title: 'Radio Items',
          description: 'Single-select options with radio buttons',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2">
              <Box display="flex" justify="center" align="center">
                <Menu closeOnSelect={false}>
                  <Menu.Trigger asChild>
                    <Button>View: {selectedView}</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.RadioItemGroup value={selectedView} onValueChange={setSelectedView}>
                      <Menu.RadioItem value="grid">Grid View</Menu.RadioItem>
                      <Menu.RadioItem value="list">List View</Menu.RadioItem>
                      <Menu.RadioItem value="columns">Columns View</Menu.RadioItem>
                    </Menu.RadioItemGroup>
                  </Menu.Content>
                </Menu>
              </Box>
              <Box display="flex" justify="center" align="center">
                <Menu closeOnSelect={false}>
                  <Menu.Trigger asChild>
                    <Button>Sort by: {sortBy}</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.RadioItemGroup value={sortBy} onValueChange={setSortBy}>
                      <Menu.RadioItem value="name">Name</Menu.RadioItem>
                      <Menu.RadioItem value="date">Date Modified</Menu.RadioItem>
                      <Menu.RadioItem value="size">Size</Menu.RadioItem>
                      <Menu.RadioItem value="type">Type</Menu.RadioItem>
                    </Menu.RadioItemGroup>
                  </Menu.Content>
                </Menu>
              </Box>
            </Box>
          ),
          code: `const [selectedView, setSelectedView] = useState('grid');

<Menu closeOnSelect={false}>
  <Menu.Trigger asChild>
    <Button>View: {selectedView}</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.RadioItemGroup value={selectedView} onValueChange={setSelectedView}>
      <Menu.RadioItem value="grid">Grid View</Menu.RadioItem>
      <Menu.RadioItem value="list">List View</Menu.RadioItem>
      <Menu.RadioItem value="columns">Columns View</Menu.RadioItem>
    </Menu.RadioItemGroup>
  </Menu.Content>
</Menu>`,
        },

        {
          title: 'Keyboard Shortcuts',
          description: 'Display keyboard shortcuts with Menu.ItemCommand',
          preview: (
            <Box display="flex" justify="center" align="center">
              <Menu>
                <Menu.Trigger asChild>
                  <Button>Edit</Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item onClick={() => console.log('Undo')}>
                    <HStack spacing="md" align="center" justify="between" className="w-full">
                      <Body size="sm">Undo</Body>
                      <Menu.ItemCommand>⌘Z</Menu.ItemCommand>
                    </HStack>
                  </Menu.Item>
                  <Menu.Item onClick={() => console.log('Redo')}>
                    <HStack spacing="md" align="center" justify="between" className="w-full">
                      <Body size="sm">Redo</Body>
                      <Menu.ItemCommand>⌘⇧Z</Menu.ItemCommand>
                    </HStack>
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item onClick={() => console.log('Cut')}>
                    <HStack spacing="md" align="center" justify="between" className="w-full">
                      <Body size="sm">Cut</Body>
                      <Menu.ItemCommand>⌘X</Menu.ItemCommand>
                    </HStack>
                  </Menu.Item>
                  <Menu.Item onClick={() => console.log('Copy')}>
                    <HStack spacing="md" align="center" justify="between" className="w-full">
                      <Body size="sm">Copy</Body>
                      <Menu.ItemCommand>⌘C</Menu.ItemCommand>
                    </HStack>
                  </Menu.Item>
                  <Menu.Item onClick={() => console.log('Paste')}>
                    <HStack spacing="md" align="center" justify="between" className="w-full">
                      <Body size="sm">Paste</Body>
                      <Menu.ItemCommand>⌘V</Menu.ItemCommand>
                    </HStack>
                  </Menu.Item>
                </Menu.Content>
              </Menu>
            </Box>
          ),
          code: `<Menu>
  <Menu.Trigger asChild>
    <Button>Edit</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item onClick={handleUndo}>
      <HStack spacing="md" justify="between" className="w-full">
        <Body size="sm">Undo</Body>
        <Menu.ItemCommand>⌘Z</Menu.ItemCommand>
      </HStack>
    </Menu.Item>
    <Menu.Item onClick={handleCopy}>
      <HStack spacing="md" justify="between" className="w-full">
        <Body size="sm">Copy</Body>
        <Menu.ItemCommand>⌘C</Menu.ItemCommand>
      </HStack>
    </Menu.Item>
  </Menu.Content>
</Menu>`,
        },

        {
          title: 'Disabled Items',
          description: 'Menu items can be disabled',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Menu>
                <Menu.Trigger asChild>
                  <Button>Options</Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item onClick={() => console.log('Enabled')}>
                    Enabled Item
                  </Menu.Item>
                  <Menu.Item disabled>
                    Disabled Item
                  </Menu.Item>
                  <Menu.Item onClick={() => console.log('Another')}>
                    Another Item
                  </Menu.Item>
                </Menu.Content>
              </Menu>
            </Box>
          ),
          code: `<Menu>
  <Menu.Trigger asChild>
    <Button>Options</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item onClick={handleAction}>
      Enabled Item
    </Menu.Item>
    <Menu.Item disabled>
      Disabled Item
    </Menu.Item>
  </Menu.Content>
</Menu>`,
        },

        {
          title: 'Practical Example',
          description: 'User account menu with profile, settings, and logout',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Menu>
                <Menu.Trigger asChild>
                  <Button variant="ghost" rightIcon={<Icon><ChevronDownIcon /></Icon>}>
                    <HStack spacing="sm" align="center">
                      <Icon><UserIcon /></Icon>
                      <Body size="sm">John Doe</Body>
                    </HStack>
                  </Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item onClick={() => console.log('Profile')}>
                    <HStack spacing="sm" align="center">
                      <Icon size="sm"><UserIcon /></Icon>
                      <Body size="sm">View Profile</Body>
                    </HStack>
                  </Menu.Item>
                  <Menu.Item onClick={() => console.log('Settings')}>
                    <HStack spacing="sm" align="center">
                      <Icon size="sm"><Cog6ToothIcon /></Icon>
                      <Body size="sm">Settings</Body>
                    </HStack>
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item onClick={() => console.log('Logout')}>
                    <HStack spacing="sm" align="center">
                      <Icon size="sm"><ArrowRightOnRectangleIcon /></Icon>
                      <Body size="sm">Logout</Body>
                    </HStack>
                  </Menu.Item>
                </Menu.Content>
              </Menu>
            </Box>
          ),
          code: `<Menu>
  <Menu.Trigger asChild>
    <Button variant="ghost">
      <HStack spacing="sm">
        <Icon><UserIcon /></Icon>
        <Body size="sm">John Doe</Body>
      </HStack>
    </Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item onClick={handleProfile}>
      <HStack spacing="sm">
        <Icon size="sm"><UserIcon /></Icon>
        <Body size="sm">View Profile</Body>
      </HStack>
    </Menu.Item>
    <Menu.Item onClick={handleSettings}>
      <HStack spacing="sm">
        <Icon size="sm"><Cog6ToothIcon /></Icon>
        <Body size="sm">Settings</Body>
      </HStack>
    </Menu.Item>
    <Menu.Separator />
    <Menu.Item onClick={handleLogout}>
      <HStack spacing="sm">
        <Icon size="sm"><ArrowRightOnRectangleIcon /></Icon>
        <Body size="sm">Logout</Body>
      </HStack>
    </Menu.Item>
  </Menu.Content>
</Menu>`,
        },

        {
          title: 'Menu Variants',
          description: 'Different visual styles for dropdown surface, borders, shadows, and hover states',
          preview: (
            <Box display="grid" gap="lg" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Menu variant="solid">
                  <Menu.Trigger asChild>
                    <Button size="sm">Solid</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item>Strong background</Menu.Item>
                    <Menu.Item>Large shadow</Menu.Item>
                    <Menu.Item>Bold appearance</Menu.Item>
                  </Menu.Content>
                </Menu>
                <Body size="xs" color="secondary" align="center" className="mt-2">
                  <strong>Solid</strong><br/>
                  Strong filled appearance with large shadow
                </Body>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Menu variant="bordered">
                  <Menu.Trigger asChild>
                    <Button size="sm">Bordered</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item>2px border</Menu.Item>
                    <Menu.Item>Clean outline</Menu.Item>
                    <Menu.Item>Light background</Menu.Item>
                  </Menu.Content>
                </Menu>
                <Body size="xs" color="secondary" align="center" className="mt-2">
                  <strong>Bordered</strong><br/>
                  Outlined with emphasized borders
                </Body>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Menu variant="light">
                  <Menu.Trigger asChild>
                    <Button size="sm">Light</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item>Subtle background</Menu.Item>
                    <Menu.Item>Light border</Menu.Item>
                    <Menu.Item>Minimal shadow</Menu.Item>
                  </Menu.Content>
                </Menu>
                <Body size="xs" color="secondary" align="center" className="mt-2">
                  <strong>Light</strong><br/>
                  Subtle with light background
                </Body>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Menu variant="flat">
                  <Menu.Trigger asChild>
                    <Button size="sm">Flat</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item>No shadows</Menu.Item>
                    <Menu.Item>Flat design</Menu.Item>
                    <Menu.Item>Minimal style</Menu.Item>
                  </Menu.Content>
                </Menu>
                <Body size="xs" color="secondary" align="center" className="mt-2">
                  <strong>Flat</strong><br/>
                  Minimal with no shadows
                </Body>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Menu variant="faded">
                  <Menu.Trigger asChild>
                    <Button size="sm">Faded</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item>Frosted glass</Menu.Item>
                    <Menu.Item>Backdrop blur</Menu.Item>
                    <Menu.Item>Translucent</Menu.Item>
                  </Menu.Content>
                </Menu>
                <Body size="xs" color="secondary" align="center" className="mt-2">
                  <strong>Faded</strong><br/>
                  Frosted glass with backdrop blur
                </Body>
              </Box>

              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Menu variant="shadow">
                  <Menu.Trigger asChild>
                    <Button size="sm">Shadow</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item>Large shadows</Menu.Item>
                    <Menu.Item>Elevated feel</Menu.Item>
                    <Menu.Item>Lift on hover</Menu.Item>
                  </Menu.Content>
                </Menu>
                <Body size="xs" color="secondary" align="center" className="mt-2">
                  <strong>Shadow</strong><br/>
                  Prominent shadows with elevation
                </Body>
              </Box>
            </Box>
          ),
          code: [
            { code: `// Solid - Strong filled appearance\n<Menu variant="solid">\n  <Menu.Trigger asChild>\n    <Button>Menu</Button>\n  </Menu.Trigger>\n  <Menu.Content>\n    <Menu.Item>Item 1</Menu.Item>\n  </Menu.Content>\n</Menu>`, label: 'Solid' },
            { code: `// Bordered - Outlined with emphasis\n<Menu variant="bordered">\n  <Menu.Trigger asChild>\n    <Button>Menu</Button>\n  </Menu.Trigger>\n  <Menu.Content>\n    <Menu.Item>Item 1</Menu.Item>\n  </Menu.Content>\n</Menu>`, label: 'Bordered' },
            { code: `// Light - Subtle background\n<Menu variant="light">\n  <Menu.Trigger asChild>\n    <Button>Menu</Button>\n  </Menu.Trigger>\n  <Menu.Content>\n    <Menu.Item>Item 1</Menu.Item>\n  </Menu.Content>\n</Menu>`, label: 'Light' },
            { code: `// Flat - No shadows\n<Menu variant="flat">\n  <Menu.Trigger asChild>\n    <Button>Menu</Button>\n  </Menu.Trigger>\n  <Menu.Content>\n    <Menu.Item>Item 1</Menu.Item>\n  </Menu.Content>\n</Menu>`, label: 'Flat' },
            { code: `// Faded - Frosted glass\n<Menu variant="faded">\n  <Menu.Trigger asChild>\n    <Button>Menu</Button>\n  </Menu.Trigger>\n  <Menu.Content>\n    <Menu.Item>Item 1</Menu.Item>\n  </Menu.Content>\n</Menu>`, label: 'Faded' },
            { code: `// Shadow - Prominent elevation\n<Menu variant="shadow">\n  <Menu.Trigger asChild>\n    <Button>Menu</Button>\n  </Menu.Trigger>\n  <Menu.Content>\n    <Menu.Item>Item 1</Menu.Item>\n  </Menu.Content>\n</Menu>`, label: 'Shadow' },
          ],
          codeGridClassName: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        },


        {
          title: 'Animations - Container',
          description: 'Animate the entire menu with fade, opacity, bounce, or opacityBounce',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-2 sm:grid-cols-4">
              {[
                { variant: 'fade', label: 'Fade' },
                { variant: 'opacity', label: 'Opacity' },
                { variant: 'bounce', label: 'Bounce' },
                { variant: 'opacityBounce', label: 'Opacity Bounce' },
              ].map(({ variant, label }) => (
                <Box key={variant} display="flex" direction="column" gap="sm" align="center" justify="center">
                  <Menu animationVariant={variant as any} animateContainer>
                    <Menu.Trigger asChild>
                      <Button size="sm">{label}</Button>
                    </Menu.Trigger>
                    <Menu.Content>
                      <Menu.Item>Item 1</Menu.Item>
                      <Menu.Item>Item 2</Menu.Item>
                      <Menu.Item>Item 3</Menu.Item>
                    </Menu.Content>
                  </Menu>
                  <Body size="xs" color="secondary">{label}</Body>
                </Box>
              ))}
            </Box>
          ),
          code: `<Menu
  animationVariant="bounce"
  animateContainer
>
  <Menu.Trigger asChild>
    <Button>Animated Menu</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item>Item 1</Menu.Item>
    <Menu.Item>Item 2</Menu.Item>
  </Menu.Content>
</Menu>`,
        },

        {
          title: 'Animations - Stagger Items',
          description: 'Animate items with stagger effect for smooth sequential appearance',
          preview: (
            <Box display="flex" justify="center" align="center">
              <Menu
                animationVariant="opacityBounce"
                animateContainer
                animateItems
                itemStagger={75}
              >
                <Menu.Trigger asChild>
                  <Button>Stagger Animation</Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item>First Item (0ms)</Menu.Item>
                  <Menu.Item>Second Item (75ms)</Menu.Item>
                  <Menu.Item>Third Item (150ms)</Menu.Item>
                  <Menu.Item>Fourth Item (225ms)</Menu.Item>
                  <Menu.Item>Fifth Item (300ms)</Menu.Item>
                </Menu.Content>
              </Menu>
            </Box>
          ),
          code: `<Menu
  animationVariant="opacityBounce"
  animateContainer
  animateItems
  itemStagger={75}
>
  <Menu.Trigger asChild>
    <Button>Stagger Menu</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item>Item 1</Menu.Item>
    <Menu.Item>Item 2</Menu.Item>
    <Menu.Item>Item 3</Menu.Item>
    <Menu.Item>Item 4</Menu.Item>
  </Menu.Content>
</Menu>`,
        },

        {
          title: 'Placement - Horizontal Alignment',
          description: 'Align menu horizontally: start (left), center, or end (right) relative to trigger',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-3">
              {[
                { placement: 'bottom-start', label: 'Start (Left Align)', description: 'Aligns left edges' },
                { placement: 'bottom', label: 'Center', description: 'Centers menu' },
                { placement: 'bottom-end', label: 'End (Right Align)', description: 'Aligns right edges' },
              ].map(({ placement, label, description }) => (
                <Box key={placement} display="flex" direction="column" gap="sm" align="center" justify="center">
                  <Menu placement={placement as any}>
                    <Menu.Trigger asChild>
                      <Button size="sm">{label}</Button>
                    </Menu.Trigger>
                    <Menu.Content>
                      <Menu.Item>Action 1</Menu.Item>
                      <Menu.Item>Action 2</Menu.Item>
                      <Menu.Item>Action 3</Menu.Item>
                      <Menu.Item>Action 4</Menu.Item>
                    </Menu.Content>
                  </Menu>
                  <Body size="xs" color="secondary" align="center">{description}</Body>
                </Box>
              ))}
            </Box>
          ),
          code: [
            { code: `<Menu placement="bottom">...</Menu>`, label: 'Start (Left)' },
            { code: `<Menu placement="bottom">...</Menu>`, label: 'Center' },
            { code: `<Menu placement="bottom-end">...</Menu>`, label: 'End (Right)' },
          ],
          codeGridClassName: 'grid-cols-1 sm:grid-cols-3',
        },

        {
          title: 'Placement - Vertical Position',
          description: 'Position menu above (top) or below (bottom) the trigger',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2" style={{ paddingTop: 'var(--foundation-space-8)', paddingBottom: 'var(--foundation-space-8)' }}>
              {[
                { placement: 'top', label: 'Top', description: 'Opens above trigger' },
                { placement: 'bottom', label: 'Bottom', description: 'Opens below trigger' },
              ].map(({ placement, label, description }) => (
                <Box key={placement} display="flex" direction="column" gap="sm" align="center" justify="center">
                  <Menu placement={placement as any}>
                    <Menu.Trigger asChild>
                      <Button size="sm">{label}</Button>
                    </Menu.Trigger>
                    <Menu.Content>
                      <Menu.Item>Action 1</Menu.Item>
                      <Menu.Item>Action 2</Menu.Item>
                      <Menu.Item>Action 3</Menu.Item>
                    </Menu.Content>
                  </Menu>
                  <Body size="xs" color="secondary" align="center">{description}</Body>
                </Box>
              ))}
            </Box>
          ),
          code: [
            { code: `<Menu placement="top">...</Menu>`, label: 'Top' },
            { code: `<Menu placement="bottom">...</Menu>`, label: 'Bottom' },
          ],
          codeGridClassName: 'grid-cols-1 sm:grid-cols-2',
        },

        {
          title: 'Selection Modes',
          description: 'Single or multiple selection with selectedKeys control',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2">
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Menu
                  selectionMode="single"
                  selectedKeys={singleSelectedKey}
                  onSelectionChange={(keys) => setSingleSelectedKey(keys)}
                  color="primary"
                  variant="flat"
                >
                  <Menu.Trigger asChild>
                    <Button size="sm">Single Selection</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item itemKey="default">Default Option</Menu.Item>
                    <Menu.Item itemKey="option2">Option 2</Menu.Item>
                    <Menu.Item itemKey="option3">Option 3</Menu.Item>
                  </Menu.Content>
                </Menu>
                <Body size="xs" color="secondary">selectionMode="single"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Menu
                  selectionMode="multiple"
                  selectedKeys={multiSelectedKeys}
                  onSelectionChange={(keys) => setMultiSelectedKeys(keys)}
                  closeOnSelect={false}
                  color="success"
                  variant="flat"
                >
                  <Menu.Trigger asChild>
                    <Button size="sm">Multi Selection</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item itemKey="option1">Option 1</Menu.Item>
                    <Menu.Item itemKey="option2">Option 2</Menu.Item>
                    <Menu.Item itemKey="option3">Option 3</Menu.Item>
                  </Menu.Content>
                </Menu>
                <Body size="xs" color="secondary">selectionMode="multiple"</Body>
              </Box>
            </Box>
          ),
          code: `// Single selection
const [selectedKey, setSelectedKey] = useState(new Set(['default']));

<Menu
  selectionMode="single"
  selectedKeys={selectedKey}
  onSelectionChange={setSelectedKey}
>
  <Menu.Trigger asChild>
    <Button>Select One</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item itemKey="option1">Option 1</Menu.Item>
    <Menu.Item itemKey="option2">Option 2</Menu.Item>
  </Menu.Content>
</Menu>

// Multiple selection
const [selectedKeys, setSelectedKeys] = useState(new Set(['opt1']));

<Menu
  selectionMode="multiple"
  selectedKeys={selectedKeys}
  onSelectionChange={setSelectedKeys}
  closeOnSelect={false}
>
  <Menu.Trigger asChild>
    <Button>Select Multiple</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item itemKey="opt1">Option 1</Menu.Item>
    <Menu.Item itemKey="opt2">Option 2</Menu.Item>
  </Menu.Content>
</Menu>`,
        },

        {
          title: 'Enhanced Items - Icons & Descriptions',
          description: 'Items with startContent, endContent, description, and shortcuts',
          preview: (
            <Box display="flex" justify="center" align="center">
              <Menu variant="faded">
                <Menu.Trigger asChild>
                  <Button>File Actions</Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item
                    key="view"
                    startContent={<Icon size="sm"><EyeIcon /></Icon>}
                    description="View file details and metadata"
                    shortcut="⌘V"
                  >
                    View Details
                  </Menu.Item>
                  <Menu.Item
                    key="edit"
                    startContent={<Icon size="sm"><PencilIcon /></Icon>}
                    description="Edit file contents"
                    shortcut="⌘E"
                  >
                    Edit File
                  </Menu.Item>
                  <Menu.Item
                    key="share"
                    startContent={<Icon size="sm"><ShareIcon /></Icon>}
                    description="Share with others"
                    shortcut="⌘S"
                  >
                    Share
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item
                    key="delete"
                    startContent={<Icon size="sm"><TrashIcon /></Icon>}
                    description="Permanently delete this file"
                    shortcut="⌘⇧D"
                  >
                    Delete
                  </Menu.Item>
                </Menu.Content>
              </Menu>
            </Box>
          ),
          code: `<Menu variant="faded">
  <Menu.Trigger asChild>
    <Button>Actions</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item
      key="view"
      startContent={<Icon><EyeIcon /></Icon>}
      description="View details and metadata"
      shortcut="⌘V"
    >
      View Details
    </Menu.Item>
    <Menu.Item
      key="edit"
      startContent={<Icon><PencilIcon /></Icon>}
      description="Edit file contents"
      shortcut="⌘E"
    >
      Edit File
    </Menu.Item>
  </Menu.Content>
</Menu>`,
        },

        {
          title: 'Website Navigation Menu',
          description: 'Navigation menu for website header with links and dropdowns',
          preview: (
            <Box padding="lg" border="default" radius="lg" display="flex" justify="center" align="center">
              <HStack spacing="md" align="center">
                <Menu trigger='hover' placement="bottom" animationVariant="fade" animateContainer>
                  <Menu.Trigger asChild>
                    <Button variant="ghost" size="sm">Products</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.ItemGroup title="Solutions">
                      <Menu.Item itemKey="analytics">Analytics Dashboard</Menu.Item>
                      <Menu.Item itemKey="reporting">Reporting Tools</Menu.Item>
                      <Menu.Item itemKey="automation">Automation Suite</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.Separator />
                    <Menu.ItemGroup title="Integrations">
                      <Menu.Item itemKey="api">API Access</Menu.Item>
                      <Menu.Item itemKey="webhooks">Webhooks</Menu.Item>
                    </Menu.ItemGroup>
                  </Menu.Content>
                </Menu>
                <Menu trigger='hover' placement="bottom" animationVariant="fade" animateContainer>
                  <Menu.Trigger asChild>
                    <Button variant="ghost" size="sm">Resources</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item itemKey="docs">Documentation</Menu.Item>
                    <Menu.Item itemKey="blog">Blog</Menu.Item>
                    <Menu.Item itemKey="guides">Guides</Menu.Item>
                    <Menu.Item itemKey="api-ref">API Reference</Menu.Item>
                  </Menu.Content>
                </Menu>
                <Menu trigger='hover' placement="bottom" animationVariant="fade" animateContainer>
                  <Menu.Trigger asChild>
                    <Button variant="ghost" size="sm">
                      <Icon size="sm"><UserIcon /></Icon>
                    </Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item itemKey="profile">My Profile</Menu.Item>
                    <Menu.Item itemKey="billing">Billing</Menu.Item>
                    <Menu.Item itemKey="settings">Settings</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item itemKey="logout">Sign Out</Menu.Item>
                  </Menu.Content>
                </Menu>
              </HStack>
            </Box>
          ),
          code: `// Website navbar menu
<nav>
  <HStack spacing="md">
    <Menu placement="bottom" animationVariant="fade" animateContainer>
      <Menu.Trigger asChild>
        <Button variant="ghost">Products</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.ItemGroup title="Solutions">
          <Menu.Item itemKey="analytics">Analytics</Menu.Item>
          <Menu.Item itemKey="reporting">Reporting</Menu.Item>
        </Menu.ItemGroup>
        <Menu.Separator />
        <Menu.ItemGroup title="Integrations">
          <Menu.Item itemKey="api">API Access</Menu.Item>
        </Menu.ItemGroup>
      </Menu.Content>
    </Menu>

    <Menu placement="bottom">
      <Menu.Trigger asChild>
        <Button variant="ghost">Resources</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item itemKey="docs">Documentation</Menu.Item>
        <Menu.Item itemKey="blog">Blog</Menu.Item>
      </Menu.Content>
    </Menu>
  </HStack>
</nav>`,
        },

        {
          title: 'Dashboard - Actions Menu',
          description: 'Context menu for table rows with quick actions',
          preview: (
            <Box display="flex" justify="center" align="center">
              <Menu
                placement="bottom-end"
                animationVariant="opacityBounce"
                animateContainer
                animateItems
                itemStagger={50}
              >
                <Menu.Trigger asChild>
                  <Button variant="ghost" size="sm">
                    <Icon size="sm"><ChevronDownIcon /></Icon>
                  </Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item
                    key="view"
                    startContent={<Icon size="sm"><EyeIcon /></Icon>}
                    onClick={() => console.log('View')}
                  >
                    View Details
                  </Menu.Item>
                  <Menu.Item
                    key="edit"
                    startContent={<Icon size="sm"><PencilIcon /></Icon>}
                    onClick={() => console.log('Edit')}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    key="share"
                    startContent={<Icon size="sm"><ShareIcon /></Icon>}
                    onClick={() => console.log('Share')}
                  >
                    Share
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item
                    key="archive"
                    startContent={<Icon size="sm"><ArchiveBoxIcon /></Icon>}
                    onClick={() => console.log('Archive')}
                  >
                    Archive
                  </Menu.Item>
                  <Menu.Item
                    key="delete"
                    startContent={<Icon size="sm"><TrashIcon /></Icon>}
                    onClick={() => console.log('Delete')}
                    color="danger"
                    showDivider
                  >
                    Delete
                  </Menu.Item>
                </Menu.Content>
              </Menu>
            </Box>
          ),
          code: `// Dashboard row actions
<Menu
  placement="bottom-end"
  animationVariant="opacityBounce"
  animateContainer
  animateItems
>
  <Menu.Trigger asChild>
    <Button variant="ghost" size="sm">
      <Icon><DotsVerticalIcon /></Icon>
    </Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Item
      key="view"
      startContent={<Icon><EyeIcon /></Icon>}
      onClick={() => handleView(id)}
    >
      View Details
    </Menu.Item>
    <Menu.Item
      key="edit"
      startContent={<Icon><PencilIcon /></Icon>}
      onClick={() => handleEdit(id)}
    >
      Edit
    </Menu.Item>
    <Menu.Separator />
    <Menu.Item
      key="delete"
      startContent={<Icon><TrashIcon /></Icon>}
      onClick={() => handleDelete(id)}
      color="danger"
    >
      Delete
    </Menu.Item>
  </Menu.Content>
</Menu>`,
        },

        {
          title: 'Dashboard - Filter Menu',
          description: 'Multi-select filter menu with selection state',
          preview: (
            <Box display="flex" justify="center" align="center">
              <Menu
                selectionMode="multiple"
                selectedKeys={multiSelectedKeys}
                onSelectionChange={(keys) => setMultiSelectedKeys(keys)}
                closeOnSelect={false}
                variant="bordered"
                animationVariant="fade"
                animateContainer
              >
                <Menu.Trigger asChild>
                  <Button variant="outline" size="sm">
                    Filter ({multiSelectedKeys.size})
                  </Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.ItemGroup title="Status">
                    <Menu.Item itemKey="active">Active</Menu.Item>
                    <Menu.Item itemKey="pending">Pending</Menu.Item>
                    <Menu.Item itemKey="completed">Completed</Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.Separator />
                  <Menu.ItemGroup title="Priority">
                    <Menu.Item itemKey="high">High Priority</Menu.Item>
                    <Menu.Item itemKey="medium">Medium Priority</Menu.Item>
                    <Menu.Item itemKey="low">Low Priority</Menu.Item>
                  </Menu.ItemGroup>
                </Menu.Content>
              </Menu>
            </Box>
          ),
          code: `// Dashboard filter menu
const [filters, setFilters] = useState(new Set(['active']));

<Menu
  selectionMode="multiple"
  selectedKeys={filters}
  onSelectionChange={setFilters}
  closeOnSelect={false}
  variant="bordered"
>
  <Menu.Trigger asChild>
    <Button variant="outline">
      Filter ({filters.size})
    </Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.ItemGroup title="Status">
      <Menu.Item itemKey="active">Active</Menu.Item>
      <Menu.Item itemKey="pending">Pending</Menu.Item>
      <Menu.Item itemKey="completed">Completed</Menu.Item>
    </Menu.ItemGroup>
    <Menu.Separator />
    <Menu.ItemGroup title="Priority">
      <Menu.Item itemKey="high">High</Menu.Item>
      <Menu.Item itemKey="medium">Medium</Menu.Item>
      <Menu.Item itemKey="low">Low</Menu.Item>
    </Menu.ItemGroup>
  </Menu.Content>
</Menu>`,
        },

        {
          title: 'Navbar-Style Hover Menus',
          description: 'Multiple menus in a horizontal row that open on hover - perfect for website navigation',
          preview: (
            <Box display="flex" justify="center" align="center">
              <HStack spacing="xs" align="center" className="navbar-menu-demo">
                <Menu trigger="hover" placement="bottom" animationVariant="fade" animateContainer>
                  <Menu.Trigger asChild>
                    <Button variant="ghost" size="sm">Products</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.ItemGroup label="Solutions">
                      <Menu.Item itemKey="analytics">Analytics Dashboard</Menu.Item>
                      <Menu.Item itemKey="reporting">Reporting Tools</Menu.Item>
                      <Menu.Item itemKey="automation">Automation Suite</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.Separator />
                    <Menu.ItemGroup label="Integrations">
                      <Menu.Item itemKey="api">API Access</Menu.Item>
                      <Menu.Item itemKey="webhooks">Webhooks</Menu.Item>
                      <Menu.Item itemKey="plugins">Plugins</Menu.Item>
                    </Menu.ItemGroup>
                  </Menu.Content>
                </Menu>

                <Menu trigger="hover" placement="bottom" animationVariant="fade" animateContainer>
                  <Menu.Trigger asChild>
                    <Button variant="ghost" size="sm">Resources</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item itemKey="docs">Documentation</Menu.Item>
                    <Menu.Item itemKey="blog">Blog</Menu.Item>
                    <Menu.Item itemKey="guides">Guides & Tutorials</Menu.Item>
                    <Menu.Item itemKey="api-ref">API Reference</Menu.Item>
                    <Menu.Item itemKey="community">Community</Menu.Item>
                  </Menu.Content>
                </Menu>

                <Menu trigger="hover" placement="bottom" animationVariant="fade" animateContainer>
                  <Menu.Trigger asChild>
                    <Button variant="ghost" size="sm">Company</Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item itemKey="about">About Us</Menu.Item>
                    <Menu.Item itemKey="team">Team</Menu.Item>
                    <Menu.Item itemKey="careers">Careers</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item itemKey="contact">Contact</Menu.Item>
                    <Menu.Item itemKey="press">Press Kit</Menu.Item>
                  </Menu.Content>
                </Menu>

                <Menu trigger="hover" placement="bottom" animationVariant="fade" animateContainer>
                  <Menu.Trigger asChild>
                    <Button variant="ghost" size="sm">
                      <Icon size="sm"><UserIcon /></Icon>
                    </Button>
                  </Menu.Trigger>
                  <Menu.Content>
                    <Menu.Item itemKey="profile">My Profile</Menu.Item>
                    <Menu.Item itemKey="billing">Billing</Menu.Item>
                    <Menu.Item itemKey="settings">Settings</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item itemKey="logout">Sign Out</Menu.Item>
                  </Menu.Content>
                </Menu>
              </HStack>
            </Box>
          ),
          code: `// Navbar with hover-triggered menus
<nav>
  <HStack spacing="xs" align="center">
    {/* Products Menu */}
    <Menu trigger="hover" placement="bottom" animationVariant="fade" animateContainer>
      <Menu.Trigger asChild>
        <Button variant="ghost">Products</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.ItemGroup label="Solutions">
          <Menu.Item itemKey="analytics">Analytics Dashboard</Menu.Item>
          <Menu.Item itemKey="reporting">Reporting Tools</Menu.Item>
          <Menu.Item itemKey="automation">Automation Suite</Menu.Item>
        </Menu.ItemGroup>
        <Menu.Separator />
        <Menu.ItemGroup label="Integrations">
          <Menu.Item itemKey="api">API Access</Menu.Item>
          <Menu.Item itemKey="webhooks">Webhooks</Menu.Item>
          <Menu.Item itemKey="plugins">Plugins</Menu.Item>
        </Menu.ItemGroup>
      </Menu.Content>
    </Menu>

    {/* Resources Menu */}
    <Menu trigger="hover" placement="bottom" animationVariant="fade" animateContainer>
      <Menu.Trigger asChild>
        <Button variant="ghost">Resources</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item itemKey="docs">Documentation</Menu.Item>
        <Menu.Item itemKey="blog">Blog</Menu.Item>
        <Menu.Item itemKey="guides">Guides & Tutorials</Menu.Item>
        <Menu.Item itemKey="api-ref">API Reference</Menu.Item>
        <Menu.Item itemKey="community">Community</Menu.Item>
      </Menu.Content>
    </Menu>

    {/* Company Menu */}
    <Menu trigger="hover" placement="bottom" animationVariant="fade" animateContainer>
      <Menu.Trigger asChild>
        <Button variant="ghost">Company</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item itemKey="about">About Us</Menu.Item>
        <Menu.Item itemKey="team">Team</Menu.Item>
        <Menu.Item itemKey="careers">Careers</Menu.Item>
        <Menu.Separator />
        <Menu.Item itemKey="contact">Contact</Menu.Item>
        <Menu.Item itemKey="press">Press Kit</Menu.Item>
      </Menu.Content>
    </Menu>

    {/* User Menu */}
    <Menu trigger="hover" placement="bottom-end" animationVariant="fade" animateContainer>
      <Menu.Trigger asChild>
        <Button variant="ghost">
          <Icon><UserIcon /></Icon>
        </Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item itemKey="profile">My Profile</Menu.Item>
        <Menu.Item itemKey="billing">Billing</Menu.Item>
        <Menu.Item itemKey="settings">Settings</Menu.Item>
        <Menu.Separator />
        <Menu.Item itemKey="logout">Sign Out</Menu.Item>
      </Menu.Content>
    </Menu>
  </HStack>
</nav>`,
        },
      ]}
    />
  );
}
