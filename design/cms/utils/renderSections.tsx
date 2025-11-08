'use client';

import { Section } from '../../system/components/frames/section/Section';
import { Container } from '../../system/components';
import { Component } from '../../system/components/frames/component/Component';
import { patternRegistry } from '../../system/patterns/registry';
import { componentRegistry } from '../../system/components/registry';

// Import nya node types
import { 
  SectionNode, 
  PatternNode, 
  ComponentNode
} from '../../system/core/types/nodes';

/**
 * Props for renderSection function
 */
interface RenderSectionProps {
  sectionData: SectionNode;
  sectionKey: string;
}

/**
 * Props for Sections component
 */
interface SectionsProps {
  sections: Record<string, SectionNode>;
  order: string[];
}

/**
 * Component Renderer - Renderar enskilda components med Component wrapper
 */
export const renderComponent = (component: ComponentNode, componentKey: string, index: number) => {
  const ComponentElement = componentRegistry[component.type];
  if (!ComponentElement) {
    console.warn(`Unknown component type: ${component.type}`);
    return null;
  }

  return (
    <Component 
      key={`${componentKey}-${index}`}
      id={componentKey}
      className={`component-${component.type}`}
    >
      <ComponentElement 
        type={component.type}
        props={component.props}
      />
    </Component>
  );
};

/**
 * Pattern Renderer - Pattern har full kontroll över component rendering
 */
export const renderPattern = (pattern: PatternNode, index: number) => {
  const PatternComponent = patternRegistry[pattern.type];
  if (!PatternComponent) {
    console.warn(`Unknown pattern type: ${pattern.type}`);
    return null;
  }

  // Hämta useMediaWidth från props istället för settings
  const useMediaWidth = pattern.props?.useMediaWidth ?? false;

  return (
    <Container 
      key={`${index}`}
      align="center"
      height="auto"
      useMediaWidth={useMediaWidth}
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
export function renderSection({ 
  sectionData, 
  sectionKey
}: RenderSectionProps): React.ReactNode {
  if (!sectionData?.patterns) return null;

  const { type, patterns, order, props: sectionProps } = sectionData;
  const patternOrder = order || Object.keys(patterns);
  
  // Render all patterns for this section
  const renderedPatterns = patternOrder
    .map((patternKey, patternIndex) => {
      const pattern = patterns[patternKey];
      return pattern ? renderPattern(pattern, patternIndex) : null;
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
        .map((sectionKey, index) => {
          const sectionData = sections[sectionKey];
          if (!sectionData) return null;
          
          // Use unique key combining sectionKey and index for React
          const uniqueKey = `${sectionKey}-${index}`;
          return renderSection({ sectionData, sectionKey: uniqueKey });
        })
        .filter(Boolean)}
    </>
  );
}

