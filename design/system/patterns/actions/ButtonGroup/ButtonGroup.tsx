// ===============================================
// ButtonGroup Pattern Component
// Renders multiple buttons in a horizontal group
// ===============================================

'use client';

import React, { useState, useEffect } from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, componentProps, componentPresent } from '../../../core/utils/props';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Button } from '../../../components/actions/Button/Button';
import { FadeIn } from '../../../components/animations/FadeIn/FadeIn';
import type { LayoutContext } from '../../../core/render/patterns';

export interface ButtonGroupProps extends PatternNode {
  type: 'buttonGroup';
  sectionKey?: string;
  patternKey?: string;
  /** Layout context for inheriting alignment from parent layout */
  layoutContext?: LayoutContext;
}

/**
 * ButtonGroup Pattern - Renders multiple buttons in a horizontal group
 *
 * Alignment priority:
 * 1. Explicit props.align (highest priority)
 * 2. When in secondColumn: use OPPOSITE alignment of alignSectionHeader
 *    - alignSectionHeader: 'left' → secondColumn buttons: 'end' (right)
 *    - alignSectionHeader: 'right' → secondColumn buttons: 'start' (left)
 *    - alignSectionHeader: 'center' → secondColumn buttons: 'end'
 * 3. Inherited from layoutContext.alignSectionHeader (when not in secondColumn)
 * 4. Default to 'center'
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = (patternNode) => {
  const getPatternProps = patternProps(patternNode);
  const { components = {}, order = [], sectionKey, layoutContext } = patternNode;
  const get = componentProps(components);
  const renderIf = componentPresent(components);

  // Get inherited alignment from layout context
  const inheritedAlign = layoutContext?.alignSectionHeader;
  const isInSecondColumn = layoutContext?.isInSecondColumn;

  // Extract pattern props with defaults
  const patternPropsValues = getPatternProps();
  const {
    gap = 'md', // HStack gap between buttons
    wrap = true, // Allow buttons to wrap on mobile
  } = patternPropsValues;

  // Align priority:
  // 1. Explicit prop (highest priority)
  // 2. When in secondColumn: use OPPOSITE of alignSectionHeader
  //    - If alignSectionHeader is 'left', secondColumn buttons should be 'end' (right)
  //    - If alignSectionHeader is 'right', secondColumn buttons should be 'start' (left)
  //    - If alignSectionHeader is 'center', secondColumn buttons should be 'end'
  // 3. Inherited from layout (alignSectionHeader)
  // 4. Default 'center'
  const getOppositeAlign = (align?: string) => {
    if (align === 'left') return 'end';
    if (align === 'right') return 'start';
    return 'end'; // center -> end for secondColumn
  };

  const getDefaultAlign = () => {
    if (patternPropsValues.align) return patternPropsValues.align;
    if (isInSecondColumn) return getOppositeAlign(inheritedAlign);
    if (inheritedAlign) return inheritedAlign;
    return 'center';
  };
  const align = getDefaultAlign();

  // Map align to HStack justify
  const justifyMap = {
    left: 'start',
    start: 'start',
    center: 'center',
    right: 'end',
    end: 'end',
  } as const;
  const justify = justifyMap[align as keyof typeof justifyMap] || 'center';

  // Fallback: if no order, use all component keys
  const buttonKeys = order.length > 0 ? order : Object.keys(components);

  // Animation configuration
  const isHero = sectionKey?.startsWith('hero_') || patternPropsValues?.isHero || false;
  const animationDirection = patternPropsValues?.animationDirection || 'up';
  const animationDuration = patternPropsValues?.animationDuration || 600;
  const animationDelay = patternPropsValues?.animationDelay || 0;
  const animationStagger = patternPropsValues?.animationStagger || 100; // Delay between buttons

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

  return (
    <HStack
      spacing={gap}
      justify={justify}
      align="center"
      wrap={wrap}
    >
      {buttonKeys.map((buttonKey, index) => {
        const button = components[buttonKey];
        if (!button || button.type !== 'button' || !button.props.content) return null;

        const buttonElement = (
          <Button
            size={button.props.size || 'lg'}
            variant={button.props.variant || 'accent'}
            href={button.props.href}
            action={button.props.action}
            componentKey={button.componentKey || buttonKey}
          >
            {button.props.content}
          </Button>
        );

        // If animation is disabled, return button with key directly
        if (!shouldAnimate) {
          return <React.Fragment key={buttonKey}>{buttonElement}</React.Fragment>;
        }

        // If animation is enabled, wrap in FadeIn with key
        return (
          <FadeIn
            key={buttonKey}
            direction={animationDirection}
            duration={animationDuration}
            delay={animationDelay + (index * animationStagger)}
            enableScrollTrigger={true}
            triggerOffset={100}
          >
            {buttonElement}
          </FadeIn>
        );
      })}
    </HStack>
  );
};

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
