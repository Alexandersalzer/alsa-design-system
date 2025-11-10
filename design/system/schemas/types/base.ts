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
  role?: string; // Semantic role for pattern-specific positioning
  order?: number; // Default order within role group
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
export const CommonProps = {
  // Layout props
  container: {
    type: 'enum' as const,
    values: ['narrow', 'medium', 'wide', 'full'],
    default: 'medium'
  },
  
  padding: {
    type: 'enum' as const,
    values: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    default: 'md'
  },
  
  spacing: {
    type: 'enum' as const,
    values: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    default: 'md'
  },
  
  // Visual props
  background: {
    type: 'enum' as const,
    values: ['light', 'dark', 'transparent'],
    default: 'light'
  },
  
  align: {
    type: 'enum' as const,
    values: ['left', 'center', 'right'],
    default: 'left'
  },
  
  // Content props
  content: {
    type: 'string' as const,
    required: true
  },
  
  variant: {
    type: 'string' as const
  },
  
  // Media props
  src: {
    type: 'string' as const,
    required: true
  },
  
  alt: {
    type: 'string' as const,
    required: true
  },
  
  // Form props
  name: {
    type: 'string' as const,
    required: true
  },
  
  label: {
    type: 'string' as const
  },
  
  placeholder: {
    type: 'string' as const
  },
  
  required: {
    type: 'boolean' as const,
    default: false
  }
} as const;