'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useEditingMode } from '../editing/EditingWrapper';
import { requestWebsiteContent, setupMessageListener, type MessageHandlers } from '../../messaging/content/child/contentMessaging';
import { useContentQueries } from './hooks/useContentQueries';
import { useContentBlocks } from './hooks/useContentBlocks';
import type { ContentContextType, ContentProviderProps } from './types/context';
import type { WebsiteContent } from './types/content';
import type { SupportedLocale } from '../../../system/utils/locale';

// Create the context
export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children, initialContent = null }: ContentProviderProps) {
  const { isEditingMode } = useEditingMode();
  const [dynamicContent, setDynamicContent] = useState<WebsiteContent | null>(initialContent);
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditingMode) {
      console.log('📝 ContentProvider: Editing mode detected, requesting content from parent CMS API');
      
      // Immediately request content from parent CMS API for optimal performance
      requestWebsiteContent();

      const messageHandlers: MessageHandlers = {
        onContentUpdate: (content: WebsiteContent, locale?: string) => {
          console.log('🔄 ContentProvider: Received content update from parent:', {
            pages: Object.keys(content.pages || {}).length,
            globals: Object.keys(content.globals || {}).length,
            locale: locale
          });
          setDynamicContent(content);
          if (locale) {
            setCurrentLocale(locale as SupportedLocale);
            console.log('🌐 ContentProvider: Updated locale from content update:', locale);
          }
          setIsLoading(false);
          setError(null);
        },
        onWebsiteContentResponse: (content: WebsiteContent, locale?: string) => {
          console.log('✅ ContentProvider: Received website content response from parent API:', {
            pages: Object.keys(content.pages || {}).length,
            globals: Object.keys(content.globals || {}).length,
            locale: locale
          });
          setDynamicContent(content);
          if (locale) {
            setCurrentLocale(locale as SupportedLocale);
            console.log('🌐 ContentProvider: Updated locale from website content response:', locale);
          }
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
          setDynamicContent(initialContent);
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
      setDynamicContent(initialContent);
      setIsLoading(false);
      setError(null);
    }
  }, [isEditingMode, initialContent]);

  // Get active content based on mode
  const getActiveContent = () => {
    return isEditingMode ? dynamicContent : (dynamicContent || initialContent);
  };

  const activeContent = getActiveContent();

  // Use the modular hooks
  const contentQueries = useContentQueries(activeContent);
  const contentBlocks = useContentBlocks();

  const contextValue: ContentContextType = {
    content: activeContent,
    currentLocale, // Expose current locale from editing mode
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