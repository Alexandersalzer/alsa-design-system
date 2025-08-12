'use client';

import { Section, Container } from '../../../../../system/layout';
import { FilterTabs } from '../../../patterns/client/FilterTabs';
import { PortfolioCard } from '../../../patterns/client/PortfolioCard';
import { ResponsiveGrid } from '../../../../../system/layout/utilities/grid/Grid';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface FilterTabsSectionProps {
  pageSlug?: string;
  templateIndex?: number;
  
  // State management - allow external control
  activeFilter?: string;
  onFilterChange?: (filterId: string, filterValue: string) => void;
  
  // Layout configuration
  containerAlign?: 'left' | 'center' | 'right';
  containerMaxWidth?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  // Tab styling
  tabSize?: 'sm' | 'md' | 'lg';
  fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  useHeadingFont?: boolean;
  
  // Layout options
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
}

export const FilterTabsSection: React.FC<FilterTabsSectionProps> = ({
  pageSlug,
  templateIndex = 0,
  
  // State management
  activeFilter,
  onFilterChange,
  
  // Layout defaults
  containerAlign = 'center',
  containerMaxWidth = 'xl', // Increased for portfolio grid
  
  // Tab styling defaults - matching KJ Marketing
  tabSize = 'md',
  fontWeight = 'medium',
  useHeadingFont = true,
  
  // Layout defaults
  spacing = 'sm',
  align = 'center',
  justify = 'center',
  wrap = true,
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
  
  // Get all patterns from the template (each pattern = one filter item)
  const patterns = template.patterns || [];
  
  if (patterns.length === 0) {
    console.log('No patterns found in filterTabs template');
    return null;
  }
  
  // Create filters from each pattern
  const filters = patterns.map((pattern, index) => {
    // Get blocks for this specific pattern
    const patternBlocks = pattern.blocks || [];
    
    // Extract content from this pattern's blocks
    const label = getBlockContent(patternBlocks, 'label') || `Filter ${index + 1}`;
    const value = getBlockContent(patternBlocks, 'value') || `filter-${index + 1}`;
    
    return {
      id: `filter-${index}`,
      label,
      value
    };
  });

  // Default filter handling if no external state management
  const handleFilterChange = (filterId: string, filterValue: string) => {
    if (onFilterChange) {
      onFilterChange(filterId, filterValue);
    } else {
      // Default behavior - could be logged or handled internally
      console.log(`Filter changed to: ${filterValue} (${filterId})`);
    }
  };

  return (
    <Section 
      id={`filter-tabs-section-${templateIndex}`}
      height="auto"
    >
      <Container 
        align={containerAlign}
        maxWidth={containerMaxWidth}
        style={{ 
          paddingTop: '2rem',
          paddingBottom: '4rem'
        }}
      >
        <Stack spacing="xl">
          {/* Filter Tabs */}
          <FilterTabs
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            tabSize={tabSize}
            fontWeight={fontWeight}
            useHeadingFont={useHeadingFont}
            spacing={spacing}
            align={align}
            justify={justify}
            wrap={wrap}
          />
          
          {/* Portfolio Grid - For now just showing one card */}
          <ResponsiveGrid
            minItemWidth="350px"
            gap="lg"
            style={{
              justifyItems: 'center',
              alignItems: 'start'
            }}
          >
            <PortfolioCard
              category="INTERVJUINNEHÅLL"
              title="Svenska Ikoner-utmaning med Swae Lee"
              description="Rapper Swae Lee takes on the ultimate Swedish culture test! Can this global superstar name the three biggest Swedish icons: ABBA, Zlatan, and Avicii? This viral interview moment showcases the perfect blend of entertainment and cultural connection."
              views="3.2M views"
              videoSrc="Intro Video-2.mov"
            />
          </ResponsiveGrid>
        </Stack>
      </Container>
    </Section>
  );
}; 