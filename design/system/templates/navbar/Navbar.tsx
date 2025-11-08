'use client';

import { Section } from '../../components/frames/section';
import { renderGlobalPattern } from '../../core/render/renderSections';
import { SectionNode } from '../../core/types/nodes';

interface NavbarProps {
  section?: Record<string, SectionNode>;
}

const Navbar = ({ section }: NavbarProps) => {
  if (!section) return null;
  
  // Get the first (and usually only) navbar section
  const navbarSection = Object.values(section)[0];
  if (!navbarSection?.patterns) return null;

  const { patterns, order, props: sectionProps } = navbarSection;
  const patternOrder = order || Object.keys(patterns);
  
  // Render patterns using shared renderGlobalPattern function
  const renderedPatterns = patternOrder
    .map((patternKey, patternIndex) => {
      const pattern = patterns[patternKey];
      return pattern ? renderGlobalPattern(pattern, patternKey, patternIndex) : null;
    })
    .filter(Boolean);
  
  if (renderedPatterns.length === 0) return null;
  
  return (
    <Section 
      as="nav" 
      style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--primary-white)',
        borderBottom: '1px solid var(--border-light)',
        paddingTop: '0',
        paddingBottom: '0',
      }}
    >
      {renderedPatterns}
    </Section>
  );
};

export default Navbar;