/**
 * Section Schema Type Definitions
 * 
 * Defines the complete type system for section schemas.
 * Similar to ComponentSchema but for section-level configuration.
 */

import type {
  PropConfig,
  ValidationRule,
  BaseExample
} from './shared';
import type { SectionType } from './section.types';

// ============================================
// SECTION LAYOUT PROP GROUPS
// ============================================

/**
 * Prop groups for organizing section layout fields
 */
export type SectionLayoutPropGroup = 
  | 'header'       // Section header settings (alignment, tag)
  | 'columns'      // Split layout and column configuration
  | 'spacing'      // Gap, padding
  | 'mobile'       // Mobile-specific overrides
  | 'card'         // Card wrapper settings
  | 'background'   // Background settings
  | 'animation';   // Animation settings

// ============================================
// SECTION LAYOUT EXAMPLE
// ============================================

/**
 * Example section layout configuration
 */
export interface SectionLayoutExample extends BaseExample {
  /** Example layout data */
  layout: Record<string, any>;
}

// ============================================
// SECTION SCHEMA
// ============================================

/**
 * Complete section schema definition
 * Defines available layout props and their configuration
 */
export interface SectionSchema {
  /** Section type identifier */
  $id: SectionType;
  
  /** Display name for CMS */
  displayName: string;
  
  /** Section category */
  category: 'hero' | 'content' | 'conversion' | 'social-proof' | 'utility';
  
  /** Description */
  description?: string;
  
  /** Icon identifier */
  icon?: string;
  
  /** Schema version */
  version?: string;
  
  /** Layout props configuration */
  layoutProps: Record<string, PropConfig>;
  
  /** Validation rules */
  validation?: ValidationRule[];
  
  /** Usage examples */
  examples?: SectionLayoutExample[];
  
  /** Default layout values */
  defaultLayout?: Record<string, any>;
  
  /** Whether this section can be used in CMS */
  cmsEnabled?: boolean;
  
  /** Related sections */
  related?: SectionType[];
  
  /** Documentation URL */
  docsUrl?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Extract layout prop names from schema
 */
export type LayoutPropNames<T extends SectionSchema> = keyof T['layoutProps'];

/**
 * Get all required layout prop names
 */
export type RequiredLayoutPropNames<T extends SectionSchema> = {
  [K in keyof T['layoutProps']]: T['layoutProps'][K]['required'] extends true ? K : never;
}[keyof T['layoutProps']];
