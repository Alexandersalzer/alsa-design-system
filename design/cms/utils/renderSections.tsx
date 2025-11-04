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
 * Props for renderSections function
 */
interface RenderSectionsProps {
  sections: Record<string, SectionData>;
  sectionOrder: string[];
  pageSlug: string;
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

  return (
    <Container 
      key={`pattern-${index}`}
      align="center"
      height="auto"
      useMediaWidth={false}
    >
      <PatternComponent {...pattern} />
    </Container>
  );
};

/**
 * Dynamically renders sections based on JSON content
 */
export function renderSections({ 
  sections, 
  sectionOrder, 
  pageSlug 
}: RenderSectionsProps): React.ReactNode[] {
  if (!sections || !sectionOrder) return [];

  return sectionOrder
    .map((sectionKey, sectionIndex) => {
      const sectionData = sections[sectionKey];
      if (!sectionData?.patterns) return null;
      
      const patternOrder = sectionData.order || Object.keys(sectionData.patterns);
      const renderedPatterns = patternOrder
        .map((patternKey, patternIndex) => {
          const pattern = sectionData.patterns![patternKey];
          return pattern ? renderPattern(pattern, patternIndex) : null;
        })
        .filter(Boolean);
      
      if (renderedPatterns.length === 0) return null;
      
      return (
        <Section 
          key={`${sectionKey}-${sectionIndex}`}
          id={`${sectionData.type}-section-${sectionIndex}`}
          height="auto"
        >
          {renderedPatterns}
        </Section>
      );
    })
    .filter(Boolean);
}

/**
 * Higher-order component that wraps renderSections for easier use
 */
export function Sections({ 
  sections, 
  sectionOrder, 
  pageSlug 
}: RenderSectionsProps) {
  const renderedSections = renderSections({ sections, sectionOrder, pageSlug });
  
  return <>{renderedSections}</>;
}

