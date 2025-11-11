// ===============================================
// blimpify-ui/design/system/core/validation/registerSchemas.ts
// Schema validation initialization for existing schema system
// ===============================================

import { validateComponent, validatePattern, validateSection } from './schemaValidator';
import { schemaRegistry as existingSchemas } from '../schemas/registry';

/**
 * Initialize validation system
 * This checks that the existing schemas are available and sets up validation
 */
export function registerAllSchemas() {
  try {
    // Check that schemas exist - silent initialization
    const componentTypes = Object.keys(existingSchemas.components);
    const patternTypes = Object.keys(existingSchemas.patterns);  
    const sectionTypes = Object.keys(existingSchemas.sections);
    
  } catch (error) {
    console.error('❌ Failed to initialize validation system:', error);
    throw error;
  }
}

/**
 * Development helper to validate a JSON structure manually
 * Useful for testing schemas in development
 */
export function validateJSON(json: any, type: 'component' | 'pattern' | 'section') {
  if (!json) {
    return { valid: false, errors: ['No JSON provided'] };
  }

  try {
    switch (type) {
      case 'component':
        return validateComponent(json);
      case 'pattern':
        return validatePattern(json);
      case 'section':
        return validateSection(json);
      default:
        return { valid: false, errors: [`Unknown validation type: ${type}`] };
    }
  } catch (error) {
    return {
      valid: false,
      errors: [`Validation error: ${error instanceof Error ? error.message : String(error)}`]
    };
  }
}