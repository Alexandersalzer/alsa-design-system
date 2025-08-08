import React from 'react';
import { switchLocale, type SupportedLocale, isSupportedLocale } from '../../../../system/utils/locale';

export interface I18nMessageHandlers {
  onLanguageUpdate: (languageCode: string) => void;
}

interface I18nMessageHandlerParams {
  setSelectedLanguage?: (language: string) => void;
  isEditingMode?: boolean;
}

// Function to request current language from parent (handshake)
export const requestCurrentLanguage = () => {
  console.log('🌐 [CHILD] Requesting current language from parent...');
  window.parent.postMessage({
    type: 'request-current-language'
  }, '*');
};

export const createI18nMessageHandlers = (params: I18nMessageHandlerParams): I18nMessageHandlers => {
  const { setSelectedLanguage, isEditingMode = false } = params;
  console.log('🌐 [CHILD] createI18nMessageHandlers called with params:', params);

  return {
    onLanguageUpdate: (languageCode: string) => {
      console.log('🌐 [CHILD] onLanguageUpdate called with:', languageCode, 'isEditingMode:', isEditingMode);
      
      // Validate that the language code is supported
      if (!isSupportedLocale(languageCode)) {
        console.warn('🌐 [CHILD] Unsupported language code received:', languageCode);
        return;
      }
      
      // Update the language picker state if setter is provided
      if (setSelectedLanguage) {
        console.log('🌐 [CHILD] Calling setSelectedLanguage with:', languageCode);
        setSelectedLanguage(languageCode);
      } else {
        console.log('🌐 [CHILD] No setSelectedLanguage function provided');
      }
      
      // Switch to the new locale using the existing locale utility
      // The isEditingMode parameter ensures proper URL handling
      console.log('🌐 [CHILD] Calling switchLocale with:', languageCode, 'isEditingMode:', isEditingMode);
      switchLocale(languageCode as SupportedLocale, isEditingMode);
    }
  };
};

// Hook for setting up i18n message listener
export const useI18nMessageListener = (handlers: I18nMessageHandlers) => {
  console.log('🌐 [CHILD] useI18nMessageListener hook called with handlers:', handlers);
  
  React.useEffect(() => {
    console.log('🌐 [CHILD] Setting up message listener effect');
    
    const handleMessage = (event: MessageEvent) => {
      console.log('🌐 [CHILD] Received postMessage event:', event);
      console.log('🌐 [CHILD] Event origin:', event.origin);
      console.log('🌐 [CHILD] Event data:', event.data);
      
      const { type, languageCode } = event.data;
      
      switch (type) {
        case 'language-update':
          console.log('🌐 [CHILD] Processing language-update message with languageCode:', languageCode);
          if (languageCode) {
            handlers.onLanguageUpdate(languageCode);
          } else {
            console.warn('🌐 [CHILD] language-update message missing languageCode');
          }
          break;
        case 'current-language-response':
          console.log('🌐 [CHILD] Received current-language-response with languageCode:', languageCode);
          if (languageCode) {
            handlers.onLanguageUpdate(languageCode);
          }
          break;
        case 'test-message':
          console.log('🌐 [CHILD] Received test message:', event.data);
          break;
        default:
          console.log('🌐 [CHILD] Ignoring message type:', type);
          break;
      }
    };

    console.log('🌐 [CHILD] Adding message event listener');
    window.addEventListener('message', handleMessage);
    
    // Remove the automatic handshake request for now to simplify debugging
    console.log('🌐 [CHILD] Message listener setup complete (no handshake request)');
    
    return () => {
      console.log('🌐 [CHILD] Removing message event listener');
      window.removeEventListener('message', handleMessage);
    };
  }, [handlers]);
};

// Setup i18n message listener (alternative to hook for class components)
export const setupI18nMessageListener = (handlers: I18nMessageHandlers): (() => void) => {
  console.log('🌐 [CHILD] setupI18nMessageListener called with handlers:', handlers);
  
  const handleMessage = (event: MessageEvent) => {
    console.log('🌐 [CHILD] [SETUP] Received postMessage event:', event);
    console.log('🌐 [CHILD] [SETUP] Event origin:', event.origin);
    console.log('🌐 [CHILD] [SETUP] Event data:', event.data);
    
    const { type, languageCode } = event.data;
    
    switch (type) {
      case 'language-update':
        console.log('🌐 [CHILD] [SETUP] Processing language-update message with languageCode:', languageCode);
        if (languageCode) {
          handlers.onLanguageUpdate(languageCode);
        } else {
          console.warn('🌐 [CHILD] [SETUP] language-update message missing languageCode');
        }
        break;
      case 'current-language-response':
        console.log('🌐 [CHILD] [SETUP] Received current-language-response with languageCode:', languageCode);
        if (languageCode) {
          handlers.onLanguageUpdate(languageCode);
        }
        break;
      default:
        console.log('🌐 [CHILD] [SETUP] Ignoring message type:', type);
        break;
    }
  };

  console.log('🌐 [CHILD] [SETUP] Adding message event listener');
  window.addEventListener('message', handleMessage);
  
  // Request current language from parent when listener is set up
  setTimeout(() => {
    console.log('🌐 [CHILD] [SETUP] Requesting current language after setup...');
    requestCurrentLanguage();
  }, 100);
  
  // Return cleanup function
  return () => {
    console.log('🌐 [CHILD] [SETUP] Removing message event listener');
    window.removeEventListener('message', handleMessage);
  };
}; 