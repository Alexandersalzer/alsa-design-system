'use client';

import { Section } from '../../components/frames/section/Section';
import { SectionNode } from '../types/nodes';
import { renderPattern } from './patterns';
import { LayoutRenderer } from '../layout/LayoutRenderer';
import { Container } from '../../components/frames/container/Container';
import { VStack } from '../../components/layout/vStack/VStack';

/**
 * Props for Sections component
 */
interface SectionsProps {
  sections: Record<string, SectionNode>;
  order: string[];
}

/**
 * Renders a single section with its patterns using LayoutRenderer
 */
export function renderSection(sectionData: SectionNode, sectionKey: string): React.ReactNode {
  if (!sectionData?.patterns) return null;

  const { type, patterns, layout, order, props } = sectionData;
  const patternOrder = order || Object.keys(patterns || {});

  // If layout config exists, use LayoutRenderer
  if (layout) {
    return (
      <Section
        key={sectionKey}
        id={sectionKey}
        height="auto"
        sectionKey={sectionKey}
        {...props}
      >
        <LayoutRenderer 
          layout={layout}
          patterns={patterns}
          order={patternOrder}
          sectionKey={sectionKey}
          sectionAnimation={props?.animation}
        />
      </Section>
    );
  }

  // Fallback: Simple vertical stacking (no layout config)
  const renderedPatterns = patternOrder
    .map((patternKey) => renderPattern(patterns[patternKey], patternKey, sectionKey))
    .filter(Boolean);

  if (renderedPatterns.length === 0) return null;

  return (
    <Section
      key={sectionKey}
      id={sectionKey}
      height="auto"
      sectionKey={sectionKey}
      {...props}
    >
      <Container>
        <VStack spacing="lg" align="center">
          {renderedPatterns}
        </VStack>
      </Container>
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

