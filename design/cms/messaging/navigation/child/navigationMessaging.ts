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
    
    console.log('🔍 Debug navigation extraction:', {
      originalHref: href,
      originalSlug: slug,
      locale: locale,
      pathSegments: pathSegments
    });
    
    // Remove locale from segments to get page slug
    if (pathSegments[0] === locale) {
      pathSegments.shift();
    }
    
    console.log('🔍 After locale removal:', {
      pathSegments: pathSegments,
      firstSegment: pathSegments[0]
    });
    
    // Get page slug from segments or use provided slug
    // If extracting from href, remove /index.html suffix and get the actual page slug
    let extractedSlug = pathSegments[0] || 'home';
    if (extractedSlug === 'index.html' && pathSegments.length > 1) {
      // If first segment is index.html, there might be an issue with parsing
      // Let's try to get a better slug from the path structure
      extractedSlug = 'home'; // Default fallback
    } else if (extractedSlug && extractedSlug.endsWith('.html')) {
      // Remove .html extension if present
      extractedSlug = extractedSlug.replace('.html', '');
    }
    
    const pageSlug = slug || extractedSlug;
    
    console.log('🔍 Final slug decision:', {
      providedSlug: slug,
      extractedSlug: pathSegments[0],
      finalPageSlug: pageSlug
    });
    
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