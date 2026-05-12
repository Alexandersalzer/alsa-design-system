"use client";

import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Body,
  Button,
  Popover,
  Label,
  Input,
  Divider,
  Icon,
  IconButton,
} from '../../../design/index';

import {
  InformationCircleIcon,
  Cog6ToothIcon,
  UserIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  ShareIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  PencilIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function PopoverPage() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <ComponentDocPage
      componentName="Popover"
      description="Floating panel that displays rich content positioned relative to a trigger element. Perfect for forms, confirmations, and contextual information."
      importStatement={`import { Popover } from '../../../design/index'`}
      sections={[
        // ===== BASIC USAGE =====
        {
          title: 'Basic Usage',
          description: 'Simple popover with basic content. IMPORTANT: Use asChild on Trigger when wrapping custom components.',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Popover open={basicOpen} onOpenChange={setBasicOpen}>
                <Popover.Trigger asChild>
                  <Button>Open Popover</Button>
                </Popover.Trigger>
                <Popover.Positioner>
                  <Popover.Content>
                    <Box padding="md" style={{ minWidth: '200px' }}>
                      <VStack spacing="sm">
                        <Body weight="semibold">Popover Title</Body>
                        <Body size="sm" color="secondary">
                          This is a basic popover example with some content.
                        </Body>
                      </VStack>
                    </Box>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover>
            </Box>
          ),
          code: `const [isOpen, setIsOpen] = useState(false);

<Popover open={isOpen} onOpenChange={setIsOpen}>
  <Popover.Trigger asChild>
    <Button>Open Popover</Button>
  </Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content>
      <Box padding="md">
        <VStack spacing="sm">
          <Body weight="semibold">Popover Title</Body>
          <Body size="sm" color="secondary">
            This is a basic popover example.
          </Body>
        </VStack>
      </Box>
    </Popover.Content>
  </Popover.Positioner>
</Popover>`,
        },

        // ===== WITH HEADER, BODY, AND FOOTER =====
        {
          title: 'With Header, Body, and Footer',
          description: 'Structured popover content using semantic components for better organization',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Popover>
                <Popover.Trigger asChild>
                  <Button variant="accent">Structured Popover</Button>
                </Popover.Trigger>
                <Popover.Positioner>
                  <Popover.Content>
                    <Popover.Header>
                      <Body weight="semibold">Confirm Action</Body>
                    </Popover.Header>
                    <Popover.Body>
                      <Body size="sm" color="secondary">
                        Are you sure you want to proceed with this action? This cannot be undone.
                      </Body>
                    </Popover.Body>
                    <Popover.Footer>
                      <HStack justify="end" spacing="sm">
                        <Popover.CloseTrigger asChild>
                          <Button size="sm" variant="secondary">
                            Cancel
                          </Button>
                        </Popover.CloseTrigger>
                        <Button size="sm" variant="accent">
                          Confirm
                        </Button>
                      </HStack>
                    </Popover.Footer>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover>
            </Box>
          ),
          code: `<Popover>
  <Popover.Trigger asChild>
    <Button>Structured Popover</Button>
  </Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content>
      <Popover.Header>
        <Body weight="semibold">Confirm Action</Body>
      </Popover.Header>
      <Popover.Body>
        <Body size="sm" color="secondary">
          Are you sure you want to proceed?
        </Body>
      </Popover.Body>
      <Popover.Footer>
        <HStack justify="end" spacing="sm">
          <Popover.CloseTrigger asChild>
            <Button size="sm" variant="secondary">Cancel</Button>
          </Popover.CloseTrigger>
          <Button size="sm" variant="accent">Confirm</Button>
        </HStack>
      </Popover.Footer>
    </Popover.Content>
  </Popover.Positioner>
</Popover>`,
        },

        // ===== REAL-WORLD SCENARIOS =====
        {
          title: 'Real-World Scenarios',
          description: 'Common popover use cases with practical implementations',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {/* Info Popover */}
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Popover open={infoOpen} onOpenChange={setInfoOpen}>
                  <Popover.Trigger asChild>
                    <Button variant="secondary" leftIcon={<Icon><InformationCircleIcon /></Icon>}>
                      Info
                    </Button>
                  </Popover.Trigger>
                  <Popover.Positioner>
                    <Popover.Content>
                      <Box padding="md" style={{ maxWidth: '280px' }}>
                        <VStack spacing="sm">
                          <HStack spacing="sm">
                            <Icon><InformationCircleIcon /></Icon>
                            <Body weight="semibold">Additional Information</Body>
                          </HStack>
                          <Body size="sm" color="secondary">
                            This feature helps you understand the context better. Click outside to dismiss.
                          </Body>
                        </VStack>
                      </Box>
                    </Popover.Content>
                  </Popover.Positioner>
                </Popover>
                <Body size="xs" color="secondary">Information popover</Body>
              </Box>

              {/* Form Popover */}
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Popover open={formOpen} onOpenChange={setFormOpen}>
                  <Popover.Trigger asChild>
                    <Button variant="accent" leftIcon={<Icon><UserIcon /></Icon>}>
                      Quick Form
                    </Button>
                  </Popover.Trigger>
                  <Popover.Positioner>
                    <Popover.Content>
                      <Popover.Header>
                        <Body weight="semibold">Quick Update</Body>
                      </Popover.Header>
                      <Popover.Body>
                        <VStack spacing="sm">
                          <VStack spacing="xs">
                            <Label size="sm">Name</Label>
                            <Input size="sm" placeholder="Enter name" />
                          </VStack>
                          <VStack spacing="xs">
                            <Label size="sm">Email</Label>
                            <Input size="sm" type="email" placeholder="you@example.com" />
                          </VStack>
                        </VStack>
                      </Popover.Body>
                      <Popover.Footer>
                        <HStack justify="end" spacing="sm">
                          <Popover.CloseTrigger asChild>
                            <Button size="sm" variant="secondary">
                              Cancel
                            </Button>
                          </Popover.CloseTrigger>
                          <Button size="sm">
                            Save
                          </Button>
                        </HStack>
                      </Popover.Footer>
                    </Popover.Content>
                  </Popover.Positioner>
                </Popover>
                <Body size="xs" color="secondary">Form popover</Body>
              </Box>

              {/* Help Popover */}
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Popover open={helpOpen} onOpenChange={setHelpOpen}>
                  <Popover.Trigger asChild>
                    <Button variant="ghost" leftIcon={<Icon><QuestionMarkCircleIcon /></Icon>}>
                      Help
                    </Button>
                  </Popover.Trigger>
                  <Popover.Positioner>
                    <Popover.Content>
                      <Popover.Header>
                        <Body weight="semibold">Need Help?</Body>
                      </Popover.Header>
                      <Popover.Body>
                        <VStack spacing="sm">
                          <VStack spacing="xs">
                            <Body size="sm" weight="medium">Getting Started</Body>
                            <Body size="xs" color="secondary">
                              Learn the basics in our quick start guide.
                            </Body>
                          </VStack>
                          <VStack spacing="xs">
                            <Body size="sm" weight="medium">Documentation</Body>
                            <Body size="xs" color="secondary">
                              Find detailed information about all options.
                            </Body>
                          </VStack>
                        </VStack>
                      </Popover.Body>
                      <Popover.Footer>
                        <HStack spacing="sm">
                          <Button size="sm" variant="ghost">
                            View Docs
                          </Button>
                          <Popover.CloseTrigger asChild>
                            <Button size="sm" variant="secondary">
                              Contact Support
                            </Button>
                          </Popover.CloseTrigger>
                        </HStack>
                      </Popover.Footer>
                    </Popover.Content>
                  </Popover.Positioner>
                </Popover>
                <Body size="xs" color="secondary">Help popover</Body>
              </Box>

              {/* Actions Menu Popover */}
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Popover>
                  <Popover.Trigger asChild>
                    <IconButton
                      variant="ghost"
                      aria-label="More actions"
                      icon={<Icon><EllipsisVerticalIcon /></Icon>}
                    />
                  </Popover.Trigger>
                  <Popover.Positioner>
                    <Popover.Content>
                      <Box padding="xs" style={{ minWidth: '160px' }}>
                        <VStack spacing="xs">
                          <Button variant="ghost" size="sm" leftIcon={<Icon size="sm"><PencilIcon /></Icon>} style={{ justifyContent: 'flex-start', width: '100%' }}>
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" leftIcon={<Icon size="sm"><DocumentDuplicateIcon /></Icon>} style={{ justifyContent: 'flex-start', width: '100%' }}>
                            Duplicate
                          </Button>
                          <Button variant="ghost" size="sm" leftIcon={<Icon size="sm"><ShareIcon /></Icon>} style={{ justifyContent: 'flex-start', width: '100%' }}>
                            Share
                          </Button>
                          <Divider spacing="sm" />
                          <Button variant="ghost" size="sm" leftIcon={<Icon size="sm"><TrashIcon /></Icon>} style={{ justifyContent: 'flex-start', width: '100%', color: 'var(--text-error)' }}>
                            Delete
                          </Button>
                        </VStack>
                      </Box>
                    </Popover.Content>
                  </Popover.Positioner>
                </Popover>
                <Body size="xs" color="secondary">Actions menu</Body>
              </Box>
            </Box>
          ),
          code: `// See individual tabs for each example`,
        },

        // ===== NOTIFICATION CENTER =====
        {
          title: 'Notification Center Example',
          description: 'Complex popover with scrollable content and structured layout',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Popover>
                <Popover.Trigger asChild>
                  <IconButton
                    variant="ghost"
                    aria-label="Notifications"
                    icon={<Icon><BellIcon /></Icon>}
                  />
                </Popover.Trigger>
                <Popover.Positioner>
                  <Popover.Content maxHeight={400} width={320}>
                    <Popover.Header>
                      <HStack justify="between" align="center">
                        <Body weight="semibold">Notifications</Body>
                        <Button variant="ghost" size="sm">Mark all read</Button>
                      </HStack>
                    </Popover.Header>
                    <Popover.Body>
                      <VStack spacing="xs">
                        {[1, 2, 3, 4].map((i) => (
                          <Box key={i} padding="sm" radius="md" bg="card">
                            <VStack spacing="xs">
                              <Body size="sm" weight="medium">
                                New message received
                              </Body>
                              <Body size="xs" color="secondary">
                                You have a new notification from the system
                              </Body>
                              <Body size="xs" color="tertiary">
                                2 minutes ago
                              </Body>
                            </VStack>
                          </Box>
                        ))}
                      </VStack>
                    </Popover.Body>
                    <Popover.Footer>
                      <Button variant="ghost" size="sm" style={{ width: '100%' }}>
                        View all notifications
                      </Button>
                    </Popover.Footer>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover>
            </Box>
          ),
          code: `<Popover>
  <Popover.Trigger asChild>
    <IconButton
      variant="ghost"
      aria-label="Notifications"
      icon={<Icon><BellIcon /></Icon>}
    />
  </Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content maxHeight={400} width={320}>
      <Popover.Header>
        <HStack justify="between">
          <Body weight="semibold">Notifications</Body>
          <Button variant="ghost" size="xs">Mark all read</Button>
        </HStack>
      </Popover.Header>
      <Popover.Body>
        <VStack spacing="xs">
          <Box padding="sm" radius="md" bg="subtle">
            <VStack spacing="xs">
              <Body size="sm" weight="medium">
                New message received
              </Body>
              <Body size="xs" color="secondary">
                You have a new notification
              </Body>
              <Body size="xs" color="tertiary">
                2 minutes ago
              </Body>
            </VStack>
          </Box>
          {/* More notifications... */}
        </VStack>
      </Popover.Body>
      <Popover.Footer>
        <Button variant="ghost" size="sm" style={{ width: '100%' }}>
          View all notifications
        </Button>
      </Popover.Footer>
    </Popover.Content>
  </Popover.Positioner>
</Popover>`,
        },

        // ===== WITH DIFFERENT TRIGGERS =====
        {
          title: 'Different Trigger Types',
          description: 'Popovers can be triggered by various elements using asChild',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-3">
              {/* Button Trigger */}
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Popover>
                  <Popover.Trigger asChild>
                    <Button variant="accent">Button</Button>
                  </Popover.Trigger>
                  <Popover.Positioner>
                    <Popover.Content>
                      <Box padding="md" style={{ minWidth: '200px' }}>
                        <Body size="sm">Triggered by a button</Body>
                      </Box>
                    </Popover.Content>
                  </Popover.Positioner>
                </Popover>
                <Body size="xs" color="secondary">Button trigger</Body>
              </Box>

              {/* Icon Button Trigger */}
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Popover>
                  <Popover.Trigger asChild>
                    <IconButton
                      variant="ghost"
                      aria-label="Settings"
                      icon={<Icon><Cog6ToothIcon /></Icon>}
                    />
                  </Popover.Trigger>
                  <Popover.Positioner>
                    <Popover.Content>
                      <Box padding="md" style={{ minWidth: '200px' }}>
                        <Body size="sm">Triggered by icon button</Body>
                      </Box>
                    </Popover.Content>
                  </Popover.Positioner>
                </Popover>
                <Body size="xs" color="secondary">Icon button</Body>
              </Box>

              {/* Custom Trigger */}
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <Popover>
                  <Popover.Trigger asChild>
                    <HStack spacing="sm" style={{ cursor: 'pointer' }}>
                      <Icon><InformationCircleIcon /></Icon>
                      <Body size="sm">More info</Body>
                    </HStack>
                  </Popover.Trigger>
                  <Popover.Positioner>
                    <Popover.Content>
                      <Box padding="md" style={{ minWidth: '200px' }}>
                        <Body size="sm">Custom element</Body>
                      </Box>
                    </Popover.Content>
                  </Popover.Positioner>
                </Popover>
                <Body size="xs" color="secondary">Custom element</Body>
              </Box>
            </Box>
          ),
          code: `// Always use asChild with custom components!

// Button Trigger
<Popover>
  <Popover.Trigger asChild>
    <Button>Button</Button>
  </Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content>
      <Box padding="md">Content</Box>
    </Popover.Content>
  </Popover.Positioner>
</Popover>

// Icon Button
<Popover>
  <Popover.Trigger asChild>
    <IconButton aria-label="Settings" icon={<Icon><Cog6ToothIcon /></Icon>} />
  </Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content>
      <Box padding="md">Content</Box>
    </Popover.Content>
  </Popover.Positioner>
</Popover>

// Custom Element
<Popover>
  <Popover.Trigger asChild>
    <HStack padding="sm" border="default">
      <Icon><InformationCircleIcon /></Icon>
      <Body>Info</Body>
    </HStack>
  </Popover.Trigger>
  <Popover.Positioner>
    <Popover.Content>
      <Box padding="md">Content</Box>
    </Popover.Content>
  </Popover.Positioner>
</Popover>`,
        },
      ]}
    >
      {/* Best Practices Section */}
      <VStack spacing="md">
        <Box>
          <VStack spacing="md">
            <Body weight="semibold" size="lg">⚠️ Critical: Using asChild</Body>
            <Divider spacing="sm" />

            <VStack spacing="sm">
              <Body weight="semibold" color="error">❌ WRONG - Causes nested button error:</Body>
              <Box padding="sm" radius="md" bg="card">
                <Body size="sm" style={{ fontFamily: 'monospace' }}>
                  {`<Popover.Trigger>`}<br/>
                  {`  <Button>Click me</Button>`}<br/>
                  {`</Popover.Trigger>`}
                </Body>
              </Box>
            </VStack>

            <VStack spacing="sm">
              <Body weight="semibold" color="success">✅ CORRECT - Use asChild:</Body>
              <Box padding="sm" radius="md" bg="card">
                <Body size="sm" style={{ fontFamily: 'monospace' }}>
                  {`<Popover.Trigger asChild>`}<br/>
                  {`  <Button>Click me</Button>`}<br/>
                  {`</Popover.Trigger>`}
                </Body>
              </Box>
            </VStack>

            <Divider spacing="sm" />

            <VStack spacing="sm">
              <Body weight="semibold">✅ Best Practices:</Body>
              <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                <Body size="sm" color="secondary">• Always use `asChild` when wrapping Button, IconButton, or custom components</Body>
                <Body size="sm" color="secondary">• Use Header, Body, Footer for structured content</Body>
                <Body size="sm" color="secondary">• Keep content concise and scannable</Body>
                <Body size="sm" color="secondary">• Provide clear close affordances (Popover.CloseTrigger)</Body>
                <Body size="sm" color="secondary">• Use controlled state when you need programmatic control</Body>
              </VStack>
            </VStack>

            <VStack spacing="sm">
              <Body weight="semibold">❌ Avoid:</Body>
              <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                <Body size="sm" color="secondary">• Nesting buttons without `asChild`</Body>
                <Body size="sm" color="secondary">• Using for critical actions without confirmation</Body>
                <Body size="sm" color="secondary">• Overloading with too much content (use Modal instead)</Body>
                <Body size="sm" color="secondary">• Using for simple hints (use Tooltip instead)</Body>
              </VStack>
            </VStack>

            <Divider spacing="sm" />

            <VStack spacing="sm">
              <Body weight="semibold">Common Use Cases:</Body>
              <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                <Body size="sm">📝 Quick forms and inputs</Body>
                <Body size="sm">⚙️ Settings and configuration panels</Body>
                <Body size="sm">📋 Context menus and action lists</Body>
                <Body size="sm">ℹ️ Detailed information displays</Body>
                <Body size="sm">🔔 Notification centers</Body>
                <Body size="sm">✅ Confirmation dialogs</Body>
              </VStack>
            </VStack>
          </VStack>
        </Box>

        {/* Props Documentation */}
        <Box>
          <VStack spacing="md">
            <Body weight="semibold">API Reference</Body>
            <Divider spacing="sm" />

            <VStack spacing="sm">
              <Body weight="medium">Popover.Root</Body>
              <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                <Body size="sm" color="secondary">• open: boolean (optional) - Controlled open state</Body>
                <Body size="sm" color="secondary">• onOpenChange: (open: boolean) =&gt; void - State change callback</Body>
                <Body size="sm" color="secondary">• closeOnEscape: boolean (default: true)</Body>
                <Body size="sm" color="secondary">• closeOnInteractOutside: boolean (default: true)</Body>
              </VStack>
            </VStack>

            <Divider spacing="sm" />

            <VStack spacing="sm">
              <Body weight="medium">Popover.Trigger</Body>
              <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                <Body size="sm" color="secondary">• asChild: boolean - Use child as trigger (REQUIRED for custom components!)</Body>
                <Body size="sm" color="secondary">• children: ReactNode - Trigger element</Body>
              </VStack>
            </VStack>

            <Divider spacing="sm" />

            <VStack spacing="sm">
              <Body weight="medium">Popover.Content</Body>
              <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                <Body size="sm" color="secondary">• maxHeight: number (default: 600) - Maximum height in pixels</Body>
                <Body size="sm" color="secondary">• width: number | string - Fixed width (optional)</Body>
              </VStack>
            </VStack>
          </VStack>
        </Box>
      </VStack>
    </ComponentDocPage>
  );
}
