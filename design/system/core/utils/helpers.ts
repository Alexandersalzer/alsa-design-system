// ===============================================
// blimpify-ui/design/system/core/utils/componentHelpers.ts
// Utility functions for working with components in patterns
// ===============================================

import { ComponentNode } from '../types/nodes';

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
  return (type: string, role?: string, prop: string = 'content', fallback: any = '') => {
    const component = getComponentProps(components, type, role);
    return component?.[prop] ?? fallback;
  };
};