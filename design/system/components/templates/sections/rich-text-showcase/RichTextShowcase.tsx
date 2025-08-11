'use client';

import { Section, Container } from '../../../../../system/layout';
import { RichText } from '../../../../../system/components/patterns/client/RichText';
import { TypographyVariant, TypographyColor, TypographyWeight, TypographyAlign } from '../../../../../system/components/primitives/Typography';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface RichTextShowcaseProps {
  pageSlug?: string;
  templateIndex?: number;
  
  // Content
  heading?: React.ReactNode;
  subtitle?: React.ReactNode;
  buttonText?: string;
  
  // Typography styling
  headingVariant?: TypographyVariant;
  headingColor?: TypographyColor;
  headingWeight?: TypographyWeight;
  headingAs?: React.ElementType;
  
  subtitleVariant?: TypographyVariant;
  subtitleColor?: TypographyColor;
  subtitleWeight?: TypographyWeight;
  subtitleAs?: React.ElementType;
  
  // Button configuration
  buttonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
  onButtonClick?: () => void;
  
  // Layout configuration
  unit?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textPosition?: number;
  buttonPosition?: number;
  textSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textAlign?: TypographyAlign;
  maxWidth?: string | number;
  
  // Container and Section styling
  containerAlign?: 'left' | 'center' | 'right';
  containerMaxWidth?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  sectionPadding?: string;
}

export const RichTextShowcase: React.FC<RichTextShowcaseProps> = ({
  pageSlug,
  templateIndex = 0,
  
  // Default content from the user's request
  heading = 'UGC Videos Som Konverterar Tittare Till Kunder',
  subtitle = 'Sedan 2018 har jag hållit på med detta, mitt ansikte och min röst har med åren blivit en trygghet hos miljontals. Det innebär att ditt varumärke eller företag automatiskt får en kvalitetsstämpel och trovärdighet när jag gjort videorna.',
  buttonText = '', // No button by default
  
  // Typography defaults
  headingVariant = 'h2',
  headingColor = 'heading',
  headingWeight = 'bold',
  headingAs = 'h2',
  
  subtitleVariant = 'body-lg',
  subtitleColor = 'secondary',
  subtitleWeight = 'regular',
  subtitleAs = 'p',
  
  // Button defaults
  buttonVariant = 'primary',
  buttonSize = 'md',
  onButtonClick,
  
  // Layout defaults
  unit = 'lg',
  textPosition = 1,
  buttonPosition = 5,
  textSpacing = 'md',
  textAlign = 'center',
  maxWidth = '800px', // Wider for longer content
  
  // Container defaults
  containerAlign = 'center',
  containerMaxWidth = 'lg',
  sectionPadding = '4rem 0'
}) => {
  const { getPageTemplate, getTemplateBlocks, getBlockContent } = useContent();
  const pathname = usePathname();
  
  // Determine which page slug to use
  const currentSlug = pageSlug || pathname.replace('/', '') || 'home';
  
  // Get specific rich text template by index
  const richTextTemplate = getPageTemplate(currentSlug, 'richTextShowcase', templateIndex);
  
  // Get blocks from rich text pattern
  const richTextBlocks = getTemplateBlocks(richTextTemplate, 'richTextShowcase');
  
  // Extract content using generic functions with fallbacks to defaults
  const cmsHeading = getBlockContent(richTextBlocks, 'heading') || heading;
  const cmsSubtitle = getBlockContent(richTextBlocks, 'subtitle') || subtitle;
  const cmsButtonText = getBlockContent(richTextBlocks, 'button') || buttonText;

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      // Default action
      console.log('RichText button clicked');
    }
  };

  return (
    <Section 
      id="rich-text-showcase-section" 
      height="auto"
    >
      <Container 
        align={containerAlign}
        maxWidth={containerMaxWidth}
        style={{ 
          padding: sectionPadding
        }}
      >
        <RichText
          heading={cmsHeading}
          headingVariant={headingVariant}
          headingColor={headingColor}
          headingWeight={headingWeight}
          headingAs={headingAs}
          
          subtitle={cmsSubtitle}
          subtitleVariant={subtitleVariant}
          subtitleColor={subtitleColor}
          subtitleWeight={subtitleWeight}
          subtitleAs={subtitleAs}
          
          button={cmsButtonText ? {
            children: cmsButtonText,
            variant: buttonVariant,
            size: buttonSize,
            onClick: handleButtonClick
          } : undefined}
          
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