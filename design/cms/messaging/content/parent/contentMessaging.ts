import React from 'react';

// Type definitions for the parent content message handler (content and website messaging only)
export interface ParentMessageHandlerConfig {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  websiteContent?: any;
  version?: any;
  token?: string | null;
  versionId?: string; // Parent can optionally provide versionId context
}

export interface ParentMessageHandlers {
  onWebsiteContentRequest?: (locale?: string) => void; // Add locale parameter
  onCustomMessage?: (event: MessageEvent) => void;
}

export class ParentMessageHandler {
  private config: ParentMessageHandlerConfig;
  private handlers: ParentMessageHandlers;

  constructor(config: ParentMessageHandlerConfig, handlers: ParentMessageHandlers = {}) {
    this.config = config;
    this.handlers = handlers;
  }

  // Send content update to iframe with locale metadata
  updateIframeContent = (newContent: any, locale?: string) => {
    if (this.config.iframeRef.current?.contentWindow) {
      this.config.iframeRef.current.contentWindow.postMessage({
        type: 'content-update',
        content: newContent,
        locale: locale // Include locale metadata
      }, '*');
    }
  };

  // Handle incoming messages from iframe
  handleMessage = (event: MessageEvent) => {
    const { websiteContent } = this.config;

    // Handle requests for website content
    if (event.data.type === 'request-website-content') {
      const requestedLocale = event.data.locale || 'sv'; // Extract locale from request
      console.log('🌐 Parent received website content request for locale:', requestedLocale);
      
      // Call custom handler if provided - handler uses parent's versionId context and locale
      if (this.handlers.onWebsiteContentRequest) {
        this.handlers.onWebsiteContentRequest(requestedLocale);
      }
      
      // Send default response if websiteContent is available
      if (websiteContent && this.config.iframeRef.current?.contentWindow) {
        this.config.iframeRef.current.contentWindow.postMessage({
          type: 'website-content-response',
          content: websiteContent,
          locale: requestedLocale // Include locale metadata in response
        }, '*');
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

  // Update config (useful when state changes)
  updateConfig = (newConfig: Partial<ParentMessageHandlerConfig>) => {
    this.config = { ...this.config, ...newConfig };
  };

  // Update handlers
  updateHandlers = (newHandlers: Partial<ParentMessageHandlers>) => {
    this.handlers = { ...this.handlers, ...newHandlers };
  };
}

// Utility functions for easier usage

// Create a basic parent message handler
export const createParentMessageHandler = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  config: Omit<ParentMessageHandlerConfig, 'iframeRef'> = {},
  handlers: ParentMessageHandlers = {}
) => {
  return new ParentMessageHandler({ iframeRef, ...config }, handlers);
};

// Send website content response (utility function)
export const sendWebsiteContentResponse = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  content: any,
  locale?: string
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'website-content-response',
      content: content,
      locale: locale // Include locale metadata
    }, '*');
  }
};

// Setup basic message listener for content requests only
export const setupBasicParentMessageListener = (
  handlers: {
    onWebsiteContentRequest?: (locale?: string) => void; // Add locale parameter
    onMessage?: (event: MessageEvent) => void;
  }
) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'request-website-content' && handlers.onWebsiteContentRequest) {
      const requestedLocale = event.data.locale || 'sv';
      handlers.onWebsiteContentRequest(requestedLocale);
    }

    if (handlers.onMessage) {
      handlers.onMessage(event);
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => window.removeEventListener('message', handleMessage);
}; 