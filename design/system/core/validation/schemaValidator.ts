// ===============================================
// blimpify-ui/design/system/core/validation/schemaValidator.ts
// Simple validation system using existing schemas
// ===============================================

import { ComponentNode, PatternNode, SectionNode } from '../types/nodes';
import { 
  schemaRegistry as existingSchemas,
  SchemaUtils 
} from '../schemas/registry';
import { PropDefinition } from '../schemas/types/base';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Validate component against existing schema registry
 */
export const validateComponent = (component: ComponentNode): ValidationResult => {
  const schema = existingSchemas.components[component.type];
  
  if (!schema) {
    const availableTypes = Object.keys(existingSchemas.components);
    return {
      valid: false,
      errors: [
        `Unknown component type: "${component.type}"`,
        `Available component types: ${availableTypes.join(', ') || 'none registered'}`
      ]
    };
  }

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 Validating component "${component.type}"`, { 
      props: component.props, 
      schema: schema.props 
    });
  }

  return validateNodeAgainstSchema(component, schema, 'component');
};

/**
 * Validate pattern against existing schema registry
 */
export const validatePattern = (pattern: PatternNode): ValidationResult => {
  const schema = existingSchemas.patterns[pattern.type];
  
  if (!schema) {
    const availableTypes = Object.keys(existingSchemas.patterns);
    return {
      valid: false,
      errors: [
        `Unknown pattern type: "${pattern.type}"`,
        `Available pattern types: ${availableTypes.join(', ') || 'none registered'}`
      ]
    };
  }

  const baseValidation = validateNodeAgainstSchema(pattern, schema, 'pattern');
  
  // Additional pattern-specific validation
  if (baseValidation.valid && pattern.components) {
    const componentValidation = validatePatternComponents(pattern, schema);
    return mergeValidationResults(baseValidation, componentValidation);
  }

  return baseValidation;
};

/**
 * Validate section against existing schema registry
 */
export const validateSection = (section: SectionNode): ValidationResult => {
  const schema = existingSchemas.sections[section.type];
  
  if (!schema) {
    const availableTypes = Object.keys(existingSchemas.sections);
    return {
      valid: false,
      errors: [
        `Unknown section type: "${section.type}"`,
        `Available section types: ${availableTypes.join(', ') || 'none registered'}`
      ]
    };
  }

  return validateNodeAgainstSchema(section, schema, 'section');
};

/**
 * Validate node against schema
 */
function validateNodeAgainstSchema(
  node: ComponentNode | PatternNode | SectionNode, 
  schema: any,
  nodeType: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate props if schema defines them
  if (schema.props && node.props) {
    Object.entries(schema.props as Record<string, PropDefinition>).forEach(([propName, propSchema]) => {
      const propValue = node.props?.[propName];

      // Check required props
      if (propSchema.required && (propValue === undefined || propValue === null || propValue === '')) {
        errors.push(`Missing required ${nodeType} prop: "${propName}"`);
      }

      // Validate enum values
      if (propSchema.type === 'enum' && propValue !== undefined && propValue !== null) {
        if (propSchema.values && Array.isArray(propSchema.values) && !(propSchema.values as any[]).includes(propValue)) {
          errors.push(
            `Invalid ${nodeType} prop "${propName}": "${propValue}". Must be one of: ${(propSchema.values as any[]).join(', ')}`
          );
        }
      }

      // Type validation
      if (propValue !== undefined && propValue !== null) {
        const typeValidation = validatePropType(propValue, propSchema, propName, nodeType);
        errors.push(...typeValidation.errors);
        warnings.push(...(typeValidation.warnings || []));
      }
    });
  }

  // Check for unknown props (warnings only)
  if (schema.props && node.props) {
    Object.keys(node.props).forEach(propName => {
      if (!schema.props[propName]) {
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

/**
 * Validate pattern components
 */
function validatePatternComponents(pattern: PatternNode, schema: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (pattern.components) {
    Object.entries(pattern.components).forEach(([key, component]) => {
      // 1. Check if component type exists in registry
      if (!existingSchemas.components[component.type]) {
        errors.push(
          `Pattern "${pattern.type}" contains unknown component type "${component.type}"`
        );
        return; // Skip further validation if type doesn't exist
      }

      // 2. Validate each component against its own schema
      const componentValidation = validateComponent(component);
      if (!componentValidation.valid) {
        // Add context about which pattern this component is in
        componentValidation.errors.forEach(error => {
          errors.push(`Component "${key}" in pattern "${pattern.type}": ${error}`);
        });
      }

      // Add component warnings with context
      if (componentValidation.warnings) {
        componentValidation.warnings.forEach(warning => {
          warnings.push(`Component "${key}" in pattern "${pattern.type}": ${warning}`);
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Validate individual prop type
 */
function validatePropType(value: any, propSchema: PropDefinition, propName: string, nodeType: string): ValidationResult {
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

/**
 * Merge validation results
 */
function mergeValidationResults(...results: ValidationResult[]): ValidationResult {
  const allErrors = results.flatMap(r => r.errors);
  const allWarnings = results.flatMap(r => r.warnings || []);

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings.length > 0 ? allWarnings : undefined
  };
}