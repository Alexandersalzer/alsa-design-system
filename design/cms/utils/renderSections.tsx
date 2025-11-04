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
    console.warn(`⚠️ Unknown pattern type: ${pattern.type}`);
    return null;
  }

  return (
    <Container 
      key={`pattern-${index}`}
      align="center"
      height="auto"
      useMediaWidth={false}
      style={{ marginTop: index > 0 ? '4rem' : undefined }}
    >
      <PatternComponent {...pattern} />
    </Container>
  );
};

/**
 * Dynamically renders sections based on JSON content
 * Each section renders all patterns in order (including sectionBody)
 * 
 * @param sections - Object containing all sections keyed by their IDs
 * @param sectionOrder - Array defining the order in which sections should be rendered
 * @param pageSlug - The current page slug for content lookup
 * @returns Array of rendered section components
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

  return sectionOrder
    .map((sectionKey, sectionIndex) => {
      const sectionData = sections[sectionKey];
      
      if (!sectionData) {
        console.warn(`⚠️ renderSections: Section "${sectionKey}" not found in sections object`);
        return null;
      }

      const { type, patterns } = sectionData;
      
      if (!patterns) {
        console.warn(`⚠️ No patterns found for section "${sectionKey}"`);
        return null;
      }
      
      // Get pattern order from section data
      const patternOrder = sectionData.order || Object.keys(patterns);
      
      // Render all patterns (including sectionBody)
      const renderedPatterns = patternOrder
        .map((patternKey, patternIndex) => {
          const pattern = patterns[patternKey];
          if (!pattern) return null;
          
          return renderPattern(pattern, patternIndex);
        })
        .filter(Boolean); // Remove null values
      
      // Don't render section if no patterns were rendered
      if (renderedPatterns.length === 0) {
        return null;
      }
      
      // Wrap all patterns in a Section frame
      return (
        <Section 
          key={`${sectionKey}-${sectionIndex}`}
          id={`${type}-section-${sectionIndex}`}
          height="auto"
        >
          {renderedPatterns}
        </Section>
      );
    })
    .filter(Boolean); // Remove null values
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

