// ===============================================
// blimpify-ui/design/system/core/utils/componentHelpers.ts
// Utility functions for working with components in patterns
// ===============================================

import { ComponentNode } from '../types/nodes';

/**
 * Get components filtered by their role property
 * Used by patterns to organize component layout based on semantic roles
 */
export const getComponentsByRole = (
  components: Record<string, ComponentNode>, 
  role: string
): [string, ComponentNode][] => {
  return Object.entries(components)
    .filter(([key, component]) => component.props?.role === role);
};

/**
 * Get content from the first component with a specific role
 * Returns the content string or a fallback value
 */
export const getContentByRole = (
  components: Record<string, ComponentNode>, 
  role: string,
  fallback: string = ''
): string => {
  const component = Object.values(components).find(c => c.props?.role === role);
  return component?.props?.content || fallback;
};
