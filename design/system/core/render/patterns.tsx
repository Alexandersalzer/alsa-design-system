import { Container } from '../../components';
import { getPatternProps } from '../utils/props';
import { patternRegistry } from '../../patterns/registry';
import { PatternNode } from '../types/nodes';

/**
 * Layout context passed from LayoutRenderer to patterns
 * Allows patterns to inherit layout-level settings
 */
export interface LayoutContext {
  /** Section header alignment from layout config */
  alignSectionHeader?: 'left' | 'center' | 'right';
}

/**
 * Renders a pattern component without Container wrapper
 * Used when patterns need to share the same Container
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
    <PatternComponent 
      key={patternKey}
      type={pattern.type}
      props={pattern.props}
      components={pattern.components}
      order={pattern.order}
      sectionKey={sectionKey}
      patternKey={patternKey}
      layoutContext={layoutContext}
    />
  );
};

/**
 * Pattern Renderer - Pattern har full kontroll över component rendering
 * För content sections (med Container wrapper)
 */
export const renderPattern = (
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

  // Hämta useMediaWidth från props med getPatternProps
  const patternProps = getPatternProps(pattern);

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