// ===============================================
// blimpify-ui/design/system/schemas/registry.ts
// Central registry for all schemas
// ===============================================

import { SchemaRegistry } from './types/base';

// Import all section schemas
import {
  FooterSectionSchema
} from '../templates/footer/schema';

// Import all pattern schemas
import {
  KjFooterPatternSchema
} from '../patterns/footer/KjFooter/schema';

// Import all component schemas
import {
  TypographySchema
} from '../components/Typography/schema';

/**
 * Central schema registry containing all schema definitions
 * This can be used for validation, documentation generation, and tooling
 */
export const schemaRegistry: SchemaRegistry = {
  sections: {
    footer: FooterSectionSchema
  },
  
  patterns: {
    kj: KjFooterPatternSchema
  },
  
  components: {
    text: TypographySchema
  }
};

/**
 * Utility functions for working with schemas
 */
export const SchemaUtils = {
  /**
   * Get schema by type and category
   */
  getSchema(category: keyof SchemaRegistry, type: string) {
    return schemaRegistry[category][type];
  },

  /**
   * Get all schemas for a category
   */
  getSchemasForCategory(category: keyof SchemaRegistry) {
    return schemaRegistry[category];
  },

  /**
   * Get all available types for a category
   */
  getTypesForCategory(category: keyof SchemaRegistry): string[] {
    return Object.keys(schemaRegistry[category]);
  },

  /**
   * Validate if a type exists in a category
   */
  isValidType(category: keyof SchemaRegistry, type: string): boolean {
    return type in schemaRegistry[category];
  },

  /**
   * Get required props for a schema
   */
  getRequiredProps(category: keyof SchemaRegistry, type: string): string[] {
    const schema = this.getSchema(category, type);
    if (!schema) return [];
    
    return Object.entries(schema.props)
      .filter(([_, propDef]) => propDef.required === true)
      .map(([propName]) => propName);
  },

  /**
   * Get default values for a schema
   */
  getDefaultProps(category: keyof SchemaRegistry, type: string): Record<string, any> {
    const schema = this.getSchema(category, type);
    if (!schema) return {};
    
    const defaults: Record<string, any> = {};
    Object.entries(schema.props).forEach(([propName, propDef]) => {
      if (propDef.default !== undefined) {
        defaults[propName] = propDef.default;
      }
    });
    
    return defaults;
  }
};

/**
 * Export individual registries for convenience
 */
export const sectionSchemas = schemaRegistry.sections;
export const patternSchemas = schemaRegistry.patterns;
export const componentSchemas = schemaRegistry.components;