'use client';

import React, { useState, useEffect } from 'react';
import { VStack } from '../../../components/layout/vStack/VStack';
import { Box } from '../../../components/layout/box/Box';
import { Typography } from '../../../components/Typography/Typography';
import { Tag } from '../../../components/feedback/Tag/Tag';
import { FadeIn } from '../../../components/animations/FadeIn/FadeIn';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, componentPresent } from '../../../core/utils/props';
import type { LayoutContext } from '../../../core/render/patterns';

export interface SectionHeaderProps extends PatternNode {
  type: 'sectionHeader';
  sectionKey?: string;
  patternKey?: string;
  /** Layout context for inheriting alignment from parent layout */
  layoutContext?: LayoutContext;
}

/**
 * SectionHeader Pattern - Renders tag, heading, and body text
 * Used as the main content block for sections
 *
 * Alignment priority:
 * 1. Explicit props.align / props.textAlign (highest priority)
 * 2. Inherited from layoutContext.alignSectionHeader
 * 3. Default to 'center'
 */
export const SectionHeader: React.FC<SectionHeaderProps> = (patternNode) => {
  const { components = {}, sectionKey, patternKey, props, layoutContext } = patternNode;

  if (!components || Object.keys(components).length === 0) return null;

  const get = componentProps(components);
  const renderIf = componentPresent(components);

  // Get inherited alignment from layout context
  const inheritedAlign = layoutContext?.alignSectionHeader;

  // Map layout alignment to component alignment values
  // 'left' -> 'start', 'right' -> 'end', 'center' -> 'center'
  const mapLayoutAlign = (layoutAlign?: string) => {
    if (layoutAlign === 'left') return 'start';
    if (layoutAlign === 'right') return 'end';
    return layoutAlign || 'center';
  };

  // Get spacing and alignment from pattern props, with inheritance fallback
  const spacing = props?.spacing || 'md';
  // Align controls the VStack/Box alignment (start/center/end)
  const align = props?.align || mapLayoutAlign(inheritedAlign);
  // TextAlign controls the Typography text alignment (left/center/right)
  const textAlign = props?.textAlign || inheritedAlign || 'center';
  const maxWidth = props?.maxWidth || '650px';
  const isHero = sectionKey?.startsWith('hero_') || props?.isHero || false;

  // Get hero spacing configuration
  const heroSpacingMobile = props?.heroSpacingMobile || 1.5;
  const heroSpacingDesktop = props?.heroSpacingDesktop || 1;

  // Animation configuration
  const animationDirection = props?.animationDirection || 'up';
  const animationDuration = props?.animationDuration || 600;
  const animationDelay = props?.animationDelay || 0;
  const animationStagger = props?.animationStagger || 100; // Delay between elements

  // Read animation mode from CSS variable (set in design.json)
  // 'all' = animate all sections, 'hero' = only hero sections, 'none' = no animations
  const [animationMode, setAnimationMode] = useState<'all' | 'hero' | 'none'>('all');

  useEffect(() => {
    // Read CSS variable on client-side after mount to avoid hydration mismatch
    const cssValue = getComputedStyle(document.documentElement)
      .getPropertyValue('--section-body-animation')
      .replace(/['"`]/g, '')
      .trim() as 'all' | 'hero' | 'none';
    
    if (cssValue && (cssValue === 'all' || cssValue === 'hero' || cssValue === 'none')) {
      setAnimationMode(cssValue);
    }
  }, []);

  // Determine if animation should be enabled for this section
  const shouldAnimate = animationMode === 'all' || (animationMode === 'hero' && isHero);

  // Helper to wrap content with animation
  // Checks if component has its own animation prop - if so, skip FadeIn wrapper
  const withAnimation = (content: React.ReactNode, index: number = 0, componentKey?: string) => {
    if (!shouldAnimate) return content;
    
    // If componentKey provided, check if component has its own animation
    if (componentKey && get(componentKey).props?.animation) {
      return content; // Skip FadeIn wrapper - component handles animation itself
    }

    return (
      <FadeIn
        direction={animationDirection}
        duration={animationDuration}
        delay={animationDelay + (index * animationStagger)}
        enableScrollTrigger={true}
        triggerOffset={100}
      >
        {content}
      </FadeIn>
    );
  };

  return (
    <>
      {isHero && (
        <style>{`
          @media (max-width: 767px) {
            .section-header--hero-${patternKey} {
              padding-top: calc(var(--space-section) * ${heroSpacingMobile});
            }
          }
          @media (min-width: 768px) {
            .section-header--hero-${patternKey} {
              padding-top: calc(var(--space-section) * ${heroSpacingDesktop});
            }
          }
        `}</style>
      )}
      <Box
        style={{
          maxWidth: maxWidth,
          margin: align === 'center' ? '0 auto' : align === 'end' ? '0 0 0 auto' : '0 auto 0 0',
          width: '100%',
        }}
        className={isHero ? `section-header--hero-${patternKey}` : ''}
      >
        {/* Tag - optional */}
        {renderIf('tag') && get('tag').props.content && withAnimation(
          <Box>
            <Tag
              size="medium"
              variant="accent"
              icon={null}
              componentKey={get('tag').key}
            >
              {get('tag').props.content}
            </Tag>
          </Box>,
          0,
          'tag'
        )}

        {/* Heading - render if content OR animation exists (countUp generates content) */}
        {renderIf('heading') && (get('heading').props.content || get('heading').props.animation) && withAnimation(
          <Typography
            as={isHero ? "h1" : "h2"}
            variant="display-lg"
            color="heading"
            align={textAlign}
            animation={get('heading').props.animation}
            componentKey={get('heading').key}
          >
            {get('heading').props.content}
          </Typography>,
          1,
          'heading'
        )}

        {/* Body - optional */}
        {renderIf('body') && get('body').props.content && withAnimation(
          <Typography
            as="p"
            variant="body-lg"
            color="body"
            weight="regular"
            align={textAlign}
            animation={get('body').props.animation}
            componentKey={get('body').key}
          >
            {get('body').props.content}
          </Typography>,
          2,
          'body'
        )}
      </Box>
    </>
  );
};

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
