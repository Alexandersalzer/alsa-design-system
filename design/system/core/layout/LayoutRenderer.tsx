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
  const secondColumnPatterns = otherPatternKeys.filter(key => 
    secondColumn.includes(key)
  );
  const remainingPatterns = otherPatternKeys.filter(key => 
    !secondColumn.includes(key)
  );

  // ===== LAYOUT CONTEXT =====
  // Pass layout alignment to patterns so they can inherit it
  const layoutContext = {
    alignSectionHeader,
  };

  // ===== HELPER FUNCTIONS =====
  const renderPatterns = (keys: string[]) => {
    return keys
      .map(key => renderPattern(patterns[key], key, sectionKey, layoutContext))
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
        {sectionHeaderKey && (
          <Container height="auto">
            <VStack spacing="lg" align="center">
              {renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, layoutContext)}
              {buttonGroupKey && !distanceAction && renderPatternDirect(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
            </VStack>
          </Container>
        )}
        
        {/* Other patterns (except last if distanceAction) with their own containers */}
        {renderPatterns(patternsBeforeLast)}
        
        {/* Last pattern + ButtonGroup (if distanced) in same container */}
        {buttonGroupKey && distanceAction && lastPattern && (
          <Container height="auto">
            <VStack spacing="lg" align="center">
              {renderPatternDirect(patterns[lastPattern], lastPattern, sectionKey, layoutContext)}
              {renderPatternDirect(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
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
        {sectionHeaderKey && (
          <Container height="auto">
            <VStack spacing="lg" align="start">
              {renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, layoutContext)}
              {buttonGroupKey && !distanceAction && !isButtonGroupInSecondColumn && renderPatternDirect(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
            </VStack>
          </Container>
        )}
        
        {/* Other patterns (except last if distanceAction) with their own containers */}
        {renderPatterns(patternsBeforeLast)}
        
        {/* Last pattern + ButtonGroup (if distanced) in same container */}
        {buttonGroupKey && distanceAction && lastPattern && (
          <Container height="auto">
            <VStack spacing="lg" align="center">
              {renderPatternDirect(patterns[lastPattern], lastPattern, sectionKey, layoutContext)}
              {renderPatternDirect(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
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

  return (
    <VStack spacing={gap}>
      {/* Split Grid - Two Columns */}
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: ratioMap[ratio],
          gap: `var(--space-${gap})`,
          alignItems: verticalAlign,
        }}
        className="section-split-layout"
      >
        {/* First Column: SectionHeader + ButtonGroup in their own container */}
        <Box>
          {sectionHeaderKey && (
            <Container height="auto">
              <VStack spacing="lg" align="start">
                {renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, layoutContext)}
                {buttonGroupKey && !distanceAction && !isButtonGroupInSecondColumn && renderPatternDirect(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
              </VStack>
            </Container>
          )}
        </Box>
        
        {/* Second Column: Patterns from secondColumn array (can be empty) */}
        <VStack spacing="lg" align="start">
          {renderPatterns(secondColumnPatterns)}
        </VStack>
      </Box>
      
      {/* Below Split: Remaining patterns (full width, except last if distanceAction) */}
      {patternsBeforeLast.length > 0 && (
        <VStack spacing="lg" align="center">
          {renderPatterns(patternsBeforeLast)}
        </VStack>
      )}
      
      {/* Last pattern + ButtonGroup (if distanced) in same container */}
      {buttonGroupKey && distanceAction && lastPattern && (
        <Container height="auto">
          <VStack spacing="lg" align="center">
            {renderPatternDirect(patterns[lastPattern], lastPattern, sectionKey, layoutContext)}
            {renderPatternDirect(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
          </VStack>
        </Container>
      )}
      
      {/* ButtonGroup alone if no other patterns */}
      {buttonGroupKey && distanceAction && !lastPattern && renderPattern(patterns[buttonGroupKey], buttonGroupKey, sectionKey, layoutContext)}
    </VStack>
  );
}
