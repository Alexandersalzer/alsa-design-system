/**
 * Component Schema Registry
 * 
 * Central registry for all component schemas.
 * Maps component type strings to their schema definitions.
 * 
 * Usage:
 * ```typescript
 * import { componentSchemas, getComponentSchema } from './schemaRegistry';
 * 
 * const schema = getComponentSchema('button');
 * const defaultProps = schema?.defaultProps;
 * ```
 */

import { ComponentSchema } from '../core/schemas/component.types';
import buttonSchema from './actions/Button/schema';

/**
 * Registry mapping component types to their schemas
 */
export const componentSchemas: Record<string, ComponentSchema> = {
  button: buttonSchema,
  // Add more component schemas here as they are created:
  // heading: headingSchema,
  // body: bodySchema,
  // image: imageSchema,
  // etc...
};

/**
 * Get schema for a component type
 * @param componentType - The component type (e.g., 'button')
 * @returns The component schema or undefined if not found
 */
export function getComponentSchema(componentType: string): ComponentSchema | undefined {
  return componentSchemas[componentType];
}

/**
 * Get default props from a component schema
 * @param componentType - The component type (e.g., 'button')
 * @returns Default props object or empty object if schema not found
 */
export function getDefaultProps(componentType: string): Record<string, any> {
  const schema = getComponentSchema(componentType);
  return schema?.defaultProps || {};
}

/**
 * Merge default props with provided props
 * @param componentType - The component type
 * @param props - Props from JSON
 * @returns Merged props (defaults + provided)
 */
export function mergeWithDefaults(
  componentType: string,
  props: Record<string, any> = {}
): Record<string, any> {
  const defaults = getDefaultProps(componentType);
  return {
    ...defaults,
    ...props, // User props override defaults
  };
}

/**
 * Validate component props against schema
 * @param componentType - The component type
 * @param props - Props to validate
 * @returns Validation result
 */
export function validateComponentProps(
  componentType: string,
  props: Record<string, any>
): { valid: boolean; errors: string[]; warnings: string[] } {
  const schema = getComponentSchema(componentType);
  
  if (!schema) {
    return {
      valid: true,
      errors: [],
      warnings: [`No schema found for component type: ${componentType}`],
    };
  }
  
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required props
  Object.entries(schema.props).forEach(([propKey, propConfig]) => {
    if (propConfig.required && !(propKey in props)) {
      errors.push(`Missing required prop: ${propKey}`);
    }
  });
  
  // Run validation rules
  if (schema.validation) {
    schema.validation.forEach((rule) => {
      const validator = typeof rule.validator === 'function' 
        ? rule.validator 
        : () => true; // String validators need to be compiled
      
      const isValid = validator(null, props);
      
      if (!isValid) {
        if (rule.severity === 'error') {
          errors.push(rule.message);
        } else if (rule.severity === 'warning') {
          warnings.push(rule.message);
        }
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get all available component types
 */
export function getAvailableComponentTypes(): string[] {
  return Object.keys(componentSchemas);
}

/**
 * Get all schemas for a specific category
 */
export function getSchemasByCategory(category: string): ComponentSchema[] {
  return Object.values(componentSchemas).filter(
    (schema) => schema.category === category
  );
}
