'use client';

import { Section } from '../../components/frames/section/Section';
import { Container } from '../../components';
import { Component } from '../../components/frames/component/Component';
import { patternRegistry } from '../../patterns/registry';
import { componentRegistry } from '../../components/registry';

// Import nya node types
import { 
  SectionNode, 
  PatternNode, 
  ComponentNode
} from '../types/nodes';

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
      key={componentKey}
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
 * För content sections (med Container wrapper)
 */
export const renderPattern = (pattern: PatternNode, patternKey: string) => {
  const PatternComponent = patternRegistry[pattern.type];
  if (!PatternComponent) {
    console.warn(`Unknown pattern type: ${pattern.type}`);
    return null;
  }

  // Hämta useMediaWidth från props istället för settings
  const useMediaWidth = pattern.props?.useMediaWidth ?? false;

  return (
    <Container 
      key={patternKey}
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
 * Shell Pattern Renderer - För navbar/footer patterns
 * Använder Container för layout men utan spacing
 */
export const renderShellPattern = (pattern: PatternNode, patternKey: string, index: number) => {
  const PatternComponent = patternRegistry[pattern.type];
  if (!PatternComponent) {
    console.warn(`Unknown pattern type: ${pattern.type}`);
    return null;
  }

  // Hämta useMediaWidth från props
  const useMediaWidth = pattern.props?.useMediaWidth ?? false;

  // Container för layout men utan padding för shell patterns
  return (
    <Container 
      key={`${patternKey}-${index}`}
      align="center"
      height="auto"
      useMediaWidth={useMediaWidth}
      noPadding={true} // Ingen vertical padding för navbar/footer
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
  
  // Special handling for navbar - no Section wrapper, no Container padding
  if (type === 'navbar') {
    const renderedPatterns = patternOrder
      .map((patternKey, index) => {
        const pattern = patterns[patternKey];
        return pattern ? renderShellPattern(pattern, patternKey, index) : null;
      })
      .filter(Boolean);
    
    return <>{renderedPatterns}</>;
  }
  
  // Render all patterns for regular sections
  const renderedPatterns = patternOrder
    .map((patternKey) => {
      const pattern = patterns[patternKey];
      return pattern ? renderPattern(pattern, patternKey) : null;
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
        .map((sectionKey) => {
          const sectionData = sections[sectionKey];
          if (!sectionData) return null;
          
          return renderSection({ sectionData, sectionKey });
        })
        .filter(Boolean)}
    </>
  );
}

/**
 * Page component - Higher level abstraction for rendering complete pages
 * Simplifies the API for client-next
 */
interface PageProps {
  sections: Record<string, SectionNode>;
  order: string[];
}

export function Page({ sections, order }: PageProps) {
  return <Sections sections={sections} order={order} />;
}

