"use client";

import React, { useState, ReactNode } from 'react';
import { VStack, Grid, Box, Body, Tab, TabGroup, CodeBlock } from '../../design/index';
import { SectionPanel } from './SectionPanel';

interface CodeItem {
  code: string;
  label?: string;
}

export interface PreviewItem {
  node: ReactNode;
  caption?: string;
}

interface PreviewCodeTabsProps {
  preview: ReactNode | PreviewItem[];
  code: string | CodeItem[];
  columns?: 1 | 2 | 3 | 4;
}

function isPreviewItemArray(value: unknown): value is PreviewItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'node' in (item as Record<string, unknown>)
    )
  );
}

function PreviewItemBlock({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <VStack spacing="sm" align="stretch">
      <Box
        display="flex"
        justify="center"
        align="center"
        style={{ minHeight: 64 }}
      >
        {children}
      </Box>
      {caption && (
        <Body size="xs" color="secondary" style={{ textAlign: 'center' }}>
          {caption}
        </Body>
      )}
    </VStack>
  );
}

function renderPreview(preview: PreviewCodeTabsProps['preview'], columns: 1 | 2 | 3 | 4) {
  if (isPreviewItemArray(preview)) {
    return (
      <Grid columns={columns} gap="lg" alignItems="stretch">
        {preview.map((item, i) => (
          <PreviewItemBlock key={i} caption={item.caption}>
            {item.node}
          </PreviewItemBlock>
        ))}
      </Grid>
    );
  }

  if (Array.isArray(preview)) {
    return (
      <Grid columns={columns} gap="lg" alignItems="stretch">
        {preview.map((node, i) => (
          <PreviewItemBlock key={i}>{node}</PreviewItemBlock>
        ))}
      </Grid>
    );
  }

  return (
    <Box display="flex" justify="center" align="center" style={{ minHeight: 64 }}>
      {preview}
    </Box>
  );
}

function renderCode(code: PreviewCodeTabsProps['code'], columns: 1 | 2 | 3 | 4) {
  if (Array.isArray(code)) {
    return (
      <Grid columns={columns} gap="md" alignItems="stretch">
        {code.map((item, i) => (
          <VStack key={i} spacing="xs" align="stretch">
            {item.label && (
              <Body size="xs" color="tertiary">
                {item.label}
              </Body>
            )}
            <CodeBlock>{item.code}</CodeBlock>
          </VStack>
        ))}
      </Grid>
    );
  }

  return <CodeBlock>{code}</CodeBlock>;
}

export const PreviewCodeTabs: React.FC<PreviewCodeTabsProps> = ({
  preview,
  code,
  columns = 2,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  return (
    <VStack spacing="sm" align="stretch">
      <TabGroup variant="subtle" orientation="horizontal">
        <Tab
          isActive={activeTab === 'preview'}
          onClick={() => setActiveTab('preview')}
          fontWeight="bold"
          useHeadingFont
        >
          Preview
        </Tab>
        <Tab
          isActive={activeTab === 'code'}
          onClick={() => setActiveTab('code')}
          fontWeight="bold"
          useHeadingFont
        >
          Code
        </Tab>
      </TabGroup>

      <SectionPanel
        active={activeTab}
        preview={renderPreview(preview, columns)}
        code={renderCode(code, columns)}
      />
    </VStack>
  );
};
