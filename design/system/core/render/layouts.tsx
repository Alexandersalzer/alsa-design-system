import React from 'react';
import { ComponentNode } from '../types/nodes';
import { componentRegistry } from '../../components/registry';

/**
 * Layout item can be:
 * - string: component key reference
 * - object: nested layout definition
 */
export type LayoutItem = string | NestedLayout;

/**
 * Nested layout definition
 */
export interface NestedLayout {
  type: string; // layout component type (vstack, hstack, grid, box, etc)
  items?: LayoutItem[]; // children items
  content?: NestedLayout; // alternative to items for single-child layouts (box, card)
  [key: string]: any; // all other layout props (spacing, gap, padding, etc)
}

/**
 * Main layout definition on pattern level
 */
export interface LayoutDefinition extends NestedLayout {
  cardLayout?: NestedLayout; // optional template for repeated items
}

/**
 * Recursively renders a layout tree with components
 * 
 * @param layout - Layout definition (type + props + items/content)
 * @param components - All available components from pattern
 * @param order - Order array from pattern (used when layout.items is not defined)
 * @param sectionKey - Section context
 * @param patternKey - Pattern context
 * @returns Rendered React element tree
 */
export const renderLayout = (
  layout: NestedLayout,
  components: Record<string, ComponentNode>,
  order?: string[],
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  const { type, items, content, ...layoutProps } = layout;

  // Get layout component from registry
  const LayoutComponent = componentRegistry[type];
  if (!LayoutComponent) {
    console.warn(`Layout type "${type}" not found in component registry`);
    return null;
  }

  // Use layout.items if provided, otherwise fall back to pattern.order
  const itemsToRender = items || (content ? [content] : order || []);

  // Render children based on items or content
  const children = renderLayoutChildren(
    itemsToRender,
    components,
    sectionKey,
    patternKey
  );

  return (
    <LayoutComponent {...layoutProps}>
      {children}
    </LayoutComponent>
  );
};

/**
 * Renders layout children (recursive)
 * Handles both component references (strings) and nested layouts (objects)
 */
const renderLayoutChildren = (
  items: LayoutItem[],
  components: Record<string, ComponentNode>,
  sectionKey?: string,
  patternKey?: string
): React.ReactNode[] => {
  return items.map((item, index) => {
    // STRING → Component reference
    if (typeof item === 'string') {
      return renderComponentFromKey(item, components, sectionKey, patternKey);
    }

    // OBJECT → Nested layout
    if (typeof item === 'object' && item.type) {
      return (
        <React.Fragment key={index}>
          {renderLayout(item, components, undefined, sectionKey, patternKey)}
        </React.Fragment>
      );
    }

    console.warn('Invalid layout item:', item);
    return null;
  }).filter(Boolean);
};

/**
 * Renders a component from component key
 */
const renderComponentFromKey = (
  componentKey: string,
  components: Record<string, ComponentNode>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  const component = components[componentKey];
  if (!component) {
    console.warn(`Component "${componentKey}" not found in components record`);
    return null;
  }

  const Component = componentRegistry[component.type];
  if (!Component) {
    console.warn(`Component type "${component.type}" not found in component registry`);
    return null;
  }

  // Extract grid-specific props
  const { colSpan, rowSpan, colStart, rowStart, ...componentProps } = component.props || {};

  // If component has grid placement props, wrap in GridItem
  if (colSpan || rowSpan || colStart || rowStart) {
    const GridItem = componentRegistry['gridItem'];
    if (GridItem) {
      return (
        <GridItem
          key={componentKey}
          colSpan={colSpan}
          rowSpan={rowSpan}
          colStart={colStart}
          rowStart={rowStart}
        >
          <Component {...componentProps} />
        </GridItem>
      );
    }
  }

  return (
    <Component
      key={componentKey}
      {...componentProps}
    />
  );
};

/**
 * Renders layout WITH cardLayout template (for repeated cards)
 * 
 * @param layout - Parent layout definition with cardLayout template
 * @param components - All available components
 * @param order - Order array from pattern
 * @param sectionKey - Section context
 * @param patternKey - Pattern context
 */
export const renderLayoutWithCards = (
  layout: LayoutDefinition,
  components: Record<string, ComponentNode>,
  order?: string[],
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  const { type, cardLayout, items, ...layoutProps } = layout;

  // Get parent layout component
  const ParentLayout = componentRegistry[type];
  if (!ParentLayout) {
    console.warn(`Layout type "${type}" not found in component registry`);
    return null;
  }

  // If no cardLayout, render as normal layout
  if (!cardLayout) {
    return renderLayout(layout, components, order, sectionKey, patternKey);
  }

  // Render each card using cardLayout template
  const cards = (items || []).map((cardData, index) => {
    if (typeof cardData === 'string') {
      // Single component reference
      return renderComponentFromKey(cardData, components, sectionKey, patternKey);
    }

    if (typeof cardData === 'object') {
      // Card data with slot mappings
      return (
        <React.Fragment key={index}>
          {renderCardFromTemplate(cardLayout, cardData, components, sectionKey, patternKey)}
        </React.Fragment>
      );
    }

    return null;
  }).filter(Boolean);

  return (
    <ParentLayout {...layoutProps}>
      {cards}
    </ParentLayout>
  );
};

/**
 * Renders a single card from cardLayout template
 * Resolves ${slot_name} references to component keys
 */
const renderCardFromTemplate = (
  cardLayout: NestedLayout,
  slotMappings: Record<string, string>,
  components: Record<string, ComponentNode>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  const { type, items, content, ...layoutProps } = cardLayout;

  const CardLayout = componentRegistry[type];
  if (!CardLayout) {
    console.warn(`Card layout type "${type}" not found in component registry`);
    return null;
  }

  // Resolve items with slot substitution
  const resolvedChildren = items
    ? resolveSlotItems(items, slotMappings, components, sectionKey, patternKey)
    : content
    ? [renderCardFromTemplate(content, slotMappings, components, sectionKey, patternKey)]
    : [];

  return (
    <CardLayout {...layoutProps}>
      {resolvedChildren}
    </CardLayout>
  );
};

/**
 * Resolves items array with slot substitution
 * "${slot_name}" → component key → rendered component
 */
const resolveSlotItems = (
  items: LayoutItem[],
  slotMappings: Record<string, string>,
  components: Record<string, ComponentNode>,
  sectionKey?: string,
  patternKey?: string
): React.ReactNode[] => {
  return items.map((item, index) => {
    // STRING with ${...} → Slot reference
    if (typeof item === 'string' && item.startsWith('${') && item.endsWith('}')) {
      const slotName = item.slice(2, -1); // Extract slot name
      const componentKey = slotMappings[slotName];
      
      if (!componentKey) {
        console.warn(`Slot "${slotName}" not found in slot mappings`);
        return null;
      }
      
      return renderComponentFromKey(componentKey, components, sectionKey, patternKey);
    }

    // STRING → Direct component reference
    if (typeof item === 'string') {
      return renderComponentFromKey(item, components, sectionKey, patternKey);
    }

    // OBJECT → Nested layout with slot resolution
    if (typeof item === 'object' && item.type) {
      return (
        <React.Fragment key={index}>
          {renderCardFromTemplate(item, slotMappings, components, sectionKey, patternKey)}
        </React.Fragment>
      );
    }

    return null;
  }).filter(Boolean);
};
