'use client';

import { Section, Container } from '../../../components';
import { SectionBody } from '../../../../system/patterns/shared/sectionBody/SectionBody';
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

export const HeroSection: React.FC<HeroSectionProps> = ({ 
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
  const { getPageTemplate, getTemplateBlocks, getBlockContent } = useContent();
  const pathname = usePathname();
  
  // Determine which page slug to use
  const currentSlug = pageSlug || pathname.replace('/', '') || 'home';
  
  // Get specific hero template by index
  const heroTemplate = getPageTemplate(currentSlug, 'hero', templateIndex);
  
  // Get blocks from hero pattern
  const heroBlocks = getTemplateBlocks(heroTemplate, 'hero');
  
  // Extract content using generic functions
  const title = getBlockContent(heroBlocks, 'title') || '';
  const subtitle = getBlockContent(heroBlocks, 'subtitle') || '';
  const primaryButtonText = getBlockContent(heroBlocks, 'primaryButton') || '';
  const secondaryButtonText = getBlockContent(heroBlocks, 'secondaryButton') || '';
  
  // Don't render if no content is available
  if (!title && !subtitle && !primaryButtonText) {
    return null;
  }
  
  // Determine action type based on available buttons
  const hasSecondaryButton = secondaryButtonText && secondaryButtonText.trim() !== '';
  const actionType = hasSecondaryButton ? 'button-group' : 'button';
  
  return (
    <Section id="hero-section" height="auto">
      <Container 
        align="center" 
        height="auto"
        useMediaWidth={useMediaWidth} // ✅ CLEAN!
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
            text: tagText,
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
      </Container>
    </Section>
  );
};

export default HeroSection;