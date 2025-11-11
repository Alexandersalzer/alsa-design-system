// ===============================================
// blimpify-ui/design/system/core/utils/componentHelpers.ts
// Utility functions for working with components in patterns
// ===============================================

import { ComponentNode } from '../types/nodes';

/**
 * Get content from the first component with a specific type and optional role
 * Returns the content string or a fallback value
 */
export const getComponentContent = (
  components: Record<string, ComponentNode>, 
  type: string,
  role?: string,
  fallback: string = ''
): string => {
  const component = Object.values(components).find(c => {
    const matchesType = c.type === type;
    const matchesRole = role ? c.role === role : true;
    return matchesType && matchesRole;
  });
  return component?.props?.content || fallback;
};
