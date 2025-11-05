'use client';

import { Section } from '../../system/components/frames/section/Section';
import { Container } from '../../system/components';
import { patternRegistry } from '../../system/patterns/client';

/**
 * Interface for section data from JSON
 */
export interface SectionData {
  type: string;
  patterns?: Record<string, any>;
  order?: string[];
  [key: string]: any;
}

/**
 * Props for renderSection function
 */
interface RenderSectionProps {
  sectionData: SectionData;
  sectionKey: string;
}

/**
 * Props for Sections component
 */
interface SectionsProps {
  sections: Record<string, SectionData>;
  order: string[];
}

/**
 * Pattern Renderer - Dynamically renders patterns based on content
 */
const renderPattern = (pattern: any, index: number) => {
  const PatternComponent = patternRegistry[pattern.type];
  if (!PatternComponent) {
    console.warn(`Unknown pattern type: ${pattern.type}`);
    return null;
  }

  // Check if pattern has settings that affect Container behavior
  const useMediaWidth = pattern.settings?.useMediaWidth ?? false;

  return (
    <Container 
      key={`pattern-${index}`}
      align="center"
      height="auto"
      useMediaWidth={useMediaWidth}
    >
      <PatternComponent {...pattern} />
    </Container>
  );
};

/**
 * Renders a single section with its patterns
 */
export function renderSection({ 
  sectionData, 
  sectionKey
}: RenderSectionProps): React.ReactNode {
  if (!sectionData?.patterns) return null;

  const { type, patterns } = sectionData;
  const patternOrder = sectionData.order || Object.keys(patterns);
  
  // Render all patterns for this section
  const renderedPatterns = patternOrder
    .map((patternKey, patternIndex) => {
      const pattern = patterns[patternKey];
      return pattern ? renderPattern(pattern, patternIndex) : null;
    })
    .filter(Boolean);
  
  if (renderedPatterns.length === 0) return null;
  
  // Wrap all patterns in a Section with VStack for spacing
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
        .map((sectionKey, index) => {
          const sectionData = sections[sectionKey];
          if (!sectionData) return null;
          
          // Use unique key combining sectionKey and index for React
          const uniqueKey = `${sectionKey}-${index}`;
          return renderSection({ sectionData, sectionKey: uniqueKey });
        })
        .filter(Boolean)}
    </>
  );
}

