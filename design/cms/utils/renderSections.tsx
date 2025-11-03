'use client';

import { Hero } from '../../system/templates/sections/hero/Hero';
import { Section } from '../../system/components/frames/section/Section';

/**
 * Section type to component mapping
 * Maps section types from JSON to their corresponding React components
 */
const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  // Add more sections here as they become available
  // about: AboutSection,
  // contact: ContactFormSection,
  // stats: StatsGridSection,
};

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
 * Dynamically renders sections based on JSON content
 * Each section is wrapped in a Section frame component
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
    .map((sectionKey, index) => {
      const sectionData = sections[sectionKey];
      
      if (!sectionData) {
        console.warn(`⚠️ renderSections: Section "${sectionKey}" not found in sections object`);
        return null;
      }

      const { type } = sectionData;
      const SectionComponent = SECTION_COMPONENTS[type];

      if (!SectionComponent) {
        console.warn(`⚠️ renderSections: No component found for section type "${type}"`);
        return null;
      }

      // Wrap each section component in a Section frame
      return (
        <Section 
          key={`${sectionKey}-${index}`}
          id={`${type}-section-${index}`}
          height="auto"
        >
          <SectionComponent
            pageSlug={pageSlug}
            templateIndex={index}
          />
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

