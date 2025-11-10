// ===============================================
// blimpify-ui/design/system/schemas/types/base.ts
// Base types for the schema system
// ===============================================

/**
 * Base property definition for schema fields
 */
export interface PropDefinition {
  type: 'string' | 'number' | 'boolean' | 'enum' | 'object' | 'array';
  required?: boolean;
  default?: any;
  values?: readonly string[] | readonly number[] | string[] | number[]; // For enum types
  description?: string;
}

/**
 * Schema for individual components
 */
export interface ComponentSchema {
  type: string;
  props: Record<string, PropDefinition>;
}

/**
 * Schema for patterns (containers of components)
 */
export interface PatternSchema {
  type: string;
  props: Record<string, PropDefinition>;
  components?: Record<string, ComponentSchema>;
  requiredComponents?: string[];
}

/**
 * Schema for sections (containers of patterns)
 */
export interface SectionSchema {
  type: string;
  props: Record<string, PropDefinition>;
  patterns: Record<string, PatternSchema>;
  requiredPatterns?: string[]; // All sections must have sectionBody
}

/**
 * Complete schema registry types
 */
export interface SchemaRegistry {
  components: Record<string, ComponentSchema>;
  patterns: Record<string, PatternSchema>;
  sections: Record<string, SectionSchema>;
}

/**
 * Common prop definitions that can be reused
 */
export const StandardProps = {
  // Visual props
  background: {
    type: 'enum' as const,
    values: ['light', 'dark', 'transparent'],
    default: 'light'
  },
  
  // Content props
  content: {
    type: 'string' as const,
    required: true
  },
  
  // Media props
  src: {
    type: 'string' as const,
    required: true
  }
} as const;