import { Container } from '../../components';
import { getPatternProps } from '../utils/props';
import { patternRegistry } from '../../patterns/registry';
import { PatternNode } from '../types/nodes';


/**
 * Pattern Renderer - Pattern har full kontroll över component rendering
 * För content sections (med Container wrapper)
 */
export const renderPattern = (pattern: PatternNode, patternKey: string, sectionKey?: string) => {
  const PatternComponent = patternRegistry[pattern.type];
  if (!PatternComponent) {
    console.warn(`Pattern: ${pattern.type} don't exist in registry`);
    return null;
  }

  // Hämta useMediaWidth från props med getPatternProps
  const patternProps = getPatternProps(pattern);

  // Check if pattern should skip Container wrapper
  const noContainer = patternProps.noContainer === true;

  const patternElement = (
    <PatternComponent 
      type={pattern.type}
      props={pattern.props}
      components={pattern.components}
      sectionKey={sectionKey}
      patternKey={patternKey}
    />
  );

  // Render without Container if noContainer is true
  if (noContainer) {
    return <div key={patternKey} data-pattern-key={patternKey}>{patternElement}</div>;
  }

  // Default: render with Container
  return (
    <Container 
      key={patternKey}
      height="auto"
      useMediaWidth={patternProps.useMediaWidth || false}
      useFormWidth={patternProps.useFormWidth || false}
      patternKey={patternKey}
    >
      {patternElement}
    </Container>
  );
};