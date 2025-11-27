'use client';

import { Section } from '../../components/frames/section/Section';
import { SectionNode } from '../types/nodes';
import { renderPattern } from './patterns';

/**
 * Props for Sections component
 */
interface SectionsProps {
  sections: Record<string, SectionNode>;
  order: string[];
}

/**
 * Renders a single section with its patterns
 */
export function renderSection(sectionData: SectionNode, sectionKey: string): React.ReactNode {
  if (!sectionData?.patterns) return null;

  const { type, patterns, order } = sectionData;
  const patternOrder = order || Object.keys(patterns);
  
  const renderedPatterns = patternOrder
    .map((patternKey) => {
      const pattern = patterns[patternKey];
      if (!pattern) return null;
      
      return renderPattern(pattern, patternKey);
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

