/**
 * Schema System Exports
 * 
 * Exports all schema types, utilities, and registry for use in other packages
 * (e.g., im-dashboard for CMS editor)
 */

// Type definitions
export * from './component.types';
export * from './pattern.types';
export * from './page.types';
export * from './shared';

// Section types - explicit exports to avoid commonLayoutProps conflict
export type {
  SectionSchema,
  SectionType,
  SectionLayoutConfig,
  BackgroundSchema,
  PatternConstraints,
  SectionLayoutRule,
  SectionHeaderRule,
  SectionNavigationConfig
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
