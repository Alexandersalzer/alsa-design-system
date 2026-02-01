import React from 'react';
import { ComponentNode } from '../types/nodes';
import { componentRegistry } from '../../components/registry';
import { animationComponents } from '../../components/animations/registry';
import { AnimationConfig } from '../../components/animations/types';
import { 
  parseLayoutNode, 
  isLayoutNode, 
  isComponentReference, 
  extractSlotName,
  getLayoutItemOrder,
  getLayoutCategoryOrder,
  getCategoryItemOrder,
  findLayoutItem,
  findLayoutCategory,
  findCategoryItem,
  hasCategories
} from '../utils/props';

/**
 * Main entry: Renders layout with template system (NEW UNIFIED APPROACH)
 * Works with ANY layout primitive - completely generic
 * 
 * @param layout - Layout definition from pattern.layout
 * @param components - All available components from pattern
 * @param sectionKey - Section context
 * @param patternKey - Pattern context
 * @param patternProps - Pattern-level props (align, etc) to merge with layout config
 * @param animationConfig - Optional animation config for items (fadeIn with stagger)
 * @returns Rendered React element tree
 */
export const renderLayoutWithTemplate = (
  layout: Record<string, any>,
  components: Record<string, ComponentNode>,
  sectionKey?: string,
  patternKey?: string,
  patternProps?: Record<string, any>,
  animationConfig?: AnimationConfig
): React.ReactElement | null => {
  
  // Destructure layout-system props to prevent them from being passed to DOM elements
  const { 
    type: parentType, 
    template, 
    items,
    itemOrder,
    categories,
    categoryOrder,
    categoryTemplate,
    order, // legacy
    ...parentLayoutProps 
  } = layout;

  // Map align values to HStack justify values
  // align uses semantic names (left, center, right, end) while HStack uses flexbox names (start, center, end)
  const alignToJustifyMap: Record<string, string> = {
    left: 'start',
    start: 'start',
    center: 'center',
    right: 'end',
    end: 'end',
  };

  // Map mobileAlign to mobileJustify
  const mobileJustify = patternProps?.mobileAlign 
    ? alignToJustifyMap[patternProps.mobileAlign] || patternProps.mobileAlign
    : undefined;

  // Merge pattern props with layout props
  // For hstack: map align to justify for horizontal alignment
  const mergedLayoutProps = {
    ...parentLayoutProps,
    ...(parentType === 'hstack' && patternProps?.align && { 
      justify: alignToJustifyMap[patternProps.align] || patternProps.align 
    }),
    ...(parentType === 'hstack' && mobileJustify && { mobileJustify }),
    // For other layout types, pass align directly
    ...(parentType !== 'hstack' && patternProps?.align && { align: patternProps.align })
  };

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
  
  // Extract animation settings if applicable
  const animationType = animationConfig?.type;
  const animationSettings = (animationConfig?.settings || {}) as Record<string, any>;
  
  // Get animation component from registry (e.g., "fadeIn" -> animationComponents["fadeIn"])
  const AnimationComponent = animationType ? animationComponents[animationType] : null;

  // Check if layout uses categories (nested structure)
  if (hasCategories(layout)) {
    return renderCategorizedLayout(
      layout,
      template,
      ParentLayout,
      mergedLayoutProps,
      AnimationComponent,
      animationSettings,
      sectionKey,
      patternKey
    );
  }

  // Flat items structure - use helper to get resolved item order
  const resolvedItemOrder = getLayoutItemOrder(layout);
  
  // Render template for each item
  const renderedItems = renderItems(
    resolvedItemOrder,
    (itemId) => findLayoutItem(layout, itemId),
    template,
    AnimationComponent,
    animationSettings,
    sectionKey,
    patternKey
  );

  return (
    <ParentLayout {...mergedLayoutProps}>
      {renderedItems}
    </ParentLayout>
  );
};

/**
 * Form-action types that require wrapping in a <form> element
 */
const FORM_ACTION_TYPES = ['contact', 'newsletter', 'booking'];

/**
 * Checks if an item's components contain any form-action buttons
 */
const hasFormAction = (itemComponents: Record<string, any>): boolean => {
  if (!itemComponents) return false;
  
  return Object.values(itemComponents).some((component: any) => {
    if (component?.type === 'button' && component?.props?.action?.type) {
      return FORM_ACTION_TYPES.includes(component.props.action.type);
    }
    return false;
  });
};

/**
 * Renders items from an array using template
 * Shared logic for both flat and categorized layouts
 */
const renderItems = (
  itemOrder: string[],
  findItem: (id: string) => Record<string, any> | undefined,
  template: Record<string, any>,
  AnimationComponent: React.ComponentType<any> | null,
  animationSettings: Record<string, any>,
  sectionKey?: string,
  patternKey?: string,
  indexOffset: number = 0
): React.ReactNode[] => {
  return itemOrder.map((itemId, localIndex) => {
    const item = findItem(itemId);
    if (!item) {
      console.warn(`Item "${itemId}" not found`);
      return null;
    }

    const globalIndex = indexOffset + localIndex;

    // Create item context with index and any item-level props (excluding 'components')
    const { components: _, ...itemProps } = item;
    const itemContext = {
      index: globalIndex,
      localIndex,
      id: itemId,
      ...itemProps
    };

    // Track used components within this item to support multiple components of same type
    const usedComponents = new Set<string>();

    // Render each child in template.children array
    const templateChildren = template.children || [];
    const isFormItem = hasFormAction(item.components);
    
    const templateContent = templateChildren.map((child: any, index: number) => (
      <React.Fragment key={index}>
        {renderTemplateNode(child, item.components, itemContext, usedComponents, sectionKey, patternKey)}
      </React.Fragment>
    ));
    
    // Wrap in <form> if item contains form-action buttons
    const itemContent = isFormItem ? (
      <form key={itemId} onSubmit={(e) => e.preventDefault()}>
        {templateContent}
      </form>
    ) : (
      <React.Fragment key={itemId}>
        {templateContent}
      </React.Fragment>
    );
    
    // Wrap with animation component if configured (dynamic from registry)
    if (AnimationComponent) {
      // Calculate stagger delay if stagger is set
      const staggerDelay = (animationSettings.stagger || 0) * globalIndex;
      const baseDelay = animationSettings.delay || 0;
      
      // Merge animation settings with calculated delay
      const itemAnimationProps = {
        ...animationSettings,
        delay: baseDelay + staggerDelay,
      };
      
      return (
        <AnimationComponent key={itemId} {...itemAnimationProps}>
          {itemContent}
        </AnimationComponent>
      );
    }
    
    return itemContent;
  }).filter(Boolean);
};

/**
 * Renders layout with categories (nested structure)
 * Each category contains its own items
 */
const renderCategorizedLayout = (
  layout: Record<string, any>,
  template: Record<string, any>,
  ParentLayout: React.ComponentType<any>,
  layoutProps: Record<string, any>,
  AnimationComponent: React.ComponentType<any> | null,
  animationSettings: Record<string, any>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement => {
  const categoryOrder = getLayoutCategoryOrder(layout);
  const { categoryTemplate } = layout;
  
  let globalItemIndex = 0;
  
  const renderedCategories = categoryOrder.map((categoryId, categoryIndex) => {
    const category = findLayoutCategory(layout, categoryId);
    if (!category) {
      console.warn(`Category "${categoryId}" not found in layout categories`);
      return null;
    }
    
    const itemOrder = getCategoryItemOrder(category);
    
    // Render items within this category
    const renderedItems = renderItems(
      itemOrder,
      (itemId) => findCategoryItem(category, itemId),
      template,
      AnimationComponent,
      animationSettings,
      sectionKey,
      patternKey,
      globalItemIndex
    );
    
    globalItemIndex += itemOrder.length;
    
    // If categoryTemplate exists, wrap items in category template
    if (categoryTemplate) {
      const CategoryWrapper = componentRegistry[categoryTemplate.type];
      if (CategoryWrapper) {
        const { type: _, ...categoryProps } = categoryTemplate;
        return (
          <CategoryWrapper key={categoryId} {...categoryProps} {...category.props}>
            {renderedItems}
          </CategoryWrapper>
        );
      }
    }
    
    // Otherwise return items directly
    return (
      <React.Fragment key={categoryId}>
        {renderedItems}
      </React.Fragment>
    );
  }).filter(Boolean);

  return (
    <ParentLayout {...layoutProps}>
      {renderedCategories}
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
 * 
 * @param usedComponents - Set of component keys already rendered (for multiple same-type support)
 */
const renderTemplateNode = (
  node: Record<string, any>,
  itemComponents: Record<string, ComponentNode>,
  itemContext: Record<string, any>,
  usedComponents: Set<string>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  
  // Check what kind of node this is
  if (isComponentReference(node)) {
    return renderComponentReference(node, itemComponents, usedComponents, sectionKey, patternKey);
  }

  if (isLayoutNode(node)) {
    return renderLayoutNodeGeneric(node, itemComponents, itemContext, usedComponents, sectionKey, patternKey);
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
  itemContext: Record<string, any>,
  usedComponents: Set<string>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  let { layoutType, layoutProps, children } = parseLayoutNode(node);

  // Apply item-level overrides for specific layout types
  if (layoutType === 'hstack' && itemContext?.reverse) {
    layoutProps = { ...layoutProps, direction: 'row-reverse' };
  }

  // Get layout component from registry
  const LayoutComponent = componentRegistry[layoutType];
  if (!LayoutComponent) {
    console.warn(`Layout type "${layoutType}" not found in registry`);
    return null;
  }

  // Self-closing components (like divider/hr) cannot have children
  const isSelfClosing = layoutType === 'divider';
  if (isSelfClosing) {
    return <LayoutComponent {...layoutProps} />;
  }

  // Recursively render children for components that support them
  const renderedChildren = children.map((child: any, index: number) => (
    <React.Fragment key={index}>
      {renderTemplateNode(child, itemComponents, itemContext, usedComponents, sectionKey, patternKey)}
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
 * Finds the next available component by type that hasn't been used yet
 * Supports multiple components of the same type in one item
 * 
 * @param components - Record of ComponentNodes keyed by componentId
 * @param type - Component type to find (e.g., "body", "heading")
 * @param usedComponents - Set of component keys already used
 * @returns { component, key } or undefined
 */
const findNextComponentByType = (
  components: Record<string, any>,
  type: string,
  usedComponents: Set<string>
): { component: Record<string, any>; key: string } | undefined => {
  const entry = Object.entries(components).find(
    ([key, component]) => component.type === type && !usedComponents.has(key)
  );
  return entry ? { component: entry[1], key: entry[0] } : undefined;
};

/**
 * Renders component reference: { component: "${componentType}" }
 * Matches component by TYPE, not by key name
 * Supports multiple components of same type (renders them in order)
 * Extra props in the reference override component props (for template-level styling)
 * 
 * Template: { component: "${body}" }, { component: "${body}" }
 * Items: { body_abc: { type: "body", ... }, body_def: { type: "body", ... } }
 * Result: First ${body} renders body_abc, second ${body} renders body_def
 */
const renderComponentReference = (
  reference: Record<string, any>,
  itemComponents: Record<string, ComponentNode>,
  usedComponents: Set<string>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  const { component: componentRef, animation: templateAnimation, ...extraProps } = reference;

  // Extract type from ${componentType} syntax
  const componentType = extractSlotName(componentRef);
  
  // Find next available component by TYPE (supports multiple of same type)
  const result = findNextComponentByType(itemComponents, componentType, usedComponents);

  if (!result) {
    console.warn(`Component with type "${componentType}" not found in item components (or all already used)`);
    return null;
  }

  const { component: itemComponent, key: componentKey } = result;
  
  // Mark this component as used
  usedComponents.add(componentKey);

  const Component = componentRegistry[componentType];
  if (!Component) {
    console.warn(`Component type "${componentType}" not found in registry`);
    return null;
  }

  // Merge props: item.props (content) < template extraProps (styling)
  const mergedProps = {
    ...(itemComponent?.props || {}),
    ...extraProps
  };
  
  // Render the component
  const renderedComponent = <Component {...mergedProps} />;
  
  // Check for animation (template animation takes precedence, then item animation)
  const animationConfig = templateAnimation || itemComponent?.animation;
  
  if (animationConfig && animationConfig.type && animationConfig.type !== 'none') {
    const AnimationComponent = animationComponents[animationConfig.type];
    if (AnimationComponent) {
      return (
        <AnimationComponent {...(animationConfig.settings || {})}>
          {renderedComponent}
        </AnimationComponent>
      );
    }
    console.warn(`Animation component for type "${animationConfig.type}" not found in registry`);
  }
  
  return renderedComponent;
};

// ===== LEGACY EXPORT (kept for backward compatibility) =====
// This will be removed once all patterns are migrated to template system
export const renderLayoutWithCards = renderLayoutWithTemplate;