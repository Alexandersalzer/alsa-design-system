'use client';

import { Section, Container } from '../../../../../system/layout';
import { Results } from '../../../../../system/components/patterns/client/results';
import { ResponsiveGrid } from '../../../utilities/grid/Grid';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface ResultsSectionProps {
    pageSlug?: string;
    templateIndex?: number;
}


export const ResultsSection: React.FC<ResultsSectionProps> = ({ 
    pageSlug,
    templateIndex = 0,
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
  const resultsCards = patterns.map((pattern, index) => {
    // Get blocks for this specific pattern
    const patternBlocks = pattern.blocks || [];
    
    // Extract content from this pattern's blocks
    const title = getBlockContent(patternBlocks, 'title') || `Title ${index + 1}`;
    const subtitle = getBlockContent(patternBlocks, 'subtitle') || 'Subtitle';
    const body = getBlockContent(patternBlocks, 'body') || 'Body!';
    const image = getBlockContent(patternBlocks, 'image') || 'tiktokstats.jpeg';
    
    return {
      id: `review-${index}`,
      title,
      subtitle,
      body,
      image
    };
  });

  return (
    <Section id="results-section" height="auto">
      <Container 
        align="center" 
        height="auto"
        maxWidth="lg"
        style={{ 
          paddingTop: '2rem', 
          paddingBottom: '2rem'
        }}
      >
    {/* Grid layout for multiple review cards */}
    <ResponsiveGrid
          minItemWidth="280px"
          className="review-grid-center"
          style={{
            justifyItems: 'center'
          }}
        >
          {resultsCards.map((results) => (
            <Results 
              key={results.id}
              title={results.title}
              subtitle={results.subtitle}
              body={results.body}
              image={results.image}
            />
        ))}
        </ResponsiveGrid>
      </Container>
    </Section>
  );
};