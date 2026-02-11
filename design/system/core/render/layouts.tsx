import React from 'react';
import { ComponentNode } from '../types/nodes';
import { componentRegistry } from '../../components/registry';
import { animationComponents } from '../../components/animations/registry';
import { AnimationConfig } from '../../components/animations/types';
import { FilterProvider } from '../context/FilterContext';
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
import './layouts.css';

/**
 * Type for responsive maxItems value
 */
interface ResponsiveMaxItems {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}

/**
 * Applies maxItems limiting to item order array
 * Supports both static number and responsive object: { base: 6, md: 9, lg: 18 }
 * Uses CSS classes to hide items beyond the limit at each breakpoint
 */
const applyMaxItemsLimit = (
  itemOrder: string[],
  maxItems?: number | ResponsiveMaxItems
): string[] => {
  // If no maxItems specified, return all items
  if (!maxItems) return itemOrder;

  // If maxItems is a number, return sliced array (backward compatible)
  if (typeof maxItems === 'number') {
    return itemOrder.slice(0, maxItems);
  }

  // For responsive maxItems, we return all items but will add CSS classes
  // to hide items beyond the limit at each breakpoint
  return itemOrder;
};

/**
 * Gets CSS classes for item based on its index and responsive maxItems config
 * Returns classes that will hide the item at appropriate breakpoints
 */
const getMaxItemsClasses = (
  index: number,
  maxItems?: number | ResponsiveMaxItems
): string => {
  if (!maxItems || typeof maxItems === 'number') return '';

  const classes: string[] = [];
  const responsive = maxItems as ResponsiveMaxItems;

  // Check each breakpoint and add hide class if index exceeds limit
  if (responsive.base !== undefined && index >= responsive.base) {
    classes.push('hide-on-base');
  }
  if (responsive.sm !== undefined && index >= responsive.sm) {
    classes.push('hide-on-sm');
  }
  if (responsive.md !== undefined && index >= responsive.md) {
    classes.push('hide-on-md');
  }
  if (responsive.lg !== undefined && index >= responsive.lg) {
    classes.push('hide-on-lg');
  }
  if (responsive.xl !== undefined && index >= responsive.xl) {
    classes.push('hide-on-xl');
  }
  if (responsive['2xl'] !== undefined && index >= responsive['2xl']) {
    classes.push('hide-on-2xl');
  }

  return classes.join(' ');
};

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
    maxItems,
    categories,
    categoryOrder,
    categoryTemplate,
    context, // filter context for Tab/Grid filtering
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

  // FILTER CONTEXT MODE: Special rendering for filter patterns
  // - Parent layout renders ONCE (no iteration)
  // - Child templates with `template` prop iterate over categories OR items
  // - Grid with filterAware iterates items, other templates iterate categories
  if (context === 'filter' && categories && categories.length > 0) {
    return renderFilterLayout(
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

  // Check if layout uses categories (nested structure) - LEGACY categorized layout
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

  // Apply maxItems limiting if specified
  const limitedItemOrder = applyMaxItemsLimit(resolvedItemOrder, maxItems);

  // Render template for each item
  const renderedItems = renderItems(
    limitedItemOrder,
    (itemId) => findLayoutItem(layout, itemId),
    template,
    AnimationComponent,
    animationSettings,
    sectionKey,
    patternKey,
    0,
    maxItems
  );

  return (
    <ParentLayout {...mergedLayoutProps}>
      {renderedItems}
    </ParentLayout>
  );
};

/**
 * FILTER LAYOUT MODE
 * Renders layout with filter context where:
 * - Parent layout renders ONCE (no iteration at parent level)
 * - Template children with `template` prop iterate over categories (for tabs)
 * - Template children with `filterAware` iterate over items (for grids)
 * The system is smart: nodes with template auto-detect what to iterate based on filterAware
 */
const renderFilterLayout = (
  layout: Record<string, any>,
  template: Record<string, any>,
  ParentLayout: React.ComponentType<any>,
  layoutProps: Record<string, any>,
  AnimationComponent: React.ComponentType<any> | null,
  animationSettings: Record<string, any>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement => {
  const { categories, items } = layout;
  const categoryOrder = getLayoutCategoryOrder(layout);
  const allItemIds = items?.map((item: any) => item.id) || [];

  // Render template children - each child determines its own iteration
  const renderedChildren = template.children?.map((child: any, index: number) => {
    return (
      <React.Fragment key={index}>
        {renderFilterTemplateNode(
          child,
          layout,
          categoryOrder,
          allItemIds,
          AnimationComponent,
          animationSettings,
          sectionKey,
          patternKey
        )}
      </React.Fragment>
    );
  });

  return (
    <FilterProvider categories={categories} allItemIds={allItemIds}>
      <ParentLayout {...layoutProps}>
        {renderedChildren}
      </ParentLayout>
    </FilterProvider>
  );
};

/**
 * Resolves ${...} placeholders in props using context values
 * e.g., categoryId: "${id}" with context { id: "category-all" } → categoryId: "category-all"
 */
const resolvePropsWithContext = (
  props: Record<string, any>,
  context: Record<string, any>
): Record<string, any> => {
  const resolved: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
      // Extract variable name from ${varName}
      const varName = value.slice(2, -1);
      resolved[key] = context[varName] ?? value; // Use context value or keep original
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively resolve nested objects
      resolved[key] = resolvePropsWithContext(value, context);
    } else {
      resolved[key] = value;
    }
  }
  
  return resolved;
};

/**
 * Renders a template node in filter context
 * Smart detection:
 * - If node has `template` + `filterAware`: iterate over items
 * - If node has `template` (no filterAware): iterate over categories
 * - Otherwise: render as static node
 */
const renderFilterTemplateNode = (
  node: Record<string, any>,
  layout: Record<string, any>,
  categoryOrder: string[],
  allItemIds: string[],
  AnimationComponent: React.ComponentType<any> | null,
  animationSettings: Record<string, any>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  const { type, template, filterAware, children, ...nodeProps } = node;

  // Get component from registry
  const NodeComponent = componentRegistry[type];
  if (!NodeComponent) {
    console.warn(`Component type "${type}" not found in registry`);
    return null;
  }

  // CASE 1: Node has template + filterAware → iterate over ITEMS
  if (template && filterAware) {
    const renderedItems = allItemIds.map((itemId, index) => {
      const item = findLayoutItem(layout, itemId);
      if (!item) return null;

      const { components: _, ...itemProps } = item;
      const itemContext = { index, id: itemId, ...itemProps };
      const usedComponents = new Set<string>();

      const templateContent = template.children?.map((child: any, childIndex: number) => (
        <React.Fragment key={childIndex}>
          {renderTemplateNode(child, item.components, itemContext, usedComponents, sectionKey, patternKey, itemId)}
        </React.Fragment>
      ));

      // Wrap each item with data-item-key for filtering
      const itemContent = (
        <div key={itemId} data-item-key={itemId} style={{ display: 'contents' }}>
          {templateContent}
        </div>
      );

      // Apply animation if configured
      if (AnimationComponent) {
        const staggerDelay = (animationSettings.stagger || 0) * index;
        const baseDelay = animationSettings.delay || 0;
        return (
          <AnimationComponent key={itemId} {...animationSettings} delay={baseDelay + staggerDelay}>
            {itemContent}
          </AnimationComponent>
        );
      }

      return itemContent;
    }).filter(Boolean);

    return <NodeComponent {...nodeProps} filterAware={filterAware}>{renderedItems}</NodeComponent>;
  }

  // CASE 2: Node has template (no filterAware) → iterate over CATEGORIES
  if (template) {
    const renderedCategories = categoryOrder.map((categoryId, index) => {
      const category = findLayoutCategory(layout, categoryId);
      if (!category) return null;

      const categoryContext = { index, id: categoryId, ...category };
      const usedComponents = new Set<string>();

      // Render each template child for this category
      const templateContent = template.children?.map((child: any, childIndex: number) => {
        // Resolve ${...} placeholders in child props with category context
        const { children: childChildren, ...childProps } = child;
        const resolvedProps = resolvePropsWithContext(childProps, categoryContext);
        
        // Auto-inject categoryId for Tab components in filter context
        if (resolvedProps.type === 'tab' && !resolvedProps.categoryId) {
          resolvedProps.categoryId = categoryId;
        }
        
        const resolvedChild = { ...resolvedProps, children: childChildren };
        
        return (
          <React.Fragment key={childIndex}>
            {renderTemplateNode(resolvedChild, category.components || {}, categoryContext, usedComponents, sectionKey, patternKey)}
          </React.Fragment>
        );
      });

      return <React.Fragment key={categoryId}>{templateContent}</React.Fragment>;
    }).filter(Boolean);

    return <NodeComponent {...nodeProps}>{renderedCategories}</NodeComponent>;
  }

  // CASE 3: Static node with children - recursively process
  if (children) {
    const renderedChildren = children.map((child: any, index: number) => (
      <React.Fragment key={index}>
        {renderFilterTemplateNode(
          child,
          layout,
          categoryOrder,
          allItemIds,
          AnimationComponent,
          animationSettings,
          sectionKey,
          patternKey
        )}
      </React.Fragment>
    ));

    return <NodeComponent {...nodeProps}>{renderedChildren}</NodeComponent>;
  }

  // CASE 4: Leaf node - render as-is
  return <NodeComponent {...nodeProps} />;
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
  indexOffset: number = 0,
  maxItems?: number | ResponsiveMaxItems
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

    // Get maxItems classes for responsive hiding
    const maxItemsClasses = getMaxItemsClasses(globalIndex, maxItems);

    const templateContent = templateChildren.map((child: any, index: number) => (
      <React.Fragment key={index}>
        {renderTemplateNode(child, item.components, itemContext, usedComponents, sectionKey, patternKey, itemId)}
      </React.Fragment>
    ));

    // Wrap in <form> if item contains form-action buttons
    // Use display:contents so form doesn't break grid/flex layouts
    // Add data-item-key for EditorOverlay detection
    // Add maxItems classes for responsive hiding
    const itemContent = isFormItem ? (
      <form
        key={itemId}
        data-item-key={itemId}
        className={maxItemsClasses}
        onSubmit={(e) => e.preventDefault()}
        style={{ display: 'contents' }}
      >
        {templateContent}
      </form>
    ) : (
      <div
        key={itemId}
        data-item-key={itemId}
        className={maxItemsClasses}
        style={{ display: 'contents' }}
      >
        {templateContent}
      </div>
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
 * Renders category components (e.g., heading + body for sticky headers)
 * These are rendered as direct component instances
 */
const renderCategoryComponents = (
  categoryComponents: Record<string, ComponentNode>,
  categoryComponentTemplate: Record<string, any> | undefined,
  sectionKey?: string,
  patternKey?: string
): React.ReactNode => {
  // If we have a categoryComponentTemplate, render the template with components
  if (categoryComponentTemplate) {
    const usedComponents = new Set<string>();
    const categoryContext = { id: 'category-header' };

    return renderTemplateNode(
      categoryComponentTemplate,
      categoryComponents,
      categoryContext,
      usedComponents,
      sectionKey,
      patternKey
    );
  }

  // Otherwise render components directly
  return Object.entries(categoryComponents).map(([componentKey, componentNode]) => {
    const Component = componentRegistry[componentNode.type];
    if (!Component) {
      console.warn(`Component type "${componentNode.type}" not found in registry`);
      return null;
    }

    return (
      <Component
        key={componentKey}
        {...componentNode.props}
        componentKey={componentKey}
        sectionKey={sectionKey}
        patternKey={patternKey}
      />
    );
  }).filter(Boolean);
};

/**
 * Renders layout with categories (nested structure)
 * NEW APPROACH: Uses unified template tree where items template can be nested anywhere
 * The presence of a 'template' property on a node signals: iterate items and render this template for each
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
  const { categoryTemplate, categoryComponentTemplate, itemsWrapper } = layout;

  // LEGACY SUPPORT: If old structure exists (categoryTemplate, itemsWrapper), use old logic
  if (categoryTemplate || categoryComponentTemplate || itemsWrapper) {
    return renderCategorizedLayoutLegacy(
      layout,
      template,
      ParentLayout,
      layoutProps,
      AnimationComponent,
      animationSettings,
      sectionKey,
      patternKey
    );
  }

  // NEW UNIFIED APPROACH: Render categories using template.children recursively
  let globalItemIndex = 0;

  const renderedCategories = categoryOrder.map((categoryId) => {
    const category = findLayoutCategory(layout, categoryId);
    if (!category) {
      console.warn(`Category "${categoryId}" not found in layout categories`);
      return null;
    }

    const itemOrder = getCategoryItemOrder(category);

    // Render the category template for this category
    // Pass layout so nested templates can lookup items by ID
    const categoryContent = template.children?.map((child: any, index: number) => (
      <React.Fragment key={index}>
        {renderCategoryTemplateNode(
          child,
          category.components || {},
          layout,  // Pass entire layout for item lookup
          itemOrder,
          AnimationComponent,
          animationSettings,
          sectionKey,
          patternKey,
          globalItemIndex
        )}
      </React.Fragment>
    ));

    globalItemIndex += itemOrder.length;

    return <React.Fragment key={categoryId}>{categoryContent}</React.Fragment>;
  }).filter(Boolean);

  return (
    <ParentLayout {...layoutProps}>
      {renderedCategories}
    </ParentLayout>
  );
};

/**
 * LEGACY: Old categorized layout rendering (kept for backward compatibility)
 * Uses categoryTemplate, categoryComponentTemplate, itemsWrapper
 */
const renderCategorizedLayoutLegacy = (
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
  const { categoryTemplate, categoryComponentTemplate, itemsWrapper } = layout;

  let globalItemIndex = 0;

  const renderedCategories = categoryOrder.map((categoryId, categoryIndex) => {
    const category = findLayoutCategory(layout, categoryId);
    if (!category) {
      console.warn(`Category "${categoryId}" not found in layout categories`);
      return null;
    }

    const itemOrder = getCategoryItemOrder(category);

    // Render items within this category - lookup from layout.items[]
    const renderedItems = renderItems(
      itemOrder,
      (itemId) => findLayoutItem(layout, itemId),
      template,
      AnimationComponent,
      animationSettings,
      sectionKey,
      patternKey,
      globalItemIndex
    );

    globalItemIndex += itemOrder.length;

    // Wrap items in itemsWrapper if provided (e.g., Grid)
    let wrappedItems: React.ReactNode = renderedItems;
    if (itemsWrapper) {
      const ItemsWrapperComponent = componentRegistry[itemsWrapper.type];
      if (ItemsWrapperComponent) {
        const { type: _, ...wrapperProps } = itemsWrapper;
        wrappedItems = (
          <ItemsWrapperComponent {...wrapperProps}>
            {renderedItems}
          </ItemsWrapperComponent>
        );
      }
    }

    // Render category components if they exist (e.g., sticky headers)
    const renderedCategoryComponents = category.components
      ? renderCategoryComponents(category.components, categoryComponentTemplate, sectionKey, patternKey)
      : null;

    // If categoryTemplate exists, wrap category components + items in it
    // categoryTemplate typically wraps both the sticky header and the grid of items
    if (categoryTemplate) {
      const CategoryWrapper = componentRegistry[categoryTemplate.type];
      if (CategoryWrapper) {
        const { type: _, ...categoryProps } = categoryTemplate;
        return (
          <CategoryWrapper key={categoryId} {...categoryProps} {...category.props}>
            {renderedCategoryComponents}
            {wrappedItems}
          </CategoryWrapper>
        );
      }
    }

    // Otherwise return category components + items directly
    return (
      <React.Fragment key={categoryId}>
        {renderedCategoryComponents}
        {wrappedItems}
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
 * Renders a template node in category context (NEW UNIFIED APPROACH)
 * If the node has a 'template' property, it iterates category items
 * Otherwise, it's a regular layout/component node using category components
 */
const renderCategoryTemplateNode = (
  node: Record<string, any>,
  categoryComponents: Record<string, ComponentNode>,
  layout: Record<string, any>,  // Full layout for item lookup
  itemOrder: string[],
  AnimationComponent: React.ComponentType<any> | null,
  animationSettings: Record<string, any>,
  sectionKey?: string,
  patternKey?: string,
  globalItemIndexOffset: number = 0
): React.ReactElement | null => {
  // If node has 'template' property, this is where we iterate items
  if (node.template) {
    const renderedItems = itemOrder.map((itemId, localIndex) => {
      // Lookup item from layout.items[] by ID
      const item = findLayoutItem(layout, itemId);
      if (!item) {
        console.warn(`Item "${itemId}" not found in layout items`);
        return null;
      }

      const globalIndex = globalItemIndexOffset + localIndex;
      const { components: _, ...itemProps } = item;
      const itemContext = {
        index: globalIndex,
        localIndex,
        id: itemId,
        ...itemProps
      };

      const usedComponents = new Set<string>();

      // Render the item template with ONLY item components (not merged with category)
      // Category components are for the outer template (e.g., sticky sidebar)
      // Item components are for the inner template (e.g., cards)
      const templateContent = node.template.children?.map((child: any, index: number) => (
        <React.Fragment key={index}>
          {renderTemplateNode(child, item.components, itemContext, usedComponents, sectionKey, patternKey)}
        </React.Fragment>
      ));

      // Wrap with animation if configured
      if (AnimationComponent) {
        const staggerDelay = (animationSettings.stagger || 0) * globalIndex;
        const baseDelay = animationSettings.delay || 0;
        const itemAnimationProps = {
          ...animationSettings,
          delay: baseDelay + staggerDelay,
        };

        return (
          <AnimationComponent key={itemId} {...itemAnimationProps}>
            {templateContent}
          </AnimationComponent>
        );
      }

      return <React.Fragment key={itemId}>{templateContent}</React.Fragment>;
    }).filter(Boolean);

    // Render the wrapper layout node (e.g., grid) with items as children
    if (isLayoutNode(node)) {
      let { layoutType, layoutProps } = parseLayoutNode(node);
      const LayoutComponent = componentRegistry[layoutType];
      if (!LayoutComponent) {
        console.warn(`Layout type "${layoutType}" not found in registry`);
        return null;
      }

      return (
        <LayoutComponent {...layoutProps}>
          {renderedItems}
        </LayoutComponent>
      );
    }

    // If not a layout node, just return items
    return <>{renderedItems}</>;
  }

  // Regular node (no template) - render with category components
  if (isComponentReference(node)) {
    const usedComponents = new Set<string>();
    return renderComponentReference(node, categoryComponents, usedComponents, sectionKey, patternKey);
  }

  if (isLayoutNode(node)) {
    let { layoutType, layoutProps, children } = parseLayoutNode(node);
    const LayoutComponent = componentRegistry[layoutType];
    if (!LayoutComponent) {
      console.warn(`Layout type "${layoutType}" not found in registry`);
      return null;
    }

    // Recursively render children - they might contain items template deeper in tree
    const renderedChildren = children.map((child: any, index: number) => (
      <React.Fragment key={index}>
        {renderCategoryTemplateNode(
          child,
          categoryComponents,
          layout,
          itemOrder,
          AnimationComponent,
          animationSettings,
          sectionKey,
          patternKey,
          globalItemIndexOffset
        )}
      </React.Fragment>
    ));

    return (
      <LayoutComponent {...layoutProps}>
        {renderedChildren}
      </LayoutComponent>
    );
  }

  console.warn('Invalid category template node:', node);
  return null;
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
 * @param itemId - ID of the item containing this component (for EditorOverlay)
 */
const renderTemplateNode = (
  node: Record<string, any>,
  itemComponents: Record<string, ComponentNode>,
  itemContext: Record<string, any>,
  usedComponents: Set<string>,
  sectionKey?: string,
  patternKey?: string,
  itemId?: string
): React.ReactElement | null => {
  
  // Check what kind of node this is
  if (isComponentReference(node)) {
    return renderComponentReference(node, itemComponents, usedComponents, sectionKey, patternKey, itemId);
  }

  if (isLayoutNode(node)) {
    return renderLayoutNodeGeneric(node, itemComponents, itemContext, usedComponents, sectionKey, patternKey, itemId);
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
  patternKey?: string,
  itemId?: string
): React.ReactElement | null => {
  let { layoutType, layoutProps, children } = parseLayoutNode(node);

  // Resolve ${...} placeholders in layout props from item context (e.g. colSpan for bentoItem)
  layoutProps = resolvePropsWithContext(layoutProps, itemContext);

  // Apply item-level overrides for specific layout types
  if (layoutType === 'hstack' && itemContext?.reverse) {
    layoutProps = { ...layoutProps, direction: 'row-reverse' };
  }

  // Add filterTags as data-filter-tags attribute for filtering functionality
  if (itemContext?.filterTags && Array.isArray(itemContext.filterTags)) {
    layoutProps = { ...layoutProps, 'data-filter-tags': itemContext.filterTags.join(',') };
  }

  // Handle action prop - convert to onCardClick for components that use it
  if (layoutProps.action) {
    const action = layoutProps.action;

    // Only handle navigation actions
    if (action.type === 'navigation' && action.settings?.href) {
      // Resolve template placeholders in href (e.g., ${link} -> actual link from itemContext)
      let resolvedHref = action.settings.href;

      // Replace all ${variable} placeholders with actual values from itemContext
      Object.keys(itemContext).forEach(key => {
        const placeholder = `\${${key}}`;
        if (resolvedHref.includes(placeholder)) {
          resolvedHref = resolvedHref.replace(placeholder, itemContext[key]);
        }
      });

      // Create onCardClick handler
      const onCardClick = () => {
        if (action.settings.openInNewTab) {
          window.open(resolvedHref, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = resolvedHref;
        }
      };

      // Add onCardClick to layoutProps and remove action
      layoutProps = { ...layoutProps, onCardClick };
      delete layoutProps.action;
    }
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
      {renderTemplateNode(child, itemComponents, itemContext, usedComponents, sectionKey, patternKey, itemId)}
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
  patternKey?: string,
  itemId?: string
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
  
  // Render the component with componentKey and itemId for DOM identification
const renderedComponent = (
  <div data-component-key={componentKey} style={{ display: 'contents' }}>
    <Component {...mergedProps} />
  </div>
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