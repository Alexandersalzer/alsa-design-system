import { switchLocale, type SupportedLocale } from '../../../../system/utils/locale';

// Type definitions for child i18n messaging handlers
export interface I18nMessageHandlers {
  onLanguageChange?: (languageCode: string) => void;
}

// Setup message listener for language changes in child iframe
export const setupI18nMessageListener = (handlers: I18nMessageHandlers = {}) => {
  const handleMessage = (event: MessageEvent) => {
    // Handle language change messages from parent
    if (event.data.type === 'language-change') {
      const { languageCode } = event.data;
      
      console.log('Child iframe received language change:', languageCode);
      
      // Call custom handler if provided
      if (handlers.onLanguageChange) {
        handlers.onLanguageChange(languageCode);
      }
      
      // Default behavior: switch locale using existing utility
      // Pass true for isEditingMode since this is in the iframe context
      switchLocale(languageCode as SupportedLocale, true);
    }
  };

  // Setup listener
  window.addEventListener('message', handleMessage);
  
  // Return cleanup function
  return () => window.removeEventListener('message', handleMessage);
};

// Send language change request to parent (if needed)
export const requestLanguageChange = (languageCode: string) => {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({
      type: 'request-language-change',
      languageCode: languageCode
    }, '*');
  }
};

// Utility function to handle language change with custom logic
export const handleLanguageChange = (
  languageCode: string,
  customHandler?: (languageCode: string) => void
) => {
  console.log('Handling language change in child iframe:', languageCode);
  
  // Call custom handler if provided
  if (customHandler) {
    customHandler(languageCode);
  } else {
    // Default: switch locale using existing utility
    switchLocale(languageCode as SupportedLocale, true);
  }
}; 