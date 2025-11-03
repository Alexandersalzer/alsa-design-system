'use client';

import { Container, Block } from '../../../components';
import { SectionBody } from '../../../patterns/shared/sectionBody/SectionBody';
import { SpinningBanner } from '../../../patterns/client/spinning-banner/SpinningBanner';
import { VideoShowcase } from '../../../components/media/VideoShowcase/VideoShowcase';
import { useContent } from '../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface HeroSectionProps {
  pageSlug?: string;
  templateIndex?: number;
  
  // Heading styling
  headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingVariant?: 'display-xl' | 'display-lg' | 'display-md' | 'h1' | 'h2';
  
  // Body/subtitle styling
  bodyAs?: 'p' | 'span' | 'div';
  bodyVariant?: 'body-xl' | 'body-lg' | 'body-md';
  
  // Button styling
  buttonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
  
  // Layout
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: string;
  useMediaWidth?: boolean;
  
  // Spacing
  headingBodySpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  bodyActionSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  // Optional tag
  showTag?: boolean;
  tagText?: string;
  tagVariant?: 'success' | 'error' | 'warning' | 'info' | 'accent' | 'default';
  
  // Pattern spacing
  patternSpacing?: string;
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
          <Block>
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
          </Block>
        </div>
      );
    }
    
    default:
      console.log(`⚠️ Unknown pattern type: ${pattern.type}`);
      return null;
  }
};

export const Hero: React.FC<HeroSectionProps> = ({ 
  pageSlug,
  templateIndex = 0,
  
  // Heading
  headingAs = 'h1',
  headingVariant = 'display-xl',
  
  // Body
  bodyAs = 'p',
  bodyVariant = 'body-xl',
  
  // Button
  buttonVariant = 'primary',
  buttonSize = 'xl',
  
  // Layout
  textAlign = 'center',
  maxWidth = '800px',
  useMediaWidth = false,
  
  // Spacing
  headingBodySpacing = 'md',
  bodyActionSpacing = 'xl',
  patternSpacing = '4rem',
  
  // Tag
  showTag = false,
  tagText = 'New',
  tagVariant = 'accent',
}) => {
  const { 
    getPageTemplate, 
    getTemplateBlocks, 
    getBlockContent,
    getPageV2,
    getSectionV2,
    getPatternV2,
    getComponentV2,
    getComponentContentV2
  } = useContent();
  const pathname = usePathname();
  
  // Determine which page slug to use
  const currentSlug = pageSlug || pathname.replace('/', '') || 'home';
  
  // Try V2 format first
  const pageV2 = getPageV2(currentSlug);
  
  let title = '';
  let subtitle = '';
  let primaryButtonText = '';
  let secondaryButtonText = '';
  let tagContent = tagText;
  let patterns: any[] = [];
  let patternOrder: string[] = [];
  
  if (pageV2) {
    // NEW FORMAT: Use V2 queries
    console.log('✅ Hero: Using V2 format for page:', currentSlug);
    
    // Get hero section
    const heroSection = getSectionV2(pageV2, 'hero', templateIndex);
    
    // Get sectionBody pattern
    const sectionBodyPattern = getPatternV2(heroSection, 'sectionBody', 0);
    
    // Extract content from components
    if (sectionBodyPattern) {
      const headingComponent = getComponentV2(sectionBodyPattern, 'heading');
      const bodyComponent = getComponentV2(sectionBodyPattern, 'body');
      const tagComponent = getComponentV2(sectionBodyPattern, 'tag');
      const actionComponent = getComponentV2(sectionBodyPattern, 'button');
      
      title = getComponentContentV2(headingComponent);
      subtitle = getComponentContentV2(bodyComponent);
      
      if (tagComponent) {
        tagContent = getComponentContentV2(tagComponent);
        showTag = true; // Auto-show tag if it exists in content
      }
      
      // Handle button content
      if (actionComponent && actionComponent.content) {
        if (typeof actionComponent.content === 'object' && 'content' in actionComponent.content) {
          primaryButtonText = actionComponent.content.content;
        } else if (typeof actionComponent.content === 'string') {
          primaryButtonText = actionComponent.content;
        }
      }
    }
    
    // Get all patterns and their order
    if (heroSection?.patterns) {
      patternOrder = heroSection.order || Object.keys(heroSection.patterns);
      patterns = patternOrder
        .map(key => heroSection.patterns[key])
        .filter(p => p && p.type && p.type !== 'sectionBody'); // Exclude undefined, null, and sectionBody
    }
  } else {
    // LEGACY FORMAT: Use old queries
    console.log('ℹ️ Hero: Using legacy format for page:', currentSlug);
    
    // Get specific hero template by index
    const heroTemplate = getPageTemplate(currentSlug, 'hero', templateIndex);
    
    // Get blocks from hero pattern
    const heroBlocks = getTemplateBlocks(heroTemplate, 'hero');
    
    // Extract content using generic functions
    title = getBlockContent(heroBlocks, 'title') || '';
    subtitle = getBlockContent(heroBlocks, 'subtitle') || '';
    primaryButtonText = getBlockContent(heroBlocks, 'primaryButton') || '';
    secondaryButtonText = getBlockContent(heroBlocks, 'secondaryButton') || '';
  }
  
  // Don't render if no content is available
  if (!title && !subtitle && !primaryButtonText) {
    return null;
  }
  
  // Determine action type based on available buttons
  const hasSecondaryButton = secondaryButtonText && secondaryButtonText.trim() !== '';
  const actionType = hasSecondaryButton ? 'button-group' : 'button';
  
  return (
    <Container
      align="center"
      height="auto"
      useMediaWidth={useMediaWidth}
      style={{ 
        minHeight: '60vh', 
        paddingTop: '18rem', 
        paddingBottom: '2rem',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <SectionBody
        // Optional tag
        tag={showTag ? {
          text: tagContent,
          variant: tagVariant,
          size: 'medium'
        } : undefined}
        
        // Heading (required)
        heading={title}
        headingAs={headingAs}
        headingVariant={headingVariant}
        headingColor="heading"
        headingWeight="bold"
        
        // Body/subtitle (optional)
        body={subtitle || undefined}
        bodyAs={bodyAs}
        bodyVariant={bodyVariant}
        bodyColor="body"
        bodyWeight="regular"
        
        // Actions
        actionType={actionType}
        
        // Single button
        button={!hasSecondaryButton && primaryButtonText ? {
          text: primaryButtonText,
          variant: buttonVariant,
          size: buttonSize,
        } : undefined}
        
        // Button group (primary + secondary)
        buttonGroup={hasSecondaryButton ? [
          {
            text: primaryButtonText,
            variant: buttonVariant,
            size: buttonSize,
          },
          {
            text: secondaryButtonText,
            variant: 'secondary',
            size: buttonSize,
          }
        ] : undefined}
        
        // Layout
        textAlign={textAlign}
        maxWidth={maxWidth}
        
        // Spacing
        tagSpacing="sm"
        headingBodySpacing={headingBodySpacing}
        bodyActionSpacing={bodyActionSpacing}
      />
      
      {/* Dynamically render patterns based on content */}
      {patterns.map((pattern, index) => renderPattern(pattern, index))}
    </Container>
);
};

export default Hero;