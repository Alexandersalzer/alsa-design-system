import React from 'react';

// Type definitions for parent i18n messaging
export interface I18nParentConfig {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export class I18nParentHandler {
  private config: I18nParentConfig;

  constructor(config: I18nParentConfig) {
    this.config = config;
    console.log('🌐 I18nParentHandler created with config:', config);
  }

  // Send language change update to iframe
  sendLanguageUpdate = (languageCode: string) => {
    console.log('🌐 [PARENT] sendLanguageUpdate called with:', languageCode);
    console.log('🌐 [PARENT] iframeRef.current:', this.config.iframeRef.current);
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

  // Update config
  updateConfig = (newConfig: Partial<I18nParentConfig>) => {
    console.log('🌐 [PARENT] updateConfig called with:', newConfig);
    this.config = { ...this.config, ...newConfig };
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