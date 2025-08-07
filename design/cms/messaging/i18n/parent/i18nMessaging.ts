import React from 'react';

// Type definitions for parent i18n messaging (language switching only)
export interface I18nParentConfig {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  availableLanguages?: Array<{
    id: number;
    name: string;
    code: string;
    is_default: boolean;
    is_active: boolean;
  }>;
}

export interface I18nParentHandlers {
  onLanguageChangeRequest?: (languageCode: string) => void;
}

export class I18nParentHandler {
  private config: I18nParentConfig;
  private handlers: I18nParentHandlers;

  constructor(config: I18nParentConfig, handlers: I18nParentHandlers = {}) {
    this.config = config;
    this.handlers = handlers;
  }

  // Send language change update to iframe
  sendLanguageUpdate = (languageCode: string) => {
    console.log('Sending language update to iframe:', languageCode);
    
    if (this.config.iframeRef.current?.contentWindow) {
      this.config.iframeRef.current.contentWindow.postMessage({
        type: 'language-change',
        languageCode: languageCode
      }, '*');
    } else {
      console.error('Cannot send language change message: iframe or contentWindow not available');
    }
  };

  // Handle incoming messages from iframe (language change requests)
  handleMessage = (event: MessageEvent) => {
    // Handle requests for language change
    if (event.data.type === 'request-language-change') {
      const { languageCode } = event.data;
      
      // Call custom handler if provided
      if (this.handlers.onLanguageChangeRequest) {
        this.handlers.onLanguageChangeRequest(languageCode);
      }
      
      // Send the language update
      this.sendLanguageUpdate(languageCode);
    }
  };

  // Setup message listener
  setupMessageListener = () => {
    window.addEventListener('message', this.handleMessage);
    return () => window.removeEventListener('message', this.handleMessage);
  };

  // Update config (useful when available languages change)
  updateConfig = (newConfig: Partial<I18nParentConfig>) => {
    this.config = { ...this.config, ...newConfig };
  };

  // Update handlers
  updateHandlers = (newHandlers: Partial<I18nParentHandlers>) => {
    this.handlers = { ...this.handlers, ...newHandlers };
  };
}

// Utility functions for i18n messaging

// Send language change update (utility function)
export const sendLanguageUpdate = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  languageCode: string
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'language-change',
      languageCode: languageCode
    }, '*');
  }
};

// Create a basic i18n parent handler
export const createI18nParentHandler = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  availableLanguages?: Array<{
    id: number;
    name: string;
    code: string;
    is_default: boolean;
    is_active: boolean;
  }>
) => {
  return new I18nParentHandler({ iframeRef, availableLanguages });
}; 