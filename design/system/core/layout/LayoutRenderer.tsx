// ===============================================
// Layout Renderer
// Orchestrates section layout based on LayoutConfig
// ===============================================

'use client';

import React from 'react';
import { VStack } from '../../components/layout/vStack/VStack';
import { Box } from '../../components/layout/box/Box';
import { Container } from '../../components/frames/container/Container';
import { LayoutConfig } from './types';
import { PatternNode } from '../types/nodes';
import { renderPattern, renderPatternDirect } from '../render/patterns';
import { actionsRegistry } from '../../patterns/actions/registry';

import { AnimationConfig } from '../animations/types';

interface LayoutRendererProps {
  layout?: LayoutConfig;
  patterns: Record<string, PatternNode>;
  order: string[];
  sectionKey: string;
  sectionAnimation?: AnimationConfig;
}

/**
 * LayoutRenderer - Renders section patterns according to layout rules
 * 
 * Layout Logic:
 * 1. alignSectionHeader = 'center' (default):
 *    - All patterns stacked vertically in one VStack
 *    - ButtonGroup in same VStack as SectionHeader (unless distanceAction)
 * 
 * 2. alignSectionHeader = 'left' or 'right':
 *    - Opens up split layout possibility
 *    - SectionHeader + ButtonGroup (default) in first column
 *    - secondColumn patterns in second column
 *    - Remaining patterns below split
 * 
 * 3. distanceAction = true:
 *    - ButtonGroup moved to bottom of section (after all patterns)
 */
export function LayoutRenderer({ 
  layout, 
  patterns, 
  order,
  sectionKey,
  sectionAnimation
}: LayoutRendererProps) {
  
  const {
    alignSectionHeader = 'center',
    secondColumn = [],
    distanceAction = false,
    gap = 'xl',
    ratio = '1:1',
    verticalAlign = 'center', // Default to center for better visual balance
    stackAt = 'desktop', // Default to 1024px breakpoint
    mobileOrder,
    mobileAlign,
    mobileGap,
  } = layout || {};

  // ===== FIND SPECIAL PATTERNS =====
  // Helper to check if a pattern is an action pattern
  const isActionPattern = (patternType: string) => {
    return patternType in actionsRegistry;
  };

  const sectionHeaderKey = order.find(key => patterns[key]?.type === 'sectionHeader');
  
  // Find all action patterns (buttonGroup, form, gridForm, inputGroup, etc.)
  const actionPatternKeys = order.filter(key => {
    const pattern = patterns[key];
    return pattern && isActionPattern(pattern.type);
  });
  
  // Check if any action patterns should be in secondColumn
  const actionPatternsInSecondColumn = actionPatternKeys.filter(key => secondColumn.includes(key));
  
  // Action patterns that should be grouped with SectionHeader (not in secondColumn, not distanced)
  const actionPatternsWithHeader = actionPatternKeys.filter(key => 
    !secondColumn.includes(key) && !distanceAction
  );
  
  // Action patterns that should be distanced (at bottom)
  const distancedActionPatterns = distanceAction ? actionPatternKeys.filter(key => 
    !secondColumn.includes(key)
  ) : [];
  
  // Get remaining patterns (exclude sectionHeader and action patterns that aren't in secondColumn)
  const otherPatternKeys = order.filter(
    key => key !== sectionHeaderKey && !actionPatternKeys.includes(key)
  );
  
  // Separate secondColumn patterns from other patterns
  // Include action patterns that are explicitly in secondColumn
  const secondColumnPatterns = [
    ...otherPatternKeys.filter(key => secondColumn.includes(key)),
    ...actionPatternsInSecondColumn
  ];
  
  const remainingPatterns = otherPatternKeys.filter(key => 
    !secondColumn.includes(key)
  );

  // ===== LAYOUT CONTEXT =====
  // Helper to get opposite alignment for secondColumn patterns
  const getOppositeAlign = (align: 'left' | 'center' | 'right'): 'left' | 'center' | 'right' => {
    if (align === 'left') return 'right';
    if (align === 'right') return 'left';
    return 'center'; // center stays center
  };

  // Pass layout alignment to patterns so they can inherit it
  const layoutContext = {
    alignSectionHeader,
    isInSecondColumn: false,
    verticalAlign,
    sectionAnimation,
  };

  // Context specifically for SectionHeader (uses 'left' when alignSectionHeader is 'right')
  const sectionHeaderContext = {
    alignSectionHeader: alignSectionHeader === 'right' ? 'left' : alignSectionHeader,
    isInSecondColumn: false,
    verticalAlign,
    sectionAnimation,
  };

  // Context for patterns in the second column (uses opposite alignment by default)
  const secondColumnContext = {
    alignSectionHeader: getOppositeAlign(alignSectionHeader),
    isInSecondColumn: true,
    verticalAlign,
    sectionAnimation,
  };

  // Check if second column contains only media patterns (for stretch behavior)
  const isSecondColumnMediaOnly = secondColumnPatterns.length > 0 &&
    secondColumnPatterns.every(key => patterns[key]?.type === 'media');

  // ===== HELPER FUNCTIONS =====
  // Map alignSectionHeader to VStack align prop
  const getVStackAlign = () => {
    if (alignSectionHeader === 'left') return 'start';
    if (alignSectionHeader === 'right') return 'end';
    return 'center';
  };
  const vstackAlign = getVStackAlign();

  const renderPatterns = (keys: string[], context = layoutContext) => {
    return keys
      .map(key => renderPattern(patterns[key], key, sectionKey, context))
      .filter(Boolean);
  };

  // Column ratio mapping to CSS grid columns
  const ratioMap: Record<string, string> = {
    '1:1': '1fr 1fr',
    '1:2': '1fr 2fr',
    '2:1': '2fr 1fr',
    '2:3': '2fr 3fr',
    '3:2': '3fr 2fr',
  };

  // Breakpoint mapping
  const breakpointMap: Record<string, string> = {
    'tablet': '768px',
    'desktop': '1024px',
  };
  const stackBreakpoint = breakpointMap[stackAt];

  // Mobile alignment (defaults to alignSectionHeader)
  const mobileAlignValue = mobileAlign || alignSectionHeader;
  const getMobileVStackAlign = () => {
    if (mobileAlignValue === 'left') return 'start';
    if (mobileAlignValue === 'right') return 'end';
    return 'center';
  };
  const mobileVstackAlign = getMobileVStackAlign();

  // Mobile gap (defaults to main gap)
  const mobileGapValue = mobileGap || gap;

  // Generate unique ID for CSS scoping
  const layoutId = `layout-${sectionKey}`;

  // Build mobile order for stacked layout
  // When stacked, we need to render all patterns in the mobile order
  const getMobilePatternOrder = () => {
    if (mobileOrder && mobileOrder.length > 0) {
      return mobileOrder;
    }
    // Default: SectionHeader first, then action patterns (if not distanced), then secondColumn, then remaining, then distanced actions
    const defaultOrder: string[] = [];
    if (sectionHeaderKey) defaultOrder.push(sectionHeaderKey);
    // Add action patterns after sectionHeader if not distanced and not in secondColumn
    defaultOrder.push(...actionPatternsWithHeader);
    // Add secondColumn patterns
    defaultOrder.push(...secondColumnPatterns);
    // Add remaining patterns
    defaultOrder.push(...remainingPatterns);
    // Add distanced action patterns at end
    defaultOrder.push(...distancedActionPatterns);
    return defaultOrder;
  };

  // ===== CENTERED LAYOUT (Default) =====
  // No split, everything stacked vertically
  if (alignSectionHeader === 'center') {
    // Get SectionHeader maxWidth if it exists
    const sectionHeaderMaxWidth = sectionHeaderKey ? patterns[sectionHeaderKey]?.props?.maxWidth || '650px' : '650px';
    
    return (
      <VStack spacing="none" align="center">
        {/* SectionHeader + Action Patterns together in one Container with shared VStack */}
        {(sectionHeaderKey || actionPatternsWithHeader.length > 0) && (
          <Container height="auto">
            <Box style={{ maxWidth: sectionHeaderMaxWidth, margin: '0 auto', width: '100%' }}>
              <VStack spacing="lg" align="center">
                {sectionHeaderKey && renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, sectionHeaderContext)}
                {actionPatternsWithHeader.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext))}
              </VStack>
            </Box>
          </Container>
        )}
        {renderPatterns(otherPatternKeys)}
        {renderPatterns(actionPatternsInSecondColumn)}
        {distancedActionPatterns.length > 0 && (
          <Box style={{ maxWidth: 'var(--width-container)', margin: '0 auto', width: '100%' }}>
            {distancedActionPatterns.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext))}
          </Box>
        )}
      </VStack>
    );
  }

  // ===== SPLIT LAYOUT (Left or Right aligned SectionHeader) =====
  // Split layout is active when secondColumn array exists (even if empty)
  const hasSecondColumnDefined = secondColumn && secondColumn.length >= 0;
  
  // If no secondColumn defined at all, simple aligned layout
  if (!hasSecondColumnDefined) {
    // Get SectionHeader maxWidth and align if it exists
    const sectionHeaderMaxWidth = sectionHeaderKey ? patterns[sectionHeaderKey]?.props?.maxWidth || '650px' : '650px';
    const sectionHeaderAlign = sectionHeaderKey ? patterns[sectionHeaderKey]?.props?.align : undefined;
    const effectiveAlign = sectionHeaderAlign || (alignSectionHeader === 'left' ? 'start' : 'end');
    const marginValue = effectiveAlign === 'center' ? '0 auto' : effectiveAlign === 'end' ? '0 0 0 auto' : '0 auto 0 0';
    
    return (
      <VStack spacing="none" align={alignSectionHeader === 'left' ? 'start' : 'end'}>
        {/* SectionHeader + Action Patterns together in one Container with shared VStack */}
        {(sectionHeaderKey || actionPatternsWithHeader.length > 0) && (
          <Container height="auto">
            <Box style={{ maxWidth: sectionHeaderMaxWidth, margin: marginValue, width: '100%' }}>
              <VStack spacing="lg" align="start">
                {sectionHeaderKey && renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, sectionHeaderContext)}
                {actionPatternsWithHeader.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext))}
              </VStack>
            </Box>
          </Container>
        )}
        {renderPatterns(remainingPatterns)}
        {distancedActionPatterns.length > 0 && (
          <Box style={{ maxWidth: 'var(--width-container)', margin: '0 auto', width: '100%' }}>
            {distancedActionPatterns.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext))}
          </Box>
        )}
      </VStack>
    );
  }

  // ===== SPLIT LAYOUT WITH SECOND COLUMN (even if empty) =====
  
  // Determine which column SectionHeader should be in based on alignSectionHeader
  const isSectionHeaderInRightColumn = alignSectionHeader === 'right';

  // Get SectionHeader maxWidth and align if it exists  
  const sectionHeaderMaxWidth = sectionHeaderKey ? patterns[sectionHeaderKey]?.props?.maxWidth || '650px' : '650px';
  const sectionHeaderAlign = sectionHeaderKey ? patterns[sectionHeaderKey]?.props?.align : undefined;
  const effectiveAlign = sectionHeaderAlign || 'start';
  const marginValue = effectiveAlign === 'center' ? '0 auto' : effectiveAlign === 'end' ? '0 0 0 auto' : '0 auto 0 0';

  // Get mobile pattern order for stacked view
  const mobilePatternOrder = getMobilePatternOrder();

  // Context for mobile stacked view (uses mobileAlign)
  const mobileLayoutContext = {
    alignSectionHeader: mobileAlignValue,
    isInSecondColumn: false,
    verticalAlign,
    sectionAnimation,
  };

  return (
    <>
      <style>{`
        #${layoutId} .split-grid {
          display: grid;
          grid-template-columns: ${ratioMap[ratio]};
          gap: var(--space-${gap});
          align-items: ${verticalAlign};
          ${isSecondColumnMediaOnly ? 'grid-auto-rows: 1fr;' : ''}
        }
        
        #${layoutId} .media-column {
          min-height: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        #${layoutId} .mobile-stack {
          display: none;
        }

        #${layoutId} .desktop-only {
          display: block;
        }

        @media (max-width: ${stackBreakpoint}) {
          #${layoutId} .split-grid {
            display: none !important;
          }
          #${layoutId} .mobile-stack {
            display: flex !important;
          }
          #${layoutId} .desktop-only {
            display: none !important;
          }
        }
      `}</style>

      <Box
        id={layoutId}
        style={{
          maxWidth: 'var(--width-container)',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* Desktop: Split Grid - Two Columns */}
        <Box className="split-grid section-split-layout">
          {/* Left Column */}
          {isSectionHeaderInRightColumn ? (
            // When SectionHeader is on right, left column has secondColumn patterns
            isSecondColumnMediaOnly ? (
              <Box className="media-column">
                {renderPatterns(secondColumnPatterns, secondColumnContext)}
              </Box>
            ) : (
              <VStack spacing="none" align="start" justify="center">
                {renderPatterns(secondColumnPatterns, secondColumnContext)}
              </VStack>
            )
          ) : (
            <Container height="auto">
              <Box style={{ maxWidth: sectionHeaderMaxWidth, margin: marginValue, width: '100%' }}>
                <VStack spacing="lg" align="start">
                  {sectionHeaderKey && renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, sectionHeaderContext)}
                  {actionPatternsWithHeader.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext))}
                </VStack>
              </Box>
            </Container>
          )}

          {isSectionHeaderInRightColumn ? (
            <Container height="auto">
              <Box style={{ maxWidth: sectionHeaderMaxWidth, margin: marginValue, width: '100%' }}>
                <VStack spacing="lg" align="start">
                  {sectionHeaderKey && renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, sectionHeaderContext)}
                  {actionPatternsWithHeader.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext))}
                </VStack>
              </Box>
            </Container>
          ) : (
            // When SectionHeader is on left, right column has secondColumn patterns
            isSecondColumnMediaOnly ? (
              <Box className="media-column">
                {renderPatterns(secondColumnPatterns, secondColumnContext)}
              </Box>
            ) : (
              <VStack spacing="none" align="end" justify="end">
                {renderPatterns(secondColumnPatterns, secondColumnContext)}
              </VStack>
            )
          )}
        </Box>

        {/* Mobile: Stacked single column */}
        <Box className="mobile-stack">
          <VStack spacing="none" align={mobileVstackAlign}>
            {mobilePatternOrder.map(key => {
              const pattern = patterns[key];
              if (!pattern) return null;

              // Use mobile layout context for all patterns when stacked
              return renderPattern(pattern, key, sectionKey, mobileLayoutContext);
            })}
          </VStack>
        </Box>

        {/* Below Split: All remaining patterns with their own containers - Only on desktop */}
        {remainingPatterns.length > 0 && (
          <Box className="desktop-only">
            <VStack spacing="none" align="center">
              {renderPatterns(remainingPatterns)}
            </VStack>
          </Box>
        )}
        
        {/* Action patterns at bottom (if distanced) with width-container - Only on desktop */}
        {distancedActionPatterns.length > 0 && (
          <Box className="desktop-only" style={{ maxWidth: 'var(--width-container)', margin: '0 auto', width: '100%' }}>
            {distancedActionPatterns.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext))}
          </Box>
        )}
      </Box>
    </>
  );
}

