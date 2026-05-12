"use client";

import React from 'react';
import { Box, Body, Skeleton, SkeletonCircle, SkeletonText } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function LoadingSkeletonPage() {
  return (
    <ComponentDocPage
      componentName="Skeleton"
      description="Placeholder component that mimics the structure of content while it loads, providing a better user experience during data fetching"
      importStatement={`import { Skeleton, SkeletonCircle, SkeletonText } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple skeleton loader with default rectangular shape',
          preview: (
            <Box
            >
              <Skeleton width="100%" height="24px" />
            </Box>
          ),
          code: `<Skeleton width="100%" height="24px" />`,
        },

        {
          title: 'Shapes',
          description: 'Different skeleton shapes for various content types',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1 sm:grid-cols-3"
            >
              <Box>
                <Box display="flex" direction="column" gap="sm" align="center">
                  <Skeleton width="100%" height="60px" />
                  <Body size="xs" color="secondary">Skeleton (rectangle)</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm" align="center">
                  <SkeletonCircle size="60px" />
                  <Body size="xs" color="secondary">SkeletonCircle</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm" align="center">
                  <SkeletonText noOfLines={3} />
                  <Body size="xs" color="secondary">SkeletonText</Body>
                </Box>
              </Box>
            </Box>
          ),
          code: `<Skeleton width="100%" height="60px" />

<SkeletonCircle size="60px" />

<SkeletonText noOfLines={3} />`,
        },

        {
          title: 'Sizes',
          description: 'Common skeleton sizes for different content',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1"
            >
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Skeleton width="40%" height="16px" />
                  <Body size="xs" color="secondary">Small text (16px)</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Skeleton width="60%" height="24px" />
                  <Body size="xs" color="secondary">Medium text (24px)</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Skeleton width="80%" height="32px" />
                  <Body size="xs" color="secondary">Large heading (32px)</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Skeleton width="100%" height="200px" />
                  <Body size="xs" color="secondary">Image placeholder (200px)</Body>
                </Box>
              </Box>
            </Box>
          ),
          code: `<Skeleton width="40%" height="16px" />
<Skeleton width="60%" height="24px" />
<Skeleton width="80%" height="32px" />
<Skeleton width="100%" height="200px" />`,
        },

        {
          title: 'Text Content Pattern',
          description: 'Multiple skeleton lines to represent text paragraphs',
          preview: (
            <Box>
              <Box display="flex" direction="column" gap="sm">
                <SkeletonText noOfLines={5} />
              </Box>
            </Box>
          ),
          code: `<SkeletonText noOfLines={5} />`,
        },

        {
          title: 'Card Layout Pattern',
          description: 'Skeleton for a typical card component with image and text',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1 sm:grid-cols-2"
            >
              <Box>
                <Box display="flex" direction="column" gap="md">
                  <Skeleton width="100%" height="160px" />
                  <Box display="flex" direction="column" gap="sm">
                    <Skeleton width="70%" height="24px" />
                    <SkeletonText noOfLines={3} />
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="md">
                  <Skeleton width="100%" height="160px" />
                  <Box display="flex" direction="column" gap="sm">
                    <Skeleton width="80%" height="24px" />
                    <SkeletonText noOfLines={3} />
                  </Box>
                </Box>
              </Box>
            </Box>
          ),
          code: `// Card skeleton pattern
<Box display="flex" direction="column" gap="md">
  <Skeleton width="100%" height="160px" />
  <Box display="flex" direction="column" gap="sm">
    <Skeleton width="70%" height="24px" />
    <SkeletonText noOfLines={3} />
  </Box>
</Box>`,
        },

        {
          title: 'List Item Pattern',
          description: 'Skeleton for list items with avatar and text',
          preview: (
            <Box>
              <Box display="flex" direction="column" gap="md">
                <Box display="flex" gap="md" align="center">
                  <SkeletonCircle size="48px" />
                  <Box display="flex" direction="column" gap="sm" style={{ flex: 1 }}>
                    <Skeleton width="60%" height="20px" />
                    <Skeleton width="40%" height="16px" />
                  </Box>
                </Box>
                <Box display="flex" gap="md" align="center">
                  <SkeletonCircle size="48px" />
                  <Box display="flex" direction="column" gap="sm" style={{ flex: 1 }}>
                    <Skeleton width="55%" height="20px" />
                    <Skeleton width="35%" height="16px" />
                  </Box>
                </Box>
                <Box display="flex" gap="md" align="center">
                  <SkeletonCircle size="48px" />
                  <Box display="flex" direction="column" gap="sm" style={{ flex: 1 }}>
                    <Skeleton width="65%" height="20px" />
                    <Skeleton width="45%" height="16px" />
                  </Box>
                </Box>
              </Box>
            </Box>
          ),
          code: `// List item skeleton pattern
<Box display="flex" gap="md" align="center">
  <SkeletonCircle size="48px" />
  <Box display="flex" direction="column" gap="sm" style={{ flex: 1 }}>
    <Skeleton width="60%" height="20px" />
    <Skeleton width="40%" height="16px" />
  </Box>
</Box>`,
        },

        {
          title: 'Full Page Layouts - Settings Page',
          description: 'Complete settings page with tabs and form content',
          preview: (
            <Box>
              <Box display="flex" direction="column" gap="xl">
                {/* Header */}
                <Box display="flex" direction="column" gap="xs">
                  <Skeleton width="30%" height="32px" variant="pulse" />
                  <Skeleton width="50%" height="16px" variant="pulse" />
                </Box>

                {/* Tabs */}
                <Box display="flex" gap="md">
                  <Skeleton width="180px" height="40px" variant="pulse" />
                  <Skeleton width="140px" height="40px" variant="pulse" />
                  <Skeleton width="160px" height="40px" variant="pulse" />
                  <Skeleton width="120px" height="40px" variant="pulse" />
                </Box>

                {/* Content Card */}
                <Box padding="lg" border="default" radius="lg" bg="hover">
                  <Box display="flex" direction="column" gap="md">
                    <Skeleton width="40%" height="20px" variant="pulse" />
                    <Skeleton width="80%" height="14px" variant="pulse" />
                    <Skeleton width="60%" height="14px" variant="pulse" />
                    <Box display="grid" gap="md" className="grid-cols-2">
                      <Skeleton width="100%" height="100px" variant="pulse" />
                      <Skeleton width="100%" height="100px" variant="pulse" />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ),
          code: `// Settings page skeleton
<Box display="flex" direction="column" gap="xl">
  {/* Header */}
  <Box display="flex" direction="column" gap="xs">
    <Skeleton width="30%" height="32px" variant="pulse" />
    <Skeleton width="50%" height="16px" variant="pulse" />
  </Box>

  {/* Tabs */}
  <Box display="flex" gap="md">
    <Skeleton width="180px" height="40px" variant="pulse" />
    <Skeleton width="140px" height="40px" variant="pulse" />
    <Skeleton width="160px" height="40px" variant="pulse" />
    <Skeleton width="120px" height="40px" variant="pulse" />
  </Box>

  {/* Content */}
  <Box padding="lg" border="default" radius="lg">
    <Box display="flex" direction="column" gap="md">
      <Skeleton width="40%" height="20px" variant="pulse" />
      <Skeleton width="80%" height="14px" variant="pulse" />
      <Skeleton width="60%" height="14px" variant="pulse" />
      <Box display="grid" gap="md" className="grid-cols-2">
        <Skeleton width="100%" height="100px" variant="pulse" />
        <Skeleton width="100%" height="100px" variant="pulse" />
      </Box>
    </Box>
  </Box>
</Box>`,
        },

        {
          title: 'Full Page Layouts - Dashboard Overview',
          description: '3-column card grid with header (current implementation)',
          preview: (
            <Box>
              <Box display="flex" direction="column" gap="xl">
                {/* Header */}
                <Box display="flex" direction="column" gap="xs">
                  <Skeleton width="30%" height="32px" variant="pulse" />
                  <Skeleton width="50%" height="16px" variant="pulse" />
                </Box>

                {/* 3-column card grid */}
                <Box display="grid" gap="md" className="grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Box key={i} padding="md" border="default" radius="lg" bg="hover">
                      <Box display="flex" direction="column" gap="sm">
                        <Skeleton width="70%" height="20px" variant="pulse" />
                        <Skeleton width="60%" height="14px" variant="pulse" />
                        <Skeleton width="80%" height="14px" variant="pulse" />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ),
          code: `// Dashboard 3-column grid (current)
<Box display="flex" direction="column" gap="xl">
  <Box display="flex" direction="column" gap="xs">
    <Skeleton width="30%" height="32px" variant="pulse" />
    <Skeleton width="50%" height="16px" variant="pulse" />
  </Box>

  <Box display="grid" gap="md" className="grid-cols-3">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <Box key={i} padding="md" border="default" radius="lg">
        <Box display="flex" direction="column" gap="sm">
          <Skeleton width="70%" height="20px" variant="pulse" />
          <Skeleton width="60%" height="14px" variant="pulse" />
          <Skeleton width="80%" height="14px" variant="pulse" />
        </Box>
      </Box>
    ))}
  </Box>
</Box>`,
        },

        {
          title: 'Full Page Layouts - KPI Dashboard',
          description: 'Header with 4 KPI cards and two-column content',
          preview: (
            <Box>
              <Box display="flex" direction="column" gap="xl">
                {/* Header */}
                <Box display="flex" direction="column" gap="xs">
                  <Skeleton width="35%" height="32px" variant="pulse" />
                  <Skeleton width="55%" height="16px" variant="pulse" />
                </Box>

                {/* KPI Cards - 4 columns */}
                <Box display="grid" gap="md" className="grid-cols-4">
                  {[1, 2, 3, 4].map(i => (
                    <Box key={i} padding="md" border="default" radius="lg" bg="hover">
                      <Box display="flex" direction="column" gap="sm">
                        <Skeleton width="60%" height="16px" variant="pulse" />
                        <Skeleton width="40%" height="32px" variant="pulse" />
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Two-column layout */}
                <Box display="grid" gap="lg" className="grid-cols-2">
                  {/* Left column */}
                  <Box display="flex" direction="column" gap="md">
                    <Box padding="lg" border="default" radius="lg" bg="hover">
                      <Box display="flex" direction="column" gap="sm">
                        <Skeleton width="50%" height="20px" variant="pulse" />
                        <Skeleton width="70%" height="14px" variant="pulse" />
                        <Skeleton width="60%" height="14px" variant="pulse" />
                        <Skeleton width="80%" height="14px" variant="pulse" />
                      </Box>
                    </Box>
                    <Box padding="lg" border="default" radius="lg" bg="hover">
                      <Box display="flex" direction="column" gap="sm">
                        {[...Array(6)].map((_, i) => (
                          <Skeleton key={i} width={`${60 + (i % 3) * 10}%`} height="14px" variant="pulse" />
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  {/* Right column */}
                  <Box display="flex" direction="column" gap="md">
                    <Box padding="lg" border="default" radius="lg" bg="hover">
                      <Box display="flex" direction="column" gap="sm">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} width={`${65 + (i % 2) * 10}%`} height="14px" variant="pulse" />
                        ))}
                      </Box>
                    </Box>
                    <Box padding="lg" border="default" radius="lg" bg="hover">
                      <Box display="flex" direction="column" gap="sm">
                        {[...Array(8)].map((_, i) => (
                          <Skeleton key={i} width={`${60 + (i % 4) * 5}%`} height="14px" variant="pulse" />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ),
          code: `// KPI Dashboard with two-column content
<Box display="flex" direction="column" gap="xl">
  {/* Header */}
  <Box display="flex" direction="column" gap="xs">
    <Skeleton width="35%" height="32px" variant="pulse" />
    <Skeleton width="55%" height="16px" variant="pulse" />
  </Box>

  {/* KPI cards */}
  <Box display="grid" gap="md" className="grid-cols-4">
    {[1, 2, 3, 4].map(i => (
      <Box key={i} padding="md" border="default" radius="lg">
        <Box display="flex" direction="column" gap="sm">
          <Skeleton width="60%" height="16px" variant="pulse" />
          <Skeleton width="40%" height="32px" variant="pulse" />
        </Box>
      </Box>
    ))}
  </Box>

  {/* Two-column content */}
  <Box display="grid" gap="lg" className="grid-cols-2">
    {/* Left/Right columns with nested cards */}
  </Box>
</Box>`,
        },

        {
          title: 'Full Page Layouts - Content With Hero',
          description: 'Hero section with grid below',
          preview: (
            <Box>
              <Box display="flex" direction="column" gap="xl">
                {/* Header */}
                <Box display="flex" direction="column" gap="xs">
                  <Skeleton width="25%" height="32px" variant="pulse" />
                  <Skeleton width="45%" height="16px" variant="pulse" />
                </Box>

                {/* Hero Card */}
                <Box padding="lg" border="default" radius="lg" bg="hover">
                  <Box display="flex" direction="column" gap="md">
                    <Skeleton width="60%" height="24px" variant="pulse" />
                    <Skeleton width="80%" height="16px" variant="pulse" />
                    <Skeleton width="150px" height="40px" variant="pulse" />
                  </Box>
                </Box>

                {/* Grid below */}
                <Box display="grid" gap="md" className="grid-cols-3">
                  {[1, 2, 3].map(i => (
                    <Box key={i} padding="md" border="default" radius="lg" bg="hover">
                      <Box display="flex" direction="column" gap="sm">
                        <Skeleton width="70%" height="20px" variant="pulse" />
                        <Skeleton width="50%" height="14px" variant="pulse" />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ),
          code: `// Hero + Grid layout
<Box display="flex" direction="column" gap="xl">
  {/* Header */}
  <Box display="flex" direction="column" gap="xs">
    <Skeleton width="25%" height="32px" variant="pulse" />
    <Skeleton width="45%" height="16px" variant="pulse" />
  </Box>

  {/* Hero card */}
  <Box padding="lg" border="default" radius="lg">
    <Box display="flex" direction="column" gap="md">
      <Skeleton width="60%" height="24px" variant="pulse" />
      <Skeleton width="80%" height="16px" variant="pulse" />
      <Skeleton width="150px" height="40px" variant="pulse" />
    </Box>
  </Box>

  {/* Grid */}
  <Box display="grid" gap="md" className="grid-cols-3">
    {[1, 2, 3].map(i => (
      <Box key={i} padding="md" border="default" radius="lg">
        <Skeleton width="70%" height="20px" variant="pulse" />
        <Skeleton width="50%" height="14px" variant="pulse" />
      </Box>
    ))}
  </Box>
</Box>`,
        },

        {
          title: 'Full Page Layouts - List View',
          description: 'Header with filter row and list items',
          preview: (
            <Box>
              <Box display="flex" direction="column" gap="xl">
                {/* Header */}
                <Box display="flex" direction="column" gap="xs">
                  <Skeleton width="30%" height="32px" variant="pulse" />
                  <Skeleton width="50%" height="16px" variant="pulse" />
                </Box>

                {/* Filter row */}
                <Box padding="md" border="default" radius="lg" bg="hover">
                  <Box display="grid" gap="md" className="grid-cols-3">
                    <Skeleton width="100%" height="40px" variant="pulse" />
                    <Skeleton width="100%" height="40px" variant="pulse" />
                    <Skeleton width="100%" height="40px" variant="pulse" />
                  </Box>
                </Box>

                {/* List items */}
                <Box display="flex" direction="column" gap="sm">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Box key={i} padding="md" border="default" radius="lg" bg="hover">
                      <Box display="flex" gap="md" align="center">
                        <SkeletonCircle size="48px" />
                        <Box display="flex" direction="column" gap="xs" style={{ flex: 1 }}>
                          <Skeleton width="60%" height="20px" variant="pulse" />
                          <Skeleton width="40%" height="16px" variant="pulse" />
                        </Box>
                        <Skeleton width="80px" height="32px" variant="pulse" />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ),
          code: `// List view with filters
<Box display="flex" direction="column" gap="xl">
  {/* Header */}
  <Box display="flex" direction="column" gap="xs">
    <Skeleton width="30%" height="32px" variant="pulse" />
    <Skeleton width="50%" height="16px" variant="pulse" />
  </Box>

  {/* Filters */}
  <Box padding="md" border="default" radius="lg">
    <Box display="grid" gap="md" className="grid-cols-3">
      <Skeleton width="100%" height="40px" variant="pulse" />
      <Skeleton width="100%" height="40px" variant="pulse" />
      <Skeleton width="100%" height="40px" variant="pulse" />
    </Box>
  </Box>

  {/* List items */}
  <Box display="flex" direction="column" gap="sm">
    {[1, 2, 3, 4, 5].map(i => (
      <Box key={i} padding="md" border="default" radius="lg">
        <Box display="flex" gap="md" align="center">
          <SkeletonCircle size="48px" />
          <Box display="flex" direction="column" gap="xs" style={{ flex: 1 }}>
            <Skeleton width="60%" height="20px" variant="pulse" />
            <Skeleton width="40%" height="16px" variant="pulse" />
          </Box>
          <Skeleton width="80px" height="32px" variant="pulse" />
        </Box>
      </Box>
    ))}
  </Box>
</Box>`,
        },

        {
          title: 'Full Page Layouts - Table View',
          description: 'Header with data table rows',
          preview: (
            <Box>
              <Box display="flex" direction="column" gap="xl">
                {/* Header */}
                <Box display="flex" justify="between" align="center">
                  <Box display="flex" direction="column" gap="xs">
                    <Skeleton width="200px" height="32px" variant="pulse" />
                    <Skeleton width="300px" height="16px" variant="pulse" />
                  </Box>
                  <Skeleton width="120px" height="40px" variant="pulse" />
                </Box>

                {/* Table */}
                <Box border="default" radius="lg" bg="hover">
                  {/* Table header */}
                  <Box padding="md" style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <Box display="grid" gap="md" className="grid-cols-5">
                      <Skeleton width="80%" height="16px" variant="pulse" />
                      <Skeleton width="80%" height="16px" variant="pulse" />
                      <Skeleton width="80%" height="16px" variant="pulse" />
                      <Skeleton width="80%" height="16px" variant="pulse" />
                      <Skeleton width="80%" height="16px" variant="pulse" />
                    </Box>
                  </Box>

                  {/* Table rows */}
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Box key={i} padding="md" style={{ borderBottom: i < 6 ? '1px solid var(--border-default)' : 'none' }}>
                      <Box display="grid" gap="md" className="grid-cols-5" align="center">
                        <Skeleton width="70%" height="20px" variant="pulse" />
                        <Skeleton width="60%" height="20px" variant="pulse" />
                        <Skeleton width="50%" height="20px" variant="pulse" />
                        <Skeleton width="80%" height="20px" variant="pulse" />
                        <Skeleton width="60px" height="28px" variant="pulse" />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ),
          code: `// Table view layout
<Box display="flex" direction="column" gap="xl">
  {/* Header with action */}
  <Box display="flex" justify="between" align="center">
    <Box display="flex" direction="column" gap="xs">
      <Skeleton width="200px" height="32px" variant="pulse" />
      <Skeleton width="300px" height="16px" variant="pulse" />
    </Box>
    <Skeleton width="120px" height="40px" variant="pulse" />
  </Box>

  {/* Table */}
  <Box border="default" radius="lg">
    {/* Header row */}
    <Box padding="md" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <Box display="grid" gap="md" className="grid-cols-5">
        {[1,2,3,4,5].map(i => (
          <Skeleton key={i} width="80%" height="16px" variant="pulse" />
        ))}
      </Box>
    </Box>

    {/* Data rows */}
    {[1, 2, 3, 4, 5, 6].map(i => (
      <Box key={i} padding="md">
        <Box display="grid" gap="md" className="grid-cols-5">
          <Skeleton width="70%" height="20px" variant="pulse" />
          <Skeleton width="60%" height="20px" variant="pulse" />
          <Skeleton width="50%" height="20px" variant="pulse" />
          <Skeleton width="80%" height="20px" variant="pulse" />
          <Skeleton width="60px" height="28px" variant="pulse" />
        </Box>
      </Box>
    ))}
  </Box>
</Box>`,
        },

        {
          title: 'Full Page Layouts - Sidebar Layout',
          description: 'Two-column with sidebar and main content',
          preview: (
            <Box>
              <Box display="grid" gap="lg" className="grid-cols-[250px_1fr]">
                {/* Sidebar */}
                <Box display="flex" direction="column" gap="md">
                  <Skeleton width="100%" height="32px" variant="pulse" />
                  <Box display="flex" direction="column" gap="sm">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <Skeleton key={i} width="100%" height="40px" variant="pulse" />
                    ))}
                  </Box>
                </Box>

                {/* Main content */}
                <Box display="flex" direction="column" gap="xl">
                  <Box display="flex" direction="column" gap="xs">
                    <Skeleton width="40%" height="32px" variant="pulse" />
                    <Skeleton width="60%" height="16px" variant="pulse" />
                  </Box>

                  <Box display="grid" gap="md" className="grid-cols-2">
                    {[1, 2, 3, 4].map(i => (
                      <Box key={i} padding="lg" border="default" radius="lg" bg="hover">
                        <Box display="flex" direction="column" gap="sm">
                          <Skeleton width="70%" height="20px" variant="pulse" />
                          <Skeleton width="100%" height="120px" variant="pulse" />
                          <Skeleton width="60%" height="14px" variant="pulse" />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          ),
          code: `// Sidebar layout
<Box display="grid" gap="lg" className="grid-cols-[250px_1fr]">
  {/* Sidebar */}
  <Box display="flex" direction="column" gap="md">
    <Skeleton width="100%" height="32px" variant="pulse" />
    <Box display="flex" direction="column" gap="sm">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Skeleton key={i} width="100%" height="40px" variant="pulse" />
      ))}
    </Box>
  </Box>

  {/* Main content */}
  <Box display="flex" direction="column" gap="xl">
    <Box display="flex" direction="column" gap="xs">
      <Skeleton width="40%" height="32px" variant="pulse" />
      <Skeleton width="60%" height="16px" variant="pulse" />
    </Box>

    <Box display="grid" gap="md" className="grid-cols-2">
      {[1, 2, 3, 4].map(i => (
        <Box key={i} padding="lg" border="default" radius="lg">
          <Skeleton width="70%" height="20px" variant="pulse" />
          <Skeleton width="100%" height="120px" variant="pulse" />
          <Skeleton width="60%" height="14px" variant="pulse" />
        </Box>
      ))}
    </Box>
  </Box>
</Box>`,
        },

        {
          title: 'App-Level Dashboard Skeleton',
          description: 'Complete dashboard layout with sidebar, header, and content area for app-level loading',
          preview: (
            <Box style={{ height: '500px', overflow: 'hidden' }}>
              <Box display="flex" style={{ height: '100%' }}>
                {/* Sidebar */}
                <Box
                  style={{
                    width: '200px',
                    flexShrink: 0,
                    background: 'var(--surface-sidebar)',
                    borderRight: '1px solid var(--border-subtle)',
                    padding: 'var(--foundation-space-3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--foundation-space-4)'
                  }}
                >
                  {/* Logo */}
                  <Box display="flex" gap="sm" align="center">
                    <SkeletonCircle size="32px" />
                    <Skeleton width="80px" height="16px" variant="pulse" />
                  </Box>

                  {/* Nav items */}
                  <Box display="flex" direction="column" gap="xs">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Skeleton key={i} width="100%" height="36px" variant="pulse" />
                    ))}
                  </Box>
                </Box>

                {/* Main area */}
                <Box display="flex" direction="column" style={{ flex: 1 }}>
                  {/* Header */}
                  <Box
                    style={{
                      height: '52px',
                      borderBottom: '1px solid var(--border-subtle)',
                      padding: '0 var(--foundation-space-4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Skeleton width="240px" height="32px" variant="pulse" />
                    <Box display="flex" gap="sm" align="center">
                      <Skeleton width="100px" height="32px" variant="pulse" />
                      <SkeletonCircle size="32px" />
                      <SkeletonCircle size="32px" />
                    </Box>
                  </Box>

                  {/* Content */}
                  <Box style={{ flex: 1, padding: 'var(--foundation-space-4)' }}>
                    <Box display="flex" direction="column" gap="lg">
                      <Box display="flex" direction="column" gap="xs">
                        <Skeleton width="30%" height="24px" variant="pulse" />
                        <Skeleton width="50%" height="14px" variant="pulse" />
                      </Box>

                      <Box display="grid" gap="md" className="grid-cols-3">
                        {[1, 2, 3].map(i => (
                          <Box key={i} padding="md" border="default" radius="lg" bg="hover">
                            <Box display="flex" direction="column" gap="sm">
                              <Skeleton width="70%" height="16px" variant="pulse" />
                              <Skeleton width="50%" height="12px" variant="pulse" />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ),
          code: `// Complete dashboard skeleton with sidebar, header, and content
// Used in /dashboard/loading.tsx for app-level loading
'use client';

import {
  Card,
  CardContent,
  VStack,
  HStack,
  Grid,
  Skeleton,
  SkeletonCircle
} from '../../../design/index';

export default function DashboardLoading() {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--surface-base)',
      overflow: 'hidden'
    }}>
      {/* Sidebar Skeleton */}
      <aside style={{
        width: '260px',
        flexShrink: 0,
        background: 'var(--surface-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--foundation-space-4)'
      }}>
        {/* Logo area */}
        <div style={{ marginBottom: 'var(--foundation-space-6)' }}>
          <HStack spacing="md" align="center">
            <SkeletonCircle size="40px" />
            <Skeleton height="20px" width="120px" variant="pulse" />
          </HStack>
        </div>

        {/* Navigation items */}
        <VStack spacing="xs" style={{ flex: 1 }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton
              key={i}
              height="44px"
              width="100%"
              variant="pulse"
              style={{ borderRadius: 'var(--foundation-radius-md)' }}
            />
          ))}
        </VStack>

        {/* Bottom section */}
        <div style={{ marginTop: 'auto', paddingTop: 'var(--foundation-space-4)' }}>
          <Skeleton
            height="44px"
            width="100%"
            variant="pulse"
            style={{ borderRadius: 'var(--foundation-radius-md)' }}
          />
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header Skeleton */}
        <header style={{
          height: '64px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-base)',
          padding: '0 var(--foundation-space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          {/* Left side - Search */}
          <Skeleton height="40px" width="320px" variant="pulse" />

          {/* Right side - Actions */}
          <HStack spacing="md" align="center">
            <Skeleton height="40px" width="140px" variant="pulse" />
            <SkeletonCircle size="40px" />
            <SkeletonCircle size="40px" />
            <SkeletonCircle size="40px" />
          </HStack>
        </header>

        {/* Main Content Area Skeleton */}
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: 'var(--foundation-space-6)'
        }}>
          <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            <VStack spacing="xl">
              {/* Page header skeleton */}
              <VStack spacing="xs">
                <Skeleton height="32px" width="30%" variant="pulse" />
                <Skeleton height="16px" width="50%" variant="pulse" />
              </VStack>

              {/* Generic 3-column card grid */}
              <Grid columns={3} gap="md">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i}>
                    <CardContent>
                      <VStack spacing="sm">
                        <Skeleton height="20px" width="70%" variant="pulse" />
                        <Skeleton height="14px" width="60%" variant="pulse" />
                        <Skeleton height="14px" width="80%" variant="pulse" />
                      </VStack>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </VStack>
          </div>
        </main>
      </div>
    </div>
  );
}`,
        },
      ]}
    >
      <Box display="flex" direction="column" gap="md">
        <Box>
          <Body color="secondary" size="md">
            <strong>Best Practices:</strong> Use loading skeletons to match the layout of the actual content
            that will be displayed. This creates a smooth transition and helps users understand what type of
            content is loading. Avoid using spinners for content-heavy layouts where skeletons would be more appropriate.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Performance:</strong> Loading skeletons improve perceived performance by showing immediate
            visual feedback. They're especially effective for content that takes 1-10 seconds to load. For very
            quick operations (under 500ms), consider not showing any loading state at all.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Accessibility:</strong> Use appropriate ARIA attributes like aria-busy="true" and
            aria-label="Loading content" on the container to inform screen reader users that content is loading.
          </Body>
        </Box>
      </Box>
    </ComponentDocPage>
  );
}
