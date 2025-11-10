// ===============================================
// blimpify-ui/design/system/schemas/demo.ts
// Demonstration av schema-systemet
// ===============================================

import { schemaRegistry, SchemaUtils } from './registry';
import type { ComponentSchema, PatternSchema, SectionSchema } from './types/base';

/**
 * Demo: Hur man använder schema-systemet
 */
export function schemaSystemDemo() {
  console.log('🎯 Blimpify Schema System Demo');
  console.log('================================\n');

  // 1. Hämta alla tillgängliga typer
  console.log('📋 Tillgängliga komponenter:');
  const componentTypes = SchemaUtils.getTypesForCategory('components');
  console.log(componentTypes.join(', '));
  console.log();

  console.log('📋 Tillgängliga patterns:');
  const patternTypes = SchemaUtils.getTypesForCategory('patterns');
  console.log(patternTypes.join(', '));
  console.log();

  console.log('📋 Tillgängliga sections:');
  const sectionTypes = SchemaUtils.getTypesForCategory('sections');
  console.log(sectionTypes.join(', '));
  console.log();

  // 2. Hämta ett specifikt schema
  console.log('🔍 Button component schema:');
  const buttonSchema = SchemaUtils.getSchema('components', 'button') as ComponentSchema;
  console.log(`Type: ${buttonSchema.type}`);
  console.log('Props:', Object.keys(buttonSchema.props));
  console.log();

  // 3. Kontrollera required props
  console.log('✅ Required props för Button:');
  const requiredProps = SchemaUtils.getRequiredProps('components', 'button');
  console.log(requiredProps.length > 0 ? requiredProps : 'Inga required props');
  console.log();

  // 4. Hämta default values
  console.log('⚙️ Default values för Button:');
  const defaultProps = SchemaUtils.getDefaultProps('components', 'button');
  console.log(defaultProps);
  console.log();

  // 5. Validera typ
  console.log('🔒 Type validation:');
  console.log(`'button' är valid component: ${SchemaUtils.isValidType('components', 'button')}`);
  console.log(`'unknown' är valid component: ${SchemaUtils.isValidType('components', 'unknown')}`);
  console.log();

  // 6. Visa section requirements
  // 6. Visa section requirements
  console.log('🏗️ Hero section patterns:');
  const heroSchema = SchemaUtils.getSchema('sections', 'hero') as SectionSchema;
  console.log('Required patterns:', heroSchema.requiredPatterns);
  console.log('Available patterns:', Object.keys(heroSchema.patterns));
  console.log();

  // 7. Visa footer section (special case - no required patterns)
  console.log('🦶 Footer section patterns:');
  const footerSchema = SchemaUtils.getSchema('sections', 'footer') as SectionSchema;
  console.log('Required patterns:', footerSchema.requiredPatterns);
  console.log('Available patterns:', Object.keys(footerSchema.patterns));
  console.log();

  return {
    componentTypes,
    patternTypes,
    sectionTypes,
    buttonSchema,
    requiredProps,
    defaultProps
  };
}

/**
 * Utility för att generera JSON structure från schema
 */
export function generateContentStructure(
  sectionType: string,
  patternTypes: string[],
  componentCounts: Record<string, number>
) {
  const sectionSchema = SchemaUtils.getSchema('sections', sectionType);
  if (!sectionSchema) {
    throw new Error(`Unknown section type: ${sectionType}`);
  }

  // Generera grundstruktur
  const structure = {
    type: sectionType,
    props: SchemaUtils.getDefaultProps('sections', sectionType),
    patterns: {} as Record<string, any>,
    order: [] as string[]
  };

  // Lägg till patterns
  patternTypes.forEach((patternType, index) => {
    const patternId = `${patternType}_${Math.random().toString(36).substr(2, 6)}`;
    const patternDefaults = SchemaUtils.getDefaultProps('patterns', patternType);
    
    structure.patterns[patternId] = {
      type: patternType,
      props: patternDefaults,
      components: {}
    };

    structure.order.push(patternId);

    // Lägg till components för detta pattern
    Object.entries(componentCounts).forEach(([componentType, count]) => {
      for (let i = 0; i < count; i++) {
        const componentId = `${componentType}_${Math.random().toString(36).substr(2, 6)}`;
        const componentDefaults = SchemaUtils.getDefaultProps('components', componentType);
        
        structure.patterns[patternId].components[componentId] = {
          type: componentType,
          props: componentDefaults
        };
      }
    });
  });

  return structure;
}

// Kör demo om denna fil körs direkt
if (require.main === module) {
  schemaSystemDemo();
  
  console.log('\n🏗️ Generera example structure:');
  const exampleStructure = generateContentStructure('hero', ['sectionBody', 'media'], {
    text: 2,
    button: 1,
    video: 1
  });
  console.log(JSON.stringify(exampleStructure, null, 2));
}