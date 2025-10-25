'use client';

import { Section, Container } from '../../../components';
import { StatsGrid } from '../../../patterns/client/StatsGrid';
import { useContent } from '../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface StatsGridSectionProps {
  pageSlug?: string;
  templateIndex?: number;
  
  // Layout configuration
  containerAlign?: 'left' | 'center' | 'right';
  containerMaxWidth?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  sectionPadding?: string;
  
  // Grid styling
  minItemWidth?: string;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Typography options
  numberVariant?: 'display-xl' | 'display-lg' | 'display-md' | 'display-sm' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  numberWeight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  
  labelVariant?: 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs' | 'label-lg' | 'label-md' | 'label-sm';
  labelWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

export const StatsGridSection: React.FC<StatsGridSectionProps> = ({
  pageSlug,
  templateIndex = 0,
  
  // Layout defaults
  containerAlign = 'center',
  containerMaxWidth = 'lg',
  sectionPadding = '4rem 0',
  
  // Grid defaults
  minItemWidth = '200px',
  gap = 'lg',
  
  // Typography defaults - matching KJ Marketing
  numberVariant = 'display-lg',
  numberWeight = 'bold',
  
  labelVariant = 'body-sm',
  labelWeight = 'regular',
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
  
  // Get all patterns from the template (each pattern = one stat item)
  const patterns = template.patterns || [];
  
  if (patterns.length === 0) {
    console.log('No patterns found in statsGrid template');
    return null;
  }
  
  // Create stats from each pattern
  const stats = patterns.map((pattern, index) => {
    // Get blocks for this specific pattern
    const patternBlocks = pattern.blocks || [];
    
    // Extract content from this pattern's blocks
    const number = getBlockContent(patternBlocks, 'number') || `${index + 1}M+`;
    const label = getBlockContent(patternBlocks, 'label') || `Stat ${index + 1}`;
    
    return {
      id: `stat-${index}`,
      number,
      label
    };
  });

  return (
    <Section 
      id={`stats-grid-section-${templateIndex}`}
      height="auto"
    >
      <Container 
        align={containerAlign}
        maxWidth={containerMaxWidth}
        style={{ 
          paddingTop: '4rem',
          paddingBottom: '4rem'
        }}
      >
        <StatsGrid
          stats={stats}
          minItemWidth={minItemWidth}
          gap={gap}
          numberVariant={numberVariant}
          numberWeight={numberWeight}
          labelVariant={labelVariant}
          labelWeight={labelWeight}
        />
      </Container>
    </Section>
  );
}; 