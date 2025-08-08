export interface CentralMessageHandlers {
  // Editing status handlers
  onEditingStatusUpdate?: (editing: boolean) => void;
  
  // Content handlers
  onContentUpdate?: (content: any) => void;
  onWebsiteContentResponse?: (content: any) => void;
  
  // I18n handlers
  onLocaleChange?: (locale: string) => void;
  onLocaleSync?: (locale: string) => void;
  
  // Design token handlers
  onAccentColorUpdate?: (color: string) => void;
  onRadiusUpdate?: (size: string) => void;
  onThemeUpdate?: (isDark: boolean) => void;
  onFontUpdate?: (fontFamily: string) => void;
  
  // Generic handler for unhandled messages
  onUnhandledMessage?: (event: MessageEvent) => void;
}

export class CentralMessageDispatcher {
  private handlers: CentralMessageHandlers;
  private cleanup?: () => void;

  constructor(handlers: CentralMessageHandlers = {}) {
    this.handlers = handlers;
  }

  // Main message handler that dispatches to appropriate handlers
  private handleMessage = (event: MessageEvent) => {
    console.log('🌐 CentralMessageDispatcher received:', event.data);
    
    const { type, data } = event.data;
    
    switch (type) {
      // Editing status messages
      case 'editing-status-update':
        this.handlers.onEditingStatusUpdate?.(event.data.editing);
        break;
        
      // Content messages
      case 'content-update':
        this.handlers.onContentUpdate?.(event.data.content);
        break;
        
      case 'website-content-response':
        this.handlers.onWebsiteContentResponse?.(event.data.content);
        break;
        
      // I18n messages
      case 'locale-change':
        console.log('🌐 Dispatching locale change:', event.data.locale);
        this.handlers.onLocaleChange?.(event.data.locale);
        break;
        
      case 'locale-sync':
        console.log('🌐 Dispatching locale sync:', event.data.locale);
        this.handlers.onLocaleSync?.(event.data.locale);
        break;
        
      // Design token messages
      case 'accent-color-update':
        this.handlers.onAccentColorUpdate?.(event.data.color);
        break;
        
      case 'radius-update':
        this.handlers.onRadiusUpdate?.(event.data.size);
        break;
        
      case 'theme-update':
        this.handlers.onThemeUpdate?.(event.data.isDark);
        break;
        
      case 'font-update':
        this.handlers.onFontUpdate?.(event.data.fontFamily);
        break;
        
      default:
        // Handle unrecognized messages
        console.log('🌐 Unhandled message type:', type);
        this.handlers.onUnhandledMessage?.(event);
        break;
    }
  };

  // Setup the single message listener
  setupMessageListener = () => {
    console.log('🌐 CentralMessageDispatcher setting up listener');
    window.addEventListener('message', this.handleMessage);
    
    this.cleanup = () => {
      console.log('🌐 CentralMessageDispatcher cleaning up listener');
      window.removeEventListener('message', this.handleMessage);
    };
    
    return this.cleanup;
  };

  // Update handlers
  updateHandlers = (newHandlers: Partial<CentralMessageHandlers>) => {
    this.handlers = { ...this.handlers, ...newHandlers };
  };

  // Cleanup method
  destroy = () => {
    if (this.cleanup) {
      this.cleanup();
    }
  };
}

// Utility function to create and setup central dispatcher
export const setupCentralMessageDispatcher = (handlers: CentralMessageHandlers) => {
  const dispatcher = new CentralMessageDispatcher(handlers);
  const cleanup = dispatcher.setupMessageListener();
  
  return {
    dispatcher,
    cleanup,
    updateHandlers: dispatcher.updateHandlers
  };
}; 