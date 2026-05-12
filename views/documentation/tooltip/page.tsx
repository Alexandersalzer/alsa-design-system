"use client";

import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Body,
  Button,
  Tooltip,
  IconButton,
  Icon,
  Divider,
  Badge,
} from '../../../design/index';

import {
  InformationCircleIcon,
  TrashIcon,
  PencilIcon,
  UserIcon,
  HeartIcon,
  StarIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function TooltipPage() {
  const [isControlledOpen, setIsControlledOpen] = useState(false);

  return (
    <ComponentDocPage
      componentName="Tooltip"
      description="Floating label that displays helpful information on hover with customizable placement, delay, and styling. Perfect for providing contextual help without cluttering the UI."
      importStatement={`import { Tooltip } from '../../../design/index'`}
      sections={[
        // ===== BASIC USAGE =====
        {
          title: 'Basic Usage',
          description: 'Wrap any element with a Tooltip to add hover help text',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Tooltip content="This is a helpful tooltip">
                <Button>Hover me</Button>
              </Tooltip>
            </Box>
          ),
          code: `<Tooltip content="This is a helpful tooltip">
  <Button>Hover me</Button>
</Tooltip>`,
        },

        // ===== WITH ARROW =====
        {
          title: 'With Arrow',
          description: 'Display an arrow pointing to the trigger element for better visual connection',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <Tooltip content="Tooltip with arrow indicator" showArrow>
                <Button variant="accent">Hover for arrow tooltip</Button>
              </Tooltip>
            </Box>
          ),
          code: `<Tooltip content="Tooltip with arrow indicator" showArrow>
  <Button variant="accent">Hover for arrow tooltip</Button>
</Tooltip>`,
        },

        // ===== REAL-WORLD SCENARIOS =====
        {
          title: 'Real-World Scenarios',
          description: 'Common use cases for tooltips in applications',
          preview: (
            <Box>
              <VStack spacing="lg">
                {/* Help text scenario */}
                <VStack spacing="sm">
                  <Body weight="semibold" size="sm" color="secondary">Help Text</Body>
                  <HStack spacing="sm" align="center">
                    <Body size="sm">Username</Body>
                    <Tooltip content="Your username must be 3-20 characters and unique" showArrow>
                      <Icon size="sm" style={{ cursor: 'pointer' }}>
                        <QuestionMarkCircleIcon />
                      </Icon>
                    </Tooltip>
                  </HStack>
                </VStack>

                <Divider spacing="sm" />

                {/* Status indicator */}
                <VStack spacing="sm">
                  <Body weight="semibold" size="sm" color="secondary">Status Indicator</Body>
                  <HStack spacing="md">
                    <Tooltip content="System is operational and all services are running" showArrow color="success">
                      <Badge variant="success">Online</Badge>
                    </Tooltip>
                    <Tooltip content="System is under maintenance. Expected back online in 2 hours" showArrow color="warning">
                      <Badge variant="warning">Maintenance</Badge>
                    </Tooltip>
                  </HStack>
                </VStack>

                <Divider spacing="sm" />

                {/* Disabled action */}
                <VStack spacing="sm">
                  <Body weight="semibold" size="sm" color="secondary">Disabled Action Explanation</Body>
                  <Tooltip content="You need administrator privileges to delete users" showArrow color="danger">
                    <Button variant="destructive" disabled>
                      Delete User
                    </Button>
                  </Tooltip>
                </VStack>

                <Divider spacing="sm" />

                {/* Timestamp display */}
                <VStack spacing="sm">
                  <Body weight="semibold" size="sm" color="secondary">Timestamp Details</Body>
                  <Tooltip
                    content="Created on December 12, 2025 at 3:45 PM PST"
                    showArrow
                  >
                    <HStack spacing="xs" style={{ cursor: 'help' }}>
                      <Icon size="sm">
                        <ClockIcon />
                      </Icon>
                      <Body size="sm" color="secondary">2 hours ago</Body>
                    </HStack>
                  </Tooltip>
                </VStack>
              </VStack>
            </Box>
          ),
          code: `// Help text for form fields
<HStack spacing="sm" align="center">
  <Body size="sm">Username</Body>
  <Tooltip content="Your username must be 3-20 characters and unique" showArrow>
    <Icon size="sm" style={{ cursor: 'pointer' }}>
      <QuestionMarkCircleIcon />
    </Icon>
  </Tooltip>
</HStack>

// Status indicator with explanation
<Tooltip content="System is operational and all services are running" showArrow color="success">
  <Badge variant="success">Online</Badge>
</Tooltip>

// Disabled action explanation
<Tooltip content="You need administrator privileges to delete users" showArrow color="danger">
  <Button variant="destructive" disabled>
    Delete User
  </Button>
</Tooltip>

// Timestamp details on hover
<Tooltip content="Created on December 12, 2025 at 3:45 PM PST" showArrow>
  <HStack spacing="xs" style={{ cursor: 'help' }}>
    <Icon size="sm"><ClockIcon /></Icon>
    <Body size="sm" color="secondary">2 hours ago</Body>
  </HStack>
</Tooltip>`,
        },

        // ===== COLORS =====
        {
          title: 'Color Variants',
          description: 'Use different colors to convey semantic meaning',
          preview: (
            <Box
            >
              <HStack spacing="md" justify="center" wrap={true}>
                <Tooltip content="Default neutral tooltip" color="default" showArrow>
                  <Button size="sm">Default</Button>
                </Tooltip>
                <Tooltip content="Primary action information" color="primary" showArrow>
                  <Button size="sm" variant="accent">Primary</Button>
                </Tooltip>
                <Tooltip content="Secondary information" color="secondary" showArrow>
                  <Button size="sm" variant="secondary">Secondary</Button>
                </Tooltip>
                <Tooltip content="Success confirmation" color="success" showArrow>
                  <Button size="sm" variant="primary">Success</Button>
                </Tooltip>
                <Tooltip content="Warning or caution message" color="warning" showArrow>
                  <Button size="sm" variant="secondary">Warning</Button>
                </Tooltip>
                <Tooltip content="Danger or destructive action" color="danger" showArrow>
                  <Button size="sm" variant="destructive">Danger</Button>
                </Tooltip>
              </HStack>
            </Box>
          ),
          code: `<Tooltip content="Default neutral tooltip" color="default" showArrow>
  <Button>Default</Button>
</Tooltip>

<Tooltip content="Primary action information" color="primary" showArrow>
  <Button variant="accent">Primary</Button>
</Tooltip>

<Tooltip content="Success confirmation" color="success" showArrow>
  <Button variant="primary">Success</Button>
</Tooltip>

<Tooltip content="Warning or caution message" color="warning" showArrow>
  <Button variant="secondary">Warning</Button>
</Tooltip>

<Tooltip content="Danger or destructive action" color="danger" showArrow>
  <Button variant="destructive">Danger</Button>
</Tooltip>`,
        },

        // ===== PLACEMENTS =====
        {
          title: 'Placement Options',
          description: 'Position tooltips in 12 different directions relative to the trigger element',
          preview: (
            <Box
            >
              <VStack spacing="xl">
                {/* Top row */}
                <HStack spacing="md" justify="center">
                  <Tooltip content="Top start" placement="top-start" showArrow>
                    <Button size="sm">Top Start</Button>
                  </Tooltip>
                  <Tooltip content="Top center" placement="top" showArrow>
                    <Button size="sm">Top</Button>
                  </Tooltip>
                  <Tooltip content="Top end" placement="top-end" showArrow>
                    <Button size="sm">Top End</Button>
                  </Tooltip>
                </HStack>

                {/* Middle row */}
                <HStack spacing="md" justify="between" style={{ width: '100%', maxWidth: '500px' }}>
                  <VStack spacing="sm">
                    <Tooltip content="Left start" placement="left-start" showArrow>
                      <Button size="sm">Left Start</Button>
                    </Tooltip>
                    <Tooltip content="Left center" placement="left" showArrow>
                      <Button size="sm">Left</Button>
                    </Tooltip>
                    <Tooltip content="Left end" placement="left-end" showArrow>
                      <Button size="sm">Left End</Button>
                    </Tooltip>
                  </VStack>

                  <VStack spacing="sm">
                    <Tooltip content="Right start" placement="right-start" showArrow>
                      <Button size="sm">Right Start</Button>
                    </Tooltip>
                    <Tooltip content="Right center" placement="right" showArrow>
                      <Button size="sm">Right</Button>
                    </Tooltip>
                    <Tooltip content="Right end" placement="right-end" showArrow>
                      <Button size="sm">Right End</Button>
                    </Tooltip>
                  </VStack>
                </HStack>

                {/* Bottom row */}
                <HStack spacing="md" justify="center">
                  <Tooltip content="Bottom start" placement="bottom-start" showArrow>
                    <Button size="sm">Bottom Start</Button>
                  </Tooltip>
                  <Tooltip content="Bottom center" placement="bottom" showArrow>
                    <Button size="sm">Bottom</Button>
                  </Tooltip>
                  <Tooltip content="Bottom end" placement="bottom-end" showArrow>
                    <Button size="sm">Bottom End</Button>
                  </Tooltip>
                </HStack>
              </VStack>
            </Box>
          ),
          code: `// Top placements
<Tooltip content="Top start" placement="top-start" showArrow>
  <Button>Top Start</Button>
</Tooltip>
<Tooltip content="Top center" placement="top" showArrow>
  <Button>Top</Button>
</Tooltip>
<Tooltip content="Top end" placement="top-end" showArrow>
  <Button>Top End</Button>
</Tooltip>

// Left placements
<Tooltip content="Left start" placement="left-start" showArrow>
  <Button>Left Start</Button>
</Tooltip>
<Tooltip content="Left center" placement="left" showArrow>
  <Button>Left</Button>
</Tooltip>
<Tooltip content="Left end" placement="left-end" showArrow>
  <Button>Left End</Button>
</Tooltip>

// Right placements
<Tooltip content="Right start" placement="right-start" showArrow>
  <Button>Right Start</Button>
</Tooltip>
<Tooltip content="Right center" placement="right" showArrow>
  <Button>Right</Button>
</Tooltip>
<Tooltip content="Right end" placement="right-end" showArrow>
  <Button>Right End</Button>
</Tooltip>

// Bottom placements
<Tooltip content="Bottom start" placement="bottom-start" showArrow>
  <Button>Bottom Start</Button>
</Tooltip>
<Tooltip content="Bottom center" placement="bottom" showArrow>
  <Button>Bottom</Button>
</Tooltip>
<Tooltip content="Bottom end" placement="bottom-end" showArrow>
  <Button>Bottom End</Button>
</Tooltip>`,
        },

        // ===== DELAYS =====
        {
          title: 'Hover & Close Delays',
          description: 'Control when tooltips appear and disappear for better UX',
          preview: (
            <Box
            >
              <VStack spacing="md">
                <HStack spacing="md" justify="center" wrap={true}>
                  <Tooltip content="Shows immediately on hover" delay={0} showArrow>
                    <Button size="sm">No Delay (0ms)</Button>
                  </Tooltip>
                  <Tooltip content="Shows after half a second" delay={500} showArrow>
                    <Button size="sm">Default (500ms)</Button>
                  </Tooltip>
                  <Tooltip content="Shows after 1 second hover" delay={1000} showArrow>
                    <Button size="sm">Slow (1000ms)</Button>
                  </Tooltip>
                </HStack>
                <Body size="xs" color="tertiary" style={{ textAlign: 'center' }}>
                  Hover delays help prevent accidental tooltip triggers during fast mouse movements
                </Body>
                <Divider spacing="sm" />
                <HStack spacing="md" justify="center" wrap={true}>
                  <Tooltip content="Closes immediately when you stop hovering" delay={0} closeDelay={0} showArrow>
                    <Button size="sm">Instant Close</Button>
                  </Tooltip>
                  <Tooltip content="Stays visible for 1 second after mouse leaves" delay={0} closeDelay={1000} showArrow>
                    <Button size="sm">Close Delay (1000ms)</Button>
                  </Tooltip>
                </HStack>
                <Body size="xs" color="tertiary" style={{ textAlign: 'center' }}>
                  Close delays allow users to move their cursor to the tooltip content if needed
                </Body>
              </VStack>
            </Box>
          ),
          code: `// Instant display (no delay)
<Tooltip content="Shows immediately" delay={0} showArrow>
  <Button>No Delay</Button>
</Tooltip>

// Default delay (500ms)
<Tooltip content="Shows after 500ms" delay={500} showArrow>
  <Button>Default</Button>
</Tooltip>

// Slow delay (1000ms)
<Tooltip content="Shows after 1 second" delay={1000} showArrow>
  <Button>Slow</Button>
</Tooltip>

// With close delay
<Tooltip
  content="Stays visible for 1 second after mouse leaves"
  delay={0}
  closeDelay={1000}
  showArrow
>
  <Button>Close Delay</Button>
</Tooltip>`,
        },

        // ===== SIZES =====
        {
          title: 'Size Variants',
          description: 'Choose the appropriate size based on content length and importance',
          preview: (
            <Box
            >
              <HStack spacing="md" justify="center">
                <Tooltip content="Small" size="sm" showArrow>
                  <Button size="sm">Small</Button>
                </Tooltip>
                <Tooltip content="Medium (default)" size="md" showArrow>
                  <Button size="md">Medium</Button>
                </Tooltip>
                <Tooltip content="Large tooltip for more content" size="lg" showArrow>
                  <Button size="lg">Large</Button>
                </Tooltip>
              </HStack>
            </Box>
          ),
          code: `<Tooltip content="Small" size="sm" showArrow>
  <Button size="sm">Small</Button>
</Tooltip>

<Tooltip content="Medium (default)" size="md" showArrow>
  <Button size="md">Medium</Button>
</Tooltip>

<Tooltip content="Large tooltip for more content" size="lg" showArrow>
  <Button size="lg">Large</Button>
</Tooltip>`,
        },

        // ===== WITH ICON BUTTONS (MANUAL) =====
        {
          title: 'With Icon Buttons (Manual)',
          description: 'Manually wrap IconButtons with Tooltip for full control over tooltip behavior',
          preview: (
            <Box
            >
              <HStack spacing="md" justify="center">
                <Tooltip content="Edit item" placement="top" showArrow>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label="Edit"
                    icon={<Icon size="sm"><PencilIcon /></Icon>}
                  />
                </Tooltip>
                <Tooltip content="Delete permanently" placement="top" showArrow color="danger">
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label="Delete"
                    icon={<Icon size="sm"><TrashIcon /></Icon>}
                  />
                </Tooltip>
                <Tooltip content="View information" placement="top" showArrow>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label="Information"
                    icon={<Icon size="sm"><InformationCircleIcon /></Icon>}
                  />
                </Tooltip>
                <Tooltip content="User profile settings" placement="top" showArrow>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label="User Profile"
                    icon={<Icon size="sm"><UserIcon /></Icon>}
                  />
                </Tooltip>
              </HStack>
            </Box>
          ),
          code: `<Tooltip content="Edit item" placement="top" showArrow>
  <IconButton
    variant="ghost"
    size="sm"
    aria-label="Edit"
    icon={<Icon size="sm"><PencilIcon /></Icon>}
  />
</Tooltip>

<Tooltip content="Delete permanently" placement="top" showArrow color="danger">
  <IconButton
    variant="ghost"
    size="sm"
    aria-label="Delete"
    icon={<Icon size="sm"><TrashIcon /></Icon>}
  />
</Tooltip>`,
        },

        // ===== WITH ICON BUTTONS (AUTO) =====
        {
          title: 'With Icon Buttons (Auto - Recommended)',
          description: 'IconButtons automatically show tooltips using their aria-label - no manual wrapping needed!',
          preview: (
            <Box
            >
              <VStack spacing="md">
                <HStack spacing="md" justify="center" wrap={true}>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label="Edit item"
                    icon={<Icon size="sm"><PencilIcon /></Icon>}
                  />
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label="Delete permanently"
                    tooltipColor="danger"
                    icon={<Icon size="sm"><TrashIcon /></Icon>}
                  />
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label="View information"
                    icon={<Icon size="sm"><InformationCircleIcon /></Icon>}
                  />
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label="User profile settings"
                    icon={<Icon size="sm"><UserIcon /></Icon>}
                  />
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label="Add to favorites"
                    tooltipColor="warning"
                    tooltipPlacement="bottom"
                    icon={<Icon size="sm"><HeartIcon /></Icon>}
                  />
                  <IconButton
                    variant="accent"
                    size="sm"
                    aria-label="Star this item"
                    tooltipColor="primary"
                    tooltipPlacement="bottom"
                    icon={<Icon size="sm"><StarIcon /></Icon>}
                  />
                </HStack>
                <Body size="xs" color="secondary" style={{ textAlign: 'center' }}>
                  ✨ Much cleaner! The aria-label is used for both accessibility and the tooltip
                </Body>
              </VStack>
            </Box>
          ),
          code: `// ✨ Auto-tooltip using aria-label (recommended!)
// Much cleaner - no manual Tooltip wrapper needed
<IconButton
  variant="ghost"
  size="sm"
  aria-label="Edit item"
  icon={<Icon size="sm"><PencilIcon /></Icon>}
/>

<IconButton
  variant="ghost"
  size="sm"
  aria-label="Delete permanently"
  tooltipColor="danger"
  icon={<Icon size="sm"><TrashIcon /></Icon>}
/>

// Customize tooltip placement and color
<IconButton
  variant="accent"
  size="sm"
  aria-label="Star this item"
  tooltipColor="primary"
  tooltipPlacement="bottom"
  icon={<Icon size="sm"><StarIcon /></Icon>}
/>`,
        },

        // ===== CONTROLLED STATE =====
        {
          title: 'Controlled State',
          description: 'Control tooltip visibility programmatically for advanced use cases',
          preview: (
            <Box
            >
              <VStack spacing="md" align="center">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsControlledOpen(!isControlledOpen)}
                >
                  {isControlledOpen ? 'Hide' : 'Show'} Tooltip
                </Button>
                <Tooltip
                  content="This tooltip is controlled by external state"
                  isOpen={isControlledOpen}
                  onOpenChange={setIsControlledOpen}
                  showArrow
                >
                  <Button>Controlled Target</Button>
                </Tooltip>
                <Body size="xs" color="tertiary" style={{ textAlign: 'center' }}>
                  Useful for tutorials, guided tours, or conditional tooltips
                </Body>
              </VStack>
            </Box>
          ),
          code: `const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(!isOpen)}>
  {isOpen ? 'Hide' : 'Show'} Tooltip
</Button>

<Tooltip
  content="Controlled tooltip"
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  showArrow
>
  <Button>Target</Button>
</Tooltip>`,
        },

        // ===== CUSTOM CONTENT =====
        {
          title: 'Rich Content',
          description: 'Use complex JSX content inside tooltips for enhanced information display',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
              gap="md"
            >
              <Tooltip
                content={
                  <VStack spacing="xs">
                    <Body size="sm" weight="semibold" style={{ color: 'inherit' }}>
                      John Doe
                    </Body>
                    <Body size="xs" style={{ color: 'inherit', opacity: 0.9 }}>
                      Software Engineer
                    </Body>
                    <Body size="xs" style={{ color: 'inherit', opacity: 0.7 }}>
                      john.doe@example.com
                    </Body>
                  </VStack>
                }
                showArrow
                placement="right"
                size="lg"
              >
                <IconButton
                  variant="ghost"
                  aria-label="User Profile"
                  icon={<Icon><UserIcon /></Icon>}
                />
              </Tooltip>

              <Tooltip
                content={
                  <VStack spacing="xs">
                    <HStack spacing="xs" align="center">
                      <Icon size="sm" style={{ color: 'inherit' }}>
                        <ShieldCheckIcon />
                      </Icon>
                      <Body size="sm" weight="semibold" style={{ color: 'inherit' }}>
                        Verified Account
                      </Body>
                    </HStack>
                    <Body size="xs" style={{ color: 'inherit', opacity: 0.8 }}>
                      This account has been verified and secured
                    </Body>
                  </VStack>
                }
                showArrow
                color="success"
                size="lg"
              >
                <Badge variant="success">Verified</Badge>
              </Tooltip>
            </Box>
          ),
          code: `<Tooltip
  content={
    <VStack spacing="xs">
      <Body size="sm" weight="semibold" style={{ color: 'inherit' }}>
        John Doe
      </Body>
      <Body size="xs" style={{ color: 'inherit', opacity: 0.9 }}>
        Software Engineer
      </Body>
      <Body size="xs" style={{ color: 'inherit', opacity: 0.7 }}>
        john.doe@example.com
      </Body>
    </VStack>
  }
  showArrow
  placement="right"
  size="lg"
>
  <IconButton icon={<Icon><UserIcon /></Icon>} />
</Tooltip>

<Tooltip
  content={
    <VStack spacing="xs">
      <HStack spacing="xs" align="center">
        <Icon size="sm" style={{ color: 'inherit' }}>
          <ShieldCheckIcon />
        </Icon>
        <Body size="sm" weight="semibold">
          Verified Account
        </Body>
      </HStack>
      <Body size="xs" style={{ opacity: 0.8 }}>
        This account has been verified and secured
      </Body>
    </VStack>
  }
  showArrow
  color="success"
  size="lg"
>
  <Badge variant="success">Verified</Badge>
</Tooltip>`,
        },

        // ===== OFFSET =====
        {
          title: 'Offset Distance',
          description: 'Adjust the space between the tooltip and trigger element',
          preview: (
            <Box
            >
              <HStack spacing="md" justify="center">
                <Tooltip content="Small offset (4px)" offset={4} showArrow>
                  <Button size="sm">4px</Button>
                </Tooltip>
                <Tooltip content="Default offset (8px)" offset={8} showArrow>
                  <Button size="sm">8px (default)</Button>
                </Tooltip>
                <Tooltip content="Large offset (16px)" offset={16} showArrow>
                  <Button size="sm">16px</Button>
                </Tooltip>
                <Tooltip content="Extra large offset (24px)" offset={24} showArrow>
                  <Button size="sm">24px</Button>
                </Tooltip>
              </HStack>
            </Box>
          ),
          code: `<Tooltip content="Small offset" offset={4} showArrow>
  <Button>4px</Button>
</Tooltip>

<Tooltip content="Default offset" offset={8} showArrow>
  <Button>8px (default)</Button>
</Tooltip>

<Tooltip content="Large offset" offset={16} showArrow>
  <Button>16px</Button>
</Tooltip>

<Tooltip content="Extra large offset" offset={24} showArrow>
  <Button>24px</Button>
</Tooltip>`,
        },

        // ===== DISABLED =====
        {
          title: 'Disabled State',
          description: 'Disable tooltip functionality when not needed',
          preview: (
            <Box
            >
              <HStack spacing="md" justify="center">
                <Tooltip content="This tooltip will appear on hover" showArrow>
                  <Button size="sm">Enabled Tooltip</Button>
                </Tooltip>
                <Tooltip content="This tooltip is disabled and won't show" disabled showArrow>
                  <Button size="sm" variant="secondary">Disabled Tooltip</Button>
                </Tooltip>
              </HStack>
            </Box>
          ),
          code: `<Tooltip content="This will show" showArrow>
  <Button>Enabled</Button>
</Tooltip>

<Tooltip content="This won't show" disabled showArrow>
  <Button variant="secondary">Disabled</Button>
</Tooltip>`,
        },

        // ===== BEST PRACTICES =====
        {
          title: 'Best Practices',
          description: 'Guidelines for effective tooltip usage',
          preview: (
            <Box>
              <VStack spacing="md">
                <VStack spacing="sm">
                  <Body weight="semibold">✅ Do:</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Keep tooltip text concise and helpful (1-2 sentences max)</Body>
                    <Body size="sm" color="secondary">• Use tooltips for clarification, not essential information</Body>
                    <Body size="sm" color="secondary">• Match tooltip color to semantic meaning (danger for destructive actions)</Body>
                    <Body size="sm" color="secondary">• Use auto-tooltips on IconButtons via aria-label (cleaner code + accessibility)</Body>
                    <Body size="sm" color="secondary">• Add hover delay (500ms default) to prevent accidental triggers</Body>
                    <Body size="sm" color="secondary">• Show arrows to clearly indicate what element the tooltip refers to</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="semibold">❌ Don't:</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Put critical information only in tooltips (not accessible on touch devices)</Body>
                    <Body size="sm" color="secondary">• Use very long text (consider a Popover instead)</Body>
                    <Body size="sm" color="secondary">• Add tooltips to disabled elements without explaining why they're disabled</Body>
                    <Body size="sm" color="secondary">• Use tooltips when a visible label would be better</Body>
                    <Body size="sm" color="secondary">• Stack or nest tooltips inside each other</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="semibold">💡 When to Use Popover Instead:</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Content needs to be interactive (buttons, links, forms)</Body>
                    <Body size="sm" color="secondary">• Content is longer than 2-3 sentences</Body>
                    <Body size="sm" color="secondary">• You need click-to-open behavior instead of hover</Body>
                    <Body size="sm" color="secondary">• Content includes complex layouts or rich formatting</Body>
                  </VStack>
                </VStack>
              </VStack>
            </Box>
          ),
          code: `// ✅ Good - concise and helpful
<Tooltip content="Save your changes" showArrow>
  <Button>Save</Button>
</Tooltip>

// ✅ Good - explains disabled state
<Tooltip content="Complete required fields to enable" showArrow>
  <Button disabled>Submit</Button>
</Tooltip>

// ✅ Good - semantic color
<Tooltip content="This will permanently delete the item" color="danger" showArrow>
  <IconButton aria-label="Delete" icon={<TrashIcon />} />
</Tooltip>

// ❌ Bad - too much text, use Popover instead
<Tooltip content="This is a very long explanation that goes on and on...">
  <Button>Help</Button>
</Tooltip>

// ❌ Bad - essential info shouldn't be hidden in tooltip
<Tooltip content="Required field">
  <input />
</Tooltip>`,
        },

        // ===== API REFERENCE =====
        {
          title: 'API Reference',
          description: 'Complete prop reference for the Tooltip component',
          preview: (
            <Box>
              <VStack spacing="md">
                <Body weight="semibold" size="lg">Tooltip Props</Body>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">content</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: ReactNode</Body>
                    <Body size="sm" color="secondary">• Required: Yes</Body>
                    <Body size="sm" color="secondary">• The content to display inside the tooltip</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">children</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: ReactNode</Body>
                    <Body size="sm" color="secondary">• Required: Yes</Body>
                    <Body size="sm" color="secondary">• The trigger element that activates the tooltip on hover</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">placement</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end"</Body>
                    <Body size="sm" color="secondary">• Default: "top"</Body>
                    <Body size="sm" color="secondary">• Position of the tooltip relative to the trigger</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">delay</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: number</Body>
                    <Body size="sm" color="secondary">• Default: 500</Body>
                    <Body size="sm" color="secondary">• Delay in milliseconds before showing the tooltip on hover</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">closeDelay</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: number</Body>
                    <Body size="sm" color="secondary">• Default: 0</Body>
                    <Body size="sm" color="secondary">• Delay in milliseconds before hiding the tooltip</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">showArrow</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: boolean</Body>
                    <Body size="sm" color="secondary">• Default: false</Body>
                    <Body size="sm" color="secondary">• Whether to show an arrow pointing to the trigger</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">offset</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: number</Body>
                    <Body size="sm" color="secondary">• Default: 8</Body>
                    <Body size="sm" color="secondary">• Distance from the trigger element in pixels</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">color</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: "default" | "primary" | "secondary" | "success" | "warning" | "danger"</Body>
                    <Body size="sm" color="secondary">• Default: "default"</Body>
                    <Body size="sm" color="secondary">• Color variant for semantic meaning</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">size</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: "sm" | "md" | "lg"</Body>
                    <Body size="sm" color="secondary">• Default: "md"</Body>
                    <Body size="sm" color="secondary">• Size variant of the tooltip</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">isOpen</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: boolean</Body>
                    <Body size="sm" color="secondary">• Optional controlled open state</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">onOpenChange</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: (isOpen: boolean) =&gt; void</Body>
                    <Body size="sm" color="secondary">• Callback fired when open state changes</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">disabled</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: boolean</Body>
                    <Body size="sm" color="secondary">• Default: false</Body>
                    <Body size="sm" color="secondary">• Whether the tooltip is disabled</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">closeOnClick</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: boolean</Body>
                    <Body size="sm" color="secondary">• Default: false</Body>
                    <Body size="sm" color="secondary">• Whether to close the tooltip when clicking the trigger</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">className</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: string</Body>
                    <Body size="sm" color="secondary">• Custom class name for the tooltip content</Body>
                  </VStack>
                </VStack>

                <Divider spacing="sm" />

                <VStack spacing="sm">
                  <Body weight="medium">wrapperClassName</Body>
                  <VStack spacing="xs" style={{ paddingLeft: '16px' }}>
                    <Body size="sm" color="secondary">• Type: string</Body>
                    <Body size="sm" color="secondary">• Custom class name for the wrapper element</Body>
                  </VStack>
                </VStack>
              </VStack>
            </Box>
          ),
          code: `interface TooltipProps {
  /** The content to show in the tooltip */
  content: React.ReactNode;

  /** The element that triggers the tooltip */
  children: React.ReactNode;

  /** Placement of the tooltip relative to the trigger */
  placement?:
    | 'top-start' | 'top' | 'top-end'
    | 'bottom-start' | 'bottom' | 'bottom-end'
    | 'left-start' | 'left' | 'left-end'
    | 'right-start' | 'right' | 'right-end';

  /** Delay in milliseconds before showing the tooltip on hover */
  delay?: number;

  /** Delay in milliseconds before hiding the tooltip */
  closeDelay?: number;

  /** Whether to show an arrow pointing to the trigger */
  showArrow?: boolean;

  /** Offset from the trigger element in pixels */
  offset?: number;

  /** Color variant of the tooltip */
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

  /** Size of the tooltip */
  size?: 'sm' | 'md' | 'lg';

  /** Controlled open state */
  isOpen?: boolean;

  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;

  /** Callback when open state changes */
  onOpenChange?: (isOpen: boolean) => void;

  /** Whether the tooltip is disabled */
  disabled?: boolean;

  /** Custom className for the tooltip content */
  className?: string;

  /** Custom className for the wrapper */
  wrapperClassName?: string;

  /** Whether to close on click */
  closeOnClick?: boolean;
}`,
        },
      ]}
    />
  );
}
