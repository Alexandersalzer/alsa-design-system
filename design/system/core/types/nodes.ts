import { SectionType } from '../render/validation/sections';
import { LayoutConfig } from './layout';
import { AnimationConfig } from '../../components/animations/types';
import { BackgroundProps } from '../../components/backgrounds/types';

/**
 * Base interface som alla noder delar
 * Endast gemensamma properties
 */
export interface BaseNode<T extends string = string> {
  type: T;
  props?: Record<string, any>;
}

/**
 * Component - Leaf node, ingen barn
 * Atomic UI element som inte innehåller andra noder
 */
export interface ComponentNode extends BaseNode {
  props: Record<string, any>;
  animation?: AnimationConfig;
  componentKey?: string;
}

// ===============================================
// Pattern Layout System
// ===============================================

/**
 * Item within a layout - atomic unit that contains components
 */
export interface LayoutItem {
  id: string;
  components: Record<string, ComponentNode>;
  /** Item-level props (e.g., isHidden, spacing, etc) */
  props?: {
    /** Hide this item from rendering */
    isHidden?: boolean | 'true' | 'false';
    [key: string]: any;
  };
}

/**
 * Category for grouping items
 * Uses flat structure: category references items by ID from layout.items[]
 * This supports both 1:N and M:N relationships (same item can be in multiple categories)
 */
export interface LayoutCategory {
  id: string;
  /** Category's own components (e.g., heading, body for sticky sidebar, or label for filter tabs) */
  components?: Record<string, ComponentNode>;
  /** References to item IDs in layout.items[] - order matters */
  itemIds: string[];
}

/**
 * Template child node - either a layout node or component reference
 */
export interface TemplateNode {
  /** Layout type (vstack, hstack, gridItem, card, etc) */
  type?: string;
  /** Component reference: "${heading}", "${body}", "${button}" */
  component?: string;
  /** Nested children */
  children?: TemplateNode[];
  /** Additional props (spacing, align, colSpan, padding, etc) */
  [key: string]: any;
}

/**
 * Template definition for rendering items
 */
export interface LayoutTemplate {
  children: TemplateNode[];
}

/**
 * Pattern Layout - Universal layout system for patterns
 * Defines how items are arranged and rendered
 */
export interface PatternLayout {
  /** Layout primitive: "vstack", "hstack", "grid" */
  type: string;
  /** Template defining how to render each item */
  template?: LayoutTemplate;
  
  // Items (flat structure)
  /** Array of items to render */
  items?: LayoutItem[];
  /** Optional: override items array order (references item IDs) */
  itemOrder?: string[];
  
  // Categories (nested structure)
  /** Array of categories, each containing items */
  categories?: LayoutCategory[];
  /** Optional: override categories array order (references category IDs) */
  categoryOrder?: string[];
  
  /** Layout-specific props: gap, spacing, columns, align, etc */
  [key: string]: any;
}

/**
 * Pattern - Container för components
 * Innehåller bara components, inte andra patterns
 */
export interface PatternNode extends BaseNode {
  /** Pattern-level props (e.g., excludeFromSecondColumn, useMediaWidth) */
  props?: {
    /** When true, this pattern cannot be placed in second column */
    excludeFromSecondColumn?: boolean;
    [key: string]: any;
  };
  /** Legacy: Direct components without layout system */
  components?: Record<string, ComponentNode>;
  /** New: Items-based layout system */
  layout?: PatternLayout;
  /** 
   * @deprecated Use layout.itemOrder instead. 
   * Kept for backwards compatibility with legacy patterns.
   * References component keys (legacy) - prefer item IDs in layout.itemOrder
   */
  order?: string[];
  animation?: AnimationConfig;
  patternKey?: string;
}


/**
 * Section Header - Optional header with tag, heading, body components
 */
export interface SectionHeader {
  components: Record<string, ComponentNode>;
}

/**
 * Section - Container för patterns  
 * Top-level containers som organiserar patterns
 */
export interface SectionNode extends BaseNode<SectionType> {
  header?: SectionHeader;
  patterns?: Record<string, PatternNode>;
  order?: string[];
  layout?: LayoutConfig; // Section layout (split columns, alignment)
  animation?: AnimationConfig;
  sectionKey?: string;
  props?: {
    /** Hide this entire section from rendering */
    isHidden?: boolean | 'true' | 'false';
    [key: string]: any;
  };
}

/**
 * SEO metadata for a page
 */
export interface PageSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: Record<string, any>;
}

/**
 * Page-level props for styling and configuration
 * Extends BackgroundProps for all background functionality
 */
export interface PageProps extends BackgroundProps {
  /** Make sections transparent to show page background through (defaults to true when background is set) */
  transparentSections?: boolean;
  /** 
   * Bottom blur bar - can be boolean (uses 'medium') or variant name
   * Variants: 'subtle' | 'medium' | 'strong' | 'reflection'
   */
  bottomBlur?: boolean | 'subtle' | 'medium' | 'strong' | 'reflection';
  /** Override: Height in pixels */
  bottomBlurHeight?: number;
  /** Override: Blur amount in pixels */
  bottomBlurAmount?: number;
  /** Position of blur: 'bottom' (default) or 'top' */
  bottomBlurPosition?: 'bottom' | 'top';
  /** Opacity of blur effect (0-1) */
  bottomBlurOpacity?: number;
}

/**
 * Page - Complete page structure
 */
export interface PageNode {
  name: string;
  locale: string;
  props?: PageProps;
  seo?: PageSEO;
  sections: Record<string, SectionNode>;
  order: string[];
}