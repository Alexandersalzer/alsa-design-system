import { type WebsiteContent } from '../../../wrappers/content/types/content';
import { extractLocaleFromPathname } from '../../../../system/utils/navigation';

export interface MessageHandlers {
  onContentUpdate: (content: WebsiteContent) => void;
  onWebsiteContentResponse: (content: WebsiteContent) => void;
}

export const requestWebsiteContent = () => {
  console.log('📡 Requesting ALL LANGUAGES website content (no locale filter)');
  
  window.parent.postMessage({
    type: 'request-website-content'
    // NO locale parameter - this triggers multi-language fetch in backend
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