'use client';

import { Section } from '../../system/components/frames/section/Section';
import { Container } from '../../system/components';
import { VStack } from '../../system/components/layout/vStack/VStack';
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
 * Each section renders all patterns in order
 */
export function renderSections({ 
  sections, 
  sectionOrder, 
  pageSlug 
}: RenderSectionsProps): React.ReactNode[] {
  if (!sections || !sectionOrder) {
    console.warn('⚠️ renderSections: No sections or section order provided');
    return [];
  }

  return sectionOrder.map((sectionKey, sectionIndex) => {
    const sectionData = sections[sectionKey];
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
        key={`${sectionKey}-${sectionIndex}`}
        id={`${type}-section-${sectionIndex}`}
        height="auto"
      >
        <VStack spacing="xl" align="stretch">
          {renderedPatterns}
        </VStack>
      </Section>
    );
  }).filter(Boolean);
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

