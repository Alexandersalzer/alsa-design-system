'use client';

import { Section } from '../../components/frames/section/Section';
import { SectionNode } from '../types/nodes';
import { renderPattern } from './patterns';
import { SectionHeader } from './SectionHeader';

/**
 * Props for Sections component
 */
interface SectionsProps {
  sections: Record<string, SectionNode>;
  order: string[];
}

/**
 * Renders a single section with its header and patterns
 */
export function renderSection(sectionData: SectionNode, sectionKey: string): React.ReactNode {
  if (!sectionData?.patterns && !sectionData?.header) return null;

  const { type, header, patterns, order, props } = sectionData;
  const patternOrder = order || Object.keys(patterns || {});

  // Render header
  const renderedHeader = SectionHeader(header, sectionKey, props || {});

  // Render patterns
  const renderedPatterns = patternOrder
    .map((patternKey) => {
      const pattern = patterns?.[patternKey];
      if (!pattern) return null;

      return renderPattern(pattern, patternKey, sectionKey);
    })
    .filter(Boolean);

  // Don't render section if no content
  if (!renderedHeader && renderedPatterns.length === 0) return null;

  return (
    <Section
      key={sectionKey}
      id={sectionKey}
      height="auto"
      sectionKey={sectionKey}
      {...props}
    >
      {renderedHeader}
      {renderedPatterns}
    </Section>
  );
}

/**
 * Main component that renders all sections based on sectionOrder
 */
export function Sections({ 
  sections, 
  order
}: SectionsProps) {
  return (
    <>
      {order
        .map((sectionKey: string) => {
          const sectionData = sections[sectionKey];
          if (!sectionData) return null;
          
          return renderSection(sectionData, sectionKey);
        })
        .filter(Boolean)}
    </>
  );
}

