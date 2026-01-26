import React from 'react';
import { ComponentNode } from '../types/nodes';
import { componentRegistry } from '../../components/registry';
import { 
  parseLayoutNode, 
  isLayoutNode, 
  isComponentReference, 
  extractSlotName,
  getLayoutItemOrder,
  findLayoutItem
} from '../utils/props';

/**
 * Main entry: Renders layout with template system (NEW UNIFIED APPROACH)
 * Works with ANY layout primitive - completely generic
 * 
 * @param layout - Layout definition from pattern.layout
 * @param components - All available components from pattern
 * @param sectionKey - Section context
 * @param patternKey - Pattern context
 * @returns Rendered React element tree
 */
export const renderLayoutWithTemplate = (
  layout: Record<string, any>,
  components: Record<string, ComponentNode>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  const { type: parentType, template, order, ...parentLayoutProps } = layout;

  // Get parent layout component
  const ParentLayout = componentRegistry[parentType];
  if (!ParentLayout) {
    console.warn(`Layout type "${parentType}" not found in registry`);
    return null;
  }

  // If no template, render simple layout (fallback to old system)
  if (!template) {
    return renderSimpleLayout(layout, components, order, sectionKey, patternKey);
  }

  // Get items to render
  const itemOrder = getLayoutItemOrder(layout);
  
  // Render template for each item
  const renderedItems = itemOrder.map((itemId) => {
    const item = findLayoutItem(layout, itemId);
    if (!item) {
      console.warn(`Item "${itemId}" not found in layout items`);
      return null;
    }

    return (
      <React.Fragment key={itemId}>
        {renderTemplateNode(template, item.components, sectionKey, patternKey)}
      </React.Fragment>
    );
  }).filter(Boolean);

  return (
    <ParentLayout {...parentLayoutProps}>
      {renderedItems}
    </ParentLayout>
  );
};

/**
 * Renders simple layout without template (LEGACY FALLBACK)
 * Used when pattern.layout exists but has no template
 */
const renderSimpleLayout = (
  layout: Record<string, any>,
  components: Record<string, ComponentNode>,
  order?: string[],
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  const { type, ...layoutProps } = layout;

  const LayoutComponent = componentRegistry[type];
  if (!LayoutComponent) {
    console.warn(`Layout type "${type}" not found in component registry`);
    return null;
  }

  // Use order array to render components directly
  const componentKeys = order || Object.keys(components);
  const renderedComponents = componentKeys.map((key) => {
    const component = components[key];
    if (!component) return null;

    const Component = componentRegistry[component.type];
    if (!Component) {
      console.warn(`Component type "${component.type}" not found`);
      return null;
    }

    return <Component key={key} {...component.props} />;
  }).filter(Boolean);

  return (
    <LayoutComponent {...layoutProps}>
      {renderedComponents}
    </LayoutComponent>
  );
};

/**
 * Renders a template node (recursive, completely generic)
 * Handles both layout nodes and component references
 */
const renderTemplateNode = (
  node: Record<string, any>,
  itemComponents: Record<string, ComponentNode>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  // Check what kind of node this is
  if (isComponentReference(node)) {
    return renderComponentReference(node, itemComponents, sectionKey, patternKey);
  }

  if (isLayoutNode(node)) {
    return renderLayoutNodeGeneric(node, itemComponents, sectionKey, patternKey);
  }

  console.warn('Invalid template node:', node);
  return null;
};

/**
 * Renders ANY layout node (grid, vstack, hstack, box, gridItem, etc)
 * Completely generic - doesn't know about specific layout types
 */
const renderLayoutNodeGeneric = (
  node: Record<string, any>,
  itemComponents: Record<string, ComponentNode>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  const { layoutType, layoutProps, children } = parseLayoutNode(node);

  // Get layout component from registry
  const LayoutComponent = componentRegistry[layoutType];
  if (!LayoutComponent) {
    console.warn(`Layout type "${layoutType}" not found in registry`);
    return null;
  }

  // Recursively render children
  const renderedChildren = children.map((child: any, index: number) => (
    <React.Fragment key={index}>
      {renderTemplateNode(child, itemComponents, sectionKey, patternKey)}
    </React.Fragment>
  ));

  // Layout component takes care of its own props (colSpan for GridItem, spacing for VStack, etc)
  return (
    <LayoutComponent {...layoutProps}>
      {renderedChildren}
    </LayoutComponent>
  );
};

/**
 * Renders component reference: { component: "${slotName}" }
 * Completely generic - just resolves slot and renders component
 */
const renderComponentReference = (
  reference: Record<string, any>,
  itemComponents: Record<string, ComponentNode>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  const { component: componentRef, ...extraProps } = reference;

  const slotName = extractSlotName(componentRef);
  const componentNode = itemComponents[slotName];

  if (!componentNode) {
    console.warn(`Component slot "${slotName}" not found in item components`);
    return null;
  }

  const Component = componentRegistry[componentNode.type];
  if (!Component) {
    console.warn(`Component type "${componentNode.type}" not found in registry`);
    return null;
  }

  // Render component (extraProps reserved for future use)
  return <Component {...componentNode.props} />;
};

// ===== LEGACY EXPORT (kept for backward compatibility) =====
// This will be removed once all patterns are migrated to template system
export const renderLayoutWithCards = renderLayoutWithTemplate;