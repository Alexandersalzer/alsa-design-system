import { ComponentNode } from '../types/nodes';
import { componentRegistry } from '../../components/registry';
import { mergeWithDefaults } from '../../components/schemaRegistry';

/**
 * Internal helper: Renders a single component using the component registry
 */
const renderComponent = (
  component: ComponentNode,
  componentKey: string,
  sectionKey?: string,
  patternKey?: string,
  locale?: string
): React.ReactElement | null => {
  const Component = componentRegistry[component.type];
  
  if (!Component) {
    console.warn(`Component type "${component.type}" not found in component registry`);
    return null;
  }

  // Merge schema defaults with component props, using locale-specific defaults
  const mergedProps = mergeWithDefaults(component.type, component.props, locale as any);

  // ✅ COUNTUP SPECIAL HANDLING: Create dynamic key to force re-mount on prop changes
  // This ensures live preview updates immediately when changing end/suffix/prefix values
  let reactKey = componentKey;
  if (component.type === 'countup') {
    const { end, suffix = '', prefix = '', start = 0 } = mergedProps;
    reactKey = `${componentKey}-${start}-${end}-${suffix}-${prefix}`;
  }

  return (
    <Component
      key={reactKey}
      {...mergedProps}
      componentKey={componentKey}
    />
  );
};

/**
 * Renders components from a pattern's components record in specified order
 * Used by pattern components to render their child components
 * 
 * @param components - Record of ComponentNodes keyed by componentKey
 * @param order - Array of component keys defining render order
 * @param sectionKey - Optional parent section key for context
 * @param patternKey - Optional parent pattern key for context
 * @param locale - Optional locale for language-specific schema defaults
 * @returns Array of rendered React components
 * 
 * @example
 * // Inside a pattern component:
 * const elements = renderComponents(components, order, sectionKey, patternKey, locale);
 * return <VStack>{elements}</VStack>;
 */
export const renderComponents = (
  components: Record<string, ComponentNode>,
  order: string[],
  sectionKey?: string,
  patternKey?: string,
  locale?: string
): React.ReactElement[] => {
  return order
    .map((componentKey) => {
      const component = components[componentKey];
      if (!component) {
        console.warn(`Component "${componentKey}" not found in components record`);
        return null;
      }
      return renderComponent(component, componentKey, sectionKey, patternKey, locale);
    })
    .filter((element): element is React.ReactElement => element !== null);
};

/**
 * Gets a component from the registry by type
 * Useful for conditional rendering or type checking
 * 
 * @param type - Component type string
 * @returns React component or undefined if not found
 */
export const getComponent = (type: string): React.ComponentType<any> | undefined => {
  return componentRegistry[type];
};

/**
 * Checks if a component type exists in the registry
 * 
 * @param type - Component type string
 * @returns true if component exists in registry
 */
export const hasComponent = (type: string): boolean => {
  return type in componentRegistry;
};
