"use client";

import React from 'react';
import { Body, Avatar, HStack, VStack } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function AvatarPage() {
  return (
    <ComponentDocPage
      componentName="Avatar"
      description="User profile image component with image support, initials fallback, sizes, shapes, colors, borders, and status indicators"
      importStatement={`import { Avatar } from '../../../design/index';`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple avatar with image or initials fallback',
          preview: (
            <HStack spacing="md" align="center">
              <Avatar
                src="https://i.pravatar.cc/150?img=1"
                name="User Avatar"
              />
              <Avatar
                name="John Doe"
              />
            </HStack>
          ),
          code: `import { Avatar } from '../../../design/index';

export function BasicAvatar() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Avatar
        src="https://example.com/avatar.jpg"
        name="User Avatar"
      />

      <Avatar
        name="John Doe"
      />
    </div>
  );
}`,
        },

        {
          title: 'Sizes',
          description: 'Five avatar sizes: xs, sm, md, lg, and xl',
          preview: (
            <HStack spacing="lg" align="end" style={{ width: '100%', justifyContent: 'center' }}>
              <VStack spacing="xs" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=2"
                  name="Extra Small"
                  size="xs"
                />
                <Body size="xs" color="secondary">xs</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=3"
                  name="Small"
                  size="sm"
                />
                <Body size="xs" color="secondary">sm</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=4"
                  name="Medium"
                  size="md"
                />
                <Body size="xs" color="secondary">md</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=5"
                  name="Large"
                  size="lg"
                />
                <Body size="xs" color="secondary">lg</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=6"
                  name="Extra Large"
                  size="xl"
                />
                <Body size="xs" color="secondary">xl</Body>
              </VStack>
            </HStack>
          ),
          code: `import { Avatar } from '../../../design/index';

export function AvatarSizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24 }}>
      <Avatar src="https://example.com/avatar.jpg" name="Extra Small" size="xs" />
      <Avatar src="https://example.com/avatar.jpg" name="Small" size="sm" />
      <Avatar src="https://example.com/avatar.jpg" name="Medium" size="md" />
      <Avatar src="https://example.com/avatar.jpg" name="Large" size="lg" />
      <Avatar src="https://example.com/avatar.jpg" name="Extra Large" size="xl" />
    </div>
  );
}`,
        },

        {
          title: 'Shapes',
          description: 'Circle or square avatar shapes',
          preview: (
            <HStack spacing="lg" align="center" style={{ justifyContent: 'center', width: '100%' }}>
              <VStack spacing="xs" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=7"
                  name="Circle"
                  size="lg"
                  shape="rounded"
                />
                <Body size="xs" color="secondary">circle</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=8"
                  name="Square"
                  shape="square"
                  size="lg"
                />
                <Body size="xs" color="secondary">square</Body>
              </VStack>
            </HStack>
          ),
          code: `import { Avatar } from '../../../design/index';

export function AvatarShapes() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Avatar
        src="https://example.com/avatar.jpg"
        name="Circle"
        shape="circle"
        size="lg"
      />

      <Avatar
        src="https://example.com/avatar.jpg"
        name="Square"
        shape="square"
        size="lg"
      />
    </div>
  );
}`,
        },

        {
          title: 'Initials Fallback',
          description: 'Display user initials when no image is provided',
          preview: (
            <HStack spacing="lg" align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <VStack spacing="xs" align="center">
                <Avatar name="John Doe" />
                <Body size="xs" color="secondary">John Doe</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Avatar name="Sarah Smith" />
                <Body size="xs" color="secondary">Sarah Smith</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Avatar name="Mike Johnson" />
                <Body size="xs" color="secondary">Mike Johnson</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Avatar name="Emma Wilson" />
                <Body size="xs" color="secondary">Emma Wilson</Body>
              </VStack>
            </HStack>
          ),
          code: `import { Avatar } from '../../../design/index';

export function AvatarInitialsFallback() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Avatar name="John Doe" />
      <Avatar name="Sarah Smith" />
      <Avatar name="Mike Johnson" />
      <Avatar name="Emma Wilson" />
    </div>
  );
}`,
        },

        {
          title: 'Status Indicators',
          description: 'Show online, offline, busy, or away status indicators',
          preview: (
            <HStack spacing="lg" align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <VStack spacing="xs" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=9"
                  name="Online"
                  itemProp="online"
                  size="lg"
                />
                <Body size="xs" color="secondary">online</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=10"
                  name="Offline"
                  itemProp="offline"
                  size="lg"
                />
                <Body size="xs" color="secondary">offline</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=11"
                  name="Busy"
                  itemProp="busy"
                  size="lg"
                />
                <Body size="xs" color="secondary">busy</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=12"
                  name="Away"
                  itemProp="away"
                  size="lg"
                />
                <Body size="xs" color="secondary">away</Body>
              </VStack>
            </HStack>
          ),
          code: `import { Avatar } from '../../../design/index';

export function AvatarStatuses() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Avatar
        src="https://example.com/avatar.jpg"
        name="Online"
        itemProp="online"
        size="lg"
      />

      <Avatar
        src="https://example.com/avatar.jpg"
        name="Offline"
        itemProp="offline"
        size="lg"
      />

      <Avatar
        src="https://example.com/avatar.jpg"
        name="Busy"
        itemProp="busy"
        size="lg"
      />

      <Avatar
        src="https://example.com/avatar.jpg"
        name="Away"
        itemProp="away"
        size="lg"
      />
    </div>
  );
}`,
        },

        {
          title: 'Avatar Groups',
          description: 'Display multiple avatars stacked together',
          preview: (
            <HStack spacing="sm" style={{ position: 'relative' }}>
              <div style={{ position: 'relative', marginRight: '-12px', zIndex: 4 }}>
                <Avatar src="https://i.pravatar.cc/150?img=13" name="User 1" size="md" />
              </div>

              <div style={{ position: 'relative', marginRight: '-12px', zIndex: 3 }}>
                <Avatar src="https://i.pravatar.cc/150?img=14" name="User 2" size="md" />
              </div>

              <div style={{ position: 'relative', marginRight: '-12px', zIndex: 2 }}>
                <Avatar src="https://i.pravatar.cc/150?img=15" name="User 3" size="md" />
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <Avatar name="+5" size="md" />
              </div>
            </HStack>
          ),
          code: `import { Avatar } from '../../../design/index';

export function AvatarGroup() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'relative', marginRight: '-12px', zIndex: 4 }}>
        <Avatar src="user1.jpg" name="User 1" size="md" />
      </div>

      <div style={{ position: 'relative', marginRight: '-12px', zIndex: 3 }}>
        <Avatar src="user2.jpg" name="User 2" size="md" />
      </div>

      <div style={{ position: 'relative', marginRight: '-12px', zIndex: 2 }}>
        <Avatar src="user3.jpg" name="User 3" size="md" />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Avatar name="+5" size="md" />
      </div>
    </div>
  );
}`,
        },

        {
          title: 'Bordered Avatars',
          description: 'Add borders and color styling around avatars for emphasis',
          preview: (
            <HStack spacing="lg" align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <VStack spacing="xs" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=16"
                  name="Default border"
                  borderless={false}
                  size="lg"
                />
                <Body size="xs" color="secondary">border</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=17"
                  name="Primary"
                  color="primary"
                  size="lg"
                />
                <Body size="xs" color="secondary">primary</Body>
              </VStack>

              <VStack spacing="xs" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=18"
                  name="Accent"
                  color="accent"
                  size="lg"
                />
                <Body size="xs" color="secondary">accent</Body>
              </VStack>
            </HStack>
          ),
          code: `import { Avatar } from '../../../design/index';

export function BorderedAvatars() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Avatar
        src="https://example.com/avatar.jpg"
        name="Default border"
        borderless={false}
        size="lg"
      />

      <Avatar
        src="https://example.com/avatar.jpg"
        name="Primary"
        color="primary"
        size="lg"
      />

      <Avatar
        src="https://example.com/avatar.jpg"
        name="Accent"
        color="accent"
        size="lg"
      />
    </div>
  );
}`,
        },

        {
          title: 'Practical Examples',
          description: 'Real-world avatar usage patterns for profiles, comments, and teams',
          preview: (
            <VStack spacing="lg" align="stretch" style={{ width: '100%' }}>
              <HStack spacing="md" align="center">
                <Avatar
                  src="https://i.pravatar.cc/150?img=19"
                  name="Sarah Johnson"
                  size="xl"
                />
                <VStack spacing="xs" align="stretch">
                  <Body weight="bold" size="lg">Sarah Johnson</Body>
                  <Body size="sm" color="secondary">Product Designer</Body>
                  <Body size="xs" color="secondary">sarah.johnson@example.com</Body>
                </VStack>
              </HStack>

              <VStack spacing="md" align="stretch">
                <Body weight="medium">Recent Comments</Body>

                <HStack spacing="sm" align="start">
                  <Avatar name="Mike Chen" size="sm" />
                  <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                    <Body size="sm" weight="medium">Mike Chen</Body>
                    <Body size="sm" color="secondary">Great work on the new design!</Body>
                  </VStack>
                </HStack>

                <HStack spacing="sm" align="start">
                  <Avatar src="https://i.pravatar.cc/150?img=20" name="Emma Davis" size="sm" />
                  <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
                    <Body size="sm" weight="medium">Emma Davis</Body>
                    <Body size="sm" color="secondary">Thanks for the feedback!</Body>
                  </VStack>
                </HStack>
              </VStack>

              <VStack spacing="md" align="stretch">
                <Body weight="medium">Team Members (8)</Body>

                <HStack spacing="sm" style={{ position: 'relative' }}>
                  <div style={{ position: 'relative', marginRight: '-8px', zIndex: 8 }}>
                    <Avatar src="https://i.pravatar.cc/150?img=21" name="Member 1" size="sm" borderless={false} />
                  </div>

                  <div style={{ position: 'relative', marginRight: '-8px', zIndex: 7 }}>
                    <Avatar src="https://i.pravatar.cc/150?img=22" name="Member 2" size="sm" borderless={false} />
                  </div>

                  <div style={{ position: 'relative', marginRight: '-8px', zIndex: 6 }}>
                    <Avatar src="https://i.pravatar.cc/150?img=23" name="Member 3" size="sm" borderless={false} />
                  </div>

                  <div style={{ position: 'relative', marginRight: '-8px', zIndex: 5 }}>
                    <Avatar src="https://i.pravatar.cc/150?img=24" name="Member 4" size="sm" borderless={false} />
                  </div>

                  <div style={{ position: 'relative', zIndex: 4 }}>
                    <Avatar name="+4" size="sm" borderless={false} />
                  </div>
                </HStack>
              </VStack>
            </VStack>
          ),
          code: `import { Avatar, Body, HStack, VStack } from '../../../design/index';

export function PracticalAvatars() {
  return (
    <VStack spacing="lg" align="stretch">
      <HStack spacing="md" align="center">
        <Avatar
          src="profile.jpg"
          name="Sarah Johnson"
          size="xl"
        />

        <VStack spacing="xs" align="stretch">
          <Body weight="bold" size="lg">Sarah Johnson</Body>
          <Body size="sm" color="secondary">Product Designer</Body>
          <Body size="xs" color="secondary">sarah.johnson@example.com</Body>
        </VStack>
      </HStack>

      <VStack spacing="md" align="stretch">
        <Body weight="medium">Recent Comments</Body>

        <HStack spacing="sm" align="start">
          <Avatar name="Mike Chen" size="sm" />

          <VStack spacing="xs" align="stretch" style={{ flex: 1 }}>
            <Body size="sm" weight="medium">Mike Chen</Body>
            <Body size="sm" color="secondary">
              Great work on the new design!
            </Body>
          </VStack>
        </HStack>
      </VStack>

      <VStack spacing="md" align="stretch">
        <Body weight="medium">Team Members (8)</Body>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'relative', marginRight: '-8px', zIndex: 8 }}>
            <Avatar src="member1.jpg" name="Member 1" size="sm" borderless={false} />
          </div>

          <div style={{ position: 'relative', marginRight: '-8px', zIndex: 7 }}>
            <Avatar src="member2.jpg" name="Member 2" size="sm" borderless={false} />
          </div>

          <div style={{ position: 'relative', marginRight: '-8px', zIndex: 6 }}>
            <Avatar src="member3.jpg" name="Member 3" size="sm" borderless={false} />
          </div>

          <div style={{ position: 'relative', zIndex: 5 }}>
            <Avatar name="+5" size="sm" borderless={false} />
          </div>
        </div>
      </VStack>
    </VStack>
  );
}`,
        },
      ]}
      properties={[
        { name: 'src', type: 'string', description: 'Image source URL' },
        { name: 'name', type: 'string', description: 'User name used for alt text and initials fallback' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Avatar size' },
        { name: 'shape', type: "'circle' | 'square'", default: "'circle'", description: 'Avatar shape' },
        { name: 'itemProp', type: "'online' | 'offline' | 'busy' | 'away'", description: 'Status indicator value' },
        { name: 'borderless', type: 'boolean', default: 'true', description: 'Remove or show avatar border' },
        { name: 'color', type: "'primary' | 'accent' | string", description: 'Color styling for border or fallback state' },
        { name: 'className', type: 'string', description: 'Optional class name for custom styling' },
        { name: 'style', type: 'React.CSSProperties', description: 'Optional inline styles' },
      ]}
    />
  );
}