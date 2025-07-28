// Main exports for Blimpify UI Design System

// System exports
export * from './system';

// CMS modules exports (with explicit naming to avoid conflicts)
export { ContentContext, useContent } from './cms/context/ContentContext';
export { ContentProvider } from './cms/context/ContentProvider';
export { EditingModeWrapper, useEditingMode } from './cms/modules/initial/EditingWrapper';

// CMS utilities and messaging (client-side only)
export { sendBothDimensions } from './cms/messaging/dimensionMessaging';

// Types
export type { 
  WebsiteContent, 
  Page, 
  Template, 
  Pattern, 
  Block as ContentBlock,
  BlockType 
} from './cms/types/content'; 