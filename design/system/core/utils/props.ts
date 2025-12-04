// ===============================================
// blimpify-ui/design/system/core/utils/componentHelpers.ts
// Utility functions for working with components in patterns
// ===============================================

import { ComponentNode, PatternNode } from '../types/nodes';


/**
 * Get content from the first component with a specific type and optional role
 * Returns the content string or a fallback value
 */

export const componentProps = (components: Record<string, ComponentNode>) => {
  return (type: string, fallback: Record<string, any> = {}) => {
    return getComponentProps(components, type, fallback);
  };
};

/**
 * Get component props along with the component key for live editing
 * Returns both props and the key for data-component-key attribute
 */
export const getComponentProps = (
  components: Record<string, ComponentNode>,
  type: string,
  fallback: Record<string, any> = {}
): { props: Record<string, any>; key: string | undefined } => {
  const entry = Object.entries(components).find(([key, component]) => {
    return component.type === type;
  });
  
  if (entry) {
    const [key, component] = entry;
    return {
      props: component.props ?? fallback,
      key: key
    };
  }
  
  return {
    props: fallback,
    key: undefined
  };
};



/**
 * Get props from a pattern
 * Returns the props object or a fallback value
 */
export const getPatternProps = (
  pattern: PatternNode,
  fallback: Record<string, any> = {}
): Record<string, any> => {
  return pattern?.props || fallback;
};

/**
 * Get component order from a pattern
 * Returns the order array or Object.keys(components) as fallback
 */
export const getPatternOrder = (pattern: PatternNode): string[] => {
  return pattern?.order || Object.keys(pattern?.components || {});
};

export const patternProps = (pattern: PatternNode) => {
  return (fallback: Record<string, any> = {}) => {
    return getPatternProps(pattern, fallback);
  };
};

/**
 * Check if a component should be rendered (exists and not hidden)
 * Returns a function that checks for component existence and visibility
 */
export const componentPresent = (components: Record<string, ComponentNode>) => {
  return (type: string) => {
    const component = Object.values(components).find(c => {
      const matchesType = c.type === type;
      return matchesType;
    });
    
    if (!component) return false;
    
    // Check if component is hidden
    const props = component.props || {};
    if (props.hidden === true) return false;
    
    return true;
  };
};

/**
 * Map over components of a specific type and optional role
 * Returns array of component props for easy mapping
 */
export const mapComponents = (
  components: Record<string, ComponentNode>,
  type: string
): Record<string, any>[] => {
  const matchingComponents = Object.values(components).filter(c => {
    const matchesType = c.type === type;
    return matchesType;
  });
  
  return matchingComponents.map(c => c.props || {});
};

export const useMapComponents = (components: Record<string, ComponentNode>) => {
  return (type: string) => {
    return mapComponents(components, type);
  };
};