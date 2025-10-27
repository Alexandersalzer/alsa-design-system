'use client';

import { Section, Container } from '../../components';
import { RichText } from '../../patterns/client/RichText/RichText';
import { TypographyVariant } from '../../components/Typography';
import { useContent } from '../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';
import { Button } from '@blimpify-im/ui';

interface RichText0ButtonProps {
  pageSlug?: string;
  templateIndex?: number;
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  subtitleAs?: 'p' | 'span' | 'div';
  // Typography variants
  headingVariant?: TypographyVariant;
  subtitleVariant?: TypographyVariant;
  unit?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textPosition?: number;
  textSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: string;
  containerAlign?: 'left' | 'center' | 'right';
  containerMaxWidth?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  sectionPadding?: string;
  paddingTop?: string;
  paddingBottom?: string;
}

export const RichText0Button: React.FC<RichText0ButtonProps> = ({
  pageSlug,
  templateIndex = 0,
  titleAs = 'h6', // h2 since h1 is used in hero
  subtitleAs = 'div',
  // Typography variants - can be overridden at template level
  headingVariant = 'display-lg', // Valid TypographyVariant
  subtitleVariant = 'body-md', // Valid TypographyVariant
  unit = 'xl', // Same as HeroSection
  textPosition = 1,
  textSpacing = 'sm', // Same as HeroSection
  textAlign = 'center', // Same as HeroSection
  maxWidth = '550px', // Same as HeroSection
  containerAlign = 'center',
  containerMaxWidth = 'md',
  paddingTop = '15rem',
  paddingBottom = '10rem'
}) => {
  const { getPageTemplateByLayoutIndex, getTemplateBlocks, getBlockContent } = useContent();
  const pathname = usePathname();
  
  // Determine which page slug to use
  const currentSlug = pageSlug || pathname.replace('/', '') || 'home';
  
  // Get template by layout index (this makes it generic!)
  const template = getPageTemplateByLayoutIndex(currentSlug, templateIndex);
  
  if (!template) {
    console.log(`No template found at layout index ${templateIndex} for page ${currentSlug}`);
    return null;
  }
  
  // Get the template type dynamically
  const templateType = template.type;
  
  // Get blocks from template using its actual type
  const templateBlocks = getTemplateBlocks(template, templateType);
  
  // Extract content using generic functions from CMS
  const title = getBlockContent(templateBlocks, 'title');
  const subtitle = getBlockContent(templateBlocks, 'subtitle');

  // Don't render if no content is available
  if (!title && !subtitle) {
    return null;
  }

  return (
    <Section 
      id={`rich-text-section-${templateIndex}`}
      height="auto"
    >
      <Container 
        align={containerAlign}
        maxWidth={containerMaxWidth || "md"}
        style={{ 
          paddingBottom: paddingBottom || '10rem',
          paddingTop: paddingTop || '15rem'
        }}
      >
        {/* FEL EXEMPEL, Detta är primitives */} 
        <RichText
          heading={title}
          headingAs={titleAs}
          subtitle={subtitle}
          subtitleAs={subtitleAs}
          // No button prop - RichText will render without button
          unit={unit}
          textPosition={textPosition}
          textSpacing={textSpacing}
          textAlign={textAlign}
          maxWidth={maxWidth}
          headingVariant={headingVariant}
          subtitleVariant={subtitleVariant}
        />
        <Button>
            Button
        </Button>

        
        {/* RÄTT EXEMPEL */} 
        {/* Använding av pattern */} 
        <RichText0Button>

        </RichText0Button>

      </Container>
    </Section>
  );
}; 