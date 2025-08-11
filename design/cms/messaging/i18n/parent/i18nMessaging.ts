import React from 'react';

// Type definitions for parent i18n messaging
export interface I18nParentConfig {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export class I18nParentHandler {
  private config: I18nParentConfig;

  constructor(config: I18nParentConfig) {
    this.config = config;
  }

  // Send language change update to iframe
  sendLanguageUpdate = (languageCode: string) => {
    if (this.config.iframeRef.current) {
      console.log('🌐 Sending language update to iframe:', languageCode);
      this.config.iframeRef.current.contentWindow?.postMessage({
        type: 'language-update',
        languageCode: languageCode
      }, '*');
    }
  };

  // Update config
  updateConfig = (newConfig: Partial<I18nParentConfig>) => {
    this.config = { ...this.config, ...newConfig };
  };
} 