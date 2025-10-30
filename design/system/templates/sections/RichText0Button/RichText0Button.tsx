'use client';

import { Section, Container } from '../../../components';
import { RichText } from '../../../patterns/client/RichText/RichText';
import { TypographyVariant } from '../../../components/Typography';
import { useContent } from '../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface RichText0ButtonProps {
  pageSlug?: string;
  templateIndex?: number;
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  subtitleAs?: 'p' | 'span' | 'div';
  headingVariant?: TypographyVariant;
  subtitleVariant?: TypographyVariant;
  unit?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textPosition?: number;
  textSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: string;
  containerAlign?: 'left' | 'center' | 'right';
  paddingTop?: string;
  paddingBottom?: string;
  // ✅ DELETED: containerMaxWidth - not needed
}

export const RichText0Button: React.FC<RichText0ButtonProps> = ({
  pageSlug,
  templateIndex = 0,
  titleAs = 'h6',
  subtitleAs = 'div',
  headingVariant = 'display-lg',
  subtitleVariant = 'body-md',
  unit = 'xl',
  textPosition = 1,
  textSpacing = 'sm',
  textAlign = 'center',
  maxWidth = '550px',
  containerAlign = 'center',
  paddingTop = '15rem',
  paddingBottom = '10rem'
}) => {
  const { getPageTemplateByLayoutIndex, getTemplateBlocks, getBlockContent } = useContent();
  const pathname = usePathname();
  
  const currentSlug = pageSlug || pathname.replace('/', '') || 'home';
  const template = getPageTemplateByLayoutIndex(currentSlug, templateIndex);
  
  if (!template) {
    console.log(`No template found at layout index ${templateIndex} for page ${currentSlug}`);
    return null;
  }
  
  const templateType = template.type;
  const templateBlocks = getTemplateBlocks(template, templateType);
  const title = getBlockContent(templateBlocks, 'title');
  const subtitle = getBlockContent(templateBlocks, 'subtitle');
  
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
        // ✅ NO maxWidth prop - usemediamaxwidth
        style={{ 
          paddingBottom: paddingBottom || '10rem',
          paddingTop: paddingTop || '15rem'
        }}
      >
        <RichText
          heading={title}
          headingAs={titleAs}
          subtitle={subtitle}
          subtitleAs={subtitleAs}
          unit={unit}
          textPosition={textPosition}
          textSpacing={textSpacing}
          textAlign={textAlign}
          maxWidth={maxWidth}
          headingVariant={headingVariant}
          subtitleVariant={subtitleVariant}
        />
      </Container>
    </Section>
  );
};