'use client';

import { Section, Container } from '../../../layout';
import { RichText } from '../../../../../system/components/patterns/client/RichText/RichText';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface HeroSectionProps {
  pageSlug?: string;
  templateIndex?: number; // New prop to specify which hero template instance (0, 1, 2...)
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  subtitleAs?: 'p' | 'span' | 'div';
  buttonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
  unit?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textPosition?: number;
  buttonPosition?: number;
  textSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: string;
  containerMaxWidth?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  pageSlug,
  templateIndex = 0, // Default to first hero template
  titleAs = 'h1',
  subtitleAs = 'p',
  buttonVariant = 'primary',
  buttonSize = 'md',
  unit = 'xl',
  textPosition = 1,
  buttonPosition = 6,
  textSpacing = 'sm',
  textAlign = 'center',
  maxWidth = '550px',
  containerMaxWidth = 'md'
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

  return (
    <Section id="hero-section" height="auto">
      <Container 
        align="center" 
        height="auto"
        maxWidth={containerMaxWidth || "md"}
        style={{ 
          minHeight: '60vh', 
          paddingTop: '18rem', 
          paddingBottom: '2rem',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <RichText
          heading={title}
          headingAs={titleAs}
          headingVariant="display-xl" // Explicit variant for hero
          subtitle={subtitle}
          subtitleAs={subtitleAs}
          subtitleVariant="body-xl" // Explicit variant for hero
          button={{
            variant: buttonVariant,
            size: buttonSize,
            children: primaryButtonText
          }}
          unit={unit}
          textPosition={textPosition}
          buttonPosition={buttonPosition}
          textSpacing={textSpacing}
          textAlign={textAlign}
          maxWidth={maxWidth}
        />
      </Container>
    </Section>
  );
};