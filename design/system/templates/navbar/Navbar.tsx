'use client';

import { Box } from '../../components/layout/box/Box';
import { renderPattern } from '../../../cms/utils/renderSections';

interface NavbarProps {
  className?: string;
  height?: string;
  section?: {
    [key: string]: {
      type: string;
      patterns?: Record<string, any>;
      order?: string[];
    };
  };
}

const Navbar = ({ 
  className,
  height = 'var(--navbar-height)',
  section
}: NavbarProps) => {
  if (!section) return null;
  
  // Get the first (and usually only) navbar section
  const navbarSection = Object.values(section)[0];
  if (!navbarSection?.patterns) return null;

  const { patterns } = navbarSection;
  const patternOrder = navbarSection.order || Object.keys(patterns);
  
  // Render all patterns for the navbar
  const renderedPatterns = patternOrder
    .map((patternKey, patternIndex) => {
      const pattern = patterns[patternKey];
      return pattern ? renderPattern(pattern, patternIndex) : null;
    })
    .filter(Boolean);
  
  if (renderedPatterns.length === 0) return null;
  
  return (
    <Box
      as="nav"
      className={className}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'var(--primary-white)',
        borderBottom: '1px solid var(--border-light)',
        width: '100%',
        height: height
      }}
    >
      {renderedPatterns}
    </Box>
  );
};

export default Navbar;