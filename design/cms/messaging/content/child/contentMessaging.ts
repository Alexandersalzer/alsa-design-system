import { type WebsiteContent } from '../../../wrappers/content/types/content';
import { extractLocaleFromPathname } from '../../../../system/utils/navigation';

export interface MessageHandlers {
  onContentUpdate: (content: WebsiteContent) => void;
  onWebsiteContentResponse: (content: WebsiteContent) => void;
}

/**
 * Request website content from parent
 * @param forceLocale - Optional: force specific locale (for backward compatibility)
 * By default, requests ALL languages for optimal performance
 */
export const requestWebsiteContent = (forceLocale?: string) => {
  // NEW: Default behavior is to request ALL languages (no locale parameter)
  // This triggers the new multi-language mode in the backend
  let requestLocale: string | undefined = forceLocale;
  
  if (!requestLocale) {
    // Don't send locale parameter = backend returns all languages
    console.log('📡 Requesting ALL LANGUAGES website content (multi-language mode)');
  } else {
    // Send specific locale = backward compatibility mode
    console.log('📡 Requesting website content for specific locale:', requestLocale);
  }
  
  const message: any = {
    type: 'request-website-content'
    // No versionId needed - parent knows its own context
  };
  
  // Only include locale if specifically requested (for backward compatibility)
  if (requestLocale) {
    message.locale = requestLocale;
  }
  
  window.parent.postMessage(message, '*');
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