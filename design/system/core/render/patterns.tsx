import { Container } from '../../components';
import { getPatternProps } from '../utils/props';
import { patternRegistry } from '../../patterns/registry';
import { PatternNode } from '../types/nodes';
import { renderLayoutWithTemplate } from './layouts';
import { animationComponents } from '../../components/animations/registry';

import { AnimationConfig } from '../../components/animations/types';
import React from 'react';

/**
 * Content transformers for specific animation types
 * Allows custom handling for animations with special requirements
 */
const animationTransformers: Record<string, (content: React.ReactNode, layoutConfig?: any) => any> = {
  carousel: (content: React.ReactNode, layoutConfig?: any) => {
    let childrenToAnimate = content;
    
    // If content is wrapped in a layout component (HStack, Grid, etc), extract its children
    // This prevents the entire layout from being duplicated as one item
    if (React.isValidElement(content) && (content.props as any).children) {
      childrenToAnimate = (content.props as any).children;
    }
    
    const items = React.Children.toArray(childrenToAnimate).map((child, index) => ({
      id: `item-${index}`,
      content: child
    }));
    
    // Return just items - CarouselAnimation handles all spacing via its own props
    return { items };
  },
  // Add more transformers here as needed
  // e.g., grid: (content) => ({ gridItems: ... })
};

/**
 * Wraps content with animation component if animation config is provided
 * Dynamically handles all animation types from the registry
 */
const wrapWithAnimation = (
  content: React.ReactNode, 
  animation?: AnimationConfig,
  layoutConfig?: any
) => {
  if (!animation || animation.type === 'none') {
    return content;
  }

  const AnimationComponent = animationComponents[`${animation.type}Animation`];
  if (!AnimationComponent) {
    console.warn(`Animation component for type "${animation.type}" not found in registry`);
    return content;
  }

  // Check if this animation type needs special content transformation
  const transformer = animationTransformers[animation.type];
  if (transformer) {
    const transformedProps = transformer(content, layoutConfig);
    return <AnimationComponent {...transformedProps} {...animation.settings} />;
  }

  // Default: pass content as children with settings
  return <AnimationComponent {...animation.settings}>{content}</AnimationComponent>;
};

/**
 * Layout context passed from LayoutRenderer to patterns
 * Allows patterns to inherit layout-level settings
 */
export interface LayoutContext {
  /** Section header alignment from layout config */
  alignSectionHeader?: 'left' | 'center' | 'right';
  /** Whether this pattern is rendered in the second column of a split layout */
  isInSecondColumn?: boolean;
  /** Vertical alignment of the split layout */
  verticalAlign?: 'start' | 'center' | 'end';
  /** Animation config for this section (overrides global sectionBodyAnimation) */
  sectionAnimation?: AnimationConfig;
  /** Locale for language-specific defaults */
  locale?: string;
}

/**
 * Renders a pattern component without Container wrapper
 * Used when patterns need to share the same Container
 * Wraps in display: contents div to maintain data-pattern-key for EditorOverlay
 */
export const renderPatternDirect = (
  pattern: PatternNode,
  patternKey: string,
  sectionKey?: string,
  layoutContext?: LayoutContext,
  locale?: string
) => {
  const patternProps = getPatternProps(pattern);

  // UNIVERSAL LAYOUT PATH: If pattern has layout prop (like action patterns)
  if ((pattern as any).layout) {
    const layoutConfig = (pattern as any).layout;
    
    // Determine animation config with global mode support
    const patternAnimation = pattern.animation || patternProps.animation;
    let animationConfig = patternAnimation || layoutContext?.sectionAnimation;
    
    // Check global sectionBodyAnimation mode (all/hero/none) if no explicit animation
    if (!patternAnimation && typeof window !== 'undefined') {
      const isHero = sectionKey?.startsWith('hero_');
      const globalMode = getComputedStyle(document.documentElement)
        .getPropertyValue('--section-body-animation')
        .replace(/['"`]/g, '')
        .trim()
        .toLowerCase() as 'all' | 'hero' | 'none' | '';
      
      // If section-level animation exists, respect it
      // Otherwise check global mode
      if (!layoutContext?.sectionAnimation) {
        const shouldAnimate = globalMode === 'all' || (globalMode === 'hero' && isHero);
        if (shouldAnimate && !animationConfig) {
          // Provide default fadeIn animation
          animationConfig = {
            type: 'fadeIn',
            settings: { direction: 'up', duration: 600, stagger: 100 }
          };
        } else if (!shouldAnimate) {
          animationConfig = { type: 'none', settings: {} };
        }
      }
    }
    
    // Animations that should wrap each item individually
    const perItemAnimations = ['fadeIn', 'opacity', 'scale', 'slideIn'];
    const animationType = animationConfig?.type;
    const isPerItemAnimation = animationType && perItemAnimations.includes(animationType);
    
    const layoutContent = renderLayoutWithTemplate(
      layoutConfig, 
      pattern.components || {}, 
      sectionKey, 
      patternKey,
      patternProps,
      isPerItemAnimation ? animationConfig : undefined,
      locale
    );

    return (
      <div key={patternKey} data-pattern-key={patternKey} style={{ display: 'contents' }} suppressHydrationWarning>
        {layoutContent}
      </div>
    );
  }

  // LEGACY PATH: Use pattern registry for hardcoded patterns
  const PatternComponent = patternRegistry[pattern.type];
  if (!PatternComponent) {
    console.warn(`Pattern: ${pattern.type} don't exist in registry`);
    return null;
  }

  return (
    <div key={patternKey} data-pattern-key={patternKey} style={{ display: 'contents' }}>
      <PatternComponent
        type={pattern.type}
        props={pattern.props}
        components={pattern.components}
        order={pattern.order}
        sectionKey={sectionKey}
        patternKey={patternKey}
        layoutContext={layoutContext}
      />
    </div>
  );
};

/**
 * Pattern Renderer - Detects layout-driven vs legacy pattern rendering
 * För content sections (med Container wrapper)
 */
export const renderPattern = (
  pattern: PatternNode,
  patternKey: string,
  sectionKey?: string,
  layoutContext?: LayoutContext,
  locale?: string
) => {
  const patternProps = getPatternProps(pattern);

  // UNIVERSAL LAYOUT PATH: If pattern has layout prop (on pattern level, not in props)
  if ((pattern as any).layout) {
    const layoutConfig = (pattern as any).layout;
    
    // Determine animation config with global mode support
    const patternAnimation = pattern.animation || patternProps.animation;
    let animationConfig = patternAnimation || layoutContext?.sectionAnimation;
    
    // Check global sectionBodyAnimation mode (all/hero/none) if no explicit animation
    if (!patternAnimation && typeof window !== 'undefined') {
      const isHero = sectionKey?.startsWith('hero_');
      const globalMode = getComputedStyle(document.documentElement)
        .getPropertyValue('--section-body-animation')
        .replace(/['"`]/g, '')
        .trim()
        .toLowerCase() as 'all' | 'hero' | 'none' | '';
      
      // If section-level animation exists, respect it
      // Otherwise check global mode
      if (!layoutContext?.sectionAnimation) {
        const shouldAnimate = globalMode === 'all' || (globalMode === 'hero' && isHero);
        if (!shouldAnimate) {
          animationConfig = { type: 'none', settings: {} };
        }
      }
    }
    
    // Animations that should wrap each item individually (with stagger support)
    const perItemAnimations = ['fadeIn', 'opacity', 'scale', 'slideIn'];
    
    // Animations that should wrap the entire layout content
    const layoutWrapAnimations = ['carousel'];
    
    const animationType = animationConfig?.type;
    const isPerItemAnimation = animationType && perItemAnimations.includes(animationType);
    const isLayoutWrapAnimation = animationType && layoutWrapAnimations.includes(animationType);
    
    const layoutContent = renderLayoutWithTemplate(
      layoutConfig, 
      pattern.components || {}, 
      sectionKey, 
      patternKey,
      patternProps, // Pass pattern props for align, etc
      isPerItemAnimation ? animationConfig : undefined, // Pass per-item animations to layout renderer
      locale
    );

    // Wrap with animation if pattern has layout-wrap animation config (carousel, etc)
    // Pass layout config so animation can extract children and apply proper spacing
    const animatedContent = isLayoutWrapAnimation 
      ? wrapWithAnimation(layoutContent, animationConfig, layoutConfig)
      : layoutContent;

    return (
      <Container
        key={patternKey}
        height="auto"
        useMediaWidth={patternProps.useMediaWidth || false}
        useFormWidth={patternProps.useFormWidth || false}
        patternKey={patternKey}
      >
        {animatedContent}
      </Container>
    );
  }

  // LEGACY PATH: Use pattern registry for hardcoded patterns
  const PatternComponent = patternRegistry[pattern.type];
  if (!PatternComponent) {
    console.warn(`Pattern: ${pattern.type} don't exist in registry`);
    return null;
  }

  return (
    <Container
      key={patternKey}
      height="auto"
      useMediaWidth={patternProps.useMediaWidth || false}
      useFormWidth={patternProps.useFormWidth || false}
      patternKey={patternKey}
    >
      <PatternComponent
        type={pattern.type}
        props={pattern.props}
        components={pattern.components}
        order={pattern.order}
        sectionKey={sectionKey}
        patternKey={patternKey}
        layoutContext={layoutContext}
      />
    </Container>
  );
};