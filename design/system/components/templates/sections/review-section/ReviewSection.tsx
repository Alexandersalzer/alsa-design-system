'use client';

import { Section, Container } from '../../../../../system/layout';
import { ReviewCard } from '../../../../../system/components/patterns/client/ReviewCard';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface ReviewSectionProps {
  pageSlug?: string;
  templateIndex?: number;
  
  // Layout configuration
  containerAlign?: 'left' | 'center' | 'right';
  containerMaxWidth?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  sectionPadding?: string;
  
  // Card styling
  cardVariant?: 'default' | 'elevated' | 'outlined';
  cardPadding?: 'sm' | 'md' | 'lg';
  cardRadius?: 'sm' | 'md' | 'lg';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  pageSlug,
  templateIndex = 0,
  
  // Layout defaults
  containerAlign = 'center',
  containerMaxWidth = 'md',
  sectionPadding = '5rem 0',
  
  // Card styling defaults
  cardVariant = 'elevated',
  cardPadding = 'lg',
  cardRadius = 'md',
  spacing = 'sm'
}) => {
  const { getPageTemplateByLayoutIndex, getTemplateBlocks, getBlockContent } = useContent();
  const pathname = usePathname();
  
  // Determine which page slug to use
  const currentSlug = pageSlug || pathname.replace('/', '') || 'home';
  
  // Get template by layout index
  const template = getPageTemplateByLayoutIndex(currentSlug, templateIndex);
  
  if (!template) {
    console.log(`No template found at layout index ${templateIndex} for page ${currentSlug}`);
    return null;
  }
  
  // Get the template type dynamically
  const templateType = template.type;
  
  // Get blocks from template using its actual type
  const templateBlocks = getTemplateBlocks(template, templateType);
  
  // Extract content using generic functions from CMS with fallbacks
  const name = getBlockContent(templateBlocks, 'name') || 'Furkantasel';
  const subtitle = getBlockContent(templateBlocks, 'subtitle') || 'Head Of Marketing Ivy AI';
  const reviewText = getBlockContent(templateBlocks, 'reviewText') || 'Utmärkt arbete! Högst rekommenderad! Kvaliteten på arbetet var förstklassig och levererades i tid. Jag är otroligt nöjd med resultatet och skulle starkt rekommendera Kevin till alla som letar efter en pålitlig och talangfull frilansare.';

  return (
    <Section 
      id={`review-section-${templateIndex}`}
      height="auto"
    >
      <Container 
        align={containerAlign}
        maxWidth={containerMaxWidth}
        style={{ 
          padding: sectionPadding
        }}
      >
        <ReviewCard
          name={name}
          subtitle={subtitle}
          reviewText={reviewText}
          showIcon={true}
          iconSize="xl"
          iconColor="muted"
          variant="outlined"
          padding={cardPadding}
          radius={cardRadius}
          spacing={spacing}
          headerSpacing="sm"
        />
      </Container>
    </Section>
  );
}; 