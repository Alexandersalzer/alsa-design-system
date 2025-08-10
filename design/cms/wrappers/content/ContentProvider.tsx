'use client';

import { createContext, useState, useEffect, useMemo } from 'react';
import { type WebsiteContent, type LanguageContent } from './types/content';
import {
  requestWebsiteContent,
  setupMessageListener,
  type MessageHandlers
} from '../../messaging/content/child/contentMessaging';
import { useEditingMode } from '../editing/EditingWrapper';
import { ContentContextType, ContentProviderProps } from './types/context';
import { useContentQueries } from './hooks/useContentQueries';
import { useContentBlocks } from './hooks/useContentBlocks';

// Create the context
export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children, initialContent = null }: ContentProviderProps) {
  const { isEditingMode } = useEditingMode();
  const [dynamicContent, setDynamicContent] = useState<WebsiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract current locale from pathname
  const currentLocale = useMemo(() => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const potentialLocale = pathSegments[0];
      if (potentialLocale === 'sv' || potentialLocale === 'en') {
        return potentialLocale;
      }
    }
    return 'sv'; // Default fallback
  }, []);

  // Convert initialContent to WebsiteContent format if it's LanguageContent
  const normalizedInitialContent = useMemo((): WebsiteContent | null => {
    if (!initialContent) return null;
    
    // Type guard: check if it's WebsiteContent (has languages property)
    const isWebsiteContent = (content: any): content is WebsiteContent => {
      return content && typeof content === 'object' && 'languages' in content;
    };
    
    // If it's already WebsiteContent, return as is
    if (isWebsiteContent(initialContent)) {
      return initialContent;
    }
    
    // Otherwise, treat it as LanguageContent and wrap it
    const languageContent = initialContent as LanguageContent;
    return {
      languages: {
        [currentLocale]: languageContent
      },
      meta: languageContent.meta
    };
  }, [initialContent, currentLocale]);

  useEffect(() => {
    if (isEditingMode) {
      console.log('📝 ContentProvider: Editing mode detected, requesting content from parent CMS API');
      
      // Immediately request content from parent CMS API for optimal performance
      requestWebsiteContent();

      const messageHandlers: MessageHandlers = {
        onContentUpdate: (content: WebsiteContent) => {
          console.log('🔄 ContentProvider: Received content update from parent:', {
            hasLanguages: !!content.languages,
            availableLanguages: content.meta?.availableLanguages?.map(l => l.code) || [],
            legacyPages: Object.keys(content.pages || {}).length,
            legacyGlobals: Object.keys(content.globals || {}).length
          });
          setDynamicContent(content);
          setIsLoading(false);
          setError(null);
        },
        onWebsiteContentResponse: (content: WebsiteContent) => {
          console.log('✅ ContentProvider: Received website content response from parent API:', {
            hasLanguages: !!content.languages,
            availableLanguages: content.meta?.availableLanguages?.map(l => l.code) || [],
            legacyPages: Object.keys(content.pages || {}).length,
            legacyGlobals: Object.keys(content.globals || {}).length
          });
          setDynamicContent(content);
          setIsLoading(false);
          setError(null);
        }
      };

      // Setup message listener
      const contentCleanup = setupMessageListener(messageHandlers);

      // Set a timeout to handle cases where parent doesn't respond
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          console.warn('⚠️ ContentProvider: Timeout waiting for parent content, using initialContent fallback');
          setDynamicContent(normalizedInitialContent);
          setIsLoading(false);
          setError('Failed to load content from CMS API, using fallback content');
        }
      }, 5000); // 5 second timeout

      // Return cleanup function
      return () => {
        contentCleanup();
        clearTimeout(timeoutId);
      };
    } else {
      console.log('🏠 ContentProvider: Normal mode, using static initialContent');
      // In normal mode: use initialContent and set loading to false
      setDynamicContent(normalizedInitialContent);
      setIsLoading(false);
      setError(null);
    }
  }, [isEditingMode, normalizedInitialContent, isLoading]);

  // Get active content and filter for current language
  const activeContent = useMemo((): LanguageContent | null => {
    const rawContent = isEditingMode ? dynamicContent : (dynamicContent || normalizedInitialContent);
    
    if (!rawContent) return null;

    // New multi-language structure - filter for current locale
    if (rawContent.languages && rawContent.languages[currentLocale]) {
      console.log('🌐 ContentProvider: Using filtered content for locale:', currentLocale);
      return rawContent.languages[currentLocale];
    }

    // Fallback to legacy structure (backward compatibility)
    if (rawContent.pages || rawContent.globals) {
      console.log('🔄 ContentProvider: Using legacy content structure');
      return {
        pages: rawContent.pages || {},
        globals: rawContent.globals || {},
        meta: rawContent.meta
      };
    }

    console.warn('⚠️ ContentProvider: No content found for locale:', currentLocale);
    return null;
  }, [dynamicContent, normalizedInitialContent, isEditingMode, currentLocale]);

  // Use the modular hooks with filtered content
  const contentQueries = useContentQueries(activeContent);
  const contentBlocks = useContentBlocks();

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    const debugContent = dynamicContent || normalizedInitialContent;
    console.log('🔍 ContentProvider debug:', {
      currentLocale,
      hasRawContent: !!debugContent,
      hasFilteredContent: !!activeContent,
      isEditingMode,
      contentStructure: debugContent?.languages ? 'multi-language' : 'legacy',
      pagesCount: Object.keys(activeContent?.pages || {}).length,
      globalsCount: Object.keys(activeContent?.globals || {}).length
    });
  }

  const contextValue: ContentContextType = {
    content: activeContent,
    isLoading,
    error,
    ...contentQueries,
    ...contentBlocks
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
} 