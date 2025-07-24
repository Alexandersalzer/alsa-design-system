import { type WebsiteContent } from '@/design/cms-modules/types/content';
import { handleDimensionRequest } from '@/design/cms-modules/messaging/dimensionMessaging';
import { handleDesignTokenMessage, type DesignTokenMessageHandlers } from '@/design/cms-modules/messaging/designTokenMessaging';

export interface MessageHandlers {
  onContentUpdate: (content: WebsiteContent) => void;
  onWebsiteContentResponse: (content: WebsiteContent) => void;
}

export const requestWebsiteContent = (versionId: number) => {
  window.parent.postMessage({
    type: 'request-website-content',
    versionId: versionId
  }, '*');
};

export const setupMessageListener = (handlers: MessageHandlers, designTokenHandlers?: DesignTokenMessageHandlers) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'content-update') {
      handlers.onContentUpdate(event.data.content);
    }
    
    if (event.data.type === 'website-content-response') {
      handlers.onWebsiteContentResponse(event.data.content);
    }
    
    // Handle dimension requests from parent using the utility
    handleDimensionRequest('hero-container', 'hero-section')(event);
    
    // Handle design token messages if handlers are provided
    if (designTokenHandlers) {
      handleDesignTokenMessage(event, designTokenHandlers);
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => window.removeEventListener('message', handleMessage);
};

export const parseContentFromUrl = (): WebsiteContent | null => {
  const searchParams = new URLSearchParams(window.location.search);
  const contentParam = searchParams.get('content');
  
  if (contentParam) {
    try {
      return JSON.parse(decodeURIComponent(contentParam));
    } catch (error) {
      console.error('Error parsing content from URL:', error);
      return null;
    }
  }
  
  return null;
};

export const getVersionFromUrl = (): number | null => {
  const searchParams = new URLSearchParams(window.location.search);
  const versionParam = searchParams.get('version');
  
  return versionParam ? parseInt(versionParam, 10) : null;
}; 