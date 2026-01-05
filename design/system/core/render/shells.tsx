import { Container } from '../../components';
import { getPatternProps } from '../utils/props';
import { patternRegistry } from '../../patterns/registry';
import { PatternNode } from '../types/nodes';

/**
 * Shell Pattern Renderer - För navbar/footer patterns
 * Använder Container för layout men utan spacing
 */
export const renderShellPattern = (
  pattern: PatternNode, 
  patternKey: string, 
  sectionKey: string,
  locale?: string
) => {

  const PatternComponent = patternRegistry[pattern.type];
  if (!PatternComponent) {
    console.warn(`Pattern: ${pattern.type} don't exist in registry`);
    return null;
  }

  // Hämta useNavbarWidth från props
  const patternProps = getPatternProps(pattern);

  // Container utan padding, full width för navbar/footer
  return (
    <Container 
      key={`${patternKey}`}
      align="center"
      height="auto"
      useNavbarWidth={patternProps.useNavbarWidth || false}
      noPadding={true}
      patternKey={patternKey}
    >
      <PatternComponent 
        type={pattern.type}
        props={pattern.props}
        components={pattern.components}
        sectionKey={sectionKey}
        patternKey={patternKey}
        locale={locale}
      />
    </Container>
  );
};