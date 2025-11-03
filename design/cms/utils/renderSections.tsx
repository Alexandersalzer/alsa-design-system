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
 */
const renderPattern = (pattern: any, index: number) => {
  if (!pattern || !pattern.type) return null;

  switch (pattern.type) {
    case 'spinningLogos': {
      // Extract heading
      const headingComponent = pattern.components?.heading_lKz6fL || 
                               Object.values(pattern.components || {}).find((c: any) => c.type === 'heading');
      const heading = headingComponent?.content || '';
      
      // Extract settings
      const settings = pattern.settings || {};
      const speed = settings.speed || 30;
      const direction = settings.direction || 'left';
      
      // Extract logos
      const logos = Object.entries(pattern.components || {})
        .filter(([key, comp]: [string, any]) => comp.type === 'logo')
        .map(([key, comp]: [string, any]) => {
          const content = comp.content as any;
          return {
            src: content?.src || '',
            alt: content?.alt || 'Logo'
          };
        })
        .filter(logo => logo.src);
      
      if (logos.length === 0) return null;
      
      return (
        <div key={`pattern-${index}`} style={{ marginTop: '4rem', width: '100%' }}>
          {heading && (
            <h3 style={{ 
              textAlign: 'center', 
              marginBottom: '2rem',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-tertiary)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              {heading}
            </h3>
          )}
          <SpinningBanner
            logos={logos}
            speed={speed}
            direction={direction}
          />
        </div>
      );
    }
    
    case 'media': {
      // Extract video component
      const videoComponent = pattern.components?.video_p9Bj3v || 
                            Object.values(pattern.components || {}).find((c: any) => c.type === 'video');
      
      if (!videoComponent || !videoComponent.content) return null;
      
      const content = videoComponent.content as any;
      const videoSrc = content?.src || content?.content || '';
      const videoPoster = content?.poster || '';
      
      if (!videoSrc) return null;
      
      return (
        <div key={`pattern-${index}`} style={{ marginTop: '4rem', width: '100%' }}>
          <Component>
            <VideoShowcase
              src={videoSrc}
              poster={videoPoster}
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
          </Component>
        </div>
      );
    }
    
    default:
      console.log(`⚠️ Unknown pattern type: ${pattern.type}`);
      return null;
  }
};

/**
 * Dynamically renders sections based on JSON content
 * Each section contains SectionBody + additional patterns
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
    .map((sectionKey, index) => {
      const sectionData = sections[sectionKey];
      
      if (!sectionData) {
        console.warn(`⚠️ renderSections: Section "${sectionKey}" not found in sections object`);
        return null;
      }

      const { type, patterns } = sectionData;
      
      // Extract sectionBody pattern
      const sectionBodyPattern = Object.values(patterns || {}).find(
        (p: any) => p.type === 'sectionBody'
      ) as any;
      
      if (!sectionBodyPattern) {
        console.warn(`⚠️ No sectionBody found for section "${sectionKey}"`);
        return null;
      }
      
      // Extract components from sectionBody
      const components = sectionBodyPattern.components || {};
      const headingComponent = Object.values(components).find((c: any) => c.type === 'heading') as any;
      const bodyComponent = Object.values(components).find((c: any) => c.type === 'body') as any;
      const tagComponent = Object.values(components).find((c: any) => c.type === 'tag') as any;
      const buttonComponent = Object.values(components).find((c: any) => c.type === 'button') as any;
      
      const title = headingComponent?.content || '';
      const subtitle = bodyComponent?.content || '';
      const tagText = tagComponent?.content || '';
      let primaryButtonText = '';
      
      // Handle button content
      if (buttonComponent?.content) {
        if (typeof buttonComponent.content === 'object' && 'content' in buttonComponent.content) {
          primaryButtonText = buttonComponent.content.content;
        } else if (typeof buttonComponent.content === 'string') {
          primaryButtonText = buttonComponent.content;
        }
      }
      
      // Get additional patterns (exclude sectionBody)
      const patternOrder = sectionData.order || Object.keys(patterns || {});
      const additionalPatterns = patternOrder
        .map(key => patterns![key])
        .filter(p => p && p.type && p.type !== 'sectionBody');
      
      // Don't render if no content
      if (!title && !subtitle && !primaryButtonText) {
        return null;
      }
      
      // Render section with SectionBody + patterns
      return (
        <Section 
          key={`${sectionKey}-${index}`}
          id={`${type}-section-${index}`}
          height="auto"
        >
          <Container
            align="center"
            height="auto"
            useMediaWidth={false}
          >
            <SectionBody
              tag={tagText ? {
                text: tagText,
                variant: 'accent',
                size: 'medium'
              } : undefined}
              heading={title}
              headingAs="h1"
              headingVariant="display-xl"
              headingColor="heading"
              headingWeight="bold"
              body={subtitle || undefined}
              bodyAs="p"
              bodyVariant="body-xl"
              bodyColor="body"
              bodyWeight="regular"
              actionType={primaryButtonText ? 'button' : undefined}
              button={primaryButtonText ? {
                text: primaryButtonText,
                variant: 'primary',
                size: 'xl'
              } : undefined}
              textAlign="center"
              maxWidth="800px"
              tagSpacing="sm"
              headingBodySpacing="md"
              bodyActionSpacing="xl"
            />
            
            {/* Render additional patterns */}
            {additionalPatterns.map((pattern, idx) => renderPattern(pattern, idx))}
          </Container>
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

