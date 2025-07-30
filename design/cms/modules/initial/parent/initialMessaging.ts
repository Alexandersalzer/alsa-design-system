import React from 'react';

// Type definitions for parent initial messaging (editing status only)
export interface InitialMessageHandlerConfig {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export interface InitialMessageHandlers {
  onEditingStatusRequest?: (versionId?: number) => void;
}

export class InitialMessageHandler {
  private config: InitialMessageHandlerConfig;
  private handlers: InitialMessageHandlers;

  constructor(config: InitialMessageHandlerConfig, handlers: InitialMessageHandlers = {}) {
    this.config = config;
    this.handlers = handlers;
  }

  // Send editing status update to iframe
  sendEditingStatusUpdate = (editing: boolean) => {
    console.log('sendEditingStatusUpdate called with:', editing);
    console.log('iframeRef.current:', this.config.iframeRef.current);
    console.log('contentWindow:', this.config.iframeRef.current?.contentWindow);
    
    if (this.config.iframeRef.current?.contentWindow) {
      console.log('Sending editing-status-update message to iframe:', { type: 'editing-status-update', editing });
      this.config.iframeRef.current.contentWindow.postMessage({
        type: 'editing-status-update',
        editing: editing
      }, '*');
      console.log('Message sent successfully');
    } else {
      console.error('Cannot send message: iframe or contentWindow not available');
    }
  };

  // Handle incoming messages from iframe (editing status requests only)
  handleMessage = (event: MessageEvent) => {
    // Handle requests for editing status
    if (event.data.type === 'request-editing-status') {
      console.log('Editing status requested for version:', event.data.versionId);
      
      // Call custom handler if provided - this should fetch from database and call sendEditingStatusUpdate
      if (this.handlers.onEditingStatusRequest) {
        this.handlers.onEditingStatusRequest(event.data.versionId);
      } else {
        // Fallback: send false for security if no handler is provided
        console.warn('No editing status handler provided, defaulting to false for security');
        this.sendEditingStatusUpdate(false);
      }
    }
  };

  // Setup message listener
  setupMessageListener = () => {
    window.addEventListener('message', this.handleMessage);
    return () => window.removeEventListener('message', this.handleMessage);
  };

  // Update handlers
  updateHandlers = (newHandlers: Partial<InitialMessageHandlers>) => {
    this.handlers = { ...this.handlers, ...newHandlers };
  };
}

// Utility functions for editing status messaging

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

// Setup basic editing status message listener
export const setupEditingStatusMessageListener = (
  handlers: {
    onEditingStatusRequest?: (versionId?: number) => void;
  }
) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'request-editing-status' && handlers.onEditingStatusRequest) {
      handlers.onEditingStatusRequest(event.data.versionId);
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => window.removeEventListener('message', handleMessage);
}; 
