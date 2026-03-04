// src/design-system/components/index.ts
export * from './layout';
export * from './frames';

// src/design-system/components/primitives/index.ts
export * from './actions'
export * from './forms'
export * from './feedback'
export * from './overlays'
export * from './media'
export * from './lists'
export * from './data'
export * from './navigation'
export * from './animations'
export * from './backgrounds'

export * from './Typography';
export * from './LogoIcon';
export * from './app-icon';

// Export component registry for external use (icon mappings, etc.)
export { componentRegistry } from './registry';

// Export schema registry for external use (icon mappings, etc.)
export { componentSchemas, getComponentSchema } from './schemaRegistry';
