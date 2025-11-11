'use client';

import { Section } from '../../components/frames/section/Section';
import { Container } from '../../components';
import { patternRegistry } from '../../patterns/registry';
import { SectionNode, PatternNode, PageNode } from '../types/nodes';
import { validatePattern } from '../validation/schemaValidator';

/**
 * Props for Sections component
 */
interface SectionsProps {
  sections: Record<string, SectionNode>;
  order: string[];
}

/**
 * Pattern Renderer - Pattern har full kontroll över component rendering
 * För content sections (med Container wrapper)
 */
export const renderPattern = (pattern: PatternNode, patternKey: string) => {
  const PatternComponent = patternRegistry[pattern.type];
  if (!PatternComponent) {
    console.warn(`Pattern: ${pattern.type} don't exist in registry`);
    return null;
  }

  // Hämta useMediaWidth från props istället för settings
  const useMediaWidth = pattern.props?.useMediaWidth ?? false;

  return (
    <Container 
      key={patternKey}
      align="center"
      height="auto"
      useMediaWidth={useMediaWidth}
    >
      <PatternComponent 
        type={pattern.type}
        props={pattern.props}
        components={pattern.components}
      />
    </Container>
  );
};

/**
 * Shell Pattern Renderer - För navbar/footer patterns
 * Använder Container för layout men utan spacing
 */
export const renderShellPattern = (pattern: PatternNode, patternKey: string, index: number) => {
  // Validate pattern before rendering (includes error logging)
  const validation = validatePattern(pattern, patternKey);
  
  if (!validation.valid) {
    return null; 
  }

  const PatternComponent = patternRegistry[pattern.type];
  if (!PatternComponent) {
    console.warn(`Pattern: ${pattern.type} don't exist in registry`);
    return null;
  }

  // Hämta useMediaWidth från props
  const useMediaWidth = pattern.props?.useMediaWidth ?? false;

  // Container för layout men utan padding för shell patterns
  return (
    <Container 
      key={`${patternKey}-${index}`}
      align="center"
      height="auto"
      useMediaWidth={useMediaWidth}
      noPadding={true} // Ingen vertical padding för navbar/footer
    >
      <PatternComponent 
        type={pattern.type}
        props={pattern.props}
        components={pattern.components}
      />
    </Container>
  );
};

/**
 * Renders a single section with its patterns
 */
export function renderSection(sectionData: SectionNode, sectionKey: string): React.ReactNode {
  if (!sectionData?.patterns) return null;

  const { type, patterns, order, props: sectionProps } = sectionData;
  const patternOrder = order || Object.keys(patterns);
  
  // Render all patterns for this section
  const renderedPatterns = patternOrder
    .map((patternKey) => {
      const pattern = patterns[patternKey];
      return pattern ? renderPattern(pattern, patternKey) : null;
    })
    .filter(Boolean);
  
  if (renderedPatterns.length === 0) return null;

  
  return (
    <Section 
      key={sectionKey}
      id={`${type}-section`}
      height="auto"
    >
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

/**
 * Page component - Higher level abstraction for rendering complete pages
 * Simplifies the API for client-next
 */
export function Page({ sections, order }: PageNode) {
  return <Sections sections={sections} order={order} />;
}

