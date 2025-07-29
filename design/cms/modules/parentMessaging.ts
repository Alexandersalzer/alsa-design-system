import React from 'react';

// Type definitions for the full parent message handler
export interface ParentMessageHandlerConfig {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  websiteContent?: any;
  accentColor?: string;
  version?: any;
  token?: string | null;
  updateEditingStatus?: (versionId: string, editing: boolean) => Promise<void>;
  availableFonts?: Array<{id: number, name: string, url: string}>;
}

export interface ParentMessageHandlers {
  onWebsiteContentRequest?: (versionId?: number) => void;
  onEditingStatusRequest?: (versionId?: number) => void;
  onCustomMessage?: (event: MessageEvent) => void;
}

export class ParentMessageHandler {
  private config: ParentMessageHandlerConfig;
  private handlers: ParentMessageHandlers;

  constructor(config: ParentMessageHandlerConfig, handlers: ParentMessageHandlers = {}) {
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

  // Send CSS update to iframe for real-time preview
  sendCssUpdate = (css: string) => {
    if (this.config.iframeRef.current) {
      this.config.iframeRef.current.contentWindow?.postMessage({
        type: 'css-update',
        css: css
      }, '*');
    }
  };

  // Send accent color update to iframe for real-time preview
  sendAccentColorUpdate = (color: string) => {
    if (this.config.iframeRef.current) {
      this.config.iframeRef.current.contentWindow?.postMessage({
        type: 'accent-color-update',
        color: color
      }, '*');
    }
  };

  // Send radius update to iframe for real-time preview
  sendRadiusUpdate = (size: string) => {
    if (this.config.iframeRef.current) {
      this.config.iframeRef.current.contentWindow?.postMessage({
        type: 'radius-update',
        size: size
      }, '*');
    }
  };

  // Send theme update to iframe for real-time preview
  sendThemeUpdate = (isDark: boolean) => {
    if (this.config.iframeRef.current) {
      this.config.iframeRef.current.contentWindow?.postMessage({
        type: 'theme-update',
        isDark: isDark
      }, '*');
    }
  };

  // Send font update to iframe with both family and URL
  sendFontUpdate = (fontFamily: string) => {
    // Find the selected font from available fonts to get the URL
    const selectedFont = this.config.availableFonts?.find(font => 
      fontFamily.includes(font.name) || font.name.toLowerCase() === fontFamily.toLowerCase()
    );
    
    if (selectedFont) {
      if (this.config.iframeRef.current) {
        this.config.iframeRef.current.contentWindow?.postMessage({
          type: 'font-update',
          fontFamily: `${selectedFont.name}, sans-serif`,
          fontUrl: selectedFont.url
        }, '*');
      }
    } else {
      console.warn('Font not found in available fonts:', fontFamily);
    }
  };

  // Send text alignment update to iframe for real-time preview
  sendTextAlignUpdate = (css: string) => {
    if (this.config.iframeRef.current) {
      this.config.iframeRef.current.contentWindow?.postMessage({
        type: 'text-align-update',
        css: css
      }, '*');
    }
  };

  // Send editing status update to iframe
  sendEditingStatusUpdate = (editing: boolean) => {
    if (this.config.iframeRef.current?.contentWindow) {
      this.config.iframeRef.current.contentWindow.postMessage({
        type: 'editing-status-update',
        editing: editing
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
    
    // Handle requests for editing status
    if (event.data.type === 'request-editing-status') {
      console.log('Editing status requested');
      
      // Call custom handler if provided
      if (this.handlers.onEditingStatusRequest) {
        this.handlers.onEditingStatusRequest(event.data.versionId);
      }
      
      // Send default response (always true in editor context)
      if (this.config.iframeRef.current?.contentWindow) {
        this.config.iframeRef.current.contentWindow.postMessage({
          type: 'editing-status-update',
          editing: true
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
  content: any
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'website-content-response',
      content: content
    }, '*');
  }
};

// Send editing status update (utility function)
export const sendEditingStatusUpdate = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  editing: boolean
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'editing-status-update',
      editing: editing
    }, '*');
  }
};

// Setup basic message listener for common use cases
export const setupBasicParentMessageListener = (
  handlers: {
    onWebsiteContentRequest?: (versionId?: number) => void;
    onEditingStatusRequest?: (versionId?: number) => void;
    onMessage?: (event: MessageEvent) => void;
  }
) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'request-website-content' && handlers.onWebsiteContentRequest) {
      handlers.onWebsiteContentRequest(event.data.versionId);
    }
    
    if (event.data.type === 'request-editing-status' && handlers.onEditingStatusRequest) {
      handlers.onEditingStatusRequest(event.data.versionId);
    }

    if (handlers.onMessage) {
      handlers.onMessage(event);
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => window.removeEventListener('message', handleMessage);
}; 