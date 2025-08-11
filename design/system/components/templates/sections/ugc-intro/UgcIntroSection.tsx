'use client';

import { Section, Container } from '../../../../../system/layout';
import { RichText } from '../../../../../system/components/patterns/client/RichText/RichText';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface UgcIntroSectionProps {
  pageSlug?: string;
  templateIndex?: number;
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  subtitleAs?: 'p' | 'span' | 'div';
  unit?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textPosition?: number;
  textSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: string;
  containerAlign?: 'left' | 'center' | 'right';
  containerMaxWidth?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  sectionPadding?: string;
}

export const UgcIntroSection: React.FC<UgcIntroSectionProps> = ({
  pageSlug,
  templateIndex = 0,
  titleAs = 'h2', // h2 since h1 is used in hero
  subtitleAs = 'p',
  unit = 'xl', // Same as HeroSection
  textPosition = 1,
  textSpacing = 'sm', // Same as HeroSection
  textAlign = 'center', // Same as HeroSection
  maxWidth = '550px', // Same as HeroSection
  containerAlign = 'center',
  containerMaxWidth = 'lg',
  sectionPadding = '5rem 0'
}) => {
  const { getPageTemplate, getTemplateBlocks, getBlockContent } = useContent();
  const pathname = usePathname();
  
  // Determine which page slug to use
  const currentSlug = pageSlug || pathname.replace('/', '') || 'home';
  
  // Get specific UGC intro template by index
  const ugcTemplate = getPageTemplate(currentSlug, 'ugcIntro', templateIndex);
  
  // Get blocks from UGC intro pattern
  const ugcBlocks = getTemplateBlocks(ugcTemplate, 'ugcIntro');
  
  // Extract content using generic functions with defaults
  const title = getBlockContent(ugcBlocks, 'title') || 'UGC Videos Som Konverterar Tittare Till Kunder';
  const subtitle = getBlockContent(ugcBlocks, 'subtitle') || 'Sedan 2018 har jag hållit på med detta, mitt ansikte och min röst har med åren blivit en trygghet hos miljontals. Det innebär att ditt varumärke eller företag automatiskt får en kvalitetsstämpel och trovärdighet när jag gjort videorna.';

  return (
    <Section 
      id="ugc-intro-section" 
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
        />
      </Container>
    </Section>
  );
}; 