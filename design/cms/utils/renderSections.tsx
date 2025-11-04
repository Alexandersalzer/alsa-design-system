'use client';

import { Section } from '../../system/components/frames/section/Section';
import { Container } from '../../system/components';
import { VStack } from '../../system/components/layout/vStack/VStack';
import { patternRegistry } from '../../system/patterns/client';

/**
 * Interface for section data from JSON
 */
export interface SectionData {
  type: string;
  patterns?: Record<string, any>;
  order?: string[];
  [key: string]: any;
}

/**
 * Props for renderSection function
 */
interface RenderSectionProps {
  sectionData: SectionData;
  sectionKey: string;
}

/**
 * Props for Sections component
 */
interface SectionsProps {
  sections: Record<string, SectionData>;
  sectionOrder: string[];
  pageSlug: string;
}

/**
 * Pattern Renderer - Dynamically renders patterns based on content
 */
const renderPattern = (pattern: any, index: number) => {
  const PatternComponent = patternRegistry[pattern.type];
  if (!PatternComponent) {
    console.warn(`Unknown pattern type: ${pattern.type}`);
    return null;
  }

  // Transform data for specific pattern types
  let transformedProps = { ...pattern };
  
  if (pattern.type === 'sectionBody' && pattern.components) {
    // Transform sectionBody data directly
    const { components } = pattern;
    const headingComponent = Object.values(components).find((c: any) => c.type === 'heading') as any;
    const bodyComponent = Object.values(components).find((c: any) => c.type === 'body') as any;
    const tagComponent = Object.values(components).find((c: any) => c.type === 'tag') as any;
    const buttonComponent = Object.values(components).find((c: any) => c.type === 'button') as any;
    
    transformedProps = {
      tag: tagComponent?.content ? {
        text: tagComponent.content,
        variant: 'accent',
        size: 'medium'
      } : undefined,
      heading: headingComponent?.content || '',
      headingAs: "h1",
      headingVariant: "display-xl",
      headingColor: "heading",
      headingWeight: "bold",
      body: bodyComponent?.content || undefined,
      bodyAs: "p",
      bodyVariant: "body-xl",
      bodyColor: "body",
      bodyWeight: "regular",
      actionType: buttonComponent?.content ? 'button' : undefined,
      button: buttonComponent?.content ? {
        text: typeof buttonComponent.content === 'object' ? buttonComponent.content.content : buttonComponent.content,
        variant: 'primary',
        size: 'xl'
      } : undefined,
      textAlign: "center",
      maxWidth: "800px",
      tagSpacing: "sm",
      headingBodySpacing: "md",
      bodyActionSpacing: "xl"
    };
  }

  return (
    <Container 
      key={`pattern-${index}`}
      align="center"
      height="auto"
      useMediaWidth={false}
    >
      <PatternComponent {...transformedProps} />
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

  const { type, patterns } = sectionData;
  const patternOrder = sectionData.order || Object.keys(patterns);
  
  // Render all patterns for this section
  const renderedPatterns = patternOrder
    .map((patternKey, patternIndex) => {
      const pattern = patterns[patternKey];
      return pattern ? renderPattern(pattern, patternIndex) : null;
    })
    .filter(Boolean);
  
  if (renderedPatterns.length === 0) return null;
  
  // Wrap all patterns in a Section with VStack for spacing
  return (
    <Section 
      key={sectionKey}
      id={`${type}-section`}
      height="auto"
    >
      <VStack align="stretch">
        {renderedPatterns}
      </VStack>
    </Section>
  );
}

/**
 * Main component that renders all sections based on sectionOrder
 */
export function Sections({ 
  sections, 
  sectionOrder
}: SectionsProps) {
  return (
    <>
      {sectionOrder
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

