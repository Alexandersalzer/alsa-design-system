// Main exports for Blimpify UI Design System

// System exports
export * from './system';

// CMS modules exports (with explicit naming to avoid conflicts)
export { ContentContext, useContent } from './cms-modules/context/ContentContext';
export { ContentProvider } from './cms-modules/context/ContentProvider';
export { ToggleProvider, ToggleProviderWrapper, useToggle } from './cms-modules/context/ToggleContext';

// CMS utilities and messaging
export { getAllPagesContent, getPageContent, getAvailableLocales } from './cms-modules/utils/contentLoader';
export { sendBothDimensions } from './cms-modules/messaging/dimensionMessaging';

// Types
export type { 
  WebsiteContent, 
  Page, 
  Template, 
  Pattern, 
  Block as ContentBlock,
  BlockType 
} from './cms-modules/types/content'; 