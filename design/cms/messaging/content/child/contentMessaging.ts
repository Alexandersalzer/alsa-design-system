import { type WebsiteContent } from '../../../wrappers/content/types/content';
import { extractLocaleFromPathname } from '../../../../system/utils/navigation';

export interface MessageHandlers {
  onContentUpdate: (content: WebsiteContent, locale?: string) => void;
  onWebsiteContentResponse: (content: WebsiteContent, locale?: string) => void;
}

export const requestWebsiteContent = () => {
  // Extract locale from current pathname to request content for the correct language
  const currentLocale = typeof window !== 'undefined' ? extractLocaleFromPathname(window.location.pathname) : 'sv';
  
  console.log('📡 Requesting website content for locale:', currentLocale);
  
  window.parent.postMessage({
    type: 'request-website-content',
    locale: currentLocale // Include locale in the request
    // No versionId needed - parent knows its own context
  }, '*');
};

export const setupMessageListener = (handlers: MessageHandlers) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'content-update') {
      handlers.onContentUpdate(event.data.content, event.data.locale);
    }
    
    if (event.data.type === 'website-content-response') {
      handlers.onWebsiteContentResponse(event.data.content, event.data.locale);
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