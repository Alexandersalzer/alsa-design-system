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