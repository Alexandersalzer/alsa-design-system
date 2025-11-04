'use client';

import { Section } from '../../system/components/frames/section/Section';
import { Container, Component } from '../../system/components';
import { SectionBody } from '../../system/patterns/shared/sectionBody/SectionBody';
import { SpinningBanner } from '../../system/patterns/client/spinning-banner/SpinningBanner';
import { VideoShowcase } from '../../system/components/media/VideoShowcase/VideoShowcase';

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
 * Props for renderSections function
 */
interface RenderSectionsProps {
  sections: Record<string, SectionData>;
  sectionOrder: string[];
  pageSlug: string;
}

/**
 * Pattern Renderer - Dynamically renders patterns based on content
 * Each pattern can optionally be wrapped in a Container
 */
const renderPattern = (pattern: any, index: number, useContainer: boolean = true) => {
  if (!pattern || !pattern.type) return null;

  let content: React.ReactNode = null;

  switch (pattern.type) {
    case 'sectionBody': {
      const components = pattern.components || {};
      const headingComponent = Object.values(components).find((c: any) => c.type === 'heading') as any;
      const bodyComponent = Object.values(components).find((c: any) => c.type === 'body') as any;
      const tagComponent = Object.values(components).find((c: any) => c.type === 'tag') as any;
      const buttonComponent = Object.values(components).find((c: any) => c.type === 'button') as any;
      
      content = (
        <SectionBody
          tag={tagComponent?.content ? {
            text: tagComponent.content,
            variant: 'accent',
            size: 'medium'
          } : undefined}
          heading={headingComponent?.content || ''}
          headingAs="h1"
          headingVariant="display-xl"
          headingColor="heading"
          headingWeight="bold"
          body={bodyComponent?.content || undefined}
          bodyAs="p"
          bodyVariant="body-xl"
          bodyColor="body"
          bodyWeight="regular"
          actionType={buttonComponent?.content ? 'button' : undefined}
          button={buttonComponent?.content ? {
            text: typeof buttonComponent.content === 'object' ? buttonComponent.content.content : buttonComponent.content,
            variant: 'primary',
            size: 'xl'
          } : undefined}
          textAlign="center"
          maxWidth="800px"
          tagSpacing="sm"
          headingBodySpacing="md"
          bodyActionSpacing="xl"
        />
      );
      break;
    }
    
    case 'spinningLogos': {
      const logos = Object.entries(pattern.components || {})
        .filter(([key, comp]: [string, any]) => comp.type === 'logo')
        .map(([key, comp]: [string, any]) => ({
          src: comp.content?.src || '',
          alt: comp.content?.alt || 'Logo'
        }))
        .filter(logo => logo.src);
      
      content = (
        <SpinningBanner
          logos={logos}
          speed={pattern.settings?.speed || 30}
          direction={pattern.settings?.direction || 'left'}
        />
      );
      break;
    }
    
    case 'media': {
      const videoComponent = Object.values(pattern.components || {}).find((c: any) => c.type === 'video') as any;
      
      content = (
        <VideoShowcase
          src={videoComponent?.content?.src || ''}
          poster={videoComponent?.content?.poster || ''}
          autoPlay={false}
          muted={true}
          loop={true}
          controls={false}
          showPlayButton={true}
          variant="elevated"
          size="full"
          aspectRatio="16-9"
          radius="md"
        />
      );
      break;
    }
    
    default:
      console.log(`⚠️ Unknown pattern type: ${pattern.type}`);
      return null;
  }

  if (!content) return null;

  // Wrap in Container if requested
  if (useContainer) {
    return (
      <Container
        key={`pattern-${index}`}
        align="center"
        height="auto"
        useMediaWidth={false}
        style={{ marginTop: index > 0 ? '4rem' : undefined }}
      >
        {content}
      </Container>
    );
  }

  // Return raw content with key
  return <div key={`pattern-${index}`}>{content}</div>;
};

/**
 * Dynamically renders sections based on JSON content
 * Each section renders all patterns in order (including sectionBody)
 * 
 * @param sections - Object containing all sections keyed by their IDs
 * @param sectionOrder - Array defining the order in which sections should be rendered
 * @param pageSlug - The current page slug for content lookup
 * @returns Array of rendered section components
 */
export function renderSections({ 
  sections, 
  sectionOrder, 
  pageSlug 
}: RenderSectionsProps): React.ReactNode[] {
  if (!sections || !sectionOrder) {
    console.warn('⚠️ renderSections: No sections or section order provided');
    return [];
  }

  return sectionOrder
    .map((sectionKey, sectionIndex) => {
      const sectionData = sections[sectionKey];
      
      if (!sectionData) {
        console.warn(`⚠️ renderSections: Section "${sectionKey}" not found in sections object`);
        return null;
      }

      const { type, patterns } = sectionData;
      
      if (!patterns) {
        console.warn(`⚠️ No patterns found for section "${sectionKey}"`);
        return null;
      }
      
      // Get pattern order from section data
      const patternOrder = sectionData.order || Object.keys(patterns);
      
      // Render all patterns (including sectionBody)
      const renderedPatterns = patternOrder
        .map((patternKey, patternIndex) => {
          const pattern = patterns[patternKey];
          if (!pattern) return null;
          
          return renderPattern(pattern, patternIndex, true);
        })
        .filter(Boolean); // Remove null values
      
      // Don't render section if no patterns were rendered
      if (renderedPatterns.length === 0) {
        return null;
      }
      
      // Wrap all patterns in a Section frame
      return (
        <Section 
          key={`${sectionKey}-${sectionIndex}`}
          id={`${type}-section-${sectionIndex}`}
          height="auto"
        >
          {renderedPatterns}
        </Section>
      );
    })
    .filter(Boolean); // Remove null values
}

/**
 * Higher-order component that wraps renderSections for easier use
 */
export function Sections({ 
  sections, 
  sectionOrder, 
  pageSlug 
}: RenderSectionsProps) {
  const renderedSections = renderSections({ sections, sectionOrder, pageSlug });
  
  return <>{renderedSections}</>;
}

