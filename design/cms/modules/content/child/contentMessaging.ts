import { type WebsiteContent } from '../../../types/content';

export interface MessageHandlers {
  onContentUpdate: (content: WebsiteContent) => void;
  onWebsiteContentResponse: (content: WebsiteContent) => void;
}

export const requestWebsiteContent = () => {
  window.parent.postMessage({
    type: 'request-website-content'
    // No versionId needed - parent knows its own context
  }, '*');
};

export const setupMessageListener = (handlers: MessageHandlers) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'content-update') {
      handlers.onContentUpdate(event.data.content);
    }
    
    if (event.data.type === 'website-content-response') {
      handlers.onWebsiteContentResponse(event.data.content);
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
      const decodedContent = decodeURIComponent(contentParam);
      return JSON.parse(decodedContent);
    } catch (error) {
      return null;
    }
  }
  
  return null;
}; 