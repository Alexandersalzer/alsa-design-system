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
    if (this.config.iframeRef.current?.contentWindow) {
      this.config.iframeRef.current.contentWindow.postMessage({
        type: 'editing-status-update',
        editing: editing
      }, '*');
    }
  };

  // Handle incoming messages from iframe (editing status requests only)
  handleMessage = (event: MessageEvent) => {
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