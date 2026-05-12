"use client";

import React from 'react';
import { Box, Body, Kbd } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function KbdPage() {
  return (
    <ComponentDocPage
      componentName="Kbd"
      description="Display keyboard shortcuts with button-like styling. Automatically adapts symbols for Mac and Windows platforms"
      importStatement={`import { Kbd } from '../../../design/index'`}
      sections={[
        // ===== BASIC USAGE =====
        {
          title: 'Basic Usage',
          description: 'Simple keyboard key display',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
              gap="sm"
            >
              <Kbd>K</Kbd>
              <Kbd>Enter</Kbd>
              <Kbd>Esc</Kbd>
            </Box>
          ),
          code: `<Kbd>K</Kbd>
<Kbd>Enter</Kbd>
<Kbd>Esc</Kbd>`,
        },

        // ===== WITH MODIFIER KEYS =====
        {
          title: 'With Modifier Keys',
          description: 'Combine modifier keys like Command, Shift, and Option',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Kbd keys={["command"]}>K</Kbd>
                <Body size="xs" color="secondary">keys={["command"]}</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Kbd keys={["command", "shift"]}>P</Kbd>
                <Body size="xs" color="secondary">keys={["command", "shift"]}</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Kbd keys={["option", "command"]}>N</Kbd>
                <Body size="xs" color="secondary">keys={["option", "command"]}</Body>
              </Box>
            </Box>
          ),
          code: `<Kbd keys={["command"]}>K</Kbd>
<Kbd keys={["command", "shift"]}>P</Kbd>
<Kbd keys={["option", "command"]}>N</Kbd>`,
        },

        // ===== VARIANTS =====
        {
          title: 'Variants',
          description: 'Three visual style variants to match different contexts',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Kbd variant="secondary" keys={["command"]}>K</Kbd>
                <Body size="xs" color="secondary">variant="secondary"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Kbd variant="ghost" keys={["command"]}>K</Kbd>
                <Body size="xs" color="secondary">variant="ghost"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Kbd variant="primary" keys={["command"]}>K</Kbd>
                <Body size="xs" color="secondary">variant="primary"</Body>
              </Box>
            </Box>
          ),
          code: `<Kbd variant="secondary" keys={["command"]}>K</Kbd>
<Kbd variant="ghost" keys={["command"]}>K</Kbd>
<Kbd variant="primary" keys={["command"]}>K</Kbd>`,
        },

        // ===== NAVIGATION KEYS =====
        {
          title: 'Navigation Keys',
          description: 'Arrow keys and common navigation shortcuts',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
              gap="sm"
              style={{ flexWrap: 'wrap' }}
            >
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <Kbd>←</Kbd>
              <Kbd>→</Kbd>
              <Kbd keys={["enter"]} />
              <Kbd keys={["tab"]} />
              <Kbd keys={["delete"]} />
            </Box>
          ),
          code: `<Kbd>↑</Kbd>
<Kbd>↓</Kbd>
<Kbd>←</Kbd>
<Kbd>→</Kbd>
<Kbd keys={["enter"]} />
<Kbd keys={["tab"]} />
<Kbd keys={["delete"]} />`,
        },

        // ===== IN CONTEXT =====
        {
          title: 'In Context',
          description: 'Examples of Kbd used in instructional text and UI',
          preview: (
            <Box display="flex" direction="column" gap="md">
              <Box>
                <Body size="sm" color="tertiary">
                  <Kbd variant="ghost">↑↓</Kbd> Navigate · <Kbd variant="ghost">↵</Kbd> Select · <Kbd variant="ghost">Esc</Kbd> Close
                </Body>
              </Box>

              <Box>
                <Body size="sm" color="secondary">
                  Press <Kbd keys={["command"]}>K</Kbd> to open command menu
                </Body>
              </Box>

              <Box>
                <Body size="sm" color="secondary">
                  Use <Kbd keys={["command", "shift"]}>P</Kbd> to open quick actions
                </Body>
              </Box>

              <Box>
                <Body size="sm" color="secondary">
                  Save your work with <Kbd keys={["command"]}>S</Kbd> or <Kbd keys={["command", "shift"]}>S</Kbd> to save as
                </Body>
              </Box>
            </Box>
          ),
          code: `// Footer instructions
<Body size="sm" color="tertiary">
  <Kbd variant="ghost">↑↓</Kbd> Navigate ·
  <Kbd variant="ghost">↵</Kbd> Select ·
  <Kbd variant="ghost">Esc</Kbd> Close
</Body>

// Inline shortcut
<Body size="sm" color="secondary">
  Press <Kbd keys={["command"]}>K</Kbd> to open command menu
</Body>

// Multiple modifiers
<Body size="sm" color="secondary">
  Use <Kbd keys={["command", "shift"]}>P</Kbd> to open quick actions
</Body>`,
        },

        // ===== SUPPORTED KEYS =====
        {
          title: 'Supported Modifier Keys',
          description: 'List of special keys with automatic platform-specific symbols',
          preview: (
            <Box>
              <Box display="grid" gap="md" className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                <Box display="flex" direction="column" gap="xs">
                  <Kbd keys={["command"]} />
                  <Body size="xs" color="tertiary">command / cmd</Body>
                </Box>
                <Box display="flex" direction="column" gap="xs">
                  <Kbd keys={["shift"]} />
                  <Body size="xs" color="tertiary">shift</Body>
                </Box>
                <Box display="flex" direction="column" gap="xs">
                  <Kbd keys={["option"]} />
                  <Body size="xs" color="tertiary">option / alt</Body>
                </Box>
                <Box display="flex" direction="column" gap="xs">
                  <Kbd keys={["ctrl"]} />
                  <Body size="xs" color="tertiary">ctrl / control</Body>
                </Box>
                <Box display="flex" direction="column" gap="xs">
                  <Kbd keys={["enter"]} />
                  <Body size="xs" color="tertiary">enter / return</Body>
                </Box>
                <Box display="flex" direction="column" gap="xs">
                  <Kbd keys={["delete"]} />
                  <Body size="xs" color="tertiary">delete / backspace</Body>
                </Box>
                <Box display="flex" direction="column" gap="xs">
                  <Kbd keys={["escape"]} />
                  <Body size="xs" color="tertiary">escape / esc</Body>
                </Box>
                <Box display="flex" direction="column" gap="xs">
                  <Kbd keys={["tab"]} />
                  <Body size="xs" color="tertiary">tab</Body>
                </Box>
              </Box>
            </Box>
          ),
          code: `// Modifier keys automatically convert to platform-specific symbols
<Kbd keys={["command"]} />  // ⌘ on Mac, Ctrl on Windows
<Kbd keys={["shift"]} />    // ⇧ on Mac, Shift on Windows
<Kbd keys={["option"]} />   // ⌥ on Mac, Alt on Windows
<Kbd keys={["ctrl"]} />     // ⌃ on Mac, Ctrl on Windows

// Special keys
<Kbd keys={["enter"]} />    // ↵
<Kbd keys={["delete"]} />   // ⌫
<Kbd keys={["escape"]} />   // Esc
<Kbd keys={["tab"]} />      // ⇥`,
        },

        // ===== PRACTICAL EXAMPLES =====
        {
          title: 'Practical Examples',
          description: 'Real-world usage patterns',
          preview: (
            <Box display="flex" direction="column" gap="md">
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body weight="medium" size="sm">Command Menu Footer</Body>
                  <Box
                    padding="sm"
                    bg="hover"
                    radius="md"
                    display="flex"
                    justify="center"
                  >
                    <Body size="xs" color="tertiary">
                      <Kbd variant="ghost">↑↓</Kbd> Navigate · <Kbd variant="ghost">↵</Kbd> Select · <Kbd variant="ghost">Esc</Kbd> Close · <Kbd variant="ghost">⌫</Kbd> Back
                    </Body>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body weight="medium" size="sm">Search Button with Shortcut</Body>
                  <Box
                    padding="sm"
                    bg="hover"
                    radius="md"
                    display="flex"
                    align="center"
                    gap="sm"
                  >
                    <Body size="sm">Search...</Body>
                    <Box style={{ marginLeft: 'auto' }}>
                      <Kbd keys={["command"]}>K</Kbd>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body weight="medium" size="sm">Keyboard Shortcuts List</Body>
                  <Box display="flex" direction="column" gap="xs">
                    <Box display="flex" justify="between" align="center">
                      <Body size="sm" color="secondary">Open command menu</Body>
                      <Kbd keys={["command"]}>K</Kbd>
                    </Box>
                    <Box display="flex" justify="between" align="center">
                      <Body size="sm" color="secondary">Quick actions</Body>
                      <Kbd keys={["command", "shift"]}>P</Kbd>
                    </Box>
                    <Box display="flex" justify="between" align="center">
                      <Body size="sm" color="secondary">Toggle sidebar</Body>
                      <Kbd keys={["command"]}>B</Kbd>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ),
          code: `// Command menu footer
<Body size="xs" color="tertiary">
  <Kbd variant="ghost">↑↓</Kbd> Navigate ·
  <Kbd variant="ghost">↵</Kbd> Select ·
  <Kbd variant="ghost">Esc</Kbd> Close ·
  <Kbd variant="ghost">⌫</Kbd> Back
</Body>

// Search button with shortcut hint
<Box display="flex" align="center" gap="sm">
  <Body size="sm">Search...</Body>
  <Box style={{ marginLeft: 'auto' }}>
    <Kbd keys={["command"]}>K</Kbd>
  </Box>
</Box>

// Keyboard shortcuts list
<Box display="flex" direction="column" gap="xs">
  <Box display="flex" justify="between" align="center">
    <Body size="sm" color="secondary">Open command menu</Body>
    <Kbd keys={["command"]}>K</Kbd>
  </Box>
  <Box display="flex" justify="between" align="center">
    <Body size="sm" color="secondary">Quick actions</Body>
    <Kbd keys={["command", "shift"]}>P</Kbd>
  </Box>
</Box>`,
        },
      ]}
    />
  );
}
