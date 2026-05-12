"use client";

import React from 'react';
import { Box, Body, Tag, Icon } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function TagPage() {
  return (
    <ComponentDocPage
      componentName="Tag"
      description="Tag component for labels, categories, and status indicators"
      importStatement={`import { Tag } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          preview: (
            <Box display="flex" justify="center" gap="sm">
              <Tag>Design</Tag>
              <Tag>Development</Tag>
              <Tag>Marketing</Tag>
            </Box>
          ),
          code: `<Tag>Design</Tag>
<Tag>Development</Tag>
<Tag>Marketing</Tag>`,
        },
        {
          title: 'Sizes',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box display="flex" justify="center" gap="sm">
                <Tag size="small">Small</Tag>
                <Tag size="medium">Medium</Tag>
                <Tag size="large">Large</Tag>
              </Box>
            </Box>
          ),
          code: `<Tag size="small">Small</Tag>

<Tag size="medium">Medium</Tag>

<Tag size="large">Large</Tag>`,
        },
        {
          title: 'Variants',
          description: 'Different tag variants for various purposes',
          preview: (
            <Box display="flex" justify="center" gap="sm" style={{ flexWrap: 'wrap' }}>
              <Tag variant="default">Default</Tag>
              <Tag variant="accent">Accent</Tag>
              <Tag variant="success">Success</Tag>
              <Tag variant="info">Info</Tag>
              <Tag variant="warning">Warning</Tag>
              <Tag variant="error">Error</Tag>
            </Box>
          ),
          code: `<Tag variant="default">Default</Tag>

<Tag variant="accent">Accent</Tag>

<Tag variant="success">Success</Tag>

<Tag variant="info">Info</Tag>

<Tag variant="warning">Warning</Tag>

<Tag variant="error">Error</Tag>`        },
        {
          title: 'Surface Variants',
          description: 'Different surface treatments for visual hierarchy',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Box display="flex" justify="center" gap="sm" style={{ flexWrap: 'wrap' }}>
                    <Tag variant="default" surface="subtle">Default Subtle</Tag>
                    <Tag variant="accent" surface="subtle">Accent Subtle</Tag>
                    <Tag variant="success" surface="subtle">Success Subtle</Tag>
                  </Box>
                  <Body size="xs" color="secondary">surface="subtle"</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Box display="flex" justify="center" gap="sm" style={{ flexWrap: 'wrap' }}>
                    <Tag variant="default" surface="muted">Default Muted</Tag>
                    <Tag variant="accent" surface="muted">Accent Muted</Tag>
                    <Tag variant="success" surface="muted">Success Muted</Tag>
                  </Box>
                  <Body size="xs" color="secondary">surface="muted"</Body>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Box display="flex" justify="center" gap="sm" style={{ flexWrap: 'wrap' }}>
                    <Tag variant="default" surface="vibrant">Default Vibrant</Tag>
                    <Tag variant="accent" surface="vibrant">Accent Vibrant</Tag>
                    <Tag variant="success" surface="vibrant">Success Vibrant</Tag>
                  </Box>
                  <Body size="xs" color="secondary">surface="vibrant"</Body>
                </Box>
              </Box>
            </Box>
          ),
          code: `<Tag variant="accent" surface="subtle">Subtle</Tag>

<Tag variant="accent" surface="muted">Muted</Tag>

<Tag variant="accent" surface="vibrant">Vibrant</Tag>`        },
        {
          title: 'Removable Tags',
          preview: (
            <Box display="flex" justify="center" gap="sm">
              <Tag onRemove={() => console.log('Remove')}>
                React
                <Icon size="xs"><XMarkIcon /></Icon>
              </Tag>
              <Tag onRemove={() => console.log('Remove')}>
                TypeScript
                <Icon size="xs"><XMarkIcon /></Icon>
              </Tag>
            </Box>
          ),
          code: `<Tag onRemove={() => handleRemove('tag-id')}>
  React
  <Icon size="xs"><XMarkIcon /></Icon>
</Tag>`,
        },
        {
          title: 'Practical Examples',
          description: 'Real-world tag usage with surface variants',
          preview: (
            <Box display="flex" direction="column" gap="md">
              <Box>
                <Box display="flex" direction="column" gap="md">
                  <Box>
                    <Body weight="medium">Project Tags</Body>
                    <Body size="sm" color="secondary">Categories and labels</Body>
                  </Box>
                  <Box display="flex" gap="sm" style={{ flexWrap: 'wrap' }}>
                    <Tag variant="accent" surface="vibrant">Frontend</Tag>
                    <Tag variant="success" surface="muted">In Progress</Tag>
                    <Tag surface="subtle">React</Tag>
                    <Tag surface="subtle">TypeScript</Tag>
                    <Tag variant="warning" surface="vibrant">High Priority</Tag>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="md">
                  <Box>
                    <Body weight="medium">Issue Status</Body>
                    <Body size="sm" color="secondary">Track progress visually</Body>
                  </Box>
                  <Box display="flex" gap="sm" style={{ flexWrap: 'wrap' }}>
                    <Tag variant="success" surface="vibrant">Resolved</Tag>
                    <Tag variant="warning" surface="muted">Pending Review</Tag>
                    <Tag variant="error" surface="subtle">Bug</Tag>
                    <Tag variant="info" surface="subtle">Feature Request</Tag>
                  </Box>
                </Box>
              </Box>
            </Box>
          ),
          code: `<Box display="flex" gap="sm" style={{ flexWrap: 'wrap' }}>
  <Tag variant="accent" surface="vibrant">Frontend</Tag>
  <Tag variant="success" surface="muted">In Progress</Tag>
  <Tag surface="subtle">React</Tag>
  <Tag surface="subtle">TypeScript</Tag>
  <Tag variant="warning" surface="vibrant">High Priority</Tag>
</Box>

<Box display="flex" gap="sm" style={{ flexWrap: 'wrap' }}>
  <Tag variant="success" surface="vibrant">Resolved</Tag>
  <Tag variant="warning" surface="muted">Pending Review</Tag>
  <Tag variant="error" surface="subtle">Bug</Tag>
  <Tag variant="info" surface="subtle">Feature Request</Tag>
</Box>`        },
      ]}
    />
  );
}
