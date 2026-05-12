"use client";

import React from 'react';
import { VStack, Body, Breadcrumbs, BreadcrumbItem, Icon } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import {
  HomeIcon,
  FolderIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function BreadcrumbsPage() {
  return (
    <ComponentDocPage
      componentName="Breadcrumbs"
      description="Navigation component that shows the current page location within a site or product hierarchy"
      importStatement={`import { Breadcrumbs, BreadcrumbItem, Icon } from '../../../design/index';
import { HomeIcon, FolderIcon, DocumentTextIcon } from '@heroicons/react/24/outline';`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple breadcrumb navigation with text items',
          preview: (
            <Breadcrumbs>
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/products">Products</BreadcrumbItem>
              <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
            </Breadcrumbs>
          ),
          code: `import { Breadcrumbs, BreadcrumbItem } from '../../../design/index';

export function BasicBreadcrumbs() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
    </Breadcrumbs>
  );
}`,
        },

        {
          title: 'With Icons',
          description: 'Add icons to breadcrumb items for stronger visual context',
          preview: (
            <Breadcrumbs>
              <BreadcrumbItem
                href="/"
                startContent={<Icon size="sm"><HomeIcon /></Icon>}
              >
                Home
              </BreadcrumbItem>
              <BreadcrumbItem
                href="/documents"
                startContent={<Icon size="sm"><FolderIcon /></Icon>}
              >
                Documents
              </BreadcrumbItem>
              <BreadcrumbItem
                isCurrent
                startContent={<Icon size="sm"><DocumentTextIcon /></Icon>}
              >
                Report.pdf
              </BreadcrumbItem>
            </Breadcrumbs>
          ),
          code: `import { Breadcrumbs, BreadcrumbItem, Icon } from '../../../design/index';
import {
  HomeIcon,
  FolderIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export function BreadcrumbsWithIcons() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem
        href="/"
        startContent={<Icon size="sm"><HomeIcon /></Icon>}
      >
        Home
      </BreadcrumbItem>

      <BreadcrumbItem
        href="/documents"
        startContent={<Icon size="sm"><FolderIcon /></Icon>}
      >
        Documents
      </BreadcrumbItem>

      <BreadcrumbItem
        isCurrent
        startContent={<Icon size="sm"><DocumentTextIcon /></Icon>}
      >
        Report.pdf
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}`,
        },

        {
          title: 'Sizes',
          description: 'Three breadcrumb sizes: sm, md, and lg',
          preview: (
            <VStack spacing="lg" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="xs" align="stretch">
                <Breadcrumbs size="sm">
                  <BreadcrumbItem href="/">Home</BreadcrumbItem>
                  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
                  <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
                </Breadcrumbs>
                <Body size="xs" color="secondary">size="sm"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch">
                <Breadcrumbs size="md">
                  <BreadcrumbItem href="/">Home</BreadcrumbItem>
                  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
                  <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
                </Breadcrumbs>
                <Body size="xs" color="secondary">size="md"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch">
                <Breadcrumbs size="lg">
                  <BreadcrumbItem href="/">Home</BreadcrumbItem>
                  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
                  <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
                </Breadcrumbs>
                <Body size="xs" color="secondary">size="lg"</Body>
              </VStack>
            </VStack>
          ),
          code: `import { Breadcrumbs, BreadcrumbItem } from '../../../design/index';

export function BreadcrumbSizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Breadcrumbs size="sm">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
      </Breadcrumbs>

      <Breadcrumbs size="md">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
      </Breadcrumbs>

      <Breadcrumbs size="lg">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
}`,
        },

        {
          title: 'Variants',
          description: 'Three visual styles: solid, bordered, and light',
          preview: (
            <VStack spacing="lg" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="xs" align="stretch">
                <Breadcrumbs variant="solid">
                  <BreadcrumbItem href="/">Home</BreadcrumbItem>
                  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
                  <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
                </Breadcrumbs>
                <Body size="xs" color="secondary">variant="solid"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch">
                <Breadcrumbs variant="bordered">
                  <BreadcrumbItem href="/">Home</BreadcrumbItem>
                  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
                  <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
                </Breadcrumbs>
                <Body size="xs" color="secondary">variant="bordered"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch">
                <Breadcrumbs variant="light">
                  <BreadcrumbItem href="/">Home</BreadcrumbItem>
                  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
                  <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
                </Breadcrumbs>
                <Body size="xs" color="secondary">variant="light"</Body>
              </VStack>
            </VStack>
          ),
          code: `import { Breadcrumbs, BreadcrumbItem } from '../../../design/index';

export function BreadcrumbVariants() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Breadcrumbs variant="solid">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
      </Breadcrumbs>

      <Breadcrumbs variant="bordered">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
      </Breadcrumbs>

      <Breadcrumbs variant="light">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
}`,
        },

        {
          title: 'Underline Styles',
          description: 'Control when breadcrumb links are underlined',
          preview: (
            <VStack spacing="lg" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="xs" align="stretch">
                <Breadcrumbs underline="none">
                  <BreadcrumbItem href="/">Home</BreadcrumbItem>
                  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
                  <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
                </Breadcrumbs>
                <Body size="xs" color="secondary">underline="none"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch">
                <Breadcrumbs underline="hover">
                  <BreadcrumbItem href="/">Home</BreadcrumbItem>
                  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
                  <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
                </Breadcrumbs>
                <Body size="xs" color="secondary">underline="hover"</Body>
              </VStack>

              <VStack spacing="xs" align="stretch">
                <Breadcrumbs underline="always">
                  <BreadcrumbItem href="/">Home</BreadcrumbItem>
                  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
                  <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
                </Breadcrumbs>
                <Body size="xs" color="secondary">underline="always"</Body>
              </VStack>
            </VStack>
          ),
          code: `import { Breadcrumbs, BreadcrumbItem } from '../../../design/index';

export function BreadcrumbUnderlineStyles() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Breadcrumbs underline="none">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
      </Breadcrumbs>

      <Breadcrumbs underline="hover">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
      </Breadcrumbs>

      <Breadcrumbs underline="always">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
}`,
        },

        {
          title: 'Custom Separator',
          description: 'Use a custom separator between breadcrumb items',
          preview: (
            <VStack spacing="lg" align="stretch" style={{ width: '100%' }}>
              <Breadcrumbs separator="/">
                <BreadcrumbItem href="/">Home</BreadcrumbItem>
                <BreadcrumbItem href="/products">Products</BreadcrumbItem>
                <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
              </Breadcrumbs>

              <Breadcrumbs separator="-">
                <BreadcrumbItem href="/">Home</BreadcrumbItem>
                <BreadcrumbItem href="/products">Products</BreadcrumbItem>
                <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
              </Breadcrumbs>

              <Breadcrumbs separator="·">
                <BreadcrumbItem href="/">Home</BreadcrumbItem>
                <BreadcrumbItem href="/products">Products</BreadcrumbItem>
                <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
              </Breadcrumbs>
            </VStack>
          ),
          code: `import { Breadcrumbs, BreadcrumbItem } from '../../../design/index';

export function BreadcrumbSeparators() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Breadcrumbs separator="/">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
      </Breadcrumbs>

      <Breadcrumbs separator="-">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
      </Breadcrumbs>

      <Breadcrumbs separator="·">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
      </Breadcrumbs>
    </div>
  );
}`,
        },

        {
          title: 'Collapsed Breadcrumbs',
          description: 'Automatically collapse breadcrumbs when there are too many items',
          preview: (
            <Breadcrumbs maxItems={4} itemsBeforeCollapse={1} itemsAfterCollapse={2}>
              <BreadcrumbItem href="/">Home</BreadcrumbItem>
              <BreadcrumbItem href="/category">Category</BreadcrumbItem>
              <BreadcrumbItem href="/subcategory">Subcategory</BreadcrumbItem>
              <BreadcrumbItem href="/products">Products</BreadcrumbItem>
              <BreadcrumbItem href="/electronics">Electronics</BreadcrumbItem>
              <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
            </Breadcrumbs>
          ),
          code: `import { Breadcrumbs, BreadcrumbItem } from '../../../design/index';

export function CollapsedBreadcrumbs() {
  return (
    <Breadcrumbs
      maxItems={4}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={2}
    >
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/category">Category</BreadcrumbItem>
      <BreadcrumbItem href="/subcategory">Subcategory</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem href="/electronics">Electronics</BreadcrumbItem>
      <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
    </Breadcrumbs>
  );
}`,
        },

        {
          title: 'Practical Examples',
          description: 'Real-world breadcrumb usage patterns',
          preview: (
            <VStack spacing="lg" align="stretch" style={{ width: '100%' }}>
              <VStack spacing="sm" align="stretch">
                <Body weight="semibold" size="sm">E-commerce Product Page</Body>
                <Breadcrumbs>
                  <BreadcrumbItem
                    href="/"
                    startContent={<Icon size="sm"><HomeIcon /></Icon>}
                  >
                    Home
                  </BreadcrumbItem>
                  <BreadcrumbItem href="/electronics">Electronics</BreadcrumbItem>
                  <BreadcrumbItem href="/electronics/computers">Computers</BreadcrumbItem>
                  <BreadcrumbItem isCurrent>MacBook Pro 16"</BreadcrumbItem>
                </Breadcrumbs>
              </VStack>

              <VStack spacing="sm" align="stretch">
                <Body weight="semibold" size="sm">Dashboard Settings</Body>
                <Breadcrumbs color="accent">
                  <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
                  <BreadcrumbItem href="/dashboard/settings">Settings</BreadcrumbItem>
                  <BreadcrumbItem isCurrent>Profile</BreadcrumbItem>
                </Breadcrumbs>
              </VStack>

              <VStack spacing="sm" align="stretch">
                <Body weight="semibold" size="sm">File Browser</Body>
                <Breadcrumbs separator="/" underline="hover">
                  <BreadcrumbItem
                    href="/files"
                    startContent={<Icon size="sm"><FolderIcon /></Icon>}
                  >
                    Files
                  </BreadcrumbItem>
                  <BreadcrumbItem href="/files/documents">Documents</BreadcrumbItem>
                  <BreadcrumbItem href="/files/documents/2024">2024</BreadcrumbItem>
                  <BreadcrumbItem isCurrent>Q4 Report</BreadcrumbItem>
                </Breadcrumbs>
              </VStack>
            </VStack>
          ),
          code: `import { Breadcrumbs, BreadcrumbItem, Icon, Body, VStack } from '../../../design/index';
import { HomeIcon, FolderIcon } from '@heroicons/react/24/outline';

export function PracticalBreadcrumbs() {
  return (
    <VStack spacing="lg" align="stretch">
      <VStack spacing="sm" align="stretch">
        <Body weight="semibold" size="sm">E-commerce Product Page</Body>

        <Breadcrumbs>
          <BreadcrumbItem
            href="/"
            startContent={<Icon size="sm"><HomeIcon /></Icon>}
          >
            Home
          </BreadcrumbItem>
          <BreadcrumbItem href="/electronics">Electronics</BreadcrumbItem>
          <BreadcrumbItem href="/electronics/computers">Computers</BreadcrumbItem>
          <BreadcrumbItem isCurrent>MacBook Pro 16"</BreadcrumbItem>
        </Breadcrumbs>
      </VStack>

      <VStack spacing="sm" align="stretch">
        <Body weight="semibold" size="sm">Dashboard Settings</Body>

        <Breadcrumbs color="accent">
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem href="/dashboard/settings">Settings</BreadcrumbItem>
          <BreadcrumbItem isCurrent>Profile</BreadcrumbItem>
        </Breadcrumbs>
      </VStack>

      <VStack spacing="sm" align="stretch">
        <Body weight="semibold" size="sm">File Browser</Body>

        <Breadcrumbs separator="/" underline="hover">
          <BreadcrumbItem
            href="/files"
            startContent={<Icon size="sm"><FolderIcon /></Icon>}
          >
            Files
          </BreadcrumbItem>
          <BreadcrumbItem href="/files/documents">Documents</BreadcrumbItem>
          <BreadcrumbItem href="/files/documents/2024">2024</BreadcrumbItem>
          <BreadcrumbItem isCurrent>Q4 Report</BreadcrumbItem>
        </Breadcrumbs>
      </VStack>
    </VStack>
  );
}`,
        },
      ]}
      properties={[
        { name: 'Breadcrumbs', type: 'component', description: 'Root breadcrumb navigation wrapper' },
        { name: 'BreadcrumbItem', type: 'component', description: 'Individual breadcrumb item' },
        { name: 'href', type: 'string', description: 'Link URL for clickable breadcrumb items' },
        { name: 'isCurrent', type: 'boolean', default: 'false', description: 'Marks the current page item' },
        { name: 'startContent', type: 'ReactNode', description: 'Optional content shown before the breadcrumb label' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Breadcrumb size' },
        { name: 'variant', type: "'solid' | 'bordered' | 'light'", default: "'light'", description: 'Visual style' },
        { name: 'underline', type: "'none' | 'hover' | 'always'", default: "'hover'", description: 'Underline behavior for links' },
        { name: 'separator', type: 'ReactNode', description: 'Custom separator between breadcrumb items' },
        { name: 'maxItems', type: 'number', description: 'Maximum visible items before collapsing' },
        { name: 'itemsBeforeCollapse', type: 'number', description: 'Number of items shown before collapsed section' },
        { name: 'itemsAfterCollapse', type: 'number', description: 'Number of items shown after collapsed section' },
        { name: 'color', type: "'default' | 'accent' | string", description: 'Breadcrumb color style' },
        { name: 'children', type: 'ReactNode', description: 'Breadcrumb items' },
      ]}
    />
  );
}