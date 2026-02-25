/**
 * Section Schema Type Definitions
 * 
 * Defines the complete type system for section schemas.
 * Sections are top-level content blocks that contain patterns.
 * 
 * @example
 * ```typescript
 * import { SectionSchema } from './section.types';
 * 
 * export const heroSchema: SectionSchema = {
 *   $id: 'hero',
 *   displayName: 'Hero Section',
 *   allowedPatterns: ['sectionHeader', 'action', 'items'],
 *   requiredPatterns: ['sectionHeader']
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
 * Section types
 * Defines all available section templates
 */
export type SectionType = 
  | 'hero'              // Hero/landing section
  | 'portfolio'         // Portfolio showcase
  | 'gallery'           // Image/media gallery
  | 'testimonials'      // Customer testimonials
  | 'contact'           // Contact section
  | 'featureGrid'       // Feature grid
  | 'resultsGrid'       // Results/benefits grid
  | 'cta'               // Call to action
  | 'bentoServices'     // Bento-style services
  | 'faq'               // FAQ section
  | 'pricing'           // Pricing tables
  | 'team'              // Team members
  | 'stats'             // Statistics/metrics
  | 'process'           // Process/timeline
  | 'logos'             // Logo showcase
  | 'content'           // Generic content section
  | 'custom';           // Custom section

/**
 * Section categories for organization
 */
export type SectionCategory = 
  | 'landing'       // Landing page sections
  | 'marketing'     // Marketing-focused sections
  | 'content'       // Content-heavy sections
  | 'conversion'    // Conversion-focused sections
  | 'social-proof'  // Testimonials, logos, stats
  | 'information'   // Info sections (FAQ, team)
  | 'utility';      // Utility sections

// ============================================
// LAYOUT CONFIGURATION
// ============================================

/**
 * Section layout alignment options
 */
export type SectionAlignment = 'left' | 'center' | 'right';

/**
 * Vertical alignment options
 */
export type VerticalAlignment = 'start' | 'center' | 'end';

/**
 * Gap/spacing options
 */
export type GapSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

/**
 * Section layout configuration
 * Defines how patterns are arranged within a section
 */
export interface SectionLayoutConfig {
  /** Alignment of section header */
  alignSectionHeader?: SectionAlignment;
  
  /** Vertical alignment of content */
  verticalAlign?: VerticalAlignment;
  
  /** Section header vertical alignment */
  sectionHeaderVerticalAlign?: VerticalAlignment;
  
  /** Distance action pattern from other content */
  distanceAction?: boolean;
  
  /** Gap between patterns */
  gap?: GapSize;
  
  /** Split layout into columns */
  splitLayout?: boolean;
  
  /** Patterns in second column (for split layouts) */
  secondColumn?: string[];
  
  /** When true, render second column as media column (stretch/flex) regardless of pattern types */
  secondColumnAsMedia?: boolean;
  
  /** Column ratio for split layout (e.g., "1:1", "2:1", "1:2") */
  columnRatio?: string;
}

/**
 * Layout configuration schema
 */
export interface SectionLayoutSchema {
  /** Available layout props */
  props: Record<string, PropConfig>;
  
  /** Default layout values */
  defaults?: Partial<SectionLayoutConfig>;
  
  /** Whether split layout is supported */
  supportsSplitLayout?: boolean;
  
  /** Maximum patterns in second column */
  maxSecondColumnPatterns?: number;
}

// ============================================
// BACKGROUND CONFIGURATION
// ============================================

/**
 * Background types (section schema – för SectionSchema.allowedTypes).
 * Namnet SectionBackgroundType undviker krock med components/backgrounds/types BackgroundType.
 */
export type SectionBackgroundType = 
  | 'none'
  | 'solid'
  | 'gradient'
  | 'image'
  | 'video'
  | 'generative';

/**
 * Background configuration schema
 */
export interface BackgroundSchema {
  /** Allowed background types for this section */
  allowedTypes?: SectionBackgroundType[];
  
  /** Default background type */
  defaultType?: SectionBackgroundType;
  
  /** Background-specific props */
  props?: Record<string, PropConfig>;
}

// ============================================
// PATTERN CONSTRAINTS
// ============================================

/**
 * Pattern constraint configuration
 * Defines rules for which patterns can be used in a section
 */
export interface PatternConstraints {
  /** Allowed pattern types */
  allowed: string[];
  
  /** Required pattern types */
  required?: string[];
  
  /** Maximum number of patterns of each type */
  maxPerType?: Record<string, number>;
  
  /** Minimum number of patterns of each type */
  minPerType?: Record<string, number>;
  
  /** Total maximum patterns in section */
  maxTotal?: number;
  
  /** Total minimum patterns in section */
  minTotal?: number;
  
  /** Pattern order constraints */
  orderConstraints?: PatternOrderConstraint[];
}

/**
 * Pattern order constraint
 */
export interface PatternOrderConstraint {
  /** Pattern type that must come before */
  before: string;
  
  /** Pattern type that must come after */
  after: string;
  
  /** Error message if constraint violated */
  message?: string;
}

// ============================================
// SECTION SCHEMA
// ============================================

/**
 * Complete section schema definition
 */
export interface SectionSchema {
  /** JSON Schema version */
  $schema?: string;
  
  /** Unique section identifier (matches section type) */
  $id: SectionType;
  
  /** Display name for CMS and documentation */
  displayName: string;
  
  /** Section category */
  category?: SectionCategory;
  
  /** Detailed description */
  description?: string;
  
  /** Icon identifier for CMS (lucide icon name) */
  icon?: string;
  
  /** Tags for search and filtering */
  tags?: string[];
  
  /** Schema version (for migrations) */
  version?: string;
  
  /** Pattern constraints */
  patterns: PatternConstraints;
  
  /** Section-level props (background, spacing, padding, etc) */
  props?: Record<string, PropConfig>;
  
  /** Layout configuration schema */
  layout?: SectionLayoutSchema;
  
  /** Background configuration */
  background?: BackgroundSchema;
  
  /** Whether section supports animations */
  supportsAnimation?: boolean;
  
  /** Allowed animation types */
  allowedAnimations?: string[];
  
  /** Validation rules */
  validation?: ValidationRule[];
  
  /** Usage examples */
  examples?: SectionExample[];
  
  /** Whether this section can be used in CMS */
  cmsEnabled?: boolean;
  
  /** Default props to populate when creating new instance */
  defaultProps?: Record<string, any>;
  
  /** Default layout configuration */
  defaultLayout?: SectionLayoutConfig;
  
  /** Related sections (alternatives, similar) */
  related?: SectionType[];
  
  /** Documentation URL */
  docsUrl?: string;
  
  /** Deprecation info */
  deprecated?: DeprecationInfo;
  
  /** SEO considerations */
  seo?: {
    /** Whether this section should be indexed */
    indexable?: boolean;
    
    /** Recommended heading hierarchy */
    headingHierarchy?: string[];
    
    /** Schema.org type recommendations */
    schemaTypes?: string[];
  };
}

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Section usage example
 */
export interface SectionExample extends BaseExample {
  /** Example data (matches section JSON structure) */
  data: {
    type: SectionType;
    props?: Record<string, any>;
    patterns: Record<string, any>;
    order: string[];
    layout?: SectionLayoutConfig;
  };
  
  /** Complexity level */
  complexity?: 'simple' | 'moderate' | 'complex';
}

// ============================================
// VALIDATION CONTEXT
// ============================================

/**
 * Section validation context
 * Extends component validation context with section-specific info
 */
export interface SectionValidationContext extends ValidationContext {
  /** Section type being validated */
  sectionType: SectionType;
  
  /** Pattern types present in section */
  patternTypes: string[];
  
  /** Number of patterns */
  patternCount: number;
  
  /** Whether section has background */
  hasBackground: boolean;
  
  /** Layout configuration */
  layout?: SectionLayoutConfig;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Extract allowed pattern types from section schema
 */
export type AllowedPatterns<T extends SectionSchema> = 
  T['patterns']['allowed'][number];

/**
 * Extract required pattern types from section schema
 */
export type RequiredPatterns<T extends SectionSchema> = 
  T['patterns']['required'] extends readonly string[] 
    ? T['patterns']['required'][number] 
    : never;

/**
 * Check if section supports split layout
 */
export type SupportsSplitLayout<T extends SectionSchema> = 
  T['layout'] extends { supportsSplitLayout: true } ? true : false;

// ============================================
// SHARED SECTION PROPS
// ============================================

/**
 * Common section props shared across all sections
 */
export const commonSectionProps = {
  background: {
    name: 'background',
    type: 'object',
    displayName: 'Background',
    description: 'Section background configuration',
    editorType: 'builder',
    $ref: 'shared/background.schema'
  } as PropConfig,
  
  padding: {
    name: 'padding',
    type: 'enum',
    displayName: 'Padding',
    description: 'Section padding (top & bottom)',
    values: ['none', 'sm', 'md', 'lg', 'xl', '2xl'],
    default: 'lg',
    editorType: 'select'
  } as PropConfig,
  
  marginTop: {
    name: 'marginTop',
    type: 'enum',
    displayName: 'Margin Top',
    values: ['none', 'sm', 'md', 'lg', 'xl', '2xl'],
    default: 'none',
    editorType: 'select'
  } as PropConfig,
  
  marginBottom: {
    name: 'marginBottom',
    type: 'enum',
    displayName: 'Margin Bottom',
    values: ['none', 'sm', 'md', 'lg', 'xl', '2xl'],
    default: 'none',
    editorType: 'select'
  } as PropConfig,
  
  hidden: {
    name: 'hidden',
    type: 'boolean',
    displayName: 'Hidden',
    description: 'Hide section without removing from JSON',
    default: false,
    editorType: 'toggle'
  } as PropConfig
};

/**
 * Common layout props for sections
 */
export const commonLayoutProps = {
  alignSectionHeader: {
    name: 'alignSectionHeader',
    type: 'enum',
    displayName: 'Header Alignment',
    values: ['left', 'center', 'right'],
    default: 'center',
    editorType: 'segmented'
  } as PropConfig,
  
  gap: {
    name: 'gap',
    type: 'enum',
    displayName: 'Gap Between Patterns',
    values: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
    default: 'xl',
    editorType: 'select'
  } as PropConfig,
  
  verticalAlign: {
    name: 'verticalAlign',
    type: 'enum',
    displayName: 'Vertical Alignment',
    values: ['start', 'center', 'end'],
    default: 'start',
    editorType: 'segmented'
  } as PropConfig
};
