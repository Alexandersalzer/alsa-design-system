'use client';

import { Section } from '../../components/frames/section/Section';
import { Container } from '../../components/frames/container/Container';
import { VStack } from '../../components/layout/vStack/VStack';
import { HStack } from '../../components/layout/hStack/HStack';
import { Box } from '../../components/layout/box/Box';
import { SectionNode } from '../types/nodes';
import { renderPattern } from './patterns';
import { SectionHeader } from './SectionHeader';

/**
 * Props for Sections component
 */
interface SectionsProps {
  sections: Record<string, SectionNode>;
  order: string[];
}

/**
 * Renders a single section with layout support
 */
export function renderSection(sectionData: SectionNode, sectionKey: string): React.ReactNode {
  if (!sectionData?.patterns) return null;

  const { patterns, props, layout } = sectionData;
  const layoutMode = props?.layout || 'vertical';

  // VERTICAL LAYOUT (default) - Simple stacking
  if (layoutMode === 'vertical') {
    const patternOrder = sectionData.order || Object.keys(patterns);
    
    return (
      <Section key={sectionKey} id={sectionKey} sectionKey={sectionKey} height="auto" {...props}>
        {patternOrder.map(key => renderPattern(patterns[key], key, sectionKey))}
      </Section>
    );
  }

  // SPLIT LAYOUT - Two columns with shared container
  if (layoutMode === 'split') {
    const leftSlot = layout?.slots?.left || [];
    const rightSlot = layout?.slots?.right || [];
    const bottomSlot = layout?.slots?.bottom || [];

    return (
      <Section key={sectionKey} id={sectionKey} sectionKey={sectionKey} height="auto" {...props}>
        <Container height="auto" useMediaWidth={false}>
          <HStack spacing={layout?.gap || 'xl'} align="start">
            {/* Left column */}
            <Box style={{ flex: 1 }}>
              <VStack spacing="md" align="start">
                {leftSlot.map((key: string) => renderPattern(patterns[key], key, sectionKey))}
              </VStack>
            </Box>
            
            {/* Right column */}
            <Box style={{ flex: 1 }}>
              {rightSlot.map((key: string) => renderPattern(patterns[key], key, sectionKey))}
            </Box>
          </HStack>
        </Container>
        
        {/* Bottom patterns */}
        {bottomSlot.map((key: string) => renderPattern(patterns[key], key, sectionKey))}
      </Section>
    );
  }

  // GRID LAYOUT - CSS Grid with areas
  if (layoutMode === 'grid' && layout?.grid) {
    const { areas, columns, gap, slots } = layout.grid;
    const gapSize = gap === 'xl' ? 'var(--space-xl)' : 
                    gap === 'lg' ? 'var(--space-lg)' : 
                    gap === 'md' ? 'var(--space-md)' : 'var(--space-lg)';

    // Create grid template areas string
    const gridTemplateAreas = areas
      .map((row: string[]) => `"${row.join(' ')}"`)
      .join(' ');

    return (
      <Section key={sectionKey} id={sectionKey} sectionKey={sectionKey} height="auto" {...props}>
        <Container height="auto" useMediaWidth={false}>
          <Box
            style={{
              display: 'grid',
              gridTemplateAreas,
              gridTemplateColumns: columns || '1fr 1fr',
              gap: gapSize,
            }}
          >
            {/* Render each grid area */}
            {Object.entries(slots || {}).map(([areaName, patternKeys]) => (
              <Box
                key={areaName}
                style={{ gridArea: areaName }}
              >
                {Array.isArray(patternKeys) && (patternKeys as string[]).length > 1 ? (
                  // Multiple patterns in same area = VStack
                  <VStack spacing="md" align="start">
                    {(patternKeys as string[]).map(key => renderPattern(patterns[key], key, sectionKey))}
                  </VStack>
                ) : (
                  // Single pattern
                  (patternKeys as string[]).map(key => renderPattern(patterns[key], key, sectionKey))
                )}
              </Box>
            ))}
          </Box>
        </Container>
      </Section>
    );
  }

  // Fallback to vertical if unknown layout
  const patternOrder = sectionData.order || Object.keys(patterns);
  return (
    <Section key={sectionKey} id={sectionKey} sectionKey={sectionKey} height="auto" {...props}>
      {patternOrder.map(key => renderPattern(patterns[key], key, sectionKey))}
    </Section>
  );
}

/**
 * Main component that renders all sections based on sectionOrder
 */
export function Sections({ 
  sections, 
  order
}: SectionsProps) {
  return (
    <>
      {order
        .map((sectionKey: string) => {
          const sectionData = sections[sectionKey];
          if (!sectionData) return null;
          
          return renderSection(sectionData, sectionKey);
        })
        .filter(Boolean)}
    </>
  );
}

