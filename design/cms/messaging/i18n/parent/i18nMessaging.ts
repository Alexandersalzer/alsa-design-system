import React from 'react';

// Type definitions for parent i18n messaging
export interface I18nParentConfig {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  getCurrentLanguage?: () => string; // Function to get current language
}

export interface I18nParentHandlers {
  onCurrentLanguageRequest?: () => string; // Handler for current language requests
}

export class I18nParentHandler {
  private config: I18nParentConfig;
  private handlers: I18nParentHandlers;

  constructor(config: I18nParentConfig, handlers: I18nParentHandlers = {}) {
    this.config = config;
    this.handlers = handlers;
    console.log('🌐 I18nParentHandler created with config:', config);
  }

  // Send language change update to iframe
  sendLanguageUpdate = (languageCode: string) => {
    console.log('🌐 [PARENT] sendLanguageUpdate called with:', languageCode);
    console.log('🌐 [PARENT] iframeRef.current exists:', !!this.config.iframeRef.current);
    console.log('🌐 [PARENT] contentWindow exists:', !!this.config.iframeRef.current?.contentWindow);
    console.log('🌐 [PARENT] iframe src:', this.config.iframeRef.current?.src);
    // Note: Cannot access contentDocument.readyState due to CORS restrictions
    
    if (this.config.iframeRef.current) {
      const message = {
        type: 'language-update',
        languageCode: languageCode
      };
      
      console.log('🌐 [PARENT] Sending postMessage:', message);
      console.log('🌐 [PARENT] Target origin: *');
      // Note: Cannot access contentWindow.location.href due to CORS restrictions
      
      try {
        this.config.iframeRef.current.contentWindow?.postMessage(message, '*');
        console.log('🌐 [PARENT] postMessage sent successfully');
        
        // Test: Send a simple test message too
        setTimeout(() => {
          console.log('🌐 [PARENT] Sending test message...');
          this.config.iframeRef.current?.contentWindow?.postMessage({
            type: 'test-message',
            data: 'Hello from parent!'
          }, '*');
        }, 100);
        
      } catch (error) {
        console.error('🌐 [PARENT] Error sending postMessage:', error);
      }
    } else {
      console.warn('🌐 [PARENT] iframeRef.current is null, cannot send message');
    }
  };

  // Send current language response to iframe
  sendCurrentLanguageResponse = (languageCode: string) => {
    console.log('🌐 [PARENT] sendCurrentLanguageResponse called with:', languageCode);
    
    if (this.config.iframeRef.current?.contentWindow) {
      const message = {
        type: 'current-language-response',
        languageCode: languageCode
      };
      
      console.log('🌐 [PARENT] Sending current language response:', message);
      
      try {
        this.config.iframeRef.current.contentWindow.postMessage(message, '*');
        console.log('🌐 [PARENT] Current language response sent successfully');
      } catch (error) {
        console.error('🌐 [PARENT] Error sending current language response:', error);
      }
    }
  };

  // Handle incoming messages from iframe
  handleMessage = (event: MessageEvent) => {
    console.log('🌐 [PARENT] Received message from child:', event.data);
    
    if (event.data.type === 'request-current-language') {
      console.log('🌐 [PARENT] Processing current language request');
      
      // Call custom handler if provided
      if (this.handlers.onCurrentLanguageRequest) {
        const currentLanguage = this.handlers.onCurrentLanguageRequest();
        console.log('🌐 [PARENT] Got current language from handler:', currentLanguage);
        this.sendCurrentLanguageResponse(currentLanguage);
      } else if (this.config.getCurrentLanguage) {
        const currentLanguage = this.config.getCurrentLanguage();
        console.log('🌐 [PARENT] Got current language from config:', currentLanguage);
        this.sendCurrentLanguageResponse(currentLanguage);
      } else {
        console.warn('🌐 [PARENT] No current language handler or config provided');
        // Fallback to default
        this.sendCurrentLanguageResponse('sv');
      }
    }
  };

  // Setup message listener
  setupMessageListener = () => {
    console.log('🌐 [PARENT] Setting up message listener');
    window.addEventListener('message', this.handleMessage);
    return () => {
      console.log('🌐 [PARENT] Removing message listener');
      window.removeEventListener('message', this.handleMessage);
    };
  };

  // Update config
  updateConfig = (newConfig: Partial<I18nParentConfig>) => {
    console.log('🌐 [PARENT] updateConfig called with:', newConfig);
    this.config = { ...this.config, ...newConfig };
  };

  // Update handlers
  updateHandlers = (newHandlers: Partial<I18nParentHandlers>) => {
    console.log('🌐 [PARENT] updateHandlers called with:', newHandlers);
    this.handlers = { ...this.handlers, ...newHandlers };
  };
}

// Utility functions for i18n messaging

// Send language update (utility function)
export const sendLanguageUpdate = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  languageCode: string
) => {
  console.log('🌐 [PARENT UTILITY] sendLanguageUpdate called with:', languageCode);
  console.log('🌐 [PARENT UTILITY] iframeRef.current exists:', !!iframeRef.current);
  console.log('🌐 [PARENT UTILITY] contentWindow exists:', !!iframeRef.current?.contentWindow);
  
  if (iframeRef.current?.contentWindow) {
    const message = {
      type: 'language-update',
      languageCode: languageCode
    };
    
    console.log('🌐 [PARENT UTILITY] Sending postMessage:', message);
    
    try {
      iframeRef.current.contentWindow.postMessage(message, '*');
      console.log('🌐 [PARENT UTILITY] postMessage sent successfully');
    } catch (error) {
      console.error('🌐 [PARENT UTILITY] Error sending postMessage:', error);
    }
  } else {
    console.warn('🌐 [PARENT UTILITY] iframeRef.current or contentWindow is null');
  }
}; 