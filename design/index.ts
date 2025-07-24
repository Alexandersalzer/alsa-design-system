// Main exports for Blimpify UI Design System

// System exports
export * from './system';

// CMS modules exports (with explicit naming to avoid conflicts)
export { ContentContext, useContent } from './cms-modules/context/ContentContext';
export { ContentProvider } from './cms-modules/context/ContentProvider';
export { ToggleProvider, useToggle } from './cms-modules/context/ToggleContext';
export type { 
  WebsiteContent, 
  Page, 
  Template, 
  Pattern, 
  Block as ContentBlock,
  BlockType 
} from './cms-modules/types/content'; 