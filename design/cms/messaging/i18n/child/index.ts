// Export i18n messaging functionality for child (iframe)
export { 
  createI18nMessageHandlers,
  useI18nMessageListener,
  sendLanguageUpdateToParent,
  type I18nMessageHandlers 
} from './i18nMessaging'; 