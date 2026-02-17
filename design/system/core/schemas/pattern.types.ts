/**
 * Pattern Schema Type Definitions
 * 
 * Defines the complete type system for pattern schemas.
 * Patterns organize components into reusable layout structures.
 * 
 * @example
 * ```typescript
 * import { PatternSchema } from './pattern.types';
 * 
 * export const sectionHeaderSchema: PatternSchema = {
 *   $id: 'sectionHeader',
 *   displayName: 'Section Header',
 *   category: 'header',
 *   allowedComponents: ['tag', 'heading', 'body']
 * };
 * ```
 */

import {
  PropConfig,
  ValidationRule,
  ValidationContext,
  DeprecationInfo,
  BaseExample
} from './shared';

// ============================================
// BASE TYPES
// ============================================

/**
 * Pattern categories for organization
 */
export type PatternCategory = 
  | 'header'        // sectionHeader, page header
  | 'content'       // sectionBody, text blocks, rich content
  | 'media'         // Image grids, galleries, carousels
  | 'grid'          // Grid layouts, bento, masonry
  | 'action'        // Button groups, CTAs, action bars
  | 'form'          // Form patterns, input groups
  | 'navigation'    // Menus, tabs, breadcrumbs
  | 'data'          // Stats, tables, charts, metrics
  | 'categorized'   // Category-based layouts (tabs + content)
  | 'utility';      // Helper patterns

/**
 * Layout types that patterns can use
 */
export type LayoutType = 
  | 'vstack'        // Vertical stack
  | 'hstack'        // Horizontal stack
  | 'grid'          // CSS Grid
  | 'bentoGrid'     // Bento-style grid
  | 'masonry'       // Masonry layout
  | 'carousel'      // Carousel/slider
  | 'tabs'          // Tabbed interface
  | 'sticky'        // Sticky sidebar
  | 'split'         // Split view
  | 'box'           // Container box
  | 'gridItem';     // Grid item wrapper

/**
 * Pattern structure types
 */
export type PatternStructure = 
  | 'legacy'        // pattern.components (old style)
  | 'items'         // pattern.layout.items (flat items)
  | 'categories';   // pattern.layout.categories (grouped items)

// ============================================
// PROP CONFIG TYPES
// ============================================

/**
 * Pattern-specific metadata for props
 */
export interface PatternPropMetadata {
  /** Whether this prop applies at pattern level or layout level */
  level?: 'pattern' | 'layout';
  
  /** Whether this prop affects rendering */
  affectsRendering?: boolean;
  
  /** Whether this prop can be overridden at section level */
  sectionOverridable?: boolean;
}

/**
 * Pattern prop configuration
 * Extends base PropConfig with pattern-specific fields
 */
export type PatternPropConfig = PropConfig & PatternPropMetadata;

// ============================================
// LAYOUT CONFIGURATION
// ============================================

/**
 * Layout prop configuration for specific layout types
 */
export interface LayoutPropSchema {
  /** Prop name */
  name: string;
  
  /** Prop configuration */
  config: PropConfig;
  
  /** Whether this prop is required for this layout type */
  required?: boolean;
  
  /** Only applicable to certain layout types */
  applicableLayouts?: LayoutType[];
}

/**
 * Template node schema - defines allowed structure in layout templates
 */
export interface TemplateNodeSchema {
  /** Allowed node types (layout types or component references) */
  allowedTypes: (LayoutType | 'component')[];
  
  /** Allowed component types if type is 'component' */
  allowedComponents?: string[];
  
  /** Whether children are allowed */
  allowsChildren?: boolean;
  
  /** Allowed props on this node */
  allowedProps?: Record<string, PropConfig>;
}

/**
 * Pattern layout configuration schema
 */
export interface PatternLayoutSchema {
  /** Layout type identifier */
  type: LayoutType;
  
  /** Display name for this layout */
  displayName: string;
  
  /** Description of layout behavior */
  description?: string;
  
  /** Allowed props for this layout type */
  allowedProps?: Record<string, PropConfig>;
  
  /** Required props for this layout type */
  requiredProps?: string[];
  
  /** Whether this layout supports items structure */
  supportsItems?: boolean;
  
  /** Whether this layout supports categories structure */
  supportsCategories?: boolean;
  
  /** Whether this layout requires a template */
  requiresTemplate?: boolean;
  
  /** Template structure schema */
  templateSchema?: TemplateNodeSchema;
  
  /** Allowed component types in items */
  allowedItemComponents?: string[];
  
  /** Required component types in items */
  requiredItemComponents?: string[];
  
  /** Maximum number of items */
  maxItems?: number;
  
  /** Minimum number of items */
  minItems?: number;
  
  /** Whether items can be reordered */
  sortable?: boolean;
}

// ============================================
// ANIMATION CONFIGURATION
// ============================================

/**
 * Animation types for patterns
 */
export type AnimationType = 
  | 'none'
  | 'fadeIn'
  | 'slideIn'
  | 'scale'
  | 'opacity'
  | 'carousel'
  | 'countUp'
  | 'bounce'
  | 'stagger';

/**
 * Animation configuration schema
 */
export interface AnimationSchema {
  /** Animation type */
  type: AnimationType;
  
  /** Display name */
  displayName: string;
  
  /** Description */
  description?: string;
  
  /** Allowed settings for this animation */
  settings?: Record<string, PropConfig>;
  
  /** Whether this animation wraps items individually */
  perItem?: boolean;
  
  /** Whether this animation wraps the entire layout */
  wrapLayout?: boolean;
}

// ============================================
// PATTERN SCHEMA
// ============================================

/**
 * Complete pattern schema definition
 */
export interface PatternSchema {
  /** JSON Schema version */
  $schema?: string;
  
  /** Unique pattern identifier (matches registry key) */
  $id: string;
  
  /** Display name for CMS and documentation */
  displayName: string;
  
  /** Pattern category */
  category: PatternCategory;
  
  /** Detailed description */
  description?: string;
  
  /** Icon identifier for CMS (lucide icon name) */
  icon?: string;
  
  /** Tags for search and filtering */
  tags?: string[];
  
  /** Schema version (for migrations) */
  version?: string;
  
  /** Pattern structure type */
  structure?: PatternStructure;
  
  /** Pattern-level props (useMediaWidth, align, spacing, etc) */
  props?: Record<string, PatternPropConfig>;
  
  /** Allowed component types (for legacy pattern.components) */
  allowedComponents?: string[];
  
  /** Required component types */
  requiredComponents?: string[];
  
  /** Maximum number of components */
  maxComponents?: number;
  
  /** Minimum number of components */
  minComponents?: number;
  
  /** Layout configuration (if pattern uses layout system) */
  layout?: PatternLayoutSchema;
  
  /** Allowed animation types */
  allowedAnimations?: AnimationType[];
  
  /** Default animation */
  defaultAnimation?: AnimationType;
  
  /** Validation rules */
  validation?: ValidationRule[];
  
  /** Usage examples */
  examples?: PatternExample[];
  
  /** Whether this pattern can be used in CMS */
  cmsEnabled?: boolean;
  
  /** Default props to populate when creating new instance */
  defaultProps?: Record<string, any>;
  
  /** Related patterns (alternatives, similar) */
  related?: string[];
  
  /** Documentation URL */
  docsUrl?: string;
  
  /** Deprecation info */
  deprecated?: DeprecationInfo;
}

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Pattern usage example
 */
export interface PatternExample extends BaseExample {
  /** Example data (matches pattern JSON structure) */
  data: {
    type: string;
    props?: Record<string, any>;
    components?: Record<string, any>;
    layout?: Record<string, any>;
    order?: string[];
    animation?: Record<string, any>;
  };
}

// ============================================
// VALIDATION CONTEXT
// ============================================

/**
 * Pattern validation context
 * Extends component validation context with pattern-specific info
 */
export interface PatternValidationContext extends ValidationContext {
  /** Pattern type being validated */
  patternType: string;
  
  /** Structure type (legacy, items, categories) */
  structure: PatternStructure;
  
  /** Number of components/items */
  itemCount?: number;
  
  /** Whether pattern has layout */
  hasLayout: boolean;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Extract allowed component types from pattern schema
 */
export type AllowedComponents<T extends PatternSchema> = 
  T['allowedComponents'] extends readonly string[] ? T['allowedComponents'][number] : string;

/**
 * Extract layout type from pattern schema
 */
export type LayoutTypeOf<T extends PatternSchema> = 
  T['layout'] extends { type: infer L } ? L : never;

/**
 * Check if pattern supports items
 */
export type SupportsItems<T extends PatternSchema> = 
  T['layout'] extends { supportsItems: true } ? true : false;

/**
 * Check if pattern supports categories
 */
export type SupportsCategories<T extends PatternSchema> = 
  T['layout'] extends { supportsCategories: true } ? true : false;

// ============================================
// SHARED LAYOUT PROPS
// ============================================

/**
 * Common layout props shared across multiple layout types
 */
export const commonLayoutProps = {
  gap: {
    name: 'gap',
    type: 'enum',
    displayName: 'Gap',
    description: 'Space between items',
    values: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    default: 'md',
    editorType: 'select'
  } as PropConfig,
  
  align: {
    name: 'align',
    type: 'enum',
    displayName: 'Alignment',
    values: ['start', 'center', 'end', 'stretch'],
    default: 'start',
    editorType: 'segmented'
  } as PropConfig,
  
  justify: {
    name: 'justify',
    type: 'enum',
    displayName: 'Justify',
    values: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    default: 'start',
    editorType: 'segmented'
  } as PropConfig
};

/**
 * Common pattern props shared across multiple patterns
 */
export const commonPatternProps = {
  useMediaWidth: {
    name: 'useMediaWidth',
    type: 'boolean',
    displayName: 'Use Media Width',
    description: 'Use media container width instead of default',
    default: false,
    editorType: 'toggle',
    level: 'pattern'
  } as PatternPropConfig,
  
  spacing: {
    name: 'spacing',
    type: 'enum',
    displayName: 'Spacing',
    values: ['none', 'sm', 'md', 'lg', 'xl'],
    default: 'md',
    editorType: 'segmented',
    level: 'pattern'
  } as PatternPropConfig
};
