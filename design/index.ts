// Export all design system components, utilities, and types
export * from './system';

// Export all CMS wrappers functionality
export * from './cms/wrappers';

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
  type ParentMessageHandlerConfig,
  type ParentMessageHandlers
} from './cms/messaging/content/parent/contentMessaging';

// Export design token messaging functionality
export {
  DesignTokenParentHandler,
  type DesignTokenParentConfig
} from './cms/messaging/design/parent/designTokenMessaging';

// Export page switch messaging functionality
export {
  PageSwitchParentHandler,
  sendPageSwitchUpdate,
  setupPageSwitchMessageListener,
  type PageSwitchParentConfig,
  type PageSwitchParentHandlers
} from './cms/messaging/page-switch/parent/pageSwitchMessaging';

// Export layout components (client-safe)
export { ContentLayout } from './cms/wrappers/ContentLayout';

// Export WebsiteContent type from new location
export { type WebsiteContent } from './cms/wrappers/content/types/content'; 