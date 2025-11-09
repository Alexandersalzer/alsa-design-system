// ===============================================
// blimpify-ui/design/system/core/utils/componentHelpers.ts
// Utility functions for working with components in patterns
// ===============================================

import { ComponentNode } from '../types/nodes';

/**
 * Type for components with keys (used in pattern rendering)
 */
export interface ComponentWithKey extends ComponentNode {
  key: string;
}

/**
 * Get components filtered by their role property
 * Used by patterns to organize component layout based on semantic roles
 * 
 * @param components - Record of components from pattern
 * @param role - Role string to filter by (e.g., 'title', 'email', 'legal')
 * @returns Array of components with the specified role, including their keys
 */
export const getComponentsByRole = (
  components: Record<string, ComponentNode>, 
  role: string
): ComponentWithKey[] => {
  return Object.entries(components)
    .filter(([key, component]) => component.props?.role === role)
    .map(([key, component]) => ({ ...component, key }));
};