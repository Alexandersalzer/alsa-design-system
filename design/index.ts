// Export all design system components, utilities, and types
export * from './system';

// Export ContentProvider with explicit naming to avoid conflicts
export {
  ContentProvider,
  useContent,
  type ContentBlock,
  type ContentPattern,
  type ContentTemplate,
  type GlobalComponent,
  type ContentPage
} from './cms/wrappers/content/ContentProvider';

export * from './cms/wrappers/editing/EditingWrapper';

// Export initial messaging functionality (editing status only)
export {
  InitialMessageHandler,
  sendEditingStatusUpdate,
  setupEditingStatusMessageListener,
  type InitialMessageHandlerConfig,
  type InitialMessageHandlers
} from './cms/messaging/initial/parent';

// Export content messaging functionality
export {
  ParentMessageHandler,
  createParentMessageHandler,
  sendWebsiteContentResponse,
  setupBasicParentMessageListener,
  type ParentMessageHandlerConfig,
  type ParentMessageHandlers
} from './cms/messaging/content/parent/contentMessaging';

// Export design token messaging functionality
export {
  DesignTokenParentHandler,
  sendAccentColorUpdate,
  sendRadiusUpdate,
  sendThemeUpdate,
  sendFontUpdate,
  sendFontUpdateWithLookup,
  type DesignTokenParentConfig
} from './cms/messaging/design/parent/designTokenMessaging';

export { 
  createDesignTokenMessageHandlers,
  handleDesignTokenMessage,
  setupDesignTokenMessageListener,
  type DesignTokenMessageHandlers
} from './cms/messaging/design/child/designTokenMessaging';

// Export content types with explicit naming to avoid conflicts
export type { 
  WebsiteContent
} from './cms/utils/content';

// Export client-safe type exports only (no server-side functions)
export type { Locale } from './cms/i18n/i18n';

// Remove dimensionMessaging export
// export { sendBothDimensions } from './cms/messaging/dimensionMessaging'; 