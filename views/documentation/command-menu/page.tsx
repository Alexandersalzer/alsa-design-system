"use client";

import React, { useState } from 'react';
import { Box, Body, CommandMenu, Button, Icon } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import {
  HomeIcon,
  Cog6ToothIcon,
  UserIcon,
  DocumentTextIcon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import type { CommandItem } from '../../../design/index';

const sampleCommands: CommandItem[] = [
  {
    id: 'home',
    title: 'Go to Dashboard',
    icon: <Icon size="sm" color="secondary"><HomeIcon /></Icon>,
    shortcut: '$mod+KeyH',
    section: 'Navigation',
    handler: () => alert('Navigate to Dashboard')
  },
  {
    id: 'settings',
    title: 'Open Settings',
    icon: <Icon size="sm" color="secondary"><Cog6ToothIcon /></Icon>,
    shortcut: '$mod+Comma',
    section: 'Navigation',
    handler: () => alert('Open Settings')
  },
  {
    id: 'profile',
    title: 'View Profile',
    icon: <Icon size="sm" color="secondary"><UserIcon /></Icon>,
    shortcut: '$mod+KeyP',
    section: 'Navigation',
    handler: () => alert('View Profile')
  },
  {
    id: 'theme',
    title: 'Change Theme...',
    icon: <Icon size="sm" color="secondary"><SunIcon /></Icon>,
    section: 'Commands',
    keywords: 'dark light mode'
  },
  {
    id: 'theme-light',
    title: 'Light Theme',
    icon: <Icon size="sm" color="secondary"><SunIcon /></Icon>,
    parent: 'theme',
    handler: () => alert('Switch to Light Theme')
  },
  {
    id: 'theme-dark',
    title: 'Dark Theme',
    icon: <Icon size="sm" color="secondary"><MoonIcon /></Icon>,
    parent: 'theme',
    handler: () => alert('Switch to Dark Theme')
  },
  {
    id: 'new-doc',
    title: 'New Document',
    icon: <Icon size="sm" color="secondary"><DocumentTextIcon /></Icon>,
    shortcut: '$mod+KeyN',
    section: 'Commands',
    handler: () => alert('Create New Document')
  },
  {
    id: 'search',
    title: 'Search Everything',
    icon: <Icon size="sm" color="secondary"><MagnifyingGlassIcon /></Icon>,
    shortcut: '$mod+KeyF',
    section: 'Commands',
    keywords: 'find',
    handler: () => alert('Open Search')
  },
  {
    id: 'notifications',
    title: 'View Notifications',
    icon: <Icon size="sm" color="secondary"><BellIcon /></Icon>,
    shortcut: '$mod+KeyB',
    section: 'Commands',
    handler: () => alert('View Notifications')
  }
];

export default function CommandMenuPage() {
  const [open, setOpen] = useState(false);

  return (
    <ComponentDocPage
      componentName="CommandMenu"
      description="Keyboard-first navigation palette for power users. Launch actions quickly without touching the mouse."
      importStatement={`import { CommandMenu } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Command menu with search and keyboard navigation',
          preview: (
            <Box>
              <Button onClick={() => setOpen(true)}>
                Open Command Menu (⌘K)
              </Button>
              <CommandMenu
                open={open}
                setOpen={setOpen}
                commands={sampleCommands}
                placeholder="What do you need?"
              />
            </Box>
          ),
          code: `const [open, setOpen] = useState(false);

const commands: CommandItem[] = [
  {
    id: 'home',
    title: 'Go to Dashboard',
    icon: <Icon size="sm"><HomeIcon /></Icon>,
    shortcut: '$mod+KeyH',
    section: 'Navigation',
    handler: () => navigate('/dashboard')
  },
  {
    id: 'settings',
    title: 'Open Settings',
    icon: <Icon size="sm"><Cog6ToothIcon /></Icon>,
    shortcut: '$mod+Comma',
    section: 'Navigation',
    handler: () => navigate('/settings')
  }
];

<Button onClick={() => setOpen(true)}>
  Open Command Menu
</Button>

<CommandMenu
  open={open}
  setOpen={setOpen}
  commands={commands}
  placeholder="What do you need?"
/>`,
        },

        {
          title: 'Nested Commands',
          description: 'Commands can be nested for hierarchical navigation',
          preview: (
            <Box>
              <Body size="sm" color="secondary">
                Try opening the command menu and selecting "Change Theme..." to see nested commands
              </Body>
            </Box>
          ),
          code: `const commands: CommandItem[] = [
  {
    id: 'theme',
    title: 'Change Theme...',
    icon: <Icon size="sm"><SunIcon /></Icon>,
    section: 'Commands'
    // No handler - this is a parent command
  },
  {
    id: 'theme-light',
    title: 'Light Theme',
    icon: <Icon size="sm"><SunIcon /></Icon>,
    parent: 'theme', // Links to parent command
    handler: () => setTheme('light')
  },
  {
    id: 'theme-dark',
    title: 'Dark Theme',
    icon: <Icon size="sm"><MoonIcon /></Icon>,
    parent: 'theme',
    handler: () => setTheme('dark')
  }
];`,
        },

        {
          title: 'Keyboard Shortcuts',
          description: 'Commands can have keyboard shortcuts displayed',
          preview: (
            <Box>
              <Body size="sm" color="secondary" style={{ marginBottom: '8px' }}>
                Shortcuts use <code>$mod</code> prefix for cross-platform support:
              </Body>
              <Body size="sm" color="tertiary">
                • Mac: <code>$mod</code> = ⌘ (Command key)
              </Body>
              <Body size="sm" color="tertiary">
                • Windows/Linux: <code>$mod</code> = Ctrl
              </Body>
            </Box>
          ),
          code: `{
  id: 'new-doc',
  title: 'New Document',
  shortcut: '$mod+KeyN', // ⌘+N on Mac, Ctrl+N on Windows
  handler: () => createDocument()
}

// Other examples:
shortcut: '$mod+Shift+KeyP' // ⌘+Shift+P or Ctrl+Shift+P
shortcut: 'Alt+KeyT'        // Alt+T (cross-platform)
shortcut: '$mod+Digit1'     // ⌘+1 or Ctrl+1`,
        },

        {
          title: 'Search Keywords',
          description: 'Add keywords to make commands easier to discover',
          preview: (
            <Box>
              <Body size="sm" color="secondary">
                Try searching for "find" in the command menu - it will match the "Search Everything" command
              </Body>
            </Box>
          ),
          code: `{
  id: 'search',
  title: 'Search Everything',
  keywords: 'find lookup query', // Hidden from UI, used for search
  handler: () => openSearch()
}`,
        },

        {
          title: 'Command Structure',
          description: 'Complete command item interface',
          preview: (
            <Box
              style={{
                fontFamily: 'monospace',
                fontSize: '13px',
                lineHeight: '1.6'
              }}
            >
              {`interface CommandItem {
  id: string;              // Unique identifier
  title: string;           // Display name
  keywords?: string;       // Search keywords (hidden)
  icon?: React.ReactNode;  // Optional icon
  shortcut?: string;       // Keyboard shortcut
  section?: string;        // Group header
  parent?: string;         // Parent command ID (for nesting)
  handler?: () => void;    // Action to execute
}`}
            </Box>
          ),
          code: `const myCommand: CommandItem = {
  id: 'export-data',
  title: 'Export Data',
  keywords: 'download save csv excel',
  icon: <Icon size="sm"><ArrowDownTrayIcon /></Icon>,
  shortcut: '$mod+KeyE',
  section: 'Tools',
  handler: () => exportData()
};`,
        },
      ]}
    >
      <Box display="flex" direction="column" gap="md">
        <Box>
          <Body weight="semibold" style={{ marginBottom: '8px' }}>
            Keyboard Navigation:
          </Body>
          <Body size="sm" color="secondary">
            • <kbd>⌘K</kbd> or <kbd>Ctrl+K</kbd> - Open command menu
          </Body>
          <Body size="sm" color="secondary">
            • <kbd>↑↓</kbd> - Navigate commands
          </Body>
          <Body size="sm" color="secondary">
            • <kbd>Enter</kbd> - Select command
          </Body>
          <Body size="sm" color="secondary">
            • <kbd>Esc</kbd> - Close menu (or go back from nested view)
          </Body>
          <Body size="sm" color="secondary">
            • <kbd>Backspace</kbd> - Go back from nested view
          </Body>
        </Box>

        <Box>
          <Body weight="semibold" style={{ marginBottom: '8px' }}>
            Best Practices:
          </Body>
          <Body size="sm" color="secondary">
            ✓ Use clear, action-oriented command titles
          </Body>
          <Body size="sm" color="secondary">
            ✓ Group related commands with sections
          </Body>
          <Body size="sm" color="secondary">
            ✓ Use <code>$mod</code> prefix for cross-platform shortcuts
          </Body>
          <Body size="sm" color="secondary">
            ✓ Add keywords to improve discoverability
          </Body>
          <Body size="sm" color="secondary">
            ✓ Avoid complex shortcuts - keep them memorable
          </Body>
        </Box>
      </Box>
    </ComponentDocPage>
  );
}
