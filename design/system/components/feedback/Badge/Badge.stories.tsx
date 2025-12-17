// ===============================================
// src/design-system/components/feedback/Badge/Badge.stories.tsx
// Badge component examples
// ===============================================

import React from 'react';
import { Badge } from './Badge';
import { IconButton } from '../../actions/IconButton/IconButton';
import { Icon } from '../../media/Icon/Icon';
import { BellIcon, ShoppingCartIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default {
  title: 'Feedback/Badge',
  component: Badge,
};

// Basic Badge
export const BasicUsage = () => (
  <div style={{ display: 'flex', gap: '24px', padding: '40px' }}>
    <Badge content={5} variant="error">
      <div style={{
        width: '40px',
        height: '40px',
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
        width: '40px',
        height: '40px',
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
        width: '40px',
        height: '40px',
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
  </div>
);

// With IconButton (like the NotificationDropdown use case)
export const WithIconButton = () => (
  <div style={{ display: 'flex', gap: '24px', padding: '40px' }}>
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
  </div>
);

// Sizes
export const Sizes = () => (
  <div style={{ display: 'flex', gap: '32px', padding: '40px', alignItems: 'center' }}>
    <Badge content={5} variant="error" size="sm">
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={5} variant="error" size="md">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={5} variant="error" size="lg">
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>
  </div>
);

// Variants
export const Variants = () => (
  <div style={{ display: 'flex', gap: '24px', padding: '40px', flexWrap: 'wrap' }}>
    <Badge content={5} variant="default">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={5} variant="accent">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={5} variant="success">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={5} variant="error">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={5} variant="warning">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={5} variant="info">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>
  </div>
);

// Shapes
export const Shapes = () => (
  <div style={{ display: 'flex', gap: '24px', padding: '40px' }}>
    <Badge content={5} variant="error" shape="rectangle">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={5} variant="error" shape="circle">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content="99+" variant="error" shape="rectangle">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content="99+" variant="error" shape="circle">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>
  </div>
);

// Placements
export const Placements = () => (
  <div style={{ display: 'flex', gap: '48px', padding: '60px', flexWrap: 'wrap' }}>
    <Badge content={5} variant="error" placement="top-right">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={5} variant="error" placement="top-left">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={5} variant="error" placement="bottom-right">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={5} variant="error" placement="bottom-left">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>
  </div>
);

// Dot Badge (indicator without content)
export const DotBadge = () => (
  <div style={{ display: 'flex', gap: '24px', padding: '40px' }}>
    <Badge isDot variant="error" size="sm">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge isDot variant="error" size="md">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge isDot variant="error" size="lg">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge isDot variant="success">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>
  </div>
);

// Large Numbers (99+ formatting)
export const LargeNumbers = () => (
  <div style={{ display: 'flex', gap: '24px', padding: '40px' }}>
    <Badge content={5} variant="error">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={50} variant="error">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={99} variant="error">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={100} variant="error">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={999} variant="error">
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>
  </div>
);

// Visibility Toggle
export const VisibilityToggle = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
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
      </div>

      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: '1px solid var(--border-default)',
          background: 'var(--surface-card)',
          cursor: 'pointer'
        }}
      >
        {isVisible ? 'Hide Badges' : 'Show Badges'}
      </button>
    </div>
  );
};

// Without Outline
export const WithoutOutline = () => (
  <div style={{ display: 'flex', gap: '24px', padding: '40px' }}>
    <Badge content={5} variant="error" showOutline={false}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>

    <Badge content={5} variant="error" showOutline={true}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--surface-subtle)',
      }} />
    </Badge>
  </div>
);

// Real-world Example: Notification Bell
export const NotificationBellExample = () => {
  const [count, setCount] = React.useState(3);

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Badge content={count} variant="error" shape="circle">
          <IconButton
            icon={<Icon size="md" color="button-ghost"><BellIcon /></Icon>}
            variant="ghost"
            size="lg"
            aria-label={`Notifications (${count} unread)`}
          />
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid var(--border-default)',
            background: 'var(--surface-card)',
            cursor: 'pointer'
          }}
        >
          Add Notification
        </button>
        <button
          onClick={() => setCount(Math.max(0, count - 1))}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid var(--border-default)',
            background: 'var(--surface-card)',
            cursor: 'pointer'
          }}
        >
          Remove Notification
        </button>
        <button
          onClick={() => setCount(0)}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid var(--border-default)',
            background: 'var(--surface-card)',
            cursor: 'pointer'
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};
