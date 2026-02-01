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
  findLayoutItem,
  findComponentByType
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
  
  const { type: parentType, template, order, ...parentLayoutProps } = layout;

  // Merge pattern props (like align) with layout props
  // Pattern props take precedence
  const mergedLayoutProps = {
    ...parentLayoutProps,
    ...(patternProps?.align && { align: patternProps.align })
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
  

  // Get items to render
  const itemOrder = getLayoutItemOrder(layout);
  
  // Extract animation settings if applicable
  const animationType = animationConfig?.type;
  const animationSettings = (animationConfig?.settings || {}) as Record<string, any>;
  
  // Get animation component from registry (e.g., "fadeIn" -> animationComponents["fadeIn"])
  const AnimationComponent = animationType ? animationComponents[animationType] : null;
  
  // Render template for each item
  const renderedItems = itemOrder.map((itemId, itemIndex) => {
    const item = findLayoutItem(layout, itemId);
    if (!item) {
      console.warn(`Item "${itemId}" not found in layout items`);
      return null;
    }

    // Create item context with index and any item-level props (excluding 'components')
    const { components: _, ...itemProps } = item;
    const itemContext = {
      index: itemIndex,
      id: itemId,
      ...itemProps
    };

    // Render each child in template.children array
    const templateChildren = template.children || [];
    const itemContent = (
      <React.Fragment key={itemId}>
        {templateChildren.map((child: any, index: number) => (
          <React.Fragment key={index}>
            {renderTemplateNode(child, item.components, itemContext, sectionKey, patternKey)}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
    
    // Wrap with animation component if configured (dynamic from registry)
    if (AnimationComponent && animationType) {
      // Calculate stagger delay if stagger is set
      const staggerDelay = (animationSettings.stagger || 0) * itemIndex;
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
  

  return (
    <ParentLayout {...mergedLayoutProps}>
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
  itemContext: Record<string, any>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  
  // Check what kind of node this is
  if (isComponentReference(node)) {
    return renderComponentReference(node, itemComponents, sectionKey, patternKey);
  }

  if (isLayoutNode(node)) {
    return renderLayoutNodeGeneric(node, itemComponents, itemContext, sectionKey, patternKey);
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
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  let { layoutType, layoutProps, children } = parseLayoutNode(node);

  // Apply item-level overrides for specific layout types
  if (layoutType === 'hstack' && itemContext?.reverse) {
    layoutProps = { ...layoutProps, direction: 'row-reverse' };
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
      {renderTemplateNode(child, itemComponents, itemContext, sectionKey, patternKey)}
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
 * Renders component reference: { component: "${componentType}" }
 * Matches component by TYPE, not by key name
 * Extra props in the reference override component props (for template-level styling)
 * 
 * Template: { component: "${image}", radius: "md" }
 * Items: { image_mN3pL2: { type: "image", props: { src: "..." } } }
 * Result: Finds component with type "image", merges props with template styling
 */
const renderComponentReference = (
  reference: Record<string, any>,
  itemComponents: Record<string, ComponentNode>,
  sectionKey?: string,
  patternKey?: string
): React.ReactElement | null => {
  const { component: componentRef, animation: templateAnimation, ...extraProps } = reference;

  // Extract type from ${componentType} syntax
  const componentType = extractSlotName(componentRef);
  
  // Find component by TYPE (not by key)
  const itemComponent = findComponentByType(itemComponents, componentType);

  if (!itemComponent) {
    console.warn(`Component with type "${componentType}" not found in item components`);
    return null;
  }

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