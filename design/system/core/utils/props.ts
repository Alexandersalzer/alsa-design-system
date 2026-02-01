// ===============================================
// blimpify-ui/design/system/core/utils/componentHelpers.ts
// Utility functions for working with components in patterns
// ===============================================

import { ComponentNode, PatternNode } from '../types/nodes';

/**
 * Hidden components context
 */
let hiddenComponentsSet: Set<string> = new Set();

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
    const entry = Object.entries(components).find(([key, component]) => {
      return component.type === type;
    });
    
    if (!entry) return false;
    
    const [componentKey, component] = entry;
    
    // Check if component is hidden via props or context
    const props = component.props || {};
    if (props.hidden === true || hiddenComponentsSet.has(componentKey)) {
      return false;
    }
    
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

// ===== LAYOUT HELPER FUNCTIONS =====

/**
 * Extracts layout-specific props from a node
 * Returns { layoutType, layoutProps, children }
 */
export const parseLayoutNode = (node: Record<string, any>) => {
  const { type, children, ...layoutProps } = node;
  
  return {
    layoutType: type,
    layoutProps,
    children: children || []
  };
};

/**
 * Checks if a node is a layout node (has type) or component reference (has component)
 */
export const isLayoutNode = (node: Record<string, any>): boolean => {
  return 'type' in node;
};

export const isComponentReference = (node: Record<string, any>): boolean => {
  return 'component' in node;
};

/**
 * Extracts component slot name from reference
 * "${slotName}" → "slotName"
 */
export const extractSlotName = (componentRef: string): string => {
  return componentRef.startsWith('${') && componentRef.endsWith('}')
    ? componentRef.slice(2, -1)
    : componentRef;
};

/**
 * Gets all item IDs from layout in order
 */
export const getLayoutItemOrder = (layout: Record<string, any>): string[] => {
  const { order, items } = layout;
  
  if (order && Array.isArray(order)) {
    return order;
  }
  
  if (items && Array.isArray(items)) {
    return items.map(item => item.id).filter(Boolean);
  }
  
  return [];
};

/**
 * Finds item by ID from layout items array
 */
export const findLayoutItem = (
  layout: Record<string, any>,
  itemId: string
): Record<string, any> | undefined => {
  const { items } = layout;
  
  if (!items || !Array.isArray(items)) {
    return undefined;
  }
  
  return items.find(item => item.id === itemId);
};

/**
 * Find component by slot or type in components record
 * Used for template matching: ${image} → finds component with slot: "image" OR type: "image"
 * 
 * Priority order:
 * 1. Exact slot match (component.slot === slotName)
 * 2. Type match (component.type === slotName)
 * 
 * This allows multiple components of same type with different slots:
 * - { type: "body", slot: "label" } → matched by ${label}
 * - { type: "body", slot: "description" } → matched by ${description}
 * - { type: "body" } → matched by ${body} (fallback to type)
 * 
 * @param components - Record of ComponentNodes keyed by componentId
 * @param slotName - Slot name to find (tries slot first, then type)
 * @returns The matching ComponentNode or undefined
 */
export const findComponentByType = (
  components: Record<string, any>,
  slotName: string
): Record<string, any> | undefined => {
  // First: try to find by slot
  const slotMatch = Object.entries(components).find(
    ([_, component]) => component.slot === slotName
  );
  if (slotMatch) return slotMatch[1];
  
  // Fallback: find by type
  const typeMatch = Object.entries(components).find(
    ([_, component]) => component.type === slotName
  );
  return typeMatch ? typeMatch[1] : undefined;
};