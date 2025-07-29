// Export all design system components, utilities, and types
export * from './system';
export * from './cms/context/ContentContext';
export * from './cms/context/ContentProvider';
export * from './cms/modules/initial/child/EditingWrapper';

// Export initial messaging functionality (editing status only)
export * from './cms/modules/initial/parent';

// Export full parent messaging functionality
export * from './cms/modules/parentMessaging';

// Export content types with explicit naming to avoid conflicts
export type { 
  WebsiteContent, 
  Page, 
  Template, 
  Pattern, 
  Block as ContentBlock,
  BlockType 
} from './cms/types/content';

// Remove dimensionMessaging export
// export { sendBothDimensions } from './cms/messaging/dimensionMessaging'; 