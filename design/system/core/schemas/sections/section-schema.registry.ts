/**
 * Section Schema Registry
 * 
 * Central registry for all section schemas.
 * Provides functions to access section schemas by type.
 */

import type { SectionSchema } from './section-schema.types';
import type { SectionType } from './section.types';
import { heroSectionSchema } from './hero.schema';
import { defaultSectionLayoutProps, defaultSectionSchemaBase } from './section-layout.schema';

/**
 * Create a basic section schema from section type
 * Used as fallback until specific schemas are created
 */
function createBasicSectionSchema(
  id: SectionType,
  displayName: string,
  category: SectionSchema['category'],
  description?: string
): SectionSchema {
  return {
    $id: id,
    displayName,
    category,
    description,
    version: '1.0.0',
    layoutProps: defaultSectionLayoutProps,
    defaultLayout: defaultSectionSchemaBase.defaultLayout,
    validation: defaultSectionSchemaBase.validation,
    cmsEnabled: true
  };
}

/**
 * Section schema registry
 * Maps section types to their schemas
 */
const sectionSchemaRegistry: Record<SectionType, SectionSchema> = {
  hero: heroSectionSchema,
  
  about: createBasicSectionSchema(
    'about',
    'About',
    'content',
    'Section describing company or service overview'
  ),
  
  services: createBasicSectionSchema(
    'services',
    'Services',
    'content',
    'Showcase of services or features'
  ),
  
  testimonials: {
    ...createBasicSectionSchema(
      'testimonials',
      'Testimonials',
      'social-proof',
      'Customer testimonials and reviews'
    ),
    // Testimonials typically center-aligned
    defaultLayout: {
      ...defaultSectionSchemaBase.defaultLayout,
      alignSectionHeader: 'center'
    }
  },
  
  faq: createBasicSectionSchema(
    'faq',
    'FAQ',
    'utility',
    'Frequently asked questions'
  ),
  
  pricing: createBasicSectionSchema(
    'pricing',
    'Pricing',
    'conversion',
    'Pricing plans and packages'
  ),
  
  cta: {
    ...createBasicSectionSchema(
      'cta',
      'CTA',
      'conversion',
      'Conversion-focused call-to-action'
    ),
    defaultLayout: {
      ...defaultSectionSchemaBase.defaultLayout,
      alignSectionHeader: 'center'
    }
  },
  
  logos: {
    ...createBasicSectionSchema(
      'logos',
      'Logos',
      'social-proof',
      'Client or partner logos showcase'
    ),
    defaultLayout: {
      ...defaultSectionSchemaBase.defaultLayout,
      alignSectionHeader: 'center'
    }
  },
  
  stats: createBasicSectionSchema(
    'stats',
    'Stats',
    'social-proof',
    'Key metrics and statistics'
  ),
  
  team: createBasicSectionSchema(
    'team',
    'Team',
    'content',
    'Team member profiles'
  ),
  
  process: createBasicSectionSchema(
    'process',
    'Process',
    'content',
    'Step-by-step process or workflow'
  ),
  
  contact: {
    ...createBasicSectionSchema(
      'contact',
      'Contact',
      'conversion',
      'Contact form and information'
    ),
    defaultLayout: {
      ...defaultSectionSchemaBase.defaultLayout,
      alignSectionHeader: 'center',
      distanceAction: false // Keep form actions close
    }
  }
};

/**
 * Get section schema by type
 * 
 * @param type - Section type identifier
 * @returns Section schema or undefined if not found
 */
export function getSectionSchema(type: SectionType): SectionSchema | undefined {
  return sectionSchemaRegistry[type];
}

/**
 * Get all section schemas
 * 
 * @returns Array of all registered section schemas
 */
export function getAllSectionSchemas(): SectionSchema[] {
  return Object.values(sectionSchemaRegistry);
}

/**
 * Get section schemas by category
 * 
 * @param category - Section category to filter by
 * @returns Array of section schemas in the category
 */
export function getSectionSchemasByCategory(
  category: SectionSchema['category']
): SectionSchema[] {
  return getAllSectionSchemas().filter(schema => schema.category === category);
}

/**
 * Check if section type has schema
 * 
 * @param type - Section type to check
 * @returns True if schema exists
 */
export function hasSectionSchema(type: SectionType): boolean {
  return type in sectionSchemaRegistry;
}

/**
 * Get default layout for section type
 * 
 * @param type - Section type identifier
 * @returns Default layout configuration or empty object
 */
export function getDefaultSectionLayout(type: SectionType): Record<string, any> {
  const schema = getSectionSchema(type);
  return schema?.defaultLayout || {};
}

/**
 * Get layout prop config by name
 * 
 * @param type - Section type identifier
 * @param propName - Layout prop name
 * @returns PropConfig or undefined if not found
 */
export function getSectionLayoutProp(
  type: SectionType,
  propName: string
): any | undefined {
  const schema = getSectionSchema(type);
  return schema?.layoutProps[propName];
}
