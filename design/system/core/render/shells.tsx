import { Container } from '../../components';
import { getPatternProps } from '../utils/props';
import { patternRegistry } from '../../patterns/registry';
import { PatternNode } from '../types/nodes';
import { renderLayoutWithTemplate } from './layouts';

/**
 * Shell Pattern Renderer - För navbar/footer patterns
 * Använder Container för layout men utan spacing
 * Stödjer både layout-driven och legacy pattern rendering
 */
export const renderShellPattern = (pattern: PatternNode, patternKey: string, sectionKey: string) => {
  const patternProps = getPatternProps(pattern);

  // UNIVERSAL LAYOUT PATH: If pattern has layout prop (on pattern level, not in props)
  if ((pattern as any).layout) {
    const layoutContent = renderLayoutWithTemplate(
      (pattern as any).layout,
      pattern.components || {},
      sectionKey,
      patternKey
    );

    return (
      <Container
        key={patternKey}
        align="center"
        height="auto"
        width={patternProps.width ?? (patternProps.useNavbarWidth ? 'navbar' : patternProps.useMediaWidth ? 'media' : undefined)}
        noPadding={true}
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

  // Apply linkVariant from pattern props to all textlink-menuItem components
  let components = pattern.components || {};
  const linkVariant = (pattern.props as any)?.linkVariant;
  if (linkVariant && linkVariant !== 'default') {
    components = Object.fromEntries(
      Object.entries(components).map(([key, comp]: [string, any]) => {
        if (comp.type === 'textlink-menuItem' && !comp.props?.variant) {
          return [key, { ...comp, props: { ...comp.props, variant: linkVariant } }];
        }
        return [key, comp];
      })
    );
  }

  // Apply logoDisplay from pattern props to logo component's display prop
  const logoDisplay = (pattern.props as any)?.logoDisplay;
  if (logoDisplay) {
    const showLogo = logoDisplay !== 'text';
    const showLogoText = logoDisplay !== 'logo';
    components = Object.fromEntries(
      Object.entries(components).map(([key, comp]: [string, any]) => {
        if (comp.type === 'logo') {
          return [key, { ...comp, props: { ...comp.props, display: logoDisplay } }];
        }
        if (!showLogo && (comp.type === 'image' && key.toLowerCase().includes('logo'))) {
          return [key, { ...comp, props: { ...comp.props, hidden: true } }];
        }
        if (!showLogoText && (
          comp.type === 'logotext' ||
          comp.type === 'typography-businessName' ||
          ((comp.type === 'heading') && (key.includes('businessName') || key.includes('typography-businessName')))
        )) {
          return [key, { ...comp, props: { ...comp.props, hidden: true } }];
        }
        return [key, comp];
      })
    );
  }

  // Container utan padding, full width för navbar/footer
  return (
    <Container
      key={`${patternKey}`}
      align="center"
      height="auto"
      width={patternProps.width ?? (patternProps.useNavbarWidth ? 'navbar' : patternProps.useMediaWidth ? 'media' : undefined)}
      noPadding={true}
      patternKey={patternKey}
    >
      <PatternComponent
        type={pattern.type}
        props={pattern.props}
        components={components}
      />
    </Container>
  );
};