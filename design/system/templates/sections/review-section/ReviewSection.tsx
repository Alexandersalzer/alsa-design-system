'use client';

import { Section, Container } from '../../../components';
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
  sectionPadding?: string;
  
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
  containerMaxWidth = 'xl', // Larger for multiple cards
  sectionPadding = '5rem 0',
  
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
  
  // Get all patterns from the template (each pattern = one review card)
  const patterns = template.patterns || [];
  
  if (patterns.length === 0) {
    console.log('No patterns found in reviewCard template');
    return null;
  }
  
  // Create review cards from each pattern
  const reviewCards = patterns.map((pattern, index) => {
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
        style={{ 
            paddingBottom: '5rem',
            paddingTop: '0rem'
        }}
      >
        {/* Grid layout for multiple review cards with equal heights */}
        <ResponsiveGrid
          minItemWidth="280px"
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