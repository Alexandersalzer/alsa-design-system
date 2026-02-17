/**
 * Page Schema Type Definitions
 * 
 * Defines the complete type system for page schemas.
 * Pages are the top-level structure containing sections and metadata.
 * 
 * @example
 * ```typescript
 * import { PageSchema } from './page.types';
 * 
 * export const landingPageSchema: PageSchema = {
 *   $id: 'landing',
 *   displayName: 'Landing Page',
 *   type: 'landing',
 *   allowedSections: ['hero', 'features', 'testimonials', 'cta']
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
import { SectionType } from './section.types';

// ============================================
// BASE TYPES
// ============================================

/**
 * Page types/templates
 */
export type PageType = 
  | 'landing'       // Marketing landing page
  | 'homepage'      // Main website homepage
  | 'product'       // Product showcase page
  | 'service'       // Service offering page
  | 'about'         // About/company page
  | 'contact'       // Contact page
  | 'blog'          // Blog post page
  | 'portfolio'     // Portfolio showcase
  | 'case-study'    // Case study page
  | 'pricing'       // Pricing page
  | 'legal'         // Legal pages (terms, privacy)
  | 'error'         // Error pages (404, 500)
  | 'custom';       // Custom page template

/**
 * Page categories for organization
 */
export type PageCategory = 
  | 'marketing'     // Marketing pages
  | 'content'       // Content pages
  | 'conversion'    // Conversion-focused pages
  | 'information'   // Informational pages
  | 'system';       // System pages (error, etc)

// ============================================
// SEO CONFIGURATION
// ============================================

/**
 * SEO metadata schema
 */
export interface SEOSchema {
  /** Page title configuration */
  title?: {
    config: PropConfig;
    maxLength?: number;
    template?: string; // e.g., "{title} | {siteName}"
  };
  
  /** Meta description configuration */
  description?: {
    config: PropConfig;
    maxLength?: number;
    minLength?: number;
  };
  
  /** Keywords configuration */
  keywords?: PropConfig;
  
  /** Open Graph title */
  ogTitle?: PropConfig;
  
  /** Open Graph description */
  ogDescription?: PropConfig;
  
  /** Open Graph image */
  ogImage?: {
    config: PropConfig;
    recommendedSize?: string; // e.g., "1200x630"
    formats?: string[]; // e.g., ["jpg", "png"]
  };
  
  /** Twitter card type */
  twitterCard?: {
    config: PropConfig;
    allowedTypes?: ('summary' | 'summary_large_image' | 'app' | 'player')[];
  };
  
  /** Twitter title */
  twitterTitle?: PropConfig;
  
  /** Twitter description */
  twitterDescription?: PropConfig;
  
  /** Twitter image */
  twitterImage?: PropConfig;
  
  /** Canonical URL */
  canonical?: PropConfig;
  
  /** Robots meta tag */
  robots?: {
    config: PropConfig;
    allowedValues?: ('index' | 'noindex' | 'follow' | 'nofollow')[];
  };
  
  /** Structured data (Schema.org) */
  structuredData?: {
    config: PropConfig;
    recommendedTypes?: string[]; // e.g., ["Organization", "WebPage", "Article"]
    validator?: string;
  };
}

// ============================================
// LOCALIZATION
// ============================================

/**
 * Localization configuration
 */
export interface LocalizationConfig {
  /** Supported locales */
  supportedLocales: string[];
  
  /** Default locale */
  defaultLocale: string;
  
  /** Locale display names */
  localeNames?: Record<string, string>;
  
  /** Whether to show locale selector */
  showSelector?: boolean;
  
  /** Fallback behavior */
  fallbackToDefault?: boolean;
}

// ============================================
// BACKGROUND CONFIGURATION
// ============================================

/**
 * Page-level background types
 * (extends section backgrounds with page-specific options)
 */
export type PageBackgroundType = 
  | 'none'
  | 'solid'
  | 'gradient'
  | 'image'
  | 'video'
  | 'generative'
  | 'pattern';

/**
 * Bottom blur configuration
 */
export interface BottomBlurConfig {
  /** Enable bottom blur */
  enabled: boolean;
  
  /** Blur variant */
  variant?: 'subtle' | 'medium' | 'strong' | 'reflection';
  
  /** Custom height (px) */
  height?: number;
  
  /** Custom blur amount (px) */
  blurAmount?: number;
  
  /** Position */
  position?: 'bottom' | 'top';
  
  /** Opacity (0-1) */
  opacity?: number;
}

// ============================================
// SECTION CONSTRAINTS
// ============================================

/**
 * Section constraint configuration
 */
export interface SectionConstraints {
  /** Allowed section types */
  allowed?: SectionType[];
  
  /** Recommended section types */
  recommended?: SectionType[];
  
  /** Required section types */
  required?: SectionType[];
  
  /** Maximum number of sections */
  maxSections?: number;
  
  /** Minimum number of sections */
  minSections?: number;
  
  /** Maximum sections of each type */
  maxPerType?: Record<string, number>;
  
  /** Section order constraints */
  orderConstraints?: SectionOrderConstraint[];
}

/**
 * Section order constraint
 */
export interface SectionOrderConstraint {
  /** Section type that must come before */
  before: SectionType;
  
  /** Section type that must come after */
  after: SectionType;
  
  /** Error message if violated */
  message?: string;
}

// ============================================
// PAGE SCHEMA
// ============================================

/**
 * Complete page schema definition
 */
export interface PageSchema {
  /** JSON Schema version */
  $schema?: string;
  
  /** Unique page identifier */
  $id: string;
  
  /** Display name for CMS and documentation */
  displayName: string;
  
  /** Page type/template */
  type?: PageType;
  
  /** Page category */
  category?: PageCategory;
  
  /** Detailed description */
  description?: string;
  
  /** Icon identifier for CMS (lucide icon name) */
  icon?: string;
  
  /** Tags for search and filtering */
  tags?: string[];
  
  /** Schema version (for migrations) */
  version?: string;
  
  /** Page-level props (background, transparentSections, bottomBlur, etc) */
  props?: Record<string, PropConfig>;
  
  /** SEO metadata configuration */
  seo?: SEOSchema;
  
  /** Localization configuration */
  localization?: LocalizationConfig;
  
  /** Section constraints */
  sections?: SectionConstraints;
  
  /** Validation rules */
  validation?: ValidationRule[];
  
  /** Usage examples */
  examples?: PageExample[];
  
  /** Whether this page template can be used in CMS */
  cmsEnabled?: boolean;
  
  /** Default props to populate when creating new instance */
  defaultProps?: Record<string, any>;
  
  /** Default sections to include */
  defaultSections?: string[];
  
  /** Related page templates */
  related?: string[];
  
  /** Documentation URL */
  docsUrl?: string;
  
  /** Deprecation info */
  deprecated?: DeprecationInfo;
  
  /** Performance considerations */
  performance?: {
    /** Recommended max sections */
    maxRecommendedSections?: number;
    
    /** Lazy load sections */
    lazyLoadSections?: boolean;
    
    /** Critical sections (load first) */
    criticalSections?: SectionType[];
  };
}

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Page usage example
 */
export interface PageExample extends BaseExample {
  /** Example data (matches page JSON structure) */
  data: {
    name: string;
    locale: string;
    props?: Record<string, any>;
    seo?: Record<string, any>;
    sections: Record<string, any>;
    order: string[];
  };
  
  /** Complexity level */
  complexity?: 'simple' | 'moderate' | 'complex';
  
  /** Industry/niche */
  industry?: string;
}

// ============================================
// VALIDATION CONTEXT
// ============================================

/**
 * Page validation context
 */
export interface PageValidationContext extends ValidationContext {
  /** Page name */
  pageName: string;
  
  /** Page type */
  pageType?: PageType;
  
  /** Section types present */
  sectionTypes: SectionType[];
  
  /** Number of sections */
  sectionCount: number;
  
  /** Whether page has SEO data */
  hasSEO: boolean;
  
  /** Current locale */
  locale: string;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Extract allowed section types from page schema
 */
export type AllowedSections<T extends PageSchema> = 
  T['sections'] extends { allowed: infer A } 
    ? A extends readonly SectionType[] ? A[number] : SectionType
    : SectionType;

/**
 * Extract required section types from page schema
 */
export type RequiredSections<T extends PageSchema> = 
  T['sections'] extends { required: infer R }
    ? R extends readonly SectionType[] ? R[number] : never
    : never;

// ============================================
// SHARED PAGE PROPS
// ============================================

/**
 * Common page props shared across all page types
 */
export const commonPageProps = {
  background: {
    name: 'background',
    type: 'object',
    displayName: 'Page Background',
    description: 'Global page background',
    editorType: 'builder',
    $ref: 'shared/background.schema'
  } as PropConfig,
  
  transparentSections: {
    name: 'transparentSections',
    type: 'boolean',
    displayName: 'Transparent Sections',
    description: 'Make sections transparent to show page background',
    default: false,
    editorType: 'toggle'
  } as PropConfig,
  
  bottomBlur: {
    name: 'bottomBlur',
    type: 'object',
    displayName: 'Bottom Blur',
    description: 'Bottom blur bar effect',
    editorType: 'group',
    properties: {
      enabled: {
        name: 'enabled',
        type: 'boolean',
        displayName: 'Enable',
        default: false,
        editorType: 'toggle'
      } as PropConfig,
      variant: {
        name: 'variant',
        type: 'enum',
        displayName: 'Variant',
        values: ['subtle', 'medium', 'strong', 'reflection'],
        default: 'medium',
        editorType: 'select'
      } as PropConfig,
      height: {
        name: 'height',
        type: 'number',
        displayName: 'Height',
        min: 50,
        max: 500,
        step: 10,
        unit: 'px',
        editorType: 'slider'
      } as PropConfig
    }
  } as PropConfig
};

/**
 * Common SEO props
 */
export const commonSEOProps = {
  title: {
    name: 'title',
    type: 'string',
    displayName: 'Page Title',
    description: 'SEO title (50-60 characters recommended)',
    required: true,
    maxLength: 60,
    editorType: 'text',
    placeholder: 'Your Page Title | Brand Name'
  } as PropConfig,
  
  description: {
    name: 'description',
    type: 'string',
    displayName: 'Meta Description',
    description: 'SEO description (150-160 characters recommended)',
    required: true,
    maxLength: 160,
    minLength: 120,
    editorType: 'textarea',
    placeholder: 'Describe your page in 1-2 sentences...'
  } as PropConfig,
  
  ogImage: {
    name: 'ogImage',
    type: 'string',
    displayName: 'Social Share Image',
    description: 'Image for social media sharing (1200x630 recommended)',
    editorType: 'url',
    pattern: '^https?://.+\\.(jpg|jpeg|png|webp)$'
  } as PropConfig
};
