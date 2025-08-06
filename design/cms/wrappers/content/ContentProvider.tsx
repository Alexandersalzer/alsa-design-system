'use client';

import { createContext, useState, useEffect } from 'react';
import { type WebsiteContent } from './types/content';
import {
  requestWebsiteContent,
  parseContentFromUrl,
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
  const [dynamicContent, setDynamicContent] = useState<WebsiteContent | null>(initialContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditingMode) {
      // In editing mode: try to get content from URL or listen for CMS messages
      const urlContent = parseContentFromUrl();
      if (urlContent) {
        setDynamicContent(urlContent);
        setIsLoading(false);
        return;
      }

      // If no content in URL, request it from parent CMS
      requestWebsiteContent();

      const messageHandlers: MessageHandlers = {
        onContentUpdate: (content: WebsiteContent) => {
          setDynamicContent(content);
          setIsLoading(false);
        },
        onWebsiteContentResponse: (content: WebsiteContent) => {
          setDynamicContent(content);
          setIsLoading(false);
        }
      };

      // Setup message listener
      const contentCleanup = setupMessageListener(messageHandlers);

      // Return cleanup function
      return () => {
        contentCleanup();
      };
    } else {
      // In normal mode: use initialContent and set loading to false
      setDynamicContent(initialContent);
      setIsLoading(false);
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