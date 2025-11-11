/**
 * Core Design System Types
 * 
 * Central export point for all design system type definitions.
 * This provides a clean API for importing types throughout the system.
 */

// BaseNode types - Foundation interfaces
export type {
  BaseNode,
  ComponentNode,
  PatternNode,
  SectionNode,
  PageNode
} from './types/nodes';

// Render utilities and components
export * from './render';

// Validation system
export { SchemaInitializer } from './validation/SchemaInitializer';
export { registerAllSchemas, validateJSON } from './validation/registerSchemas';
export { validateComponent, validatePattern, validateSection } from './validation/schemaValidator';

export * from './schemas';

export * from './content';

