import { Container } from '../../components';
import { getPatternProps } from '../utils/props';
import { patternRegistry } from '../../patterns/registry';
import { PatternNode } from '../types/nodes';


/**
 * Pattern Renderer - Pattern har full kontroll över component rendering
 * För content sections (med Container wrapper)
 */
export const renderPattern = (pattern: PatternNode, patternKey: string) => {
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
    >
      <PatternComponent 
        type={pattern.type}
        props={pattern.props}
        components={pattern.components}
      />
    </Container>
  );
};