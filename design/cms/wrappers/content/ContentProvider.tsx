'use client';

import { createContext, useState, useEffect } from 'react';
import { type AnyWebsiteContent } from './types/content';
import {
  requestWebsiteContent,
  setupMessageListener,
  type MessageHandlers
} from '../../messaging/content/child/contentMessaging';
import { useEditingMode } from '../editing';
import { ContentContextType, ContentProviderProps } from './types/context';
import { useContentQueries } from './hooks/useContentQueries';
import { useContentBlocks } from './hooks/useContentBlocks';
import { useContentQueriesV2 } from './hooks/useContentQueriesV2';

// Create the context
export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children, initialContent = null }: ContentProviderProps) {
  const { isEditingMode } = useEditingMode();
  const [dynamicContent, setDynamicContent] = useState<AnyWebsiteContent | null>(initialContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditingMode) {
      console.log('📝 ContentProvider: Editing mode detected, requesting content from parent CMS API');
      
      // Immediately request content from parent CMS API for optimal performance
      requestWebsiteContent();

      const messageHandlers: MessageHandlers = {
        onContentUpdate: (content: AnyWebsiteContent) => {
          console.log('🔄 ContentProvider: Received content update from parent:', {
            pages: Object.keys(content.pages || {}).length,
            globals: Object.keys(content.globals || {}).length
          });
          setDynamicContent(content);
          setIsLoading(false);
          setError(null);
        },
        onWebsiteContentResponse: (content: AnyWebsiteContent) => {
          console.log('✅ ContentProvider: Received website content response from parent API:', {
            pages: Object.keys(content.pages || {}).length,
            globals: Object.keys(content.globals || {}).length
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
  }, [isEditingMode, initialContent, isLoading]);

  // Get active content based on mode
  const getActiveContent = () => {
    return isEditingMode ? dynamicContent : (dynamicContent || initialContent);
  };

  const activeContent = getActiveContent();

  // Use the modular hooks
  const contentQueries = useContentQueries(activeContent);
  const contentBlocks = useContentBlocks();
  const contentQueriesV2 = useContentQueriesV2(activeContent);

  const contextValue: ContentContextType = {
    content: activeContent,
    isLoading,
    error,
    ...contentQueries,
    ...contentBlocks,
    ...contentQueriesV2
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
} 