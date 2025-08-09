import React from 'react';
import { switchLocale, type SupportedLocale, isSupportedLocale } from '../../../../system/utils/locale';

export interface I18nMessageHandlers {
  onLanguageUpdate: (languageCode: string) => void;
}

interface I18nMessageHandlerParams {
  setSelectedLanguage?: (language: string) => void;
  isEditingMode?: boolean;
}

export const createI18nMessageHandlers = (params: I18nMessageHandlerParams): I18nMessageHandlers => {
  const { setSelectedLanguage, isEditingMode = false } = params;

  return {
    onLanguageUpdate: (languageCode: string) => {
      console.log('🌐 Received language update in child:', languageCode, 'isEditingMode:', isEditingMode);
      
      // Validate that the language code is supported
      if (!isSupportedLocale(languageCode)) {
        console.warn('Unsupported language code received:', languageCode);
        return;
      }
      
      // Update the language picker state if setter is provided
      if (setSelectedLanguage) {
        setSelectedLanguage(languageCode);
      }
      
      // In editing mode, DON'T switch locale when receiving updates from parent
      // The parent handles content fetching and URL should remain stable
      // Only switch locale when user manually changes language in child
      if (!isEditingMode) {
        switchLocale(languageCode as SupportedLocale, isEditingMode);
      } else {
        console.log('🌐 Skipping URL change in editing mode - parent handles content fetching');
      }
    }
  };
};

// Function to send language change from child to parent (for bidirectional sync)
export const sendLanguageUpdateToParent = (languageCode: string) => {
  if (typeof window !== 'undefined' && window.parent) {
    console.log('🌐 Sending language update from child to parent:', languageCode);
    window.parent.postMessage({
      type: 'child-language-update',
      languageCode: languageCode
    }, '*');
  }
};

// Hook for setting up i18n message listener
export const useI18nMessageListener = (handlers: I18nMessageHandlers) => {
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, languageCode } = event.data;
      
      switch (type) {
        case 'language-update':
          if (languageCode) {
            handlers.onLanguageUpdate(languageCode);
          }
          break;
        default:
          // Ignore other message types
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handlers]);
}; 