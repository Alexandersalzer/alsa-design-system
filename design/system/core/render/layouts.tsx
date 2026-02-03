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
  findLayoutCategory,
  hasCategories
} from '../utils/props';

/**
 * Main entry: Renders layout with unified template tree system
 * Works with ANY layout primitive - completely generic
 *
 * @param layout - Layout definition from pattern.layout
 * @param components - All available components from pattern (for flat layouts)
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

  const { template, order } = layout;

  // If no template, render simple layout (fallback to old system)
  if (!template) {
    return renderSimpleLayout(layout, components, order);
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
      AnimationComponent,
      animationSettings,
      patternProps,
      sectionKey,
      patternKey
    );
  }

  // Flat items structure
  const resolvedItemOrder = getLayoutItemOrder(layout);

  // Render template tree for flat items
  return renderTemplateTree(
    template,
    { items: layout.items, itemOrder: resolvedItemOrder },
    {},
    AnimationComponent,
    animationSettings,
    patternProps,
    sectionKey,
    patternKey
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
 * UNIFIED TEMPLATE TREE RENDERER
 *
 * This is the core rendering function that handles the unified template tree structure.
 * It recursively walks through the template tree and:
 * 1. Renders layout nodes with their props
 * 2. Renders component references from the current context
 * 3. Detects nested templates and switches context to iterate items
 *
 * @param templateNode - Current node in the template tree
 * @param dataContext - Data context containing items/categories and their order
 * @param currentComponents - Components available in current context (category.components or item.components)
 * @param AnimationComponent - Animation wrapper component
 * @param animationSettings - Animation settings
 * @param patternProps - Pattern-level props (align, etc)
 * @param sectionKey - Section context
 * @param patternKey - Pattern context
 * @param itemIndexOffset - Offset for global item indexing (for stagger animations)
 */
const renderTemplateTree = (
  templateNode: Record<string, any>,
  dataContext: {
    items?: Record<string, any>[];
    itemOrder?: string[];
    categories?: Record<string, any>[];
    categoryOrder?: string[];
  },
  currentComponents: Record<string, ComponentNode>,
  AnimationComponent: React.ComponentType<any> | null,
  animationSettings: Record<string, any>,
  patternProps?: Record<string, any>,
  sectionKey?: string,
  patternKey?: string,
  itemIndexOffset: number = 0
): React.ReactElement | null => {

  // Extract template structure
  const { children } = templateNode;

  if (!children || !Array.isArray(children)) {
    console.warn('Template node has no children array:', templateNode);
    return null;
  }

  // Render each child in the template tree
  return (
    <>
      {children.map((child: any, index: number) => (
        <React.Fragment key={index}>
          {renderTemplateTreeNode(
            child,
            dataContext,
            currentComponents,
            {},
            new Set(),
            AnimationComponent,
            animationSettings,
            patternProps,
            sectionKey,
            patternKey,
            itemIndexOffset
          )}
        </React.Fragment>
      ))}
    </>
  );
};

/**
 * Renders a single node in the template tree
 * This node can be:
 * 1. A component reference { component: "${type}" } - renders from currentComponents
 * 2. A layout node with nested template - switches context to iterate items
 * 3. A layout node without nested template - renders children normally
 */
const renderTemplateTreeNode = (
  node: Record<string, any>,
  dataContext: {
    items?: Record<string, any>[];
    itemOrder?: string[];
    categories?: Record<string, any>[];
    categoryOrder?: string[];
  },
  currentComponents: Record<string, ComponentNode>,
  currentContext: Record<string, any>,
  usedComponents: Set<string>,
  AnimationComponent: React.ComponentType<any> | null,
  animationSettings: Record<string, any>,
  patternProps?: Record<string, any>,
  sectionKey?: string,
  patternKey?: string,
  itemIndexOffset: number = 0
): React.ReactElement | null => {

  // Check if this is a component reference
  if (isComponentReference(node)) {
    return renderComponentReference(
      node,
      currentComponents,
      usedComponents,
      sectionKey,
      patternKey
    );
  }

  // Check if this is a layout node
  if (isLayoutNode(node)) {
    return renderLayoutNodeWithTemplate(
      node,
      dataContext,
      currentComponents,
      currentContext,
      usedComponents,
      AnimationComponent,
      animationSettings,
      patternProps,
      sectionKey,
      patternKey,
      itemIndexOffset
    );
  }

  console.warn('Invalid template node:', node);
  return null;
};

/**
 * Renders a layout node that may contain:
 * 1. A nested template - switches context to iterate items/categories
 * 2. Regular children - renders them in the current context
 */
const renderLayoutNodeWithTemplate = (
  node: Record<string, any>,
  dataContext: {
    items?: Record<string, any>[];
    itemOrder?: string[];
    categories?: Record<string, any>[];
    categoryOrder?: string[];
  },
  currentComponents: Record<string, ComponentNode>,
  currentContext: Record<string, any>,
  usedComponents: Set<string>,
  AnimationComponent: React.ComponentType<any> | null,
  animationSettings: Record<string, any>,
  patternProps?: Record<string, any>,
  sectionKey?: string,
  patternKey?: string,
  itemIndexOffset: number = 0
): React.ReactElement | null => {

  let { layoutType, layoutProps, children } = parseLayoutNode(node);

  // Apply pattern-level props (align -> justify for hstack)
  layoutProps = applyPatternPropsToLayout(layoutType, layoutProps, patternProps);

  // Apply context-level overrides (e.g., reverse from item context)
  layoutProps = applyContextOverrides(layoutType, layoutProps, currentContext);

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

  // Check if this layout node has a nested template
  const nestedTemplate = node.template;

  if (nestedTemplate) {
    // This layout node contains a nested template - switch context to iterate items
    return renderLayoutWithNestedTemplate(
      LayoutComponent,
      layoutProps,
      nestedTemplate,
      dataContext,
      AnimationComponent,
      animationSettings,
      patternProps,
      sectionKey,
      patternKey,
      itemIndexOffset
    );
  }

  // No nested template - render children in current context
  const renderedChildren = children.map((child: any, index: number) => (
    <React.Fragment key={index}>
      {renderTemplateTreeNode(
        child,
        dataContext,
        currentComponents,
        currentContext,
        usedComponents,
        AnimationComponent,
        animationSettings,
        patternProps,
        sectionKey,
        patternKey,
        itemIndexOffset
      )}
    </React.Fragment>
  ));

  return (
    <LayoutComponent {...layoutProps}>
      {renderedChildren}
    </LayoutComponent>
  );
};

/**
 * Renders a layout node with a nested template
 * This switches context from category-level to item-level iteration
 */
const renderLayoutWithNestedTemplate = (
  LayoutComponent: React.ComponentType<any>,
  layoutProps: Record<string, any>,
  nestedTemplate: Record<string, any>,
  dataContext: {
    items?: Record<string, any>[];
    itemOrder?: string[];
    categories?: Record<string, any>[];
    categoryOrder?: string[];
  },
  AnimationComponent: React.ComponentType<any> | null,
  animationSettings: Record<string, any>,
  patternProps?: Record<string, any>,
  sectionKey?: string,
  patternKey?: string,
  itemIndexOffset: number = 0
): React.ReactElement => {

  const { items, itemOrder } = dataContext;

  if (!items || !itemOrder) {
    console.warn('Nested template found but no items in data context');
    return <LayoutComponent {...layoutProps} />;
  }

  // Map through items and render nested template for each
  const renderedItems = itemOrder.map((itemId, localIndex) => {
    const item = items.find((i: any) => i.id === itemId);
    if (!item) {
      console.warn(`Item "${itemId}" not found`);
      return null;
    }

    const globalIndex = itemIndexOffset + localIndex;

    // Create item context with index and any item-level props (excluding 'components')
    const { components: _, ...itemProps } = item;
    const itemContext = {
      index: globalIndex,
      localIndex,
      id: itemId,
      ...itemProps
    };

    // Track used components within this item
    const usedComponents = new Set<string>();

    // Check if item has form actions
    const isFormItem = hasFormAction(item.components);

    // Render nested template with item.components as context
    const nestedChildren = (nestedTemplate.children || []).map((child: any, idx: number) => (
      <React.Fragment key={idx}>
        {renderTemplateTreeNode(
          child,
          dataContext,
          item.components,
          itemContext,
          usedComponents,
          AnimationComponent,
          animationSettings,
          patternProps,
          sectionKey,
          patternKey,
          itemIndexOffset
        )}
      </React.Fragment>
    ));

    // Wrap in form if needed
    const itemContent = isFormItem ? (
      <form key={itemId} onSubmit={(e) => e.preventDefault()} style={{ display: 'contents' }}>
        {nestedChildren}
      </form>
    ) : (
      <React.Fragment key={itemId}>
        {nestedChildren}
      </React.Fragment>
    );

    // Wrap with animation if configured
    if (AnimationComponent) {
      const staggerDelay = (animationSettings.stagger || 0) * globalIndex;
      const baseDelay = animationSettings.delay || 0;

      return (
        <AnimationComponent key={itemId} {...animationSettings} delay={baseDelay + staggerDelay}>
          {itemContent}
        </AnimationComponent>
      );
    }

    return itemContent;
  }).filter(Boolean);

  return (
    <LayoutComponent {...layoutProps}>
      {renderedItems}
    </LayoutComponent>
  );
};

/**
 * Renders layout with categories (nested structure)
 * Each category is rendered using the template tree
 */
const renderCategorizedLayout = (
  layout: Record<string, any>,
  AnimationComponent: React.ComponentType<any> | null,
  animationSettings: Record<string, any>,
  patternProps?: Record<string, any>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {

  const { template, categories } = layout;
  const categoryOrder = getLayoutCategoryOrder(layout);

  let globalItemIndex = 0;

  // Render each category using the template tree
  const renderedCategories = categoryOrder.map((categoryId) => {
    const category = findLayoutCategory(layout, categoryId);
    if (!category) {
      console.warn(`Category "${categoryId}" not found in layout categories`);
      return null;
    }

    const itemOrder = getCategoryItemOrder(category);

    // Prepare data context for this category
    const categoryDataContext = {
      items: category.items,
      itemOrder,
    };

    // Render the template tree with category.components as context
    const renderedCategory = renderTemplateTree(
      template,
      categoryDataContext,
      category.components || {},
      AnimationComponent,
      animationSettings,
      patternProps,
      sectionKey,
      patternKey,
      globalItemIndex
    );

    globalItemIndex += itemOrder.length;

    return <React.Fragment key={categoryId}>{renderedCategory}</React.Fragment>;
  }).filter(Boolean);

  return <>{renderedCategories}</>;
};

/**
 * Applies pattern-level props to layout props
 */
const applyPatternPropsToLayout = (
  layoutType: string,
  layoutProps: Record<string, any>,
  patternProps?: Record<string, any>
): Record<string, any> => {
  if (!patternProps) return layoutProps;

  const alignToJustifyMap: Record<string, string> = {
    left: 'start',
    start: 'start',
    center: 'center',
    right: 'end',
    end: 'end',
  };

  // For hstack: map align to justify
  if (layoutType === 'hstack' && patternProps.align) {
    layoutProps = {
      ...layoutProps,
      justify: alignToJustifyMap[patternProps.align] || patternProps.align
    };
  }

  // Map mobileAlign to mobileJustify
  if (layoutType === 'hstack' && patternProps.mobileAlign) {
    const mobileJustify = alignToJustifyMap[patternProps.mobileAlign] || patternProps.mobileAlign;
    layoutProps = { ...layoutProps, mobileJustify };
  }

  // For other layout types, pass align directly
  if (layoutType !== 'hstack' && patternProps.align) {
    layoutProps = { ...layoutProps, align: patternProps.align };
  }

  return layoutProps;
};

/**
 * Applies context-level overrides to layout props
 */
const applyContextOverrides = (
  layoutType: string,
  layoutProps: Record<string, any>,
  context: Record<string, any>
): Record<string, any> => {
  // Apply item-level reverse for hstack
  if (layoutType === 'hstack' && context?.reverse) {
    layoutProps = { ...layoutProps, direction: 'row-reverse' };
  }

  // Add filterTags as data attribute
  if (context?.filterTags && Array.isArray(context.filterTags)) {
    layoutProps = { ...layoutProps, 'data-filter-tags': context.filterTags.join(',') };
  }

  // Handle action prop - convert to onCardClick
  if (layoutProps.action) {
    const action = layoutProps.action;

    if (action.type === 'navigation' && action.settings?.href) {
      let resolvedHref = action.settings.href;

      // Replace placeholders with context values
      Object.keys(context).forEach(key => {
        const placeholder = `\${${key}}`;
        if (resolvedHref.includes(placeholder)) {
          resolvedHref = resolvedHref.replace(placeholder, context[key]);
        }
      });

      const onCardClick = () => {
        if (action.settings.openInNewTab) {
          window.open(resolvedHref, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = resolvedHref;
        }
      };

      layoutProps = { ...layoutProps, onCardClick };
      delete layoutProps.action;
    }
  }

  return layoutProps;
};

/**
 * Renders simple layout without template (LEGACY FALLBACK)
 * Used when pattern.layout exists but has no template
 */
const renderSimpleLayout = (
  layout: Record<string, any>,
  components: Record<string, ComponentNode>,
  order?: string[]
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
 * Finds the next available component by type that hasn't been used yet
 * Supports multiple components of the same type in one item
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

  // Render the component with componentKey for DOM identification
  const renderedComponent = (
    <Component
      {...mergedProps}
      componentKey={componentKey}
      sectionKey={sectionKey}
      patternKey={patternKey}
    />
  );

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
