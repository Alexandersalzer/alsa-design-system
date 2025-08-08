import React from 'react';

// Configuration for parent i18n message handler
export interface I18nParentConfig {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  selectedLanguage?: string;
}

// Optional handlers for i18n events
export interface I18nParentHandlers {
  onLanguageChangeRequest?: (language: string) => void;
  onLanguageChangeResponse?: (success: boolean, language: string) => void;
}

export class I18nParentHandler {
  private config: I18nParentConfig;
  private handlers: I18nParentHandlers;

  constructor(config: I18nParentConfig, handlers: I18nParentHandlers = {}) {
    this.config = config;
    this.handlers = handlers;
  }

  // Send language change to iframe
  sendLanguageChange = (language: string) => {
    console.log('📡 Sending language change to iframe:', language);
    
    if (this.config.iframeRef.current?.contentWindow) {
      this.config.iframeRef.current.contentWindow.postMessage({
        type: 'language-change',
        language: language
      }, '*');
    } else {
      console.error('Cannot send language change: iframe or contentWindow not available');
    }
  };

  // Handle incoming messages from iframe
  handleMessage = (event: MessageEvent) => {
    // Handle language change requests from child (if needed)
    if (event.data.type === 'request-language-change') {
      console.log('📨 Language change request from child:', event.data.language);
      
      if (this.handlers.onLanguageChangeRequest) {
        this.handlers.onLanguageChangeRequest(event.data.language);
      }
    }

    // Handle language change response from child
    if (event.data.type === 'language-change-response') {
      console.log('✅ Language change response from child:', event.data);
      
      if (this.handlers.onLanguageChangeResponse) {
        this.handlers.onLanguageChangeResponse(event.data.success, event.data.language);
      }
    }
  };

  // Setup message listener
  setupMessageListener = () => {
    window.addEventListener('message', this.handleMessage);
    return () => window.removeEventListener('message', this.handleMessage);
  };

  // Update config (useful when state changes)
  updateConfig = (newConfig: Partial<I18nParentConfig>) => {
    this.config = { ...this.config, ...newConfig };
  };

  // Update handlers
  updateHandlers = (newHandlers: Partial<I18nParentHandlers>) => {
    this.handlers = { ...this.handlers, ...newHandlers };
  };
}

// Utility functions for easier usage

// Send language change (utility function)
export const sendLanguageChange = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  language: string
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'language-change',
      language: language
    }, '*');
  }
};

// Create a basic i18n parent message handler
export const createI18nParentHandler = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  selectedLanguage?: string
) => {
  const config: I18nParentConfig = {
    iframeRef,
    selectedLanguage
  };

  return new I18nParentHandler(config);
}; 