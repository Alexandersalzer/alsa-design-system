/**
 * Component Schema Type Definitions
 * 
 * Defines the complete type system for component schemas.
 * Used for type-safe schema definitions and validation.
 * 
 * @example
 * ```typescript
 * import { ComponentSchema } from './component.types';
 * 
 * export const buttonSchema: ComponentSchema = {
 *   $id: 'button',
 *   displayName: 'Button',
 *   category: 'actions',
 *   props: { ... }
 * };
 * ```
 */

import {
  PropConfig,
  ValidationRule,
  ValidationContext,
  ValidationSeverity,
  ConditionalRule,
  ConditionalOperator,
  ValidatorFunction,
  ValidationError,
  ValidationWarning,
  SchemaValidationResult,
  SchemaMigration,
  MigrationTransform,
  DeprecationInfo,
  EditorType,
  BaseExample
} from './shared';

// Re-export shared types for backwards compatibility
export type {
  PropConfig,
  ValidationRule,
  ValidationContext,
  ValidationSeverity,
  ConditionalRule,
  ConditionalOperator,
  ValidatorFunction,
  ValidationError,
  ValidationWarning,
  SchemaValidationResult,
  SchemaMigration,
  MigrationTransform,
  EditorType
};

// ============================================
// BASE TYPES
// ============================================

/**
 * Component categories for organization
 */
export type ComponentCategory = 
  | 'actions'      // Buttons, links, clickable elements
  | 'layout'       // Grid, Stack, Container, Box
  | 'typography'   // Heading, Body, Label, Display
  | 'media'        // Image, Logo, Icon, Video
  | 'forms'        // Input, Textarea, Picker, Checkbox
  | 'data'         // Stats, metrics, data display
  | 'feedback'     // Loading, Error, Success states
  | 'navigation'   // Navbar, Menu, Breadcrumb
  | 'utility'      // Helper components
  | 'thirdparty';  // External integrations (Cal, Calendly, etc)



// ============================================
// PROP CONFIG TYPES
// ============================================
// Prop config types are now imported from shared.ts

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Example usage of a component
 */
export interface ComponentExample extends BaseExample {
  /** Example data (matches component JSON structure) */
  data: {
    type: string;
    props: Record<string, any>;
  };
}

// ============================================
// MIGRATION & DEPRECATION
// ============================================
// Migration types are now imported from shared.ts

// ============================================
// COMPONENT SCHEMA
// ============================================

/**
 * Complete component schema definition
 * This is the top-level interface for defining a component's schema
 */
export interface ComponentSchema {
  /** JSON Schema version */
  $schema?: string;
  
  /** Unique component identifier (matches registry key) */
  $id: string;
  
  /** Display name for CMS and documentation */
  displayName: string;
  
  /** Component category */
  category: ComponentCategory;
  
  /** Detailed description */
  description?: string;
  
  /** Icon identifier for CMS (lucide icon name) */
  icon?: string;
  
  /** Tags for search and filtering */
  tags?: string[];
  
  /** Schema version (for migrations) */
  version?: string;
  
  /** Props configuration */
  props: Record<string, PropConfig>;
  
  /** Validation rules */
  validation?: ValidationRule[];
  
  /** Usage examples */
  examples?: ComponentExample[];
  
  /** Migration definitions */
  migrations?: SchemaMigration[];
  
  /** Deprecation info (if component is deprecated) */
  deprecated?: DeprecationInfo;
  
  /** Related components (alternatives, similar) */
  related?: string[];
  
  /** Documentation URL */
  docsUrl?: string;
  
  /** Whether this component can be used in CMS */
  cmsEnabled?: boolean;
  
  /** Default props to populate when creating new instance */
  defaultProps?: Record<string, any>;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Extract prop names from a schema
 */
export type PropNames<T extends ComponentSchema> = keyof T['props'];

/**
 * Extract prop type from schema
 */
export type PropType<
  T extends ComponentSchema,
  K extends keyof T['props']
> = T['props'][K] extends { type: infer P } ? P : never;

/**
 * Get all required prop names
 */
export type RequiredPropNames<T extends ComponentSchema> = {
  [K in keyof T['props']]: T['props'][K]['required'] extends true ? K : never;
}[keyof T['props']];

// Validation result types are now imported from shared.ts
