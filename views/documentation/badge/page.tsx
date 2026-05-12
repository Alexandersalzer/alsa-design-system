"use client";

// ===============================================
// Badge Component Documentation
// Comprehensive examples and usage guide
// ===============================================

import React, { useState } from 'react';
import {
  VStack,
  HStack,
  H1,
  H2,
  Body,
  Card,
  Badge,
  IconButton,
  Icon,
  Avatar,
  Button,
  Divider
} from '../../../design/index';
import {
  BellIcon,
  ShoppingCartIcon,
  EnvelopeIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  InboxIcon
} from '@heroicons/react/24/outline';

export default function BadgePage() {
  const [notificationCount, setNotificationCount] = useState(3);
  const [isVisible, setIsVisible] = useState(true);

  return (
    <VStack spacing="2xl" align="stretch" style={{ padding: 'var(--foundation-space-6)', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <VStack spacing="md" align="start">
        <H1>Badge</H1>
        <Body size="lg" color="secondary">
          Badges are used as small numerical values or status descriptors for UI elements.
        </Body>
      </VStack>

      <Divider />

      {/* Basic Usage */}
      <VStack spacing="lg" align="stretch">
        <H2>Basic Usage</H2>
        <Card>
          <HStack spacing="xl" align="center" style={{ flexWrap: 'wrap' }}>
            <Badge content={5} variant="error">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size="md" color="primary">
                  <BellIcon />
                </Icon>
              </div>
            </Badge>

            <Badge content={99} variant="accent">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size="md" color="primary">
                  <ShoppingCartIcon />
                </Icon>
              </div>
            </Badge>

            <Badge content="New" variant="success">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size="md" color="primary">
                  <EnvelopeIcon />
                </Icon>
              </div>
            </Badge>
          </HStack>
        </Card>
      </VStack>

      {/* With IconButton */}
      <VStack spacing="lg" align="stretch">
        <H2>With IconButton</H2>
        <Body color="secondary">Common use case for notification indicators</Body>
        <Card >
          <HStack spacing="xl" align="center" style={{ flexWrap: 'wrap' }}>
            <Badge content={5} variant="error" shape="circle">
              <IconButton
                icon={<Icon size="md" color="button-ghost"><BellIcon /></Icon>}
                variant="ghost"
                size="lg"
                aria-label="Notifications"
              />
            </Badge>

            <Badge content={12} variant="accent" shape="circle">
              <IconButton
                icon={<Icon size="md" color="button-ghost"><ShoppingCartIcon /></Icon>}
                variant="ghost"
                size="lg"
                aria-label="Shopping cart"
              />
            </Badge>

            <Badge content={99} variant="error" shape="circle">
              <IconButton
                icon={<Icon size="md" color="button-ghost"><EnvelopeIcon /></Icon>}
                variant="ghost"
                size="lg"
                aria-label="Messages"
              />
            </Badge>

            <Badge content="New" variant="success" shape="rectangle">
              <IconButton
                icon={<Icon size="md" color="button-ghost"><InboxIcon /></Icon>}
                variant="ghost"
                size="lg"
                aria-label="Inbox"
              />
            </Badge>
          </HStack>
        </Card>
      </VStack>

      {/* With Avatar */}
      <VStack spacing="lg" align="stretch">
        <H2>With Avatar</H2>
        <Body color="secondary">Badges work great with avatar components</Body>
        <Card >
          <HStack spacing="xl" align="center" style={{ flexWrap: 'wrap' }}>
            <Badge content={5} variant="error" placement="top-right">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                size="lg"
              />
            </Badge>

            <Badge content={5} variant="error" placement="bottom-right">
              <Avatar
                src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                size="lg"
              />
            </Badge>

            <Badge content={5} variant="error" placement="top-left">
              <Avatar
                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                size="lg"
              />
            </Badge>

            <Badge content={5} variant="error" placement="bottom-left">
              <Avatar
                src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                size="lg"
              />
            </Badge>

            <Badge content="New" variant="success" placement="bottom-right" shape="circle">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e290267072"
                size="lg"
              />
            </Badge>
          </HStack>
        </Card>
      </VStack>

      {/* Sizes */}
      <VStack spacing="lg" align="stretch">
        <H2>Sizes</H2>
        <Card >
          <HStack spacing="xl" align="center" style={{ flexWrap: 'wrap' }}>
            <VStack spacing="sm" align="center">
              <Badge content={5} variant="error" size="sm">
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Small</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge content={5} variant="error" size="md">
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Medium</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge content={5} variant="error" size="lg">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Large</Body>
            </VStack>
          </HStack>
        </Card>
      </VStack>

      {/* Variants */}
      <VStack spacing="lg" align="stretch">
        <H2>Variants</H2>
        <Card >
          <HStack spacing="xl" align="center" style={{ flexWrap: 'wrap' }}>
            <VStack spacing="sm" align="center">
              <Badge content={5} variant="default">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Default</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge content={5} variant="accent">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Accent</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge content={5} variant="success">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Success</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge content={5} variant="error">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Error</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge content={5} variant="warning">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Warning</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge content={5} variant="info">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Info</Body>
            </VStack>
          </HStack>
        </Card>
      </VStack>

      {/* Shapes */}
      <VStack spacing="lg" align="stretch">
        <H2>Shapes</H2>
        <Card >
          <HStack spacing="xl" align="center" style={{ flexWrap: 'wrap' }}>
            <VStack spacing="sm" align="center">
              <Badge content={5} variant="error" shape="rectangle">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Rectangle</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge content={5} variant="error" shape="circle">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Circle</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge content="99+" variant="error" shape="rectangle">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Rectangle (99+)</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge content="99+" variant="error" shape="circle">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Circle (99+)</Body>
            </VStack>
          </HStack>
        </Card>
      </VStack>

      {/* Placements */}
      <VStack spacing="lg" align="stretch">
        <H2>Placements</H2>
        <Card >
          <HStack spacing="xl" align="center" style={{ flexWrap: 'wrap' }}>
            <VStack spacing="sm" align="center">
              <Badge content={5} variant="error" placement="top-right">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Top Right</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge content={5} variant="error" placement="top-left">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Top Left</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge content={5} variant="error" placement="bottom-right">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Bottom Right</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge content={5} variant="error" placement="bottom-left">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Bottom Left</Body>
            </VStack>
          </HStack>
        </Card>
      </VStack>

      {/* Dot Badge */}
      <VStack spacing="lg" align="stretch">
        <H2>Dot Badge (Indicator)</H2>
        <Body color="secondary">Show presence or status without content</Body>
        <Card >
          <HStack spacing="xl" align="center" style={{ flexWrap: 'wrap' }}>
            <VStack spacing="sm" align="center">
              <Badge isDot variant="error" size="sm">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Small</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge isDot variant="error" size="md">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Medium</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge isDot variant="error" size="lg">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">Large</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge isDot variant="success">
                <Avatar
                  src="https://i.pravatar.cc/150?u=a042581f4e290267072"
                  size="lg"
                />
              </Badge>
              <Body size="sm" color="secondary">Online Status</Body>
            </VStack>
          </HStack>
        </Card>
      </VStack>

      {/* Large Numbers */}
      <VStack spacing="lg" align="stretch">
        <H2>Large Numbers</H2>
        <Body color="secondary">Numbers over 99 automatically format to "99+"</Body>
        <Card >
          <HStack spacing="xl" align="center" style={{ flexWrap: 'wrap' }}>
            <Badge content={5} variant="error">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
              }} />
            </Badge>

            <Badge content={50} variant="error">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
              }} />
            </Badge>

            <Badge content={99} variant="error">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
              }} />
            </Badge>

            <Badge content={100} variant="error">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
              }} />
            </Badge>

            <Badge content={999} variant="error">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
              }} />
            </Badge>
          </HStack>
        </Card>
      </VStack>

      {/* Text Content */}
      <VStack spacing="lg" align="stretch">
        <H2>Text Content</H2>
        <Body color="secondary">Badges can display text content like "New", "Hot", "Sale"</Body>
        <Card >
          <HStack spacing="xl" align="center" style={{ flexWrap: 'wrap' }}>
            <Badge content="New" variant="success">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
              }} />
            </Badge>

            <Badge content="Hot" variant="error">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
              }} />
            </Badge>

            <Badge content="Sale" variant="warning">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
              }} />
            </Badge>

            <Badge content="Pro" variant="accent">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
              }} />
            </Badge>

            <Badge content="Beta" variant="info">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: 'var(--surface-subtle)',
              }} />
            </Badge>
          </HStack>
        </Card>
      </VStack>

      {/* Visibility Toggle */}
      <VStack spacing="lg" align="stretch">
        <H2>Visibility Toggle</H2>
        <Body color="secondary">Control badge visibility dynamically</Body>
        <Card >
          <VStack spacing="lg" align="start">
            <HStack spacing="xl" align="center" style={{ flexWrap: 'wrap' }}>
              <Badge content={5} variant="error" isInvisible={!isVisible}>
                <IconButton
                  icon={<Icon size="md" color="button-ghost"><BellIcon /></Icon>}
                  variant="ghost"
                  size="lg"
                  aria-label="Notifications"
                />
              </Badge>

              <Badge content={12} variant="accent" isInvisible={!isVisible}>
                <IconButton
                  icon={<Icon size="md" color="button-ghost"><ShoppingCartIcon /></Icon>}
                  variant="ghost"
                  size="lg"
                  aria-label="Shopping cart"
                />
              </Badge>
            </HStack>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? 'Hide Badges' : 'Show Badges'}
            </Button>
          </VStack>
        </Card>
      </VStack>

      {/* Without Outline */}
      <VStack spacing="lg" align="stretch">
        <H2>Without Outline</H2>
        <Body color="secondary">Remove the white border around the badge</Body>
        <Card >
          <HStack spacing="xl" align="center" style={{ flexWrap: 'wrap' }}>
            <VStack spacing="sm" align="center">
              <Badge content={5} variant="error" showOutline={false}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">No Outline</Body>
            </VStack>

            <VStack spacing="sm" align="center">
              <Badge content={5} variant="error" showOutline={true}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'var(--surface-subtle)',
                }} />
              </Badge>
              <Body size="sm" color="secondary">With Outline</Body>
            </VStack>
          </HStack>
        </Card>
      </VStack>

      {/* Interactive Example */}
      <VStack spacing="lg" align="stretch">
        <H2>Interactive Example: Notification Bell</H2>
        <Body color="secondary">A real-world example with dynamic count</Body>
        <Card >
          <VStack spacing="lg" align="start">
            <Badge content={notificationCount} variant="error" shape="circle">
              <IconButton
                icon={<Icon size="md" color="button-ghost"><BellIcon /></Icon>}
                variant="ghost"
                size="lg"
                aria-label={`Notifications (${notificationCount} unread)`}
              />
            </Badge>

            <HStack spacing="sm" style={{ flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setNotificationCount(notificationCount + 1)}
              >
                Add Notification
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setNotificationCount(Math.max(0, notificationCount - 1))}
              >
                Remove Notification
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setNotificationCount(0)}
              >
                Clear All
              </Button>
            </HStack>
          </VStack>
        </Card>
      </VStack>

      {/* API Reference */}
      <VStack spacing="lg" align="stretch">
        <H2>API Reference</H2>
        <Card >
          <VStack spacing="md" align="stretch">
            <Body weight="semibold">Props</Body>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 600 }}>Prop</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 600 }}>Type</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 600 }}>Default</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontWeight: 600 }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>children</td>
                    <td style={{ padding: '12px' }}>ReactNode</td>
                    <td style={{ padding: '12px' }}>-</td>
                    <td style={{ padding: '12px' }}>Content to be badged</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>content</td>
                    <td style={{ padding: '12px' }}>string | number | ReactNode</td>
                    <td style={{ padding: '12px' }}>-</td>
                    <td style={{ padding: '12px' }}>Badge content</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>variant</td>
                    <td style={{ padding: '12px' }}>default | accent | success | error | warning | info</td>
                    <td style={{ padding: '12px' }}>default</td>
                    <td style={{ padding: '12px' }}>Visual variant</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>size</td>
                    <td style={{ padding: '12px' }}>sm | md | lg</td>
                    <td style={{ padding: '12px' }}>md</td>
                    <td style={{ padding: '12px' }}>Badge size</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>shape</td>
                    <td style={{ padding: '12px' }}>circle | rectangle</td>
                    <td style={{ padding: '12px' }}>rectangle</td>
                    <td style={{ padding: '12px' }}>Badge shape</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>placement</td>
                    <td style={{ padding: '12px' }}>top-right | top-left | bottom-right | bottom-left</td>
                    <td style={{ padding: '12px' }}>top-right</td>
                    <td style={{ padding: '12px' }}>Badge placement</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>showOutline</td>
                    <td style={{ padding: '12px' }}>boolean</td>
                    <td style={{ padding: '12px' }}>true</td>
                    <td style={{ padding: '12px' }}>Show white border</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>isInvisible</td>
                    <td style={{ padding: '12px' }}>boolean</td>
                    <td style={{ padding: '12px' }}>false</td>
                    <td style={{ padding: '12px' }}>Hide the badge</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>isDot</td>
                    <td style={{ padding: '12px' }}>boolean</td>
                    <td style={{ padding: '12px' }}>false</td>
                    <td style={{ padding: '12px' }}>Show as dot indicator</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>isOneChar</td>
                    <td style={{ padding: '12px' }}>boolean</td>
                    <td style={{ padding: '12px' }}>false</td>
                    <td style={{ padding: '12px' }}>Optimize for single character</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VStack>
        </Card>
      </VStack>

      {/* Accessibility */}
      <VStack spacing="lg" align="stretch">
        <H2>Accessibility</H2>
        <Card >
          <VStack spacing="md" align="stretch">
            <Body>
              It's not advisable to depend on the badge's content for accurate announcement.
              Instead, consider supplying a comprehensive description using <code>aria-label</code>.
            </Body>
            <div style={{
              background: 'var(--surface-subtle)',
              padding: 'var(--foundation-space-4)',
              borderRadius: 'var(--foundation-radius-md)',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}>
              {`<Badge content={5} variant="error" aria-label="5 unread notifications">
  <IconButton aria-label="Notifications" />
</Badge>`}
            </div>
          </VStack>
        </Card>
      </VStack>
    </VStack>
  );
}
