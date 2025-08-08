import React from 'react';

export interface I18nParentConfig {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  currentLocale?: string;
}

export interface I18nParentHandlers {
  onLocaleChangeRequest?: (locale: string) => void;
  onCustomMessage?: (event: MessageEvent) => void;
}

export class I18nParentHandler {
  private config: I18nParentConfig;
  private handlers: I18nParentHandlers;

  constructor(config: I18nParentConfig, handlers: I18nParentHandlers = {}) {
    this.config = config;
    this.handlers = handlers;
  }

  // Send locale change command to iframe
  sendLocaleChange = (locale: string) => {
    console.log('🌐 Parent sending locale change:', locale);
    
    if (this.config.iframeRef.current?.contentWindow) {
      this.config.iframeRef.current.contentWindow.postMessage({
        type: 'locale-change',
        locale: locale
      }, '*');
    } else {
      console.error('Cannot send locale change: iframe or contentWindow not available');
    }
  };

  // Send current locale to iframe (for synchronization)
  sendCurrentLocale = (locale: string) => {
    console.log('🌐 Parent sending current locale:', locale);
    
    if (this.config.iframeRef.current?.contentWindow) {
      this.config.iframeRef.current.contentWindow.postMessage({
        type: 'locale-sync',
        locale: locale
      }, '*');
    } else {
      console.error('Cannot send locale sync: iframe or contentWindow not available');
    }
  };

  // Handle incoming messages from iframe
  handleMessage = (event: MessageEvent) => {
    // Handle requests for current locale
    if (event.data.type === 'request-current-locale') {
      console.log('🌐 Parent received locale request');
      
      // Call custom handler if provided
      if (this.handlers.onLocaleChangeRequest) {
        this.handlers.onLocaleChangeRequest(event.data.locale);
      }
      
      // Send current locale if available
      if (this.config.currentLocale) {
        this.sendCurrentLocale(this.config.currentLocale);
      }
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

  // Update config (useful when locale changes)
  updateConfig = (newConfig: Partial<I18nParentConfig>) => {
    this.config = { ...this.config, ...newConfig };
  };

  // Update handlers
  updateHandlers = (newHandlers: Partial<I18nParentHandlers>) => {
    this.handlers = { ...this.handlers, ...newHandlers };
  };
}

// Utility functions for easier usage

// Send locale change to iframe (utility function)
export const sendLocaleChange = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  locale: string
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'locale-change',
      locale: locale
    }, '*');
  }
};

// Send current locale sync to iframe (utility function)
export const sendCurrentLocale = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  locale: string
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'locale-sync',
      locale: locale
    }, '*');
  }
};

// Setup basic message listener for locale requests only
export const setupBasicI18nParentMessageListener = (
  handlers: {
    onLocaleChangeRequest?: (locale: string) => void;
    onMessage?: (event: MessageEvent) => void;
  }
) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'request-current-locale' && handlers.onLocaleChangeRequest) {
      handlers.onLocaleChangeRequest(event.data.locale);
    }

    if (handlers.onMessage) {
      handlers.onMessage(event);
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => window.removeEventListener('message', handleMessage);
}; 