// ===============================================
// Section Layout Renderer
// Orchestrates section layout based on LayoutConfig
// ===============================================

'use client';

import React from 'react';
import { VStack } from '../../components/layout/vStack/VStack';
import { Box } from '../../components/layout/box/Box';
import { Container } from '../../components/frames/container/Container';
import { Card } from '../../components/layout/Card/Card';
import { LayoutConfig } from '../types/layout';
import { PatternNode } from '../types/nodes';
import { renderPattern, renderPatternDirect } from './patterns';
import { renderBackgroundComponent } from './background';
import { actionsRegistry } from '../../patterns/actions/registry';
import { AnimationConfig } from '../../components/animations/types';
import type { BackgroundProps } from '../../components/backgrounds/types';

interface SectionLayoutProps {
  layout?: LayoutConfig;
  patterns: Record<string, PatternNode>;
  order: string[];
  sectionKey: string;
  sectionAnimation?: AnimationConfig;
  sectionProps?: Record<string, any>; // Section props (may contain background)
  locale?: string;
}

/**
 * renderSectionLayout - Renders section patterns according to layout rules
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
 * 
 * 4. wrapInCard = true with section background:
 *    - When wrapInCard is enabled AND section has background props,
 *    - Background is moved from Section to Card wrapper
 */
export function renderSectionLayout({ 
  layout, 
  patterns, 
  order,
  sectionKey,
  sectionAnimation,
  sectionProps,
  locale
}: SectionLayoutProps) {
  
  const {
    alignSectionHeader = 'center',
    firstColumn = [],
    secondColumn = [],
    secondColumnAsMedia,
    distanceAction = false,
    gap = 'xl',
    ratio = '1:1',
    verticalAlign = 'center', // Default to center for better visual balance
    sectionHeaderVerticalAlign = 'start', // Default to start for sectionHeader alignment
    stackAt = 'desktop', // Default to 1024px breakpoint
    mobileOrder,
    mobileAlign,
    mobileGap,
    wrapInCard = false,
    cardVariant = 'raised',
    cardPadding = 'lg',
    cardRadius = 'lg',
    cardBackground,
    cardBackgroundSettings = {},
    cardBorderStyle = 'none',
    cardColumnVerticalAlign,
  } = layout || {};

  // När wrapInCard: samma vertikala alignment för båda kolumnerna (default center så det inte sitter i hörnet)
  const effectiveCardColumnAlign =
    wrapInCard ? (cardColumnVerticalAlign ?? 'center') : null;
  const cardColumnAlignCss =
    effectiveCardColumnAlign === 'start'
      ? 'flex-start'
      : effectiveCardColumnAlign === 'end'
        ? 'flex-end'
        : 'center';

  // ===== FIND SPECIAL PATTERNS =====
  // Action patterns have type === 'action' (explicit in JSON)
  const isActionPattern = (patternType: string) => patternType === 'action';

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
  
  // Separate firstColumn and secondColumn patterns from other patterns
  // Include action patterns that are explicitly in secondColumn
  const firstColumnPatterns = otherPatternKeys.filter(key => 
    firstColumn.includes(key) && !secondColumn.includes(key)
  );
  
  const secondColumnPatterns = [
    ...otherPatternKeys.filter(key => secondColumn.includes(key)),
    ...actionPatternsInSecondColumn
  ];
  
  const remainingPatterns = otherPatternKeys.filter(key => 
    !secondColumn.includes(key) && !firstColumn.includes(key)
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
  const derivedSecondColumnMediaOnly = secondColumnPatterns.length > 0 &&
    secondColumnPatterns.every(key => patterns[key]?.type === 'media');
  // Explicit prop overrides: när satt styrs mediakolumn-layout utan att bryta befintliga sidor
  const isSecondColumnMediaOnly = typeof secondColumnAsMedia === 'boolean'
    ? secondColumnAsMedia
    : derivedSecondColumnMediaOnly;

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
      .map(key => renderPattern(patterns[key], key, sectionKey, context, locale))
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
    // Default: SectionHeader first, then action patterns (if not distanced), then firstColumn, then secondColumn, then remaining, then distanced actions
    const defaultOrder: string[] = [];
    if (sectionHeaderKey) defaultOrder.push(sectionHeaderKey);
    // Add action patterns after sectionHeader if not distanced and not in secondColumn
    defaultOrder.push(...actionPatternsWithHeader);
    // Add firstColumn patterns
    defaultOrder.push(...firstColumnPatterns);
    // Add secondColumn patterns
    defaultOrder.push(...secondColumnPatterns);
    // Add remaining patterns
    defaultOrder.push(...remainingPatterns);
    // Add distanced action patterns at end
    defaultOrder.push(...distancedActionPatterns);
    return defaultOrder;
  };

  // Card padding mapping
  const cardPaddingToFoundationToken: Record<string, string> = {
    xs: '2',
    sm: '4',
    md: '6',
    lg: '8',
    xl: '10',
    '2xl': '12',
  };
  const cardPaddingToken =
    cardPadding && cardPadding !== 'none' ? cardPaddingToFoundationToken[cardPadding] ?? '8' : null;

  // ===== CENTERED LAYOUT (Default) =====
  // No split, everything stacked vertically
  if (alignSectionHeader === 'center') {
    // Get SectionHeader maxWidth if it exists
    const sectionHeaderMaxWidth = sectionHeaderKey ? patterns[sectionHeaderKey]?.props?.maxWidth || '650px' : '650px';
    
    const centeredContent = (
      <VStack spacing="none" align="center">
        {/* SectionHeader + Action Patterns together in one Container with shared VStack */}
        {(sectionHeaderKey || actionPatternsWithHeader.length > 0) && (
          <Container height="auto">
            <Box style={{ maxWidth: sectionHeaderMaxWidth, margin: '0 auto', width: '100%' }}>
              <VStack spacing="lg" align="center">
                {sectionHeaderKey && renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, sectionHeaderContext, locale)}
                {actionPatternsWithHeader.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext, locale))}
              </VStack>
            </Box>
          </Container>
        )}
        {renderPatterns(otherPatternKeys)}
        {renderPatterns(actionPatternsInSecondColumn)}
        {distancedActionPatterns.length > 0 && (
          <Container height="auto">
            <Box style={{ maxWidth: 'var(--width-container)', margin: '0 auto', width: '100%' }}>
              {distancedActionPatterns.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext, locale))}
            </Box>
          </Container>
        )}
      </VStack>
    );

    // Wrap in Card if enabled
    if (wrapInCard) {
      // Use section background if no explicit cardBackground is set
      const effectiveCardBackground = cardBackground || sectionProps?.background;
      const effectiveCardBackgroundSettings = cardBackground 
        ? cardBackgroundSettings 
        : sectionProps || {};
      
      const hasCardBackground = Boolean(effectiveCardBackground);
      const cardBackgroundProps: BackgroundProps = { 
        ...effectiveCardBackgroundSettings,
        background: effectiveCardBackground
      } as BackgroundProps;
      
      const cardBorderCss =
        cardBorderStyle === 'subtle'
          ? '1px solid var(--border-subtle)'
          : cardBorderStyle === 'solid'
            ? '2px solid var(--border-default)'
            : cardBorderStyle === 'accent'
              ? '1px solid var(--accent-500)'
              : undefined;

      if (hasCardBackground) {
        const cardBgLightOpacity = effectiveCardBackgroundSettings?.backgroundImageLightModeOpacity;
        return (
          <Container height="auto">
            <Card
              variant="ghost"
              padding="none"
              radius={cardRadius}
              data-card-has-image-bg="true"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden',
                background: 'transparent',
                ...(cardBorderCss && { border: cardBorderCss }),
              }}
            >
              <Box
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  ...(cardBgLightOpacity != null && {
                    ['--section-bg-image-light-opacity' as string]: String(cardBgLightOpacity),
                  }),
                }}
              >
                {renderBackgroundComponent(effectiveCardBackground as any, cardBackgroundProps)}
              </Box>
              <Box
                style={{
                  position: 'relative',
                  padding: cardPaddingToken ? `var(--foundation-space-${cardPaddingToken})` : 0,
                }}
              >
                {centeredContent}
              </Box>
            </Card>
          </Container>
        );
      }

      const cardPaddingForCard = (cardPadding === 'xl' || cardPadding === '2xl') ? 'lg' : cardPadding;
      return (
        <Container height="auto">
          <Card
            variant={cardVariant}
            padding={cardPaddingForCard}
            radius={cardRadius}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              ...(cardBorderCss && { border: cardBorderCss }),
            }}
          >
            {centeredContent}
          </Card>
        </Container>
      );
    }

    return centeredContent;
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
    
    const alignedContent = (
      <VStack spacing="none" align={alignSectionHeader === 'left' ? 'start' : 'end'}>
        {/* SectionHeader + Action Patterns together in one Container with shared VStack */}
        {(sectionHeaderKey || actionPatternsWithHeader.length > 0) && (
          <Container height="auto">
            <Box style={{ maxWidth: sectionHeaderMaxWidth, margin: marginValue, width: '100%' }}>
              <VStack spacing="lg" align="start">
                {sectionHeaderKey && renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, sectionHeaderContext, locale)}
                {actionPatternsWithHeader.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext, locale))}
              </VStack>
            </Box>
          </Container>
        )}
        {renderPatterns(remainingPatterns)}
        {distancedActionPatterns.length > 0 && (
          <Container height="auto">
            <Box style={{ maxWidth: 'var(--width-container)', margin: '0 auto', width: '100%' }}>
              {distancedActionPatterns.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext, locale))}
            </Box>
          </Container>
        )}
      </VStack>
    );

    // Wrap in Card if enabled
    if (wrapInCard) {
      // Use section background if no explicit cardBackground is set
      const effectiveCardBackground = cardBackground || sectionProps?.background;
      const effectiveCardBackgroundSettings = cardBackground 
        ? cardBackgroundSettings 
        : sectionProps || {};
      
      const hasCardBackground = Boolean(effectiveCardBackground);
      const cardBackgroundProps: BackgroundProps = { 
        ...effectiveCardBackgroundSettings,
        background: effectiveCardBackground
      } as BackgroundProps;
      
      const cardBorderCss =
        cardBorderStyle === 'subtle'
          ? '1px solid var(--border-subtle)'
          : cardBorderStyle === 'solid'
            ? '2px solid var(--border-default)'
            : cardBorderStyle === 'accent'
              ? '1px solid var(--accent-500)'
              : undefined;

      if (hasCardBackground) {
        const cardBgLightOpacity = effectiveCardBackgroundSettings?.backgroundImageLightModeOpacity;
        return (
          <Container height="auto">
            <Card
              variant="ghost"
              padding="none"
              radius={cardRadius}
              data-card-has-image-bg="true"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden',
                background: 'transparent',
                ...(cardBorderCss && { border: cardBorderCss }),
              }}
            >
              <Box
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  ...(cardBgLightOpacity != null && {
                    ['--section-bg-image-light-opacity' as string]: String(cardBgLightOpacity),
                  }),
                }}
              >
                {renderBackgroundComponent(effectiveCardBackground as any, cardBackgroundProps)}
              </Box>
              <Box
                style={{
                  position: 'relative',
                  padding: cardPaddingToken ? `var(--foundation-space-${cardPaddingToken})` : 0,
                }}
              >
                {alignedContent}
              </Box>
            </Card>
          </Container>
        );
      }

      const cardPaddingForCard = (cardPadding === 'xl' || cardPadding === '2xl') ? 'lg' : cardPadding;
      return (
        <Container height="auto">
          <Card
            variant={cardVariant}
            padding={cardPaddingForCard}
            radius={cardRadius}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              ...(cardBorderCss && { border: cardBorderCss }),
            }}
          >
            {alignedContent}
          </Card>
        </Container>
      );
    }

    return alignedContent;
  }

  // ===== SPLIT LAYOUT WITH SECOND COLUMN (even if empty) =====
  
  // Determine which column SectionHeader should be in based on alignSectionHeader
  const isSectionHeaderInRightColumn = alignSectionHeader === 'right';

  // Get SectionHeader maxWidth and align if it exists  
  const sectionHeaderMaxWidth = sectionHeaderKey ? patterns[sectionHeaderKey]?.props?.maxWidth || '650px' : '650px';
  const sectionHeaderAlign = sectionHeaderKey ? patterns[sectionHeaderKey]?.props?.align : undefined;
  const effectiveAlign = sectionHeaderAlign || 'start';
  const marginValue = effectiveAlign === 'center' ? '0 auto' : effectiveAlign === 'end' ? '0 0 0 auto' : '0 auto 0 0';

  // Layout cardPadding (xs/lg/xl) -> foundation numeric token (--foundation-space-2, -8, -10, etc.)
  // When wrapInCard: same inner padding for both columns so they align; use real foundation token so spacing to card edge works
  const columnInnerPadding =
    wrapInCard && cardPaddingToken
      ? { padding: `var(--foundation-space-${cardPaddingToken})` as const }
      : undefined;

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
          gap: ${wrapInCard && cardPaddingToken ? `var(--foundation-space-${cardPaddingToken})` : `var(--space-${gap})`};
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
          flex-direction: column;
          width: 100%;
          min-width: 0;
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
            flex-direction: column;
            width: 100%;
            min-width: 0;
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
        {(() => {
          const layoutContent = (
            <>
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
            <Box style={{ display: 'flex', alignItems: wrapInCard && cardColumnAlignCss ? cardColumnAlignCss : (sectionHeaderVerticalAlign === 'start' ? 'flex-start' : sectionHeaderVerticalAlign === 'end' ? 'flex-end' : 'center'), height: '100%' }}>
              {wrapInCard ? (
                <Box
                  style={{
                    ...columnInnerPadding,
                    maxWidth: sectionHeaderMaxWidth,
                    margin: marginValue,
                    width: '100%',
                  }}
                >
                  <VStack spacing="lg" align="start">
                    {sectionHeaderKey && renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, sectionHeaderContext, locale)}
                    {actionPatternsWithHeader.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext, locale))}
                    {firstColumnPatterns.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext, locale))}
                  </VStack>
                </Box>
              ) : (
                <Container height="auto">
                  <Box style={{ maxWidth: sectionHeaderMaxWidth, margin: marginValue, width: '100%' }}>
                    <VStack spacing="lg" align="start">
                      {sectionHeaderKey && renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, sectionHeaderContext, locale)}
                      {actionPatternsWithHeader.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext, locale))}
                      {firstColumnPatterns.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext, locale))}
                    </VStack>
                  </Box>
                </Container>
              )}
            </Box>
          )}

          {isSectionHeaderInRightColumn ? (
            <Box style={{ display: 'flex', alignItems: wrapInCard && cardColumnAlignCss ? cardColumnAlignCss : (sectionHeaderVerticalAlign === 'start' ? 'flex-start' : sectionHeaderVerticalAlign === 'end' ? 'flex-end' : 'center'), height: '100%' }}>
              {wrapInCard ? (
                <Box
                  style={{
                    ...columnInnerPadding,
                    maxWidth: sectionHeaderMaxWidth,
                    margin: marginValue,
                    width: '100%',
                  }}
                >
                  <VStack spacing="lg" align="start">
                    {sectionHeaderKey && renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, sectionHeaderContext, locale)}
                    {actionPatternsWithHeader.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext, locale))}
                    {firstColumnPatterns.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext, locale))}
                  </VStack>
                </Box>
              ) : (
                <Container height="auto">
                  <Box style={{ maxWidth: sectionHeaderMaxWidth, margin: marginValue, width: '100%' }}>
                    <VStack spacing="lg" align="start">
                      {sectionHeaderKey && renderPatternDirect(patterns[sectionHeaderKey], sectionHeaderKey, sectionKey, sectionHeaderContext, locale)}
                      {actionPatternsWithHeader.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext, locale))}
                      {firstColumnPatterns.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext, locale))}
                    </VStack>
                  </Box>
                </Container>
              )}
            </Box>
          ) : (
            // When SectionHeader is on left, right column has secondColumn patterns
            isSecondColumnMediaOnly ? (
              <Box className="media-column">
                {renderPatterns(secondColumnPatterns, secondColumnContext)}
              </Box>
            ) : wrapInCard && columnInnerPadding ? (
              <Box style={{ ...columnInnerPadding, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: cardColumnAlignCss }}>
                <VStack spacing={gap} align="stretch">
                  {renderPatterns(secondColumnPatterns, secondColumnContext)}
                </VStack>
              </Box>
            ) : (
              <VStack spacing={gap} align="stretch">
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

              // Force secondColumn patterns to have left/start alignment in mobile view
              const isSecondColumnPattern = secondColumnPatterns.includes(key);
              
              // Override pattern props align for secondColumn patterns on mobile
              let mobilePattern = pattern;
              if (isSecondColumnPattern && pattern.props) {
                mobilePattern = {
                  ...pattern,
                  props: {
                    ...pattern.props,
                    align: 'start'
                  }
                };
              }

              return renderPattern(mobilePattern, key, sectionKey, mobileLayoutContext, locale);
            })}
          </VStack>
        </Box>

        {/* Below Split: remaining patterns (t.ex. portfolio-karusell) med Container så karusellen får bredd */}
        {remainingPatterns.length > 0 && (
          <Box className="desktop-only" style={{ width: '100%' }}>
            <Container height="auto">
              <VStack spacing="none" align="stretch">
                {renderPatterns(remainingPatterns)}
              </VStack>
            </Container>
          </Box>
        )}
        
        {/* Action patterns at bottom (if distanced) with width-container - Only on desktop */}
        {distancedActionPatterns.length > 0 && (
          <Box className="desktop-only">
            <Container height="auto">
              <Box style={{ maxWidth: 'var(--width-container)', margin: '0 auto', width: '100%' }}>
                {distancedActionPatterns.map(key => renderPatternDirect(patterns[key], key, sectionKey, layoutContext, locale))}
              </Box>
            </Container>
          </Box>
        )}
            </>
          );
          if (!wrapInCard) return layoutContent;

          // Use section background if no explicit cardBackground is set
          const effectiveCardBackground = cardBackground || sectionProps?.background;
          const effectiveCardBackgroundSettings = cardBackground 
            ? cardBackgroundSettings 
            : sectionProps || {};
          
          const hasCardBackground = Boolean(effectiveCardBackground);
          const cardBackgroundProps: BackgroundProps = { 
            ...effectiveCardBackgroundSettings,
            background: effectiveCardBackground
          } as BackgroundProps;

          const cardBorderCss =
            cardBorderStyle === 'subtle'
              ? '1px solid var(--border-subtle)'
              : cardBorderStyle === 'solid'
                ? '2px solid var(--border-default)'
                : cardBorderStyle === 'accent'
                  ? '1px solid var(--accent-500)'
                  : undefined;

          if (hasCardBackground) {
            const cardBgLightOpacity = effectiveCardBackgroundSettings?.backgroundImageLightModeOpacity;
            return (
              <Card
                variant="ghost"
                padding="none"
                radius={cardRadius}
                data-card-has-image-bg="true"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'transparent',
                  ...(cardBorderCss && { border: cardBorderCss }),
                }}
              >
                <Box
                  style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    ...(cardBgLightOpacity != null && {
                      ['--section-bg-image-light-opacity' as string]: String(cardBgLightOpacity),
                    }),
                  }}
                >
                  {renderBackgroundComponent(effectiveCardBackground as any, cardBackgroundProps)}
                </Box>
                <Box
                  style={{
                    position: 'relative',
                    padding: cardPaddingToken ? `var(--foundation-space-${cardPaddingToken})` : 0,
                  }}
                >
                  {layoutContent}
                </Box>
              </Card>
            );
          }

          const cardPaddingForCard = (cardPadding === 'xl' || cardPadding === '2xl') ? 'lg' : cardPadding;
          return (
            <Card
              variant={cardVariant}
              padding={cardPaddingForCard}
              radius={cardRadius}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                ...(cardBorderCss && { border: cardBorderCss }),
              }}
            >
              {layoutContent}
            </Card>
          );
        })()}
      </Box>
    </>
  );
}
