// ===============================================
// Layout Renderer
// Orchestrates section layout based on LayoutConfig
// ===============================================

'use client';

import React from 'react';
import { Container } from '../../components/frames/container/Container';
import { VStack } from '../../components/layout/vStack/VStack';
import { Box } from '../../components/layout/box/Box';
import { LayoutConfig } from './types';
import { PatternNode } from '../types/nodes';
import { renderPattern, renderPatternDirect } from '../render/patterns';

interface LayoutRendererProps {
  layout?: LayoutConfig;
  patterns: Record<string, PatternNode>;
  order: string[];
  sectionKey: string;
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
  sectionKey 
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
  const sectionHeaderKey = order.find(key => patterns[key]?.type === 'sectionHeader');
  const buttonGroupKey = order.find(key => patterns[key]?.type === 'buttonGroup');
  
  // Check if ButtonGroup should be in secondColumn
  const isButtonGroupInSecondColumn = buttonGroupKey && secondColumn.includes(buttonGroupKey);
  
  // Get remaining patterns (exclude sectionHeader, and buttonGroup only if NOT in secondColumn)
  const otherPatternKeys = order.filter(
    key => key !== sectionHeaderKey && (key !== buttonGroupKey || isButtonGroupInSecondColumn)
  );
  
  // Separate secondColumn patterns from other patterns
  // IMPORTANT: If distanceAction is true, buttonGroup should NOT be in secondColumn 
  // (it will be rendered distanced at the bottom instead)
  const secondColumnPatterns = otherPatternKeys.filter(key => 
    secondColumn.includes(key) && !(key === buttonGroupKey && distanceAction)
  );
  const remainingPatterns = otherPatternKeys.filter(key => 
    !secondColumn.includes(key)
  );

  // ===== LAYOUT CONTEXT =====
  // Pass layout alignment to patterns so they can inherit it
  const layoutContext = {
    alignSectionHeader,
    isInSecondColumn: false,
    verticalAlign,
  };

  // Context for patterns in the second column
  const secondColumnContext = {
    alignSectionHeader,
    isInSecondColumn: true,
    verticalAlign,
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
    // Default: SectionHeader first, then secondColumn patterns, then remaining, then ButtonGroup (if distanced)
    const defaultOrder: string[] = [];
    if (sectionHeaderKey) defaultOrder.push(sectionHeaderKey);
    // Add buttonGroup after sectionHeader if not distanced and not in secondColumn
    if (buttonGroupKey && !distanceAction && !isButtonGroupInSecondColumn) {
      defaultOrder.push(buttonGroupKey);
    }
    // Add secondColumn patterns
    defaultOrder.push(...secondColumnPatterns);
    // Add remaining patterns
    defaultOrder.push(...remainingPatterns);
    // Add buttonGroup at end if distanced
    if (buttonGroupKey && distanceAction) defaultOrder.push(buttonGroupKey);
    return defaultOrder;
  };

  // ===== CENTERED LAYOUT (Default) =====
  // No split, everything stacked vertically
  if (alignSectionHeader === 'center') {
    // If distanceAction, separate last pattern to share container with ButtonGroup
    const patternsBeforeLast = distanceAction && buttonGroupKey && otherPatternKeys.length > 0 
      ? otherPatternKeys.slice(0, -1) 
      : otherPatternKeys;
    const lastPattern = distanceAction && buttonGroupKey && otherPatternKeys.length > 0 
      ? otherPatternKeys[otherPatternKeys.length - 1] 
      : null;

    return (
      <VStack spacing={gap} align="center">
        {/* SectionHeader + ButtonGroup in their own container */}
        {(sectionHeaderKey || (buttonGroupKey && !distanceAction)) && (
          <Container height="auto">
            <VStack spacing="lg" align="center">
              {sectionHeaderKey && (
                <Box data-pattern-key={sectionHeaderKey}>
                  {renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, layoutContext)}
                </Box>
              )}
              {buttonGroupKey && !distanceAction && (
                <Box data-pattern-key={buttonGroupKey}>
                  {renderPatternDirect(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
                </Box>
              )}
            </VStack>
          </Container>
        )}
        
        {/* Other patterns (except last if distanceAction) with their own containers */}
        {renderPatterns(patternsBeforeLast)}
        
        {/* Last pattern + ButtonGroup (if distanced) in same container */}
        {buttonGroupKey && distanceAction && lastPattern && (
          <Container height="auto">
            <VStack spacing="lg" align="center">
              <Box data-pattern-key={lastPattern}>
                {renderPatternDirect(patterns[lastPattern], lastPattern, sectionKey, layoutContext)}
              </Box>
              <Box data-pattern-key={buttonGroupKey}>
                {renderPatternDirect(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
              </Box>
            </VStack>
          </Container>
        )}
        
        {/* ButtonGroup alone if no other patterns */}
        {buttonGroupKey && distanceAction && !lastPattern && renderPattern(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
      </VStack>
    );
  }

  // ===== SPLIT LAYOUT (Left or Right aligned SectionHeader) =====
  // Split layout is active when secondColumn array exists (even if empty)
  const hasSecondColumnDefined = secondColumn && secondColumn.length >= 0;
  
  // If no secondColumn defined at all, simple aligned layout
  if (!hasSecondColumnDefined) {
    // If distanceAction, separate last pattern to share container with ButtonGroup
    const patternsBeforeLast = distanceAction && buttonGroupKey && remainingPatterns.length > 0 
      ? remainingPatterns.slice(0, -1) 
      : remainingPatterns;
    const lastPattern = distanceAction && buttonGroupKey && remainingPatterns.length > 0 
      ? remainingPatterns[remainingPatterns.length - 1] 
      : null;

    return (
      <VStack spacing={gap} align={alignSectionHeader === 'left' ? 'start' : 'end'}>
        {/* SectionHeader + ButtonGroup in their own container */}
        {(sectionHeaderKey || (buttonGroupKey && !distanceAction && !isButtonGroupInSecondColumn)) && (
          <Container height="auto">
            <VStack spacing="lg" align="start">
              {sectionHeaderKey && (
                <Box data-pattern-key={sectionHeaderKey}>
                  {renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, layoutContext)}
                </Box>
              )}
              {buttonGroupKey && !distanceAction && !isButtonGroupInSecondColumn && (
                <Box data-pattern-key={buttonGroupKey}>
                  {renderPatternDirect(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
                </Box>
              )}
            </VStack>
          </Container>
        )}
        
        {/* Other patterns (except last if distanceAction) with their own containers */}
        {renderPatterns(patternsBeforeLast)}
        
        {/* Last pattern + ButtonGroup (if distanced) in same container */}
        {buttonGroupKey && distanceAction && lastPattern && (
          <Container height="auto">
            <VStack spacing="lg" align="center">
              <Box data-pattern-key={lastPattern}>
                {renderPatternDirect(patterns[lastPattern], lastPattern, sectionKey, layoutContext)}
              </Box>
              <Box data-pattern-key={buttonGroupKey}>
                {renderPatternDirect(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
              </Box>
            </VStack>
          </Container>
        )}
        
        {/* ButtonGroup alone if no other patterns */}
        {buttonGroupKey && distanceAction && !lastPattern && renderPattern(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
      </VStack>
    );
  }

  // ===== SPLIT LAYOUT WITH SECOND COLUMN (even if empty) =====
  // If distanceAction, separate last pattern to share container with ButtonGroup
  const patternsBeforeLast = distanceAction && buttonGroupKey && remainingPatterns.length > 0 
    ? remainingPatterns.slice(0, -1) 
    : remainingPatterns;
  const lastPattern = distanceAction && buttonGroupKey && remainingPatterns.length > 0 
    ? remainingPatterns[remainingPatterns.length - 1] 
    : null;
  
  // Determine which column SectionHeader should be in based on alignSectionHeader
  const isSectionHeaderInRightColumn = alignSectionHeader === 'right';

  // Get mobile pattern order for stacked view
  const mobilePatternOrder = getMobilePatternOrder();

  // Context for mobile stacked view (uses mobileAlign)
  const mobileLayoutContext = {
    alignSectionHeader: mobileAlignValue,
    isInSecondColumn: false,
    verticalAlign,
  };

  return (
    <VStack spacing={gap}>
      {/* Responsive CSS for this specific layout - all styles scoped to layoutId */}
      <style>{`
        #${layoutId} .split-grid {
          display: grid;
          grid-template-columns: ${ratioMap[ratio]};
          gap: var(--space-${gap});
          align-items: ${verticalAlign};
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
              <Box style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
                {renderPatterns(secondColumnPatterns, secondColumnContext)}
              </Box>
            ) : (
              <VStack spacing="lg" align="start" justify="center">
                {renderPatterns(secondColumnPatterns, secondColumnContext)}
              </VStack>
            )
          ) : (
            // When SectionHeader is on left, left column has SectionHeader + ButtonGroup
            <Box>
              {(sectionHeaderKey || (buttonGroupKey && !distanceAction && !isButtonGroupInSecondColumn)) && (
                <Container height="auto">
                  <VStack spacing="lg" align="start">
                    {sectionHeaderKey && (
                      <Box data-pattern-key={sectionHeaderKey}>
                        {renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, layoutContext)}
                      </Box>
                    )}
                    {buttonGroupKey && !distanceAction && !isButtonGroupInSecondColumn && (
                      <Box data-pattern-key={buttonGroupKey}>
                        {renderPatternDirect(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
                      </Box>
                    )}
                  </VStack>
                </Container>
              )}
            </Box>
          )}

          {/* Right Column */}
          {isSectionHeaderInRightColumn ? (
            // When SectionHeader is on right, right column has SectionHeader + ButtonGroup
            <Box>
              {(sectionHeaderKey || (buttonGroupKey && !distanceAction && !isButtonGroupInSecondColumn)) && (
                <Container height="auto">
                  <VStack spacing="lg" align="start">
                    {sectionHeaderKey && (
                      <Box data-pattern-key={sectionHeaderKey}>
                        {renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, layoutContext)}
                      </Box>
                    )}
                    {buttonGroupKey && !distanceAction && !isButtonGroupInSecondColumn && (
                      <Box data-pattern-key={buttonGroupKey}>
                        {renderPatternDirect(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
                      </Box>
                    )}
                  </VStack>
                </Container>
              )}
            </Box>
          ) : (
            // When SectionHeader is on left, right column has secondColumn patterns
            isSecondColumnMediaOnly ? (
              <Box style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
                {renderPatterns(secondColumnPatterns, secondColumnContext)}
              </Box>
            ) : (
              <VStack spacing="lg" align="end" justify="end">
                {renderPatterns(secondColumnPatterns, secondColumnContext)}
              </VStack>
            )
          )}
        </Box>

        {/* Mobile: Stacked single column */}
        <Box className="mobile-stack">
          <VStack spacing={mobileGapValue} align={mobileVstackAlign}>
            {mobilePatternOrder.map(key => {
              const pattern = patterns[key];
              if (!pattern) return null;

              // Use mobile layout context for all patterns when stacked
              return renderPattern(pattern, key, sectionKey, mobileLayoutContext);
            })}
          </VStack>
        </Box>
      </Box>
      
      {/* Below Split: Remaining patterns (full width, except last if distanceAction) - Only on desktop */}
      {patternsBeforeLast.length > 0 && (
        <Box className="desktop-only">
          <VStack spacing="lg" align="center">
            {renderPatterns(patternsBeforeLast)}
          </VStack>
        </Box>
      )}
      
      {/* Last pattern + ButtonGroup (if distanced) in same container - Only on desktop */}
      {buttonGroupKey && distanceAction && lastPattern && (
        <Box className="desktop-only">
          <Container height="auto">
            <VStack spacing="lg" align="center">
              <Box data-pattern-key={lastPattern}>
                {renderPatternDirect(patterns[lastPattern], lastPattern, sectionKey, layoutContext)}
              </Box>
              <Box data-pattern-key={buttonGroupKey}>
                {renderPatternDirect(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
              </Box>
            </VStack>
          </Container>
        </Box>
      )}
      
      {/* ButtonGroup alone if no other patterns - Only on desktop */}
      {buttonGroupKey && distanceAction && !lastPattern && (
        <Box className="desktop-only">
          {renderPattern(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
        </Box>
      )}
    </VStack>
  );
}

