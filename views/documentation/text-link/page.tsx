"use client";

import React from 'react';
import { Box, Body, TextLink, Icon, VStack, HStack } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import { ArrowTopRightOnSquareIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function TextLinkPage() {
  return (
    <ComponentDocPage
      componentName="TextLink"
      description="Text-based navigation links with consistent styling and accessibility. Features color-change hover by default with optional underline variants."
      importStatement={`import { TextLink } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple text links with color-change hover (default behavior)',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <TextLink href="/dashboard">Go to Dashboard</TextLink>
            </Box>
          ),
          code: `<TextLink href="/dashboard">Go to Dashboard</TextLink>`,
        },

        {
          title: 'All Variants',
          description: 'All available visual styles (primary, secondary, accent, ghost, brand)',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1 sm:grid-cols-3 lg:grid-cols-5"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink variant="primary" href="#">Primary</TextLink>
                <Body size="xs" color="secondary">Default</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink variant="secondary" href="#">Secondary</TextLink>
                <Body size="xs" color="secondary">Subtle</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink variant="accent" href="#">Accent</TextLink>
                <Body size="xs" color="secondary">CTA</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink variant="ghost" href="#">Ghost</TextLink>
                <Body size="xs" color="secondary">Minimal</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink variant="brand" href="#">Brand</TextLink>
                <Body size="xs" color="secondary">Brand</Body>
              </Box>
            </Box>
          ),
          code: `<TextLink variant="primary" href="#">Primary</TextLink>

<TextLink variant="secondary" href="#">Secondary</TextLink>

<TextLink variant="accent" href="#">Accent</TextLink>

<TextLink variant="ghost" href="#">Ghost</TextLink>

<TextLink variant="brand" href="#">Brand</TextLink>`        },

        {
          title: 'All Sizes',
          description: 'Available size variants (sm, md, lg, xl)',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink size="sm" href="#">Small Link</TextLink>
                <Body size="xs" color="secondary">size="sm"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink size="md" href="#">Medium Link</TextLink>
                <Body size="xs" color="secondary">size="md"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink size="lg" href="#">Large Link</TextLink>
                <Body size="xs" color="secondary">size="lg"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink size="xl" href="#">Extra Large</TextLink>
                <Body size="xs" color="secondary">size="xl"</Body>
              </Box>
            </Box>
          ),
          code: `<TextLink size="sm" href="#">Small Link</TextLink>

<TextLink size="md" href="#">Medium Link</TextLink>

<TextLink size="lg" href="#">Large Link</TextLink>

<TextLink size="xl" href="#">Extra Large</TextLink>`        },

        {
          title: 'Font Weights',
          description: 'Available weight variants (regular, medium, semibold, bold)',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink weight="regular" href="#">Regular</TextLink>
                <Body size="xs" color="secondary">weight="regular"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink weight="medium" href="#">Medium</TextLink>
                <Body size="xs" color="secondary">weight="medium"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink weight="semibold" href="#">Semibold</TextLink>
                <Body size="xs" color="secondary">weight="semibold"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink weight="bold" href="#">Bold</TextLink>
                <Body size="xs" color="secondary">weight="bold"</Body>
              </Box>
            </Box>
          ),
          code: `<TextLink weight="regular" href="#">Regular</TextLink>

<TextLink weight="medium" href="#">Medium</TextLink>

<TextLink weight="semibold" href="#">Semibold</TextLink>

<TextLink weight="bold" href="#">Bold</TextLink>`        },

        {
          title: 'Underline Variants',
          description: 'Control underline behavior (none, hover, always). Default is "none" with color-change hover.',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1 sm:grid-cols-3"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink  underline="none" href="#">No Underline</TextLink>
                <Body size="xs" color="secondary">underline="none" (default)</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink underline="hover" href="#">Hover Underline</TextLink>
                <Body size="xs" color="secondary">underline="hover"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink underline="always" href="#">Always Underlined</TextLink>
                <Body size="xs" color="secondary">underline="always"</Body>
              </Box>
            </Box>
          ),
          code: `<TextLink underline="none" href="#">No Underline</TextLink>

<TextLink underline="hover" href="#">Hover Underline</TextLink>

<TextLink underline="always" href="#">Always Underlined</TextLink>`        },

        {
          title: 'With Icons',
          description: 'TextLinks with left and right icons',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1 sm:grid-cols-2"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink
                  href="#"
                  leftIcon={<Icon size="sm"><ArrowRightIcon /></Icon>}
                >
                  With Left Icon
                </TextLink>
                <Body size="xs" color="secondary">leftIcon prop</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <TextLink
                  href="#"
                  rightIcon={<Icon size="sm"><ArrowTopRightOnSquareIcon /></Icon>}
                >
                  With Right Icon
                </TextLink>
                <Body size="xs" color="secondary">rightIcon prop</Body>
              </Box>
            </Box>
          ),
          code: `<TextLink
  href="#"
  leftIcon={<Icon size="sm"><ArrowRightIcon /></Icon>}
>
  With Left Icon
</TextLink>

<TextLink
  href="#"
  rightIcon={<Icon size="sm"><ArrowTopRightOnSquareIcon /></Icon>}
>
  With Right Icon
</TextLink>`        },

        {
          title: 'Disabled State',
          description: 'Disabled links with reduced opacity and no interaction',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
              gap="md"
            >
              <TextLink href="#" disabled>Disabled Link</TextLink>
            </Box>
          ),
          code: `<TextLink href="#" disabled>Disabled Link</TextLink>`,
        },

        {
          title: 'External Links',
          description: 'Links that open in new tabs with external icon',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
              gap="md"
            >
              <TextLink
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                rightIcon={<Icon size="sm"><ArrowTopRightOnSquareIcon /></Icon>}
              >
                Visit External Site
              </TextLink>
            </Box>
          ),
          code: `<TextLink
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
  rightIcon={<Icon size="sm"><ArrowTopRightOnSquareIcon /></Icon>}
>
  Visit External Site
</TextLink>`,
        },

        {
          title: 'Practical Examples',
          description: 'Common patterns using TextLink',
          preview: (
            <Box display="flex" direction="column" gap="md">
              <Box>
                <Body>
                  Read our{' '}
                  <TextLink href="/privacy">privacy policy</TextLink>
                  {' '}and{' '}
                  <TextLink href="/terms">terms of service</TextLink>
                  {' '}for more information.
                </Body>
              </Box>
              <Box>
                <VStack spacing="sm" align="start">
                  <Body weight="medium">Quick Links</Body>
                  <VStack spacing="xs" align="start">
                    <TextLink href="/docs">Documentation</TextLink>
                    <TextLink href="/support">Support Center</TextLink>
                    <TextLink href="/api">API Reference</TextLink>
                  </VStack>
                </VStack>
              </Box>
              <Box>
                <VStack spacing="sm" align="start">
                  <Body weight="medium">Footer Navigation</Body>
                  <HStack spacing="md">
                    <TextLink href="/about" size="sm">About</TextLink>
                    <TextLink href="/contact" size="sm">Contact</TextLink>
                    <TextLink href="/careers" size="sm">Careers</TextLink>
                    <TextLink href="/blog" size="sm">Blog</TextLink>
                  </HStack>
                </VStack>
              </Box>
            </Box>
          ),
          code: `// Inline text links
<Body>
  Read our <TextLink href="/privacy">privacy policy</TextLink>
  and <TextLink href="/terms">terms of service</TextLink>
  for more information.
</Body>

// Navigation menu (vertical)
<VStack spacing="xs" align="start">
  <TextLink href="/docs">Documentation</TextLink>
  <TextLink href="/support">Support Center</TextLink>
  <TextLink href="/api">API Reference</TextLink>
</VStack>

// Footer navigation (horizontal)
<HStack spacing="md">
  <TextLink href="/about" size="sm">About</TextLink>
  <TextLink href="/contact" size="sm">Contact</TextLink>
  <TextLink href="/careers" size="sm">Careers</TextLink>
  <TextLink href="/blog" size="sm">Blog</TextLink>
</HStack>`        },

        {
          title: 'Variant Combinations',
          description: 'Examples combining variants, sizes, weights, and underlines',
          preview: (
            <Box display="flex" direction="column" gap="md">
              <Box>
                <VStack spacing="sm" align="start">
                  <Body size="xs" color="secondary" weight="medium">Accent + Large + Bold + Underline Hover</Body>
                  <TextLink variant="accent" size="lg" weight="bold" underline="hover" href="#">
                    Call to Action Link
                  </TextLink>
                </VStack>
              </Box>
              <Box>
                <VStack spacing="sm" align="start">
                  <Body size="xs" color="secondary" weight="medium">Ghost + Small + Regular</Body>
                  <TextLink variant="ghost" size="sm" weight="regular" href="#">
                    Subtle footer link
                  </TextLink>
                </VStack>
              </Box>
              <Box>
                <VStack spacing="sm" align="start">
                  <Body size="xs" color="secondary" weight="medium">Brand + XL + Bold + Icon</Body>
                  <TextLink
                    variant="brand"
                    size="xl"
                    weight="bold"
                    href="#"
                    rightIcon={<Icon size="md"><ArrowRightIcon /></Icon>}
                  >
                    Blimpify
                  </TextLink>
                </VStack>
              </Box>
            </Box>
          ),
          code: `<TextLink
  variant="accent"
  size="lg"
  weight="bold"
  underline="hover"
  href="#"
>
  Call to Action Link
</TextLink>

<TextLink
  variant="ghost"
  size="sm"
  weight="regular"
  href="#"
>
  Subtle footer link
</TextLink>

<TextLink
  variant="brand"
  size="xl"
  weight="bold"
  href="#"
  rightIcon={<Icon size="md"><ArrowRightIcon /></Icon>}
>
  Blimpify
</TextLink>`        },
      ]}
    />
  );
}
