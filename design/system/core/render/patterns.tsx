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
    // Samma som andra items-karuseller (t.ex. hero logoCarousel): plocka children från layout-noden
    let childrenToAnimate: React.ReactNode = content;
    if (React.isValidElement(content)) {
      const props = content.props as { children?: React.ReactNode };
      if (props.children != null) {
        childrenToAnimate = props.children;
      }
    }
    const list = React.Children.toArray(childrenToAnimate);
    const items = list.map((child, index) => ({
      id: `item-${index}`,
      content: child
    }));
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
    const items = transformedProps?.items;
    if (animation.type === 'carousel' && (!items || items.length === 0)) {
      return content as React.ReactElement;
    }
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
    
    // Determine animation config. Use explicit config or default so server and client
    // render the same structure (avoids hydration mismatch from reading getComputedStyle only on client).
    const patternAnimation = pattern.animation || patternProps.animation;
    let animationConfig = patternAnimation || layoutContext?.sectionAnimation;

    if (!animationConfig) {
      // Default to fadeIn so layout always wraps items in FadeIn on both server and client.
      // Do not read --section-body-animation here (window/getComputedStyle); that would
      // differ on server vs client and cause "server: form, client: FadeIn > form" mismatch.
      animationConfig = {
        type: 'fadeIn',
        settings: { direction: 'up', duration: 600, stagger: 100 }
      };
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
    
    // Determine animation config (do not read window/getComputedStyle – causes server/client hydration mismatch)
    const patternAnimation = pattern.animation || patternProps.animation;
    const animationConfig = patternAnimation || layoutContext?.sectionAnimation;
    
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
      patternProps,
      isPerItemAnimation ? animationConfig : undefined,
      locale
    );

    if (!layoutContent) {
      console.warn(`[renderPattern] layoutContent null for patternKey=${patternKey}, sectionKey=${sectionKey} (type=${(pattern as any).type})`);
      return null;
    }

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
        noPadding={patternProps.noPadding || false}
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
      noPadding={patternProps.noPadding || false}
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