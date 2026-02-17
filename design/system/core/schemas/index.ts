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

// Section types - also has commonLayoutProps, but we only need specific types
export type { 
  SectionSchema,
  SectionType,
  SectionCategory,
  SectionAlignment,
  VerticalAlignment,
  GapSize,
  SectionLayoutConfig,
  SectionLayoutSchema,
  BackgroundType,
  BackgroundSchema,
  PatternConstraints,
  PatternOrderConstraint,
  SectionExample,
  SectionValidationContext
} from './section.types';

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
