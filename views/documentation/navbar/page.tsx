// @ts-nocheck
"use client";

import React, { useState } from 'react';
import { Box, Body } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import { NavbarBar, NavbarPill, NavbarCenterPill } from '../../../design/index';

export default function NavbarPage() {
  const [variant1, setVariant1] = useState('transparent');
  const [variant2, setVariant2] = useState('transparent');
  const [variant3, setVariant3] = useState('transparent');

  // Mock components data
  const createNavbarComponents = () => ({
    logo: {
      key: 'logo_1',
      props: {
        src: 'https://via.placeholder.com/40',
        alt: 'Logo',
        width: 40,
        height: 40,
      }
    },
    'typography-businessName': {
      key: 'businessName_1',
      props: {
        content: 'Blimpify',
        size: 'lg',
        weight: 'extrabold',
      }
    },
    'textlink-menuItem': [
      { props: { content: 'Home', href: '#home', action: { type: 'link' } } },
      { props: { content: 'Features', href: '#features', action: { type: 'link' } } },
      { props: { content: 'Pricing', href: '#pricing', action: { type: 'link' } } },
      { props: { content: 'About', href: '#about', action: { type: 'link' } } },
    ],
    'button-secondaryAction': {
      key: 'secondaryAction_1',
      props: {
        content: 'Login',
        href: '#login',
        action: { type: 'link' },
      }
    },
    'button-primaryAction': {
      key: 'primaryAction_1',
      props: {
        content: 'Sign Up',
        href: '#signup',
        variant: 'primary',
        action: { type: 'link' },
      }
    },
  });

  return (
    <ComponentDocPage
      componentName="Navbar Patterns"
      description="Navigation bar patterns with logo, menu items, and action buttons"
      importStatement={`import { NavbarBar, NavbarPill, NavbarCenterPill } from '../../../design/index'`}
      sections={[
        {
          title: 'NavbarBar',
          description: 'Full-width navigation bar with logo left, menu center, actions right',
          preview: (
            <Box
              className="relative"
              style={{
                height: '400px',
                background: 'linear-gradient(to bottom, var(--surface-base), var(--surface-subtle))',
                overflow: 'hidden'
              }}
            >
              <NavbarBar
                components={createNavbarComponents()}
                backgroundVariant={variant1}
                maxMenuItems={4}
                hideOnScroll={false}
              />
              <Box padding="xl" className="pt-24">
                <Body color="secondary" align="center">
                  Scroll to see navbar behavior
                </Body>
              </Box>

              {/* Variant selector */}
              <Box padding="md" className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Box display="flex" gap="sm">
                  <button
                    onClick={() => setVariant1('transparent')}
                    className={`px-3 py-1 rounded ${variant1 === 'transparent' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Transparent
                  </button>
                  <button
                    onClick={() => setVariant1('glass')}
                    className={`px-3 py-1 rounded ${variant1 === 'glass' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Glass
                  </button>
                  <button
                    onClick={() => setVariant1('solid')}
                    className={`px-3 py-1 rounded ${variant1 === 'solid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Solid
                  </button>
                </Box>
              </Box>
            </Box>
          ),
          code: `<NavbarBar
  components={{
    logo: { props: { src: '/logo.svg', alt: 'Logo' } },
    'typography-businessName': { props: { content: 'Blimpify' } },
    'textlink-menuItem': [
      { props: { content: 'Home', href: '/' } },
      { props: { content: 'Features', href: '/features' } },
    ],
    'button-secondaryAction': { props: { content: 'Login', href: '/login' } },
    'button-primaryAction': { props: { content: 'Sign Up', href: '/signup' } },
  }}
  backgroundVariant="transparent"
  hideOnScroll={false}
/>`,
        },

        {
          title: 'NavbarPill',
          description: 'Compact pill-style navbar with unified border and integrated mobile drawer',
          preview: (
            <Box
              className="relative"
              style={{
                height: '400px',
                background: 'linear-gradient(to bottom, var(--surface-base), var(--surface-subtle))',
                overflow: 'hidden'
              }}
            >
              <NavbarPill
                components={createNavbarComponents()}
                backgroundVariant={variant2}
                maxMenuItems={4}
                hideOnScroll={false}
              />
              <Box padding="xl" className="pt-24">
                <Body color="secondary" align="center">
                  Pill-style navbar with integrated drawer
                </Body>
              </Box>

              {/* Variant selector */}
              <Box padding="md" className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Box display="flex" gap="sm">
                  <button
                    onClick={() => setVariant2('transparent')}
                    className={`px-3 py-1 rounded ${variant2 === 'transparent' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Transparent
                  </button>
                  <button
                    onClick={() => setVariant2('glass')}
                    className={`px-3 py-1 rounded ${variant2 === 'glass' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Glass
                  </button>
                  <button
                    onClick={() => setVariant2('solid')}
                    className={`px-3 py-1 rounded ${variant2 === 'solid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Solid
                  </button>
                </Box>
              </Box>
            </Box>
          ),
          code: `<NavbarPill
  components={{
    logo: { props: { src: '/logo.svg', alt: 'Logo' } },
    'typography-businessName': { props: { content: 'Blimpify' } },
    'textlink-menuItem': [
      { props: { content: 'Home', href: '/' } },
      { props: { content: 'Features', href: '/features' } },
    ],
    'button-secondaryAction': { props: { content: 'Login', href: '/login' } },
    'button-primaryAction': { props: { content: 'Sign Up', href: '/signup' } },
  }}
  backgroundVariant="glass"
  hideOnScroll={false}
/>`,
        },

        {
          title: 'NavbarCenterPill - NEW ✨',
          description: 'Modern navbar with logo left, floating pill menu center, actions right',
          preview: (
            <Box
              className="relative"
              style={{
                height: '400px',
                background: 'linear-gradient(to bottom, var(--surface-base), var(--surface-subtle))',
                overflow: 'hidden'
              }}
            >
              <NavbarCenterPill
                components={createNavbarComponents()}
                backgroundVariant={variant3}
                maxMenuItems={4}
                hideOnScroll={false}
              />
              <Box padding="xl" className="pt-24">
                <Body color="secondary" align="center">
                  Floating pill menu in center - Modern & Clean
                </Body>
              </Box>

              {/* Variant selector */}
              <Box padding="md" className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Box display="flex" gap="sm">
                  <button
                    onClick={() => setVariant3('transparent')}
                    className={`px-3 py-1 rounded ${variant3 === 'transparent' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Transparent
                  </button>
                  <button
                    onClick={() => setVariant3('glass')}
                    className={`px-3 py-1 rounded ${variant3 === 'glass' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Glass
                  </button>
                  <button
                    onClick={() => setVariant3('solid')}
                    className={`px-3 py-1 rounded ${variant3 === 'solid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Solid
                  </button>
                </Box>
              </Box>
            </Box>
          ),
          code: `<NavbarCenterPill
  components={{
    logo: { props: { src: '/logo.svg', alt: 'Logo' } },
    'typography-businessName': { props: { content: 'Blimpify' } },
    'textlink-menuItem': [
      { props: { content: 'Home', href: '/' } },
      { props: { content: 'Features', href: '/features' } },
      { props: { content: 'Pricing', href: '/pricing' } },
      { props: { content: 'About', href: '/about' } },
    ],
    'button-secondaryAction': { props: { content: 'Login', href: '/login' } },
    'button-primaryAction': { props: { content: 'Sign Up', href: '/signup' } },
  }}
  backgroundVariant="transparent"
  hideOnScroll={false}
/>`,
        },

        {
          title: 'Background Variants',
          description: 'All navbar patterns support transparent, glass, and solid backgrounds',
          preview: (
            <Box display="flex" direction="column" gap="lg">
              <Box>
                <Body size="sm" weight="semibold" className="mb-2">Transparent</Body>
                <Body size="xs" color="secondary">
                  No navbar background, pill has frosted glass effect. Perfect for hero sections.
                </Body>
              </Box>
              <Box>
                <Body size="sm" weight="semibold" className="mb-2">Glass</Body>
                <Body size="xs" color="secondary">
                  Frosted glass navbar with enhanced pill. Great for modern, layered designs.
                </Body>
              </Box>
              <Box>
                <Body size="sm" weight="semibold" className="mb-2">Solid</Body>
                <Body size="xs" color="secondary">
                  Full background with border. Traditional and reliable.
                </Body>
              </Box>
            </Box>
          ),
          code: `// Transparent - Hero sections
<NavbarCenterPill backgroundVariant="transparent" />

// Glass - Modern layered design
<NavbarCenterPill backgroundVariant="glass" />

// Solid - Traditional navbar
<NavbarCenterPill backgroundVariant="solid" />`,
        },

        {
          title: 'Features',
          description: 'Common features across all navbar patterns',
          preview: (
            <Box display="flex" direction="column" gap="md">
              <Box>
                <Body size="sm" weight="semibold">✨ Smooth Animations</Body>
                <Body size="xs" color="secondary">
                  Slide-in animations, hover effects, and smooth transitions
                </Body>
              </Box>
              <Box>
                <Body size="sm" weight="semibold">📱 Mobile Responsive</Body>
                <Body size="xs" color="secondary">
                  Automatic drawer menu on mobile with staggered animations
                </Body>
              </Box>
              <Box>
                <Body size="sm" weight="semibold">🎨 Multiple Variants</Body>
                <Body size="xs" color="secondary">
                  Transparent, glass, and solid backgrounds
                </Body>
              </Box>
              <Box>
                <Body size="sm" weight="semibold">🔄 Hide on Scroll</Body>
                <Body size="xs" color="secondary">
                  Optional auto-hide when scrolling down
                </Body>
              </Box>
              <Box>
                <Body size="sm" weight="semibold">🎯 Logo Customization</Body>
                <Body size="xs" color="secondary">
                  Image + text logo with customizable sizing and styling
                </Body>
              </Box>
            </Box>
          ),
          code: `// Enable hide on scroll
<NavbarCenterPill hideOnScroll={true} />

// Custom logo
<NavbarCenterPill
  components={{
    logo: {
      props: {
        src: '/logo.svg',
        width: 48,
        height: 48,
      }
    },
    'typography-businessName': {
      props: {
        content: 'My Brand',
        size: 'xl',
        weight: 'extrabold',
        gradient: true,
      }
    }
  }}
/>`,
        },
      ]}
    />
  );
}
