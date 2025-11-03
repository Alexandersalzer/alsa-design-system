'use client';

import { Section, Container } from '../../../components';
import { SectionBody } from '../../../patterns/shared/sectionBody/SectionBody';
import { ResponsiveGrid } from '../../../components/layout/grid/Grid';
import { ReviewCard } from '../../../../system/patterns/client/ReviewCard';
import { useContent } from '../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface ReviewSectionProps {
  pageSlug?: string;
  templateIndex?: number;
  
  // Layout configuration
  containerAlign?: 'left' | 'center' | 'right';
  containerMaxWidth?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  // SectionBody configuration
  headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingVariant?: 'display-xl' | 'display-lg' | 'display-md' | 'h1' | 'h2';
  bodyAs?: 'p' | 'span' | 'div';
  bodyVariant?: 'body-xl' | 'body-lg' | 'body-md';
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: string;
  headingBodySpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  bodyGridSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  // Card styling
  cardVariant?: 'default' | 'elevated' | 'outlined';
  cardPadding?: 'sm' | 'md' | 'lg';
  cardRadius?: 'sm' | 'md' | 'lg';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  // Grid layout
  minItemWidth?: string;

}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  pageSlug,
  templateIndex = 0,
  
  // Layout defaults
  containerAlign = 'center',
  containerMaxWidth = 'xl',
  
  // SectionBody defaults
  headingAs = 'h2',
  headingVariant = 'display-lg',
  bodyAs = 'p',
  bodyVariant = 'body-lg',
  textAlign = 'center',
  maxWidth = '700px',
  headingBodySpacing = 'md',
  bodyGridSpacing = 'xl',
  
  // Card styling defaults
  cardVariant = 'default',
  cardPadding = 'lg',
  cardRadius = 'md',
  spacing = 'sm',
  
  // Grid defaults
  minItemWidth = '300px',
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
  
  // Get the first pattern for SectionBody content (heading + subtitle)
  const firstPattern = template.patterns?.[0];
  const sectionBodyBlocks = firstPattern?.blocks || [];
  
  // Extract SectionBody content from first pattern
  const heading = getBlockContent(sectionBodyBlocks, 'title') || '';
  const body = getBlockContent(sectionBodyBlocks, 'subtitle') || '';
  
  // Get all patterns from the template (each pattern = one review card)
  // Skip the first pattern if it's used for SectionBody
  const patterns = template.patterns || [];
  
  // If first pattern has title/subtitle, start from index 1, otherwise from 0
  const hasSectionBody = heading || body;
  const reviewPatterns = hasSectionBody ? patterns.slice(1) : patterns;
  
  if (reviewPatterns.length === 0) {
    console.log('No review patterns found in reviewCard template');
    return null;
  }
  
  // Create review cards from each pattern
  const reviewCards = reviewPatterns.map((pattern, index) => {
    // Get blocks for this specific pattern
    const patternBlocks = pattern.blocks || [];
    
    // Extract content from this pattern's blocks
    const name = getBlockContent(patternBlocks, 'name') || `Review ${index + 1}`;
    const subtitle = getBlockContent(patternBlocks, 'subtitle') || 'Customer';
    const reviewText = getBlockContent(patternBlocks, 'reviewText') || 'Great work!';
    
    return {
      id: `review-${index}`,
      name,
      subtitle,
      reviewText
    };
  });

  return (
    <Section 
      id={`review-section-${templateIndex}`}
      height="auto"
    >
      <Container 
        align={containerAlign}
      >
        {/* SectionBody for heading and subtitle */}
        {(heading || body) && (
            <SectionBody
              heading={heading || undefined}
              headingAs={headingAs}
              headingVariant={headingVariant}
              headingColor="heading"
              headingWeight="bold"
              body={body || undefined}
              bodyAs={bodyAs}
              bodyVariant={bodyVariant}
              bodyColor="body"
              bodyWeight="regular"
              textAlign={textAlign}
              maxWidth={maxWidth}
              headingBodySpacing={headingBodySpacing}
            />
        )}
        
        {/* Grid layout for multiple review cards with equal heights */}
        <ResponsiveGrid
          minItemWidth={minItemWidth}
          className="review-grid-center"
          style={{
            alignItems: 'stretch', // Ensure all grid items stretch to same height
            justifyItems: 'stretch' // Ensure cards fill their grid cells
          }}
        >
          {reviewCards.map((review) => (
            <ReviewCard
              key={review.id}
              name={review.name}
              subtitle={review.subtitle}
              reviewText={review.reviewText}
              showIcon={true}
              variant={cardVariant}
              padding={cardPadding}
              radius={cardRadius}
              spacing={spacing}
              headerSpacing="sm"
            />
          ))}
        </ResponsiveGrid>
      </Container>
    </Section>
  );
};