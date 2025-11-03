'use client';

import { Section, Container, Block } from '../../../components';
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
  useMediaWidth?: boolean; // ✅ SIMPLE BOOLEAN
  
  // Spacing
  headingBodySpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  bodyActionSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  // Optional tag
  showTag?: boolean;
  tagText?: string;
  tagVariant?: 'success' | 'error' | 'warning' | 'info' | 'accent' | 'default';
}

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
  useMediaWidth = false, // ✅ Default: content width
  
  // Spacing
  headingBodySpacing = 'md',
  bodyActionSpacing = 'xl',
  
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
  
  // Spinning banner data
  let showSpinningBanner = false;
  let spinningBannerHeading = '';
  let spinningBannerLogos: Array<{ src: string; alt: string }> = [];
  let spinningBannerSpeed = 30;
  let spinningBannerDirection: 'left' | 'right' = 'left';
  
  // Video showcase data
  let showVideoShowcase = false;
  let videoSrc = '';
  let videoPoster = '';
  
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
    
    // Get spinningLogos pattern
    const spinningLogosPattern = getPatternV2(heroSection, 'spinningLogos', 0);
    
    if (spinningLogosPattern) {
      showSpinningBanner = true;
      
      // Get heading from spinningLogos
      const spinningHeadingComponent = getComponentV2(spinningLogosPattern, 'heading');
      spinningBannerHeading = getComponentContentV2(spinningHeadingComponent);
      
      // Get settings
      const settings = spinningLogosPattern.settings || {};
      spinningBannerSpeed = settings.speed || 30;
      spinningBannerDirection = settings.direction || 'left';
      
      // Get all logo components
      if (spinningLogosPattern.components) {
        const logoComponents = Object.entries(spinningLogosPattern.components)
          .filter(([key, comp]) => comp.type === 'logo')
          .map(([key, comp]) => {
            const content = comp.content as any;
            return {
              src: content?.src || '',
              alt: content?.alt || 'Logo'
            };
          })
          .filter(logo => logo.src); // Only include logos with valid src
        
        spinningBannerLogos = logoComponents;
      }
    }
    
    // Get media pattern for video
    const mediaPattern = getPatternV2(heroSection, 'media', 0);
    
    if (mediaPattern) {
      const videoComponent = getComponentV2(mediaPattern, 'video');
      
      if (videoComponent && videoComponent.content) {
        const content = videoComponent.content as any;
        if (typeof content === 'object' && content.src) {
          showVideoShowcase = true;
          videoSrc = content.src;
          videoPoster = content.poster || '';
        } else if (typeof content === 'object' && content.content) {
          // Handle nested content structure
          showVideoShowcase = true;
          videoSrc = content.content;
        }
      }
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
  <Section id="hero-section" height="auto">
    {/* Regular-width container for text + spinning banner */}
    <Container
      align="center"
      height="auto"
      useMediaWidth={false} // regular max width
    >
      <SectionBody
        tag={
          showTag
            ? { text: tagContent, variant: tagVariant, size: 'medium' }
            : undefined
        }
        heading={title}
        headingAs={headingAs}
        headingVariant={headingVariant}
        headingColor="heading"
        headingWeight="bold"
        body={subtitle || undefined}
        bodyAs={bodyAs}
        bodyVariant={bodyVariant}
        bodyColor="body"
        bodyWeight="regular"
        actionType={hasSecondaryButton ? 'button-group' : 'button'}
        button={
          !hasSecondaryButton && primaryButtonText
            ? { text: primaryButtonText, variant: buttonVariant, size: buttonSize }
            : undefined
        }
        buttonGroup={
          hasSecondaryButton
            ? [
                { text: primaryButtonText, variant: buttonVariant, size: buttonSize },
                { text: secondaryButtonText, variant: 'secondary', size: buttonSize },
              ]
            : undefined
        }
        textAlign={textAlign}
        maxWidth={maxWidth}
        tagSpacing="sm"
        headingBodySpacing={headingBodySpacing}
        bodyActionSpacing={bodyActionSpacing}
      />

      {showSpinningBanner && (
        <div style={{ marginTop: '4rem', width: '100%' }}>
          {spinningBannerHeading && (
            <h3
              style={{
                textAlign: 'center',
                marginBottom: '2rem',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-tertiary)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {spinningBannerHeading}
            </h3>
          )}
          <SpinningBanner
            logos={spinningBannerLogos}
            speed={spinningBannerSpeed}
            direction={spinningBannerDirection}
          />
        </div>
      )}
    </Container>

    {/* Wider container only for video showcase */}
    {showVideoShowcase && (
      <Container
        align="center"
        height="auto"
        useMediaWidth={true} // <-- maxWidthMedia
        style={{ marginTop: '4rem' }}
      >
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
      </Container>
    )}
  </Section>
);
};

export default Hero;