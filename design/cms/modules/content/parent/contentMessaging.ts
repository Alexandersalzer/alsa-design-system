import React from 'react';

// Type definitions for parent content messaging
export interface ContentParentConfig {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  websiteContent?: any;
}

export interface ContentParentHandlers {
  onWebsiteContentRequest?: (versionId?: number) => void;
}

export class ContentParentHandler {
  private config: ContentParentConfig;
  private handlers: ContentParentHandlers;

  constructor(config: ContentParentConfig, handlers: ContentParentHandlers = {}) {
    this.config = config;
    this.handlers = handlers;
  }

  // Send content update to iframe
  updateIframeContent = (newContent: any) => {
    if (this.config.iframeRef.current?.contentWindow) {
      this.config.iframeRef.current.contentWindow.postMessage({
        type: 'content-update',
        content: newContent
      }, '*');
    }
  };

  // Handle incoming messages from iframe
  handleMessage = (event: MessageEvent) => {
    const { websiteContent } = this.config;

    // Handle requests for website content
    if (event.data.type === 'request-website-content') {
      console.log('Received request for website content:', event.data.versionId);
      
      // Call custom handler if provided
      if (this.handlers.onWebsiteContentRequest) {
        this.handlers.onWebsiteContentRequest(event.data.versionId);
      }
      
      // Send default response if websiteContent is available
      if (websiteContent && this.config.iframeRef.current?.contentWindow) {
        this.config.iframeRef.current.contentWindow.postMessage({
          type: 'website-content-response',
          content: websiteContent
        }, '*');
      }
    }
  };

  // Setup message listener
  setupMessageListener = () => {
    window.addEventListener('message', this.handleMessage);
    return () => window.removeEventListener('message', this.handleMessage);
  };

  // Update config
  updateConfig = (newConfig: Partial<ContentParentConfig>) => {
    this.config = { ...this.config, ...newConfig };
  };

  // Update handlers
  updateHandlers = (newHandlers: Partial<ContentParentHandlers>) => {
    this.handlers = { ...this.handlers, ...newHandlers };
  };
}

// Utility functions for content messaging

// Send website content response (utility function)
export const sendWebsiteContentResponse = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  content: any
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'website-content-response',
      content: content
    }, '*');
  }
};

// Send content update (utility function)
export const sendContentUpdate = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  content: any
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'content-update',
      content: content
    }, '*');
  }
};

// Setup content message listener
export const setupContentMessageListener = (
  handlers: {
    onWebsiteContentRequest?: (versionId?: number) => void;
  }
) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'request-website-content' && handlers.onWebsiteContentRequest) {
      handlers.onWebsiteContentRequest(event.data.versionId);
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => window.removeEventListener('message', handleMessage);
}; 