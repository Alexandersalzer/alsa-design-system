// Export all design system components, utilities, and types
export * from './system';
export * from './cms/context/ContentContext';
export * from './cms/context/ContentProvider';
export * from './cms/modules/initial/child/EditingWrapper';

// Export initial messaging functionality (editing status only)
export {
  InitialMessageHandler,
  sendEditingStatusUpdate,
  setupEditingStatusMessageListener,
  type InitialMessageHandlerConfig,
  type InitialMessageHandlers
} from './cms/modules/initial/parent';

// Export content messaging functionality
export {
  ParentMessageHandler,
  createParentMessageHandler,
  sendWebsiteContentResponse,
  setupBasicParentMessageListener,
  type ParentMessageHandlerConfig,
  type ParentMessageHandlers
} from './cms/modules/content/parent/contentMessaging';

// Export design token messaging functionality
export {
  DesignTokenParentHandler,
  sendAccentColorUpdate,
  sendRadiusUpdate,
  sendThemeUpdate,
  sendFontUpdate,
  sendFontUpdateWithLookup,
  type DesignTokenParentConfig
} from './cms/modules/design/parent/designTokenMessaging';

export { 
  createDesignTokenMessageHandlers,
  handleDesignTokenMessage,
  setupDesignTokenMessageListener,
  type DesignTokenMessageHandlers
} from './cms/modules/design/child/designTokenMessaging';

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