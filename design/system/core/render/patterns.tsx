import { Container } from '../../components';
import { getPatternProps } from '../utils/props';
import { patternRegistry } from '../../patterns/registry';
import { PatternNode } from '../types/nodes';
import { renderLayout, renderLayoutWithCards } from './layouts';

import { AnimationConfig } from '../animations/types';

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
  layoutContext?: LayoutContext
) => {
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
  layoutContext?: LayoutContext
) => {
  const patternProps = getPatternProps(pattern);

  // UNIVERSAL LAYOUT PATH: If pattern has layout prop
  if (patternProps.layout) {
    // Check if layout has cardLayout template
    if (patternProps.layout.cardLayout) {
      const layoutContent = renderLayoutWithCards(
        patternProps.layout,
        pattern.components,
        sectionKey,
        patternKey
      );

      return (
        <Container
          key={patternKey}
          height="auto"
          useMediaWidth={patternProps.useMediaWidth || false}
          useFormWidth={patternProps.useFormWidth || false}
          patternKey={patternKey}
        >
          {layoutContent}
        </Container>
      );
    }

    // Simple layout with order array - pass order as items to layout
    const layoutWithItems = {
      ...patternProps.layout,
      items: patternProps.layout.items || pattern.order || []
    };

    const layoutContent = renderLayout(
      layoutWithItems,
      pattern.components,
      sectionKey,
      patternKey
    );

    return (
      <Container
        key={patternKey}
        height="auto"
        useMediaWidth={patternProps.useMediaWidth || false}
        useFormWidth={patternProps.useFormWidth || false}
        patternKey={patternKey}
      >
        {layoutContent}
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