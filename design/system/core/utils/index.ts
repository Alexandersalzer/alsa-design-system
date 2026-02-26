// ===============================================
// blimpify-ui/design/system/core/utils/index.ts
// Export all core utilities
// ===============================================

export * from './props';
export * from './env';
export * from './loaders';
export * from './media';

// Context providers
export { PageSlugProvider } from '../context/PageSlugProvider';

// Re-export commonly used types for easier imports
export type { 
  ComponentNode, 
  PatternNode, 
  PatternLayout, 
  LayoutItem, 
  LayoutCategory,
  LayoutTemplate,
  TemplateNode
} from '../types/nodes';