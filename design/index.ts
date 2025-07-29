// Export all design system components, utilities, and types
export * from './system';
export * from './cms/context/ContentContext';
export * from './cms/context/ContentProvider';
export * from './cms/modules/initial/child/EditingWrapper';

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