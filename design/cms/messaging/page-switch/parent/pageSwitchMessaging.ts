import React from 'react';

// Type definitions for parent page switch messaging
export interface PageSwitchParentConfig {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export interface PageSwitchParentHandlers {
  onCurrentPageInfo?: (pageSlug: string, locale: string) => void;
}

export class PageSwitchParentHandler {
  private config: PageSwitchParentConfig;
  private handlers: PageSwitchParentHandlers;

  constructor(config: PageSwitchParentConfig, handlers: PageSwitchParentHandlers = {}) {
    this.config = config;
    this.handlers = handlers;
  }

  // Send page switch update to iframe
  sendPageSwitchUpdate = (pageSlug: string, locale: string) => {
    if (this.config.iframeRef.current?.contentWindow) {
      this.config.iframeRef.current.contentWindow.postMessage({
        type: 'page-switch-update',
        pageSlug,
        locale
      }, '*');
    } else {
      console.error('Cannot send page switch update: iframe or contentWindow not available');
    }
  };

  // Handle incoming messages from iframe (page switch info)
  handleMessage = (event: MessageEvent) => {
    // Handle current page info from child
    if (event.data.type === 'current-page-info') {
      console.log('Received current page info:', event.data.pageSlug, event.data.locale);
      
      // Call custom handler if provided
      if (this.handlers.onCurrentPageInfo) {
        this.handlers.onCurrentPageInfo(event.data.pageSlug, event.data.locale);
      }
    }
  };

  // Setup message listener
  setupMessageListener = () => {
    window.addEventListener('message', this.handleMessage);
    return () => window.removeEventListener('message', this.handleMessage);
  };

  // Update handlers
  updateHandlers = (newHandlers: Partial<PageSwitchParentHandlers>) => {
    this.handlers = { ...this.handlers, ...newHandlers };
  };

  // Update config
  updateConfig = (newConfig: Partial<PageSwitchParentConfig>) => {
    this.config = { ...this.config, ...newConfig };
  };
}

// Utility functions for page switch messaging

// Send page switch update (utility function)
export const sendPageSwitchUpdate = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  pageSlug: string,
  locale: string
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'page-switch-update',
      pageSlug,
      locale
    }, '*');
  }
};

// Setup basic page switch message listener
export const setupPageSwitchMessageListener = (
  handlers: {
    onCurrentPageInfo?: (pageSlug: string, locale: string) => void;
  }
) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'current-page-info' && handlers.onCurrentPageInfo) {
      handlers.onCurrentPageInfo(event.data.pageSlug, event.data.locale);
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => window.removeEventListener('message', handleMessage);
}; 