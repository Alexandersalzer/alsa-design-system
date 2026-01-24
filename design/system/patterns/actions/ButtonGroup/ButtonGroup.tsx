// ===============================================
// ButtonGroup Pattern Component
// Renders multiple buttons in a horizontal group
// ===============================================

'use client';

import React, { useState, useEffect } from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps } from '../../../core/utils/props';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Button } from '../../../components/actions/Button/Button';
import { FadeIn } from '../../../components/animations/FadeIn/FadeIn';
import { Opacity } from '../../../components/animations/Opacity/Opacity';
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

  // Extract pattern props with defaults
  const patternPropsValues = getPatternProps();
  const {
    gap = 'md', // HStack gap between buttons
    wrap = true, // Allow buttons to wrap on mobile
  } = patternPropsValues;

  // Get alignment from props or inherit from layout context
  // Note: layoutContext.alignSectionHeader already has opposite alignment applied
  // by LayoutRenderer for secondColumn patterns, so we just use it directly
  const align = patternPropsValues.align || layoutContext?.alignSectionHeader || 'center';

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
  
  // Check if section has specific animation config
  const sectionAnimationConfig = layoutContext?.sectionAnimation;
  
  // Use section animation settings if available, otherwise use props or defaults
  // Type guard: only fadeIn has direction and stagger settings
  const animationDirection = (sectionAnimationConfig?.type === 'fadeIn' && sectionAnimationConfig.settings?.direction) 
    || patternPropsValues?.animationDirection 
    || 'up';
  const animationDuration = sectionAnimationConfig?.settings?.duration || patternPropsValues?.animationDuration || 600;
  const animationDelay = sectionAnimationConfig?.settings?.delay || patternPropsValues?.animationDelay || 0;
  // Type guard: fadeIn and opacity have stagger setting
  const animationStagger = ((sectionAnimationConfig?.type === 'fadeIn' || sectionAnimationConfig?.type === 'opacity') && sectionAnimationConfig.settings?.stagger !== undefined
    ? sectionAnimationConfig.settings.stagger
    : patternPropsValues?.animationStagger) ?? 100; // Delay between buttons

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
  // Priority: section animation > global animation mode
  const shouldAnimate = sectionAnimationConfig 
    ? sectionAnimationConfig.type !== 'none' 
    : (animationMode === 'all' || (animationMode === 'hero' && isHero));

  // Determine animation type
  const animationType = sectionAnimationConfig?.type || 'fadeIn';

  return (
    <HStack
      spacing={gap}
      justify={justify}
      align="center"
      wrap={wrap}
      style={{ width: '100%' }}
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

        // If opacity animation, use Opacity component
        if (animationType === 'opacity') {
          return (
            <Opacity
              key={buttonKey}
              duration={animationDuration}
              delay={animationDelay + (index * animationStagger)}
              enableScrollTrigger={true}
              triggerOffset={100}
            >
              {buttonElement}
            </Opacity>
          );
        }

        // Default: use FadeIn with direction
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
