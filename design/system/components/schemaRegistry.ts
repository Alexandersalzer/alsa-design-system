/**
 * Component Schema Registry
 * 
 * Central registry for all component schemas.
 * Maps component type strings to their schema definitions.
 * Supports runtime locale switching for language-specific defaults and labels.
 * 
 * Usage:
 * ```typescript
 * import { componentSchemas, getComponentSchema, setSchemaLocale } from './schemaRegistry';
 * 
 * // Change locale (will regenerate all schemas)
 * setSchemaLocale('en');
 * 
 * // Get schema for current locale
 * const schema = getComponentSchema('button');
 * const defaultProps = schema?.defaultProps; // Language-specific defaults
 * ```
 */

import { ComponentSchema } from '../core/schemas/component.types';
import type { SupportedLocale } from '../core/schemas/i18n/types';
import { 
  getSchemaLocale as getCoreSchemaLocale,
  setSchemaLocale as setCoreSchemaLocale,
  onLocaleChange 
} from '../core/schemas/i18n';
import { createButtonSchema } from './actions/Button/schema';

/**
 * Schema factory functions
 * Maps component type to its schema creation function
 */
const schemaFactories: Record<string, (locale: SupportedLocale) => ComponentSchema> = {
  button: createButtonSchema,
  // Add more component schema factories here as they are created:
  // heading: createHeadingSchema,
  // body: createBodySchema,
  // image: createImageSchema,
  // etc...
};

/**
 * Cached schemas for current locale
 * Regenerated when locale changes
 */
let cachedSchemas: Record<string, ComponentSchema> = {};

/**
 * Generate all schemas for current locale
 */
function regenerateSchemas(): void {
  const locale = getCoreSchemaLocale();
  cachedSchemas = {};
  
  for (const [type, factory] of Object.entries(schemaFactories)) {
    try {
      cachedSchemas[type] = factory(locale);
    } catch (error) {
      console.error(`Failed to generate schema for ${type}:`, error);
    }
  }
}

// Initialize schemas with default locale
regenerateSchemas();

// Listen for locale changes and regenerate schemas
onLocaleChange(() => {
  regenerateSchemas();
});

/**
 * Component schemas registry (dynamic proxy)
 * Automatically returns cached schema for current locale
 */
export const componentSchemas = new Proxy({} as Record<string, ComponentSchema>, {
  get(target, prop: string) {
    return cachedSchemas[prop];
  },
  
  // Support Object.keys(), Object.values(), etc.
  ownKeys() {
    return Object.keys(cachedSchemas);
  },
  
  getOwnPropertyDescriptor(target, prop) {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

/**
 * Get the current schema locale
 * @returns Current locale code (e.g., 'sv', 'en')
 */
export function getSchemaLocale(): SupportedLocale {
  return getCoreSchemaLocale();
}

/**
 * Set the schema locale
 * This will regenerate all schemas with new language-specific defaults and labels
 * 
 * @param locale - New locale code
 * 
 * @example
 * ```typescript
 * // Switch to English
 * setSchemaLocale('en');
 * 
 * // All schemas now have English labels and defaults
 * const button = getComponentSchema('button');
 * console.log(button.defaultProps.content); // "Click here"
 * 
 * // Switch to Swedish
 * setSchemaLocale('sv');
 * console.log(button.defaultProps.content); // "Klicka här"
 * ```
 */
export function setSchemaLocale(locale: SupportedLocale): void {
  setCoreSchemaLocale(locale);
  // Schemas will be regenerated automatically via onLocaleChange listener
}

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
