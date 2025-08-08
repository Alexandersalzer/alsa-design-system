import React from 'react';

// Configuration interface for I18n Parent Handler
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

// Optional handlers interface for custom behavior
export interface I18nParentHandlers {
  onLanguageChangeRequest?: (languageCode: string) => void;
  onLanguageChangeResponse?: (success: boolean, languageCode: string) => void;
  onCustomMessage?: (event: MessageEvent) => void;
}

export class I18nParentHandler {
  private config: I18nParentConfig;
  private handlers: I18nParentHandlers;

  constructor(config: I18nParentConfig, handlers: I18nParentHandlers = {}) {
    this.config = config;
    this.handlers = handlers;
  }

  // Send language change request to iframe
  sendLanguageChange = (languageCode: string) => {
    console.log('🌍 Sending language change:', languageCode);
    
    if (this.config.iframeRef.current?.contentWindow) {
      console.log('🌍 Iframe found, sending postMessage to contentWindow');
      this.config.iframeRef.current.contentWindow.postMessage({
        type: 'language-change-request',
        languageCode
      }, '*');
      console.log('🌍 PostMessage sent successfully');
    } else {
      console.error('🌍 No iframe contentWindow found');
      console.log('🌍 iframeRef.current:', this.config.iframeRef.current);
    }

    // Call custom handler if provided
    if (this.handlers.onLanguageChangeRequest) {
      this.handlers.onLanguageChangeRequest(languageCode);
    }
  };

  // Send available languages to iframe
  sendAvailableLanguages = () => {
    if (this.config.iframeRef.current?.contentWindow && this.config.availableLanguages) {
      this.config.iframeRef.current.contentWindow.postMessage({
        type: 'available-languages',
        languages: this.config.availableLanguages
      }, '*');
    }
  };

  // Handle incoming messages from iframe
  handleMessage = (event: MessageEvent) => {
    // Handle language change response
    if (event.data.type === 'language-change-response') {
      console.log('🌍 Language change response:', event.data);
      
      if (this.handlers.onLanguageChangeResponse) {
        this.handlers.onLanguageChangeResponse(
          event.data.success,
          event.data.languageCode
        );
      }
    }

    // Handle request for available languages
    if (event.data.type === 'request-available-languages') {
      console.log('🌍 Available languages requested');
      this.sendAvailableLanguages();
    }

    // Handle custom messages through handler
    if (this.handlers.onCustomMessage) {
      this.handlers.onCustomMessage(event);
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

// Utility function to create a basic I18n parent handler
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
  const config: I18nParentConfig = {
    iframeRef,
    availableLanguages
  };

  return new I18nParentHandler(config);
};

// Utility function to send language change directly
export const sendLanguageChange = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  languageCode: string
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'language-change-request',
      languageCode
    }, '*');
  }
}; 