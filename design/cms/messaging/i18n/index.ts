// Export parent handlers
export {
  I18nParentHandler,
  type I18nParentConfig,
  type I18nParentHandlers,
  sendLanguageChange,
  createI18nParentHandler
} from './parent';

// Export child handlers
export {
  type I18nMessageHandlers,
  sendLanguageChangeResponse,
  requestLanguageChange,
  setupI18nMessageListener,
  getCurrentLanguageFromPath,
  updateUrlForLanguageChange
} from './child'; 