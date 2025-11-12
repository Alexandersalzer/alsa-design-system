// ===============================================
// blimpify-ui/design/system/core/utils/componentHelpers.ts
// Utility functions for working with components in patterns
// ===============================================

import { ComponentNode, PatternNode } from '../types/nodes';

// ===== CONSTANTS =====
export const CDN_BASE_URL = 'https://cdn.blimpify-im.com/members';

/**
 * Get content from the first component with a specific type and optional role
 * Returns the content string or a fallback value
 */
/**
 * Get props from the first component with a specific type and optional role
 * Returns the props object or a fallback value
 */
export const getComponentProps = (
  components: Record<string, ComponentNode>,
  type: string,
  role?: string,
  fallback: Record<string, any> = {},
  index: number = 0
): Record<string, any> => {
  const matchingComponents = Object.entries(components).filter(([key, c]) => {
    const matchesType = c.type === type;
    const matchesRole = role ? c.role === role : true;
    return matchesType && matchesRole;
  });
  
  if (matchingComponents.length === 0) {
    return fallback;
  }
  
  // If index is out of bounds, return the first component
  const componentIndex = index >= matchingComponents.length ? 0 : index;
  const [componentKey, component] = matchingComponents[componentIndex];
  
  return {
    ...component.props,
    _componentKey: componentKey // Include the unique key for reference
  };
};

export const useComponentProps = (components: Record<string, ComponentNode>) => {
  return (type: string, role?: string, fallback: Record<string, any> = {}, index: number = 0) => {
    return getComponentProps(components, type, role, fallback, index);
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

export const usePatternProps = (pattern: PatternNode) => {
  return (fallback: Record<string, any> = {}) => {
    return getPatternProps(pattern, fallback);
  };
};

/**
 * Check if a component type exists in the components object
 * Returns a function that checks for component existence
 */
export const componentPresent = (components: Record<string, ComponentNode>) => {
  return (type: string, role?: string) => {
    return Object.values(components).some(c => {
      const matchesType = c.type === type;
      const matchesRole = role ? c.role === role : true;
      return matchesType && matchesRole;
    });
  };
};

/**
 * Get all components of a specific type and optional role
 * Returns array of all matching components
 */
export const getAllComponents = (
  components: Record<string, ComponentNode>,
  type: string,
  role?: string
): ComponentNode[] => {
  return Object.values(components).filter(c => {
    const matchesType = c.type === type;
    const matchesRole = role ? c.role === role : true;
    return matchesType && matchesRole;
  });
};

export const useAllComponents = (components: Record<string, ComponentNode>) => {
  return (type: string, role?: string) => {
    return getAllComponents(components, type, role);
  };
};

/**
 * Map over components of a specific type and optional role
 * Returns array of indices for use with getComponentProps
 */
export const mapComponents = (
  components: Record<string, ComponentNode>,
  type: string,
  role?: string
): number[] => {
  const matchingComponents = Object.values(components).filter(c => {
    const matchesType = c.type === type;
    const matchesRole = role ? c.role === role : true;
    return matchesType && matchesRole;
  });
  
  return matchingComponents.map((_, index) => index);
};

export const useMapComponents = (components: Record<string, ComponentNode>) => {
  return (type: string, role?: string) => {
    return mapComponents(components, type, role);
  };
};