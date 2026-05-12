"use client";

import React from 'react';
import { VStack, Banner, Icon } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function BannerPage() {
  return (
    <ComponentDocPage
      componentName="Banner"
      description="Full-width notification banner for important system-wide messages, announcements, warnings, and dismissible updates"
      importStatement={`import { Banner, Icon } from '../../../design/index';
import { InformationCircleIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple banner notification',
          preview: (
            <Banner
              variant="info"
              message="This is a basic banner message"
            />
          ),
          code: `import { Banner } from '../../../design/index';

export function BasicBanner() {
  return (
    <Banner
      variant="info"
      message="This is a basic banner message"
    />
  );
}`,
        },

        {
          title: 'Variants',
          description: 'Six semantic variants: default, info, accent, success, warning, and error',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <Banner
                variant="default"
                message="This is a default banner for general information"
              />
              <Banner
                variant="info"
                message="System maintenance scheduled for tonight at 2 AM EST"
              />
              <Banner
                variant="accent"
                message="Check out our new features and improvements"
              />
              <Banner
                variant="success"
                message="All systems operational - 99.9% uptime this month"
              />
              <Banner
                variant="warning"
                message="Your trial period ends in 3 days. Upgrade to continue using premium features"
              />
              <Banner
                variant="error"
                message="Service disruption detected. Our team is working to resolve the issue"
              />
            </VStack>
          ),
          code: `import { Banner } from '../../../design/index';

export function BannerVariants() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Banner
        variant="default"
        message="This is a default banner for general information"
      />
      <Banner
        variant="info"
        message="System maintenance scheduled for tonight at 2 AM EST"
      />
      <Banner
        variant="accent"
        message="Check out our new features and improvements"
      />
      <Banner
        variant="success"
        message="All systems operational - 99.9% uptime this month"
      />
      <Banner
        variant="warning"
        message="Your trial period ends in 3 days. Upgrade to continue using premium features"
      />
      <Banner
        variant="error"
        message="Service disruption detected. Our team is working to resolve the issue"
      />
    </div>
  );
}`,
        },

        {
          title: 'Surface Variants',
          description: 'Three surface styles for visual hierarchy: subtle, muted, and vibrant',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <Banner
                variant="info"
                surface="subtle"
                message="Subtle surface for soft background emphasis"
              />
              <Banner
                variant="info"
                surface="muted"
                message="Muted surface for medium background emphasis"
              />
              <Banner
                variant="info"
                surface="vibrant"
                message="Vibrant surface for strong visual attention"
              />
            </VStack>
          ),
          code: `import { Banner } from '../../../design/index';

export function BannerSurfaces() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Banner
        variant="info"
        surface="subtle"
        message="Subtle surface for soft background emphasis"
      />
      <Banner
        variant="info"
        surface="muted"
        message="Muted surface for medium background emphasis"
      />
      <Banner
        variant="info"
        surface="vibrant"
        message="Vibrant surface for strong visual attention"
      />
    </div>
  );
}`,
        },

        {
          title: 'Dismissible',
          description: 'Banners that can be closed by the user',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <Banner
                variant="info"
                message="Check out our latest updates in the changelog. Click here to learn more."
                showClose
                onClose={() => console.log('Banner dismissed')}
              />
              <Banner
                variant="warning"
                message="Cookie consent required. We use cookies to improve your experience."
                showClose
                onClose={() => console.log('Banner dismissed')}
              />
            </VStack>
          ),
          code: `import { Banner } from '../../../design/index';

export function DismissibleBanners() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Banner
        variant="info"
        message="Check out our latest updates in the changelog. Click here to learn more."
        showClose
        onClose={() => console.log('Banner dismissed')}
      />
      <Banner
        variant="warning"
        message="Cookie consent required. We use cookies to improve your experience."
        showClose
        onClose={() => console.log('Banner dismissed')}
      />
    </div>
  );
}`,
        },

        {
          title: 'With Icons and Actions',
          description: 'Banners with custom icons and action buttons',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <Banner
                variant="info"
                message="New features are available. Check out what's new in this release."
                icon={<Icon><InformationCircleIcon /></Icon>}
                actionText="Learn More"
                onAction={() => console.log('Action clicked')}
              />
              <Banner
                variant="success"
                message="Your changes have been saved successfully."
                icon={<Icon><CheckCircleIcon /></Icon>}
                actionText="View Details"
                onAction={() => console.log('View details')}
                showClose
                onClose={() => console.log('Closed')}
              />
              <Banner
                variant="warning"
                message="Your trial expires in 3 days. Upgrade to continue using all features."
                icon={<Icon><ExclamationTriangleIcon /></Icon>}
                actionText="Upgrade Now"
                onAction={() => console.log('Upgrade clicked')}
              />
            </VStack>
          ),
          code: `import { Banner, Icon } from '../../../design/index';
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export function BannerWithIconsAndActions() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Banner
        variant="info"
        message="New features are available. Check out what's new in this release."
        icon={<Icon><InformationCircleIcon /></Icon>}
        actionText="Learn More"
        onAction={() => console.log('Action clicked')}
      />

      <Banner
        variant="success"
        message="Your changes have been saved successfully."
        icon={<Icon><CheckCircleIcon /></Icon>}
        actionText="View Details"
        onAction={() => console.log('View details')}
        showClose
        onClose={() => console.log('Closed')}
      />

      <Banner
        variant="warning"
        message="Your trial expires in 3 days. Upgrade to continue using all features."
        icon={<Icon><ExclamationTriangleIcon /></Icon>}
        actionText="Upgrade Now"
        onAction={() => console.log('Upgrade clicked')}
      />
    </div>
  );
}`,
        },

        {
          title: 'Practical Examples',
          description: 'Common banner patterns in real applications',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%' }}>
              <Banner
                variant="success"
                message="Thanks for signing up. Get started by creating your first project."
                showClose
                onClose={() => console.log('Dismissed')}
              />
              <Banner
                variant="error"
                message="Your browser version is outdated and may not support all features. Please update to continue."
              />
              <Banner
                variant="warning"
                message="Upgrade to Pro and save 30% - offer ends in 48 hours!"
                showClose
                onClose={() => console.log('Dismissed')}
              />
              <Banner
                variant="info"
                message="Join us for a live webinar on best practices - Register now for free!"
              />
            </VStack>
          ),
          code: `import { Banner } from '../../../design/index';

export function PracticalBanners() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Banner
        variant="success"
        message="Thanks for signing up. Get started by creating your first project."
        showClose
        onClose={() => console.log('Dismissed')}
      />

      <Banner
        variant="error"
        message="Your browser version is outdated and may not support all features. Please update to continue."
      />

      <Banner
        variant="warning"
        message="Upgrade to Pro and save 30% - offer ends in 48 hours!"
        showClose
        onClose={() => console.log('Dismissed')}
      />

      <Banner
        variant="info"
        message="Join us for a live webinar on best practices - Register now for free!"
      />
    </div>
  );
}`,
        },
      ]}
      properties={[
        { name: 'variant', type: "'default' | 'info' | 'accent' | 'success' | 'warning' | 'error'", default: "'default'", description: 'Semantic banner type' },
        { name: 'surface', type: "'subtle' | 'muted' | 'vibrant'", default: "'subtle'", description: 'Visual surface intensity' },
        { name: 'message', type: 'string', description: 'Banner message text' },
        { name: 'icon', type: 'ReactNode', description: 'Optional custom icon shown before the message' },
        { name: 'actionText', type: 'string', description: 'Text for the optional action button' },
        { name: 'onAction', type: '() => void', description: 'Callback fired when the action is clicked' },
        { name: 'showClose', type: 'boolean', default: 'false', description: 'Show a dismiss button' },
        { name: 'onClose', type: '() => void', description: 'Callback fired when the banner is dismissed' },
        { name: 'className', type: 'string', description: 'Optional class name for custom styling' },
        { name: 'style', type: 'React.CSSProperties', description: 'Optional inline styles' },
      ]}
    />
  );
}