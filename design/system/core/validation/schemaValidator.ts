// ===============================================
// blimpify-ui/design/system/core/validation/schemaValidator.ts
// Schema validation system for runtime type checking
// ===============================================

import { ComponentNode, PatternNode, SectionNode } from '../types/nodes';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface SchemaProperty {
  type: string;
  required?: boolean;
  values?: string[]; // For enum types
  default?: any;
  description?: string;
}

export interface ComponentSchema {
  type: string;
  props?: Record<string, SchemaProperty>;
  requiredProps?: string[];
}

export interface PatternSchema {
  type: string;
  props?: Record<string, SchemaProperty>;
  allowedComponents?: string[];
  requiredRoles?: string[];
}

export interface SectionSchema {
  type: string;
  props?: Record<string, SchemaProperty>;
  patterns?: Record<string, PatternSchema>;
  requiredPatterns?: string[];
}

/**
 * Schema Registry - Central registry for all component, pattern, and section schemas
 * Provides runtime validation against registered schemas
 */
class SchemaRegistry {
  private componentSchemas = new Map<string, ComponentSchema>();
  private patternSchemas = new Map<string, PatternSchema>();
  private sectionSchemas = new Map<string, SectionSchema>();

  // Component registration
  registerComponent(type: string, schema: ComponentSchema) {
    this.componentSchemas.set(type, schema);
    console.log(`📋 Registered component schema: ${type}`);
  }

  // Pattern registration
  registerPattern(type: string, schema: PatternSchema) {
    this.patternSchemas.set(type, schema);
    console.log(`🧩 Registered pattern schema: ${type}`);
  }

  // Section registration
  registerSection(type: string, schema: SectionSchema) {
    this.sectionSchemas.set(type, schema);
    console.log(`📄 Registered section schema: ${type}`);
  }

  // Component validation
  validateComponent(component: ComponentNode): ValidationResult {
    const schema = this.componentSchemas.get(component.type);
    
    if (!schema) {
      return {
        valid: false,
        errors: [
          `Unknown component type: "${component.type}"`,
          `Available component types: ${Array.from(this.componentSchemas.keys()).join(', ') || 'none registered'}`
        ]
      };
    }

    return this.validateNodeAgainstSchema(component, schema, 'component');
  }

  // Pattern validation
  validatePattern(pattern: PatternNode): ValidationResult {
    const schema = this.patternSchemas.get(pattern.type);
    
    if (!schema) {
      return {
        valid: false,
        errors: [
          `Unknown pattern type: "${pattern.type}"`,
          `Available pattern types: ${Array.from(this.patternSchemas.keys()).join(', ') || 'none registered'}`
        ]
      };
    }

    const baseValidation = this.validateNodeAgainstSchema(pattern, schema, 'pattern');
    
    // Additional pattern-specific validation
    if (baseValidation.valid && schema.allowedComponents && pattern.components) {
      const componentValidation = this.validatePatternComponents(pattern, schema);
      return this.mergeValidationResults(baseValidation, componentValidation);
    }

    return baseValidation;
  }

  // Section validation
  validateSection(section: SectionNode): ValidationResult {
    const schema = this.sectionSchemas.get(section.type);
    
    if (!schema) {
      return {
        valid: false,
        errors: [
          `Unknown section type: "${section.type}"`,
          `Available section types: ${Array.from(this.sectionSchemas.keys()).join(', ') || 'none registered'}`
        ]
      };
    }

    return this.validateNodeAgainstSchema(section, schema, 'section');
  }

  // Get available types for debugging
  getAvailableTypes() {
    return {
      components: Array.from(this.componentSchemas.keys()),
      patterns: Array.from(this.patternSchemas.keys()),
      sections: Array.from(this.sectionSchemas.keys())
    };
  }

  // Private validation methods
  private validateNodeAgainstSchema(
    node: ComponentNode | PatternNode | SectionNode, 
    schema: ComponentSchema | PatternSchema | SectionSchema, 
    nodeType: string
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate props if schema defines them
    if (schema.props && node.props) {
      Object.entries(schema.props).forEach(([propName, propSchema]) => {
        const propValue = node.props?.[propName];

        // Check required props
        if (propSchema.required && (propValue === undefined || propValue === null || propValue === '')) {
          errors.push(`Missing required ${nodeType} prop: "${propName}"`);
        }

        // Validate enum values
        if (propSchema.type === 'enum' && propValue !== undefined && propValue !== null) {
          if (!propSchema.values?.includes(propValue)) {
            errors.push(
              `Invalid ${nodeType} prop "${propName}": "${propValue}". Must be one of: ${propSchema.values?.join(', ') || 'none defined'}`
            );
          }
        }

        // Type validation
        if (propValue !== undefined && propValue !== null) {
          const typeValidation = this.validatePropType(propValue, propSchema, propName, nodeType);
          errors.push(...typeValidation.errors);
          warnings.push(...typeValidation.warnings || []);
        }
      });
    }

    // Check for unknown props (warnings only)
    if (schema.props && node.props) {
      Object.keys(node.props).forEach(propName => {
        if (!schema.props![propName]) {
          warnings.push(`Unknown ${nodeType} prop: "${propName}". This prop is not defined in the schema.`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  private validatePatternComponents(pattern: PatternNode, schema: PatternSchema): ValidationResult {
    const errors: string[] = [];

    if (schema.allowedComponents && pattern.components) {
      Object.entries(pattern.components).forEach(([key, component]) => {
        if (!schema.allowedComponents!.includes(component.type)) {
          errors.push(
            `Pattern "${pattern.type}" does not allow component type "${component.type}". Allowed: ${schema.allowedComponents!.join(', ')}`
          );
        }
      });
    }

    // Validate required roles
    if (schema.requiredRoles && pattern.components) {
      const componentRoles = Object.values(pattern.components)
        .map(c => c.props?.role)
        .filter(Boolean);

      schema.requiredRoles.forEach(requiredRole => {
        if (!componentRoles.includes(requiredRole)) {
          errors.push(`Pattern "${pattern.type}" is missing required role: "${requiredRole}"`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private validatePropType(value: any, propSchema: SchemaProperty, propName: string, nodeType: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    switch (propSchema.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`${nodeType} prop "${propName}" must be a string, got ${typeof value}`);
        }
        break;
      case 'number':
        if (typeof value !== 'number') {
          errors.push(`${nodeType} prop "${propName}" must be a number, got ${typeof value}`);
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`${nodeType} prop "${propName}" must be a boolean, got ${typeof value}`);
        }
        break;
      // Add more type validations as needed
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  private mergeValidationResults(...results: ValidationResult[]): ValidationResult {
    const allErrors = results.flatMap(r => r.errors);
    const allWarnings = results.flatMap(r => r.warnings || []);

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings.length > 0 ? allWarnings : undefined
    };
  }
}

// Export singleton instance
export const schemaRegistry = new SchemaRegistry();

// Export validation utilities
export const validateComponent = (component: ComponentNode) => schemaRegistry.validateComponent(component);
export const validatePattern = (pattern: PatternNode) => schemaRegistry.validatePattern(pattern);
export const validateSection = (section: SectionNode) => schemaRegistry.validateSection(section);