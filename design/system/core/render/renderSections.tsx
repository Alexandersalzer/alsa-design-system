'use client';

import { Section } from '../../components/frames/section/Section';
import { Container } from '../../components';
import { patternRegistry } from '../../patterns/registry';
import { SectionNode, PatternNode } from '../types/nodes';
import { getPatternProps } from '../utils/helpers';
import { isPatternAllowed, validateRequiredPatterns, isValidSectionType } from '../schemas/sections';

/**
 * Props for Sections component
 */
interface SectionsProps {
  sections: Record<string, SectionNode>;
  order: string[];
}

/**
 * Pattern Renderer - Pattern har full kontroll över component rendering
 * För content sections (med Container wrapper)
 */
export const renderPattern = (pattern: PatternNode, patternKey: string) => {
  const PatternComponent = patternRegistry[pattern.type];
  if (!PatternComponent) {
    console.warn(`Pattern: ${pattern.type} don't exist in registry`);
    return null;
  }

  // Hämta useMediaWidth från props med getPatternProps
  const patternProps = getPatternProps(pattern);

  return (
    <Container 
      key={patternKey}
      height="auto"
      useMediaWidth={patternProps.useMediaWidth || false}
      useFormWidth={patternProps.useFormWidth || false}
    >
      <PatternComponent 
        type={pattern.type}
        props={pattern.props}
        components={pattern.components}
      />
    </Container>
  );
};

/**
 * Shell Pattern Renderer - För navbar/footer patterns
 * Använder Container för layout men utan spacing
 */
export const renderShellPattern = (pattern: PatternNode, patternKey: string, index: number) => {

  const PatternComponent = patternRegistry[pattern.type];
  if (!PatternComponent) {
    console.warn(`Pattern: ${pattern.type} don't exist in registry`);
    return null;
  }

  // Hämta useNavbarWidth från props
  const patternProps = getPatternProps(pattern);

  // Container utan padding, full width för navbar/footer
  return (
    <Container 
      key={`${patternKey}-${index}`}
      align="center"
      height="auto"
      useNavbarWidth={patternProps.useNavbarWidth || false}
      noPadding={true}
    >
      <PatternComponent 
        type={pattern.type}
        props={pattern.props}
        components={pattern.components}
      />
    </Container>
  );
};

/**
 * Renders a single section with its patterns
 */
export function renderSection(sectionData: SectionNode, sectionKey: string): React.ReactNode {
  if (!sectionData?.patterns) return null;

  const { type, patterns, order } = sectionData;
  
  // Validate section type first
  if (!isValidSectionType(type)) {
    console.error(`Unknown section type "${type}" in section "${sectionKey}". Valid types: hero, portfolio, testimonials, contact, featureGrid`);
    return null;
  }
  
  const patternOrder = order || Object.keys(patterns);
  
  // Validate required patterns
  if (!validateRequiredPatterns(type, patterns)) {
    return null;
  }
  
  // Filter and render only allowed patterns
  const renderedPatterns = patternOrder
    .map((patternKey) => {
      const pattern = patterns[patternKey];
      if (!pattern) return null;
      
      if (!isPatternAllowed(type, pattern.type)) {
        return null;
      }
      
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

