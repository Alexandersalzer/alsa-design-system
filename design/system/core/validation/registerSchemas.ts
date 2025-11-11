// ===============================================
// blimpify-ui/design/system/core/validation/registerSchemas.ts
// Auto-registration of all schemas for runtime validation
// ===============================================

import { schemaRegistry } from './schemaValidator';

// Import component schemas
import { TypographySchema } from '../../components/Typography/schema';

// Import pattern schemas
import { KjFooterPatternSchema } from '../../patterns/footer/KjFooter/schema';

// Import section schemas
import { FooterSectionSchema } from '../../templates/footer/schema';

/**
 * Register all schemas with the schema registry
 * This should be called once during application initialization
 */
export function registerAllSchemas() {
  console.log('🚀 Registering all schemas...');

  try {
    // Register component schemas
    schemaRegistry.registerComponent('text', TypographySchema);

    // Register pattern schemas  
    schemaRegistry.registerPattern('kj', KjFooterPatternSchema);

    // Register section schemas
    schemaRegistry.registerSection('footer', FooterSectionSchema);

    console.log('✅ All schemas registered successfully');
    
    // Log available types for debugging
    const availableTypes = schemaRegistry.getAvailableTypes();
    console.log('📋 Available component types:', availableTypes.components);
    console.log('🧩 Available pattern types:', availableTypes.patterns);
    console.log('📄 Available section types:', availableTypes.sections);
    
  } catch (error) {
    console.error('❌ Failed to register schemas:', error);
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
        return schemaRegistry.validateComponent(json);
      case 'pattern':
        return schemaRegistry.validatePattern(json);
      case 'section':
        return schemaRegistry.validateSection(json);
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