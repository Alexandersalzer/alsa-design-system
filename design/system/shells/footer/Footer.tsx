'use client';

import { Section } from '../../components/frames/section';
import { renderShellPattern } from '../../core/render/shells';
import { SectionNode } from '../../core/types/nodes';

interface FooterProps {
  section?: Record<string, SectionNode>;
}

const Footer = ({ section }: FooterProps) => {
  if (!section) return null;
  
  // Get the first (and usually only) footer section
  const footerSection = Object.values(section)[0];
  if (!footerSection?.patterns) return null;

  const { patterns, order, props: sectionProps } = footerSection;
  const patternOrder = order || Object.keys(patterns);
  
  // Get sectionKey from the first section
  const sectionKey = Object.keys(section)[0];
  
  // Get the first pattern to check for backgroundColor override
  const firstPattern = patterns[patternOrder[0]];
  const backgroundColor = firstPattern?.props?.backgroundColor || 'var(--surface-inverse)';
  
  // Render patterns using shared renderShellPattern function
  const renderedPatterns = patternOrder
    .map((patternKey) => {
      const pattern = patterns[patternKey];
      return pattern ? renderShellPattern(pattern, patternKey, sectionKey) : null;
    })
    .filter(Boolean);
  
  if (renderedPatterns.length === 0) return null;
  
  return (
    <Section 
      as="footer" 
      sectionKey={sectionKey}
      style={{ 
        backgroundColor,
        overflow: 'visible', // Allow dropdown to show outside footer bounds
      }}
    >
      {renderedPatterns}
    </Section>
  );
};

export default Footer;