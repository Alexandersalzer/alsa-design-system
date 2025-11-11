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
  fallback: Record<string, any> = {}
): Record<string, any> => {
  const component = Object.values(components).find(c => {
    const matchesType = c.type === type;
    const matchesRole = role ? c.role === role : true;
    return matchesType && matchesRole;
  });
  return component?.props || fallback;
};

export const useComponentProps = (components: Record<string, ComponentNode>) => {
  return (type: string, role?: string, fallback: Record<string, any> = {}) => {
    return getComponentProps(components, type, role, fallback);
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