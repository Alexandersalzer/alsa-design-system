'use client';

import { Section } from '../../components/frames/section';
import { Container } from '../../components/frames/container';
import { patternRegistry } from '../../patterns/client';

interface FooterProps {
  section?: {
    [key: string]: {
      type: string;
      patterns?: Record<string, any>;
      order?: string[];
    };
  };
}

/**
 * Footer Pattern Renderer - Dynamically renders footer patterns based on content
 */
const renderFooterPattern = (pattern: any, index: number) => {
  const PatternComponent = patternRegistry[pattern.type];
  if (!PatternComponent) {
    console.warn(`Unknown footer pattern type: ${pattern.type}`);
    return null;
  }

  return (
    <Container 
      key={`footer-pattern-${index}`}
      align="center"
      height="auto"
    >
      <PatternComponent {...pattern} />
    </Container>
  );
};

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
      return pattern ? renderFooterPattern(pattern, patternIndex) : null;
    })
    .filter(Boolean);
  
  if (renderedPatterns.length === 0) return null;
  
  return (
    <Section 
      as="footer" 
      style={{ 
        backgroundColor: 'var(--primary-1200)',
        overflow: 'visible', // Allow dropdown to show outside footer bounds
        paddingTop: 'var(--foundation-space-16, 4rem)',
        paddingBottom: 'var(--foundation-space-16, 4rem)'
      }}
    >
      {renderedPatterns}
    </Section>
  );
};

export default Footer; 