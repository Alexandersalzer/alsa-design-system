import React from 'react';
import { extractLocaleFromPathname } from '../../../../system/utils/navigation';

export interface NavigationMessageHandlers {
  onNavigationUpdate: (href: string) => void;
}

interface NavigationMessageHandlerParams {
  onNavigationChange?: (href: string) => void;
  isEditingMode?: boolean;
}

export const createNavigationMessageHandlers = (params: NavigationMessageHandlerParams): NavigationMessageHandlers => {
  const { onNavigationChange, isEditingMode = false } = params;

  return {
    onNavigationUpdate: (href: string) => {
      console.log('🧭 Received navigation update in child:', href, 'isEditingMode:', isEditingMode);
      
      // Call custom callback if provided
      if (onNavigationChange) {
        onNavigationChange(href);
      }
    }
  };
};

// Function to send navigation change from child to parent
export const sendNavigationUpdateToParent = (href: string, slug?: string) => {
  if (typeof window !== 'undefined' && window.parent) {
    console.log('🧭 Sending navigation update from child to parent:', { href, slug });
    
    // Extract locale and page info from href
    const locale = extractLocaleFromPathname(href);
    const pathSegments = href.split('/').filter(Boolean);
    
    // Remove locale from segments to get page slug
    if (pathSegments[0] === locale) {
      pathSegments.shift();
    }
    
    // Get page slug from segments or use provided slug
    const pageSlug = slug || pathSegments[0] || 'home';
    
    window.parent.postMessage({
      type: 'child-navigation-update',
      href: href,
      slug: pageSlug,
      locale: locale
    }, '*');
  }
};

// Hook for setting up navigation message listener
export const useNavigationMessageListener = (handlers: NavigationMessageHandlers) => {
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, href } = event.data;
      
      switch (type) {
        case 'navigation-update':
          if (href) {
            handlers.onNavigationUpdate(href);
          }
          break;
        default:
          // Ignore other message types
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handlers]);
}; 