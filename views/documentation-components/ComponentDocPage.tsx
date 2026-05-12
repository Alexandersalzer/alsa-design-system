"use client";

import React, { ReactNode } from "react";
import { VStack, Box, H1, H2, Body, Label, CodeBlock } from "../../design/index";
import { MainContent } from "../MainContent";
import { PreviewCodeCard } from "./PreviewCodeCard";

interface DocSection {
  title: string;
  description?: string;
  preview: ReactNode;
  code: string;
}

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description?: string;
}

interface ComponentDocPageProps {
  componentName: string;
  description: string;
  importStatement: string;
  sections: DocSection[];
  properties?: PropRow[];
  usage?: ReactNode;
  children?: ReactNode;
}

function PropertiesTable({ rows }: { rows: PropRow[] }) {
  return (
    <VStack spacing="xs" align="stretch">
      <Box
        display="grid"
        style={{
          gridTemplateColumns: "minmax(140px, 1fr) minmax(160px, 1.2fr) minmax(100px, 0.8fr) 2fr",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "var(--foundation-space-2)",
          gap: "var(--foundation-space-4)",
        }}
      >
        <Label size="xs" color="tertiary">Prop</Label>
        <Label size="xs" color="tertiary">Type</Label>
        <Label size="xs" color="tertiary">Default</Label>
        <Label size="xs" color="tertiary">Description</Label>
      </Box>
      {rows.map((row, i) => (
        <Box
          key={i}
          display="grid"
          style={{
            gridTemplateColumns: "minmax(140px, 1fr) minmax(160px, 1.2fr) minmax(100px, 0.8fr) 2fr",
            gap: "var(--foundation-space-4)",
            paddingTop: "var(--foundation-space-2)",
            paddingBottom: "var(--foundation-space-2)",
            borderBottom: i < rows.length - 1 ? "1px solid var(--border-subtle)" : undefined,
          }}
        >
          <Body size="sm" weight="medium" style={{ fontFamily: "var(--font-mono-family, ui-monospace, monospace)" }}>
            {row.name}
          </Body>
          <Body size="sm" color="secondary" style={{ fontFamily: "var(--font-mono-family, ui-monospace, monospace)" }}>
            {row.type}
          </Body>
          <Body size="sm" color="tertiary">
            {row.default ?? "—"}
          </Body>
          <Body size="sm" color="secondary">
            {row.description ?? ""}
          </Body>
        </Box>
      ))}
    </VStack>
  );
}

export function ComponentDocPage({
  componentName,
  description,
  importStatement,
  sections,
  properties,
  usage,
  children,
}: ComponentDocPageProps) {
  return (
    <MainContent maxWidth="default" padding="lg" centered animate={false} spacing="2xl">
      <VStack spacing="sm" align="stretch">
        <H1>{componentName}</H1>
        <Body size="lg" color="secondary">
          {description}
        </Body>
        <VStack spacing="xs" align="stretch">
          <Label size="xs" color="tertiary">Import</Label>
          <CodeBlock>{importStatement}</CodeBlock>
        </VStack>
      </VStack>

      {sections.map((section, i) => (
        <VStack key={i} spacing="md" align="stretch">
          <VStack spacing="xs" align="stretch">
            <H2>{section.title}</H2>
            {section.description && (
              <Body color="secondary">{section.description}</Body>
            )}
          </VStack>
          <PreviewCodeCard preview={section.preview} code={section.code} />
        </VStack>
      ))}

      {properties && properties.length > 0 && (
        <VStack spacing="md" align="stretch">
          <H2>Properties</H2>
          <PropertiesTable rows={properties} />
        </VStack>
      )}

      {usage && (
        <VStack spacing="md" align="stretch">
          <H2>Usage</H2>
          <Box>{usage}</Box>
        </VStack>
      )}

      {children}
    </MainContent>
  );
}
