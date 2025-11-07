'use client';

import { Section } from '../../components/frames/section';
import { renderPattern } from '../../../cms/utils/renderSections';

interface FooterProps {
  section?: {
    [key: string]: {
      type: string;
      patterns?: Record<string, any>;
      order?: string[];
    };
  };
}

const Footer = ({ section }: FooterProps) => {
  if (!section) return null;
  
  // Get the first (and usually only) footer section
  const footerSection = Object.values(section)[0];
  if (!footerSection?.patterns) return null;

  const { patterns } = footerSection;
  const patternOrder = footerSection.order || Object.keys(patterns);
  
  // Render all patterns for the footer
  const renderedPatterns = patternOrder
    .map((patternKey, patternIndex) => {
      const pattern = patterns[patternKey];
      return pattern ? renderPattern(pattern, patternIndex) : null;
    })
    .filter(Boolean);
  
  if (renderedPatterns.length === 0) return null;
  
  return (
    <Section 
      as="footer" 
      style={{ 
        backgroundColor: 'var(--primary-black)',
        overflow: 'visible', // Allow dropdown to show outside footer bounds
      }}
    >
      {renderedPatterns}
    </Section>
  );
};

export default Footer; 