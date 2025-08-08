import React from 'react';

// Type definitions for parent navigation messaging
export interface NavigationParentConfig {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export class NavigationParentHandler {
  private config: NavigationParentConfig;

  constructor(config: NavigationParentConfig) {
    this.config = config;
  }

  // Send navigation update to iframe (if needed in the future)
  sendNavigationUpdate = (href: string) => {
    if (this.config.iframeRef.current) {
      console.log('🧭 Sending navigation update to iframe:', href);
      this.config.iframeRef.current.contentWindow?.postMessage({
        type: 'navigation-update',
        href: href
      }, '*');
    }
  };

  // Update config
  updateConfig = (newConfig: Partial<NavigationParentConfig>) => {
    this.config = { ...this.config, ...newConfig };
  };
} 