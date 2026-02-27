/**
 * Schema System Exports
 * 
 * Exports all schema types, utilities, and registry for use in other packages
 * (e.g., im-dashboard for CMS editor)
 */

// Type definitions
export * from './component.types';
export * from './shared';
export * from './page.types';

// Pattern types - exports commonLayoutProps
export * from './pattern.types';

// Section types - validation rules and metadata
export type { 
  SectionType,
  SectionMetadata,
  SectionValidationConfig
} from './section.types';

export {
  AllowedSectionTypes,
  isValidSectionType,
  SectionPositioningRules,
  SectionOccurrenceRules,
  sectionValidationConfig,
  sectionMetadata,
  getSectionMetadata,
  getSectionsByCategory,
  getSectionPositionRequirement
} from './section.types';

// Section schema system - complete schema definitions for sections
export type {
  SectionLayoutPropGroup,
  SectionLayoutExample,
  SectionSchema,
  LayoutPropNames,
  RequiredLayoutPropNames
} from './section-schema.types';

export {
  defaultSectionLayoutProps,
  defaultSectionSchemaBase,
  validateSectionLayout
} from './section-layout.schema';

export type {
  SectionLayoutValidationResult
} from './section-layout.schema';

// Section schema registry
export {
  getSectionSchema,
  getAllSectionSchemas,
  getSectionSchemasByCategory,
  hasSectionSchema,
  getDefaultSectionLayout,
  getSectionLayoutProp
} from './section-schema.registry';

// Individual section schemas
export { heroSectionSchema } from './sections/hero.schema';

// i18n system
export * from './i18n';

// Schema registry functions (located in components/ folder)
export { 
  componentSchemas,
  getComponentSchema,
  getDefaultProps,
  mergeWithDefaults,
  validateComponentProps,
  getAvailableComponentTypes,
  getSchemasByCategory,
  getSchemaLocale,
  setSchemaLocale
} from '../../components/schemaRegistry';
