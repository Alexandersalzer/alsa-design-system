'use client';

import { Section } from '../../components/frames/section';
import { renderShellPattern } from '../../core/render/renderSections';
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
  
  // Render patterns using shared renderShellPattern function
  const renderedPatterns = patternOrder
    .map((patternKey, patternIndex) => {
      const pattern = patterns[patternKey];
      return pattern ? renderShellPattern(navbarSection, pattern, patternKey, patternIndex) : null;
    })
    .filter(Boolean);
  
  if (renderedPatterns.length === 0) return null;
  
  return (
    <Section 
      as="nav" 
    >
      {renderedPatterns}
    </Section>
  );
};

export default Navbar;