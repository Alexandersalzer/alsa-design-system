'use client';

import React from 'react';
import { VStack } from '../../../components/layout/vStack/VStack';
import { Box } from '../../../components/layout/box/Box';
import { Typography } from '../../../components/Typography/Typography';
import { Tag } from '../../../components/feedback/Tag/Tag';
import { FadeIn } from '../../../components/animations/FadeIn/FadeIn';
import { Opacity } from '../../../components/animations/Opacity/Opacity';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, componentPresent } from '../../../core/utils/props';
import { mergeWithDefaults } from '../../../components/schemaRegistry';
import type { LayoutContext } from '../../../core/render/patterns';

export interface SectionHeaderProps extends PatternNode {
  type: 'sectionHeader';
  sectionKey?: string;
  patternKey?: string;
  /** Layout context for inheriting alignment from parent layout */
  layoutContext?: LayoutContext;
  locale?: string;
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
  const { components = {}, sectionKey, patternKey, props, layoutContext, locale } = patternNode;

  if (!components || Object.keys(components).length === 0) return null;

  const get = componentProps(components);
  const renderIf = componentPresent(components);

  // Helper to get merged props with schema defaults
  const getMergedProps = (componentKey: string) => {
    const component = components[componentKey];
    if (!component) return {};
    return mergeWithDefaults(component.type, component.props || {}, locale as any);
  };

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
  // Vertical alignment (justifyContent) - new prop for vertical positioning
  const verticalAlign = props?.verticalAlign || 'start'; // start/center/end

  // Get hero spacing configuration
  const heroSpacingMobile = props?.heroSpacingMobile || 1.5;
  const heroSpacingDesktop = props?.heroSpacingDesktop || 1;

  // Check if section has specific animation config
  const sectionAnimationConfig = layoutContext?.sectionAnimation;

  // Animation configuration
  // Type guard: only fadeIn has direction setting
  const animationDirection = (sectionAnimationConfig?.type === 'fadeIn' && sectionAnimationConfig.settings?.direction) 
    || props?.animationDirection 
    || 'up';
  const animationDuration = sectionAnimationConfig?.settings?.duration || props?.animationDuration || 600;
  const animationDelay = sectionAnimationConfig?.settings?.delay || props?.animationDelay || 0;
  // Type guard: fadeIn and opacity have stagger setting
  const animationStagger = ((sectionAnimationConfig?.type === 'fadeIn' || sectionAnimationConfig?.type === 'opacity') && sectionAnimationConfig.settings?.stagger !== undefined
    ? sectionAnimationConfig.settings.stagger
    : props?.animationStagger) ?? 100; // Delay between elements

  // Animation mode from CSS variable. Default 'all' so server and first client render match (avoids hydration mismatch).
  // Updated in useEffect so --section-body-animation only affects after mount.
  const [animationMode, setAnimationMode] = React.useState<'all' | 'hero' | 'none'>('all');
  React.useEffect(() => {
    const rawValue = getComputedStyle(document.documentElement)
      .getPropertyValue('--section-body-animation')
      .replace(/['"`]/g, '')
      .trim();
    const lowerValue = rawValue?.toLowerCase();
    if (rawValue && (lowerValue === 'all' || lowerValue === 'hero' || lowerValue === 'none')) {
      setAnimationMode(lowerValue as 'all' | 'hero' | 'none');
    }
  }, []);

  // Determine if animation should be enabled for this section
  // Priority: section animation > global animation mode
  const shouldAnimate = sectionAnimationConfig
    ? sectionAnimationConfig.type !== 'none'
    : (animationMode === 'all' || (animationMode === 'hero' && isHero));

  // Determine animation type
  const animationType = sectionAnimationConfig?.type || 'fadeIn';

  // Helper to wrap content with animation
  // Checks if component has its own animation prop - if so, skip FadeIn wrapper
  const withAnimation = (content: React.ReactNode, index: number = 0, componentKey?: string) => {
    if (!shouldAnimate) return content;

    // If componentKey provided, check if component has its own animation
    if (componentKey && get(componentKey).props?.animation) {
      return content; // Skip wrapper - component handles animation itself
    }

    // If opacity animation, use Opacity component
    if (animationType === 'opacity') {
      return (
        <Opacity
          duration={animationDuration}
          delay={animationDelay + (index * animationStagger)}
          enableScrollTrigger={true}
          triggerOffset={100}
        >
          {content}
        </Opacity>
      );
    }

    // Default: use FadeIn with direction
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

  // Apply maxWidth styling if specified in props
  const containerStyle = props?.maxWidth ? { maxWidth: props.maxWidth, width: '100%' } : undefined;

  const content = (
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
      {/* Tag - shown when tag component exists and is not hidden */}
      {(() => {
        const tagKey = Object.keys(components).find(k => components[k].type === 'tag');
        if (!tagKey || !renderIf('tag')) return null;
        const mergedProps = getMergedProps(tagKey);
        if (mergedProps.isHidden === 'true') return null;
        return withAnimation(
          <Box>
            <Tag
              size="medium"
              variant="accent"
              icon={null}
              componentKey={tagKey}
            >
              {mergedProps.content}
            </Tag>
          </Box>,
          0,
          'tag'
        );
      })()}

      {/* Heading - render with merged defaults */}
      {(() => {
        const headingKey = Object.keys(components).find(k => components[k].type === 'heading');
        if (!headingKey || !renderIf('heading')) return null;
        const mergedProps = getMergedProps(headingKey);
        if (!mergedProps.content && !mergedProps.animation) return null;
        
        // Build content with italic if {italic} placeholder exists
        let headingContent = mergedProps.content;
        if (headingContent && headingContent.includes('{italic}')) {
          if (mergedProps.italic) {
            // Replace with italic markup
            const suffixFont = components[headingKey]?.props?.suffixFont || 'Lora';
            const italicMarkup = `{color:var(--text-muted)}{font:${suffixFont}:500}*${mergedProps.italic}*{/font}{/color}`;
            headingContent = headingContent.replace('{italic}', italicMarkup);
          } else {
            // Remove placeholder if italic field is empty
            headingContent = headingContent.replace(/\s*\{italic\}/g, '').trim();
          }
        }
        
        return withAnimation(
          <Typography
            as={isHero ? "h1" : "h2"}
            variant="display-lg"
            color="heading"
            align={textAlign}
            animation={mergedProps.animation}
            componentKey={headingKey}
          >
            {headingContent}
          </Typography>,
          1,
          'heading'
        );
      })()}

      {/* Body - render with merged defaults */}
      {(() => {
        const bodyKey = Object.keys(components).find(k => components[k].type === 'body');
        if (!bodyKey || !renderIf('body')) return null;
        const mergedProps = getMergedProps(bodyKey);
        if (!mergedProps.content && !mergedProps.animation) return null;
        return withAnimation(
          <Typography
            as="p"
            variant="body-lg"
            color="body"
            weight="regular"
            align={textAlign}
            animation={mergedProps.animation}
            componentKey={bodyKey}
          >
            {mergedProps.content}
          </Typography>,
          2,
          'body'
        );
      })()}
    </>
  );

  // If maxWidth specified, wrap in a div with the constraint
  if (containerStyle) {
    return <div style={containerStyle} suppressHydrationWarning>{content}</div>;
  }

  // Suppress hydration warning - animation mode is read from CSS var which differs between SSR/client
  return <div suppressHydrationWarning style={{ display: 'contents' }}>{content}</div>;
};

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
